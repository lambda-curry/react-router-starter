#!/usr/bin/env bash
set -euo pipefail

# Usage: ./generate-tasks.sh PATH_TO_SPEC_DIR
SPEC_DIR=${1:-}
if [ -z "$SPEC_DIR" ]; then
  echo "Usage: $0 .agentos/specs/NNN-feature" >&2
  exit 1
fi

# Here we would invoke an agent to read plan.md and produce tasks.md.
# For v0.1, we ensure the file exists and print a hint.
if [ ! -f "$SPEC_DIR/plan.md" ]; then
  echo "Missing $SPEC_DIR/plan.md" >&2
  exit 1
fi

[ -f "$SPEC_DIR/tasks.md" ] || cp .agentos/templates/docs/tasks-template.md "$SPEC_DIR/tasks.md"
echo "Tasks prepared at $SPEC_DIR/tasks.md"

