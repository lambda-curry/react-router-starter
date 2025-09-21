#!/usr/bin/env bash
set -euo pipefail

info() { echo "[research] $*"; }
warn() { echo "[research][warn] $*"; }

TASK_INPUT=${1:-"Sample bug: Unexpected 404 on POST /todos when payload includes notes[]; using RR7 action and fetcher."}
TOKENS=${TOKENS:-4000}

info "DRY-RUN stub for Research Agent"
info "Task: $TASK_INPUT"
info "Tokens budget: $TOKENS"

cat <<'EOF'
Title
- Research: Investigate issue and propose path forward

Classification and Assumptions
- Scope: Unknown (triage first)
- Assumptions: React Router 7 loaders/actions in use; typed data flow expected

Research Plan
- Confirm RR7 action semantics for FormData arrays
- Check server contract for /todos
- Verify client request encoding (fetcher/form submit)
- Identify authoritative docs using available tools (Context7, Exa/Perplexity, or browser/search MCP)

Sources (with links and versions)
- [1] TODO: https://reactrouter.com/ (v7) — action/form semantics
- [2] TODO: https://developer.mozilla.org/ — FormData array encoding

Findings and Tradeoffs
- TODO bullets with [1][2] citations

Recommendation
- TODO single best path summary

Repo Next Steps (checklist)
- [ ] Target files: apps/todo-app/app/routes/*.tsx
- [ ] Add/adjust contract tests under contracts/
- [ ] Add loader/action type guards (+types)
- [ ] Update plan/spec links

Risks & Open Questions
- Risk: behavior changes for existing consumers
- [NEEDS CLARIFICATION: Is server expecting JSON or FormData?]
EOF

info "NOTE: This is a stub. Integrate with your agent runtime to call Context7, Exa/Perplexity, or browser/search MCP tools when available."
