"""Independent reference calculations and preservation for the reviewed daily five."""
from collections import Counter
from dataclasses import asdict
from fractions import Fraction
import hashlib
import itertools
import json
from pathlib import Path
import sqlite3

import numpy as np
import pandas as pd
import pytest
from sklearn.metrics import accuracy_score, balanced_accuracy_score

from backend.content import BY_ID, EXERCISES
from tests.preserved import original, preserved
from backend.curriculum import LEARNING_PATHS


def test_previous_201_exercises_paths_cards_and_rules_are_preserved():
    saved = json.loads(Path('tests/fixtures/catalog-before-daily-20261024.json').read_text())
    digest = lambda v: hashlib.sha256(json.dumps(v, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
    assert len(saved['exercises']) == 201 and LEARNING_PATHS['rules'] == saved['rules']
    for key, expected in saved['exercises'].items():
        assert preserved('exercise', key, expected), key
        assert preserved('path', key, saved['path_items'][key])
    cards = {c['id']: c for c in json.loads(Path('curriculum/problem_bank.json').read_text())['exercises']}
    for key, expected in saved['design_cards'].items():
        assert preserved('card', key, expected), key
    batch = json.loads(Path('backend/content_batches/2026-10-24.json').read_text())
    added = {e['id'] for e in batch['exercises']}
    assert batch['batch_id'] == 'codex-2026-10-24' and len(added) == 5
    assert not added & saved['exercises'].keys() and added <= BY_ID.keys()
    assert len(BY_ID) == len(EXERCISES)


@pytest.mark.parametrize('codes', [[], ['A'], ['A','B','A','C'], ['A','A','A'], ['B','A','B','A','C'], ['C','B','A']])
def test_all_duplicate_members_match_frequency_counts_and_keep_variants(codes):
    df = pd.DataFrame({'id': range(1,len(codes)+1), 'code': pd.Series(codes, dtype=object)})
    df.index = range(10,10+len(codes))
    before = df.copy(deep=True)
    counts = Counter(codes)
    actual = df.loc[df.duplicated(subset=['code'],keep=False),'id'].tolist()
    assert actual == [i for i,code in enumerate(codes,1) if counts[code]>1]
    for keep in ('first','last'):
        expected = [i+1 for i,code in enumerate(codes) if code in (codes[:i] if keep=='first' else codes[i+1:])]
        assert df.loc[df.duplicated(subset=['code'],keep=keep),'id'].tolist() == expected
    pd.testing.assert_frame_equal(df,before)


@pytest.mark.parametrize('rates', [[], [.25,-.2], [-.2,.25], [0.], [.1], [-.5], [.1,.1], [-1.,.5]])
def test_compounding_matches_sequential_money_updates_and_exact_factors(rates):
    values = np.array(rates,dtype=float)
    product = float(np.prod(1+values))
    money = 100.
    exact = Fraction(1)
    for rate in rates:
        money += money*rate
        exact *= 1+Fraction(str(rate))
    assert product == pytest.approx(money/100)
    assert product-1 == pytest.approx(float(exact-1), abs=1e-12)
    assert values.tolist() == rates


@pytest.mark.parametrize('truth,prediction', [([0,0,0,0,1,1],[0,0,0,1,1,0]),
    ([0,0,0,1],[0,0,0,0]), ([0,1],[0,1]), ([0,1],[1,0]),
    ([0,0,1,1],[0,1,0,1]), ([0,1,1,1],[1,1,1,1])])
def test_balanced_accuracy_uses_equal_class_recall_weight(truth,prediction):
    def manual(y,p):
        totals = Counter(y)
        correct = Counter(a for a,b in zip(y,p) if a==b)
        return sum(correct[label]/count for label,count in totals.items())/len(totals)
    actual = float(balanced_accuracy_score(truth,prediction))
    assert actual == pytest.approx(manual(truth,prediction))
    assert float(accuracy_score(truth,prediction)) == pytest.approx(sum(a==b for a,b in zip(truth,prediction))/len(truth))
    # Relabeling classes cannot change the score.
    assert balanced_accuracy_score(['cat' if x==0 else 'dog' for x in truth], ['cat' if x==0 else 'dog' for x in prediction]) == pytest.approx(actual)
    # Repeat each class-0 row three times: class recall is preserved, frequency changes.
    expanded = [(a,b) for a,b in zip(truth,prediction) for _ in range(3 if a==0 else 1)]
    y,p = zip(*expanded)
    assert balanced_accuracy_score(y,p) == pytest.approx(actual)


@pytest.mark.parametrize('left,right', [([],[]), ([1,1,2,None],[2,None]), ([1,1,None],[]),
    ([],[None]), ([None],[None]), ([None],[2]), ([1,2],[None]), ([-1,2,2,3],[2,4])])
@original('sql-except-set-20261024')
def test_except_matches_distinct_set_difference_including_null(left,right):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE orders(id INTEGER)')
        db.execute('CREATE TABLE blocked(id INTEGER)')
        db.executemany('INSERT INTO orders VALUES(?)',[(x,) for x in left])
        db.executemany('INSERT INTO blocked VALUES(?)',[(x,) for x in right])
        actual = [row[0] for row in db.execute(BY_ID['sql-except-set-20261024'].code)]
        expected = sorted(set(left)-set(right),key=lambda x:(x is not None,x if x is not None else 0))
        assert actual == expected
        if left==[1,1,2,None] and right==[2,None]:
            assert db.execute('SELECT id FROM orders WHERE id NOT IN (SELECT id FROM blocked)').fetchall() == []


@pytest.mark.parametrize('left,right', [([],[]), ([1,2],[2,3]), ([1],[]), ([],[2]),
    ([1],[1]), ([1],[2]), ([1,1],[1,1,1]), ([None],[None]), ([None,1,1],[None,1,2])])
@original('sql-full-coverage-20261024')
def test_full_join_matches_pair_enumeration_and_both_unmatched_sides(left,right):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE a(id INTEGER)')
        db.execute('CREATE TABLE b(id INTEGER)')
        db.executemany('INSERT INTO a VALUES(?)',[(x,) for x in left])
        db.executemany('INSERT INTO b VALUES(?)',[(x,) for x in right])
        actual = db.execute('SELECT a.rowid,b.rowid FROM a FULL OUTER JOIN b ON a.id=b.id').fetchall()
        matches = [(i,j) for (i,a),(j,b) in itertools.product(enumerate(left,1),enumerate(right,1)) if a is not None and b is not None and a==b]
        used_left,used_right = {i for i,_ in matches},{j for _,j in matches}
        expected = matches + [(i,None) for i in range(1,len(left)+1) if i not in used_left] + [(None,j) for j in range(1,len(right)+1) if j not in used_right]
        assert Counter(actual) == Counter(expected)
        assert db.execute(BY_ID['sql-full-coverage-20261024'].code).fetchone()[0] == len(expected)
