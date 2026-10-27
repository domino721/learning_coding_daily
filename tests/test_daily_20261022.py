"""Independent calculations and immutable catalog checks for the daily batch."""
from dataclasses import asdict
import hashlib
import json
import math
from pathlib import Path
import sqlite3

import numpy as np
import pandas as pd
import pytest
from sklearn.preprocessing import MinMaxScaler

from backend.content import BY_ID, EXERCISES
from tests.preserved import original, preserved
from backend.curriculum import LEARNING_PATHS


def test_previous_177_exercises_paths_cards_and_rules_are_preserved():
    saved = json.loads(Path('tests/fixtures/catalog-before-daily-20261022.json').read_text())
    digest = lambda value: hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
    assert len(saved['exercises']) == 177 and LEARNING_PATHS['rules'] == saved['rules']
    for identifier, expected in saved['exercises'].items():
        assert preserved('exercise', identifier, expected), identifier
        assert preserved('path', identifier, saved['path_items'][identifier])
    cards = {card['id']: card for card in json.loads(Path('curriculum/problem_bank.json').read_text())['exercises']}
    for identifier, expected in saved['design_cards'].items():
        assert preserved('card', identifier, expected), identifier
    batch = json.loads(Path('backend/content_batches/2026-10-22.json').read_text())
    added = {item['id'] for item in batch['exercises']}
    assert batch['batch_id'] == 'codex-2026-10-22' and len(added) == 5
    assert not added & saved['exercises'].keys() and added <= BY_ID.keys()
    assert len(BY_ID) == len(EXERCISES)


@pytest.mark.parametrize('values', [['A', 'B', 'C'], ['A', 'A'], ['B', 'C'], [], ['A', None]])
def test_mapping_key_presence_does_not_guarantee_a_nonmissing_result(values):
    mapping = {'A': 1, 'B': None}
    original = pd.Series(values, dtype=object)
    before = original.copy()
    result = original.map(mapping)
    assert result.isna().tolist() == [value not in mapping or mapping[value] is None for value in values]
    pd.testing.assert_series_equal(original, before)
    if values == ['A', 'B', 'C']:
        assert original.replace(mapping).isna().tolist() == [False, True, False]


@pytest.mark.parametrize('value,expected', [(-5., (-.5, 0.)), (0., (0., 0.)), (5., (.5, .5)), (10., (1., 1.)), (20., (2., 1.))])
def test_clipping_is_distinct_from_learning_new_extrema(value, expected):
    plain = MinMaxScaler().fit([[0.], [10.]])
    clipped = MinMaxScaler(clip=True).fit([[0.], [10.]])
    result = (float(plain.transform([[value]])[0, 0]), float(clipped.transform([[value]])[0, 0]))
    assert result == expected
    assert result == (value / 10, min(1., max(0., value / 10)))
    for scaler in (plain, clipped):
        assert scaler.data_min_.tolist() == [0.] and scaler.data_max_.tolist() == [10.]


@pytest.mark.parametrize('x,y', [([1., 2., 3.], [30., 20., 10.]), ([0., 2., 4.], [5., 9., 13.]), ([-1., 0., 1.], [1., -2., 1.]), ([3., 1., 2.], [10., 30., 20.])])
def test_correlation_matches_independent_centered_product_normalization(x, y):
    centered_x = [value - sum(x) / len(x) for value in x]
    centered_y = [value - sum(y) / len(y) for value in y]
    numerator = sum(a * b for a, b in zip(centered_x, centered_y))
    denominator = math.sqrt(sum(a * a for a in centered_x) * sum(b * b for b in centered_y))
    actual = float(np.corrcoef(x, y)[0, 1])
    assert actual == pytest.approx(numerator / denominator, abs=1e-12)
    assert float(np.corrcoef(x, [10 * value + 7 for value in y])[0, 1]) == pytest.approx(actual, abs=1e-12)


@pytest.mark.parametrize('pairs', [[(1, 1), (None, None), (None, 1), (1, None)], [], [(1, 1), (2, 2)], [(None, 1), (1, None)], [(1, 2), (2, 1)], [(None, None), (None, None)]])
@original('sql-nullsafe-is-20261022')
def test_sqlite_is_includes_both_null_but_not_one_null(pairs):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE pairs(id INTEGER, a INTEGER, b INTEGER)')
        db.executemany('INSERT INTO pairs VALUES(?,?,?)', [(index, a, b) for index, (a, b) in enumerate(pairs, 1)])
        actual = [row[0] for row in db.execute(BY_ID['sql-nullsafe-is-20261022'].code)]
        assert actual == [index for index, (a, b) in enumerate(pairs, 1) if a == b]
        ordinary = [row[0] for row in db.execute('SELECT id FROM pairs WHERE a = b ORDER BY id')]
        assert ordinary == [index for index, (a, b) in enumerate(pairs, 1) if a is not None and b is not None and a == b]


@pytest.mark.parametrize('people', [[(1, 'A'), (2, 'A'), (3, 'B')], [], [(1, 'A')], [(1, 'A'), (2, 'A'), (3, 'A')], [(1, 'A'), (2, 'B')], [(1, None), (2, None)], [(3, 'A'), (1, 'A'), (2, 'B')]])
@original('sql-self-pairs-20261022')
def test_self_join_produces_each_unordered_team_pair_once(people):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE people(id INTEGER, team TEXT)')
        db.executemany('INSERT INTO people VALUES(?,?)', people)
        actual = db.execute(BY_ID['sql-self-pairs-20261022'].code).fetchall()
    expected = sorted((a, b) for a, left in people for b, right in people if a < b and left is not None and left == right)
    assert actual == expected and len(actual) == len(set(actual))
