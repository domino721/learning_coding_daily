"""Reviewed SQL function/window/change items and the NumPy/pandas @ items (CR-017). New IDs only."""
import json
from pathlib import Path


def authored_extensions(Exercise):
    bank = json.loads(Path(__file__).with_suffix('.json').read_text(encoding='utf-8'))
    if bank['schema_version'] != 1 or bank['status'] != 'reviewed':
        raise ValueError('Unreviewed extension bank')
    result = []
    for raw in bank['exercises']:
        entry = dict(raw)
        for key in ('hints', 'choices', 'accepted'):
            entry[key] = tuple(entry[key])
        result.append(Exercise(**entry))
    return result
