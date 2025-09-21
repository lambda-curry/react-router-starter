#!/usr/bin/env bash
set -euo pipefail

# Usage: ./implement-tasks.sh PATH_TO_SPEC_DIR
SPEC_DIR=${1:-}
if [ -z "$SPEC_DIR" ]; then
  echo "Usage: $0 .agentos/specs/NNN-feature" >&2
  exit 1
fi

.agentos/scripts/preflight.sh

# Placeholder: v0.1 does not auto‑apply code changes.
# Implementers follow tasks.md and commit step-by-step.

.agentos/scripts/postflight.sh

