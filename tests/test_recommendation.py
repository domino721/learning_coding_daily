from dataclasses import asdict
import json
from pathlib import Path
import pytest
from backend.content import EXERCISES,BY_ID
from backend.curriculum import CONCEPTS,concept_states,select_exercises,review_due

FIXTURES=json.loads(Path('tests/fixtures/recommendation.json').read_text())

def sessions_from(records):
    sessions=[]
    for idx,r in enumerate(records):
        ex=BY_ID[r['id']]
        item={**asdict(ex),'id':ex.id,'status':'revealed' if r.get('essay') else 'correct',
            'response_mode':'essay' if r.get('essay') else 'short','hints_used':r.get('hints',0),'attempts_count':r.get('attempts',1)}
        sessions.append({'id':f's-{idx}','local_day':r['day'],'batch':idx,'items':[item]})
    return sessions

@pytest.mark.parametrize('case',FIXTURES,ids=lambda c:c['name'])
def test_declared_learning_rules(case):
    sessions=sessions_from(case['records']);expected=case['expected'];state=concept_states(sessions,BY_ID)[expected['concept']]
    assert {k:state[k] for k in ('level','independent_count','evidence_days')}=={k:expected[k] for k in ('level','independent_count','evidence_days')}
    selected=select_exercises(EXERCISES,sessions,{},case['day'])
    assert len(selected)==len({e.id for e,_ in selected})==5
    assert [e.id for e,_ in selected]==case['selected']


def test_curriculum_has_explicit_metadata_and_acyclic_prerequisites():
    assert len(EXERCISES)==60
    profiles=json.loads(Path('backend/difficulty.json').read_text())
    assert set(profiles)==set(BY_ID)
    ids={c['id'] for c in CONCEPTS};visited=set()
    def visit(cid,path):
        assert cid in ids and cid not in path
        for req in next(c for c in CONCEPTS if c['id']==cid)['prerequisites']:visit(req,path|{cid})
        visited.add(cid)
    for cid in ids:visit(cid,set())
    assert visited==ids
    for ex in EXERCISES:
        assert ex.concept_id in ids and ex.response_mode in ('choice','short','essay')
        assert ex.difficulty['rationale'] and ex.difficulty['calibration']
        assert 1<=ex.difficulty['reasoning_steps']<=4 and 1<=ex.difficulty['code_load']<=3
        assert 1<=ex.level<=3 and ex.difficulty['level']==ex.level
    assert {ex.response_mode for ex in EXERCISES}=={'choice','short','essay'}
    assert all(sum(e.domain==domain for e in EXERCISES)==count for domain,count in [('pandas',16),('NumPy',11),('SQL',11),('통계',11),('scikit-learn',11)])


def test_initial_mix_and_same_day_repetition_never_unlocks_advanced():
    first=select_exercises(EXERCISES,[],{},'2026-10-20')
    assert [e.id for e,_ in first]==['pandas-select-01','numpy-shape-01','sql-where-01','stats-median-01','ml-split-01']
    assert len({e.domain for e,_ in first})==5
    sessions=sessions_from([{'id':'pandas-select-01','day':'2026-10-20'}]*20)
    assert concept_states(sessions,BY_ID)['pandas-select']['level']==1
    selected=select_exercises(EXERCISES,sessions,{},'2026-10-20',True)
    assert all(e.level<3 for e,_ in selected)


def test_review_intervals_do_not_grow_with_same_day_repeats():
    assert review_due('2026-10-20',{},False)==('2026-10-21',0)
    assert review_due('2026-10-20',{},True)==('2026-10-23',1)
    assert review_due('2026-10-20',{'streak':1,'last_day':'2026-10-19'},True)==('2026-10-27',2)
    assert review_due('2026-10-20',{'streak':2,'last_day':'2026-10-19'},True)==('2026-11-03',3)
    assert review_due('2026-10-20',{'streak':2,'last_day':'2026-10-20','due':'2026-10-27'},True)==('2026-10-27',2)
