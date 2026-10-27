"""Independent boundary calculations and preservation of the 2.1 catalog."""
from dataclasses import asdict
import hashlib
import json
import math
from pathlib import Path
import sqlite3
import statistics
import string

import numpy as np
import pandas as pd
import pytest
from sklearn.impute import SimpleImputer

from backend.content import BY_ID, EXERCISES
from backend.curriculum import LEARNING_PATHS


def test_previous_206_exercises_paths_cards_and_current_review_policy_are_preserved():
    saved = json.loads(Path('tests/fixtures/catalog-before-daily-20261025.json').read_text())
    digest = lambda v: hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
    assert len(saved['exercises']) == 206
    assert LEARNING_PATHS['rules'] == saved['rules']
    assert LEARNING_PATHS['review'] == saved['review']
    assert saved['path_version'] == 'learning-paths-2.1'
    assert LEARNING_PATHS['version'] == 'learning-paths-2.2'  # 2.1 rules/review preserved; 2.2 adds support step-down and task-form mixing
    for key,expected in saved['exercises'].items():
        assert digest(asdict(BY_ID[key])) == expected, key
        assert digest(LEARNING_PATHS['items'][key]) == saved['path_items'][key]
    cards = {c['id']:c for c in json.loads(Path('curriculum/problem_bank.json').read_text())['exercises']}
    for key,expected in saved['design_cards'].items():
        assert digest(cards[key]) == expected, key
    batch = json.loads(Path('backend/content_batches/2026-10-25.json').read_text())
    added = {e['id'] for e in batch['exercises']}
    assert batch['batch_id'] == 'codex-2026-10-25' and len(added) == 5
    assert not added & saved['exercises'].keys() and added <= BY_ID.keys()
    assert len(BY_ID) == len(EXERCISES)
    old_families = {LEARNING_PATHS['items'][key]['family'] for key in saved['path_items']}
    assert all(LEARNING_PATHS['items'][key]['family'] in old_families for key in added)
    for key in added:
        diagnostics = cards[key]['choice_diagnostics']
        assert [entry['choice'] for entry in diagnostics] == list(BY_ID[key].choices)
        assert all(entry['hypothesis'] for entry in diagnostics)


@pytest.mark.parametrize('pairs,target', [([('a',10.),('b',None)],['b','c','a']),
    ([],['c']), ([('a',1.)],[]), ([('a',None)],['a','a','b']),
    ([('c',0.),('a',np.nan)],['a','c']), ([('a',1.),('b',2.)],['b'])])
def test_reindex_defaults_only_fill_new_labels_and_preserve_original_missing(pairs,target):
    s = pd.Series([v for _,v in pairs],index=[k for k,_ in pairs],dtype=float)
    before = s.copy(deep=True)
    result = s.reindex(target,fill_value=0)
    lookup = dict(pairs)
    values = [lookup[label] if label in lookup else 0 for label in target]
    expected = [value is None or math.isnan(value) for value in values]
    assert result.index.tolist() == target and result.isna().tolist() == expected
    assert result.fillna(0).tolist() == [0 if missing else value for value,missing in zip(values,expected)]
    pd.testing.assert_series_equal(s,before)


@pytest.mark.parametrize('shape,axis', [((1,1,3),1), ((2,1,3),1), ((1,2,1),0), ((1,1,1),1), ((0,1,3),1)])
def test_squeeze_removes_specified_singleton_or_all_singletons(shape,axis):
    x = np.arange(math.prod(shape)).reshape(shape)
    before = x.copy()
    selected,automatic = np.squeeze(x,axis=axis),np.squeeze(x)
    assert selected.shape == tuple(n for i,n in enumerate(shape) if i!=axis)
    assert automatic.shape == tuple(n for n in shape if n!=1)
    assert selected.reshape(-1).tolist() == automatic.reshape(-1).tolist() == x.reshape(-1).tolist()
    np.testing.assert_array_equal(x,before)


def test_squeeze_does_not_discard_a_non_singleton_axis():
    with pytest.raises(ValueError):
        np.squeeze(np.ones((1,2,3)),axis=1)


@pytest.mark.parametrize('train,rows', [([[1.,10.],[5.,30.]], [[np.nan,99.]]),
    ([[1.,10.],[5.,30.]], [[99.,np.nan]]), ([[1.,10.],[5.,30.]], [[np.nan,np.nan],[7.,99.]]),
    ([[1.,np.nan],[5.,30.],[9.,10.]], [[np.nan,77.]]),
    ([[1.,10.],[5.,30.],[9.,50.]], [[np.nan,np.nan]])])
def test_median_imputation_reuses_column_statistics_only_at_missing_cells(train,rows):
    training,new = np.array(train,dtype=float),np.array(rows,dtype=float)
    before_training,before_new = training.copy(),new.copy()
    medians = [statistics.median(v for v in column if not math.isnan(v)) for column in zip(*train)]
    expected = [[medians[j] if math.isnan(value) else value for j,value in enumerate(row)] for row in rows]
    imputer = SimpleImputer(strategy='median').fit(training)
    assert imputer.statistics_.tolist() == medians
    assert imputer.transform(new).tolist() == expected
    assert imputer.statistics_.tolist() == medians
    np.testing.assert_array_equal(training,before_training)
    np.testing.assert_array_equal(new,before_new)


@pytest.mark.parametrize('users', [[], [None,None], ['Ann','ann','Bo',None], ['A','A','a'],
    ['A','B'], ['é','É','A','a'], ['1','01',' A','a']])
def test_nocase_distinct_uses_ascii_folding_and_omits_null(users):
    translation = str.maketrans(string.ascii_uppercase,string.ascii_lowercase)
    known = [user for user in users if user is not None]
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE visits(user_id TEXT)')
        db.executemany('INSERT INTO visits VALUES(?)',[(user,) for user in users])
        actual = db.execute(BY_ID['sql-distinct-nocase-20261025'].code).fetchone()
    assert actual == (len(set(known)),len({user.translate(translation) for user in known}))


@pytest.mark.parametrize('days,periods', [([2,3,5],[(1,3),(3,5)]), ([],[(1,3)]), ([1,2],[]),
    ([1,2,3],[(1,3)]), ([2],[(1,3),(2,4)]), ([1,2],[(1,1),(2,2)]),
    ([None,2],[(None,3),(1,None),(1,3)]), ([5,3,2],[(3,5),(1,3)])])
def test_halfopen_interval_join_matches_independent_pairs(days,periods):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE events(id INTEGER, day INTEGER)')
        db.execute('CREATE TABLE periods(id INTEGER, start_day INTEGER, end_day INTEGER)')
        db.executemany('INSERT INTO events VALUES(?,?)',list(enumerate(days,1)))
        db.executemany('INSERT INTO periods VALUES(?,?,?)',[(i,a,b) for i,(a,b) in enumerate(periods,1)])
        actual = db.execute('SELECT e.id,p.id FROM events e JOIN periods p ON e.day>=p.start_day AND e.day<p.end_day ORDER BY e.id,p.id').fetchall()
        expected = [(i,j) for i,day in enumerate(days,1) for j,(start,end) in enumerate(periods,1)
                    if day is not None and start is not None and end is not None and start<=day<end]
        assert actual == expected
        assert db.execute(BY_ID['sql-halfopen-periods-20261025'].code).fetchone()[0] == len(expected)


def test_each_boundary_distractor_matches_the_specific_alternative_predicate():
    e = BY_ID['sql-halfopen-periods-20261025']
    with sqlite3.connect(':memory:') as db:
        db.executescript(e.reference_setup)
        outputs = [db.execute(f'SELECT COUNT(*) FROM events e JOIN periods p ON {predicate}').fetchone()[0]
                   for predicate in ['e.day>=p.start_day AND e.day<p.end_day',
                                     'e.day BETWEEN p.start_day AND p.end_day',
                                     'e.day>p.start_day AND e.day<=p.end_day',
                                     'e.day>p.start_day AND e.day<p.end_day']]
    assert [str(value) for value in outputs] == list(e.choices) == ['2','4','3','1']
