#!/usr/bin/env bash
set -euo pipefail

# Usage: ./create-spec.sh "Feature Title"

TITLE_RAW=${1:-sample-feature}
TITLE_SLUG=$(echo "$TITLE_RAW" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-|-$//g')
NEXT_NUM=$(printf "%03d" 1)

# Compute next number by counting existing dirs
if [ -d .agentos/specs ]; then
  COUNT=$(find .agentos/specs -maxdepth 1 -mindepth 1 -type d | wc -l | xargs)
  NEXT_NUM=$(printf "%03d" $((COUNT + 1)))
fi

DIR=".agentos/specs/${NEXT_NUM}-${TITLE_SLUG}"
mkdir -p "$DIR/contracts"

cp .agentos/templates/docs/spec-template.md "$DIR/spec.md"
cp .agentos/templates/docs/plan-template.md "$DIR/plan.md"
cp .agentos/templates/docs/tasks-template.md "$DIR/tasks.md"

echo "Created spec at $DIR"

