"""Explainable curriculum prototype; not connected to the app's daily sessions yet."""
from dataclasses import asdict, dataclass
from datetime import date, timedelta
import json
from pathlib import Path

ALGORITHM_VERSION = "rules-0.1"
RULES = {"independent_items": 3, "independent_families": 3, "recovery_items": 2,
         "stale_days": 14, "daily_limit": 5, "review_limit": 3, "diagnostic_limit": 3,
         "new_concept_limit": 2,
         "review_intervals": (1, 3, 7, 14)}
BANK_PATH = Path(__file__).with_name("problem-bank-v0.1.json")


def load_bank(path: Path = BANK_PATH) -> dict:
    return json.loads(path.read_text())


@dataclass(frozen=True)
class Observation:
    """One session item's final aggregate, including failures before a correct answer."""
    session_id: str
    exercise_id: str
    version: int
    day: str
    correct: bool
    hints_used: int = 0
    attempts: int = 1
    revealed: bool = False
    active_seconds: int = 0

    @property
    def independent(self) -> bool:
        return self.correct and self.hints_used == 0 and self.attempts == 1 and not self.revealed


def _current_history(bank: dict, observations: list[Observation], today: date):
    items = {item["id"]: item for item in bank["exercises"]}
    seen = {}
    current, ignored = [], []
    for observation in observations:
        if type(observation.correct) is not bool or type(observation.revealed) is not bool:
            raise ValueError("Outcome flags must be booleans")
        if not observation.session_id:
            raise ValueError("A session identifier is required")
        if any(type(value) is not int for value in (observation.version, observation.attempts,
                                                    observation.hints_used, observation.active_seconds)):
            raise ValueError("Version and observation counts must be integers")
        if observation.version < 1:
            raise ValueError("An exercise version must be positive")
        observed_day = date.fromisoformat(observation.day)
        if observed_day > today:
            raise ValueError("Future observations cannot determine the current level")
        if observation.attempts < 0 or observation.hints_used < 0 or observation.active_seconds < 0:
            raise ValueError("Observation counts cannot be negative")
        if observation.correct and observation.attempts < 1:
            raise ValueError("A correct submission requires at least one attempt")
        key = (observation.session_id, observation.exercise_id, observation.version)
        if key in seen:
            if seen[key] != observation:
                raise ValueError("Conflicting aggregate for the same session item")
            continue
        seen[key] = observation
        item = items.get(observation.exercise_id)
        if item is None or item["version"] != observation.version:
            ignored.append({"exercise_id": observation.exercise_id, "reason": "unknown_or_old_version"})
            continue
        current.append(observation)
    # Input order is the completion order within one local learning day.
    return sorted(current, key=lambda event: event.day), ignored


def _profiles(bank: dict, history: list[Observation], today: date) -> dict:
    items = {item["id"]: item for item in bank["exercises"]}
    profiles = {}
    for concept in bank["concepts"]:
        events = [event for event in history if items[event.exercise_id]["concept"] == concept["id"]]
        independent = [event for event in events if event.independent]
        distinct = {event.exercise_id for event in independent}
        families = {items[event.exercise_id]["family"] for event in independent}
        ready = len(distinct) >= RULES["independent_items"] and len(families) >= RULES["independent_families"]
        first_clean_day = {}
        delayed = False
        for event in independent:
            previous = first_clean_day.setdefault(event.exercise_id, event.day)
            if event.day > previous:
                delayed = True
        transfer = any(items[event.exercise_id]["difficulty"] >= 2 for event in independent)
        last_support = max((i for i, event in enumerate(events) if not event.independent), default=-1)
        recovered_ids = {event.exercise_id for event in events[last_support + 1:] if event.independent}
        needs_support = last_support >= 0 and len(recovered_ids) < RULES["recovery_items"]
        stale = bool(events) and (today - date.fromisoformat(events[-1].day)).days >= RULES["stale_days"]
        if not events:
            state, level, reason = "unassessed", 0, "아직 이 개념의 풀이 근거가 없어 기초부터 확인해요."
        elif not ready:
            state, level, reason = "learning", 1, "서로 다른 유형의 독립 풀이를 더 확인해요."
        elif delayed and transfer and not needs_support and not stale:
            state, level, reason = "stable", 3, "다양한 독립 풀이·변형·다음날 이후 복습을 관찰했어요."
        else:
            state, level, reason = "reviewing", 2, "기초 독립 풀이가 쌓였고 변형이나 지연 복습을 확인해요."
        if needs_support:
            reason += " 최근 도움이나 오답이 있어 작은 확인 문제를 먼저 풀어요."
        if stale:
            reason += f" 마지막 풀이 후 {RULES['stale_days']}일 이상 지나 다시 확인해요."
        profiles[concept["id"]] = {
            "state": state, "level": level,
            "evidence_count": len(events), "independent_exercises": len(distinct),
            "independent_families": len(families), "delayed_review": delayed,
            "transfer_observed": transfer, "needs_support": needs_support,
            "stale": stale, "max_difficulty": 1 if level < 2 or needs_support else (3 if level == 3 else 2),
            "reason": reason,
        }
    return profiles


def _due_day(events: list[Observation]) -> date:
    latest = events[-1]
    interval = RULES["review_intervals"][0]
    if latest.independent:
        consecutive_days = set()
        for event in reversed(events):
            if not event.independent:
                break
            consecutive_days.add(event.day)
        intervals = RULES["review_intervals"][1:]
        interval = intervals[min(len(consecutive_days), len(intervals)) - 1]
    return date.fromisoformat(latest.day) + timedelta(days=interval)


def plan_learning(bank: dict, observations: list[Observation], today: date, limit: int = 5,
                  track_id: str = "pandas") -> dict:
    """Replay evidence and return a deterministic plan, with a reason for every item."""
    if not 1 <= limit <= RULES["daily_limit"]:
        raise ValueError("A short learning plan contains between one and five items")
    if track_id not in {concept["track"] for concept in bank["concepts"]}:
        raise ValueError("Unknown curriculum track")
    history, ignored = _current_history(bank, observations, today)
    profiles = _profiles(bank, history, today)
    concepts = {concept["id"]: concept for concept in bank["concepts"]}
    by_item = {}
    for event in history:
        by_item.setdefault(event.exercise_id, []).append(event)
    eligible = []
    for item in bank["exercises"]:
        if item["track_id"] != track_id:
            continue
        profile = profiles[item["concept"]]
        prerequisites = concepts[item["concept"]]["prerequisites"]
        if all(profiles[key]["level"] >= 2 for key in prerequisites) and item["difficulty"] <= profile["max_difficulty"]:
            eligible.append(item)
    cold_start = not any(item["track_id"] == track_id and item["id"] in by_item for item in bank["exercises"])
    if cold_start:
        limit = min(limit, RULES["diagnostic_limit"])
    selected = []

    def add(item, category, reason):
        selected.append({"exercise_id": item["id"], "version": item["version"],
                         "category": category, "reason": reason,
                         "concept_level": profiles[item["concept"]]["level"]})

    due = sorted((item for item in eligible if item["id"] in by_item and _due_day(by_item[item["id"]]) <= today),
                 key=lambda item: (_due_day(by_item[item["id"]]), bank["exercises"].index(item)))
    for item in due[:min(RULES["review_limit"], limit)]:
        add(item, "review", f"복습 예정일 {_due_day(by_item[item['id']]).isoformat()}이 되었어요.")
    def priority(item):
        profile = profiles[item["concept"]]
        focus = (0 if profile["needs_support"] else
                 1 if profile["level"] == 2 and not profile["transfer_observed"] else
                 2 if profile["level"] == 1 else 3)
        return focus, item["difficulty"], bank["exercises"].index(item)

    unseen = sorted((item for item in eligible if item["id"] not in by_item), key=priority)
    new_concepts = set()
    for item in unseen:
        if len(selected) == limit:
            break
        concept_id = item["concept"]
        if profiles[concept_id]["level"] == 0:
            if concept_id not in new_concepts and len(new_concepts) >= RULES["new_concept_limit"]:
                continue
            new_concepts.add(concept_id)
        support = profiles[item["concept"]]["needs_support"]
        add(item, "support" if support else ("diagnostic" if cold_start else "new"),
            "도움이 필요했던 개념을 다른 기초 문제로 확인해요." if support else
            "기초 독립 풀이 뒤 변형 적용을 확인해요." if profiles[concept_id]["level"] == 2 else
            "선수 개념과 현재 단계에 맞는 새 문제예요.")
    chosen = {item["exercise_id"] for item in selected}
    overdue = {item["id"] for item in due}
    practice = [item for item in eligible if item["id"] not in chosen and item["id"] not in overdue and item["id"] in by_item]
    practice.sort(key=lambda item: (not profiles[item["concept"]]["needs_support"], item["difficulty"], by_item[item["id"]][-1].day))
    for item in practice[:limit - len(selected)]:
        add(item, "support" if profiles[item["concept"]]["needs_support"] else "practice",
            "현재 단계의 확인 연습이에요. 독립 풀이의 유형 수는 같은 문제 반복으로 늘지 않아요.")
    return {"algorithm_version": ALGORITHM_VERSION, "rules": dict(RULES), "bank_version": bank["version"],
            "day": today.isoformat(), "track_id": track_id, "profiles": profiles, "items": selected,
            "ignored_observations": ignored,
            "note": "" if len(selected) == limit else "현재 선수 조건에 맞는 문제 수만 제시해요."}


def observation_dict(event: Observation) -> dict:
    return asdict(event)
