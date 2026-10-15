"""SQLite schema v1 for a single-person local learning app."""
from contextlib import contextmanager
from pathlib import Path
import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY, track_id TEXT NOT NULL, local_day TEXT NOT NULL,
    timezone TEXT NOT NULL, created_at TEXT NOT NULL,
    UNIQUE(track_id, local_day)
);
CREATE TABLE IF NOT EXISTS session_items (
    session_id TEXT NOT NULL REFERENCES sessions(id), position INTEGER NOT NULL,
    exercise_id TEXT NOT NULL, version INTEGER NOT NULL,
    category TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
    hints_used INTEGER NOT NULL DEFAULT 0, attempts_count INTEGER NOT NULL DEFAULT 0,
    last_answer TEXT, last_correct INTEGER, active_seconds INTEGER NOT NULL DEFAULT 0,
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
    db.execute("PRAGMA foreign_keys=ON")
    try:
        # Serialize read/modify/write operations across tabs and requests.
        db.execute("BEGIN IMMEDIATE")
        version = db.execute("PRAGMA user_version").fetchone()[0]
        if version not in (0, 1):
            raise RuntimeError(f"Unsupported database schema version: {version}")
        if version == 0:
            for statement in SCHEMA.split(";"):
                if statement.strip():
                    db.execute(statement)
            db.execute("PRAGMA user_version=1")
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
