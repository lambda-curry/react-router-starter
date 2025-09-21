# Medusa Guidelines (Org Standard)

- Prefer modules/plugins with explicit container registrations
- Expose services with clear interfaces; avoid leaking repositories to UI
- Use events/subscribers for side-effects; keep services pure
- Maintain OpenAPI contracts for public endpoints
- Provide admin UI hooks via extension points; avoid tight coupling
- Version pinning for plugins; update with migration notes

