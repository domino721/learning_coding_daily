"""Validate trusted repository terminal and Git items using only the starting state shown to the learner.

The comment header at the top of an item is its whole starting state, so nothing hidden can disagree with it:
- a folder tree rooted at `~/` (home, shown as /home/mina). Folders end with `/`, `*` marks an executable file
  and `← 지금 위치` marks the folder the commands start in (the tree root when absent);
- `<path> 내용:` followed by `#   <line>` lines holds a file's lines (path from the tree root);
- `지금 위치는 git 저장소입니다.` runs git init there, and `위 파일은 "<메시지>"로 커밋됨` commits every file once.
Each run builds that state in a fresh temporary home and runs the code with bash (LC_ALL=C, fixed Git identity
and dates). stdout and stderr are merged the way a terminal shows them, and bash's own messages read `bash: ...`.
Git items are graded on the output of their last command; the commands before it set up the scene.
Only repository-authored snippets run, never learner input, and a static guard refuses commands that could
reach outside the temporary home.
"""
import json
import os
import re
import shlex
import shutil
import subprocess
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

SHELL_DOMAINS = ('터미널', 'Git')
HOME = '/home/mina'
GIT_DATE = '2026-10-29T09:00:00+09:00'
TREE_ROOT = re.compile(r'# ~/((?:[\w.-]+/)*)(\s+← 지금 위치)?')
TREE_ITEM = re.compile(r'# ((?:│   |    )*)[├└]── ([\w.-](?:[\w. -]*[\w.-])?/?\*?)(\s+← 지금 위치)?')
CONTENT = re.compile(r'# ([\w.-](?:[\w./ -]*[\w.-])?) 내용:')
REPO = '# 지금 위치는 git 저장소입니다.'
COMMIT = re.compile(r'# 위 파일은 "([^"]+)"(?:으로|로) 커밋됨')
# Authored items stay inside the temporary home: no privilege, network, package-install, process or absolute-path
# commands (except the shown home and /dev/null), and no rm through a variable or a parent folder.
FORBIDDEN = re.compile(r'\b(sudo|su|curl|wget|ssh|scp|rsync|dd|mkfs|shutdown|reboot|kill|pkill|killall|chown|nc|eval'
                       r'|npm|brew|apt|apt-get|yum)\b|\bpip3?\b.*\binstall\b'
                       r'|\bgit\b.*(://|@)|(?:^|[\s=\'"(<>|;&])/(?!home/mina\b|dev/null\b)')
UNSAFE_RM = re.compile(r'\brm\b[^\n;&|]*(\$|\.\.)')
GITCONFIG = '[user]\n\tname = mina\n\temail = mina@example.com\n[init]\n\tdefaultBranch = main\n' \
            '[core]\n\tautocrlf = false\n[color]\n\tui = false\n'


def is_shell(exercise):
    return exercise.domain in SHELL_DOMAINS


def squash(text):
    """Terminal output compared word by word: `ls` columns and one name per line read the same."""
    return ' '.join(text.split())


def same(shown, expected, entry):
    """Word-by-word by default; `compare: exact` keeps spacing such as git status --short columns, and
    `compare: last-line` reads only the last line, since traceback frames change between Python versions."""
    if entry.get('compare') == 'exact':
        return shown.rstrip() == expected.rstrip()
    if entry.get('compare') == 'last-line':
        return shown.rstrip().split('\n')[-1] == expected.rstrip().split('\n')[-1]
    return squash(shown) == squash(expected)


def check_safe(text):
    for line in text.split('\n'):
        if line.startswith('#!'):
            continue
        if FORBIDDEN.search(line) or UNSAFE_RM.search(line):
            raise ValueError(f'unsafe authored command: {line}')


def starting_state(code):
    """Folders, files, start folder and repository the header shows, as paths below home."""
    dirs, files, start, repo, commit = {''}, {}, None, False, None
    base, stack, mode, current = None, [], None, None
    for line in code.split('\n'):
        if not line.startswith('#') or line.startswith('#!'):
            break
        if mode == 'content' and line.startswith('#   '):
            files[current][0].append(line[4:])
            continue
        previous, mode = mode, None
        if root := TREE_ROOT.fullmatch(line):
            base, stack, mode = root[1].rstrip('/'), [], 'tree'
            parts = base.split('/') if base else []
            dirs.update('/'.join(parts[:depth]) for depth in range(1, len(parts) + 1))
            if root[2]:
                start = base
        elif previous == 'tree' and (item := TREE_ITEM.fullmatch(line)):
            depth, name = len(item[1]) // 4, item[2]
            if depth > len(stack):
                raise ValueError(f'tree line skips a level: {line}')
            stack = stack[:depth]
            path = '/'.join(part for part in (base, *stack, name.rstrip('/*')) if part)
            if name.endswith('/'):
                dirs.add(path)
                stack.append(name.rstrip('/'))
            else:
                files[path] = ([], name.endswith('*'))
            if item[3]:
                if not name.endswith('/'):
                    raise ValueError('← 지금 위치 must mark a folder')
                start = path
            mode = 'tree'
        elif content := CONTENT.fullmatch(line):
            current = '/'.join(part for part in (base, content[1]) if part)
            if current not in files:
                raise ValueError(f'file contents shown for a file missing from the tree: {content[1]}')
            mode = 'content'
        elif line == REPO:
            repo = True
        elif commit_line := COMMIT.fullmatch(line):
            if not repo:
                raise ValueError('a commit needs the repository line first')
            commit = commit_line[1]
    for lines, _ in files.values():
        check_safe('\n'.join(lines))
    return {'dirs': dirs, 'files': {path: ('\n'.join(lines) + '\n' if lines else '', exe) for path, (lines, exe) in files.items()},
            'start': start if start is not None else base or '', 'repo': repo, 'commit': commit}


def tool_dir(path):
    """git and the project's Python 3.12 (the .venv base interpreter) ahead of /usr/bin."""
    path.mkdir(parents=True)
    venv = ROOT / '.venv/bin/python3'
    python = os.path.realpath(venv if venv.exists() else sys.executable)
    os.symlink(python, path / 'python3')
    os.symlink(os.path.realpath(shutil.which('git')), path / 'git')


def run_shell(code, capture='all', check=None):
    """Run authored code from the shown starting state and return what the terminal shows.

    With `check`, the code runs silently in a subshell and only the check commands' output (run from the
    start folder) is returned, so an order or option is graded on the state it leaves behind.
    """
    check_safe(code)
    state = starting_state(code)
    with tempfile.TemporaryDirectory() as tmp:
        # Deep enough that `..` from home never leaves the temporary directory.
        root = os.path.realpath(os.path.join(tmp, *['x'] * 8))
        home = root + HOME
        run = Path(root) / '.run'
        tool_dir(run / 'bin')
        (run / 'gitconfig').write_text(GITCONFIG)
        for folder in sorted(state['dirs']):
            os.makedirs(os.path.join(home, folder), exist_ok=True)
        for path, (text, executable) in state['files'].items():
            target = Path(home, path)
            target.write_text(text)
            if executable:
                target.chmod(0o755)
        cwd = os.path.join(home, state['start']) if state['start'] else home
        env = {'HOME': home, 'USER': 'mina', 'LOGNAME': 'mina', 'SHELL': '/bin/bash', 'PWD': cwd,
               'PATH': f'{run}/bin:/usr/bin:/bin', 'LC_ALL': 'C', 'LANG': 'C', 'TZ': 'UTC', 'TERM': 'dumb',
               'GIT_CONFIG_NOSYSTEM': '1', 'GIT_CONFIG_GLOBAL': str(run / 'gitconfig'),
               'GIT_AUTHOR_DATE': GIT_DATE, 'GIT_COMMITTER_DATE': GIT_DATE,
               'PYTHONDONTWRITEBYTECODE': '1', 'PYTHONIOENCODING': 'utf-8'}
        if state['repo']:
            subprocess.run(['git', 'init', '-q'], cwd=cwd, env=env, check=True)
            if state['commit']:
                subprocess.run(['git', 'add', '-A'], cwd=cwd, env=env, check=True)
                subprocess.run(['git', 'commit', '-q', '-m', state['commit']], cwd=cwd, env=env, check=True)
        lines = code.replace(HOME, home).split('\n')
        if check is not None:
            check_safe(check)
            lines = ['(', ':', *lines, ') >/dev/null 2>&1', f'cd {shlex.quote(cwd)}', *check.replace(HOME, home).split('\n')]
        elif capture == 'last':
            last = max(i for i, line in enumerate(lines) if line.strip() and not line.lstrip().startswith('#'))
            lines = ['{', ':', *lines[:last], '} >/dev/null 2>&1', *lines[last:]]
        script = run / 'item.sh'
        script.write_text('\n'.join(lines) + '\n')
        result = subprocess.run(['bash', str(script)], cwd=cwd, env=env, stdout=subprocess.PIPE,
                                stderr=subprocess.STDOUT, timeout=30)
        text = result.stdout.decode('utf-8', 'replace').replace(root, '')
        return re.sub(r'^/\.run/item\.sh: line \d+: ', 'bash: ', text, flags=re.M).rstrip()


def review_entries(exercises):
    """Review entries of the given items, read from each card's review record."""
    cards = {card['id']: card for card in json.loads((ROOT / 'curriculum/problem_bank.json').read_text())['exercises']}
    entries = {}
    for record in sorted({cards[ex.id]['review_record'] for ex in exercises if ex.id in cards}):
        entries.update({entry['id']: entry for entry in json.loads((ROOT / record).read_text()).get('items', [])})
    return entries


def capture_of(exercise, entry):
    return entry.get('capture') or ('last' if exercise.domain == 'Git' else 'all')


def patched(code, lines):
    rows = code.split('\n')
    for number, text in lines.items():
        rows[int(number) - 1] = text
    return '\n'.join(row for index, row in enumerate(rows, 1) if lines.get(str(index)) != '')


def variants(exercise, entry, traps=()):
    """(label, program, expectation): 'same' as reference_output, 'other' than it, or 'fix'."""
    if exercise.kind == 'order':
        assemble = lambda order: exercise.code + '\n' + '\n'.join(exercise.choices[int(n) - 1] for n in order.split(','))
        return ([(f'order {o}', assemble(o), 'same') for o in (exercise.answer, *exercise.accepted)]
                + [(f'trap {o}', assemble(o), 'other') for o in traps])
    if exercise.kind == 'line':
        return [('shown', exercise.code, 'same'), ('fix', patched(exercise.code, entry['fix']['lines']), 'fix')]
    if exercise.kind == 'multi':
        correct = set(exercise.answer.split(','))
        return [(f'option {n}', exercise.code.replace('____', option), 'same' if str(n) in correct else 'other')
                for n, option in enumerate(exercise.choices, 1)]
    return [('shown', exercise.code.replace('____', exercise.answer), 'same')]


def outputs(jobs):
    """Run (program, capture, check) jobs in parallel; each gets its own temporary home."""
    with ThreadPoolExecutor(max_workers=8) as pool:
        return list(pool.map(lambda job: run_shell(*job), jobs))


def validate_all(exercises, entries=None, traps=None):
    """Every shell item reproduces its key: answer, reference_output, each option, order and fix."""
    shell = [ex for ex in exercises if is_shell(ex)]
    entries = review_entries(shell) if entries is None else entries
    traps = traps if traps is not None else {card['id']: list(card.get('distractor_targets', {}))
                                             for card in json.loads((ROOT / 'curriculum/problem_bank.json').read_text())['exercises']}
    jobs, checks = [], []
    for ex in shell:
        entry = entries.get(ex.id)
        if entry is None:
            raise ValueError(f'{ex.id}: shell item needs a review entry')
        if entry.get('verify') == 'documented':
            if not entry.get('sources') or not entry.get('basis'):
                raise ValueError(f'{ex.id}: a documented item needs sources and a basis')
            continue
        if not ex.reference_output:
            raise ValueError(f'{ex.id}: shell item needs reference_output')
        if ex.kind not in ('line', 'order', 'multi') and ex.reference_output != ex.answer:
            raise ValueError(f'{ex.id}: a choice answer must be the shown output')
        for label, program, expected in variants(ex, entry, traps.get(ex.id, ()) if ex.kind == 'order' else ()):
            jobs.append((program, capture_of(ex, entry), entry.get('check')))
            checks.append((ex, entry, label, expected))
    for (ex, entry, label, expected), shown in zip(checks, outputs(jobs)):
        if expected == 'fix':
            if not same(shown, entry['fix']['output'], entry):
                raise ValueError(f'{ex.id}: fixed code shows {shown!r}, review says {entry["fix"]["output"]!r}')
        elif same(shown, ex.reference_output, entry) != (expected == 'same'):
            raise ValueError(f'{ex.id}: {label} shows {shown!r}; reference_output is {ex.reference_output!r}')
    return len(shell)


if __name__ == '__main__':
    from backend.content import EXERCISES
    print(f'Validated shown starting states for {validate_all(EXERCISES)} terminal and Git exercises')
