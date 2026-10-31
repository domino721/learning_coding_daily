"""Replay the same synthetic learners through a previous and the current recommendation engine.

Both engines read the current catalog and learning paths, so only the selection rules differ.
Synthetic histories only; this says nothing about real learners.

Usage: python3 scripts/compare-engines.py --base HEAD --output docs/experiments/learning-paths-v2.2.json
Date-dependent profiles are averaged over several start dates.
"""
import argparse
from collections import Counter
from dataclasses import asdict
from datetime import date, timedelta
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import statistics
import subprocess
import sys
import tempfile
from types import SimpleNamespace

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from backend import curriculum as current
from backend.content import EXERCISES, LAYOUT_KINDS

PROFILES = {
    'steady': '모든 문제를 첫 시도에 힌트 없이 맞힌다.',
    'transfer-slip': '단계 3 문제는 처음 만날 때 도움을 받고, 이후 복습에서는 맞힌다.',
    'uneven': '문제·날짜 해시의 1/4에서 도움을 받는다.',
    'struggling': '문제·날짜 해시의 1/2에서 도움을 받는다.',
}


def load_base(revision):
    folder = Path(tempfile.mkdtemp(prefix='engine-base-'))
    source = subprocess.run(['git', 'show', f'{revision}:backend/curriculum.py'], cwd=ROOT,
                            capture_output=True, text=True, check=True).stdout
    (folder / 'curriculum_base.py').write_text(source)
    shutil.copy(ROOT / 'backend/learning_paths.json', folder / 'learning_paths.json')
    spec = importlib.util.spec_from_file_location('curriculum_base', folder / 'curriculum_base.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def independent(profile, ex, day, attempted):
    if profile == 'steady':
        return True
    if profile == 'transfer-slip':
        return not (ex.level == 3 and ex.id not in attempted)
    return int(hashlib.sha256(f'{ex.id}:{day}'.encode()).hexdigest(), 16) % (2 if profile == 'struggling' else 4) != 0


def replay(engine, profile, track, days, start):
    by_id = {ex.id: ex for ex in EXERCISES}
    sessions, progress, attempted, served = [], {}, set(), []
    for offset in range(days):
        day = (start + timedelta(days=offset)).isoformat()
        states = engine.concept_states(sessions, by_id)
        selected = engine.select_exercises(EXERCISES, sessions, progress, day, track=track)
        items = []
        for ex, category in selected:
            solo = independent(profile, ex, day, attempted)
            attempted.add(ex.id)
            items.append({**asdict(ex), 'status': 'correct' if solo else 'revealed',
                          'hints_used': 0 if solo else 1, 'attempts_count': 1})
            prior = progress.get(ex.id)
            due, streak = engine.review_due(day, prior or {}, solo)
            progress[ex.id] = {'due': due, 'streak': streak, 'last_day': day,
                               'completed': progress.get(ex.id, {}).get('completed', 0) + 1}
            served.append({'day': day, 'id': ex.id, 'category': category, 'level': ex.level,
                           'form': current.task_form(ex), 'kind': ex.kind,
                           'support': states[ex.concept_id]['needs_support'], 'concept': ex.concept_id,
                           'independent': solo,
                           # Days a wrong or helped item waited past its next-day retry.
                           'retry_late': (date.fromisoformat(day) - date.fromisoformat(prior['due'])).days
                           if prior and not prior['streak'] else None})
        if items:
            sessions.append({'id': f'{profile}-{track}-{offset}', 'track_id': track, 'local_day': day,
                             'batch': 0, 'items': items})
    final = engine.concept_states(sessions, by_id)
    return summarize(served, final, track)


def summarize(served, final, track):
    batches = {}
    for row in served:
        batches.setdefault(row['day'], []).append(row)
    forms = [len({r['form'] for r in rows}) for rows in batches.values()]
    support = [r for r in served if r['support']]
    concepts = [c for c in final.values() if current.in_track(SimpleNamespace(domain=c['domain']), track)]
    shown = Counter(r['id'] for r in served)
    late = [r['retry_late'] for r in served if r['retry_late'] is not None]
    return {
        'sessions': len(batches),
        'served': len(served),
        'distinct_items': len(shown),
        # Served items the learner had already seen, and items shown four or more times.
        'repeat_share': round((len(served) - len(shown)) / len(served), 2) if served else 0,
        'items_shown_4plus': sum(count >= 4 for count in shown.values()),
        'retry_days_late': round(sum(late) / len(late), 1) if late else 0,
        'short_sessions': sum(len(rows) < 5 for rows in batches.values()),
        'mean_forms_per_session': round(sum(forms) / len(forms), 2) if forms else 0,
        'sessions_with_4plus_same_form': sum(max(Counter(r['form'] for r in rows).values()) >= 4 for rows in batches.values()),
        'line_order_multi_items_seen': len({r['id'] for r in served if r['kind'] in LAYOUT_KINDS}),
        'support_items_by_level': dict(sorted(Counter(r['level'] for r in support).items())),
        'concepts_at_level': dict(sorted(Counter(c['level'] for c in concepts).items())),
    }


def knows(engine, track):
    """An engine from before CR-017 (python-basics), CR-019 (terminal-git), CR-020 (git) or CR-021 (windows) has no such track: its in_track would admit every item."""
    probe = next(ex for ex in EXERCISES if ex.domain == 'SQL')
    return track in ('python', 'sql') or not engine.in_track(probe, track)


def average(runs):
    """Mean of numeric metrics; level/support counters are averaged per key."""
    result = {}
    for key, value in runs[0].items():
        if isinstance(value, dict):
            keys = sorted({k for run in runs for k in run[key]})
            result[key] = {k: round(statistics.mean(run[key].get(k, 0) for run in runs), 2) for k in keys}
        else:
            result[key] = round(statistics.mean(run[key] for run in runs), 2)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', default='HEAD')
    parser.add_argument('--days', type=int, nargs='+', default=[21, 42])
    parser.add_argument('--starts', type=int, default=8)
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    base = load_base(args.base)
    # The concept map is catalog data like the paths: an engine from before a concept was added reads the current one.
    base.CONCEPTS = current.CONCEPTS
    first = date(2026, 11, 2)
    results = []
    for profile in PROFILES:
        # steady and transfer-slip do not depend on the calendar; one start date is enough.
        starts = [first + timedelta(days=7 * k) for k in range(args.starts if profile in ('uneven', 'struggling') else 1)]
        for track in ('python-basics', 'python', 'sql', 'terminal-git', 'windows', 'git'):
            for days in args.days:
                results.append({'profile': profile, 'track': track, 'days': days, 'runs': len(starts),
                                'base': average([replay(base, profile, track, days, s) for s in starts]) if knows(base, track) else None,
                                'current': average([replay(current, profile, track, days, s) for s in starts])})
    report = {'synthetic': True, 'days': args.days, 'first_start': first.isoformat(), 'profiles': PROFILES,
              'base': {'revision': subprocess.run(['git', 'rev-parse', '--short', args.base], cwd=ROOT,
                                                  capture_output=True, text=True, check=True).stdout.strip(),
                       # The base code runs on the current catalog, so its label comes from its own revision.
                       'algorithm_version': json.loads(subprocess.run(
                           ['git', 'show', f'{args.base}:backend/learning_paths.json'], cwd=ROOT,
                           capture_output=True, text=True, check=True).stdout)['version']},
              'current': {'algorithm_version': current.LEARNING_PATHS['version']},
              'catalog_size': len(EXERCISES), 'results': results}
    text = json.dumps(report, ensure_ascii=False, indent=2) + '\n'
    if args.output:
        args.output.write_text(text)
        print('Saved synthetic engine comparison:', args.output)
    for row in results:
        print(row['profile'], row['track'], f"day {row['days']}", f"({row['runs']} runs)")
        for key in row['current']:
            print(f"  {key}: {row['base'][key] if row['base'] else '-'} -> {row['current'][key]}")


if __name__ == '__main__':
    main()
