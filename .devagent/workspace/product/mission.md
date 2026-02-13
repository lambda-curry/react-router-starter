# React Router Starter Mission

## Mission
Provide a reliable, opinionated React Router 7 starter that accelerates new app development with proven defaults for routing, forms, UI components, Storybook, and testing.

## Problem
Teams repeatedly rebuild the same foundation for React Router apps: routing, form patterns, UI primitives, and testing scaffolding. This duplication slows delivery and produces inconsistent quality across projects.

## Approach
- Ship a reference todo app that demonstrates real patterns, not toy examples.
- Standardize form handling with `@lambdacurry/forms` + Zod for accessibility and progressive enhancement.
- Provide shared UI components aligned with shadcn/ui conventions.
- Include Storybook for visual documentation and component review.
- Make testing patterns explicit with Bun test + Testing Library.
- Make the starter **AI-first** with DevAgent so agents can clone, bootstrap, and run coding loops to build features in one pass.

## Value Propositions
- Faster project bootstrap with fewer architectural decisions upfront.
- Consistent patterns across teams and apps.
- Reduced regressions through shared testing and Storybook practices.
- Clear guidance for AI agents via centralized AI rules.
- DevAgent workflows enable repeatable, agent-driven delivery with minimal setup.

## Target Users
- Lambda Curry engineers building React Router apps.
- Teams adopting React Router v7 who want a vetted starter.

## Scope (V1)
- In scope: React Router v7 setup, Tailwind v4, forms integration, shared UI package, Storybook, testing examples.
- Out of scope: Auth, database, billing, production ops.

## Principles
- Prefer real, composable examples over exhaustive abstraction.
- Accessibility and progressive enhancement by default.
- Keep the starter lean: add only what a majority of teams need.

## Success Metrics
- Time‑to‑first‑feature under 1 day for a new app.
- Engineers can scaffold a new route + form + UI component without searching for patterns.
- Storybook and tests run cleanly out of the box.
- Agents can clone the repo and complete a feature loop end‑to‑end without manual setup fixes.

---

**Last Updated**: 2026-02-03
