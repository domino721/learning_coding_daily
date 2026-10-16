from dataclasses import replace
from datetime import datetime,timezone
from pathlib import Path
from uuid import uuid4
import sqlite3
import pytest
from fastapi.testclient import TestClient
from backend.main import create_app
from backend.content import BY_ID

NOW=datetime(2026,10,20,3,tzinfo=timezone.utc)

def client_at(path):return TestClient(create_app(path,now=lambda:NOW))
def submit(client,s,item,value):return client.post(f"/api/sessions/{s['id']}/answers",json={'exercise_id':item['id'],'answer':value,'attempt_id':str(uuid4()),'active_seconds':12})

def test_snapshots_drafts_and_full_history_survive_content_updates(tmp_path,monkeypatch):
    path=tmp_path/'records.sqlite3'
    with client_at(path) as client:
        s=client.post('/api/sessions/today',json={}).json();first,second,*_=s['items']
        assert submit(client,s,first,BY_ID[first['id']].answer).json()['correct'] is True
        client.post(f"/api/sessions/{s['id']}/draft",json={'exercise_id':second['id'],'draft':'작성하던 답안'})
        old=BY_ID[first['id']];monkeypatch.setitem(BY_ID,first['id'],replace(old,title='업데이트된 제목',answer='새 정답'))
        restored=client.get(f"/api/sessions/{s['id']}").json()
        assert restored['items'][0]['title']==first['title'] and restored['items'][0]['answer']==old.answer
        assert restored['items'][1]['draft']=='작성하던 답안'
        history=client.get('/api/history').json()
        assert sum(s['completed_count'] for s in history['sessions'])==1
        assert {e['kind'] for e in history['events']} >= {'session_started','attempt','completed'}
        assert all(e['occurred_at'] for e in history['events'])
        assert client.get('/api/dashboard').json()['all_time_completed_count']==1
    with client_at(path) as restarted:
        assert restarted.get('/api/backup').json()['sessions'][0]['items'][1]['draft']=='작성하던 답안'


def test_backup_round_trip_is_idempotent_and_bad_import_rolls_back(tmp_path):
    with client_at(tmp_path/'original.sqlite3') as first:
        s=first.post('/api/sessions/today',json={}).json()
        submit(first,s,s['items'][0],BY_ID[s['items'][0]['id']].answer)
        backup=first.get('/api/backup').json()
    with client_at(tmp_path/'restored.sqlite3') as second:
        assert second.post('/api/restore',json={'data':backup}).status_code==200
        assert second.post('/api/restore',json={'data':backup}).status_code==200
        restored=second.get('/api/backup').json()
        assert restored['learner_id']==backup['learner_id']
        assert len(restored['sessions'])==1 and len(restored['attempts'])==1
        assert restored['sessions'][0]['items']==backup['sessions'][0]['items']
        assert restored['progress']==backup['progress']
        bad={**backup,'version':99}
        assert second.post('/api/restore',json={'data':bad}).status_code==422
        bad={**backup,'sessions':[{**backup['sessions'][0],'completed_count':4}]}
        assert second.post('/api/restore',json={'data':bad}).status_code==422
        after=second.get('/api/backup').json()
        assert after['sessions']==restored['sessions'] and after['attempts']==restored['attempts']
        assert after['events']==restored['events']


def test_different_learner_confirmation_and_conflicting_answer_are_safe(tmp_path):
    with client_at(tmp_path/'a.sqlite3') as a, client_at(tmp_path/'b.sqlite3') as b:
        sa=a.post('/api/sessions/today',json={}).json();sb=b.post('/api/sessions/today',json={}).json()
        submit(a,sa,sa['items'][0],BY_ID[sa['items'][0]['id']].answer)
        submit(b,sb,sb['items'][0],BY_ID[sb['items'][0]['id']].answer)
        backup=a.get('/api/backup').json()
        assert b.post('/api/restore',json={'data':backup}).status_code==422
        assert b.post('/api/restore',json={'data':backup,'confirm_owner':True}).status_code==200
        merged=b.get('/api/backup').json()
        assert len(merged['sessions'])==2 and [s['batch'] for s in merged['sessions']]==[0,1]
        assert merged['progress'][sa['items'][0]['id']]['completed']==2
        before=b.get('/api/dashboard').json()['all_time_completed_count']
        backup['sessions'][0]['items'][0]['last_answer']='충돌하는 답안'
        assert b.post('/api/restore',json={'data':backup,'confirm_owner':True}).status_code==422
        assert b.get('/api/dashboard').json()['all_time_completed_count']==before


def test_sqlite_v3_automatic_backup_and_upgrade(tmp_path):
    path=tmp_path/'legacy.sqlite3'
    with client_at(path) as client:
        s=client.post('/api/sessions/today',json={}).json();item=s['items'][0]
        wrong=next(c for c in item['choices'] if c!=BY_ID[item['id']].answer)
        assert submit(client,s,item,wrong).json()['correct'] is False
    with sqlite3.connect(path) as db:
        for column in ('snapshot','draft','completed_at'):db.execute('ALTER TABLE session_items DROP COLUMN '+column)
        db.execute('ALTER TABLE attempts DROP COLUMN response_mode');db.execute('ALTER TABLE progress DROP COLUMN streak')
        db.execute('DROP TABLE learning_events');db.execute('DROP TABLE metadata');db.execute('PRAGMA user_version=3')
    with client_at(path) as client:
        restored=client.post('/api/sessions/today',json={}).json()
        assert restored['id']==s['id'] and restored['items'][0]['last_answer']==wrong
        assert restored['items'][0]['attempts_count']==1
    assert path.with_name(path.name+'.schema-v3.backup').exists()
    with sqlite3.connect(path.with_name(path.name+'.schema-v3.backup')) as backup:
        assert backup.execute('PRAGMA user_version').fetchone()[0]==3
        assert backup.execute('SELECT count(*) FROM attempts').fetchone()[0]==1


def test_invalid_snapshot_or_record_key_cannot_replace_live_records(tmp_path):
    with client_at(tmp_path/'live.sqlite3') as client:
        s=client.post('/api/sessions/today',json={}).json()
        backup=client.get('/api/backup').json()
        key=next(iter(backup['catalog']));backup['catalog'][key]['answer']=['bad type']
        assert client.post('/api/restore',json={'data':backup}).status_code==422
        assert client.get(f"/api/sessions/{s['id']}").json()['items']==s['items']
