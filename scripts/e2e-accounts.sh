#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
e2e_dir="$(mktemp -d /tmp/learning-account-e2e-XXXXXX)"
server_pid=''
cleanup() {
  if [[ -n "$server_pid" ]]; then kill "$server_pid" 2>/dev/null || true; wait "$server_pid" 2>/dev/null || true; fi
  rm -rf "$e2e_dir"
}
trap cleanup EXIT
trap 'exit 0' TERM INT
APP_REQUIRE_AUTH=1 APP_ALLOWED_ORIGINS=http://127.0.0.1:5175 APP_DB_PATH="$e2e_dir/local.sqlite3" UV_CACHE_DIR="${UV_CACHE_DIR:-/tmp/learning-coding-uv}" uv run --frozen uvicorn backend.main:app --host 127.0.0.1 --port 8002 &
server_pid=$!
wait "$server_pid"
