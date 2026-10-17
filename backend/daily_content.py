"""Reviewed, date-keyed repository content. No model or user code executes here."""
from datetime import date
import json
from pathlib import Path


def authored_batches(Exercise):
    result = []
    for path in sorted(Path(__file__).with_name('content_batches').glob('*.json')):
        batch = json.loads(path.read_text(encoding='utf-8'))
        day = date.fromisoformat(path.stem).isoformat()
        if batch.get('schema_version') != 1 or batch.get('date') != day or batch.get('batch_id') != f'codex-{day}':
            raise ValueError(f'Invalid content batch identity: {path.name}')
        if batch.get('status') != 'reviewed' or len(batch.get('exercises', [])) != 5:
            raise ValueError(f'Unreviewed or incomplete content batch: {path.name}')
        for raw in batch['exercises']:
            entry = dict(raw)
            for key in ('hints', 'choices', 'accepted'):
                if key in entry:
                    entry[key] = tuple(entry[key])
            result.append(Exercise(**entry))
    return result
