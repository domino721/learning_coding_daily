"""SQLite schema v3 for a single-person local learning app."""
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
    response_mode TEXT,
    PRIMARY KEY(session_id, exercise_id), UNIQUE(session_id, position)
);
CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY, session_id TEXT NOT NULL REFERENCES sessions(id),
    exercise_id TEXT NOT NULL, answer TEXT NOT NULL, correct INTEGER NOT NULL,
    hints_used INTEGER NOT NULL, active_seconds INTEGER NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS progress (
    exercise_id TEXT PRIMARY KEY, completed_count INTEGER NOT NULL DEFAULT 0,
    last_day TEXT NOT NULL, due_day TEXT NOT NULL,
    last_outcome TEXT NOT NULL
);
"""


@contextmanager
def connect(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path, timeout=15)
    db.row_factory = sqlite3.Row
    try:
        # v1 allowed exactly one session per day. Rebuild only that parent table,
        # retaining IDs so items, attempts and progress survive the upgrade.
        if db.execute("PRAGMA user_version").fetchone()[0] != 3:
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
            elif version not in (2, 3):
                raise RuntimeError(f"Unsupported database schema version: {version}")
            if version in (1, 2):
                db.execute("ALTER TABLE session_items ADD COLUMN response_mode TEXT")
            if db.execute("PRAGMA foreign_key_check").fetchall():
                raise RuntimeError("Database migration failed foreign key validation")
            db.execute("PRAGMA user_version=3")
            db.commit()
        db.execute("PRAGMA foreign_keys=ON")
        # Serialize creation/resumption of extra batches and answer retries.
        db.execute("BEGIN IMMEDIATE")
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
