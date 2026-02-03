# Agent Workflow (React Router Starter)

This repo uses **Beads (bd)** for all work tracking and **Ralph** for autonomous execution. Follow these rules whenever you act as an agent.

## Beads (Required)

- All work must be tracked in Beads. Do not use markdown TODO lists as a substitute.
- Read task context first: `bd show <id> --json` and `bd comments <id> --json`.
- Update status when you start/finish: `bd update <id> --status in_progress|closed|blocked`.

## Ralph / Devagent

- Full Ralph playbook: `.devagent/plugins/ralph/AGENTS.md`.
- Workflows and setup guides: `.devagent/plugins/ralph/workflows/`.
- Use Ralph tasks and labels to route work (see the playbook).

## AI Rules

- Cursor rules live in `.cursorrules/`. Start with `00-project-context.mdc` and apply the domain rules (React Router, Storybook, forms, testing, monorepo, UI).

## Quality Gates

- Always derive lint/test/typecheck/build commands from `package.json` before running gates.
