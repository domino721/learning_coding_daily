"""Reviewed scaffold questions, with new IDs to preserve all deployed snapshots."""
import json
from pathlib import Path


def authored_scaffolds(Exercise):
    bank = json.loads(Path(__file__).with_suffix('.json').read_text())
    if bank['schema_version'] != 1 or bank['status'] != 'reviewed':
        raise ValueError('Unreviewed scaffold bank')
    result = []
    for raw in bank['exercises']:
        entry = dict(raw)
        for key in ('hints', 'choices', 'accepted'):
            entry[key] = tuple(entry[key])
        result.append(Exercise(**entry))
    return result
