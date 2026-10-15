from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from uuid import uuid4

import pandas as pd
import pytest
from fastapi.testclient import TestClient

from backend.content import BY_ID, EXERCISES
from backend.main import create_app
from backend.storage import connect


@pytest.fixture
def learning(tmp_path):
    # 2026-10-15 23:50 in Seoul; tests cross the user's midnight, not UTC's.
    current = [datetime(2026, 10, 15, 14, 50, tzinfo=timezone.utc)]
    path = tmp_path / "learning.sqlite3"
    app = create_app(path, now=lambda: current[0], time_zone="Asia/Seoul")
    with TestClient(app) as client:
        yield client, path, current


def start(client):
    response = client.post("/api/sessions/today", json={"track_id": "pandas"})
    assert response.status_code == 200, response.text
    return response.json()


def answer(client, session, item, value=None, attempt_id=None):
    return client.post(f"/api/sessions/{session['id']}/answers", json={
        "exercise_id": item["id"], "answer": value if value is not None else BY_ID[item["id"]].answer,
        "attempt_id": attempt_id or str(uuid4()), "active_seconds": 35,
    })


def test_daily_creation_and_resume_after_server_restart(learning):
    client, path, clock = learning
    assert client.get("/api/health").json() == {"status": "ok"}
    session = start(client)
    assert session["local_day"] == "2026-10-15"
    assert len(session["items"]) == 5
    assert len({item["id"] for item in session["items"]}) == 5
    assert len({item["domain"] for item in session["items"]}) == 5
    assert all("answer" not in item and "explanation" not in item for item in session["items"])
    first = session["items"][0]
    response = answer(client, session, first).json()
    assert response["correct"] is True
    assert response["session"]["completed_count"] == 1
    assert response["session"]["items"][0]["explanation"]
    with TestClient(create_app(path, now=lambda: clock[0])) as restarted:
        restored = start(restarted)
        assert restored["id"] == session["id"]
        assert restored["completed_count"] == 1
        assert restored["items"][0]["last_answer"] == BY_ID[first["id"]].answer
        assert restored["items"][0]["active_seconds"] == 35


def test_wrong_hint_reveal_and_daily_summary(learning):
    client, path, _ = learning
    session = start(client)
    first, second, *others = session["items"]
    wrong = next(choice for choice in first["choices"] if choice != BY_ID[first["id"]].answer)
    result = answer(client, session, first, wrong).json()
    assert result["correct"] is False
    assert result["session"]["completed_count"] == 0
    assert "answer" not in result["session"]["items"][0]
    url = f"/api/sessions/{session['id']}"
    hinted = client.post(url + "/hint", json={"exercise_id": first["id"]}).json()
    assert len(hinted["items"][0]["hints"]) == 1
    client.post(url + "/hint", json={"exercise_id": first["id"]})
    capped = client.post(url + "/hint", json={"exercise_id": first["id"]}).json()
    assert capped["items"][0]["hints_used"] == 2
    answer(client, session, first)
    for _ in range(2):
        revealed = client.post(url + "/reveal", json={"exercise_id": second["id"]})
        assert revealed.status_code == 200
    assert revealed.json()["completed_count"] == 2
    assert revealed.json()["correct_count"] == 1
    assert revealed.json()["items"][1]["status"] == "revealed"
    for item in others:
        final = answer(client, session, item).json()["session"]
    assert final["finished"] is True
    assert final["correct_count"] == 4
    assert start(client)["finished"] is True
    dashboard = client.get("/api/dashboard").json()
    assert dashboard["learned_count"] == 5
    assert dashboard["weekly_days"] == ["2026-10-15"]
    with connect(path) as db:
        assert db.execute("SELECT due_day FROM progress WHERE exercise_id=?", (first["id"],)).fetchone()[0] == '2026-10-16'
        assert db.execute("SELECT due_day FROM progress WHERE exercise_id=?", (second["id"],)).fetchone()[0] == '2026-10-16'
        assert db.execute("SELECT due_day FROM progress WHERE exercise_id=?", (others[0]["id"],)).fetchone()[0] == '2026-10-18'


def test_midnight_new_session_and_due_review_cap(learning):
    client, _, clock = learning
    previous = start(client)
    for item in previous["items"]:
        client.post(f"/api/sessions/{previous['id']}/hint", json={"exercise_id": item["id"]})
        answer(client, previous, item)
    clock[0] += timedelta(minutes=11)
    today = start(client)
    assert today["local_day"] == '2026-10-16'
    assert today["id"] != previous["id"]
    assert [item["category"] for item in today["items"]].count("review") == 3
    assert [item["category"] for item in today["items"]].count("new") == 2
    assert answer(client, previous, previous["items"][0]).status_code == 409
    assert client.get(f"/api/sessions/{previous['id']}").json()["finished"] is True


def test_next_day_new_content_and_later_practice(learning):
    client, _, clock = learning
    first = start(client)
    for item in first["items"]:
        answer(client, first, item)
    clock[0] += timedelta(days=1)
    second = start(client)
    assert all(item["category"] == "new" for item in second["items"])
    assert not {i["id"] for i in first["items"]} & {i["id"] for i in second["items"]}
    for item in second["items"]:
        answer(client, second, item)
    clock[0] += timedelta(days=1)
    third = start(client)
    assert len(third["items"]) == 5
    assert all(item["category"] == "new" for item in third["items"])
    # Work through the larger curriculum, respecting scheduled reviews.
    for _ in range(20):
        current = start(client)
        for item in current["items"]:
            if item["status"] == "pending":
                answer(client, current, item)
        clock[0] += timedelta(days=1)
        if client.get("/api/dashboard").json()["learned_count"] == len(EXERCISES):
            break
    else:
        pytest.fail("The curriculum never reached all unseen exercises")
    practice = start(client)
    assert len(practice["items"]) == 5
    assert all(item["category"] != "new" for item in practice["items"])
    assert any(item["category"] == "practice" for item in practice["items"])


def test_retry_idempotency_and_invalid_submissions(learning):
    client, path, _ = learning
    session = start(client)
    item = session["items"][0]
    attempt_id = str(uuid4())
    assert answer(client, session, item, attempt_id=attempt_id).status_code == 200
    assert answer(client, session, item, attempt_id=attempt_id).json()["session"]["completed_count"] == 1
    with connect(path) as db:
        assert db.execute("SELECT count(*) FROM attempts").fetchone()[0] == 1
    assert answer(client, session, item).status_code == 409
    other = session["items"][1]
    assert answer(client, session, other, attempt_id=attempt_id).status_code == 409
    assert answer(client, session, other, "unknown").status_code == 422
    assert answer(client, session, {"id": "missing"}, "2").status_code == 404
    assert client.post("/api/sessions/today", json={"track_id": "algorithms"}).status_code == 409
    assert client.post("/api/sessions/today", json={"track_id": "invalid"}).status_code == 422
    assert client.get("/api/sessions/unknown").status_code == 404
    for field, value in [("active_seconds", -1), ("active_seconds", 999999), ("attempt_id", "invalid"), ("answer", "")]:
        body = {"exercise_id": other["id"], "answer": "2", "attempt_id": str(uuid4()), "active_seconds": 1}
        body[field] = value
        assert client.post(f"/api/sessions/{session['id']}/answers", json=body).status_code == 422


def test_concurrent_requests_create_one_session_and_attempt(learning):
    client, path, _ = learning
    with ThreadPoolExecutor(max_workers=4) as pool:
        sessions = list(pool.map(lambda _: start(client), range(4)))
    assert len({s["id"] for s in sessions}) == 1
    session = sessions[0]
    attempt_id = str(uuid4())
    with ThreadPoolExecutor(max_workers=4) as pool:
        responses = list(pool.map(lambda _: answer(client, session, session["items"][0], attempt_id=attempt_id), range(4)))
    assert all(response.status_code == 200 for response in responses)
    with connect(path) as db:
        assert db.execute("SELECT count(*) FROM sessions").fetchone()[0] == 1
        assert db.execute("SELECT count(*) FROM attempts").fetchone()[0] == 1
        assert db.execute("SELECT completed_count FROM progress").fetchone()[0] == 1


def test_blank_answer_normalization_and_no_execution(learning):
    client, _, _ = learning
    session = start(client)
    blank = next(item for item in session["items"] if item["kind"] == 'blank')
    assert answer(client, session, blank, "__import__('os').getcwd()").json()["correct"] is False
    assert answer(client, session, blank, "  wHeRe  ").json()["correct"] is True


def test_original_pandas_answers_remain_valid():
    """Independent reference computations validate the published answer keys."""
    df = pd.DataFrame({"item": ["커피", "차"], "amount": [4000, 3000]})
    assert df["amount"].tolist() == [4000, 3000]
    assert BY_ID['pandas-select-01'].answer == 'df["amount"]'
    scores = pd.DataFrame({"score": [72, 85, 93]})
    assert str(len(scores[scores["score"] >= 80])) == BY_ID['pandas-filter-01'].answer
    missing = pd.DataFrame({"amount": [4000, None, 2000]})
    assert str(missing["amount"].isna().sum()) == BY_ID['pandas-null-01'].answer
    amounts = pd.DataFrame({"amount": [3000, 9000, 5000]})
    assert str(amounts.sort_values("amount", ascending=False)["amount"].iloc[0]) == BY_ID['pandas-sort-01'].answer
    total = pd.Series([3000, 4000, 5000])
    assert BY_ID['pandas-group-01'].answer == 'sum' and total.sum() == 12000
    selected = pd.DataFrame({"item": ["커피"], "amount": [4000], "qty": [2]})
    assert str(selected[["item", "qty"]].shape[1]) == BY_ID['pandas-select-02'].answer
    boundary = pd.DataFrame({"amount": [9000, 10000, 15000]})
    assert BY_ID['pandas-filter-02'].answer == '>=' and boundary[boundary["amount"] >= 10000]["amount"].tolist() == [10000, 15000]
    assert BY_ID['pandas-null-02'].answer == 'fillna' and missing['amount'].fillna(0).tolist() == [4000, 0, 2000]
    assert BY_ID['pandas-sort-02'].answer == 'sort_values' and amounts.sort_values('amount')['amount'].tolist() == [3000, 5000, 9000]
    teams = pd.DataFrame({"team": ["A", "B", "A"], "amount": [3000, 4000, 5000]})
    assert str(teams.groupby('team')['amount'].sum()['A']) == BY_ID['pandas-group-02'].answer
    assert len(EXERCISES) == len(BY_ID) == 30
    assert {e.domain for e in EXERCISES} == {"pandas", "NumPy", "SQL", "통계", "scikit-learn"}


def test_same_server_serves_frontend_and_learning_api(tmp_path):
    frontend = tmp_path / "dist"
    frontend.mkdir()
    (frontend / "index.html").write_text('<!doctype html><html lang="ko"><title>매일코딩</title></html>')
    (frontend / "assets").mkdir()
    (frontend / "assets/app.js").write_text('console.log("ready")')
    with TestClient(create_app(tmp_path / "app.sqlite3", frontend_dir=frontend)) as client:
        assert client.get("/").status_code == 200
        assert '매일코딩' in client.get("/").text
        assert client.get("/assets/app.js").status_code == 200
        assert client.get("/api/health").json() == {"status": "ok"}
        assert client.get("/api/tracks").json()[0]["exercise_count"] == 30
        assert client.get("/assets/../../pyproject.toml").status_code == 404


def test_extra_batches_prioritize_unseen_resume_and_allow_repeated_practice(learning):
    client, path, clock = learning
    endpoint = '/api/sessions/extra'
    body = {'track_id': 'pandas'}
    assert client.post(endpoint, json=body).status_code == 409
    daily = start(client)
    for item in daily['items']:
        answer(client, daily, item)
    seen = {item['id'] for item in daily['items']}
    for batch in range(1, 6):
        extra = client.post(endpoint, json=body).json()
        assert extra['batch'] == batch
        assert not seen & {item['id'] for item in extra['items']}
        assert all(item['category'] == 'new' for item in extra['items'])
        assert client.post(endpoint, json=body).json()['id'] == extra['id']
        for item in extra['items']:
            answer(client, extra, item)
        seen.update(item['id'] for item in extra['items'])
    assert len(seen) == 30
    repeated = client.post(endpoint, json=body).json()
    assert repeated['batch'] == 6
    assert all(item['category'] == 'practice' for item in repeated['items'])
    assert not {i['id'] for i in repeated['items']} & {i['id'] for i in extra['items']}
    answer(client, repeated, repeated['items'][0])
    with TestClient(create_app(path, now=lambda: clock[0])) as restarted:
        resumed = restarted.post(endpoint, json=body).json()
        assert resumed['id'] == repeated['id']
        assert resumed['completed_count'] == 1
    dashboard = client.get('/api/dashboard').json()
    assert dashboard['today']['id'] == daily['id']
    assert dashboard['today']['completed_count'] == 5
    assert dashboard['extra']['id'] == repeated['id']
    assert dashboard['today_completed_count'] == 31
    assert dashboard['learned_count'] == 30
    clock[0] += timedelta(days=1)
    next_daily = start(client)
    assert next_daily['batch'] == 0
    assert next_daily['id'] != daily['id']
    assert client.get('/api/dashboard').json()['extra'] is None
    assert client.post(endpoint, json=body).status_code == 409


def test_concurrent_extra_creation_resumes_one_batch(learning):
    client, _, _ = learning
    daily = start(client)
    for item in daily['items']:
        answer(client, daily, item)
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(lambda _: client.post('/api/sessions/extra', json={'track_id':'pandas'}).json(), range(4)))
    assert len({result['id'] for result in results}) == 1
    assert all(result['batch'] == 1 for result in results)


def test_schema_v1_upgrade_preserves_completed_session_and_attempts(tmp_path):
    import sqlite3
    path = tmp_path / 'legacy.sqlite3'
    with sqlite3.connect(path) as db:
        db.executescript('''
            CREATE TABLE sessions(id TEXT PRIMARY KEY, track_id TEXT NOT NULL, local_day TEXT NOT NULL,
                timezone TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE(track_id, local_day));
            CREATE TABLE session_items(session_id TEXT NOT NULL REFERENCES sessions(id), position INTEGER NOT NULL,
                exercise_id TEXT NOT NULL, version INTEGER NOT NULL, category TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending', hints_used INTEGER NOT NULL DEFAULT 0,
                attempts_count INTEGER NOT NULL DEFAULT 0, last_answer TEXT, last_correct INTEGER,
                active_seconds INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(session_id, exercise_id), UNIQUE(session_id, position));
            CREATE TABLE attempts(id TEXT PRIMARY KEY, session_id TEXT NOT NULL REFERENCES sessions(id),
                exercise_id TEXT NOT NULL, answer TEXT NOT NULL, correct INTEGER NOT NULL,
                hints_used INTEGER NOT NULL, active_seconds INTEGER NOT NULL, created_at TEXT NOT NULL);
            CREATE TABLE progress(exercise_id TEXT PRIMARY KEY, completed_count INTEGER NOT NULL DEFAULT 0,
                last_day TEXT NOT NULL, due_day TEXT NOT NULL, last_outcome TEXT NOT NULL);
            PRAGMA user_version=1;
            INSERT INTO sessions VALUES('legacy', 'pandas', '2026-10-15', 'Asia/Seoul', '2026-10-15T00:00:00Z');
        ''')
        for i, ex in enumerate(EXERCISES[:5]):
            db.execute("INSERT INTO session_items(session_id, position, exercise_id, version, category, status, attempts_count) VALUES('legacy', ?, ?, 1, 'new', 'correct', 1)", (i, ex.id))
            db.execute("INSERT INTO progress VALUES(?, 1, '2026-10-15', '2026-10-18', 'correct')", (ex.id,))
        db.execute("INSERT INTO attempts VALUES(?, 'legacy', ?, ?, 1, 0, 30, '2026-10-15T00:00:00Z')", (str(uuid4()), EXERCISES[0].id, EXERCISES[0].answer))
    now = lambda: datetime(2026,10,15,12,tzinfo=timezone.utc)
    with TestClient(create_app(path, now=now)) as client:
        daily = start(client)
        assert daily['id'] == 'legacy' and daily['finished'] and daily['batch'] == 0
        extra = client.post('/api/sessions/extra', json={'track_id':'pandas'}).json()
        assert extra['batch'] == 1
        assert len(extra['items']) == 5
    with connect(path) as db:
        assert db.execute('PRAGMA user_version').fetchone()[0] == 2
        assert db.execute('PRAGMA foreign_keys').fetchone()[0] == 1
        assert not db.execute('PRAGMA foreign_key_check').fetchall()
        assert db.execute('SELECT count(*) FROM attempts').fetchone()[0] == 1
        assert db.execute('SELECT count(*) FROM progress').fetchone()[0] == 5
