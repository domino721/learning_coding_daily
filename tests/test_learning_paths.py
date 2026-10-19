from copy import deepcopy
from dataclasses import asdict
from datetime import date
import hashlib
import json
from pathlib import Path
import subprocess

import pytest

from backend.content import BY_ID, EXERCISES
from backend.curriculum import (LEARNING_PATHS, concept_states, observations,
                                recommendation_trace, review_due, select_exercises,
                                validate_learning_paths)

CASES = json.loads(Path('tests/fixtures/learning-paths.json').read_text())


def history(sample):
    sessions=[];progress={}
    for index,record in enumerate(sample['records']):
        ex=BY_ID[record['id']];status=record.get('status','correct')
        item={**asdict(ex),'status':status,'version':record.get('version',ex.version),
              'hints_used':record.get('hints',0),'attempts_count':record.get('attempts',1),'active_seconds':0}
        sessions.append({'id':f's-{index}','track_id':sample['track'],'local_day':record['day'],'batch':index,'items':[item]})
        independent=status=='correct' and not item['hints_used'] and item['attempts_count']==1
        due,streak=review_due(record['day'],progress.get(ex.id,{}),independent)
        progress[ex.id]={'due':due,'streak':streak,'last_day':record['day'],'completed':1}
    return sessions,progress


@pytest.mark.parametrize('sample',CASES,ids=lambda sample:sample['name'])
def test_curriculum_routes_to_foundation_then_original_target(sample):
    sessions,progress=history(sample)
    selected=select_exercises(EXERCISES,sessions,progress,sample['day'],track=sample['track'])
    ids=[ex.id for ex,_ in selected]
    assert ids[0]==sample['first']
    assert not set(ids)&set(sample['excluded'])
    assert len(ids)==len(set(ids))<=5


def test_same_histories_produce_identical_browser_and_server_decisions():
    browser=json.loads(subprocess.check_output(['node','--experimental-strip-types','scripts/replay-learning.ts','tests/fixtures/learning-paths.json'],text=True))
    for sample,actual in zip(CASES,browser,strict=True):
        sessions,progress=history(sample)
        selected=select_exercises(EXERCISES,sessions,progress,sample['day'],track=sample['track'])
        expected={'name':sample['name'],'states':list(concept_states(sessions,BY_ID).values()),
                  'selected':[[ex.id,category] for ex,category in selected],
                  'trace':recommendation_trace(selected,sessions,BY_ID)}
        assert actual==expected


def test_publishing_requires_every_target_to_have_an_acyclic_reviewed_path():
    validate_learning_paths(EXERCISES)
    original=deepcopy(LEARNING_PATHS['items'])
    try:
        del LEARNING_PATHS['items']['ml-scale-01']
        with pytest.raises(ValueError,match='Every exercise'):validate_learning_paths(EXERCISES)
        LEARNING_PATHS['items']=deepcopy(original)
        LEARNING_PATHS['items']['ml-fit-foundation-01']['requires']=['ml-scale-01']
        with pytest.raises(ValueError,match='cycle'):validate_learning_paths(EXERCISES)
        LEARNING_PATHS['items']=deepcopy(original)
        LEARNING_PATHS['items']['ml-scale-01']['review_status']='draft'
        with pytest.raises(ValueError,match='Unreviewed'):validate_learning_paths(EXERCISES)
    finally:
        LEARNING_PATHS['items']=original


def test_all_previously_deployed_exercises_and_versions_are_unchanged():
    saved=json.loads(Path('tests/fixtures/catalog-before-learning-paths.json').read_text())
    for identifier,digest in saved['exercises'].items():
        value=json.dumps(asdict(BY_ID[identifier]),ensure_ascii=False,sort_keys=True,separators=(',',':'))
        assert hashlib.sha256(value.encode()).hexdigest()==digest,identifier


def test_help_after_first_daily_success_is_still_seen_and_duplicates_do_not_promote():
    sample={'track':'python','records':[{'id':'pandas-select-01','day':'2026-10-17'},
         {'id':'pandas-select-02','day':'2026-10-17','hints':1}]}
    sessions,_=history(sample)
    state=concept_states(sessions,BY_ID)['pandas-select']
    assert state['needs_support'] and state['level']==1
    assert observations(sessions+sessions,BY_ID)==observations(sessions,BY_ID)
    sessions[0]['items'][0]['version']-=1
    assert not any(o['id']=='pandas-select-01' for o in observations(sessions,BY_ID))


def test_three_day_promotion_requires_families_retention_and_no_unresolved_support():
    records=[{'id':'pandas-select-01','day':'2026-10-15'},
             {'id':'pandas-select-scaffold-02','day':'2026-10-16'},
             {'id':'pandas-select-03','day':'2026-10-17'}]
    sample={'track':'python','records':records}
    sessions,_=history(sample)
    assert concept_states(sessions,BY_ID)['pandas-select']['level']==2
    sample['records']=records+[{'id':'pandas-select-01','day':'2026-10-18'}]
    sessions,_=history(sample)
    assert concept_states(sessions,BY_ID)['pandas-select']['level']==3
    sample['records'].append({'id':'pandas-select-02','day':'2026-10-18','hints':1})
    sessions,_=history(sample)
    state=concept_states(sessions,BY_ID)['pandas-select']
    assert state['level']==2 and state['needs_support']
    for session in sessions:
        session['items'][0]['active_seconds']=6000
    assert concept_states(sessions,BY_ID)['pandas-select']==state


def test_server_persists_recommendation_basis_and_resumes_it(tmp_path):
    from datetime import datetime, timezone
    from fastapi.testclient import TestClient
    from backend.main import create_app
    path=tmp_path/'trace.sqlite3'
    with TestClient(create_app(path,now=lambda:datetime(2026,10,18,tzinfo=timezone.utc))) as client:
        session=client.post('/api/sessions/today',json={'track_id':'python'}).json()
        trace=session['recommendation']
        assert trace['algorithm_version']==LEARNING_PATHS['version']
        assert [item['id'] for item in trace['items']]==[item['id'] for item in session['items']]
        backup=client.get('/api/backup').json()
        saved=next(event for event in backup['events'] if event['kind']=='session_started')
        assert json.loads(saved['detail'])==trace
    with TestClient(create_app(path,now=lambda:datetime(2026,10,18,tzinfo=timezone.utc))) as restarted:
        resumed=restarted.get(f"/api/sessions/{session['id']}").json()
        assert resumed['recommendation']==trace


def test_day2_probes_unlocked_application_before_redundant_foundations_and_reaches_level3():
    from datetime import timedelta
    day1=[{'id':'pandas-select-01','day':'2026-10-18'},{'id':'numpy-shape-01','day':'2026-10-18'},
          {'id':'stats-median-01','day':'2026-10-18'},{'id':'ml-split-01','day':'2026-10-18'},
          {'id':'numpy-axis-01','day':'2026-10-18'}]
    sessions,progress=history({'track':'python','records':day1})
    day2=select_exercises(EXERCISES,sessions,progress,'2026-10-19',track='python')
    assert sum(ex.level==2 for ex,_ in day2)>=4
    assert not ({ex.id for ex,_ in day2}&{'pandas-select-02','pandas-select-scaffold-01','stats-summary-foundation-02','ml-eval-foundation-02'})
    for track in ('python','sql'):
        track_sessions=[];track_progress={};start=date(2026,10,18)
        for offset in range(60):
            day=(start+timedelta(days=offset)).isoformat()
            selected=select_exercises(EXERCISES,track_sessions,track_progress,day,track=track)
            items=[]
            for ex,_ in selected:
                items.append({**asdict(ex),'status':'correct','hints_used':0,'attempts_count':1})
                due,streak=review_due(day,track_progress.get(ex.id,{}),True)
                track_progress[ex.id]={'due':due,'streak':streak,'last_day':day,'completed':1}
            if items:
                track_sessions.append({'id':f'{track}-{offset}','track_id':track,'local_day':day,'batch':0,'items':items})
        states=concept_states(track_sessions,BY_ID)
        assert all(v['level']==3 for v in states.values() if (v['domain']=='SQL')==(track=='sql'))
