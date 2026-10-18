"""Portable personal records; imports merge inside the caller's SQLite transaction."""
from collections import Counter
from copy import deepcopy
from datetime import datetime, timezone
import json
from fastapi import HTTPException
from backend.record_contract import merge_submission


def event(db,kind,session_id=None,exercise_id=None,event_id=None,detail=None,occurred_at=None):
    from uuid import uuid4
    db.execute('INSERT OR IGNORE INTO learning_events VALUES(?,?,?,?,?,?,?)',
        (event_id or str(uuid4()),kind,session_id,exercise_id,occurred_at or datetime.now(timezone.utc).isoformat(),0,detail))


def export_records(db,snapshot):
    sessions=[snapshot(db,row['id']) for row in db.execute('SELECT * FROM sessions ORDER BY local_day,batch')]
    attempts={row['id']:{'session':row['session_id'],'exercise':row['exercise_id'],'answer':row['answer'],
        'correct':None if row['response_mode']=='essay' else bool(row['correct']),
        'response_mode':row['response_mode'],'created_at':row['created_at'],
        'active_seconds':row['active_seconds'],'hints_used':row['hints_used']} for row in db.execute('SELECT * FROM attempts')}
    progress={row['exercise_id']:{'due':row['due_day'],'completed':row['completed_count'],'last_day':row['last_day'],'streak':row['streak']} for row in db.execute('SELECT * FROM progress')}
    events=[{ 'id':row['id'],'kind':row['kind'],'session_id':row['session_id'],'exercise_id':row['exercise_id'],
        'occurred_at':row['occurred_at'],'inferred':bool(row['inferred']),'detail':row['detail']} for row in db.execute('SELECT * FROM learning_events ORDER BY rowid')]
    catalog={f"{row['session_id']}:{row['exercise_id']}":json.loads(row['snapshot']) for row in db.execute('SELECT * FROM session_items WHERE snapshot IS NOT NULL')}
    return {'version':1,'schema_version':2,'revision':len(events),'learner_id':db.execute("SELECT value FROM metadata WHERE key='learner_id'").fetchone()[0],
            'updated_at':datetime.now(timezone.utc).isoformat(),'sessions':sessions,'attempts':attempts,'progress':progress,'events':events,'catalog':catalog}


def validate_records(data):
    def require(ok,message='학습 기록 구조가 손상되었어요. 기존 기록은 보존됩니다.'):
        if not ok:raise HTTPException(422,message)
    def count(value):return type(value)==int and value>=0
    require(isinstance(data,dict) and data.get('version')==1 and data.get('schema_version',1) in (1,2),'지원하지 않는 백업 버전입니다.')
    require(len(json.dumps(data,ensure_ascii=False).encode())<=10*1024*1024,'백업은 10MB까지 가져올 수 있어요.')
    require(isinstance(data.get('sessions'),list) and isinstance(data.get('attempts'),dict) and isinstance(data.get('progress'),dict))
    ids=set()
    for s in data['sessions']:
        require(isinstance(s,dict) and isinstance(s.get('id'),str) and s['id'] not in ids and s['id'] not in ('__proto__','constructor','prototype'))
        ids.add(s['id']);require(isinstance(s.get('local_day'),str))
        try:datetime.strptime(s['local_day'],'%Y-%m-%d')
        except ValueError:raise HTTPException(422,'백업 날짜가 올바르지 않아요.')
        require(isinstance(s.get('track_id'),str) and isinstance(s.get('items'),list) and s['items'])
        require(s.get('total')==len(s['items']) and count(s.get('batch',0)))
        item_ids=set()
        for i in s['items']:
            require(isinstance(i,dict) and isinstance(i.get('id'),str) and i['id'] not in item_ids and i['id'] not in ('__proto__','constructor','prototype'))
            item_ids.add(i['id']);require(i.get('status') in ('pending','correct','revealed','incorrect'))
            require(all(count(i.get(k)) for k in ('hints_used','attempts_count','active_seconds')) and i['hints_used']<=2)
            require(all(isinstance(i.get(k),str) for k in ('title','prompt','code','kind','concept')))
            require(isinstance(i.get('hints'),list) and isinstance(i.get('choices'),list))
            require(i.get('last_answer') is None or isinstance(i.get('last_answer'),str))
            require(i.get('response_mode') in (None,'choice','short','essay'))
        require(s.get('completed_count')==sum(i['status']!='pending' for i in s['items']) and s.get('correct_count')==sum(i['status']=='correct' for i in s['items']))
    for key,p in data['progress'].items():require(key not in ('__proto__','constructor','prototype') and isinstance(p,dict) and count(p.get('completed')) and isinstance(p.get('due'),str))
    for key,a in data['attempts'].items():require(key not in ('__proto__','constructor','prototype') and isinstance(a,dict) and all(isinstance(a.get(k),str) for k in ('session','exercise','answer')) and a.get('correct') in (None,True,False))
    for e in data.get('events',[]):require(isinstance(e,dict) and isinstance(e.get('id'),str) and isinstance(e.get('kind'),str) and (e.get('occurred_at') is None or isinstance(e.get('occurred_at'),str)))
    catalog=data.get('catalog',{})
    require(isinstance(catalog,dict),'문항 원본 보관함이 손상되었어요.')
    for source in catalog.values():
        require(isinstance(source,dict) and all(isinstance(source.get(k),str) for k in ('id','answer','explanation','prompt','code','title','concept')),'문항 원본이 손상되었어요.')
        require(isinstance(source.get('hints'),list) and len(source['hints'])==2 and all(isinstance(v,str) for v in source['hints']))
        require(all(isinstance(source.get(k),list) and all(isinstance(v,str) for v in source[k]) for k in ('choices','accepted')))
    return data


def merge_records(current,incoming):
    validate_records(incoming);merged=deepcopy(current);by_id={s['id']:s for s in merged['sessions']}
    for s in incoming['sessions']:
        if s['id'] not in by_id:
            copied=deepcopy(s)
            occupied={x.get('batch',0) for x in merged['sessions'] if x['local_day']==s['local_day'] and x['track_id']==s['track_id']}
            if copied.get('batch',0) in occupied:copied['batch']=max(occupied)+1
            merged['sessions'].append(copied);by_id[s['id']]=copied;continue
        old=by_id[s['id']]
        if (old['local_day'],old['track_id'],[i['id'] for i in old['items']])!=(s['local_day'],s['track_id'],[i['id'] for i in s['items']]):raise HTTPException(422,'같은 묶음 ID의 내용이 달라 가져오지 않았어요.')
        for pos,item in enumerate(s['items']):
            before=old['items'][pos]
            if before['status']!='pending' and item['status']!='pending' and (before.get('last_answer'),before['status'])!=(item.get('last_answer'),item['status']):raise HTTPException(422,'같은 문제의 완료 답안이 달라 가져오지 않았어요. 두 파일을 보관해 주세요.')
            if before['status']=='pending' and item['status']=='pending' and before.get('draft') and item.get('draft') and before['draft']!=item['draft']:raise HTTPException(422,'작성 중인 답안이 서로 달라 가져오지 않았어요. 두 파일을 보관해 주세요.')
            chosen=item if before['status']=='pending' and (item['status']!='pending' or item['attempts_count']>before['attempts_count']) else before
            old['items'][pos]={**deepcopy(chosen),'attempts_count':max(before['attempts_count'],item['attempts_count']),'hints_used':max(before['hints_used'],item['hints_used']),
                'hints':deepcopy(before['hints'] if len(before['hints'])>=len(item['hints']) else item['hints']),'active_seconds':max(before['active_seconds'],item['active_seconds']),
                'draft':(before.get('draft') or item.get('draft')) if chosen['status']=='pending' else chosen.get('draft')}
        old['completed_count']=sum(i['status']!='pending' for i in old['items']);old['correct_count']=sum(i['status']=='correct' for i in old['items']);old['finished']=old['completed_count']==old['total']
    for key,a in incoming['attempts'].items():
        try:
            merged['attempts'][key] = merge_submission(merged['attempts'][key],a) if key in merged['attempts'] else deepcopy(a)
        except ValueError:
            raise HTTPException(422,'같은 제출 ID의 답안이 달라 가져오지 않았어요.')
    attempts=Counter((a['session'],a['exercise']) for a in merged['attempts'].values())
    for session in merged['sessions']:
        for item in session['items']:item['attempts_count']=max(item['attempts_count'],attempts[(session['id'],item['id'])])
    for key,p in incoming['progress'].items():
        if key not in merged['progress'] or p['completed']>merged['progress'][key]['completed']:merged['progress'][key]=deepcopy(p)
    counts=Counter(i['id'] for s in merged['sessions'] for i in s['items'] if i['status']!='pending')
    for key,value in counts.items():
        if key in merged['progress']:merged['progress'][key]['completed']=max(value,merged['progress'][key]['completed'])
        else:
            from datetime import date,timedelta
            last=max(s['local_day'] for s in merged['sessions'] if any(i['id']==key and i['status']!='pending' for i in s['items']))
            merged['progress'][key]={'completed':value,'last_day':last,'due':(date.fromisoformat(last)+timedelta(days=1)).isoformat(),'streak':0}
    events={e['id']:e for e in merged.get('events',[])}
    for e in incoming.get('events',[]):events.setdefault(e['id'],deepcopy(e))
    merged['events']=list(events.values());merged.setdefault('catalog',{})
    for key,value in incoming.get('catalog',{}).items():merged['catalog'].setdefault(key,value)
    if not current['sessions'] and incoming.get('learner_id'):merged['learner_id']=incoming['learner_id']
    return merged


def restore_records(db,data,snapshot,confirm_owner=False):
    from dataclasses import asdict
    from backend.content import BY_ID
    current=export_records(db,snapshot)
    if current['sessions'] and data.get('learner_id')!=current['learner_id'] and not confirm_owner:raise HTTPException(422,'다른 학습 ID의 기록입니다. 본인의 백업인지 확인해 주세요.')
    merged=merge_records(current,data)
    # All validation and conflict detection precede writes; caller rolls back on failure.
    for s in merged['sessions']:
        db.execute('INSERT OR IGNORE INTO sessions VALUES(?,?,?,?,?,?)',(s['id'],s['track_id'],s['local_day'],s.get('timezone','Asia/Seoul'),datetime.now(timezone.utc).isoformat(),s.get('batch',0)))
        for pos,i in enumerate(s['items']):
            source=merged['catalog'].get(f"{s['id']}:{i['id']}") or (asdict(BY_ID[i['id']]) if i['id'] in BY_ID else None)
            if not source:raise HTTPException(422,'원본 문항이 없는 백업이라 가져오지 않았어요.')
            source=deepcopy(source)
            for field in ('title','prompt','code','choices','concept','domain','level'):
                if field in i and i[field] is not None:source[field]=i[field]
            if i['status']!='pending':
                for field in ('answer','explanation'):
                    if i.get(field) is not None:source[field]=i[field]
            from backend.content import Exercise
            try:
                parsed=Exercise(**source)
                if parsed.id!=i['id'] or not isinstance(parsed.answer,str) or len(parsed.hints)!=2:raise ValueError()
            except (TypeError,ValueError):raise HTTPException(422,'지원하지 않거나 손상된 문항 원본이라 가져오지 않았어요.')
            db.execute('''INSERT INTO session_items(session_id,position,exercise_id,version,category,status,hints_used,attempts_count,last_answer,last_correct,active_seconds,response_mode,snapshot,draft,completed_at)
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(session_id,exercise_id) DO UPDATE SET status=excluded.status,hints_used=excluded.hints_used,attempts_count=excluded.attempts_count,last_answer=excluded.last_answer,last_correct=excluded.last_correct,active_seconds=excluded.active_seconds,response_mode=excluded.response_mode,snapshot=excluded.snapshot,draft=excluded.draft,completed_at=excluded.completed_at''',
                (s['id'],pos,i['id'],i['version'],i['category'],i['status'],i['hints_used'],i['attempts_count'],i.get('last_answer'),i.get('last_correct'),i['active_seconds'],i.get('response_mode'),json.dumps(source,ensure_ascii=False),i.get('draft'),i.get('completed_at')))
    for key,a in merged['attempts'].items():db.execute('INSERT OR IGNORE INTO attempts VALUES(?,?,?,?,?,?,?,?,?)',(key,a['session'],a['exercise'],a['answer'],int(bool(a['correct'])),a.get('hints_used',0),a.get('active_seconds',0),a.get('created_at') or 'legacy-time-unknown',a.get('response_mode')))
    for key,p in merged['progress'].items():db.execute('INSERT INTO progress VALUES(?,?,?,?,?,?) ON CONFLICT(exercise_id) DO UPDATE SET completed_count=excluded.completed_count,last_day=excluded.last_day,due_day=excluded.due_day,streak=excluded.streak',(key,p['completed'],p.get('last_day') or '1970-01-01',p['due'],'imported',p.get('streak',0)))
    for e in merged['events']:db.execute('INSERT OR IGNORE INTO learning_events VALUES(?,?,?,?,?,?,?)',(e['id'],e['kind'],e.get('session_id'),e.get('exercise_id'),e.get('occurred_at'),int(e.get('inferred',False)),e.get('detail')))
    db.execute("UPDATE metadata SET value=? WHERE key='learner_id'",(merged['learner_id'],));event(db,'imported',detail='검증된 파일 백업 병합')
