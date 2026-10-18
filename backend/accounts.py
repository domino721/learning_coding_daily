"""Opt-in account isolation. Tokens and recovery codes are stored only as digests."""
from contextlib import contextmanager
import hashlib
import hmac
from pathlib import Path
import re
import secrets
import sqlite3
import time
from uuid import uuid4

from fastapi import HTTPException


def password_hash(password, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt), n=16384, r=8, p=1).hex()
    return salt + ':' + digest


def password_matches(password, encoded):
    return hmac.compare_digest(password_hash(password, encoded.split(':')[0]), encoded)


def digest(value):
    return hashlib.sha256(value.encode()).hexdigest()


class Accounts:
    def __init__(self, directory: Path):
        self.directory = directory

    @contextmanager
    def db(self):
        self.directory.mkdir(parents=True, exist_ok=True, mode=0o700)
        with sqlite3.connect(self.directory / 'accounts.sqlite3', timeout=15) as db:
            db.row_factory = sqlite3.Row
            db.execute('PRAGMA foreign_keys=ON')
            db.executescript('''CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, recovery TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS tokens(hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires INTEGER NOT NULL);
            CREATE TABLE IF NOT EXISTS limits(bucket TEXT NOT NULL,window INTEGER NOT NULL,count INTEGER NOT NULL,PRIMARY KEY(bucket,window));''')
            yield db

    def throttle(self, address):
        window = int(time.time()) // 60
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            db.execute('DELETE FROM limits WHERE window<?', (window-1,))
            db.execute('INSERT INTO limits VALUES(?,?,1) ON CONFLICT(bucket,window) DO UPDATE SET count=count+1', (digest(address), window))
            count = db.execute('SELECT count FROM limits WHERE bucket=? AND window=?', (digest(address),window)).fetchone()[0]
        if count > 15:
            raise HTTPException(429, '잠시 후 다시 시도해 주세요.', headers={'Retry-After':'60'})

    def issue(self, db, uid):
        token = secrets.token_urlsafe(32)
        expires = int(time.time()) + 86400
        db.execute('DELETE FROM tokens WHERE expires<?', (int(time.time()),))
        db.execute('INSERT INTO tokens VALUES(?,?,?)', (digest(token),uid,expires))
        return {'token': token, 'expires_at': expires, 'user_id': uid}

    def register(self, username, password):
        username = username.strip().lower()
        if not re.fullmatch(r'[a-z0-9_-]{3,40}', username):
            raise HTTPException(422, '아이디는 영문 소문자·숫자·_·- 3~40자입니다.')
        recovery = secrets.token_urlsafe(32)
        uid = str(uuid4())
        try:
            with self.db() as db:
                db.execute('INSERT INTO users VALUES(?,?,?,?)', (uid,username,password_hash(password),digest(recovery)))
                return {**self.issue(db,uid), 'recovery_code': recovery}
        except sqlite3.IntegrityError:
            raise HTTPException(409, '사용할 수 없는 아이디입니다.')

    def login(self, username, password):
        with self.db() as db:
            row = db.execute('SELECT * FROM users WHERE username=?', (username.strip().lower(),)).fetchone()
            # Equal-cost hashing for missing users avoids a cheap username probe.
            valid = password_matches(password,row['password']) if row else bool(password_hash(password) and False)
            if not valid:
                raise HTTPException(401, '아이디 또는 비밀번호를 확인해 주세요.')
            return self.issue(db,row['id'])

    def authenticate(self, token):
        with self.db() as db:
            row = db.execute('SELECT user_id FROM tokens WHERE hash=? AND expires>?', (digest(token),int(time.time()))).fetchone()
            if not row:
                raise HTTPException(401, '로그인이 필요하거나 연결이 만료되었어요.')
            return row['user_id']

    def logout(self, token):
        with self.db() as db:
            db.execute('DELETE FROM tokens WHERE hash=?', (digest(token),))

    def recover(self, username, code, password):
        with self.db() as db:
            row = db.execute('SELECT * FROM users WHERE username=?', (username.strip().lower(),)).fetchone()
            if not row or not hmac.compare_digest(row['recovery'],digest(code)):
                raise HTTPException(401,'복구 정보를 확인해 주세요.')
            recovery=secrets.token_urlsafe(32)
            db.execute('UPDATE users SET password=?,recovery=? WHERE id=?',(password_hash(password),digest(recovery),row['id']))
            db.execute('DELETE FROM tokens WHERE user_id=?',(row['id'],))
            return {**self.issue(db,row['id']), 'recovery_code':recovery}

    def delete(self, uid, password):
        with self.db() as db:
            row=db.execute('SELECT * FROM users WHERE id=?',(uid,)).fetchone()
            if not row or not password_matches(password,row['password']):
                raise HTTPException(401,'비밀번호를 확인해 주세요.')
            db.execute('DELETE FROM users WHERE id=?',(uid,))
        path=self.directory/'users'/f'{uid}.sqlite3'
        if path.exists(): path.unlink()

    def path(self, uid):
        return self.directory / 'users' / f'{uid}.sqlite3'
