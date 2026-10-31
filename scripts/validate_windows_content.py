"""Validate the Windows track by running every item in real Windows PowerShell 5.1, PowerShell 7 and cmd (CR-021).

As in scripts/validate_shell_content.py, the comment header at the top of an item is its whole starting state:
- the first line names the window: `Windows PowerShell` (5.1, the version Windows ships), `PowerShell 7`, or a
  name ending in `(cmd)` such as `명령 프롬프트(cmd)` or `Anaconda Prompt (cmd)`;
- an absolute folder line such as `C:\\Users\\mina\\app` (optionally `← 지금 위치`) roots a tree drawn with
  ├──/└──. Folders end with `\\`, `(숨김)` sets the hidden attribute and `report.exe  (실행하면 report ok 출력)`
  is a console program that prints that text;
- `<path> 내용:` followed by `#   <line>` lines holds a file's lines (path below the nearest root).
Without a `← 지금 위치` mark the commands start in the first root, or in C:\\Users\\mina when no root is shown.
cmd items write the header with REM instead of #. Lines shaped like a prompt (`C:\\Users\\mina\\memo> ____`,
`PS C:\\Users\\mina\\memo> ____`) run that command in the window the prompt belongs to. A Python-file item (first
line `# <name>.py ...`) is that file: it is saved in C:\\Users\\mina\\app beside the files its header shows and
run with `python <name>.py` in Windows PowerShell.

Each run rebuilds that state for real under C:\\Users\\mina (and D:\\ for a second drive) and types the commands
into the window line by line, the way a learner pastes them: `-Command -` with -NonInteractive for PowerShell (a
confirmation prompt shows up as an error instead of waiting) and standard input for cmd. The window gets a
company-PC PATH (Windows, Windows PowerShell, Python 3.12, Git's cmd folder), so the Unix tools a CI image adds
(touch, cat, ls) are missing as on a learner's PC, and user mina's profile. The execution policy starts at the
Windows 10/11 default (Restricted). Review entries may set `policy`, `confirm` (answer Y to that command's
confirmation prompt), `emulate: cp949` (open() without encoding decodes like Korean Windows, whose ANSI code page
the English runner lacks: open(), Python's console output and the window's code page use 949) and `runs`
(facts the explanation states: commands run from the item's starting state, or a whole item of their own, each
with its expected output).
Outputs are compared word by word after removing the cmd banner and prompt, writing file times as <시각> and the
runner's Python folder as a usual install folder. Only repository-authored items run, never learner input.

Execution writes to C:\\Users\\mina and D:\\ and changes the execution policy, so it runs only on a disposable
GitHub Actions Windows runner (.github/workflows/quality.yml). Elsewhere validate_all(..., execute=False) builds
every run without executing it, so a header, review entry or answer key that cannot be checked fails locally too.
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from dataclasses import dataclass, field
from pathlib import Path, PureWindowsPath

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

DOMAIN = 'Windows'
HOME = 'C:\\Users\\mina'
APP = HOME + '\\app'
DISPLAY_PYTHON = {'3.12': HOME + '\\AppData\\Local\\Programs\\Python\\Python312',
                  '3.15': HOME + '\\AppData\\Local\\Programs\\Python\\Python315'}
LINE = re.compile(r'(#|REM)(?: (.*))?')
ROOT_LINE = re.compile(r'(?:#|REM) ([A-Z]:\\(?:[A-Za-z0-9._-](?:[A-Za-z0-9 ._-]*[A-Za-z0-9._-])?\\?)*)(\s+← 지금 위치)?')
TREE_ITEM = re.compile(r'(?:#|REM) ((?:│   |    )*)[├└]── ([A-Za-z0-9._-](?:[A-Za-z0-9 ._-]*[A-Za-z0-9._-])?\\?)'
                       r'(?:\s{2,}\(([^)]*)\))?(\s+← 지금 위치)?')
CONTENT = re.compile(r'(?:#|REM) ([A-Za-z0-9._-](?:[A-Za-z0-9 .\\_-]*[A-Za-z0-9._-])?) 내용:')
CONTENT_LINE = re.compile(r'(?:#|REM)   (.*)')
PROMPT_LINE = re.compile(r'(PS )?([A-Z]:\\[^>\n]*)> (.*)')
PYTHON_FILE = re.compile(r'# ([A-Za-z0-9_-]+\.py)\b.*')
EXE_NOTE = re.compile(r'실행하면 (.+) 출력')
PROMPT_MARK, CHECK_MARK, ERRORS = '@@PROMPT@@', '@@CHECK@@', re.compile(r'@@ERRORS:(\d+)@@\n?')
# Authored items stay on the shown folders: no network, account, service or registry commands, and commands use no
# absolute path outside C:\Users\mina and the second drive D:\ (file contents are data and may print any path).
FORBIDDEN = re.compile(r'(?i)\b(Invoke-WebRequest|Invoke-RestMethod|iwr|irm|curl|wget|Start-Process|runas|reg|net(?!\.)'
                       r'|shutdown|Restart-Computer|Stop-Computer|Format-Volume|diskpart|bcdedit|takeown|icacls)\b'
                       r'|\bpip3?\s+install\b')
OUTSIDE = re.compile(r'(?<![\w\\])(?![CD]:\\)[A-Z]:\\|C:\\(?!Users\\mina\b)')
CMD_ERRORS = ('is not recognized as an internal or external command', 'The system cannot find',
              'The syntax of the command is incorrect', 'Access is denied', 'Traceback (most recent call last)')
CSHARP = 'class P {{ static void Main() {{ System.Console.WriteLine(@"{text}"); }} }}'
CP949 = ('import builtins\n_open = builtins.open\n\n\n'
         'def cp949_open(file, mode="r", buffering=-1, encoding=None, *args, **kwargs):\n'
         '    """Korean Windows: open() without encoding decodes text with the ANSI code page 949."""\n'
         '    if "b" not in mode and encoding is None:\n        encoding = "cp949"\n'
         '    return _open(file, mode, buffering, encoding, *args, **kwargs)\n\n\nbuiltins.open = cp949_open\n')


def is_windows(exercise):
    return exercise.domain == DOMAIN


@dataclass
class State:
    shell: str
    dirs: set = field(default_factory=set)
    files: dict = field(default_factory=dict)  # path -> (text, hidden, exe output or None)
    start: str = HOME
    prompts: list = field(default_factory=list)  # (shell, folder, command) for prompt-shaped lines
    python_file: str = ''


def window_of(text):
    if 'PowerShell 7' in text:
        return 'pwsh'
    if 'Windows PowerShell' in text:
        return 'powershell'
    if '(cmd)' in text:
        return 'cmd'
    return None


def check_safe(text, commands=True):
    for line in text.split('\n'):
        if not LINE.fullmatch(line.strip()) and (FORBIDDEN.search(line) or commands and OUTSIDE.search(line)):
            raise ValueError(f'unsafe authored command: {line}')


def starting_state(code):
    """The window, folders, files, start folder and prompt lines the header and code show."""
    lines = code.split('\n')
    head = lines[0]
    if python := PYTHON_FILE.fullmatch(head):
        state = State('powershell', dirs={HOME, APP}, start=APP, python_file=python[1])
    else:
        state = State(window_of(head) or '')
    state.dirs.add(HOME)
    base, stack, mode, current, marked, first = None, [], None, None, False, None
    for line in lines:
        if not LINE.fullmatch(line) and not line.startswith(('#', 'REM ')):
            break
        if mode == 'content' and (row := CONTENT_LINE.fullmatch(line)):
            state.files[current][0].append(row[1])
            continue
        previous, mode = mode, None
        if root := ROOT_LINE.fullmatch(line):
            base, stack, mode = root[1].rstrip('\\'), [], 'tree'
            parts = PureWindowsPath(base).parts
            state.dirs.update(folder for depth in range(2, len(parts) + 1)
                              if not HOME.startswith((folder := str(PureWindowsPath(*parts[:depth]))) + '\\'))
            first = first or base
            if root[2]:
                state.start, marked = base, True
        elif previous == 'tree' and (item := TREE_ITEM.fullmatch(line)):
            depth, name, note = len(item[1]) // 4, item[2], item[3] or ''
            if depth > len(stack):
                raise ValueError(f'tree line skips a level: {line}')
            stack = stack[:depth]
            path = '\\'.join([base, *stack, name.rstrip('\\')])
            hidden = '숨김' in note
            if name.endswith('\\'):
                state.dirs.add(path)
                stack.append(name.rstrip('\\'))
                state.files.pop(path, None)
                if hidden:
                    state.files[path] = (None, True, None)
            else:
                exe = EXE_NOTE.search(note)
                if path.lower().endswith('.exe') != bool(exe):
                    raise ValueError(f'a .exe shows what it prints: (실행하면 … 출력): {line}')
                state.files[path] = ([], hidden, exe[1] if exe else None)
            if item[4]:
                if not name.endswith('\\'):
                    raise ValueError('← 지금 위치 must mark a folder')
                state.start, marked = path, True
            mode = 'tree'
        elif content := CONTENT.fullmatch(line):
            folder = base or (APP if state.python_file else None)
            current = f'{folder}\\{content[1]}' if folder else None
            if state.python_file and current not in state.files:
                state.files[current] = ([], False, None)
            if current not in state.files or state.files[current][0] is None:
                raise ValueError(f'file contents shown for a file missing from the tree: {content[1]}')
            mode = 'content'
    if not marked and first and not state.python_file:
        state.start = first
    for line in lines:
        if prompt := PROMPT_LINE.fullmatch(line):
            state.prompts.append(('powershell' if prompt[1] else 'cmd', prompt[2], prompt[3]))
    if not state.shell and not state.prompts:
        raise ValueError(f'the first line must name the window: {head}')
    for path in [*state.dirs, *state.files, state.start, *(folder for _, folder, _ in state.prompts)]:
        if not (path == HOME or path.startswith(HOME + '\\') or re.match(r'D:\\[A-Za-z0-9._-]', path)):
            raise ValueError(f'items stay in C:\\Users\\mina and D:\\: {path}')
    if state.start not in state.dirs:
        raise ValueError(f'start folder {state.start} is not in the tree')
    for text, _, _ in state.files.values():
        if text:
            check_safe('\n'.join(text), commands=False)
    check_safe(code, commands=not state.python_file)
    return state


@dataclass
class Job:
    label: str
    shell: str
    code: str
    expect: str  # same | other | fix | error | run | cross
    entry: dict
    check: str = None
    python: str = '3.12'
    output: str = None  # expected text for fix/run jobs
    compare: str = None
    works: bool = None  # cross: the answer key says this option acts the same in every window
    policy: str = None  # a run's own execution policy, else the entry's
    confirm: list = None  # a run's own confirmation answers, else the entry's

    def __post_init__(self):
        self.policy = self.policy or self.entry.get('policy', 'Restricted')
        self.confirm = self.entry.get('confirm', []) if self.confirm is None else self.confirm


def patched(code, lines):
    rows = code.split('\n')
    for number, text in lines.items():
        rows[int(number) - 1] = text
    return '\n'.join(row for index, row in enumerate(rows, 1) if lines.get(str(index)) != '')


def check_for(entry, shell):
    check = entry.get('check')
    return check.get(shell) if isinstance(check, dict) else check


def header(code):
    """The leading comment lines: the starting state without the item's commands."""
    lines = code.split('\n')
    end = next((i for i, line in enumerate(lines) if not LINE.fullmatch(line)), len(lines))
    return '\n'.join(lines[:end])


def variants(exercise, entry, traps=()):
    """Runs that must reproduce the review: answer, options, order traps, line fix and the explanation's facts."""
    shell = starting_state(exercise.code.replace('____', exercise.answer)).shell
    job = lambda label, code, expect, **extra: Job(label, extra.pop('shell', shell), code, expect, entry,
                                                    check=check_for(entry, extra.pop('shell_check', shell)), **extra)
    jobs = []
    if exercise.kind == 'choice' and exercise.answer == exercise.reference_output:
        jobs.append(job('shown', exercise.code.replace('____', exercise.answer), 'same'))
    elif exercise.kind == 'choice' and '____' not in exercise.code:
        # Reading a result: the shown code reproduces what the prompt reports, and `runs` check each option's claim.
        if not entry.get('runs'):
            raise ValueError(f'{exercise.id}: an interpretation item needs runs that check its options')
        jobs.append(job('shown', exercise.code, 'same'))
    elif exercise.kind == 'choice':
        jobs += [job(f'option {n}', exercise.code.replace('____', option), 'same' if option == exercise.answer else 'other')
                 for n, option in enumerate(exercise.choices, 1)]
    elif exercise.kind == 'line':
        fix = entry['fix']
        jobs.append(job('shown', exercise.code, 'error'))
        jobs.append(job('fix', patched(exercise.code, fix['lines']), 'fix', output=fix['output'], compare=fix.get('compare')))
    elif exercise.kind == 'multi':
        correct = set(exercise.answer.split(','))
        for n, option in enumerate(exercise.choices, 1):
            code = exercise.code.replace('____', option)
            state = starting_state(code)
            if state.prompts:
                # Each prompt line runs on its own in its window; correct options act the same in every window.
                for window, _, command in state.prompts:
                    jobs.append(job(f'option {n} {window}', code, 'cross', shell=window, shell_check=window,
                                    works=str(n) in correct))
            else:
                jobs.append(job(f'option {n}', code, 'same' if str(n) in correct else 'other'))
    elif exercise.kind == 'order':
        assemble = lambda order: exercise.code + '\n' + '\n'.join(exercise.choices[int(k) - 1] for k in order.split(','))
        jobs += [job(f'order {o}', assemble(o), 'same') for o in (exercise.answer, *exercise.accepted)]
        jobs += [job(f'trap {o}', assemble(o), 'other') for o in traps]
    for n, run in enumerate(entry.get('runs', []), 1):
        given = run.get('code')
        if given is None:  # the shown item again, e.g. under another Python
            code = exercise.code.replace('____', exercise.answer)
        elif window_of(given.split('\n')[0]) or PYTHON_FILE.fullmatch(given.split('\n')[0]):
            code = given
        else:  # commands typed into the item's starting state
            code = header(exercise.code) + '\n' + given
        jobs.append(Job(f'run {n}', starting_state(code).shell, code, 'run', entry, check=run.get('check'),
                        python=run.get('python', '3.12'), output=run['output'], compare=run.get('compare'),
                        policy=run.get('policy'), confirm=run.get('confirm')))
    return jobs


def squash(text):
    return ' '.join(text.split())


def same(shown, expected, compare=None):
    if compare == 'exact':
        return shown.rstrip() == expected.rstrip()
    if compare == 'last-line':
        return shown.rstrip().split('\n')[-1] == expected.rstrip().split('\n')[-1]
    if compare == 'contains':
        return squash(expected) in squash(shown)
    return squash(shown) == squash(expected)


def failed(result):
    """A PowerShell error record, a cmd error message or a Python traceback."""
    if result['shell'] == 'cmd':
        return any(message in result['output'] for message in CMD_ERRORS)
    return result['errors'] > 0 or 'Traceback (most recent call last)' in result['output']


def judge(exercise, job, result, cross):
    """Why the run disagrees with the review, or None."""
    shown, expected = result['output'], exercise.reference_output
    compare = job.compare or job.entry.get('compare')
    if job.expect in ('same', 'other') and same(shown, expected, compare) != (job.expect == 'same'):
        return f'{job.label} shows {shown!r}; reference_output is {expected!r}'
    if job.expect == 'error':
        if not same(shown, expected, compare or 'contains'):
            return f'shown code shows {shown!r}, not the reported {expected!r}'
        line = job.entry.get('error_line', int(exercise.answer))
        where = f', line {line}' if job.entry.get('raises') else exercise.code.split('\n')[line - 1].strip()
        if where not in shown:
            return f'the error does not point at line {line} ({where!r}): {shown!r}'
    if job.expect == 'fix' and (not same(shown, job.output, compare) or same(shown, expected, 'contains')):
        return f'fixed code shows {shown!r}, review says {job.output!r}'
    if job.expect == 'run' and not same(shown, job.output, job.compare):
        return f'{job.label} shows {shown!r}, review says {job.output!r}'
    if job.expect == 'cross':
        group = [r for j, r in cross if j.label.split(' ')[1] == job.label.split(' ')[1]]
        works = all(not failed(r) for r in group) and len({squash(r['output']) for r in group}) == 1
        if works != job.works:
            return f'{job.label}: the windows show {[r["output"] for r in group]!r}; the answer key says {job.output}'
    return None


# --- execution (disposable Windows runner only) -------------------------------------------------------------


class Machine:
    """The runner as the learner's PC: real folders under C:\\Users\\mina and D:\\, policy and environment."""

    def __init__(self):
        if os.name != 'nt' or os.environ.get('GITHUB_ACTIONS') != 'true':
            raise SystemExit('Windows items run only on a disposable GitHub Actions Windows runner.')
        self.tmp = Path(tempfile.mkdtemp(prefix='lcd-windows-'))
        self.powershell = shutil.which('powershell.exe')
        self.pwsh = shutil.which('pwsh.exe')
        self.pythons = {'3.12': os.environ.get('PYTHON312') or sys.executable, '3.15': os.environ.get('PYTHON315', '')}
        if not os.path.exists('D:\\'):
            os.makedirs('C:\\lcd-drive-d', exist_ok=True)
            subprocess.run(['subst', 'D:', 'C:\\lcd-drive-d'], check=True)
        self.d_before = set(os.listdir('D:\\'))
        self.policy, self.user_changed = None, True
        (self.tmp / 'cp949').mkdir()
        (self.tmp / 'cp949' / 'sitecustomize.py').write_text(CP949, encoding='utf-8')
        self.exes = {}

    def program(self, text):
        """A console program that prints text, compiled once with the .NET Framework compiler Windows includes."""
        if text not in self.exes:
            source = self.tmp / f'exe{len(self.exes)}.cs'
            source.write_text(CSHARP.format(text=text.replace('"', '""')), encoding='utf-8')
            target = self.tmp / f'exe{len(self.exes)}.exe'
            csc = Path(os.environ['WINDIR'], 'Microsoft.NET', 'Framework64', 'v4.0.30319', 'csc.exe')
            subprocess.run([str(csc), '/nologo', f'/out:{target}', str(source)], check=True, capture_output=True)
            self.exes[text] = target
        return self.exes[text]

    def ps(self, command):
        done = subprocess.run([self.powershell, '-NoLogo', '-NoProfile', '-NonInteractive', '-Command',
                               f"$ErrorActionPreference = 'Stop'; {command}; exit 0"],
                              env=self.base_env(), capture_output=True, timeout=120)
        if done.returncode:
            raise RuntimeError(f'{command} failed: {done.stdout.decode(errors="replace")}{done.stderr.decode(errors="replace")}')

    def reset(self, job):
        for root in [HOME] + [f'D:\\{name}' for name in set(os.listdir('D:\\')) - self.d_before]:
            if os.path.exists(root):
                subprocess.run(['attrib', '-h', '-s', '-r', root + '\\*', '/s', '/d'], capture_output=True)
                subprocess.run(['cmd', '/d', '/c', 'rmdir', '/s', '/q', root], capture_output=True)
        if self.policy != job.policy:
            self.ps(f'Set-ExecutionPolicy {job.policy} -Scope LocalMachine -Force')
            self.policy = job.policy
        if self.user_changed:
            # An option may set the current user's policy or, with setx, the user's environment; undo both.
            self.ps('Set-ExecutionPolicy Undefined -Scope CurrentUser -Force; foreach ($name in "API_URL", "MODE") { '
                    'if (Get-ItemProperty HKCU:\\Environment -Name $name -ErrorAction SilentlyContinue) { '
                    'Remove-ItemProperty HKCU:\\Environment -Name $name } }')
        self.user_changed = bool(re.search(r'(?i)ExecutionPolicy|setx', job.code))

    def build(self, state):
        for folder in sorted(state.dirs):
            os.makedirs(folder, exist_ok=True)
        for path, (lines, hidden, exe) in state.files.items():
            if exe is not None:
                shutil.copyfile(self.program(exe), path)
            elif lines is not None:
                Path(path).write_text('\n'.join(lines) + '\n' if lines else '', encoding='utf-8')
        for path, (_, hidden, _) in state.files.items():
            if hidden:
                subprocess.run(['attrib', '+h', path], check=True, capture_output=True)

    def base_env(self, python='3.12', shell='powershell'):
        keep = {k: v for k, v in os.environ.items()
                if k.upper() in ('SYSTEMROOT', 'WINDIR', 'COMSPEC', 'PATHEXT', 'SYSTEMDRIVE', 'TEMP', 'TMP', 'PROGRAMFILES',
                                 'PROGRAMFILES(X86)', 'PROGRAMDATA', 'PROGRAMW6432', 'COMMONPROGRAMFILES', 'ALLUSERSPROFILE',
                                 'NUMBER_OF_PROCESSORS', 'PROCESSOR_ARCHITECTURE', 'OS', 'COMPUTERNAME', 'PUBLIC')}
        system = os.environ['SYSTEMROOT']
        pydir = str(Path(self.pythons[python]).parent)
        path = [f'{system}\\system32', system, f'{system}\\System32\\Wbem', f'{system}\\System32\\WindowsPowerShell\\v1.0\\',
                f'{system}\\System32\\OpenSSH\\', 'C:\\Program Files\\Git\\cmd', f'{pydir}\\Scripts\\', f'{pydir}\\',
                f'{HOME}\\AppData\\Local\\Microsoft\\WindowsApps']
        return {**keep, 'PATH': ';'.join(path), 'USERNAME': 'mina', 'USERPROFILE': HOME, 'HOMEDRIVE': 'C:',
                'HOMEPATH': '\\Users\\mina', 'APPDATA': f'{HOME}\\AppData\\Roaming', 'LOCALAPPDATA': f'{HOME}\\AppData\\Local',
                'PROMPT': PROMPT_MARK, 'PYTHONDONTWRITEBYTECODE': '1', 'NO_COLOR': '1',
                # Kept outside C:\\Users\\mina, which every run rebuilds: without it each PowerShell start re-analyses
                # every module ("Preparing modules for first use") and a run takes most of a minute.
                'PSModuleAnalysisCachePath': str(self.tmp / f'ModuleAnalysisCache-{shell}')}

    def run(self, job):
        began = time.monotonic()
        self.reset(job)
        state = starting_state(job.code)
        self.build(state)
        ready = time.monotonic()
        env = self.base_env(job.python, job.shell)
        korean = job.entry.get('emulate') == 'cp949' and job.python == '3.12'
        if korean:
            env.update(PYTHONPATH=str(self.tmp / 'cp949'), PYTHONIOENCODING='cp949')
        if state.python_file:
            Path(APP, state.python_file).write_text(job.code + '\n', encoding='utf-8')
            lines, cwd = [f'python {state.python_file}'], APP
        elif state.prompts:
            ((_, cwd, command),) = [p for p in state.prompts if p[0] == job.shell]
            lines = [command]
        else:
            lines, cwd = job.code.split('\n'), state.start
        if job.check:
            echo = f'echo {CHECK_MARK}' if job.shell == 'cmd' else f"Write-Output '{CHECK_MARK}'"
            lines += [echo, *job.check.split('\n')]
        if job.shell == 'cmd':
            args, script = ['cmd.exe', '/d', '/q'], '\r\n'.join(lines + ['exit', ''])
        else:
            preamble = ["$PSStyle.OutputRendering = 'PlainText'"] if job.shell == 'pwsh' else []
            preamble += [f"$PSDefaultParameterValues['{name}:Force'] = $true" for name in job.confirm]
            if korean:
                preamble.append('[Console]::OutputEncoding = [Text.Encoding]::GetEncoding(949)')
            preamble += ['$Error.Clear()']
            args = [self.pwsh if job.shell == 'pwsh' else self.powershell, '-NoLogo', '-NoProfile', '-NonInteractive',
                    '-Command', '-']
            script = '\n'.join(preamble + lines + ['Write-Output "@@ERRORS:$($Error.Count)@@"', ''])
        done = subprocess.run(args, cwd=cwd, env=env, input=script.encode('utf-8'), stdout=subprocess.PIPE,
                              stderr=subprocess.STDOUT, timeout=180)
        result = self.clean(done.stdout.decode('cp949' if korean else 'utf-8', 'replace'), job)
        result['seconds'] = {'setup': round(ready - began, 1), 'run': round(time.monotonic() - ready, 1)}
        print(f"     {result['seconds']['setup']:5.1f}s + {result['seconds']['run']:5.1f}s  {job.label} ({job.shell})", flush=True)
        return result

    def clean(self, text, job):
        text = text.replace('\r\n', '\n')
        text = re.sub(r'\AMicrosoft Windows \[Version [^\]]*\]\n\(c\) Microsoft Corporation\. All rights reserved\.\n', '', text)
        text = text.replace(PROMPT_MARK, '')
        errors = sum(int(n) for n in ERRORS.findall(text))
        text = ERRORS.sub('', text)
        if job.check:
            text = text.split(CHECK_MARK, 1)[-1]
        text = re.sub(r'\b\d{1,2}/\d{1,2}/\d{4}\s+\d{1,2}:\d{2}\s+[AP]M\b', '<시각>', text)
        for version, python in self.pythons.items():
            if python:
                folder = str(Path(python).parent)
                text = text.replace(folder, DISPLAY_PYTHON[version]).replace(folder.replace('\\', '\\\\'),
                                                                            DISPLAY_PYTHON[version].replace('\\', '\\\\'))
        text = '\n'.join(line.rstrip() for line in text.split('\n')).strip('\n')
        return {'shell': job.shell, 'output': text, 'errors': errors}


def review_entries(exercises):
    cards = {card['id']: card for card in json.loads((ROOT / 'curriculum/problem_bank.json').read_text())['exercises']}
    entries = {}
    for record in sorted({cards[ex.id]['review_record'] for ex in exercises if ex.id in cards}):
        entries.update({entry['id']: entry for entry in json.loads((ROOT / record).read_text()).get('items', [])})
    return entries


def plan(exercises, entries=None):
    """Every Windows item's runs, built (and so parsed) without executing anything."""
    items = [ex for ex in exercises if is_windows(ex)]
    entries = review_entries(items) if entries is None else entries
    cards = {card['id']: card for card in json.loads((ROOT / 'curriculum/problem_bank.json').read_text())['exercises']}
    planned = []
    for ex in items:
        entry = entries.get(ex.id)
        if entry is None or entry.get('verify') != 'windows':
            raise ValueError(f'{ex.id}: a Windows item needs a review entry with verify: windows')
        if not ex.reference_output:
            raise ValueError(f'{ex.id}: a Windows item needs reference_output')
        policies = {entry.get('policy', 'Restricted'), *(run.get('policy', 'Restricted') for run in entry.get('runs', []))}
        if entry.get('emulate') not in (None, 'cp949') or not policies <= {'Restricted', 'RemoteSigned'}:
            raise ValueError(f'{ex.id}: unknown emulate or policy')
        try:
            traps = list(cards.get(ex.id, {}).get('distractor_targets', {})) if ex.kind == 'order' else ()
            jobs = variants(ex, entry, traps)
            for job in jobs:
                starting_state(job.code)
        except (KeyError, ValueError) as error:
            raise ValueError(f'{ex.id}: {error}') from error
        planned.append((ex, jobs))
    return planned


def validate_all(exercises, entries=None, execute=None, report=None, keep_going=False, shard=None):
    planned = plan(exercises, entries)
    if shard:  # (k, n): this runner checks every n-th item from the k-th; each runner is its own disposable PC
        planned = planned[shard[0] - 1::shard[1]]
    if execute is None:
        execute = os.name == 'nt' and os.environ.get('GITHUB_ACTIONS') == 'true'
    if not execute:
        return len(planned)
    machine, problems, observed = Machine(), [], {}
    for ex, jobs in planned:
        results = [(job, machine.run(job)) for job in jobs]
        observed[ex.id] = [{'label': job.label, **result} for job, result in results]
        if report:  # after every item, so a cancelled run still shows what it saw
            Path(report).write_text(json.dumps(observed, ensure_ascii=False, indent=1), encoding='utf-8')
        cross = [(job, result) for job, result in results if job.expect == 'cross']
        found = [f'{ex.id}: {problem}' for job, result in results if (problem := judge(ex, job, result, cross))]
        for problem in found:
            print(f'FAIL {problem}', flush=True)
        if not found:
            print(f'ok   {ex.id} ({len(jobs)} runs)', flush=True)
        problems += found
        if problems and not keep_going:
            break
    if problems:
        raise SystemExit('Windows items disagree with their review:\n' + '\n'.join(problems))
    return len(planned)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    parser.add_argument('--report', help='write every observed output to this JSON file')
    parser.add_argument('--keep-going', action='store_true', help='check every item before failing')
    parser.add_argument('--shard', help='k/n: check items k, k+n, k+2n, ... (one disposable runner each)')
    args = parser.parse_args()
    from backend.content import EXERCISES
    shard = tuple(int(n) for n in args.shard.split('/')) if args.shard else None
    count = validate_all(EXERCISES, report=args.report, keep_going=args.keep_going, shard=shard)
    print(f'Ran {count} Windows exercises in Windows PowerShell 5.1, PowerShell 7 and cmd')
