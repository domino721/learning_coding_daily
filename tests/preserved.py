"""Shared rule for the dated preservation tests written before the 2026-10-26 daily contract.

Their fixtures froze whole exercises, path items and design cards. Since CR-014 an item may be
re-versioned, or have editorial review fields completed under the same version; the rolling snapshot
(tests/test_catalog_preservation.py) then guards what learners see. Everything else still has to
match the dated fixture byte for byte.
"""
import hashlib
import json
from dataclasses import asdict
from pathlib import Path

from backend.content import BY_ID
from backend.curriculum import LEARNING_PATHS
from backend.quality_gate import published_view

SNAPSHOT = json.loads(Path('tests/fixtures/catalog-published.json').read_text())['items']
BASELINE = json.loads(Path('curriculum/quality_baseline.json').read_text())['items']
CARDS = {c['id']: c for c in json.loads(Path('curriculum/problem_bank.json').read_text())['exercises']}
FIELD = {'exercise': 'exercise', 'path': 'path_item', 'card': 'design_card'}


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def reversioned(key):
    """Re-versioned after the 2026-10-26 baseline; the new version has its own review record."""
    return BY_ID[key].version > BASELINE.get(key, BY_ID[key].version)


def current(kind, key):
    return asdict(BY_ID[key]) if kind == 'exercise' else LEARNING_PATHS['items'][key] if kind == 'path' else CARDS[key]


def preserved(kind, key, saved_digest):
    return digest(current(kind, key)) == saved_digest or reversioned(key) or editorial_only(kind, key)


def editorial_only(kind, key):
    """Same version, and what learners see still matches the rolling snapshot: only review fields changed."""
    frozen = SNAPSHOT[key]
    return frozen['version'] == BY_ID[key].version and frozen[FIELD[kind]] == digest(published_view(kind, current(kind, key)))


def original(*keys):
    """Mark a boundary test written for these items' first versions; skip it once one is re-versioned."""
    import pytest
    return pytest.mark.skipif(any(reversioned(key) for key in keys), reason=REVERSIONED)


REVERSIONED = '2026-10-26 이후 새 version으로 바뀐 문항은 그 version의 검수 기록과 게이트가 확인한다'

# CR-017 added the Python 기초 track and three SQL concepts, CR-018 four more basics concepts, CR-019 the 터미널·Git
# sectors and CR-020 three Windows sectors. Concepts that existed when a dated fixture was frozen must still match it byte for byte, in their original order.
ADDED_CONCEPTS = {'py-values', 'py-str', 'py-list', 'py-control', 'py-tuple', 'py-dict', 'py-set', 'py-func',
                  'py-star', 'py-decorator', 'sql-functions', 'sql-windows', 'sql-modify',
                  # CR-018
                  'py-class', 'py-class-deco', 'py-error', 'py-iter',
                  # CR-019
                  'sh-path', 'sh-words', 'sh-files', 'sh-redirect', 'sh-chain', 'sh-env', 'sh-script', 'sh-python',
                  'sh-windows', 'git-status', 'git-commit', 'git-diff', 'git-undo', 'git-branch', 'git-remote',
                  # CR-020
                  'win-path', 'win-files', 'win-env'}


def concepts_before_additions(bank):
    return [concept for concept in bank['concepts'] if concept['id'] not in ADDED_CONCEPTS]
