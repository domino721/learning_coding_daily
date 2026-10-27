"""Aggregate exported backup files (learning-coding-daily-backup v1) into per-item learning statistics.

Usage: python3 -I scripts/analyze-backups.py backup1.json [backup2.json ...] [--min-n 2] [--markdown out.md]

Runs offline on files the beta testers chose to hand over. It prints only exercise-level aggregates
(no learner identifiers, answers or free text) so the result can be pasted into a review record.
"""
import argparse
import json
import statistics
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = json.loads((ROOT / 'src/curriculum.json').read_text(encoding='utf-8'))
META = {ex['id']: ex for ex in CATALOG['exercises']}


def load(path):
    data = json.loads(Path(path).read_text(encoding='utf-8'))
    if data.get('format') != 'learning-coding-daily-backup' or data.get('version') != 1:
        raise SystemExit(f'{path}: 매일코딩 백업 v1 형식이 아닙니다')
    return data['data']


def collect(stores):
    rows = defaultdict(lambda: {'presented': 0, 'completed': 0, 'correct': 0, 'independent': 0, 'hinted': 0,
                                 'hinted_correct': 0, 'revealed': 0, 'incorrect': 0, 'seconds': [], 'review': 0, 'learners': set()})
    for learner, store in enumerate(stores):
        for session in store.get('sessions', []):
            for item in session.get('items', []):
                r = rows[item['id']]
                r['presented'] += 1
                r['learners'].add(learner)
                if item.get('category') in ('review', 'practice'):
                    r['review'] += 1
                status = item.get('status')
                if status == 'pending':
                    continue
                r['completed'] += 1
                hints = item.get('hints_used', 0)
                attempts = item.get('attempts_count', 0)
                if hints:
                    r['hinted'] += 1
                if status == 'correct':
                    r['correct'] += 1
                    if hints:
                        r['hinted_correct'] += 1
                    elif attempts <= 1:
                        r['independent'] += 1
                elif status == 'revealed':
                    r['revealed'] += 1
                elif status == 'incorrect':
                    r['incorrect'] += 1
                if item.get('active_seconds', 0) > 0:
                    r['seconds'].append(item['active_seconds'])
    return rows


def pct(n, d):
    return '-' if not d else f'{100 * n / d:.0f}%'


def render(rows, min_n):
    header = ['문항', '개념', '단계', '제시', '완료', '독립정답', '정답률', '힌트후성공', '해설', '오답', '중앙값초', '판정']
    lines = ['| ' + ' | '.join(header) + ' |', '|' + '---|' * len(header)]
    flagged = []
    for key, r in sorted(rows.items(), key=lambda kv: (-kv[1]['completed'], kv[0])):
        if r['completed'] < min_n:
            continue
        meta = META.get(key, {})
        median = int(statistics.median(r['seconds'])) if r['seconds'] else '-'
        rate = r['correct'] / r['completed']
        verdict = ''
        if rate >= 0.95 and r['independent'] == r['completed'] and r['completed'] >= 3:
            verdict = '너무 쉬움 후보'
        elif rate < 0.4:
            verdict = '너무 어려움·보기 검토 후보'
        elif r['hinted'] and r['hinted_correct'] / r['hinted'] < 0.5:
            verdict = '힌트 개선 후보'
        if verdict:
            flagged.append((key, verdict))
        lines.append('| ' + ' | '.join(str(x) for x in [key, meta.get('concept_id', '?'), meta.get('level', '?'), r['presented'], r['completed'],
                     r['independent'], pct(r['correct'], r['completed']), pct(r['hinted_correct'], r['hinted']), r['revealed'], r['incorrect'], median, verdict]) + ' |')
    return lines, flagged


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('files', nargs='+')
    parser.add_argument('--min-n', type=int, default=2, help='표에 포함할 최소 완료 수')
    parser.add_argument('--markdown', help='결과를 저장할 Markdown 경로')
    args = parser.parse_args()
    stores = [load(f) for f in args.files]
    rows = collect(stores)
    lines, flagged = render(rows, args.min_n)
    total = sum(r['completed'] for r in rows.values())
    summary = [f'# 백업 집계 ({len(stores)}개 파일, 완료 {total}건, 문항 {len(rows)}개)', '',
               '개인 식별 정보 없이 문항별 집계만 포함한다. 표본이 작으므로 난이도 변경은 검수 기록과 함께 판단한다.', '']
    out = '\n'.join(summary + lines + ['', '## 검토 후보'] + [f'- {k}: {v}' for k, v in flagged] + [''])
    if args.markdown:
        Path(args.markdown).write_text(out, encoding='utf-8')
    sys.stdout.write(out)


if __name__ == '__main__':
    main()
