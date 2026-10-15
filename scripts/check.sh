#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/planning.py check
python3 scripts/export-content.py --check
npm run format:check
npm run build
UV_CACHE_DIR=/workspace/.cache/uv uv run --frozen pytest
