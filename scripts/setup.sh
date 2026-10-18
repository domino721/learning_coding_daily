#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export npm_config_cache="${npm_config_cache:-/tmp/learning-coding-npm}"
export UV_CACHE_DIR="${UV_CACHE_DIR:-/tmp/learning-coding-uv}"
npm ci
uv sync --frozen
