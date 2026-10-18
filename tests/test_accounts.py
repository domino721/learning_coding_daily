from copy import deepcopy
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from backend.main import create_app


@pytest.fixture
def account_client(tmp_path):
    with TestClient(create_app(tmp_path/'local.sqlite3',require_auth=True,accounts_dir=tmp_path/'accounts')) as c:
        yield c


def credentials(username='learner-a'):
    return {'username':username,'password':'a-long-password-123'}


def token(c,name='learner-a'):
    r=c.post('/api/auth/register',json=credentials(name))
    assert r.status_code==200,r.text
    return r.json()


def headers(t):return {'Authorization':'Bearer '+t['token']}


def test_identity_isolation_revocation_and_no_anonymous_records(account_client):
    c=account_client
    for path in ['/api/dashboard','/api/backup','/api/history']:
        assert c.get(path).status_code==401
    a,b=token(c),token(c,'learner-b')
    sa=c.post('/api/sessions/today',json={},headers=headers(a)).json()
    sb=c.post('/api/sessions/today',json={},headers=headers(b)).json()
    assert sa['id']!=sb['id']
    assert c.get('/api/sessions/'+sa['id'],headers=headers(b)).status_code==404
    assert c.post('/api/auth/logout',json={},headers=headers(a)).status_code==200
    assert c.get('/api/backup',headers=headers(a)).status_code==401


def test_recovery_revokes_tokens_and_deletion_keeps_other_user(account_client):
    c=account_client;a,b=token(c),token(c,'learner-b')
    body={**credentials(),'password':'a-new-password-456','recovery_code':a['recovery_code']}
    r=c.post('/api/auth/recover',json=body);assert r.status_code==200,r.text
    newer=r.json()
    assert c.get('/api/backup',headers=headers(a)).status_code==401
    assert c.post('/api/auth/recover',json=body).status_code==401
    assert c.post('/api/auth/delete',json={'password':body['password']},headers=headers(newer)).status_code==200
    assert c.get('/api/backup',headers=headers(newer)).status_code==401
    assert c.get('/api/backup',headers=headers(b)).status_code==200


def test_sync_is_idempotent_and_conflict_rolls_back(account_client,tmp_path):
    c=account_client;a=token(c)
    with TestClient(create_app(tmp_path/'personal.sqlite3')) as local:
        s=local.post('/api/sessions/today',json={}).json()
        backup=local.get('/api/backup').json()
    for _ in range(2):
        r=c.post('/api/sync',json={'data':backup,'confirm_owner':True},headers=headers(a))
        assert r.status_code==200,r.text
        assert len(r.json()['sessions'])==1
    bad=deepcopy(backup);bad['sessions'][0]['local_day']='2020-01-01'
    assert c.post('/api/sync',json={'data':bad,'confirm_owner':True},headers=headers(a)).status_code==422
    assert c.get('/api/history',headers=headers(a)).json()['sessions'][0]['local_day']==s['local_day']


def test_login_password_policy_and_rate_limit(account_client):
    c=account_client
    assert c.post('/api/auth/register',json={'username':'learner','password':'short'}).status_code==422
    for _ in range(15):c.post('/api/auth/login',json=credentials())
    assert c.post('/api/auth/login',json=credentials()).status_code==429
