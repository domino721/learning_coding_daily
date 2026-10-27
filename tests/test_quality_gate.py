"""The post-baseline quality gate blocks monotone or unreviewed items while leaving the frozen catalog untouched."""
import json
from pathlib import Path

import pytest

from backend.quality_gate import TASK_FORMS, load_baseline, validate_quality

BANK = json.loads(Path('curriculum/problem_bank.json').read_text())['exercises']
FRESH = {c['id'] for c in BANK if c['source'] == 'app' and load_baseline().get(c['id']) != c['version']}


def card(**overrides):
    base = {
        'id': 'pandas-demo-new', 'version': 1, 'source': 'app', 'kind': 'choice', 'level': 2,
        'task_form': 'condition-change', 'code': 'a\nb\nc\nd\ne', 'answer': 'A', 'choices': ['A', 'B', 'C', 'D'],
        'distractor_targets': {'B': '합계와 평균 혼동', 'C': '정렬 방향 혼동', 'D': '결측 포함 여부 혼동'},
        'app_difficulty': {'level': 2, 'distractor_strength': 2}, 'review_record': 'curriculum/reviews/demo.json',
    }
    base.update(overrides)
    return base


def test_frozen_catalog_is_exempt_and_currently_passes():
    baseline = load_baseline()
    assert all(c['id'] in FRESH or baseline[c['id']] == c['version'] for c in BANK if c['source'] == 'app')
    # Only cards added after the baseline (CR-015 line/order/multi items) are gated, and they pass.
    assert {c['id'] for c in validate_quality(BANK)} == FRESH


def test_new_well_formed_card_passes():
    assert len(validate_quality(BANK + [card()])) == len(FRESH) + 1


def test_version_bump_of_existing_item_is_gated():
    existing = next(c for c in BANK if c['source'] == 'app' and c['kind'] == 'choice')
    bumped = dict(existing, version=existing['version'] + 1)
    with pytest.raises(ValueError, match='task_form'):
        validate_quality(BANK + [bumped])


@pytest.mark.parametrize('overrides,message', [
    ({'task_form': 'guess'}, 'task_form'),
    ({'level': 3, 'task_form': 'output', 'app_difficulty': {'level': 3, 'distractor_strength': 2}}, '단계 3'),
    ({'app_difficulty': {'level': 2, 'distractor_strength': 0}}, 'distractor_strength'),
    ({'distractor_targets': {'B': '하나만'}}, 'distractor_targets'),
    ({'level': 3, 'code': 'x = 1\nprint(x)', 'app_difficulty': {'level': 3, 'distractor_strength': 2}}, '5줄'),
])
def test_single_card_rules(overrides, message):
    with pytest.raises(ValueError, match=message):
        validate_quality(BANK + [card(**overrides)])


def test_batch_output_share_is_capped():
    batch = [card(id=f'demo-{i}', task_form='output') for i in range(3)] + [card(id='demo-3')]
    with pytest.raises(ValueError, match='50%'):
        validate_quality(BANK + batch)
    balanced = [card(id=f'demo-{i}', task_form='output') for i in range(2)] + [card(id=f'demo-{i}') for i in range(2, 4)]
    assert len(validate_quality(BANK + balanced)) == len(FRESH) + 4


def layout(kind, **overrides):
    shapes = {
        'line': dict(code='x = [1, 2]\n# 설명\ny = sum(x)\nprint(y)', choices=['1', '3', '4'], answer='3',
                     distractor_targets={'1': '입력 의심', '4': '출력 의심'}),
        'order': dict(code='import math', choices=['a = 1', 'b = a + 1', 'print(b)'], answer='1,2,3',
                      distractor_targets={'2,1,3': '정의 전 사용', '1,3,2': '출력 뒤 계산'}),
        'multi': dict(code='print(____)', choices=['1 == 1', '1 == 2', '2 == 2'], answer='1,3',
                      distractor_targets={'1 == 1': '빠뜨림', '1 == 2': '거짓 포함', '2 == 2': '빠뜨림'}),
    }
    return card(kind=kind, response_mode='choice', task_form='bug-line', **{**shapes[kind], **overrides})


@pytest.mark.parametrize('kind', ['line', 'order', 'multi'])
def test_well_formed_layout_cards_pass(kind):
    assert len(validate_quality(BANK + [layout(kind)])) == len(FRESH) + 1


@pytest.mark.parametrize('kind,overrides,message', [
    ('line', {'distractor_targets': {'1': '하나만'}}, '오답 줄 2개'),
    ('line', {'distractor_targets': {'1': '입력', '3': '정답을 함정으로'}}, '오답 줄 2개'),
    ('line', {'choices': ['1', '2', '3'], 'distractor_targets': {'1': '입력', '2': '주석'}}, '실제 코드 줄'),
    ('order', {'distractor_targets': {'1,2,3': '정답과 같음', '2,1,3': '정의 전 사용'}}, '잘못된 순서'),
    ('order', {'distractor_targets': {'2,1,3': '정의 전 사용', '4,1,2': '없는 조각'}}, '잘못된 순서'),
    ('order', {'answer': '1,1,3'}, '형식'),
    ('multi', {'distractor_targets': {'1 == 1': '빠뜨림', '1 == 2': '거짓 포함'}}, '보기마다'),
    ('multi', {'answer': '3,1'}, '형식'),
    ('multi', {'code': 'print(True)'}, '____'),
])
def test_layout_card_rules(kind, overrides, message):
    with pytest.raises(ValueError, match=message):
        validate_quality(BANK + [layout(kind, **overrides)])


def test_task_forms_cover_the_planned_formats():
    assert {'output', 'condition-change', 'bug-line', 'equivalent-code', 'purpose-choice', 'step-order'} <= set(TASK_FORMS)
