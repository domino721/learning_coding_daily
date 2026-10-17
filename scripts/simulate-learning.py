"""Replay synthetic production decisions without changing user records."""
import argparse
from dataclasses import asdict
import hashlib
import json
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT))
from backend.content import BY_ID, EXERCISES
from backend.curriculum import LEARNING_PATHS, concept_states, recommendation_trace, review_due, select_exercises
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--cases',type=Path,default=ROOT/'tests/fixtures/learning-paths.json')
parser.add_argument('--output',type=Path)
args=parser.parse_args()
results=[]
for sample in json.loads(args.cases.read_text()):
    sessions=[];progress={}
    for index,record in enumerate(sample['records']):
        ex=BY_ID[record['id']];status=record.get('status','correct')
        item={**asdict(ex),'status':status,'hints_used':record.get('hints',0),'attempts_count':record.get('attempts',1)}
        sessions.append({'id':f's-{index}','track_id':sample['track'],'local_day':record['day'],'batch':index,'items':[item]})
        due,streak=review_due(record['day'],progress.get(ex.id,{}),status=='correct' and not item['hints_used'] and item['attempts_count']==1)
        progress[ex.id]={'due':due,'streak':streak,'last_day':record['day'],'completed':1}
    selected=select_exercises(EXERCISES,sessions,progress,sample['day'],track=sample['track'])
    results.append({'scenario':sample,'states':list(concept_states(sessions,BY_ID).values()),'trace':recommendation_trace(selected,sessions,BY_ID)})
sources=['backend/curriculum.py','backend/learning_paths.json','src/recommendation.ts']
report={'synthetic':True,'algorithm_version':LEARNING_PATHS['version'],
        'source_hashes':{name:hashlib.sha256((ROOT/name).read_bytes()).hexdigest() for name in sources},'scenarios':results}
text=json.dumps(report,ensure_ascii=False,indent=2)+chr(10)
if args.output:
    args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(text)
    print('Saved synthetic production replay:',args.output)
else:print(text,end='')
