"""Reference boundaries and preservation for the reviewed daily batch."""
from dataclasses import asdict
import hashlib
import json
import math
from pathlib import Path
import sqlite3

import numpy as np
import pandas as pd
import pytest

from backend.content import BY_ID, EXERCISES
from backend.curriculum import LEARNING_PATHS


def test_previous_154_exercises_paths_and_design_cards_are_preserved():
    saved = json.loads(Path('tests/fixtures/catalog-before-daily-20261021.json').read_text())
    digest = lambda value: hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
    assert len(saved['exercises']) == 154
    for identifier, expected in saved['exercises'].items():
        assert digest(asdict(BY_ID[identifier])) == expected, identifier
        assert digest(LEARNING_PATHS['items'][identifier]) == saved['path_items'][identifier]
    cards = {card['id']: card for card in json.loads(Path('curriculum/problem_bank.json').read_text())['exercises']}
    for identifier, expected in saved['design_cards'].items():
        assert digest(cards[identifier]) == expected, identifier
    batch = json.loads(Path('backend/content_batches/2026-10-21.json').read_text())
    added = {item['id'] for item in batch['exercises']}
    assert batch['batch_id'] == 'codex-2026-10-21' and len(added) == 5
    assert not added & set(saved['exercises']) and added <= BY_ID.keys()
    assert len(BY_ID) == len(EXERCISES)


@pytest.mark.parametrize('values', [[90, 90, 80], [80, 90, 90], [3, 3, 3], [-1, -5, -1], [7]])
def test_minimum_tie_rank_matches_number_strictly_greater(values):
    actual = pd.Series(values).rank(method='min', ascending=False).astype(int).tolist()
    assert actual == [1 + sum(other > value for other in values) for value in values]
    if values == [90, 90, 80]:
        assert pd.Series(values).rank(method='dense', ascending=False).tolist() == [1., 1., 2.]
        assert pd.Series(values).rank(method='first', ascending=False).tolist() == [1., 2., 3.]


@pytest.mark.parametrize('values', [[[2, 5, 9], [10, 7, 3]], [[-2, 0, -3]], [[2], [5]], [[7]], [[0, 0], [0, 0]]])
def test_adjacent_difference_uses_right_minus_left_and_shortens_columns(values):
    actual = np.diff(np.array(values), axis=1)
    expected = [[row[i + 1] - row[i] for i in range(len(row) - 1)] for row in values]
    assert actual.tolist() == expected
    assert actual.shape == (len(values), len(values[0]) - 1)


@pytest.mark.parametrize('values,q', [([8, 0, 6, 2], .25), ([6, 2, 0, 8], .25), ([8, 0, 6, 2], 0), ([8, 0, 6, 2], 1), ([4, 4, 4], .75), ([7], .25)])
def test_linear_quantile_matches_sorted_fractional_position(values, q):
    ordered = sorted(values)
    position = (len(ordered) - 1) * q
    lower, upper = math.floor(position), math.ceil(position)
    expected = ordered[lower] + (position - lower) * (ordered[upper] - ordered[lower])
    assert float(np.quantile(values, q, method='linear')) == expected
    if values == [8, 0, 6, 2] and q == .25:
        assert [float(np.quantile(values, q, method=m)) for m in ('lower', 'midpoint', 'nearest')] == [0., 1., 2.]


@pytest.mark.parametrize('names', [['A', 'AB', 'A_B', 'B_A', None], [], ['A', None, 'B'], ['AB', 'AB'], ['A_', 'AXYZ', 'B_A']])
def test_like_single_character_is_required_and_percent_can_be_empty(names):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE users(id INTEGER, name TEXT)')
        db.executemany('INSERT INTO users VALUES(?,?)', list(enumerate(names, 1)))
        actual = [row[0] for row in db.execute(BY_ID['sql-like-width-20261021'].code)]
        # Fixtures use only uppercase ASCII; case/collation is not under test.
        expected = [index for index, name in enumerate(names, 1) if name is not None and name.startswith('A') and len(name) >= 2]
        assert actual == expected


def test_escaped_underscore_has_different_literal_meaning():
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE users(name TEXT)')
        db.executemany('INSERT INTO users VALUES(?)', [('AB',), ('A_B',), ('A',)])
        assert db.execute("SELECT name FROM users WHERE name LIKE ? ESCAPE ?", ('A\\_%', '\\')).fetchall() == [('A_B',)]


@pytest.mark.parametrize('right', [[(1, 7)], [(1, 7), (1, 8)], [(2, 7)], [], [(None, 7)]])
def test_using_merges_only_join_key_and_retains_left_to_right_column_order(right):
    with sqlite3.connect(':memory:') as db:
        db.executescript('CREATE TABLE a(id INTEGER, amount INTEGER); INSERT INTO a VALUES(1,10); CREATE TABLE b(id INTEGER, bonus INTEGER);')
        db.executemany('INSERT INTO b VALUES(?,?)', right)
        cursor = db.execute(BY_ID['sql-using-columns-20261021'].code)
        assert [column[0] for column in cursor.description] == ['id', 'amount', 'bonus']
        assert sorted(cursor.fetchall()) == sorted((1, 10, bonus) for identifier, bonus in right if identifier == 1)
        if right == [(1, 7)]:
            assert db.execute('SELECT * FROM a JOIN b ON a.id=b.id').fetchone() == (1, 10, 1, 7)
            assert db.execute('SELECT * FROM b JOIN a USING(id)').fetchone() == (1, 7, 10)
