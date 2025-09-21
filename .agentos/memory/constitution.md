# Lambda AgentOS Constitution (v0.1)

Articles (non‑negotiables)

I. Simplicity Gate
- Prefer framework primitives; no custom abstractions until repeated ≥3×.

II. Contract‑first
- Define contracts/tests before source code; keep failing tests visible until satisfied.

III. Typed data flow
- Route loaders/actions and components must be typed end‑to‑end; no `any`/`unknown` leaks.

IV. Separation of concerns
- UI never calls DB directly; data access behind services/APIs. (In this repo, mock services only.)

V. Spec traceability
- Every change references a spec path under .agentos/specs; PR template must link it.

VI. Drift control
- If contracts change, regenerate tasks and update plan/spec; do not “patch” code silently.

VII. Review gates
- Pre-flight must pass before implementation; post-flight must pass before merge.

