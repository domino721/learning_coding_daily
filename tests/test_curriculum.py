"""Execute only trusted, authored repository examples, never user-provided input."""
from contextlib import redirect_stdout
from io import StringIO
import sqlite3

import numpy as np
import pytest
from sklearn.preprocessing import StandardScaler

from backend.content import EXERCISES, LAYOUT_KINDS
from scripts.validate_shell_content import capture_of, is_shell, review_entries, run_shell, same
from scripts.validate_sql_content import run_sql as run_statements, sql_output


EXPECTED = {
    'pandas-select-01': '[4000, 3000]', 'pandas-filter-01': '2',
    'pandas-null-01': '1', 'pandas-sort-01': '9000', 'pandas-group-01': '12000',
    'pandas-select-02': '2', 'pandas-filter-02': '[10000, 15000]',
    'pandas-null-02': '[4000.0, 0.0, 2000.0]', 'pandas-sort-02': '[3000, 5000, 9000]',
    'pandas-group-02': '8000', 'numpy-shape-01': '(2, 3)', 'numpy-axis-01': '[4, 6]',
    'numpy-broadcast-01': '[[11, 22], [13, 24]]', 'numpy-mask-01': '[7, 10]',
    'numpy-view-01': '[99, 2, 3]', 'stats-median-01': '3', 'stats-weight-01': '0.26',
    'stats-std-01': '1.0', 'stats-ab-01': '2.0', 'stats-conditional-01': '0.33',
    'ml-split-01': '(8, 2)', 'ml-scale-01': '3.0', 'ml-metric-01': '0.95',
    'ml-neighbor-01': '[1]',
}


def run_sql(exercise):
    with sqlite3.connect(':memory:') as db:
        if exercise.id == 'sql-where-01':
            db.executescript('CREATE TABLE orders(id, amount); INSERT INTO orders VALUES(1,1000),(2,2000),(3,2000);')
            result = db.execute(exercise.code.replace('____', exercise.answer)).fetchall()
            assert result == [(2,), (3,)]
        elif exercise.id == 'sql-count-01':
            db.executescript('CREATE TABLE orders(amount); INSERT INTO orders VALUES(1000),(NULL),(2000);')
            assert str(db.execute(exercise.code).fetchone()) == exercise.answer == '(3, 2)'
        elif exercise.id == 'sql-having-01':
            db.executescript("CREATE TABLE sales(team, amount); INSERT INTO sales VALUES('A',3000),('A',4000),('B',2000);")
            assert db.execute(exercise.code.replace('____', exercise.answer)).fetchall() == [('A', 7000)]
        elif exercise.id == 'sql-join-01':
            db.executescript('CREATE TABLE customers(id); INSERT INTO customers VALUES(1),(2); CREATE TABLE orders(id, customer_id); INSERT INTO orders VALUES(10,1),(11,1);')
            assert str(db.execute(exercise.code).fetchone()[0]) == exercise.answer == '3'
        else:
            assert exercise.id == 'sql-null-01'
            db.executescript('CREATE TABLE orders(id, refunded); INSERT INTO orders VALUES(1,0),(2,1),(3,NULL);')
            assert str([row[0] for row in db.execute(exercise.code)]) == exercise.answer == '[1]'


# Line/order/multi answers are option numbers; tests/test_format_content.py re-runs them.
CLASSIC = [ex for ex in EXERCISES if ex.kind not in LAYOUT_KINDS]
SHELL_ENTRIES = review_entries([ex for ex in EXERCISES if is_shell(ex)])


@pytest.mark.parametrize('exercise', CLASSIC, ids=lambda ex: ex.id)
def test_authored_exercise_with_real_library_or_sql(exercise):
    assert len(exercise.hints) == 2
    if exercise.choices:
        assert exercise.answer in exercise.choices
        assert len(set(exercise.choices)) == len(exercise.choices) == 4
    if exercise.reference_output and is_shell(exercise):
        # 터미널·Git: bash runs the code from the starting state its header shows (scripts/validate_shell_content.py).
        entry = SHELL_ENTRIES[exercise.id]
        assert exercise.reference_output == exercise.answer
        if entry.get('verify') == 'documented':
            # A Windows-only fact cannot run here; the review entry cites the official documentation.
            assert entry['sources'] and entry['basis']
            return
        assert same(run_shell(exercise.code, capture_of(exercise, entry), entry.get('check')), exercise.answer, entry)
        return
    if exercise.reference_output:
        if exercise.domain=='SQL':
            with sqlite3.connect(':memory:') as db:
                db.executescript(exercise.reference_setup)
                rows=run_statements(db, exercise.code)
                actual=sql_output(rows, exercise.answer)
        else:
            output=StringIO()
            with redirect_stdout(output):exec(compile(exercise.code,'<trusted authored transfer>','exec'),{})
            actual=output.getvalue().strip()
        assert actual==exercise.reference_output==exercise.answer
        return
    if exercise.domain == 'SQL':
        run_sql(exercise)
        return
    code = exercise.code.replace('____', exercise.answer)
    extra = {
        'pandas-filter-02': '\nprint(selected["amount"].tolist())',
        'pandas-null-02': '\nprint(clean.tolist())',
        'pandas-sort-02': '\nprint(ordered["amount"].tolist())',
    }
    output = StringIO()
    namespace = {}
    with redirect_stdout(output):
        exec(compile(code + extra.get(exercise.id, ''), '<authored exercise>', 'exec'), namespace)
    if exercise.id == 'ml-leakage-01':
        # The evaluation point affected the first transform; proper train-only fit avoids it.
        assert not np.isclose(namespace['x_train'].mean(), 0)
        corrected = StandardScaler().fit_transform(namespace['x'][:2])
        assert np.isclose(corrected.mean(), 0)
        assert exercise.answer == '분리한 학습 데이터에만 fit한 뒤 두 데이터에 transform한다'
    else:
        assert output.getvalue().strip() == EXPECTED[exercise.id]
        if exercise.kind == 'choice' and exercise.id != 'pandas-select-01':
            assert exercise.answer == EXPECTED[exercise.id]


@pytest.mark.parametrize('exercise', CLASSIC, ids=lambda ex: ex.id)
def test_every_exercise_supports_choice_and_direct_answer(exercise):
    assert len(set(exercise.choices)) == len(exercise.choices) == 4
    assert exercise.matches(exercise.answer)
    assert all(not exercise.matches(choice) for choice in exercise.choices if choice != exercise.answer)


@pytest.mark.parametrize(('exercise_id', 'proposed', 'correct'), [
    ('pandas-select-01', "df [ 'amount' ]", True),
    ('pandas-select-01', "df[' amount ' ]", False),
    ('pandas-select-01', "d f['amount']", False),
    ('pandas-select-01', "df['amount\"]", False),
    ('pandas-filter-01', '0 2', False),
    ('numpy-shape-01', '(2,3)', True),
    ('numpy-shape-01', '(3,2)', False),
    ('numpy-mask-01', '[7,10]', True),
    ('stats-std-01', '1', True),
    ('stats-std-01', '1.01', False),
    ('pandas-filter-01', "__import__('os').getcwd()", False),
])
def test_direct_answer_formatting(exercise_id, proposed, correct):
    from backend.content import BY_ID
    assert BY_ID[exercise_id].matches(proposed) is correct
