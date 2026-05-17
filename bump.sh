#!/usr/bin/env bash
# Bumps the ?v=N cache-buster on every script/data import across the repo.
# Run after editing scripts/*.js or data/projects.js to force iOS Safari
# (and any cached browser) to refetch instead of serving a stale copy.
#
# Usage: ./bump.sh

set -euo pipefail
cd "$(dirname "$0")"

FILES=(
  index.html
  rt/index.html
  rk/index.html
  about/index.html
  thoughts/index.html
  _templates/note.html
  _templates/project.html
  scripts/main.js
  scripts/project-page.js
)

CURRENT=$(grep -hoE '\?v=[0-9]+' "${FILES[@]}" | head -1 | sed 's/?v=//')
NEXT=$((CURRENT + 1))

sed -i "s/?v=${CURRENT}/?v=${NEXT}/g" "${FILES[@]}"
echo "bumped ?v=${CURRENT} -> ?v=${NEXT}"
