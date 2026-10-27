"""Publishing gate for exercises added or re-versioned after the 2026-10-26 quality baseline.

Existing (id, version) pairs listed in curriculum/quality_baseline.json keep publishing as they are.
Every new identifier or bumped version must satisfy the stricter editorial rules below, so the
daily maintenance batch cannot drift back to "predict the output of four lines" items.
"""
import json
from collections import defaultdict
from pathlib import Path

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
}
TRANSFER_FORMS = set(TASK_FORMS) - {'output'}
MIN_DISTRACTOR_STRENGTH = 2
MAX_OUTPUT_SHARE = 0.5
MIN_LEVEL3_CODE_LINES = 5


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
    if card.get('kind') == 'choice':
        strength = card.get('app_difficulty', {}).get('distractor_strength')
        if not isinstance(strength, int) or strength < MIN_DISTRACTOR_STRENGTH:
            errors.append(f"{card['id']}: 객관식 오답 보기 강도(distractor_strength)는 {MIN_DISTRACTOR_STRENGTH} 이상으로 검수해야 한다")
        targets = card.get('distractor_targets')
        wrong = [c for c in card.get('choices', []) if c != card.get('answer')]
        if not isinstance(targets, dict) or set(targets) != set(wrong) or not all(isinstance(v, str) and v.strip() for v in targets.values()):
            errors.append(f"{card['id']}: 오답 보기마다 겨냥한 오개념을 distractor_targets에 적어야 한다")
    if level == 3 and card.get('code', '').count('\n') + 1 < MIN_LEVEL3_CODE_LINES:
        errors.append(f"{card['id']}: 단계 3 문항 코드는 {MIN_LEVEL3_CODE_LINES}줄 이상이어야 한다")
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
    fresh = [c for c in cards if c.get('source') == 'app' and is_new(c, baseline)]
    errors = [e for c in fresh for e in card_errors(c)] + batch_errors(fresh)
    if errors:
        raise ValueError('품질 게이트 실패:\n' + '\n'.join(errors))
    return fresh
