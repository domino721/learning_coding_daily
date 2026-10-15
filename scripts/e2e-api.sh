#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
e2e_dir="$(mktemp -d /tmp/learning-e2e-XXXXXX)"
server_pid=''
cleanup() {
  if [[ -n "$server_pid" ]]; then
    kill "$server_pid" 2>/dev/null || true
    wait "$server_pid" 2>/dev/null || true
  fi
  rm -rf "$e2e_dir"
}
trap cleanup EXIT
trap 'exit 0' TERM INT
APP_DB_PATH="$e2e_dir/learning.sqlite3" UV_CACHE_DIR=/workspace/.cache/uv uv run --frozen uvicorn backend.main:app --host 127.0.0.1 --port 8001 &
server_pid=$!
wait "$server_pid"
