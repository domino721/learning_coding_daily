"""Synchronize reviewed design cards with the canonical app catalog, without authoring new cards."""
from dataclasses import asdict
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from backend.content import EXERCISES
from backend.curriculum import CONCEPTS, LEARNING_PATHS

path = ROOT / 'curriculum/problem_bank.json'
bank = json.loads(path.read_text())
cards = {card['id']: card for card in bank['exercises']}
for exercise in EXERCISES:
    if exercise.id not in cards or exercise.id not in LEARNING_PATHS['items']:
        raise SystemExit(f'{exercise.id}: write its design card and learning path before publishing')
    card = cards[exercise.id]
    card.update(asdict(exercise))
    node = LEARNING_PATHS['items'][exercise.id]
    card.update(concept=exercise.concept_id, app_difficulty=exercise.difficulty,
                difficulty=exercise.level, track_id='sql' if exercise.domain == 'SQL' else 'python',
                family=node['family'], requires=node['requires'], release_path_version=LEARNING_PATHS['version'],
                prerequisite_concepts=next(c['prerequisites'] for c in CONCEPTS if c['id'] == exercise.concept_id))
bank['version'] = '0.3'
bank['exercises'] = list(cards.values())
bank['coverage'] = {c['id']: {'basic_families': len({card['family'] for card in cards.values() if card['concept'] == c['id'] and card['difficulty'] == 1}),
                            'has_transfer': any(card['concept'] == c['id'] and card['difficulty'] >= 2 for card in cards.values())}
                    for c in bank['concepts']}
path.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + '\n')
