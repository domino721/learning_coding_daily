"""Displayed tables must be sufficient, accurate, and usable before answering."""
from dataclasses import replace
import sqlite3

import pytest

from backend.content import BY_ID, EXERCISES
from scripts.validate_sql_content import validate, validate_all


def test_every_sql_question_is_solvable_from_its_displayed_inputs():
    assert validate_all(EXERCISES) == sum(ex.domain == 'SQL' for ex in EXERCISES)


def test_missing_inputs_cannot_pass_with_a_hidden_reference_setup():
    ex = BY_ID['sql-null-02']
    with pytest.raises(ValueError, match='missing'):
        validate(replace(ex, code='SELECT SUM(COALESCE(refund, 0)) FROM orders;'))


def test_wrong_displayed_rows_cannot_pass_even_when_the_sum_is_unchanged():
    ex = BY_ID['sql-null-02']
    with pytest.raises(ValueError, match='differ'):
        validate(replace(ex, code=ex.code.replace('(2),(NULL),(3)', '(1),(NULL),(4)')))


def test_a_missing_join_table_cannot_pass():
    ex = BY_ID['sql-join-02']
    code = '\n'.join(line for line in ex.code.splitlines() if not line.startswith('-- CREATE TABLE orders') and not line.startswith('-- INSERT INTO orders'))
    with pytest.raises(ValueError, match='differ'):
        validate(replace(ex, code=code))


@pytest.mark.parametrize('values,expected', [([], (None, 0)), ([None, None], (0, 0)), ([2, None, 3], (5, 5))])
def test_coalesce_inside_and_outside_sum_have_different_empty_input_behavior(values, expected):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE orders(refund INTEGER)')
        db.executemany('INSERT INTO orders VALUES (?)', [(value,) for value in values])
        assert db.execute(BY_ID['sql-empty-sum-20261018'].code).fetchone() == expected


@pytest.mark.parametrize('values', [[], [None, None], [2, None, 4], [0, 0], [2, 2, None, 3]])
def test_aggregate_counts_averages_and_distinct_values(values):
    with sqlite3.connect(':memory:') as db:
        db.execute('CREATE TABLE orders(refund INTEGER)')
        db.executemany('INSERT INTO orders VALUES (?)', [(value,) for value in values])
        known = [value for value in values if value is not None]
        assert db.execute(BY_ID['sql-null-count-20261018'].code).fetchone() == (len(values), len(known), sum(known) if values else None)
        averages = (sum(known) / len(known) if known else None, sum(known) / len(values) if values else None)
        assert db.execute(BY_ID['sql-refund-average-20261018'].code).fetchone() == averages
        assert db.execute(BY_ID['sql-distinct-sum-20261018'].code).fetchone() == (sum(known) if known else None, sum(set(known)) if known else None)


@pytest.mark.parametrize('orders', [[], [(10, 1, 'done'), (11, 2, 'open')], [(10, 1, 'done'), (11, 1, 'done'), (12, 2, None), (13, 3, 'done')]])
def test_join_input_distinguishes_no_orders_from_no_completed_orders(orders):
    with sqlite3.connect(':memory:') as db:
        db.executescript('CREATE TABLE customers(id INTEGER); INSERT INTO customers VALUES(1),(2),(3); CREATE TABLE orders(id INTEGER, customer_id INTEGER, status TEXT);')
        db.executemany('INSERT INTO orders VALUES(?,?,?)', orders)
        completed = {customer for _, customer, status in orders if status == 'done'}
        assert db.execute(BY_ID['sql-qualified-join-20261018'].code).fetchone()[0] == len({1, 2, 3} - completed)
