"""Independent boundary calculations; authored code runs only in test processes."""
from dataclasses import asdict
import hashlib
import itertools
import json
from pathlib import Path
import sqlite3

import numpy as np
import pandas as pd
import pytest
from sklearn.neighbors import KNeighborsClassifier

from backend.content import BY_ID, EXERCISES
from backend.curriculum import LEARNING_PATHS


def test_previous_182_exercises_paths_cards_and_rules_are_preserved():
    saved = json.loads(Path('tests/fixtures/catalog-before-daily-20261023.json').read_text())
    digest = lambda value: hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
    assert len(saved['exercises']) == 182 and LEARNING_PATHS['rules'] == saved['rules']
    for identifier, expected in saved['exercises'].items():
        assert digest(asdict(BY_ID[identifier])) == expected, identifier
        assert digest(LEARNING_PATHS['items'][identifier]) == saved['path_items'][identifier]
    cards = {card['id']: card for card in json.loads(Path('curriculum/problem_bank.json').read_text())['exercises']}
    for identifier, expected in saved['design_cards'].items():
        assert digest(cards[identifier]) == expected, identifier
    batch = json.loads(Path('backend/content_batches/2026-10-23.json').read_text())
    added = {e['id'] for e in batch['exercises']}
    assert batch['batch_id'] == 'codex-2026-10-23' and len(added) == 5
    assert not added & saved['exercises'].keys() and added <= BY_ID.keys()
    assert len(BY_ID) == len(EXERCISES)


@pytest.mark.parametrize('teams,amounts', [([], []), (['B','A','B','A'], [2,5,3,7]),
    (['A','A'], [3,-5]), (['A','B','A'], [0,0,0]), (['B','A'], [-2,4])])
def test_grouped_cumulative_matches_separate_running_ledgers(teams, amounts):
    df = pd.DataFrame({'team': pd.Series(teams, dtype=object), 'amount': pd.Series(amounts, dtype='int64')}, index=range(len(teams)))
    df.index = range(10, 10 + len(teams))
    before = df.copy(deep=True)
    totals, expected = {}, []
    for team, amount in zip(teams, amounts):
        totals[team] = totals.get(team, 0) + amount
        expected.append(totals[team])
    for sort in (False, True):
        actual = df.groupby('team', sort=sort)['amount'].cumsum()
        assert actual.tolist() == expected and actual.index.tolist() == df.index.tolist()
    pd.testing.assert_frame_equal(df, before)


@pytest.mark.parametrize('shape', [(0,), (1,), (3,), (2,3), (0,2)])
def test_stack_adds_an_axis_while_concatenate_extends_existing_axis(shape):
    a = np.arange(np.prod(shape), dtype=int).reshape(shape)
    b = a + 10
    before = (a.copy(), b.copy())
    stacked, joined = np.stack([a,b],axis=0), np.concatenate([a,b],axis=0)
    assert stacked.shape == (2, *shape)
    assert joined.shape == (2*shape[0], *shape[1:])
    assert stacked[0].tolist() == a.tolist() and stacked[1].tolist() == b.tolist()
    assert joined.tolist() == a.tolist() + b.tolist()
    assert stacked.size == joined.size == 2*a.size
    np.testing.assert_array_equal(a, before[0])
    np.testing.assert_array_equal(b, before[1])


def test_stack_rejects_mismatched_shapes_even_when_concatenate_can_join():
    a, b = np.array([1]), np.array([2,3])
    with pytest.raises(ValueError):
        np.stack([a,b])
    assert np.concatenate([a,b]).tolist() == [1,2,3]


@pytest.mark.parametrize('query,k', [([0.,3.],1), ([0.,3.],2), ([0.,3.],3), ([2.,0.],2), ([0.,5.],2)])
def test_neighbor_indices_follow_full_coordinate_distance_and_training_row_order(query,k):
    original = [[0.,0.], [3.,0.], [0.,4.]]
    for permutation in itertools.permutations(range(3)):
        x = [original[index] for index in permutation]
        # Deliberately unrelated labels cannot change kneighbors indices.
        for labels in (['A','B','C'], ['C','C','A']):
            model = KNeighborsClassifier(n_neighbors=k).fit(x,labels)
            squared = [sum((a-b)**2 for a,b in zip(row,query)) for row in x]
            assert len(set(squared)) == 3  # No library tie-breaking assumption.
            expected = sorted(range(3), key=lambda index:squared[index])[:k]
            assert model.kneighbors([query],return_distance=False).tolist() == [expected]


@pytest.mark.parametrize('rows', [[], [(1,4)], [(3,3),(1,2),(2,5)], [(2,-3),(1,4),(3,0)],
    [(1,None),(2,2),(3,None),(4,-1)], [(1,None),(2,None)]])
def test_window_preserves_rows_and_sums_only_prefix_non_null_values(rows):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE sales(id INTEGER, amount INTEGER)')
        db.executemany('INSERT INTO sales VALUES(?,?)', rows)
        actual = [row[0] for row in db.execute(BY_ID['sql-running-window-20261023'].code)]
    total, seen, expected = 0, False, []
    for _, amount in sorted(rows):
        if amount is not None:
            total += amount
            seen = True
        expected.append(total if seen else None)
    assert actual == expected and len(actual) == len(rows)


@pytest.mark.parametrize('rows,limit,offset', [([],2,1), ([(1,4)],2,1),
    ([(1,50),(2,90),(3,90),(4,10)],2,1), ([(4,10),(3,90),(2,90),(1,50)],2,1),
    ([(1,1),(2,1)],2,0), ([(1,1),(2,1)],2,2), ([(1,1),(2,1)],2,9),
    ([(1,1),(2,1)],0,0), ([(1,1),(2,1)],9,1)])
def test_pagination_matches_total_order_then_positional_slice(rows,limit,offset):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE orders(id INTEGER, amount INTEGER)')
        db.executemany('INSERT INTO orders VALUES(?,?)', rows)
        query = BY_ID['sql-offset-page-20261023'].code.replace('LIMIT 2 OFFSET 1', f'LIMIT {limit} OFFSET {offset}')
        actual = [row[0] for row in db.execute(query)]
    ordered = [identifier for identifier,_ in sorted(rows,key=lambda row:(-row[1],row[0]))]
    assert actual == ordered[offset:offset+limit]
