import contextlib
from dataclasses import asdict
import io

import pytest

import json
from pathlib import Path
from backend.content import EXERCISES


BANK = json.loads(Path("curriculum/problem_bank.json").read_text())


def test_all_app_questions_have_complete_design_cards_and_acyclic_prerequisites():
    cards = {item["id"]: item for item in BANK["exercises"]}
    concepts = {concept["id"]: concept for concept in BANK["concepts"]}
    assert len(cards) == len(BANK["exercises"])
    for exercise in EXERCISES:
        card = cards[exercise.id]
        for key, value in asdict(exercise).items():
            if key not in ("concept", "difficulty"):
                assert card[key] == (list(value) if isinstance(value, tuple) else value)
        assert card["source"] == "app"
        assert card["app_difficulty"] == exercise.difficulty
    for card in cards.values():
        for key in ("objective", "new_concept", "family", "misconception", "diagnostic_question", "advancement"):
            assert card[key], (card["id"], key)
        assert card["prerequisite_concepts"] == concepts[card["concept"]]["prerequisites"]
        assert len(card["hints"]) == 2
        assert card["answer"] in card["choices"] if card["kind"] == "choice" else True
        assert len(set(card["choices"])) == len(card["choices"])
        assert all(key in cards for key in card["remediation"])
        assert card["advancement"]["exercise_id"] in cards
    active, done = set(), set()
    def visit(key):
        assert key not in active
        if key in done:
            return
        active.add(key)
        for previous in concepts[key]["prerequisites"]:
            visit(previous)
        active.remove(key)
        done.add(key)
    for concept in concepts:
        visit(concept)
        basic = [card for card in cards.values() if card["concept"] == concept and card["difficulty"] == 1]
        assert BANK["coverage"][concept]["basic_families"] == len({card["family"] for card in basic})
        if concept.startswith("scaler-"):
            assert len({card["family"] for card in basic}) >= 3, concept
        assert any(card["concept"] == concept and card["difficulty"] >= 2 for card in cards.values())


LEGACY_IDS = {f"pandas-{concept}-{index:02}" for concept in ("select", "filter", "null", "sort", "group") for index in (1, 2)}
NEW_CARDS = [item for item in BANK["exercises"] if item["source"] == "draft" or "-scaffold-" in item["id"]]


@pytest.mark.parametrize("card", NEW_CARDS, ids=lambda card: card["id"])
def test_new_authored_reference_code_matches_answer(card):
    """Only repository-authored reference code is executed; learner input is never run."""
    namespace = {}
    stream = io.StringIO()
    code = card["code"].replace("____", card["answer"])
    with contextlib.redirect_stdout(stream):
        exec(compile(code, card["id"], "exec"), namespace)
    if card["id"] == "scaler-fit-01":
        assert namespace["scaler"].mean_.tolist() == [15.0]
        assert namespace["scaler"].scale_.tolist() == [5.0]
    else:
        assert stream.getvalue().strip() == card["answer"]
