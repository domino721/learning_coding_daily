"""Authored curriculum and conservative, deterministic recommendation rules."""
from dataclasses import replace
from datetime import date, timedelta
import json
from pathlib import Path

LEARNING_PATHS = json.loads(Path(__file__).with_name('learning_paths.json').read_text())

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
    # CR-017: the Python 기초 track (domain Python) and three more SQL concepts.
    {'id':'py-values','name':'값과 연산자','domain':'Python','prerequisites':[]},
    {'id':'py-str','name':'문자열','domain':'Python','prerequisites':[]},
    {'id':'py-list','name':'리스트','domain':'Python','prerequisites':[]},
    {'id':'py-control','name':'조건과 반복','domain':'Python','prerequisites':['py-values']},
    {'id':'py-tuple','name':'튜플과 언패킹','domain':'Python','prerequisites':['py-list']},
    {'id':'py-dict','name':'딕셔너리','domain':'Python','prerequisites':['py-tuple']},
    {'id':'py-set','name':'집합','domain':'Python','prerequisites':['py-list']},
    {'id':'py-func','name':'함수와 인자','domain':'Python','prerequisites':['py-control']},
    {'id':'py-star','name':'*와 ** 펼치기','domain':'Python','prerequisites':['py-func','py-tuple']},
    {'id':'py-decorator','name':'데코레이터 @','domain':'Python','prerequisites':['py-star']},
    {'id':'sql-functions','name':'문자열·날짜 함수','domain':'SQL','prerequisites':['sql-rows']},
    {'id':'sql-windows','name':'윈도 함수','domain':'SQL','prerequisites':['sql-aggregation']},
    {'id':'sql-modify','name':'데이터 변경과 제약','domain':'SQL','prerequisites':['sql-rows']},
    # CR-018: the second Python 기초 batch.
    {'id':'py-class','name':'클래스와 객체','domain':'Python','prerequisites':['py-func']},
    {'id':'py-class-deco','name':'@property와 @dataclass','domain':'Python','prerequisites':['py-class','py-decorator']},
    {'id':'py-error','name':'예외와 트레이스백','domain':'Python','prerequisites':['py-func']},
    {'id':'py-iter','name':'반복자와 생성기','domain':'Python','prerequisites':['py-control']},
    # CR-019: the 터미널·Git track (domains 터미널 and Git), from paths to remotes.
    {'id':'sh-path','name':'위치와 경로','domain':'터미널','prerequisites':[]},
    {'id':'sh-words','name':'띄어쓰기·따옴표·*','domain':'터미널','prerequisites':[]},
    {'id':'sh-files','name':'파일과 폴더 다루기','domain':'터미널','prerequisites':['sh-path']},
    {'id':'sh-redirect','name':'출력 저장과 파이프','domain':'터미널','prerequisites':['sh-files','sh-words']},
    {'id':'sh-chain','name':'종료 코드와 명령 연결','domain':'터미널','prerequisites':['sh-files']},
    {'id':'sh-env','name':'환경 변수와 PATH','domain':'터미널','prerequisites':['sh-words']},
    {'id':'sh-script','name':'스크립트 실행','domain':'터미널','prerequisites':['sh-chain','sh-env']},
    {'id':'sh-python','name':'Python 실행 환경','domain':'터미널','prerequisites':['sh-files','sh-script']},
    {'id':'sh-windows','name':'Windows에서 같은 일 하기','domain':'터미널','prerequisites':['sh-python']},
    {'id':'git-status','name':'저장소와 상태','domain':'Git','prerequisites':['sh-redirect']},
    {'id':'git-commit','name':'커밋과 기록','domain':'Git','prerequisites':['git-status']},
    {'id':'git-diff','name':'바뀐 내용(diff) 읽기','domain':'Git','prerequisites':['git-status']},
    {'id':'git-undo','name':'되돌리기','domain':'Git','prerequisites':['git-commit','git-diff']},
    {'id':'git-branch','name':'브랜치와 병합','domain':'Git','prerequisites':['git-commit']},
    {'id':'git-remote','name':'원격 저장소와 .gitignore','domain':'Git','prerequisites':['git-commit']},
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
'py-values':'연산자가 돌려주는 값과 자료형, 참·거짓 판단을 구분한다.',
'py-str':'인덱스·슬라이스 범위와 문자열 메서드가 새 값을 돌려준다는 점을 추적한다.',
'py-list':'제자리 변경과 새 리스트 반환, 같은 리스트를 가리키는 이름을 구분한다.',
'py-control':'분기가 실행되는 조건과 반복 중 변수 상태의 변화를 추적한다.',
'py-tuple':'쉼표가 만드는 튜플과 값을 나누어 받는 대입 순서를 판단한다.',
'py-dict':'키 조회·갱신 규칙과 키별 누적 결과를 추적한다.',
'py-set':'중복 없는 원소와 순서 없는 결과, 집합 연산의 방향을 구분한다.',
'py-func':'반환값·인자 전달·기본값이 만들어지는 시점과 지역 이름을 구분한다.',
'py-star':'*·**가 값을 모으는지 펼치는지 위치에 따라 판단한다.',
'py-decorator':'@가 정의 시점에 함수를 감싸 다시 대입하는 순서와 전달 과정을 추적한다.',
'sql-functions':'함수가 돌려주는 값과 문자열로 저장된 날짜·숫자의 비교 규칙을 구분한다.',
'sql-windows':'행을 줄이지 않고 구간·순서 안에서 계산되는 값과 동점 처리를 추적한다.',
'sql-modify':'변경 대상 행·제약 위반·트랜잭션 결과를 실행 후 상태로 판단한다.',
'py-class':'객체마다 따로 갖는 속성과 클래스가 함께 쓰는 속성, 상속된 메서드의 호출 순서를 추적한다.',
'py-class-deco':'@property·@classmethod·@dataclass가 만들어 주는 메서드와 그 실행 시점을 판단한다.',
'py-error':'예외의 종류와 except·finally의 실행 순서, 오류가 난 줄과 원인 줄을 구분한다.',
'py-iter':'반복자가 값을 한 번씩만 꺼내 주고 생성기가 필요할 때만 실행된다는 점을 추적한다.',
'sh-path':'지금 위치를 기준으로 상대 경로가 풀리고 ~·..·/로 시작하는 경로가 가리키는 곳을 추적한다.',
'sh-words':'셸이 띄어쓰기로 단어를 나누고 따옴표와 *를 명령보다 먼저 처리한다는 점을 판단한다.',
'sh-files':'만들기·복사·이동·삭제가 남기는 파일과 덮어쓰기·되돌릴 수 없는 삭제를 추적한다.',
'sh-redirect':'>·>>·|·2>가 출력을 어디로 보내는지와 파일이 비워지는 시점을 추적한다.',
'sh-chain':'명령의 성공·실패(종료 코드)에 따라 &&·||·; 뒤의 명령이 실행되는지 판단한다.',
'sh-env':'변수가 펼쳐지는 시점과 export 여부, PATH 순서가 실행되는 프로그램을 정하는 과정을 추적한다.',
'sh-script':'스크립트를 bash·./·source로 실행할 때 권한·인자·현재 셸에 남는 변화가 어떻게 다른지 판단한다.',
'sh-python':'실행 위치·가상환경·모듈 경로·인자가 Python 프로그램이 찾는 파일과 패키지를 바꾸는 과정을 추적한다.',
'sh-windows':'macOS·Linux 명령을 Windows PowerShell의 경로·환경 변수·활성화 방식으로 옮길 때 달라지는 부분을 구분한다.',
'git-status':'파일이 추적 전·수정됨·스테이지됨 중 어디에 있는지 git status 표시로 판단한다.',
'git-commit':'커밋에 들어가는 것은 스테이지된 내용뿐이며 기록이 최신순으로 쌓이는 과정을 추적한다.',
'git-diff':'diff의 -·+·문맥 줄과 @@ 범위를 읽어 바뀐 뒤의 파일과 비교 대상을 판단한다.',
'git-undo':'되돌리기 명령마다 작업 폴더·스테이지·기록 중 무엇이 바뀌고 무엇이 사라지는지 구분한다.',
'git-branch':'브랜치마다 따로 쌓이는 커밋과 병합·충돌 표시가 만드는 파일 내용을 추적한다.',
'git-remote':'clone·push·pull이 주고받는 커밋과 .gitignore가 무시하는 파일·이미 추적 중인 파일을 구분한다.',
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


def task_form(ex):
    """What the learner is asked to do. Items authored before task forms are read from the code."""
    return LEARNING_PATHS['items'][ex.id].get('task_form') or ('fill-blank' if '____' in ex.code else 'output')


def observations(sessions, by_id):
    result=[];seen=set()
    for s in sorted(sessions,key=lambda s:(s['local_day'],s.get('batch',0),s['id'])):
        for item in s['items']:
            if item['status']=='pending' or item['id'] not in by_id:continue
            source=by_id[item['id']]
            if item.get('version',source.version)!=source.version:continue
            key=(s['id'],item['id'],source.version)
            if key in seen:continue
            seen.add(key)
            mode=item.get('response_mode') or ('choice' if item.get('kind')=='choice' else 'short')
            result.append({'day':s['local_day'],'id':item['id'],'concept':source.concept_id,
                'level':item.get('level',source.level), 'essay':mode=='essay',
                'family':LEARNING_PATHS['items'][source.id]['family'],
                'independent':item['status']=='correct' and item['hints_used']==0 and item['attempts_count']==1 and mode!='essay'})
    return result

def concept_states(sessions, by_id):
    obs=observations(sessions,by_id);result={}
    for concept in CONCEPTS:
        daily={}
        for o in obs:
            if o['concept']==concept['id'] and not o['essay']:
                previous=daily.get(o['day'])
                if previous is None or (not previous['independent'] and o['independent']):daily[o['day']]=o
        rows=list(daily.values()); good=[o for o in rows if o['independent']]
        distinct=len({o['id'] for o in good}); days=len(good)
        all_rows=[o for o in obs if o['concept']==concept['id'] and not o['essay']]
        all_good=[o for o in all_rows if o['independent']]
        distinct=len({o['id'] for o in all_good});days=len({o['day'] for o in all_good})
        families=len({o['family'] for o in all_good})
        first={};retained=False
        for o in all_good:
            if o['day']>first.setdefault(o['id'],o['day']):retained=True
        support=max((i for i,o in enumerate(all_rows) if not o['independent']),default=-1)
        needs_support=support>=0 and len({o['id'] for o in all_rows[support+1:] if o['independent']})<LEARNING_PATHS['rules']['recovery_items']
        rules=LEARNING_PATHS['rules']
        transfer_days=len({o['day'] for o in all_good if o['level']>=2})
        level=3 if distinct>=rules['level3_items'] and days>=rules['level3_days'] and transfer_days>=rules['level3_transfer_days'] and families>=3 and retained and not needs_support else 2 if distinct>=rules['level2_items'] and days>=rules['level2_days'] and families>=2 else 1
        result[concept['id']]={**concept,'level':level,'label':LEVELS[level],
            'independent_count':distinct,'evidence_days':days,'observed_count':len(rows),
            'family_count':families,'retention_observed':retained,'needs_support':needs_support,
            # Level of the item that last needed help; support practice steps one level below it.
            'support_level':all_rows[support]['level'] if needs_support else 0,
            'evidence_status':'unassessed' if not all_rows else 'observed',
            'ready_for_probe':bool(rows and rows[-1]['independent'] and days>=2),
            'status':'기초 보완 중' if needs_support else '진단 전' if not all_rows else '관찰 중' if days<2 or distinct<2 else '적용 연습 중' if level==2 else '전이 연습 중' if level==3 else '기초 확인 중'}
    return result

TERMINAL_DOMAINS = ('터미널', 'Git')


def in_track(ex, track):
    # Python 기초 (domain Python) and 터미널·Git items form their own tracks and never enter data-analysis sessions.
    if track == 'sql':
        return ex.domain == 'SQL'
    if track == 'python':
        return ex.domain not in ('SQL', 'Python', *TERMINAL_DOMAINS)
    if track == 'python-basics':
        return ex.domain == 'Python'
    if track == 'terminal-git':
        return ex.domain in TERMINAL_DOMAINS
    return True


def select_exercises(exercises, sessions, progress, today, extra=False, track=None):
    sessions=[s for s in sessions if s['local_day']<=today]
    by_id={ex.id:ex for ex in exercises};states=concept_states(sessions,by_id)
    obs=observations(sessions,by_id)
    latest={o['id']:o for o in obs if not o['essay']}
    obs_today={o['concept'] for o in obs if o['day']==today and o['independent']}
    solved_families={}
    for o in obs:
        if o['independent']:solved_families.setdefault(o['concept'],set()).add(o['family'])
    def known(identifier):
        if identifier in latest and latest[identifier]['independent']:return True
        cid=LEARNING_PATHS['items'][identifier]['concept_id']
        state=states[cid]
        return state['level']>=2 and not state['needs_support']
    exercises=[ex for ex in exercises if ex.response_mode != 'essay' and in_track(ex,track)]
    done_today={i['id'] for s in sessions if s['local_day']==today for i in s['items']}
    def eligible(ex):
        state=states[ex.concept_id]
        prereq=all(states[c]['independent_count']>0 for c in state['prerequisites'])
        # One independent foundation result permits a level-2 probe, not a mastery claim.
        limit=max(1,state['support_level']-1) if state['needs_support'] else 3 if state['level']>=2 else 2 if state['independent_count']>0 else 1
        return prereq and ex.level<=limit and all(known(key) for key in LEARNING_PATHS['items'][ex.id]['requires'])
    # Solved independently on enough different days in a row: the item leaves the review queue,
    # unless its concept is in support and still needs independent results to recover.
    graduated=lambda ex:(progress[ex.id].get('streak') or 0)>=LEARNING_PATHS['review']['graduate_streak'] and not states[ex.concept_id]['needs_support']
    due=sorted([ex for ex in exercises if ex.id in progress and progress[ex.id].get('due',progress[ex.id].get('due_day','9999'))<=today and not graduated(ex) and ex.id not in done_today and eligible(ex)],
               # A wrong or helped item is retried before scheduled checks of solved items.
               key=lambda ex:(1 if progress[ex.id].get('streak') else 0,progress[ex.id].get('due',progress[ex.id].get('due_day')),exercises.index(ex)))
    pool=[ex for ex in exercises if ex.id not in progress and ex.id not in done_today and eligible(ex)]
    gap_days=LEARNING_PATHS['review']['repeat_gap_days']
    def recently_seen(ex):
        # Only an item already solved independently is varied; a helped item is retried as itself.
        prior=progress[ex.id];last=prior.get('last_day')
        if not prior.get('streak') or last is None:return False
        try:return (date.fromisoformat(today)-date.fromisoformat(last)).days<gap_days
        except ValueError:return False
    def substitute(ex):
        # A recently solved item is reviewed through a different, unseen exercise of the same concept.
        siblings=[c for c in pool if c.concept_id==ex.concept_id]
        remediation=LEARNING_PATHS['items'][ex.id]['remediation']
        return min(siblings,key=lambda c:(0 if c.id in remediation else 1,int(task_form(c)==task_form(ex)),abs(c.level-ex.level),exercises.index(c)),default=None)
    selected=[];review_concepts=set()
    # Review slots grow past the daily share only to fit pending retries, and always leave room for a new item.
    retries=sum(1 for ex in due if not progress[ex.id].get('streak'))
    review_slots=min(LEARNING_PATHS['review']['max_daily_slots'],max(LEARNING_PATHS['review']['daily_slots'],retries))
    if not extra:
        for ex in due:
            if len(selected)>=review_slots:break
            if not recently_seen(ex):selected.append((ex,'review'));review_concepts.add(ex.concept_id);continue
            if ex.concept_id in review_concepts:continue
            other=substitute(ex)
            if other is None:selected.append((ex,'review'))
            else:selected.append((other,'practice'));pool.remove(other)
            review_concepts.add(ex.concept_id)
    counts={c['domain']:0 for c in CONCEPTS}
    concept_picks={c['id']:(1 if c['id'] in obs_today else 0) for c in CONCEPTS}
    forms={}  # task forms already in this batch; the last tie-break mixes what is asked
    support_picks={}  # support outranks new concepts only for as many items as recovery needs
    def count(ex):
        counts[ex.domain]+=1;concept_picks[ex.concept_id]+=1
        forms[task_form(ex)]=forms.get(task_form(ex),0)+1
        if states[ex.concept_id]['needs_support']:support_picks[ex.concept_id]=support_picks.get(ex.concept_id,0)+1
    for ex,_ in selected:count(ex)
    required_l1={req for ex in exercises if ex.id not in progress for req in LEARNING_PATHS['items'][ex.id]['requires'] if not known(req)}
    progressed_concepts={by_id[pid].concept_id for pid in progress if pid in by_id}
    while pool and len(selected)<5:
        def sort_key(ex):
            st=states[ex.concept_id]
            fam=LEARNING_PATHS['items'][ex.id]['family']
            new_fam=0 if fam not in solved_families.get(ex.concept_id,set()) else 1
            form=forms.get(task_form(ex),0)
            if st['needs_support'] and support_picks.get(ex.concept_id,0)<LEARNING_PATHS['rules']['recovery_items']:
                target=max(1,st['support_level']-1)
                return (0,counts[ex.domain],0,0,abs(target-ex.level),0,new_fam,form,exercises.index(ex))
            if ex.concept_id not in progressed_concepts:
                return (1,counts[ex.domain],0,concept_picks[ex.concept_id],1,ex.level-1,0,form,exercises.index(ex))
            redundant_l1=int(ex.level==1 and st['independent_count']>0 and ex.id not in required_l1)
            target=1 if st['independent_count']==0 else 2 if st['level']==1 else 3
            probe_ready=0 if (st['independent_count']>0 and st['level']==1 and ex.level==2 and new_fam==0) else 1
            return (1,counts[ex.domain],redundant_l1,concept_picks[ex.concept_id],probe_ready,abs(target-ex.level),new_fam,form,exercises.index(ex))
        ex=min(pool,key=sort_key)
        selected.append((ex,'new'));count(ex)
        solved_families.setdefault(ex.concept_id,set()).add(LEARNING_PATHS['items'][ex.id]['family'])
        pool.remove(ex)
        if ex.level==3:pool=[candidate for candidate in pool if candidate.level<3]
    # Slots no eligible new item can fill go to due reviews instead of leaving the batch short.
    for ex in due:
        if len(selected)>=5:break
        if recently_seen(ex):continue
        if ex.id not in {x.id for x,_ in selected}:selected.append((ex,'review'))
    return selected


def validate_learning_paths(exercises):
    """Publishing fails before build if a target has no reviewed prerequisite path."""
    from dataclasses import asdict
    items=LEARNING_PATHS['items'];by_id={ex.id:ex for ex in exercises}
    bank=json.loads((Path(__file__).resolve().parent.parent/'curriculum/problem_bank.json').read_text())
    cards={card['id']:card for card in bank['exercises'] if card['source']=='app'}
    if set(cards)!=set(by_id):raise ValueError('Every app exercise needs a design card')
    if set(items)!=set(by_id):raise ValueError('Every exercise needs a learning path before release')
    active=set();done=set()
    def visit(identifier):
        if identifier in active:raise ValueError('Learning path cycle')
        if identifier in done:return
        active.add(identifier)
        for parent in items[identifier]['requires']:
            if parent not in items:raise ValueError('Unknown prerequisite exercise')
            visit(parent)
        active.remove(identifier);done.add(identifier)
    for ex in exercises:
        node=items[ex.id]
        card=cards[ex.id]
        if card['status'] not in ('item_reviewed','code_verified_design_reviewed'):raise ValueError('Every design card needs item review')
        for key,value in asdict(ex).items():
            if key not in ('concept','difficulty') and card.get(key)!=(list(value) if isinstance(value,tuple) else value):raise ValueError('Stale design card: '+ex.id)
        if card.get('requires')!=node['requires']:raise ValueError('Design card path mismatch')
        if ex.response_mode!='essay' and any(by_id[key].response_mode=='essay' for key in node['requires'] if key in by_id):raise ValueError('An active target cannot require a suspended exercise')
        if node['review_status']!='reviewed' or not node['objective'] or not node['family']:raise ValueError('Unreviewed learning path')
        if node['level']!=ex.level or node['concept_id']!=ex.concept_id:raise ValueError('Learning path metadata mismatch')
        visit(ex.id)
        if ex.level>1 and not any(by_id[key].concept_id==ex.concept_id and by_id[key].level<ex.level for key in node['requires']):
            raise ValueError('An advanced target needs a lower-level prerequisite in its concept')
        if ex.level==3 and not any(by_id[key].concept_id==ex.concept_id and by_id[key].level==2 for key in node['requires']):
            raise ValueError('A transfer target needs an application step')
    from backend.quality_gate import validate_quality
    validate_quality(list(cards.values()))


def recommendation_trace(selected, sessions, by_id):
    states=concept_states(sessions,by_id)
    return {'algorithm_version':LEARNING_PATHS['version'],'rules':LEARNING_PATHS['rules'],'review':LEARNING_PATHS['review'],
        'items':[{'id':ex.id,'version':ex.version,'concept_id':ex.concept_id,
                  'role':LEARNING_PATHS['items'][ex.id]['role'],
                  'requires':LEARNING_PATHS['items'][ex.id]['requires'],
                  'level':states[ex.concept_id]['level'],
                  'independent_count':states[ex.concept_id]['independent_count'],
                  'evidence_days':states[ex.concept_id]['evidence_days'],
                  'reason':'예정된 복습으로 기억을 다시 확인해요.' if category=='review' else
                    '최근 본 문제 대신 같은 개념을 다른 문제로 확인해요.' if category=='practice' else
                    ('막혔던 문제보다 한 단계 아래에서 다시 확인해요.' if ex.level>=2 else '도움이 필요했던 개념의 기초를 먼저 확인해요.') if states[ex.concept_id]['needs_support'] else
                    '다음 단계에 필요한 기초를 먼저 확인해요.' if ex.level==1 else
                    '확인한 기초를 다른 조건에 적용해요.'}
                 for ex,category in selected]}

def review_due(today, prior, independent):
    streak=0 if not independent else prior.get('streak',0)+(prior.get('last_day')!=today)
    gap=1 if not independent else 3 if streak<=1 else 7 if streak==2 else 14
    due=(date.fromisoformat(today)+timedelta(days=gap)).isoformat()
    if independent and prior.get('last_day')==today:due=prior.get('due',prior.get('due_day',due))
    return due, streak
