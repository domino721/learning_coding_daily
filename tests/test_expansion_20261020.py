"""Individual reference, independent counterexample, and preservation checks."""
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
from sklearn.metrics import f1_score
from sklearn.model_selection import GroupKFold, KFold
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

from backend.content import BY_ID, EXERCISES
from backend.curriculum import LEARNING_PATHS, select_exercises
from scripts.validate_sql_content import sql_output, visible_setup

REVIEW = json.loads(Path('curriculum/reviews/2026-10-20-expansion.json').read_text())
NEW = REVIEW['exercises']


@pytest.mark.parametrize('item', NEW, ids=lambda item: item['id'])
def test_each_new_authored_example_matches_review_and_has_one_answer(item):
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
    assert actual == ex.answer == item['answer']
    assert sum(ex.matches(choice) for choice in ex.choices) == 1
    assert all(not ex.matches(wrong) for wrong in item['distractor_hypotheses'])
    assert all(ex.matches(allowed) for allowed in ex.accepted)
    assert ex.matches('  ' + ex.answer + '  ')
    assert ex.matches(ex.answer.replace(', ', ','))
    assert item['requires'] == LEARNING_PATHS['items'][ex.id]['requires']
    assert ex.version == 1 and ex.seconds in (120, 180)
    assert len(ex.hints) == 2 and item['boundary_check'] and item['diagnostic_question']


def digest(value):
    encoded = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()
    return hashlib.sha256(encoded).hexdigest()


def test_142_existing_exercises_paths_rules_and_concepts_are_preserved():
    saved = json.loads(Path('tests/fixtures/catalog-before-expansion-20261020.json').read_text())
    assert len(saved['exercises']) == 142
    for identifier, expected in saved['exercises'].items():
        assert digest(asdict(BY_ID[identifier])) == expected, identifier
        assert digest(LEARNING_PATHS['items'][identifier]) == saved['path_items'][identifier], identifier
    assert LEARNING_PATHS['rules'] == saved['rules']
    bank = json.loads(Path('curriculum/problem_bank.json').read_text())
    assert digest(bank['concepts']) == saved['concepts']
    assert LEARNING_PATHS['version'] == 'learning-paths-2.0'
    assert len(NEW) == 12 and len(EXERCISES) == 154
    assert sum(item['level'] == 2 for item in NEW) == 5
    assert sum(item['level'] == 3 for item in NEW) == 7
    for track in ('python', 'sql'):
        selected = select_exercises(EXERCISES, [], {}, '2026-10-20', track=track)
        assert not {ex.id for ex, _ in selected} & {item['id'] for item in NEW}


@pytest.mark.parametrize('order,first', [(['A', 'B', 'C', 'D'], ['B', 'A']),
                                        (['C', 'D', 'A', 'B'], ['C', 'D'])])
def test_sort_before_limit_preserves_global_top_candidates(order, first):
    values = dict(A=10, B=90, C=80, D=70)
    df = pd.DataFrame({'id': order, 'amount': [values[k] for k in order]})
    assert df.head(2).sort_values('amount', ascending=False).id.tolist() == first
    assert df.sort_values('amount', ascending=False).head(2).id.tolist() == ['B', 'C']
    assert df.head(0).sort_values('amount').empty


@pytest.mark.parametrize('buyers,expected', [([1, 1, 2, None], (4, 3, 2)),
                                           ([1, 1, 2, None, 1], (5, 4, 2)),
                                           ([1, 1, 2, None, 3], (5, 4, 3)),
                                           ([None, None], (2, 0, 0))])
def test_customer_counts_distinguish_rows_known_and_unique(buyers, expected):
    values = pd.Series(buyers)
    assert (values.size, values.count(), values.nunique()) == expected
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE visits(user_id INTEGER)')
        db.executemany('INSERT INTO visits VALUES(?)', [(value,) for value in buyers])
        assert db.execute('SELECT COUNT(*), COUNT(user_id), COUNT(DISTINCT user_id) FROM visits').fetchone() == expected


@pytest.mark.parametrize('rows,cols', [(2, 3), (3, 2), (1, 6), (6, 1)])
def test_reshape_preserves_flat_order_but_changes_column_membership(rows, cols):
    result = np.arange(6).reshape(rows, cols)
    assert result.ravel().tolist() == list(range(6))
    # Independent positional formula; no fixed expected array copied from the question.
    for col in range(cols):
        assert result[:, col].tolist() == [row * cols + col for row in range(rows)]


@pytest.mark.parametrize('copy_slice', [True, False])
def test_chained_assignment_distinguishes_temporaries_views_and_direct_writes(copy_slice):
    source = np.array([1, 4, 7])
    source[source >= 4][0] = 0
    assert source.tolist() == [1, 4, 7]
    part = source[1:].copy() if copy_slice else source[1:]
    part[0] = 9
    assert source.tolist() == ([1, 4, 7] if copy_slice else [1, 9, 7])
    source[source >= 4] = 0
    assert source.tolist() == [1, 0, 0]


@pytest.mark.parametrize('extra,expected', [(None, (3, 6)), (('C', 1), (3, 9)), (('A', 2), (3, 6))])
def test_composite_key_prevents_cross_organization_fanout(extra, expected):
    with sqlite3.connect(':memory:') as db:
        ex = BY_ID['sql-composite-match-20261020']
        db.executescript(visible_setup(ex.code))
        if extra:
            db.execute('INSERT INTO users VALUES(?,?)', extra)
        composite = db.execute(ex.code).fetchone()[0]
        id_only = db.execute('SELECT COUNT(*) FROM users u JOIN orders o ON u.user_id=o.user_id').fetchone()[0]
        assert (composite, id_only) == expected


@pytest.mark.parametrize('a,b,pooled', [([1, 2, 100], [3, 4, 5], 3.5),
                                      ([1, 2, 3], [3, 4, 5], 3.0)])
def test_group_medians_can_agree_or_disagree_with_pooled_median(a, b, pooled):
    assert np.median([np.median(a), np.median(b)]) == 3
    assert np.median(a + b) == pooled


@pytest.mark.parametrize('extra_visit', [False, True])
def test_nonbuying_repeat_visit_changes_only_session_denominator(extra_visit):
    visits = [('A', 0), ('A', 1), ('B', 0), ('C', 0), ('C', 1)]
    if extra_visit:
        visits.append(('A', 0))
    df = pd.DataFrame(visits, columns=['user', 'bought'])
    assert df.bought.mean() == 2 / len(visits)
    assert df.groupby('user').bought.max().mean() == 2 / 3


@pytest.mark.parametrize('query,expected', [(1., 0), (0., 0), (4., 1)])
def test_distance_vote_and_exact_match_boundary(query, expected):
    x, y = [[0.], [4.], [5.]], [0, 1, 1]
    uniform = KNeighborsClassifier(n_neighbors=3, weights='uniform').fit(x, y)
    distance = KNeighborsClassifier(n_neighbors=3, weights='distance').fit(x, y)
    assert uniform.predict([[query]]).tolist() == [1]
    assert distance.predict([[query]]).tolist() == [expected]


@pytest.mark.parametrize('truth,pred,expected', [([1, 1, 1, 0], [1, 0, 0, 0], .5),
                                              ([1, 1, 1, 0, 0], [1, 0, 0, 0, 0], .5),
                                              ([1, 0], [1, 0], 1.),
                                              ([1, 0], [0, 0], 0.)])
def test_f1_ignores_added_true_negatives_but_penalizes_missed_positives(truth, pred, expected):
    assert f1_score(truth, pred) == expected


@pytest.mark.parametrize('first,expected', [(5., 0.), (7., 2.), (4., -1.)])
def test_constant_training_feature_keeps_mean_subtraction_for_new_data(first, expected):
    scaler = StandardScaler().fit([[5., 0.], [5., 2.]])
    assert scaler.mean_.tolist() == [5., 1.]
    assert scaler.var_.tolist() == [0., 1.]
    assert scaler.scale_.tolist() == [1., 1.]
    assert scaler.transform([[first, 3.]]).tolist() == [[expected, 2.]]


@pytest.mark.parametrize('groups', [['A', 'B', 'A', 'B'], ['A', 'A', 'B', 'B'], ['B', 'A', 'B', 'A']])
def test_group_isolation_is_independent_of_row_order(groups):
    x = np.arange(4).reshape(-1, 1)
    labels = np.array(groups)
    for train, valid in GroupKFold(n_splits=2).split(x, groups=labels):
        assert not set(labels[train]) & set(labels[valid])
        assert set(train) | set(valid) == set(range(4))
    train, valid = next(KFold(n_splits=2).split(x))
    assert bool(set(labels[train]) & set(labels[valid])) == (groups[0] != groups[1])
