"""Real API boundaries, individually reviewed examples, and historical preservation."""
import contextlib
from dataclasses import asdict
import hashlib
import io
import json
import math
from pathlib import Path
import sqlite3

import numpy as np
import pandas as pd
import pytest

from backend.content import BY_ID, EXERCISES
from backend.curriculum import LEARNING_PATHS, select_exercises
from scripts.validate_sql_content import sql_output, visible_setup

REVIEW = json.loads(Path('curriculum/reviews/2026-10-21-expansion.json').read_text())
NEW = REVIEW['exercises']


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def test_existing_159_items_paths_cards_drafts_concepts_and_rules_survive():
    saved = json.loads(Path('tests/fixtures/catalog-before-expansion-20261021.json').read_text())
    assert len(saved['exercises']) == 159
    for key, expected in saved['exercises'].items():
        assert digest(asdict(BY_ID[key])) == expected, key
        assert digest(LEARNING_PATHS['items'][key]) == saved['path_items'][key], key
    bank = json.loads(Path('curriculum/problem_bank.json').read_text())
    cards = {card['id']: card for card in bank['exercises']}
    for key, expected in saved['design_cards'].items():
        assert digest(cards[key]) == expected, key
    assert digest(bank['concepts']) == saved['concepts']
    assert LEARNING_PATHS['rules'] == saved['rules']
    assert LEARNING_PATHS['version'] == 'learning-paths-2.2'  # 2.0 rules preserved; 2.1 review variation, 2.2 support step-down and task-form mixing
    added = {item['id'] for item in NEW}
    assert len(added) == 18 and not added & saved['exercises'].keys()
    assert added | saved['exercises'].keys() <= BY_ID.keys()
    assert len(BY_ID) == len(EXERCISES)
    assert [sum(item['level'] == level for item in NEW) for level in (1, 2, 3)] == [6, 6, 6]
    assert sum(item['domain'] == 'SQL' for item in NEW) == 3


@pytest.mark.parametrize('item', NEW, ids=lambda item: item['id'])
def test_reviewed_reference_and_diagnostic_alternatives(item):
    ex = BY_ID[item['id']]
    if ex.domain == 'SQL':
        with sqlite3.connect(':memory:') as db:
            db.executescript(visible_setup(ex.code))
            actual = sql_output(db.execute(ex.code).fetchall(), ex.answer)
    else:
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            exec(compile(ex.code, ex.id, 'exec'), {})
        actual = output.getvalue().strip()
    assert actual == item['answer'] == ex.answer == ex.reference_output
    assert sum(ex.matches(choice) for choice in ex.choices) == 1
    assert all(not ex.matches(wrong) for wrong in item['distractor_hypotheses'])
    assert ex.matches(ex.answer.replace(', ', ','))
    assert ex.matches('  ' + ex.answer + '  ')
    assert item['requires'] == LEARNING_PATHS['items'][ex.id]['requires']
    assert item['boundary_check'] and item['diagnostic_question']
    assert len(ex.hints) == 2 and ex.version == 1


@pytest.mark.parametrize('track', ['python', 'sql'])
def test_fresh_learner_only_receives_foundations_from_new_batch(track):
    selected = select_exercises(EXERCISES, [], {}, '2026-10-21', track=track)
    added = {item['id'] for item in NEW}
    assert all(ex.level == 1 for ex, _ in selected if ex.id in added)


@pytest.mark.parametrize('values', [[], [1], [1, 2, 3]])
def test_column_type_depends_on_selection_not_row_count(values):
    df = pd.DataFrame({'amount': values})
    assert isinstance(df['amount'], pd.Series)
    assert not isinstance(df[['amount']], pd.Series)
    assert isinstance(df[['amount']], pd.DataFrame)


@pytest.mark.parametrize('value,numeric', [(0, True), (-2, True), (2.5, True),
                                         (False, False), (True, False), ('2', False), (None, False)])
def test_numeric_type_policy_is_not_coercion_and_excludes_booleans(value, numeric):
    actual = isinstance(value, (int, float)) and not isinstance(value, bool)
    assert actual is numeric
    assert isinstance(False, int) and isinstance(True, int)
    class Count(int):
        pass
    assert isinstance(Count(2), int)  # isinstance differs from type(x) is int.


@pytest.mark.parametrize('values', [[-2, 0, 5], [-1, -2], [0, 2], []])
def test_where_retains_length_and_source_and_differs_from_filter_and_mask(values):
    source = np.array(values, dtype=int)
    series = pd.Series(values, dtype=int)
    expected = [value if value >= 0 else 9 for value in values]
    result = np.where(source >= 0, source, 9)
    assert result.tolist() == series.where(series >= 0, 9).tolist() == expected
    assert len(result) == len(values)
    assert source.tolist() == series.tolist() == values
    assert series[series >= 0].tolist() == [value for value in values if value >= 0]
    assert series.mask(series >= 0, 9).tolist() == [9 if value >= 0 else value for value in values]
    if len(result):
        result[0] = 99
        assert source.tolist() == values


@pytest.mark.parametrize('labels', [['a', 'b', 'c'], ['b', 'c', 'a'], ['c', 'a', 'b']])
def test_where_uses_replacement_labels_independently_of_order(labels):
    values = dict(a=10, b=20, c=30)
    source = pd.Series([-1, 5, -3], index=['a', 'b', 'c'])
    replacement = pd.Series([values[key] for key in labels], index=labels)
    assert source.where(source >= 0, replacement).tolist() == [10, 5, 30]
    missing = source.where(source >= 0, replacement.drop('a'))
    assert pd.isna(missing['a']) and missing['b'] == 5 and missing['c'] == 30


@pytest.mark.parametrize('values,columns', [([[-1, 2], [-3, -4]], [10, 20]),
                                          ([[-1, 2, -3]], [7, 8, 9]),
                                          ([[1], [-2], [0]], [6])])
def test_where_broadcasts_last_axis_not_rows(values, columns):
    x = np.array(values)
    expected = [[value if value > 0 else columns[col] for col, value in enumerate(row)] for row in values]
    assert np.where(x > 0, x, np.array(columns)).tolist() == expected
    if x.shape == (2, 2):
        assert np.where(x > 0, x, np.array(columns).reshape(2, 1)).tolist() == [[10, 2], [20, 20]]


@pytest.mark.parametrize('candidates', [[], ['a'], ['b', 'a'], ['a', 'b', 'b'], ['c']])
def test_membership_preserves_source_order_duplicates_and_mask_shape(candidates):
    values = ['b', 'a', 'b', 'c']
    array = np.array(values)
    expected = [value in candidates for value in values]
    assert np.isin(array, candidates).tolist() == pd.Series(values).isin(candidates).tolist() == expected
    assert array[np.isin(array, candidates)].tolist() == [value for value in values if value in candidates]
    matrix = array.reshape(2, 2)
    assert np.isin(matrix, candidates).shape == (2, 2)
    assert np.isin(matrix, candidates).ravel().tolist() == expected


@pytest.mark.parametrize('labels', [[20], [999], ['anything']])
def test_series_membership_uses_candidate_values_not_candidate_index(labels):
    series = pd.Series([10, 20, 10], index=[5, 8, 9])
    assert series[series.isin(pd.Series([10], index=labels))].index.tolist() == [5, 9]
    assert series[series.isin(pd.Series([20], index=labels))].index.tolist() == [8]
    assert pd.Series(['10', '20']).isin([10]).tolist() == [False, False]


@pytest.mark.parametrize('values,finite,nonnull', [([0., -2., 1e300], 3, 3),
                                                ([np.nan], 0, 0),
                                                ([np.inf, -np.inf], 0, 2),
                                                ([1., np.inf, np.nan, -np.inf], 1, 3),
                                                ([], 0, 0)])
def test_finite_and_missing_are_different_predicates(values, finite, nonnull):
    series = pd.Series(values, dtype=float)
    assert int(np.isfinite(series).sum()) == finite
    assert int(series.notna().sum()) == nonnull
    assert np.isfinite(np.array(values)).tolist() == [math.isfinite(value) for value in values]


@pytest.mark.parametrize('values,expected', [([10., np.nan, np.inf, 20.], 15.),
                                          ([0., -4., -np.inf], -2.),
                                          ([np.nan, 7.], 7.),
                                          ([np.nan, np.inf, -np.inf], None), ([], None)])
def test_finite_mean_uses_selected_denominator_and_handles_empty_selection(values, expected):
    array = np.array(values, dtype=float)
    selected = array[np.isfinite(array)]
    if expected is None:
        assert selected.size == 0  # Callers need an explicit policy; do not hide the empty mean warning.
    else:
        assert selected.mean() == expected
    if values and values[0] == 10.:
        assert np.isinf(np.nanmean(array))


@pytest.mark.parametrize('values,expected', [([1., True, float('inf'), '2', None, -3], [1., -3]),
                                          ([False, float('nan'), float('-inf')], []),
                                          ([0, -2.5, '0'], [0, -2.5]), ([], [])])
def test_type_policy_protects_finite_check_by_short_circuit(values, expected):
    assert [value for value in values if isinstance(value, (int, float))
            and not isinstance(value, bool) and math.isfinite(value)] == expected
    for bad in ('2', None):
        with pytest.raises(TypeError):
            math.isfinite(bad)


@pytest.mark.parametrize('amounts', [[-2, 0, 5], [None, -1], [], [1, 2]])
def test_case_keeps_rows_while_where_removes_them(amounts):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE orders(id INTEGER, amount INTEGER)')
        db.executemany('INSERT INTO orders VALUES(?,?)', enumerate(amounts, 1))
        actual = [row[0] for row in db.execute(BY_ID['sql-case-values-20261021'].code)]
        assert actual == [value if value is not None and value >= 0 else 0 for value in amounts]
        assert len(actual) == len(amounts)
        filtered = db.execute('SELECT amount FROM orders WHERE amount >= 0 ORDER BY id').fetchall()
        assert filtered == [(value,) for value in amounts if value is not None and value >= 0]


@pytest.mark.parametrize('allowed', [[], [None], [2], [2, 2, None], [1, 3]])
def test_in_duplicates_do_not_multiply_source_rows_and_null_is_not_a_wildcard(allowed):
    with sqlite3.connect(':memory:') as db:
        db.executescript('CREATE TABLE orders(id INTEGER); INSERT INTO orders VALUES(1),(2),(2),(3); CREATE TABLE allowed(id INTEGER);')
        db.executemany('INSERT INTO allowed VALUES(?)', [(value,) for value in allowed])
        actual = [row[0] for row in db.execute(BY_ID['sql-membership-duplicates-20261021'].code)]
        assert actual == [value for value in [1, 2, 2, 3] if value in allowed]
        joined = db.execute('SELECT COUNT(*) FROM orders JOIN allowed ON orders.id=allowed.id').fetchone()[0]
        assert joined == sum(allowed.count(value) for value in [1, 2, 2, 3])


@pytest.mark.parametrize('statuses', [[], ['done'], ['open', None], ['done', 'done', None], ['open', 'done', None]])
def test_count_counts_zero_but_omitted_case_else_is_null(statuses):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE orders(status TEXT)')
        db.executemany('INSERT INTO orders VALUES(?)', [(value,) for value in statuses])
        assert db.execute(BY_ID['sql-case-counts-20261021'].code).fetchone() == (len(statuses), statuses.count('done'))
