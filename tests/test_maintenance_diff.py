"""scripts/maintenance_diff.py: read-only review of a daily maintenance diff (synthetic problem bank)."""
import json
import shutil
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'maintenance_diff.py'


def run_check(tmp_path, base, head, targets):
    (tmp_path / 'scripts').mkdir()
    shutil.copy(SCRIPT, tmp_path / 'scripts' / 'maintenance_diff.py')
    bank = tmp_path / 'curriculum' / 'problem_bank.json'
    bank.parent.mkdir()
    bank.write_text(json.dumps(base, ensure_ascii=False))
    git = ['git', '-c', 'user.name=test', '-c', 'user.email=test@example.com']
    for args in (['init', '-q'], ['add', '.'], ['commit', '-qm', 'base']):
        subprocess.run(git + args, cwd=tmp_path, check=True, capture_output=True)
    bank.write_text(json.dumps(head, ensure_ascii=False))
    result = subprocess.run([sys.executable, '-I', str(tmp_path / 'scripts' / 'maintenance_diff.py'), '--targets', *targets],
                            capture_output=True, text=True, check=True)
    return result.stdout


def test_flags_churn_unbumped_learner_change_and_damaged_text(tmp_path):
    a = {'id': 'a-01', 'version': 1, 'title': '합계', 'misconception': ''}
    b = {'id': 'b-01', 'version': 1, 'title': '평균'}
    base = {'coverage': {'x': 1, 'y': 2}, 'exercises': [a, b]}
    head = {'coverage': {'y': 2, 'x': 1}, 'exercises': [
        dict(a, title='합계 다시', misconception='합110을5로 나눈다'),
        dict(b, version=2, title='平均'),
    ]}
    out = run_check(tmp_path, base, head, ['a-01', 'b-01', 'c-01'])
    assert 'FLAG top-level "coverage" reordered only' in out
    assert "FLAG a-01: learner fields ['title'] changed with version +0" in out
    assert 'Hangul directly followed by digit' in out
    assert 'non-Hangul CJK character' in out
    assert 'FLAG c-01: target has no change' in out


def test_clean_maintenance_prints_no_flag(tmp_path):
    a = {'id': 'a-01', 'version': 1, 'title': '합계'}
    out = run_check(tmp_path, {'exercises': [a]}, {'exercises': [dict(a, version=2, title='합계 정리')]}, ['a-01'])
    assert 'a-01: v1->v2' in out and 'FLAG' not in out
