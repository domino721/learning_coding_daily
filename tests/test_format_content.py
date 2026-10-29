"""Line/order/multi items: re-run every authored variant recorded in each item's review record.

Order: the answer and accepted orders print reference_output; every trap order fails or differs.
Line: the shown code prints reference_output (the reported wrong result), or stops with the exception named
in the review entry's `raises`; the review fix gives the target.
Multi: exactly the answer options print reference_output when placed in ____.
Only repository-owned snippets run, in a separate isolated interpreter (never the API process).
터미널·Git items run with bash from the starting state their header shows (scripts/validate_shell_content.py).
"""
import json
import sqlite3
import subprocess
import sys
from pathlib import Path

import pytest

from backend.content import EXERCISES, LAYOUT_KINDS, valid_choice_answer
from backend.curriculum import LEARNING_PATHS
from scripts.validate_shell_content import capture_of, is_shell, outputs, same
from scripts.validate_shell_content import variants as shell_variants
from scripts.validate_sql_content import run_sql, sql_output

CARDS = {c['id']: c for c in json.loads(Path('curriculum/problem_bank.json').read_text())['exercises']}
ITEMS = [ex for ex in EXERCISES if ex.kind in LAYOUT_KINDS]
# Any batch may add these kinds; each card's review_record must hold an entry for it.
ENTRIES = {}
for record in sorted({CARDS[ex.id]['review_record'] for ex in ITEMS}):
    ENTRIES.update({entry['id']: entry for entry in json.loads(Path(record).read_text()).get('items', [])})
HARNESS = '''
import contextlib, io, json, sys
results = []
for program in json.load(sys.stdin):
    out = io.StringIO()
    try:
        with contextlib.redirect_stdout(out):
            exec(compile(program, "<authored item>", "exec"), {"__name__": "__item__"})
        results.append([out.getvalue().strip(), None])
    except Exception as error:
        results.append([out.getvalue().strip(), type(error).__name__])
json.dump(results, sys.stdout)
'''


def numbers(value):
    return [int(n) for n in value.split(',')]


def patched(code, lines):
    rows = code.split('\n')
    for number, text in lines.items():
        rows[int(number) - 1] = text
    return '\n'.join(row for index, row in enumerate(rows, 1) if lines.get(str(index)) != '')


def variants(ex):
    """(label, program, expectation): 'same' as reference_output, 'other' than it, or 'fix'."""
    if ex.kind == 'order':
        assemble = lambda order: ex.code + '\n' + '\n'.join(ex.choices[n - 1] for n in numbers(order))
        return ([(f'order {o}', assemble(o), 'same') for o in (ex.answer, *ex.accepted)]
                + [(f'trap {o}', assemble(o), 'other') for o in CARDS[ex.id]['distractor_targets']])
    if ex.kind == 'line':
        return [('shown', ex.code, 'same'), ('fix', patched(ex.code, ENTRIES[ex.id]['fix']['lines']), 'fix')]
    correct = set(numbers(ex.answer))
    return [(f'option {n}', ex.code.replace('____', option), 'same' if n in correct else 'other')
            for n, option in enumerate(ex.choices, 1)]


@pytest.fixture(scope='module')
def results():
    jobs = [(ex, label, program) for ex in ITEMS if ex.domain != 'SQL' and not is_shell(ex)
            for label, program, _ in variants(ex)]
    out = subprocess.run([sys.executable, '-I', '-c', HARNESS], input=json.dumps([j[2] for j in jobs]),
                         capture_output=True, text=True, check=True, timeout=300).stdout
    return {(ex.id, label): result for (ex, label, _), result in zip(jobs, json.loads(out))}


def shell_jobs(ex):
    entry = ENTRIES[ex.id]
    traps = CARDS[ex.id]['distractor_targets'] if ex.kind == 'order' else ()
    return [(label, program, expected, (program, capture_of(ex, entry), entry.get('check')))
            for label, program, expected in shell_variants(ex, entry, traps)]


@pytest.fixture(scope='module')
def shell_results():
    """Every variant of every executable 터미널·Git layout item, each in its own temporary home."""
    keys, jobs = [], []
    for ex in ITEMS:
        if is_shell(ex) and ENTRIES[ex.id].get('verify') != 'documented':
            for label, _, _, job in shell_jobs(ex):
                keys.append((ex.id, label))
                jobs.append(job)
    return dict(zip(keys, outputs(jobs)))



def test_every_layout_item_has_one_review_entry_and_a_task_form():
    assert ITEMS and {ex.id for ex in ITEMS} <= set(ENTRIES)
    for ex in ITEMS:
        entry, card = ENTRIES[ex.id], CARDS[ex.id]
        assert (entry['version'], entry['kind'], entry['task_form']) == (ex.version, ex.kind, card['task_form'])
        assert LEARNING_PATHS['items'][ex.id]['task_form'] == card['task_form']
        assert ex.response_mode == 'choice' and (ex.kind != 'line' or 'fix' in entry)


@pytest.mark.parametrize('ex', ITEMS, ids=lambda ex: ex.id)
def test_answers_are_gradable_and_traps_are_wrong(ex):
    assert ex.matches(ex.answer) and all(ex.matches(value) for value in ex.accepted)
    assert valid_choice_answer(ex.kind, ex.answer, ex.choices)
    for trap in CARDS[ex.id]['distractor_targets']:
        if ex.kind == 'order':
            assert valid_choice_answer('order', trap, ex.choices) and not ex.matches(trap)
        elif ex.kind == 'line':
            assert trap in ex.choices and not ex.matches(trap)
    if ex.kind == 'multi' and ',' in ex.answer:
        assert not valid_choice_answer('multi', ','.join(reversed(ex.answer.split(','))), ex.choices)


@pytest.mark.parametrize('ex', ITEMS, ids=lambda ex: ex.id)
def test_every_variant_reproduces_its_reviewed_result(ex, results, shell_results):
    fix = ENTRIES[ex.id].get('fix', {})
    if is_shell(ex):
        entry = ENTRIES[ex.id]
        if entry.get('verify') == 'documented':
            # A Windows-only fact cannot run here; the review entry cites the official documentation.
            assert entry['sources'] and entry['basis'] and fix
            return
        for label, _, expected, _ in shell_jobs(ex):
            shown = shell_results[(ex.id, label)]
            if expected == 'fix':
                assert same(shown, fix['output'], entry), (label, shown)
            else:
                assert same(shown, ex.reference_output, entry) == (expected == 'same'), (label, shown)
        return
    for label, program, expected in variants(ex):
        if ex.domain == 'SQL':
            with sqlite3.connect(':memory:') as db:
                db.executescript(ex.reference_setup)
                try:
                    rows = run_sql(db, program)
                except (sqlite3.Error, sqlite3.Warning):
                    rows = None
            if expected == 'fix':
                assert rows is not None and [list(row) for row in rows] == fix['rows'], label
                continue
            output = None if rows is None else sql_output(rows, ex.reference_output)
        else:
            stdout, error = results[(ex.id, label)]
            if expected == 'fix':
                assert error is None and stdout == fix['output'], label
                continue
            if label == 'shown' and 'raises' in ENTRIES[ex.id]:
                # A traceback item stops with the reported exception; its fix must run cleanly.
                assert error == ENTRIES[ex.id]['raises'] == ex.reference_output, (label, error)
                continue
            output = None if error else stdout
        assert (output == ex.reference_output) == (expected == 'same'), (label, output)
