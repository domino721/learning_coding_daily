"""API semantics, independent boundary oracles, and published-catalog preservation."""
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

from backend.content import BY_ID, EXERCISES
from backend.curriculum import LEARNING_PATHS, select_exercises
from scripts.validate_sql_content import sql_output, visible_setup

REVIEW = json.loads(Path('curriculum/reviews/2026-10-23-expansion.json').read_text())
NEW = REVIEW['exercises']


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':')).encode()).hexdigest()


def test_all_187_existing_questions_paths_cards_drafts_concepts_and_rules_survive():
    old = json.loads(Path('tests/fixtures/catalog-before-expansion-20261023.json').read_text())
    assert len(old['exercises']) == 187
    for key, expected in old['exercises'].items():
        assert digest(asdict(BY_ID[key])) == expected, key
        assert digest(LEARNING_PATHS['items'][key]) == old['path_items'][key], key
    bank = json.loads(Path('curriculum/problem_bank.json').read_text())
    cards = {card['id']: card for card in bank['exercises']}
    for key, expected in old['design_cards'].items():
        assert digest(cards[key]) == expected, key
    assert digest(bank['concepts']) == old['concepts']
    assert LEARNING_PATHS['rules'] == old['rules']
    assert LEARNING_PATHS['version'] == 'learning-paths-2.2'  # 2.0 rules preserved; 2.1 review variation, 2.2 support step-down and task-form mixing
    added = {item['id'] for item in NEW}
    assert len(added) == 14 and not added & old['exercises'].keys()
    assert added | old['exercises'].keys() <= BY_ID.keys()
    assert len(BY_ID) == len(EXERCISES)
    assert [sum(item['level'] == level for item in NEW) for level in (1, 2, 3)] == [4, 5, 5]


@pytest.mark.parametrize('item', NEW, ids=lambda item: item['id'])
def test_reference_single_answer_hints_and_reviewed_path(item):
    ex = BY_ID[item['id']]
    if ex.domain == 'SQL':
        with sqlite3.connect(':memory:') as db:
            db.executescript(visible_setup(ex.code))
            actual = sql_output(db.execute(ex.code).fetchall(), ex.answer)
    else:
        stream = io.StringIO()
        with contextlib.redirect_stdout(stream):
            exec(compile(ex.code, ex.id, 'exec'), {})
        actual = stream.getvalue().strip()
    assert actual == item['answer'] == ex.answer == ex.reference_output
    assert sum(ex.matches(choice) for choice in ex.choices) == 1
    assert all(not ex.matches(wrong) for wrong in item['distractor_hypotheses'])
    assert ex.matches(ex.answer.replace(', ', ','))
    assert item['requires'] == LEARNING_PATHS['items'][ex.id]['requires']
    assert item['diagnostic_question'] and item['boundary_check']
    assert len(ex.hints) == 2 and ex.version == 1


@pytest.mark.parametrize('track', ['python', 'sql'])
def test_new_learners_do_not_skip_new_foundations(track):
    selected = select_exercises(EXERCISES, [], {}, '2026-10-23', track=track)
    assert all(ex.level == 1 for ex, _ in selected)


@pytest.mark.parametrize('values', [[], [0], [1, 1], [0, 9, 0, 5]])
def test_where_positions_can_reconstruct_values(values):
    x = np.array(values)
    positions = np.where(x > 0)[0]
    assert positions.tolist() == [i for i, value in enumerate(values) if value > 0]
    assert x[positions].tolist() == [value for value in values if value > 0]


@pytest.mark.parametrize('values', [[[0, 5, 0], [8, 0, 0]], [[1, 2, 3]], [[0], [0]]])
def test_two_dimensional_coordinates_are_paired_by_position(values):
    x = np.array(values)
    rows, cols = np.where(x > 0)
    expected = [(i, j) for i, row in enumerate(values) for j, value in enumerate(row) if value > 0]
    assert list(zip(rows.tolist(), cols.tolist())) == expected
    assert x[rows, cols].tolist() == [values[i][j] for i, j in expected]


@pytest.mark.parametrize('values', [[0., 4.], [0.], [2., 4.], []])
def test_where_selects_after_evaluation_but_ufunc_where_protects_operation(values):
    x = np.array(values)
    with np.errstate(divide='raise', invalid='raise'):
        if 0. in values:
            with pytest.raises(FloatingPointError):
                np.where(x != 0, 12 / x, 0.)
        else:
            assert np.where(x != 0, 12 / x, 0.).tolist() == [12 / v for v in values]
        safe = np.divide(12, x, out=np.zeros_like(x), where=x != 0)
    assert safe.tolist() == [12 / v if v else 0. for v in values]


@pytest.mark.parametrize('rules', [dict(a=[1], b=[2]), dict(b=[2], a=[1]), dict(a=[1]), dict(a=[], b=[])])
def test_dataframe_isin_dict_keys_are_columns_and_missing_rules_are_false(rules):
    df = pd.DataFrame({'a': [1, 2, 1], 'b': [2, 1, 1]})
    mask = df.isin(rules)
    expected = [[value in rules.get(col, []) for col, value in zip(df.columns, row)]
                for row in df.values.tolist()]
    assert mask.values.tolist() == expected
    assert mask.all(axis=1).tolist() == [all(row) for row in expected]
    assert df.isin([1, 2]).all(axis=1).tolist() == [True, True, True]
    assert pd.DataFrame(columns=['a', 'b']).isin(rules).shape == (0, 2)


@pytest.mark.parametrize('values', [[[1., np.nan], [2., 3.], [np.inf, 4.]],
                                  [[np.nan], [-np.inf]], [[0.], [-2.]], [[1., 2., 3.]]])
def test_finite_rows_keep_structure_and_differ_from_cell_selection(values):
    x = np.array(values)
    expected = [row for row in values if all(np.isfinite(value) for value in row)]
    kept = x[np.isfinite(x).all(axis=1)]
    assert kept.tolist() == expected
    assert kept.shape == (len(expected), x.shape[1])
    assert x[np.isfinite(x)].ndim == 1


def test_all_reduces_requested_axis_and_empty_axes_have_explicit_semantics():
    mask = np.array([[True, True], [True, False], [False, False]])
    assert mask.all(axis=1).tolist() == [True, False, False]
    assert mask.any(axis=1).tolist() == [True, True, False]
    assert mask.all(axis=0).tolist() == [False, False]
    assert np.empty((0, 2), dtype=bool).all(axis=1).tolist() == []
    assert np.empty((2, 0), dtype=bool).all(axis=1).tolist() == [True, True]


def test_finite_inputs_can_generate_nonfinite_results_even_when_warnings_are_ignored():
    top = np.array([10., 0., 9., -9., 1e308])
    bottom = np.array([2., 0., 0., 0., 1e-308])
    assert np.isfinite(top).all() and np.isfinite(bottom).all()
    with np.errstate(divide='ignore', invalid='ignore', over='ignore'):
        result = top / bottom
    assert result[0] == 5.
    assert np.isnan(result[1]) and np.isposinf(result[2]) and np.isneginf(result[3])
    assert np.isposinf(result[4])
    assert np.isfinite(result).tolist() == [True, False, False, False, False]


@pytest.mark.parametrize('value,allowed', [(0, True), (-3, True), (np.int32(1), True),
                                        (np.int64(-2), True), (True, False), (False, False),
                                        (np.bool_(True), False), (2.5, False), ('4', False)])
def test_integer_input_policy_covers_numpy_without_coercing_other_values(value, allowed):
    assert bool(isinstance(value, (int, np.integer)) and not isinstance(value, bool)) is allowed


def test_array_coercion_changes_scalar_type_but_preserves_original_list():
    raw = [2, True]
    regular = np.array(raw)
    objects = np.array(raw, dtype=object)
    assert isinstance(raw[1], bool)
    assert isinstance(regular[1], np.integer) and not isinstance(regular[1], bool)
    assert regular[1] == 1
    assert isinstance(objects[1], bool)
    assert isinstance(np.array([True])[0], np.bool_)


@pytest.mark.parametrize('rows', [[], [(1, 10, 2)], [(1, 0, 0), (2, 9, None)],
                                [(1, None, 2), (2, -10, 2), (3, 10, -2)]])
def test_sql_nullif_divisor_policy_keeps_all_rows(rows):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE measures(id INTEGER, amount REAL, base REAL)')
        db.executemany('INSERT INTO measures VALUES(?,?,?)', rows)
        result = db.execute(BY_ID['sql-nullif-ratio-20261023'].code).fetchall()
    assert result == [(amount / base if amount is not None and base not in (0, None) else -1,)
                      for _, amount, base in rows]


@pytest.mark.parametrize('blocked,expected', [([], 3), ([None], 0), ([1], 1),
                                          ([1, None], 0), ([1, 1], 1), ([8], 2)])
def test_sql_empty_membership_is_distinct_from_a_null_member(blocked, expected):
    with sqlite3.connect(':memory:') as db:
        db.executescript(visible_setup(BY_ID['sql-empty-membership-20261023'].code))
        db.executemany('INSERT INTO blocked VALUES(?)', [(value,) for value in blocked])
        assert db.execute(BY_ID['sql-empty-membership-20261023'].code).fetchone() == (expected,)
