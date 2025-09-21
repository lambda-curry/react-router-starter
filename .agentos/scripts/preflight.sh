#!/usr/bin/env bash
set -euo pipefail

info() { echo "[preflight] $*"; }
warn() { echo "[preflight][warn] $*"; }

info "Starting pre-flight checks"

# Tooling
if command -v bun >/dev/null 2>&1; then bun --version || true; else warn "bun not found"; fi
if command -v turbo >/dev/null 2>&1; then turbo --version || true; else warn "turbo not found (will use bun run turbo)"; fi

# Linting tool presence (Biome or ESLint)
if bunx --help >/dev/null 2>&1; then
  (bunx biome --version >/dev/null 2>&1 && info "Biome available") || warn "Biome not found"
else
  warn "bunx not available; skipping biome check"
fi

# Prisma (optional)
if command -v prisma >/dev/null 2>&1; then
  info "Checking Prisma connectivity"
  prisma validate || warn "prisma validate failed (ok if no DB in this repo)"
else
  info "No Prisma in this repo; skipping DB checks"
fi

# Frontend build sanity (best-effort)
if [ -f "package.json" ]; then
  info "Workspace sanity: turbo graph"
  (bun run turbo run build --dry-run >/dev/null 2>&1 && info "turbo dry-run ok") || warn "turbo dry-run failed"
fi

info "Pre-flight checks complete"

