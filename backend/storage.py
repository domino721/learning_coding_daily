"""SQLite schema v4 for a single-person local learning app."""
from contextlib import contextmanager
from pathlib import Path
import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY, track_id TEXT NOT NULL, local_day TEXT NOT NULL,
    timezone TEXT NOT NULL, created_at TEXT NOT NULL, batch INTEGER NOT NULL DEFAULT 0,
    UNIQUE(track_id, local_day, batch)
);
CREATE TABLE IF NOT EXISTS session_items (
    session_id TEXT NOT NULL REFERENCES sessions(id), position INTEGER NOT NULL,
    exercise_id TEXT NOT NULL, version INTEGER NOT NULL,
    category TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
    hints_used INTEGER NOT NULL DEFAULT 0, attempts_count INTEGER NOT NULL DEFAULT 0,
    last_answer TEXT, last_correct INTEGER, active_seconds INTEGER NOT NULL DEFAULT 0,
    response_mode TEXT, snapshot TEXT, draft TEXT, completed_at TEXT,
    PRIMARY KEY(session_id, exercise_id), UNIQUE(session_id, position)
);
CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY, session_id TEXT NOT NULL REFERENCES sessions(id),
    exercise_id TEXT NOT NULL, answer TEXT NOT NULL, correct INTEGER NOT NULL,
    hints_used INTEGER NOT NULL, active_seconds INTEGER NOT NULL, created_at TEXT NOT NULL, response_mode TEXT
);
CREATE TABLE IF NOT EXISTS progress (
    exercise_id TEXT PRIMARY KEY, completed_count INTEGER NOT NULL DEFAULT 0,
    last_day TEXT NOT NULL, due_day TEXT NOT NULL,
    last_outcome TEXT NOT NULL, streak INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS learning_events (
    id TEXT PRIMARY KEY, kind TEXT NOT NULL, session_id TEXT, exercise_id TEXT,
    occurred_at TEXT, inferred INTEGER NOT NULL DEFAULT 0, detail TEXT
);
CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
"""


@contextmanager
def connect(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path, timeout=15)
    db.row_factory = sqlite3.Row
    try:
        # v1 allowed exactly one session per day. Rebuild only that parent table,
        # retaining IDs so items, attempts and progress survive the upgrade.
        original_version=db.execute("PRAGMA user_version").fetchone()[0]
        if original_version in (1,2,3):
            backup=path.with_name(path.name + f".schema-v{original_version}.backup")
            if not backup.exists():
                with sqlite3.connect(backup) as recovery:db.backup(recovery)
        if original_version != 4:
            db.execute("PRAGMA foreign_keys=OFF")
            db.execute("BEGIN IMMEDIATE")
            version = db.execute("PRAGMA user_version").fetchone()[0]
            if version == 0:
                for statement in SCHEMA.split(";"):
                    if statement.strip():
                        db.execute(statement)
            elif version == 1:
                db.execute("""CREATE TABLE sessions_v2 (
                    id TEXT PRIMARY KEY, track_id TEXT NOT NULL, local_day TEXT NOT NULL,
                    timezone TEXT NOT NULL, created_at TEXT NOT NULL, batch INTEGER NOT NULL DEFAULT 0,
                    UNIQUE(track_id, local_day, batch))""")
                db.execute("""INSERT INTO sessions_v2(id, track_id, local_day, timezone, created_at)
                    SELECT id, track_id, local_day, timezone, created_at FROM sessions""")
                db.execute("DROP TABLE sessions")
                db.execute("ALTER TABLE sessions_v2 RENAME TO sessions")
            elif version not in (2, 3, 4):
                raise RuntimeError(f"Unsupported database schema version: {version}")
            if version in (1, 2):
                db.execute("ALTER TABLE session_items ADD COLUMN response_mode TEXT")
            if version in (1,2,3):
                for column in ('snapshot TEXT','draft TEXT','completed_at TEXT'):
                    db.execute('ALTER TABLE session_items ADD COLUMN ' + column)
                db.execute('ALTER TABLE attempts ADD COLUMN response_mode TEXT')
                db.execute('ALTER TABLE progress ADD COLUMN streak INTEGER NOT NULL DEFAULT 0')
                for statement in SCHEMA.split(';'):
                    if statement.strip():db.execute(statement)
            if db.execute("PRAGMA foreign_key_check").fetchall():
                raise RuntimeError("Database migration failed foreign key validation")
            db.execute("PRAGMA user_version=4")
            db.commit()
        db.execute("PRAGMA foreign_keys=ON")
        db.execute("CREATE INDEX IF NOT EXISTS events_session_kind ON learning_events(session_id,kind)")
        db.execute("CREATE INDEX IF NOT EXISTS missing_snapshots ON session_items(snapshot) WHERE snapshot IS NULL")
        # Serialize creation/resumption of extra batches and answer retries.
        db.execute("BEGIN IMMEDIATE")
        from dataclasses import asdict
        import json
        from uuid import uuid4
        from backend.content import BY_ID
        db.execute("INSERT OR IGNORE INTO metadata VALUES('learner_id', ?)",(str(uuid4()),))
        for row in db.execute('SELECT session_id,exercise_id FROM session_items WHERE snapshot IS NULL').fetchall():
            if row['exercise_id'] in BY_ID:
                db.execute('UPDATE session_items SET snapshot=? WHERE session_id=? AND exercise_id=?',
                    (json.dumps(asdict(BY_ID[row['exercise_id']]),ensure_ascii=False),row['session_id'],row['exercise_id']))
        # Legacy timestamps are unknown; do not invent when a completion happened.
        db.execute("""INSERT OR IGNORE INTO learning_events(id,kind,session_id,exercise_id,inferred,detail)
            SELECT 'completed:'||session_id||':'||exercise_id,'completed',session_id,exercise_id,1,'이전 기록에서 복원; 실제 완료 시각 미상'
            FROM session_items WHERE status!='pending'""")
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
