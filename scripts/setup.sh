#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export npm_config_cache=/workspace/.cache/npm
export UV_CACHE_DIR=/workspace/.cache/uv
npm ci
uv sync --frozen
