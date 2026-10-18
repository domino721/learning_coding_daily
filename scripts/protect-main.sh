#!/usr/bin/env bash
set -euo pipefail
# Run with a GitHub credential that has repository administration permission.
# No credential is read or printed by this script.
repo="${1:-domino721/learning_coding_daily}"
body="$(mktemp)"
trap 'rm -f "$body"' EXIT
cat > "$body" <<'JSON'
{"required_status_checks":{"strict":true,"contexts":["quality / Required quality checks"]},"enforce_admins":true,"required_pull_request_reviews":{"required_approving_review_count":0,"dismiss_stale_reviews":true},"restrictions":null,"allow_force_pushes":false,"allow_deletions":false}
JSON
gh api --method PUT "repos/$repo/branches/main/protection" --input "$body" --jq '{required_status_checks: .required_status_checks, enforce_admins: .enforce_admins.enabled}'
