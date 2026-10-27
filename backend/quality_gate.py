"""Publishing gate for exercises added or re-versioned after the 2026-10-26 quality baseline.

Existing (id, version) pairs listed in curriculum/quality_baseline.json keep publishing as they are.
Every new identifier or bumped version must satisfy the stricter editorial rules below, so the
daily maintenance batch cannot drift back to "predict the output of four lines" items.
"""
import json
import re
from collections import defaultdict
from pathlib import Path

from backend.content import valid_choice_answer

ROOT = Path(__file__).resolve().parent.parent
BASELINE_PATH = ROOT / 'curriculum/quality_baseline.json'

TASK_FORMS = {
    'output': '출력값·결과 예측',
    'condition-change': '입력·조건이 바뀌면 결과가 어떻게 달라지는지 판단',
    'bug-line': '잘못된 줄·원인 찾기',
    'equivalent-code': '같은 결과를 내는 코드 고르기',
    'purpose-choice': '분석 목적에 맞는 코드·절차 고르기',
    'result-interpretation': '결과 수치·표의 해석 판단',
    'fill-blank': '목표 출력을 만드는 빈칸 채우기',
    'step-order': '목표를 이루도록 코드·절차의 순서 구성',
}
TRANSFER_FORMS = set(TASK_FORMS) - {'output'}
MIN_DISTRACTOR_STRENGTH = 2
MAX_OUTPUT_SHARE = 0.5
MIN_LEVEL3_CODE_LINES = 5

# Review metadata that learners never see and grading never reads. It may be completed or corrected
# under the same (id, version); any change outside these fields needs version + 1.
EDITORIAL_FIELDS = {
    'exercise': {'difficulty'},
    'path': {'task_form'},
    'card': {'task_form', 'distractor_targets', 'choice_diagnostics', 'app_difficulty', 'misconception',
             'diagnostic_question', 'review_record', 'editorial_review'},
}


def published_view(kind, value):
    """The part of an exercise, path item or design card that one (id, version) must keep forever."""
    return {key: item for key, item in value.items() if key not in EDITORIAL_FIELDS[kind]}


def load_baseline():
    return json.loads(BASELINE_PATH.read_text(encoding='utf-8'))['items']


def is_new(card, baseline):
    return baseline.get(card['id']) != card.get('version')


def card_errors(card):
    """Rules every post-baseline card must satisfy on its own."""
    errors = []
    form = card.get('task_form')
    if form not in TASK_FORMS:
        errors.append(f"{card['id']}: task_form은 {sorted(TASK_FORMS)} 중 하나여야 한다")
    level = card.get('level') or card.get('app_difficulty', {}).get('level')
    if level == 3 and form == 'output':
        errors.append(f"{card['id']}: 단계 3(전이) 문항은 출력 예측 형식으로 낼 수 없다")
    kind = card.get('kind')
    if kind in ('choice', 'line', 'order', 'multi'):
        errors += distractor_errors(card)
    lines = card.get('code', '').count('\n') + 1 + (len(card.get('choices', [])) if kind == 'order' else 0)
    if level == 3 and lines < MIN_LEVEL3_CODE_LINES:
        errors.append(f"{card['id']}: 단계 3 문항 코드는 {MIN_LEVEL3_CODE_LINES}줄 이상이어야 한다")
    return errors


def distractor_errors(card):
    """A reviewed choice-mode card names a misconception for each trap and rates them 2 or higher."""
    errors = []
    strength = card.get('app_difficulty', {}).get('distractor_strength')
    if not isinstance(strength, int) or strength < MIN_DISTRACTOR_STRENGTH:
        errors.append(f"{card['id']}: 객관식 오답 보기 강도(distractor_strength)는 {MIN_DISTRACTOR_STRENGTH} 이상으로 검수해야 한다")
    targets = card.get('distractor_targets')
    if not isinstance(targets, dict) or set(targets) != trap_keys(card, targets) or not all(isinstance(v, str) and v.strip() for v in targets.values()):
        errors.append(f"{card['id']}: {TRAP_RULES[card.get('kind')]}")
    return errors


TRAP_RULES = {
    'choice': '오답 보기마다 겨냥한 오개념을 distractor_targets에 적어야 한다',
    'line': '그럴듯한 오답 줄 2개 이상에 겨냥한 오개념을 distractor_targets에 적어야 한다',
    'order': '그럴듯한 잘못된 순서 2개 이상을 distractor_targets에 적어야 한다',
    'multi': '보기마다 고르거나 빠뜨리게 만드는 오개념을 distractor_targets에 적어야 한다',
}


def trap_keys(card, targets):
    """The keys distractor_targets must cover; any mismatch fails the gate."""
    choices, kind = card.get('choices', []), card.get('kind')
    if kind == 'choice':
        return {c for c in choices if c != card.get('answer')}
    if kind == 'multi':
        return set(choices)
    keys = set(targets) if isinstance(targets, dict) else set()
    unmatched = {None}  # never equal to a real key set, so the gate reports the card
    if len(keys) < 2:
        return unmatched
    if kind == 'line':
        return keys if keys <= set(choices) - {card.get('answer')} else unmatched
    correct = {card.get('answer'), *card.get('accepted', [])}
    plausible = all(valid_choice_answer('order', key, choices) and key not in correct for key in keys)
    return keys if plausible else unmatched


def structure_errors(card):
    """Line/order/multi answers must be gradable as authored, on every published card."""
    kind, choices, answer = card.get('kind'), card.get('choices', []), card.get('answer', '')
    if kind not in ('line', 'order', 'multi'):
        return []
    errors = []
    if card.get('response_mode') != 'choice' or len(set(choices)) != len(choices) or len(choices) < 3:
        errors.append(f"{card['id']}: {kind} 문항은 choice 모드와 서로 다른 보기 3개 이상이 필요하다")
    if not all(valid_choice_answer(kind, value, choices) for value in (answer, *card.get('accepted', []))):
        errors.append(f"{card['id']}: 정답·허용 답이 {kind} 형식(1부터 시작하는 번호)과 맞지 않는다")
    if kind == 'line':
        lines = card.get('code', '').split('\n')
        comment = re.compile(r'\s*(#|--|$)')
        if not all(c.isdigit() and 1 <= int(c) <= len(lines) and not comment.match(lines[int(c) - 1]) for c in choices):
            errors.append(f"{card['id']}: 고를 수 있는 줄은 실제 코드 줄 번호여야 한다")
    if kind == 'multi' and '____' not in card.get('code', ''):
        errors.append(f"{card['id']}: 모두 고르기 문항은 보기를 넣어 검증할 ____ 자리가 필요하다")
    return errors


def batch_errors(cards):
    """Rules on the set of post-baseline cards that share one review record."""
    errors = []
    groups = defaultdict(list)
    for card in cards:
        groups[card.get('review_record') or '(review_record 없음)'].append(card)
    for record, group in groups.items():
        if len(group) < 2:
            continue
        outputs = sum(1 for c in group if c.get('task_form') == 'output')
        if outputs / len(group) > MAX_OUTPUT_SHARE:
            errors.append(f"{record}: 출력 예측 형식이 {outputs}/{len(group)}로 {int(MAX_OUTPUT_SHARE*100)}%를 넘는다")
    return errors


def validate_quality(cards, baseline=None):
    baseline = load_baseline() if baseline is None else baseline
    app = [c for c in cards if c.get('source') == 'app']
    fresh = [c for c in app if is_new(c, baseline)]
    errors = [e for c in app for e in structure_errors(c)]
    errors += [e for c in fresh for e in card_errors(c)] + batch_errors(fresh)
    # Same-version distractor reviews of baseline items are checked as soon as they are recorded.
    errors += [e for c in app if not is_new(c, baseline) and 'distractor_targets' in c
               and c.get('kind') in TRAP_RULES for e in distractor_errors(c)]
    if errors:
        raise ValueError('품질 게이트 실패:\n' + '\n'.join(errors))
    return fresh
