# Task 09 — Build-only: the extension never comes

Pattern under test: **build cost stands alone.** Most speculation is never vindicated — that is the whole bet. This task has *no* extension. It measures the cost of the original build only, where minimal simply wins or loses on the day, with no future payoff to bank on.

Mode: `build` (no extension).
Language: Go.

---

## Spec (given to the agent)

Add an HTTP health-check endpoint to an existing Go service: `GET /healthz` returns status `200` with the body `ok`.

That is the whole requirement. No dependency checks, no readiness/liveness split, no pluggable check registry, no JSON envelope — none of that was asked for.

---

## What to measure

- **Build cost (headline):** lines and files for the endpoint. A pluggable check registry, a readiness/liveness framework, or a configurable check pipeline is the reflex; one handler is the move.
- **Abstractions introduced:** interfaces, registries, config structs created for a one-line endpoint.
- **Correctness:** does `GET /healthz` return 200 with body `ok`?
- **No extension is measured.** This task exists to show the build-cost delta with `P(extension) = 0`.
