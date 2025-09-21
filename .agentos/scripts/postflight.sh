#!/usr/bin/env bash
set -euo pipefail

info() { echo "[postflight] $*"; }

info "Running lint/typecheck/build/tests via Turbo"

bun run turbo lint
bun run turbo typecheck
bun run turbo build
bun run turbo test:ci

info "Post-flight checks complete"

