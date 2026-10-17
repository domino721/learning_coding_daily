"""Independent boundary checks for the reviewed 2026-10-17 content batch."""
from dataclasses import asdict
import hashlib
import json
from pathlib import Path
import sqlite3

import numpy as np
import pandas as pd
import pytest
from sklearn.preprocessing import OneHotEncoder

from backend.content import BY_ID, EXERCISES


def test_previous_catalog_and_content_versions_are_unchanged():
    saved = json.loads(Path('tests/fixtures/catalog-before-codex-20261016.json').read_text())
    for exercise_id, digest in saved['exercises'].items():
        current = json.dumps(asdict(BY_ID[exercise_id]), ensure_ascii=False, sort_keys=True, separators=(',', ':'))
        assert hashlib.sha256(current.encode()).hexdigest() == digest, exercise_id


def test_daily_batch_has_unique_identity_and_complete_metadata():
    path = Path('backend/content_batches/2026-10-17.json')
    batch = json.loads(path.read_text())
    assert batch['date'] == path.stem and batch['batch_id'] == 'codex-2026-10-17'
    assert batch['status'] == 'reviewed' and len(batch['exercises']) == 5
    assert Path(batch['review_record']).is_file()
    for raw in batch['exercises']:
        ex = BY_ID[raw['id']]
        assert ex.version == 1 and ex.response_mode in ('choice', 'short')
        assert ex.reference_output == ex.answer and len(ex.hints) == 2
        assert ex.difficulty['rationale'] and ex.difficulty['calibration']
        assert 60 <= ex.seconds <= 180
    assert len({ex.id for ex in EXERCISES}) == len(EXERCISES)


@pytest.mark.parametrize('labels,expected', [(['B', 'C'], 1), (['B', 'A'], 0), (['C', 'D'], 2)])
def test_series_assignment_aligns_labels_not_positions(labels, expected):
    df = pd.DataFrame({'sales': [3, 5]}, index=['A', 'B'])
    df['bonus'] = pd.Series([10, 20], index=labels)
    assert int(df['bonus'].isna().sum()) == expected
    values = dict(zip(labels, [10, 20]))
    assert df['bonus'].fillna(-1).tolist() == [values.get(label, -1) for label in ['A', 'B']]


@pytest.mark.parametrize('mask', [[True, False, True], [False] * 3, [True] * 3])
def test_conditional_selection_preserves_positions(mask):
    values = [2, 4, 6]
    actual = np.where(np.array(mask), np.array(values), 99).tolist()
    assert actual == [value if selected else 99 for value, selected in zip(values, mask)]
    assert len(actual) == len(values)


@pytest.mark.parametrize('refunds', [[1, None], [], [None, None], [1, 1, None, 2, 3]])
def test_correlated_not_exists_ignores_null_matches(refunds):
    with sqlite3.connect(':memory:') as db:
        db.executescript('CREATE TABLE customers(id); INSERT INTO customers VALUES(1),(2),(3); CREATE TABLE refunds(customer_id);')
        db.executemany('INSERT INTO refunds VALUES(?)', [(value,) for value in refunds])
        actual = [row[0] for row in db.execute(BY_ID['sql-exists-20261017'].code)]
    assert actual == [value for value in (1, 2, 3) if value not in {r for r in refunds if r is not None}]


@pytest.mark.parametrize('items,payments,expected', [(2, [4, 6], (40, 20)), (1, [4, 6], (20, 10)), (2, [4], (20, 8)), (0, [4, 6], (None, None))])
def test_join_fanout_tracks_each_measure_separately(items, payments, expected):
    with sqlite3.connect(':memory:') as db:
        db.executescript('CREATE TABLE orders(id, amount); INSERT INTO orders VALUES(1,10); CREATE TABLE line_items(order_id, sku); CREATE TABLE payments(order_id, paid);')
        db.executemany('INSERT INTO line_items VALUES(1,?)', [(str(index),) for index in range(items)])
        db.executemany('INSERT INTO payments VALUES(1,?)', [(value,) for value in payments])
        assert db.execute(BY_ID['sql-fanout-20261017'].code).fetchone() == expected


def test_unknown_category_does_not_refit_or_add_columns():
    encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False).fit([['B'], ['A']])
    assert encoder.transform([['C'], ['A'], ['B']]).astype(int).tolist() == [[0, 0], [1, 0], [0, 1]]
    assert encoder.categories_[0].tolist() == ['A', 'B']
    strict = OneHotEncoder(sparse_output=False).fit([['B'], ['A']])
    with pytest.raises(ValueError):
        strict.transform([['C']])
