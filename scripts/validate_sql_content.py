"""Validate trusted repository SQL using only the input displayed to the learner."""
import re
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))


def visible_setup(code):
    comments = []
    for line in code.splitlines():
        if not line.strip():
            continue
        if not line.startswith('--'):
            break
        comments.append(line[2:].strip())
    statements = [line for line in comments if re.match(r'^(CREATE TABLE|INSERT INTO)\b', line, re.I)]
    if statements:
        return '\n'.join(statements)
    # Read the already published compact/pipe tables without changing their versions.
    tables = []
    for index, line in enumerate(comments):
        header = re.fullmatch(r'(\w+)\(([^)]+)\):\s*(.*)', line)
        if header:
            table, columns, rows = header.groups()
            if not rows and index + 1 < len(comments):
                rows = comments[index + 1]
            if not rows:
                raise ValueError(f'No displayed rows or explicit empty table: {table}')
            if not rows.startswith('('):
                rows = ','.join(f'({value.strip()})' for value in rows.split(','))
            rows = re.sub(r'(?<=[(,])\s*([A-Za-z_]\w*)\s*(?=[,)])',
                          lambda match: 'NULL' if match[1].upper() == 'NULL' else repr(match[1]), rows)
            tables.append(f'CREATE TABLE {table}({columns}); INSERT INTO {table} VALUES {rows};')
        elif re.fullmatch(r'\w+', line) and index + 2 < len(comments) and '|' in comments[index + 1]:
            columns = ','.join(value.strip() for value in comments[index + 1].split('|'))
            rows = [value for value in comments[index + 2:] if '|' in value]
            values = ','.join('(' + ','.join(value.strip() for value in row.split('|')) + ')' for row in rows)
            tables.append(f'CREATE TABLE {line}({columns}); INSERT INTO {line} VALUES {values};')
    if not tables:
        raise ValueError('SQL is missing its displayed input tables')
    return '\n'.join(tables)


def run_sql(db, sql):
    """Run every statement and return the rows of the last one.

    Change items show UPDATE/INSERT/DELETE (or a transaction) before a final SELECT; one-statement queries are unchanged.
    """
    statements, buffer = [], ''
    for line in sql.splitlines(keepends=True):
        buffer += line
        if sqlite3.complete_statement(buffer):
            statements.append(buffer)
            buffer = ''
    if buffer.strip():
        statements.append(buffer)
    *head, last = statements
    if head:
        db.executescript(''.join(head))
    return db.execute(last).fetchall()


def sql_output(rows, answer):
    def literal(value):
        if value is None:
            return 'NULL'
        if isinstance(value, (tuple, list)):
            left, right = ('(', ')') if isinstance(value, tuple) else ('[', ']')
            return left + ', '.join(literal(item) for item in value) + right
        return repr(value)
    if answer.startswith('['):
        return literal([row[0] for row in rows])
    if len(rows) != 1:
        raise ValueError('A scalar/tuple answer requires exactly one result row')
    if answer.startswith('('):
        return literal(rows[0])
    if len(rows[0]) != 1:
        raise ValueError('A scalar answer requires exactly one result column')
    return 'NULL' if rows[0][0] is None else str(rows[0][0])


def table_data(db):
    names = [row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")]
    return {name: ([row[1] for row in db.execute(f'PRAGMA table_info("{name}")')],
                   db.execute(f'SELECT * FROM "{name}"').fetchall()) for name in names}


def validate(exercise):
    setup = visible_setup(exercise.code)
    with sqlite3.connect(':memory:') as shown:
        shown.executescript(setup)
        if exercise.reference_setup:
            with sqlite3.connect(':memory:') as reference:
                reference.executescript(exercise.reference_setup)
                if table_data(shown) != table_data(reference):
                    raise ValueError(f'{exercise.id}: displayed inputs differ from reference_setup')
        if exercise.kind in ('line', 'order', 'multi'):
            validate_layout(setup, exercise)
            return
        rows = run_sql(shown, exercise.code.replace('____', exercise.answer))
        if exercise.kind != 'blank' and sql_output(rows, exercise.answer) != exercise.answer:
            raise ValueError(f'{exercise.id}: displayed inputs do not reproduce the answer')


def validate_layout(setup, exercise):
    """Line: the shown query gives reference_output. Order: every correct order gives it.
    Multi: exactly the answer options give it when placed in ____.
    Every variant runs on its own copy of the displayed input, so a change item cannot leak into the next one."""
    expected = exercise.reference_output
    if not expected:
        raise ValueError(f'{exercise.id}: {exercise.kind} SQL needs reference_output')
    def output(sql):
        with sqlite3.connect(':memory:') as db:
            db.executescript(setup)
            return sql_output(run_sql(db, sql), expected)
    if exercise.kind == 'line':
        if output(exercise.code) != expected:
            raise ValueError(f'{exercise.id}: displayed query does not reproduce reference_output')
    elif exercise.kind == 'order':
        for order in (exercise.answer, *exercise.accepted):
            sql = exercise.code + '\n' + '\n'.join(exercise.choices[int(n) - 1] for n in order.split(','))
            if output(sql) != expected:
                raise ValueError(f'{exercise.id}: order {order} does not reproduce reference_output')
    else:
        hits = []
        for number, option in enumerate(exercise.choices, 1):
            try:
                if output(exercise.code.replace('____', option)) == expected:
                    hits.append(str(number))
            except (sqlite3.Error, ValueError):
                pass
        if ','.join(hits) != exercise.answer:
            raise ValueError(f'{exercise.id}: options {hits} reproduce reference_output, answer is {exercise.answer}')


def validate_all(exercises):
    sql = [exercise for exercise in exercises if exercise.domain == 'SQL']
    for exercise in sql:
        try:
            validate(exercise)
        except (ValueError, sqlite3.Error) as error:
            raise ValueError(f'{exercise.id}: {error}') from error
    return len(sql)


if __name__ == '__main__':
    from backend.content import EXERCISES
    print(f'Validated displayed inputs for {validate_all(EXERCISES)} SQL exercises')
