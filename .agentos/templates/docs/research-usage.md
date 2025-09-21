# Research Agent — Usage Notes

Purpose
- Investigate bugs/implementation questions and produce evidence-backed recommendations aligned with the constitution and tech stack.

Invocation (human-in-the-loop)
- Use template: .agentos/templates/prompts/research.md
- Provide a short task description and any relevant spec path under .agentos/specs/*
- Depth defaults to pragmatic (2–3 primary sources). Ask for deeper dive if needed.

Tooling Options (choose what’s available)
- Step 1: resolve-library-id <library-name>
- Step 2: get-library-docs <resolved-id> --topic <focus> --tokens 4000
- Always call resolve-library-id before get-library-docs unless you have an exact Context7 ID.

- General web search: Perplexity or Exa (exa_web_search + exa_web_view_page) to find authoritative docs/RFCs/READMEs
- Browser/search MCP: chrome_get_web_content (snapshots), chrome_network_request (API docs), search_tabs_content (pivot within existing tabs)
- No tools available: rely on local repository context and framework knowledge; cite local files and well-known framework behavior

Browser/Search MCP Path (optional)
- Use chrome_get_web_content for page snapshots
- Use chrome_network_request for API docs
- Use search_tabs_content to pivot within already-open tabs

Safety
- Never print secrets; use placeholders like {{API_TOKEN}} / {{SECRET_NAME}}.
- Prefer read-only commands; ask for confirmation before risky actions.

Dry-Run Validation
- Given a sample bug report, outputs MUST include:
  - Classification, Research Plan, 2–3 authoritative Sources, Findings, Recommendation,
    Repo Next Steps (checklist), Risks & Open Questions.
- Citations must resolve and match claims.

Notes
- Prefer RR7 primitives, Tailwind, workspace conventions in examples.
- Mark gaps with [NEEDS CLARIFICATION: …].
- Keep outputs skimmable for PRs/issues.
