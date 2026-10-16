"""Authored curriculum and conservative, deterministic recommendation rules."""
from dataclasses import replace
from datetime import date, timedelta

CONCEPTS = [
    {'id':'pandas-select','name':'행·열 선택','domain':'pandas','prerequisites':[]},
    {'id':'pandas-filter','name':'조건 필터','domain':'pandas','prerequisites':['pandas-select']},
    {'id':'pandas-null','name':'결측치 처리','domain':'pandas','prerequisites':['pandas-select']},
    {'id':'pandas-sort','name':'정렬과 순서','domain':'pandas','prerequisites':['pandas-select']},
    {'id':'pandas-group','name':'그룹 집계','domain':'pandas','prerequisites':['pandas-filter']},
    {'id':'numpy-structure','name':'배열 구조와 축','domain':'NumPy','prerequisites':[]},
    {'id':'numpy-broadcast','name':'브로드캐스팅','domain':'NumPy','prerequisites':['numpy-structure']},
    {'id':'numpy-mask','name':'조건 마스크','domain':'NumPy','prerequisites':['numpy-structure']},
    {'id':'numpy-memory','name':'뷰와 복사','domain':'NumPy','prerequisites':['numpy-structure']},
    {'id':'sql-rows','name':'행 조건과 NULL','domain':'SQL','prerequisites':[]},
    {'id':'sql-aggregation','name':'SQL 집계','domain':'SQL','prerequisites':['sql-rows']},
    {'id':'sql-joins','name':'테이블 연결','domain':'SQL','prerequisites':['sql-rows']},
    {'id':'stats-summaries','name':'대표값과 변동','domain':'통계','prerequisites':[]},
    {'id':'stats-rates','name':'비율과 비교','domain':'통계','prerequisites':['stats-summaries']},
    {'id':'ml-evaluation','name':'학습·평가 분리','domain':'scikit-learn','prerequisites':[]},
    {'id':'ml-preprocessing','name':'전처리 기준','domain':'scikit-learn','prerequisites':['ml-evaluation']},
    {'id':'ml-metrics','name':'모델 평가 지표','domain':'scikit-learn','prerequisites':['ml-evaluation']},
    {'id':'ml-neighbors','name':'이웃 기반 예측','domain':'scikit-learn','prerequisites':['ml-evaluation']},
]
LEVELS = {1:'기초 확인', 2:'적용', 3:'조건 변화·전이'}
ESSAYS = {'numpy-view-03','sql-join-03','stats-conditional-03','ml-leakage-01','ml-leakage-02'}
CHOICES = {'pandas-select-01','numpy-view-01','sql-null-01','ml-metric-01','pandas-group-04','sql-where-02','ml-metric-02','ml-metric-03','stats-ab-02','numpy-broadcast-02'}
RATIONALES = {
'pandas-select':'반환 자료형과 행/열 선택을 구분하고 후속 연산까지 추적한다.',
'pandas-filter':'조건식의 경계 포함 여부와 필터 뒤 남는 원소를 추적한다.',
'pandas-null':'결측 마스크/대체 후 집계 대상과 분모의 변화를 판단한다.',
'pandas-sort':'정렬 기준과 정렬 후 위치 선택의 순서를 추적한다.',
'pandas-group':'그룹 구성·집계 방법·집계 이후 조건을 연결한다.',
'numpy-structure':'축의 길이와 집계/변형 후 남는 배열 구조를 추론한다.',
'numpy-broadcast':'서로 다른 shape를 오른쪽 축부터 맞추어 확장한다.',
'numpy-mask':'원소별 조건과 단계별 인덱싱의 결과를 연결한다.',
'numpy-memory':'인덱싱 종류에 따른 메모리 공유와 변경의 전파를 판단한다.',
'sql-rows':'행 조건의 논리와 NULL의 Unknown 처리를 함께 판단한다.',
'sql-aggregation':'집계 대상·NULL 제외·그룹 이후 조건을 구분한다.',
'sql-joins':'일대다/미연결 행과 조인 이후 집계/조건을 추적한다.',
'stats-summaries':'대푯값의 계산 대상과 변동성의 분모를 구분한다.',
'stats-rates':'비율의 분모와 집단 크기·비교 단위를 구분한다.',
'ml-evaluation':'평가 데이터 분리와 학습 기준 생성 순서의 영향을 판단한다.',
'ml-preprocessing':'학습 기준을 새 입력에 재사용하는 변환 절차를 추적한다.',
'ml-metrics':'실제/예측 양성과 전체 사례 중 지표의 분모를 선택한다.',
'ml-neighbors':'거리·이웃 수·레이블 결정을 순서대로 적용한다.',
}

def concept_id(exercise_id):
    prefix = exercise_id.rsplit('-', 1)[0]
    return {'numpy-shape':'numpy-structure','numpy-axis':'numpy-structure','numpy-view':'numpy-memory',
            'sql-where':'sql-rows','sql-null':'sql-rows','sql-count':'sql-aggregation','sql-having':'sql-aggregation','sql-join':'sql-joins',
            'stats-median':'stats-summaries','stats-std':'stats-summaries','stats-weight':'stats-rates','stats-ab':'stats-rates','stats-conditional':'stats-rates',
            'ml-split':'ml-evaluation','ml-leakage':'ml-evaluation','ml-scale':'ml-preprocessing','ml-metric':'ml-metrics','ml-neighbor':'ml-neighbors'}.get(prefix, prefix)

def attach_metadata(exercises):
    import json
    from pathlib import Path
    authored=json.loads(Path(__file__).with_name('difficulty.json').read_text())
    result=[]
    for ex in exercises:
        profile=dict(authored[ex.id]);cid=profile.pop('concept_id');mode=profile.pop('response_mode')
        result.append(replace(ex,concept_id=cid,response_mode=mode,level=profile['level'],difficulty=profile))
    return result


def observations(sessions, by_id):
    result=[]
    for s in sorted(sessions,key=lambda s:(s['local_day'],s.get('batch',0),s['id'])):
        for item in s['items']:
            if item['status']=='pending' or item['id'] not in by_id:continue
            source=by_id[item['id']]
            mode=item.get('response_mode') or ('choice' if item.get('kind')=='choice' else 'short')
            result.append({'day':s['local_day'],'id':item['id'],'concept':source.concept_id,
                'level':item.get('level',source.level), 'essay':mode=='essay',
                'independent':item['status']=='correct' and item['hints_used']==0 and item['attempts_count']==1 and mode!='essay'})
    return result

def concept_states(sessions, by_id):
    obs=observations(sessions,by_id);result={}
    for concept in CONCEPTS:
        daily={}
        for o in obs:
            if o['concept']==concept['id'] and not o['essay']:daily.setdefault(o['day'],o)
        rows=list(daily.values()); good=[o for o in rows if o['independent']]
        distinct=len({o['id'] for o in good}); days=len(good)
        level=3 if distinct>=3 and days>=3 and sum(o['level']>=2 for o in good)>=2 else 2 if distinct>=2 and days>=2 else 1
        if len(rows)>=2 and all(not o['independent'] for o in rows[-2:]):level=max(1,level-1)
        result[concept['id']]={**concept,'level':level,'label':LEVELS[level],
            'independent_count':distinct,'evidence_days':days,'observed_count':len(rows),
            'ready_for_probe':bool(rows and rows[-1]['independent'] and days>=2),
            'status':'관찰 중' if days<2 or distinct<2 else '적용 연습 중' if level==2 else '전이 연습 중' if level==3 else '기초 보완 중'}
    return result

def in_track(ex, track):
    return (ex.domain == 'SQL') if track == 'sql' else (ex.domain != 'SQL') if track == 'python' else True


def select_exercises(exercises, sessions, progress, today, extra=False, track=None):
    by_id={ex.id:ex for ex in exercises};states=concept_states(sessions,by_id)
    exercises=[ex for ex in exercises if ex.response_mode != 'essay' and in_track(ex,track)]
    done_today={i['id'] for s in sessions if s['local_day']==today for i in s['items']}
    def eligible(ex):
        state=states[ex.concept_id]
        prereq=all(states[c]['independent_count']>0 for c in state['prerequisites'])
        # One independent foundation result permits a level-2 probe, not a mastery claim.
        limit=3 if state['level']>=2 or state['ready_for_probe'] else 2 if state['independent_count']>0 else 1
        minimum=min(x.level for x in exercises if x.concept_id==ex.concept_id)
        return prereq and ex.level<=max(minimum,limit)
    due=sorted([ex for ex in exercises if ex.id in progress and progress[ex.id].get('due',progress[ex.id].get('due_day','9999'))<=today and ex.id not in done_today and eligible(ex)],
               key=lambda ex:(progress[ex.id].get('due',progress[ex.id].get('due_day')),exercises.index(ex)))
    selected=[] if extra else [(ex,'review') for ex in due[:3]]
    counts={c['domain']:0 for c in CONCEPTS}
    for ex,_ in selected:counts[ex.domain]+=1
    pool=[ex for ex in exercises if ex.id not in progress and ex.id not in done_today and eligible(ex)]
    while pool and len(selected)<5:
        ex=min(pool,key=lambda ex:(counts[ex.domain],ex.level,exercises.index(ex)))
        selected.append((ex,'new'));counts[ex.domain]+=1;pool.remove(ex)
        if ex.level==3:pool=[candidate for candidate in pool if candidate.level<3]
    if extra:
        for ex in due:
            if len(selected)>=5:break
            if ex.id not in {x.id for x,_ in selected}:selected.append((ex,'review'))
    return selected

def review_due(today, prior, independent):
    streak=0 if not independent else prior.get('streak',0)+(prior.get('last_day')!=today)
    gap=1 if not independent else 3 if streak<=1 else 7 if streak==2 else 14
    due=(date.fromisoformat(today)+timedelta(days=gap)).isoformat()
    if independent and prior.get('last_day')==today:due=prior.get('due',prior.get('due_day',due))
    return due, streak
