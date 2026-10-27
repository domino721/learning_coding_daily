"""Independent reference/boundary checks; never execute learner-supplied code."""
from dataclasses import asdict
import hashlib
import json
from pathlib import Path
import sqlite3

import numpy as np
import pandas as pd
import pytest
from sklearn.metrics import confusion_matrix

from backend.content import BY_ID, EXERCISES
from tests.preserved import original, preserved
from backend.curriculum import LEARNING_PATHS


def test_previous_137_exercises_and_paths_are_unchanged():
    saved = json.loads(Path('tests/fixtures/catalog-before-daily-20261020.json').read_text())
    digest = lambda value: hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
    assert len(saved['exercises']) == 137
    for identifier, expected in saved['exercises'].items():
        assert preserved('exercise', identifier, expected), identifier
        assert preserved('path', identifier, saved['path_items'][identifier])
    daily = json.loads(Path('backend/content_batches/2026-10-20.json').read_text())
    daily_ids = {item['id'] for item in daily['exercises']}
    assert len(daily_ids) == 5 and not daily_ids & set(saved['exercises'])
    # Later reviewed additions may coexist with this batch. Keep the historical
    # hashes strict while checking this batch's presence instead of a global cap.
    assert len(EXERCISES) == len(BY_ID)
    assert set(saved['exercises']) | daily_ids <= set(BY_ID)


@pytest.mark.parametrize('values,labels,expected', [
    ([8, 12, 12], ['B', 'C', 'A'], 'C'),
    ([12, 12, 8], ['A', 'C', 'B'], 'A'),
    ([8, 9, 12], ['B', 'C', 'A'], 'A'),
    ([-8, -3, -3], ['B', 'C', 'A'], 'C'),
])
def test_maximum_returns_first_label_even_with_ties(values, labels, expected):
    assert pd.Series(values, index=labels).idxmax() == expected
    assert labels[values.index(max(values))] == expected


@pytest.mark.parametrize('values', [
    [[1, 2, 3], [4, 5, 6]], [[2, 8, 14]], [[2], [8], [14]], [[-2, 0], [2, 4]],
])
def test_transpose_means_match_independent_column_arithmetic(values):
    result = np.array(values).T.mean(axis=1)
    expected = [sum(column) / len(column) for column in zip(*values)]
    assert result.tolist() == expected
    assert result.shape == (len(values[0]),)
    np.testing.assert_allclose(result, np.array(values).mean(axis=0))


@pytest.mark.parametrize('truth,predicted,labels', [
    ([1, 1, 0, 0], [1, 0, 0, 0], [1, 0]),
    ([1, 1, 0, 0], [1, 0, 0, 0], [0, 1]),
    ([1, 1], [1, 1], [1, 0]),
    ([1, 0], [0, 1], [1, 0]),
])
def test_matrix_class_order_rows_and_columns_use_explicit_counts(truth, predicted, labels):
    expected = [[sum(t == row and p == column for t, p in zip(truth, predicted))
                 for column in labels] for row in labels]
    actual = confusion_matrix(truth, predicted, labels=labels).tolist()
    assert actual == expected
    assert sum(map(sum, actual)) == len(truth)


@pytest.mark.parametrize('left,right', [([1, 1], [1, 2]), ([], []), ([1, 1], []), ([None], [None]), ([1], [2])])
@original('sql-union-rows-20261020')
def test_union_removes_duplicates_across_and_within_inputs(left, right):
    with sqlite3.connect(':memory:') as db:
        db.executescript('CREATE TABLE a(id INTEGER); CREATE TABLE b(id INTEGER);')
        db.executemany('INSERT INTO a VALUES(?)', [(value,) for value in left])
        db.executemany('INSERT INTO b VALUES(?)', [(value,) for value in right])
        actual = db.execute(BY_ID['sql-union-rows-20261020'].code).fetchone()
    assert actual == (len(set(left + right)), len(left) + len(right))


@pytest.mark.parametrize('values,expected', [([1, 0, 0], (0, 0.33)), ([1, 1], (1, 1.0)), ([0, 0], (0, 0.0)), ([], (None, None))])
@original('sql-division-rate-20261020')
def test_ratio_type_conversion_happens_before_division(values, expected):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE events(done INTEGER)')
        db.executemany('INSERT INTO events VALUES(?)', [(value,) for value in values])
        assert db.execute(BY_ID['sql-division-rate-20261020'].code).fetchone() == expected
        if values:
            assert db.execute('SELECT 1.0 * (SUM(done) / COUNT(*)) FROM events').fetchone()[0] == sum(values) // len(values)
            assert expected[1] == round(sum(values) / len(values), 2)
