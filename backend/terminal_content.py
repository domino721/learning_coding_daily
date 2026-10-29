"""Reviewed 터미널·Git track items (CR-019). New IDs only, so every deployed snapshot is preserved."""
import json
from pathlib import Path


def authored_terminal(Exercise):
    bank = json.loads(Path(__file__).with_suffix('.json').read_text(encoding='utf-8'))
    if bank['schema_version'] != 1 or bank['status'] != 'reviewed':
        raise ValueError('Unreviewed terminal bank')
    result = []
    for raw in bank['exercises']:
        entry = dict(raw)
        for key in ('hints', 'choices', 'accepted'):
            entry[key] = tuple(entry[key])
        result.append(Exercise(**entry))
    return result
