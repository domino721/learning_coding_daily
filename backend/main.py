from datetime import datetime, timedelta, timezone
import os
from pathlib import Path
from typing import Callable, Literal
from uuid import UUID, uuid4
from zoneinfo import ZoneInfo

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, Field

from backend.content import BY_ID, EXERCISES, TRACKS
from backend.storage import connect


class RequestModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class StartSession(RequestModel):
    track_id: Literal["pandas", "algorithms", "statistics"] = "pandas"


class ExerciseAction(RequestModel):
    exercise_id: str = Field(min_length=1, max_length=80)


class Answer(ExerciseAction):
    answer: str = Field(min_length=1, max_length=200)
    attempt_id: UUID
    active_seconds: int = Field(default=0, ge=0, le=86400, strict=True)


def create_app(db_path: Path | None = None, now: Callable[[], datetime] | None = None,
               time_zone: str | None = None, frontend_dir: Path | None = None) -> FastAPI:
    app = FastAPI(title="Learning Coding Daily API", version="0.2.0")
    path = db_path or Path(os.environ.get("APP_DB_PATH", Path(__file__).resolve().parent.parent / ".data/learning.sqlite3"))
    zone = ZoneInfo(time_zone or os.environ.get("APP_TIMEZONE", "Asia/Seoul"))
    clock = now or (lambda: datetime.now(timezone.utc))

    def today():
        return clock().astimezone(zone).date()

    def session_record(db, session_id, mutable=False):
        record = db.execute("SELECT * FROM sessions WHERE id=?", (session_id,)).fetchone()
        if not record:
            raise HTTPException(404, "학습 세션을 찾을 수 없습니다.")
        if mutable and record["local_day"] != today().isoformat():
            raise HTTPException(409, "날짜가 바뀌었어요. 오늘 학습을 다시 열어 주세요.")
        return record

    def snapshot(db, session_id):
        record = session_record(db, session_id)
        items = []
        for row in db.execute("SELECT * FROM session_items WHERE session_id=? ORDER BY position", (session_id,)):
            exercise = BY_ID[row["exercise_id"]]
            item = {"id": exercise.id, "version": row["version"], "concept": exercise.concept,
                    "domain": exercise.domain, "level": exercise.level,
                    "kind": exercise.kind, "title": exercise.title, "prompt": exercise.prompt,
                    "code": exercise.code, "choices": exercise.choices, "estimated_seconds": exercise.seconds,
                    "category": row["category"], "status": row["status"],
                    "hints": exercise.hints[:row["hints_used"]], "hints_used": row["hints_used"],
                    "attempts_count": row["attempts_count"], "last_answer": row["last_answer"],
                    "last_correct": None if row["last_correct"] is None else bool(row["last_correct"]),
                    "active_seconds": row["active_seconds"]}
            if row["status"] != "pending":
                item.update(answer=exercise.answer, explanation=exercise.explanation)
            items.append(item)
        completed = sum(item["status"] != "pending" for item in items)
        correct = sum(item["status"] == "correct" for item in items)
        return {"id": record["id"], "track_id": record["track_id"], "local_day": record["local_day"],
                "timezone": record["timezone"], "batch": record["batch"], "items": items, "completed_count": completed,
                "correct_count": correct, "total": len(items), "finished": completed == len(items)}

    def pending_item(db, session_id, exercise_id):
        session_record(db, session_id, mutable=True)
        item = db.execute("SELECT * FROM session_items WHERE session_id=? AND exercise_id=?", (session_id, exercise_id)).fetchone()
        if not item:
            raise HTTPException(404, "오늘 학습에 포함되지 않은 문제입니다.")
        if item["status"] != "pending":
            raise HTTPException(409, "이미 마친 문제입니다. 학습을 새로 불러와 주세요.")
        return item

    def finish(db, session_id, exercise_id, status, assisted):
        db.execute("UPDATE session_items SET status=? WHERE session_id=? AND exercise_id=?", (status, session_id, exercise_id))
        due = today() + timedelta(days=1 if assisted or status == "revealed" else 3)
        db.execute("""INSERT INTO progress(exercise_id, completed_count, last_day, due_day, last_outcome)
                    VALUES(?, 1, ?, ?, ?)
                    ON CONFLICT(exercise_id) DO UPDATE SET completed_count=completed_count+1,
                    last_day=excluded.last_day, due_day=excluded.due_day, last_outcome=excluded.last_outcome""",
                   (exercise_id, today().isoformat(), due.isoformat(), status))

    @app.get("/api/health")
    def health():
        # A healthy learning app must be able to read its persistent store.
        with connect(path) as db:
            db.execute("SELECT count(*) FROM sessions").fetchone()
        return {"status": "ok"}

    @app.get("/api/tracks")
    def tracks():
        return TRACKS

    @app.get("/api/dashboard")
    def dashboard():
        with connect(path) as db:
            day = today().isoformat()
            record = db.execute("SELECT id FROM sessions WHERE track_id='pandas' AND batch=0 AND local_day=?", (day,)).fetchone()
            extra = db.execute("SELECT id FROM sessions WHERE track_id='pandas' AND local_day=? AND batch>0 ORDER BY batch DESC LIMIT 1", (day,)).fetchone()
            total_done = db.execute("SELECT count(*) FROM session_items i JOIN sessions s ON i.session_id=s.id WHERE s.local_day=? AND i.status!='pending'", (day,)).fetchone()[0]
            learned = db.execute("SELECT count(*) FROM progress").fetchone()[0]
            start = (today() - timedelta(days=6)).isoformat()
            days = db.execute("""SELECT DISTINCT s.local_day FROM sessions s JOIN session_items i ON i.session_id=s.id
                WHERE i.status != 'pending' AND s.local_day BETWEEN ? AND ? ORDER BY s.local_day""", (start, day)).fetchall()
            return {"local_day": day, "timezone": str(zone), "learned_count": learned,
                    "weekly_days": [row[0] for row in days],
                    "today": snapshot(db, record[0]) if record else None,
                    "extra": snapshot(db, extra[0]) if extra else None, "today_completed_count": total_done}

    @app.post("/api/sessions/today")
    def start(body: StartSession):
        if body.track_id != "pandas":
            raise HTTPException(409, "아직 준비 중인 트랙입니다.")
        with connect(path) as db:
            day = today().isoformat()
            existing = db.execute("SELECT id FROM sessions WHERE track_id=? AND batch=0 AND local_day=?", (body.track_id, day)).fetchone()
            if existing:
                return snapshot(db, existing[0])
            progress = {row["exercise_id"]: row for row in db.execute("SELECT * FROM progress")}
            due = sorted((ex for ex in EXERCISES if ex.id in progress and progress[ex.id]["due_day"] <= day),
                         key=lambda ex: (progress[ex.id]["due_day"], EXERCISES.index(ex)))[:3]
            new = [ex for ex in EXERCISES if ex.id not in progress]
            selected = [(ex, "review") for ex in due]
            selected += [(ex, "new") for ex in new[:5 - len(selected)]]
            if len(selected) < 5:
                ids = {ex.id for ex, _ in selected}
                # Once all content has been seen, offer explicit extra practice; never mislabel it as due review.
                practice = sorted((ex for ex in EXERCISES if ex.id not in ids),
                                  key=lambda ex: (progress.get(ex.id, {"due_day": day})["due_day"], EXERCISES.index(ex)))
                selected += [(ex, "practice") for ex in practice[:5 - len(selected)]]
            session_id = str(uuid4())
            db.execute("INSERT INTO sessions(id, track_id, local_day, timezone, created_at) VALUES(?, ?, ?, ?, ?)",
                       (session_id, body.track_id, day, str(zone), clock().isoformat()))
            db.executemany("INSERT INTO session_items(session_id, position, exercise_id, version, category) VALUES(?, ?, ?, ?, ?)",
                           [(session_id, pos, ex.id, ex.version, category) for pos, (ex, category) in enumerate(selected)])
            return snapshot(db, session_id)

    @app.post("/api/sessions/extra")
    def start_extra(body: StartSession):
        if body.track_id != "pandas":
            raise HTTPException(409, "아직 준비 중인 트랙입니다.")
        with connect(path) as db:
            day = today().isoformat()
            daily = db.execute("SELECT id FROM sessions WHERE track_id=? AND local_day=? AND batch=0", (body.track_id, day)).fetchone()
            if not daily or not snapshot(db, daily[0])["finished"]:
                raise HTTPException(409, "오늘의 기본 학습을 마친 뒤 추가로 풀 수 있어요.")
            latest = db.execute("SELECT id, batch FROM sessions WHERE track_id=? AND local_day=? ORDER BY batch DESC LIMIT 1", (body.track_id, day)).fetchone()
            if latest["batch"] > 0 and not snapshot(db, latest["id"])["finished"]:
                return snapshot(db, latest["id"])
            progress = {row["exercise_id"] for row in db.execute("SELECT exercise_id FROM progress")}
            selected = [(ex, "new") for ex in EXERCISES if ex.id not in progress][:5]
            selected_ids = {ex.id for ex, _ in selected}
            # Prefer the least recently encountered questions after unseen content.
            history = db.execute("""SELECT i.exercise_id FROM session_items i JOIN sessions s ON i.session_id=s.id
                WHERE i.status!='pending' ORDER BY s.local_day, s.batch, i.position""").fetchall()
            last_seen = {row[0]: pos for pos, row in enumerate(history)}
            practice = sorted((ex for ex in EXERCISES if ex.id not in selected_ids), key=lambda ex: last_seen.get(ex.id, -1))
            selected += [(ex, "practice") for ex in practice[:5 - len(selected)]]
            session_id = str(uuid4())
            db.execute("INSERT INTO sessions(id, track_id, local_day, timezone, created_at, batch) VALUES(?, ?, ?, ?, ?, ?)",
                       (session_id, body.track_id, day, str(zone), clock().isoformat(), latest["batch"] + 1))
            db.executemany("INSERT INTO session_items(session_id, position, exercise_id, version, category) VALUES(?, ?, ?, ?, ?)",
                           [(session_id, pos, ex.id, ex.version, category) for pos, (ex, category) in enumerate(selected)])
            return snapshot(db, session_id)

    @app.get("/api/sessions/{session_id}")
    def read_session(session_id: str):
        with connect(path) as db:
            return snapshot(db, session_id)

    @app.post("/api/sessions/{session_id}/answers")
    def answer(session_id: str, body: Answer):
        with connect(path) as db:
            session_record(db, session_id, mutable=True)
            prior = db.execute("SELECT * FROM attempts WHERE id=?", (str(body.attempt_id),)).fetchone()
            if prior:
                if (prior["session_id"], prior["exercise_id"], prior["answer"]) != (session_id, body.exercise_id, body.answer):
                    raise HTTPException(409, "같은 제출 ID를 다른 답안에 사용할 수 없습니다.")
                return {"correct": bool(prior["correct"]), "session": snapshot(db, session_id)}
            item = pending_item(db, session_id, body.exercise_id)
            exercise = BY_ID[body.exercise_id]
            if not body.answer.strip() or (exercise.kind == "choice" and body.answer not in exercise.choices):
                raise HTTPException(422, "문제에 맞는 답안을 입력해 주세요.")
            correct = exercise.matches(body.answer)
            db.execute("INSERT INTO attempts VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
                       (str(body.attempt_id), session_id, exercise.id, body.answer, int(correct), item["hints_used"], body.active_seconds, clock().isoformat()))
            db.execute("""UPDATE session_items SET attempts_count=attempts_count+1, last_answer=?, last_correct=?,
                        active_seconds=max(active_seconds, ?) WHERE session_id=? AND exercise_id=?""",
                       (body.answer, int(correct), body.active_seconds, session_id, exercise.id))
            if correct:
                finish(db, session_id, exercise.id, "correct", item["hints_used"] > 0 or item["attempts_count"] > 0)
            return {"correct": correct, "session": snapshot(db, session_id)}

    @app.post("/api/sessions/{session_id}/hint")
    def hint(session_id: str, body: ExerciseAction):
        with connect(path) as db:
            item = pending_item(db, session_id, body.exercise_id)
            count = min(item["hints_used"] + 1, len(BY_ID[body.exercise_id].hints))
            db.execute("UPDATE session_items SET hints_used=? WHERE session_id=? AND exercise_id=?", (count, session_id, body.exercise_id))
            return snapshot(db, session_id)

    @app.post("/api/sessions/{session_id}/reveal")
    def reveal(session_id: str, body: ExerciseAction):
        with connect(path) as db:
            session_record(db, session_id, mutable=True)
            item = db.execute("SELECT status FROM session_items WHERE session_id=? AND exercise_id=?", (session_id, body.exercise_id)).fetchone()
            if item and item["status"] == "revealed":
                return snapshot(db, session_id)
            pending_item(db, session_id, body.exercise_id)
            finish(db, session_id, body.exercise_id, "revealed", True)
            return snapshot(db, session_id)

    if frontend_dir is not None:
        # API routes above keep their precedence; this serves the Vite build.
        app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
    return app


app = create_app(frontend_dir=(Path(__file__).resolve().parent.parent / "dist")
                 if os.environ.get("APP_SERVE_FRONTEND") == "1" else None)
