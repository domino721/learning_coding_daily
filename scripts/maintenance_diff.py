"""Read-only review of a daily maintenance diff in curriculum/problem_bank.json.

Compares the working tree against a git ref (default HEAD) and prints what changed,
so the run can reopen its own output instead of trusting that the writes succeeded.

Usage: python3 -I scripts/maintenance_diff.py --targets ID [ID ...] [--base REF]

Lines starting with FLAG need a fix or a one-line justification in the final report.
The script never modifies files and always exits 0 unless it cannot read its inputs.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANK = 'curriculum/problem_bank.json'
# Fields the learner sees; a change here requires a version increase.
LEARNER_FIELDS = ('kind', 'title', 'prompt', 'code', 'answer', 'explanation', 'hints',
                  'choices', 'accepted', 'level', 'response_mode')
NON_HANGUL_CJK = re.compile(r'[぀-ヿ一-鿿]')
HANGUL_THEN_DIGIT = re.compile(r'[가-힣][0-9]')


def load_base(ref):
    out = subprocess.run(['git', 'show', f'{ref}:{BANK}'], cwd=ROOT,
                         capture_output=True, text=True)
    if out.returncode != 0:
        sys.exit(f'cannot read {BANK} at {ref}: {out.stderr.strip()}')
    return out.stdout


def strings(value, path=''):
    if isinstance(value, str):
        yield path, value
    elif isinstance(value, dict):
        for k, v in value.items():
            yield from strings(v, f'{path}.{k}' if path else k)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            yield from strings(v, f'{path}[{i}]')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--targets', nargs='+', required=True)
    ap.add_argument('--base', default='HEAD')
    args = ap.parse_args()

    base_text = load_base(args.base)
    head_text = (ROOT / BANK).read_text()
    base, head = json.loads(base_text), json.loads(head_text)
    old = {e['id']: e for e in base['exercises']}
    new = {e['id']: e for e in head['exercises']}
    targets = set(args.targets)

    for key in sorted(set(base) | set(head)):
        if key == 'exercises':
            continue
        b, h = base.get(key), head.get(key)
        if b != h:
            print(f'FLAG top-level "{key}" changed in content; not part of the five items?')
        elif json.dumps(b, ensure_ascii=False) != json.dumps(h, ensure_ascii=False):
            print(f'FLAG top-level "{key}" reordered only (same content); revert the churn')

    for eid in sorted(set(old) | set(new)):
        o, n = old.get(eid), new.get(eid)
        if o == n:
            continue
        if o is None or n is None:
            print(f'FLAG {eid}: {"added" if o is None else "removed"}')
            continue
        fields = sorted(k for k in set(o) | set(n) if o.get(k) != n.get(k))
        learner = [k for k in fields if k in LEARNER_FIELDS]
        bumped = n.get('version', 0) - o.get('version', 0)
        print(f'{eid}: v{o.get("version")}->v{n.get("version")} changed={",".join(fields)}')
        if eid not in targets:
            print(f'FLAG {eid}: changed but not a target')
        if learner and bumped != 1:
            print(f'FLAG {eid}: learner fields {learner} changed with version +{bumped}')
        if not learner and bumped:
            print(f'FLAG {eid}: version +{bumped} with no learner-visible change')
        for path, text in strings({k: n[k] for k in fields}):
            for pattern, label in ((NON_HANGUL_CJK, 'non-Hangul CJK character'),
                                   (HANGUL_THEN_DIGIT, 'Hangul directly followed by digit')):
                m = pattern.search(text)
                if m:
                    lo = max(m.start() - 12, 0)
                    print(f'FLAG {eid}.{path}: {label}: …{text[lo:m.end() + 12]}…')

    for eid in sorted(targets - {e for e in new if old.get(e) != new.get(e)}):
        print(f'FLAG {eid}: target has no change in {BANK}')


if __name__ == '__main__':
    main()
