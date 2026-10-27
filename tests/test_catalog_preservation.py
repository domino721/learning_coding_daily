"""One rolling snapshot replaces per-date preservation tests: published (id, version) content never changes silently.

Only what learners see or are graded on is frozen per version (backend.quality_gate.published_view);
editorial review fields may be completed under the same version.
"""
import hashlib
import json
from dataclasses import asdict
from pathlib import Path

from backend.content import BY_ID, EXERCISES
from backend.curriculum import LEARNING_PATHS
from backend.quality_gate import published_view

SAVED = json.loads(Path('tests/fixtures/catalog-published.json').read_text())
CARDS = {c['id']: c for c in json.loads(Path('curriculum/problem_bank.json').read_text())['exercises']}


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def test_every_published_exercise_still_exists_and_rules_are_preserved():
    assert SAVED['projection'] == 'published-view-v1'
    assert set(SAVED['items']) <= set(BY_ID), set(SAVED['items']) - set(BY_ID)
    assert LEARNING_PATHS['rules'] == SAVED['rules']
    assert len(BY_ID) == len(EXERCISES)


def test_same_version_means_same_exercise_path_and_card():
    for key, saved in SAVED['items'].items():
        ex = BY_ID[key]
        if ex.version != saved['version']:
            assert ex.version > saved['version'], key
            continue
        assert digest(published_view('exercise', asdict(ex))) == saved['exercise'], key
        assert digest(published_view('path', LEARNING_PATHS['items'][key])) == saved['path_item'], key
        assert digest(published_view('card', CARDS[key])) == saved['design_card'], key


def test_snapshot_covers_the_current_catalog():
    assert set(BY_ID) == set(SAVED['items']), 'python3 scripts/freeze-catalog.py 실행 필요'
