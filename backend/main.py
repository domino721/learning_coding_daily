from datetime import datetime, timedelta, timezone
import os
import json
from dataclasses import asdict
from backend.content import Exercise
from backend.curriculum import select_exercises, concept_states, review_due
from backend.records import event, export_records, restore_records
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


ResponseMode = Literal["choice", "short", "essay"]


class StartSession(RequestModel):
    response_mode: ResponseMode | None = None
    track_id: Literal["python", "sql", "pandas", "algorithms", "statistics"] = "python"


class ExerciseAction(RequestModel):
    exercise_id: str = Field(min_length=1, max_length=80)


class ModeChange(ExerciseAction):
    response_mode: ResponseMode


class Draft(ExerciseAction):
    draft: str = Field(max_length=2000)


class Restore(RequestModel):
    data: dict
    confirm_owner: bool = False
    recover_unreadable: bool = False


class TimedExerciseAction(ExerciseAction):
    active_seconds: int = Field(default=0, ge=0, le=86400, strict=True)


class Answer(TimedExerciseAction):
    answer: str = Field(min_length=1, max_length=2000)
    attempt_id: UUID


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

    def authored(row):
        return Exercise(**json.loads(row['snapshot'])) if row['snapshot'] else BY_ID[row['exercise_id']]

    def all_sessions(db):
        return [snapshot(db,row[0]) for row in db.execute('SELECT id FROM sessions ORDER BY local_day,batch')]

    def snapshot(db, session_id):
        record = session_record(db, session_id)
        items = []
        for row in db.execute("SELECT * FROM session_items WHERE session_id=? ORDER BY position", (session_id,)):
            exercise = authored(row)
            item = {"id": exercise.id, "version": row["version"], "concept": exercise.concept,
                    "domain": exercise.domain, "level": exercise.level, "concept_id": exercise.concept_id, "difficulty": exercise.difficulty,
                    "draft": row['draft'], "completed_at": row['completed_at'],
                    "kind": exercise.kind, "response_mode": row["response_mode"] or ("choice" if exercise.kind == "choice" else "short"),
                    "title": exercise.title, "prompt": exercise.prompt,
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
        prior=db.execute('SELECT * FROM progress WHERE exercise_id=?',(exercise_id,)).fetchone()
        prior=dict(prior) if prior else {}
        due,streak=review_due(today().isoformat(),prior,not assisted and status=='correct')
        db.execute("""INSERT INTO progress(exercise_id,completed_count,last_day,due_day,last_outcome,streak)
            VALUES(?,1,?,?,?,?) ON CONFLICT(exercise_id) DO UPDATE SET completed_count=completed_count+1,
            last_day=excluded.last_day,due_day=excluded.due_day,last_outcome=excluded.last_outcome,streak=excluded.streak""",
            (exercise_id,today().isoformat(),due,status,streak))
        db.execute('UPDATE session_items SET completed_at=?,draft=NULL WHERE session_id=? AND exercise_id=?',(clock().isoformat(),session_id,exercise_id))
        event(db,'completed',session_id,exercise_id,f'completed:{session_id}:{exercise_id}',status,clock().isoformat())


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
    def dashboard(track_id: Literal["python", "sql"] = "python"):
        with connect(path) as db:
            day = today().isoformat()
            record = db.execute("SELECT id FROM sessions WHERE track_id=? AND batch=0 AND local_day=?", (track_id,day,)).fetchone()
            extra = db.execute("SELECT id FROM sessions WHERE track_id=? AND local_day=? AND batch>0 ORDER BY batch DESC LIMIT 1", (track_id,day,)).fetchone()
            sessions = db.execute("SELECT id FROM sessions WHERE track_id=? AND local_day=? ORDER BY batch", (track_id,day,)).fetchall()
            total_done = db.execute("SELECT count(*) FROM session_items i JOIN sessions s ON i.session_id=s.id WHERE s.local_day=? AND i.status!='pending'", (day,)).fetchone()[0]
            learned = db.execute("SELECT count(*) FROM progress").fetchone()[0]
            start = (today() - timedelta(days=6)).isoformat()
            days = db.execute("""SELECT DISTINCT s.local_day FROM sessions s JOIN session_items i ON i.session_id=s.id
                WHERE i.status != 'pending' AND s.local_day BETWEEN ? AND ? ORDER BY s.local_day""", (start, day)).fetchall()
            legacy = [s for s in all_sessions(db) if s['track_id']=='pandas' and s['local_day']==day]
            progress = {row['exercise_id']:dict(row) for row in db.execute('SELECT * FROM progress')}
            return {"track_id":track_id,"available_count":len(select_exercises(EXERCISES,all_sessions(db),progress,day,True,track_id)),"legacy_session":next((s for s in reversed(legacy) if any(i["status"]=="pending" and i["response_mode"]!="essay" for i in s["items"])),legacy[-1] if legacy else None),"local_day": day, "timezone": str(zone), "learned_count": learned,
                    "weekly_days": [row[0] for row in days],
                    "today": snapshot(db, record[0]) if record else None,
                    "learner_id": db.execute("SELECT value FROM metadata WHERE key='learner_id'").fetchone()[0],
                    "all_time_completed_count":max(db.execute("SELECT count(*) FROM session_items WHERE status!='pending'").fetchone()[0],db.execute('SELECT coalesce(sum(completed_count),0) FROM progress').fetchone()[0]),
                    "concepts":list(concept_states(all_sessions(db),BY_ID).values()),
                    "today_sessions": [s for s in all_sessions(db) if s["local_day"]==day],
                    "extra": snapshot(db, extra[0]) if extra else None, "today_completed_count": total_done}

    @app.post("/api/sessions/today")
    def start(body: StartSession):
        if body.track_id == "pandas": body.track_id = "python"
        if body.response_mode == "essay": raise HTTPException(422, "서술형은 안정화할 때까지 보류 중이에요.")
        if body.track_id not in ("python", "sql"):
            raise HTTPException(409, "아직 준비 중인 트랙입니다.")
        with connect(path) as db:
            day = today().isoformat()
            existing = db.execute("SELECT id FROM sessions WHERE track_id=? AND batch=0 AND local_day=?", (body.track_id, day)).fetchone()
            if existing:
                return snapshot(db, existing[0])
            progress = {row['exercise_id']:dict(row) for row in db.execute('SELECT * FROM progress')}
            selected=select_exercises(EXERCISES,all_sessions(db),progress,day,track=body.track_id)
            if not selected: raise HTTPException(422, "오늘 추천할 새 문제와 예정된 복습을 모두 풀었어요. 다른 트랙을 연습하거나 다음 복습 때 만나요.")
            session_id = str(uuid4())
            db.execute("INSERT INTO sessions(id, track_id, local_day, timezone, created_at) VALUES(?, ?, ?, ?, ?)",
                       (session_id, body.track_id, day, str(zone), clock().isoformat()))
            db.executemany("INSERT INTO session_items(session_id, position, exercise_id, version, category, response_mode, snapshot) VALUES(?, ?, ?, ?, ?, ?, ?)",
                           [(session_id, pos, ex.id, ex.version, category, body.response_mode or ex.response_mode, json.dumps(asdict(ex),ensure_ascii=False)) for pos, (ex, category) in enumerate(selected)])
            event(db,'session_started',session_id,occurred_at=clock().isoformat())
            return snapshot(db, session_id)

    @app.post("/api/sessions/extra")
    def start_extra(body: StartSession):
        if body.track_id == "pandas": body.track_id = "python"
        if body.response_mode == "essay": raise HTTPException(422, "서술형은 안정화할 때까지 보류 중이에요.")
        if body.track_id not in ("python", "sql"):
            raise HTTPException(409, "아직 준비 중인 트랙입니다.")
        with connect(path) as db:
            day = today().isoformat()
            daily = db.execute("SELECT id FROM sessions WHERE track_id=? AND local_day=? AND batch=0", (body.track_id, day)).fetchone()
            if not daily or not snapshot(db, daily[0])["finished"]:
                raise HTTPException(409, "오늘의 기본 학습을 마친 뒤 추가로 풀 수 있어요.")
            latest = db.execute("SELECT id, batch FROM sessions WHERE track_id=? AND local_day=? ORDER BY batch DESC LIMIT 1", (body.track_id, day)).fetchone()
            if latest["batch"] > 0 and not snapshot(db, latest["id"])["finished"]:
                return snapshot(db, latest["id"])
            progress = {row['exercise_id']:dict(row) for row in db.execute('SELECT * FROM progress')}
            selected=select_exercises(EXERCISES,all_sessions(db),progress,day,extra=True,track=body.track_id)
            if not selected: raise HTTPException(422, "오늘 추천할 새 문제와 예정된 복습을 모두 풀었어요. 다른 트랙을 연습하거나 다음 복습 때 만나요.")
            session_id = str(uuid4())
            db.execute("INSERT INTO sessions(id, track_id, local_day, timezone, created_at, batch) VALUES(?, ?, ?, ?, ?, ?)",
                       (session_id, body.track_id, day, str(zone), clock().isoformat(), latest["batch"] + 1))
            db.executemany("INSERT INTO session_items(session_id, position, exercise_id, version, category, response_mode, snapshot) VALUES(?, ?, ?, ?, ?, ?, ?)",
                           [(session_id, pos, ex.id, ex.version, category, body.response_mode or ex.response_mode, json.dumps(asdict(ex),ensure_ascii=False)) for pos, (ex, category) in enumerate(selected)])
            event(db,'session_started',session_id,occurred_at=clock().isoformat())
            return snapshot(db, session_id)

    @app.get('/api/history')
    def history():
        with connect(path) as db:
            data=export_records(db,snapshot)
            return {'sessions':list(reversed(data['sessions'])),'events':list(reversed(data['events']))}

    @app.get('/api/backup')
    def backup():
        with connect(path) as db:return export_records(db,snapshot)

    @app.post('/api/restore')
    def restore(body:Restore):
        with connect(path) as db:
            restore_records(db,body.data,snapshot,body.confirm_owner)
            return {'restored':True}

    @app.post('/api/sessions/{session_id}/draft')
    def draft(session_id:str,body:Draft):
        with connect(path) as db:
            pending_item(db,session_id,body.exercise_id)
            db.execute('UPDATE session_items SET draft=? WHERE session_id=? AND exercise_id=?',(body.draft,session_id,body.exercise_id))
            return snapshot(db,session_id)

    @app.get("/api/sessions/{session_id}")
    def read_session(session_id: str):
        with connect(path) as db:
            return snapshot(db, session_id)

    @app.post("/api/sessions/{session_id}/mode")
    def change_mode(session_id: str, body: ModeChange):
        if body.response_mode == "essay": raise HTTPException(422, "서술형은 안정화할 때까지 보류 중이에요.")
        with connect(path) as db:
            pending_item(db, session_id, body.exercise_id)
            db.execute("UPDATE session_items SET response_mode=? WHERE session_id=? AND status='pending'",
                       (body.response_mode, session_id))
            return snapshot(db, session_id)

    @app.post("/api/sessions/{session_id}/answers")
    def answer(session_id: str, body: Answer):
        with connect(path) as db:
            session_record(db, session_id, mutable=True)
            prior = db.execute("SELECT * FROM attempts WHERE id=?", (str(body.attempt_id),)).fetchone()
            if prior:
                if (prior["session_id"], prior["exercise_id"], prior["answer"]) != (session_id, body.exercise_id, body.answer):
                    raise HTTPException(409, "같은 제출 ID를 다른 답안에 사용할 수 없습니다.")
                return {"correct": None if prior['response_mode']=='essay' else bool(prior['correct']), "session":snapshot(db,session_id)}
            item = pending_item(db, session_id, body.exercise_id)
            exercise = authored(item)
            mode = item["response_mode"] or ("choice" if exercise.kind == "choice" else "short")
            if (not body.answer.strip() or (mode != "essay" and len(body.answer) > 200)
                    or (mode == "choice" and body.answer not in exercise.choices)):
                raise HTTPException(422, "문제에 맞는 답안을 입력해 주세요.")
            if mode == "essay": raise HTTPException(422, "서술형은 보류 중이에요. 작성한 답안은 학습 기록에 보관됩니다.")
            if mode == "choice" and item["attempts_count"] >= 2:
                finish(db,session_id,exercise.id,"incorrect",True)
                return {"correct":False,"session":snapshot(db,session_id)}
            correct = exercise.matches(body.answer)
            db.execute("INSERT INTO attempts VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
                       (str(body.attempt_id), session_id, exercise.id, body.answer, int(correct), item["hints_used"], body.active_seconds, clock().isoformat(),mode))
            db.execute("""UPDATE session_items SET attempts_count=attempts_count+1, last_answer=?, last_correct=?,
                        active_seconds=max(active_seconds, ?) WHERE session_id=? AND exercise_id=?""",
                       (body.answer, None if mode == "essay" else int(correct), body.active_seconds, session_id, exercise.id))
            event(db,'attempt',session_id,exercise.id,str(body.attempt_id),'서술 답안 저장' if mode=='essay' else '정답' if correct else '다시 시도',clock().isoformat())
            if mode == "essay":
                finish(db, session_id, exercise.id, "revealed", True)
            elif correct:
                finish(db, session_id, exercise.id, "correct", item["hints_used"] > 0 or item["attempts_count"] > 0)
            elif mode == "choice" and item["attempts_count"] + 1 >= 2:
                finish(db,session_id,exercise.id,"incorrect",True)
            return {"correct": None if mode == "essay" else correct, "session": snapshot(db, session_id)}

    @app.post("/api/sessions/{session_id}/hint")
    def hint(session_id: str, body: ExerciseAction):
        with connect(path) as db:
            item = pending_item(db, session_id, body.exercise_id)
            count = min(item["hints_used"] + 1, len(authored(item).hints))
            db.execute("UPDATE session_items SET hints_used=? WHERE session_id=? AND exercise_id=?", (count, session_id, body.exercise_id))
            event(db,'hint',session_id,body.exercise_id,f'hint:{session_id}:{body.exercise_id}:{count}',occurred_at=clock().isoformat())
            return snapshot(db, session_id)

    @app.post("/api/sessions/{session_id}/reveal")
    def reveal(session_id: str, body: TimedExerciseAction):
        with connect(path) as db:
            session_record(db, session_id, mutable=True)
            item = db.execute("SELECT status FROM session_items WHERE session_id=? AND exercise_id=?", (session_id, body.exercise_id)).fetchone()
            if item and item["status"] == "revealed":
                return snapshot(db, session_id)
            pending_item(db, session_id, body.exercise_id)
            db.execute("UPDATE session_items SET active_seconds=max(active_seconds, ?) WHERE session_id=? AND exercise_id=?",
                       (body.active_seconds, session_id, body.exercise_id))
            finish(db, session_id, body.exercise_id, "revealed", True)
            event(db,'reveal',session_id,body.exercise_id,f'reveal:{session_id}:{body.exercise_id}',occurred_at=clock().isoformat())
            return snapshot(db, session_id)

    if frontend_dir is not None:
        # API routes above keep their precedence; this serves the Vite build.
        app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
    return app


app = create_app(frontend_dir=(Path(__file__).resolve().parent.parent / "dist")
                 if os.environ.get("APP_SERVE_FRONTEND") == "1" else None)
