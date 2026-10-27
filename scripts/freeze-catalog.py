"""Maintain the single rolling preservation snapshot used by tests/test_catalog_preservation.py.

Usage: python3 scripts/freeze-catalog.py        # add new (id, version) entries, never rewrite existing ones
       python3 scripts/freeze-catalog.py --check # fail if the snapshot is behind the catalog

Daily batches call this once instead of adding a dated fixture and a dated test file.
"""
import hashlib
import json
import sys
from dataclasses import asdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from backend.content import EXERCISES
from backend.curriculum import LEARNING_PATHS

SNAPSHOT = ROOT / 'tests/fixtures/catalog-published.json'


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def current():
    cards = {c['id']: c for c in json.loads((ROOT / 'curriculum/problem_bank.json').read_text())['exercises']}
    return {
        'rules': LEARNING_PATHS['rules'],
        'items': {ex.id: {'version': ex.version, 'exercise': digest(asdict(ex)),
                          'path_item': digest(LEARNING_PATHS['items'][ex.id]), 'design_card': digest(cards[ex.id])}
                  for ex in EXERCISES},
    }


def main():
    now = current()
    saved = json.loads(SNAPSHOT.read_text()) if SNAPSHOT.exists() else {'rules': now['rules'], 'items': {}}
    changed = {k: v for k, v in now['items'].items() if k in saved['items'] and saved['items'][k]['version'] == v['version'] and saved['items'][k] != v}
    if changed:
        raise SystemExit('같은 id·version의 내용이 바뀌었습니다. version을 올리거나 되돌리세요: ' + ', '.join(sorted(changed)))
    missing = {k: v for k, v in now['items'].items() if saved['items'].get(k) != v}
    if '--check' in sys.argv:
        if missing or saved['rules'] != now['rules']:
            raise SystemExit('보존 스냅샷이 최신 카탈로그보다 뒤처졌습니다. python3 scripts/freeze-catalog.py를 실행하세요: ' + ', '.join(sorted(missing)))
        print('catalog snapshot up to date:', len(saved['items']))
        return
    saved['items'].update(missing)
    saved['rules'] = now['rules']
    saved['items'] = dict(sorted(saved['items'].items()))
    SNAPSHOT.write_text(json.dumps(saved, ensure_ascii=False, indent=1, sort_keys=True) + '\n')
    print('added', len(missing), 'total', len(saved['items']))


if __name__ == '__main__':
    main()
