import importlib.util
from pathlib import Path
import sqlite3
from fastapi.testclient import TestClient
from backend.main import create_app


def test_account_backup_restores_records_but_revokes_sessions(tmp_path):
    spec=importlib.util.spec_from_file_location('account_backup',Path('scripts/account-backup.py'))
    mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
    source=tmp_path/'accounts'
    app=create_app(tmp_path/'local.sqlite3',require_auth=True,accounts_dir=source)
    with TestClient(app) as c:
        auth=c.post('/api/auth/register',json={'username':'backup-user','password':'long-secret-123456'}).json()
        header={'Authorization':'Bearer '+auth['token']}
        session=c.post('/api/sessions/today',json={},headers=header).json()
    backup=tmp_path/'backup';restored=tmp_path/'restored'
    mod.run(source,backup);mod.run(backup,restored,True)
    with sqlite3.connect(restored/'accounts.sqlite3') as db:assert db.execute('SELECT count(*) FROM tokens').fetchone()[0]==0
    with TestClient(create_app(tmp_path/'other.sqlite3',require_auth=True,accounts_dir=restored)) as c:
        auth=c.post('/api/auth/login',json={'username':'backup-user','password':'long-secret-123456'}).json()
        header={'Authorization':'Bearer '+auth['token']}
        assert c.get('/api/history',headers=header).json()['sessions'][0]['id']==session['id']
