"""The post-baseline quality gate blocks monotone or unreviewed items while leaving the frozen catalog untouched."""
import json
from pathlib import Path

import pytest

from backend.quality_gate import TASK_FORMS, load_baseline, validate_quality

BANK = json.loads(Path('curriculum/problem_bank.json').read_text())['exercises']


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
    assert all(baseline[c['id']] == c['version'] for c in BANK if c['source'] == 'app')
    assert validate_quality(BANK) == []


def test_new_well_formed_card_passes():
    assert len(validate_quality(BANK + [card()])) == 1


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
    assert len(validate_quality(BANK + balanced)) == 4


def test_task_forms_cover_the_planned_formats():
    assert {'output', 'condition-change', 'bug-line', 'equivalent-code', 'purpose-choice'} <= set(TASK_FORMS)
