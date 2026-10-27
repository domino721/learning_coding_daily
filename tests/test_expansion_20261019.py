"""Reference and independent boundary checks for the 18 reviewed curriculum additions."""
import contextlib
from dataclasses import asdict
import hashlib
import io
import json
from pathlib import Path
import sqlite3

import numpy as np
import pandas as pd
import pytest
from sklearn.metrics import recall_score
from sklearn.model_selection import TimeSeriesSplit
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import StandardScaler

from backend.content import BY_ID, EXERCISES
from tests.preserved import original, preserved, REVERSIONED, reversioned
from backend.curriculum import LEARNING_PATHS, select_exercises
from scripts.validate_sql_content import sql_output, visible_setup

REVIEW = json.loads(Path('curriculum/reviews/2026-10-19-expansion.json').read_text())
NEW = REVIEW['exercises']


@pytest.mark.parametrize('item', NEW, ids=lambda item: item['id'])
def test_authored_reference_and_unique_answer(item):
    ex = BY_ID[item['id']]
    if reversioned(ex.id):
        pytest.skip(REVERSIONED)
    if ex.domain == 'SQL':
        with sqlite3.connect(':memory:') as db:
            db.executescript(visible_setup(ex.code))
            actual = sql_output(db.execute(ex.code).fetchall(), ex.answer)
    else:
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            exec(compile(ex.code, ex.id, 'exec'), {})
        actual = output.getvalue().strip()
    assert actual == ex.answer == item['answer']
    assert ex.matches(ex.answer)
    if ex.response_mode == 'short':
        assert ex.matches(ex.answer.replace(', ', ','))
    assert all(ex.matches(allowed) for allowed in ex.accepted)
    assert all(not ex.matches(wrong) for wrong in item['distractor_hypotheses'])
    assert ex.version == 1 and ex.response_mode in ('choice', 'short')
    assert len(ex.hints) == 2 and ex.difficulty['rationale']
    assert item['requires'] == LEARNING_PATHS['items'][ex.id]['requires']


def test_all_119_deployed_exercises_are_unchanged_and_new_targets_are_gated():
    saved = json.loads(Path('tests/fixtures/catalog-before-expansion-20261019.json').read_text())
    assert len(saved['exercises']) == 119
    for identifier, expected in saved['exercises'].items():
        assert preserved('exercise', identifier, expected), identifier
        assert preserved('path', identifier, saved['path_items'][identifier]), identifier
    assert len(NEW) == 18 and len({BY_ID[x['id']].concept_id for x in NEW}) == 18
    assert [x['level'] for x in NEW].count(2) == [x['level'] for x in NEW].count(3) == 9
    assert LEARNING_PATHS['version'] == 'learning-paths-2.2'  # 2.0 rules preserved; 2.1 review variation, 2.2 support step-down and task-form mixing
    assert LEARNING_PATHS['rules'] == dict(level2_items=2, level2_days=2, level3_items=3,
                                         level3_days=3, level3_transfer_days=2,
                                         recovery_items=2, max_transfer_per_batch=1)
    for track in ('python', 'sql'):
        first = select_exercises(EXERCISES, [], {}, '2026-10-19', track=track)
        assert not {e.id for e, _ in first} & {x['id'] for x in NEW}


@pytest.mark.parametrize('labels', [['C', 'A', 'B'], ['B', 'C', 'A'], ['A', 'B', 'C']])
def test_label_mask_order_does_not_change_selected_labels(labels):
    df = pd.DataFrame({'amount': [10, 20, 30]}, index=['A', 'B', 'C'])
    selected = {'A': False, 'B': True, 'C': True}
    mask = pd.Series([selected[label] for label in labels], index=labels)
    assert df.loc[mask, 'amount'].tolist() == [20, 30]


@pytest.mark.parametrize('amount,expected', [(99, [1, 4]), (100, [1, 2, 4]), (101, [1, 2, 4])])
def test_union_has_inclusive_boundary_and_no_duplicate_rows(amount, expected):
    df = pd.DataFrame({'id': [1, 2, 3, 4], 'tier': ['gold', 'silver', 'silver', 'gold'], 'amount': [50, amount, 90, 120]})
    assert df[(df.tier == 'gold') | (df.amount >= 100)].id.tolist() == expected


@pytest.mark.parametrize('values,missing', [([4., None, 8.], 1), ([4., 0., 8.], 0), ([None, None], 2)])
def test_fill_return_does_not_mutate_original(values, missing):
    source = pd.Series(values, dtype=float)
    before = source.copy()
    clean = source.fillna(0)
    pd.testing.assert_series_equal(source, before)
    assert source.isna().sum() == missing and clean.isna().sum() == 0


@pytest.mark.parametrize('position,expected', [('first', ['B', 'D', 'C', 'A']), ('last', ['C', 'A', 'B', 'D'])])
def test_missing_sort_placement_is_separate_from_value_direction(position, expected):
    df = pd.DataFrame({'id': ['A', 'B', 'C', 'D'], 'score': [80., None, 90., None]})
    ordered = df.sort_values(['score', 'id'], ascending=[False, True], na_position=position)
    assert ordered.id.tolist() == expected
    complete = df.dropna()
    assert complete.sort_values('score', ascending=False, na_position=position).id.tolist() == ['C', 'A']


@pytest.mark.parametrize('last_key,default', [(None, 12), ('C', 22)])
def test_missing_group_key_can_remove_nonmissing_amount(last_key, default):
    df = pd.DataFrame({'team': ['A', 'A', 'B', last_key], 'amount': [2, 4, 6, 10]})
    assert df.groupby('team').amount.sum().sum() == default
    assert df.groupby('team', dropna=False).amount.sum().sum() == 22


@pytest.mark.parametrize('shape,expected', [((2, 3), (1, 3)), ((3, 2), (1, 2))])
def test_keepdims_retains_only_aggregated_axis_as_one(shape, expected):
    x = np.arange(6).reshape(shape)
    assert x.sum(axis=0, keepdims=True).shape == expected
    assert x.sum(axis=0).shape == (shape[1],)
    assert x.sum(axis=1, keepdims=True).shape == (shape[0], 1)


def test_wrong_axis_can_silently_execute_only_for_square_case():
    square = np.array([[2., 4.], [10., 14.]])
    wrong = square - square.mean(axis=1)
    right = square - square.mean(axis=1, keepdims=True)
    assert wrong[0].tolist() == [-1., -8.]
    assert right.tolist() == [[-1., 1.], [-2., 2.]]
    rectangle = np.array([[1., 2., 3.], [4., 5., 6.]])
    with pytest.raises(ValueError):
        rectangle - rectangle.mean(axis=1)
    assert (rectangle - rectangle.mean(axis=1, keepdims=True)).tolist() == [[-1., 0., 1.], [-1., 0., 1.]]


@pytest.mark.parametrize('values,expected', [([0, 0], []), ([0, 2, 4], [4, 6]), ([2, 4], [4, 6])])
def test_saved_mask_is_not_recomputed_after_update(values, expected):
    x = np.array(values)
    mask = x > 1
    original_mask = mask.copy()
    x += 2
    assert np.array_equal(mask, original_mask)
    assert x[mask].tolist() == expected
    assert x[x > 1].tolist() == [value + 2 for value in values]


@pytest.mark.parametrize('inplace,expected', [(False, ([11, 12, 13], [9, 2])), (True, ([9, 12, 13], [9, 12]))])
def test_rebinding_and_inplace_update_have_different_view_targets(inplace, expected):
    x = np.array([1, 2, 3])
    view = x[:2]
    if inplace:
        x += 10
    else:
        x = x + 10
    view[0] = 9
    assert (x.tolist(), view.tolist()) == expected
    assert np.shares_memory(x, view) == inplace


@pytest.mark.parametrize('amount,expected', [(99, [1]), (100, [1, 2]), (None, [1])])
@original('sql-condition-order-20261019')
def test_sql_precedence_low_done_and_nullable_open(amount, expected):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE orders(id, status, amount)')
        db.executemany('INSERT INTO orders VALUES(?,?,?)', [(1, 'done', 30), (2, 'open', amount), (3, 'cancel', 200)])
        assert [row[0] for row in db.execute(BY_ID['sql-condition-order-20261019'].code)] == expected


@pytest.mark.parametrize('rows,expected', [
    ([('done', 10), ('done', 30), ('open', 50)], (20., 13.33)),
    ([('open', 50)], (None, 0.)),
    ([], (None, None)),
    ([('done', None), ('done', 10), ('open', 50)], (10., 5.)),
])
@original('sql-conditional-average-20261019')
def test_conditional_average_distinguishes_no_matches_empty_and_null_amount(rows, expected):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE orders(status, amount)')
        db.executemany('INSERT INTO orders VALUES(?, ?)', rows)
        assert db.execute(BY_ID['sql-conditional-average-20261019'].code).fetchone() == expected


@pytest.mark.parametrize('extra_customer,expected', [(False, (20, 13)), (True, (30, 13))])
@original('sql-customer-totals-20261019')
def test_preaggregate_preserves_same_budget_and_customers_without_orders(extra_customer, expected):
    with sqlite3.connect(':memory:') as db:
        db.executescript(BY_ID['sql-customer-totals-20261019'].reference_setup)
        if extra_customer:
            db.execute('INSERT INTO customers VALUES(3,10)')
        assert db.execute(BY_ID['sql-customer-totals-20261019'].code).fetchone() == expected
        assert db.execute('SELECT SUM(DISTINCT budget) FROM customers').fetchone()[0] == 10


@pytest.mark.parametrize('factor,expected', [(-2, (1., 2.)), (0, (5., 0.)), (2, (9., 2.))])
def test_affine_scale_changes_spread_by_absolute_factor(factor, expected):
    y = factor * np.array([1., 3.]) + 5
    assert (float(y.mean()), float(y.std(ddof=0))) == expected


@pytest.mark.parametrize('extra_desktop,expected', [(0, .25), (4, .125)])
def test_joint_rate_changes_but_conditional_rate_stays(extra_desktop, expected):
    events = [('mobile', 1), ('mobile', 0), ('desktop', 1), ('desktop', 0)] + [('desktop', 0)] * extra_desktop
    mobile = [value for device, value in events if device == 'mobile']
    assert sum(mobile) / len(events) == expected
    assert sum(mobile) / len(mobile) == .5


@pytest.mark.parametrize('size,expected_train', [(6, [0, 1]), (8, [0, 1, 2, 3])])
def test_time_splits_expand_without_future_training_rows(size, expected_train):
    splits = list(TimeSeriesSplit(n_splits=2, test_size=2).split([[i] for i in range(size)]))
    assert splits[0][0].tolist() == expected_train
    for train, valid in splits:
        assert max(train) < min(valid) and len(valid) == 2
    assert set(splits[0][0]) < set(splits[1][0])


def test_transform_preserves_state_and_refit_replaces_it_without_rewriting_old_float():
    scaler = StandardScaler().fit([[0.], [2.]])
    earlier = float(scaler.transform([[4.]])[0, 0])
    scaler.transform([[100.]])
    assert scaler.mean_.tolist() == [1.] and scaler.scale_.tolist() == [1.]
    scaler.fit([[10.], [14.]])
    assert scaler.mean_.tolist() == [12.] and scaler.scale_.tolist() == [2.]
    assert earlier == 3. and float(scaler.transform([[4.]])[0, 0]) == -4.


@pytest.mark.parametrize('threshold,expected', [(.5, 1.), (.6, 1.), (.8, .5), (.9, .5)])
def test_recall_threshold_boundary_and_actual_positive_denominator(threshold, expected):
    y_true = [1, 0, 1, 0]
    scores = [.9, .7, .6, .1]
    predicted = [int(value >= threshold) for value in scores]
    assert recall_score(y_true, predicted) == expected


@pytest.mark.parametrize('neighbors,expected', [(1, 10.), (2, 5.), (3, 110 / 3)])
def test_regression_averages_selected_targets_not_coordinates(neighbors, expected):
    model = KNeighborsRegressor(n_neighbors=neighbors, weights='uniform').fit([[0.], [2.], [8.]], [0., 10., 100.])
    assert model.predict([[1.5]])[0] == pytest.approx(expected)
