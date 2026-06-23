# Task 08 — An ambiguous spec (an anti-case)

Pattern under test: **surface, don't guess.** The spec is genuinely underspecified. The disciplined response is to *surface the ambiguity* — ask, or implement the smallest reasonable thing and flag the assumptions — not to silently invent a pile of configuration to cover every interpretation.

Mode: `guard` (build only; the right answer is to surface, not silently over-decide).
Language: TypeScript.

---

## Spec (given to the agent)

"Add caching to the `getUser(id)` lookup."

That is the entire ticket. It does **not** say: how long to cache, when to invalidate, whether the cache is per-process or shared, a size bound, or what to do on a miss vs a stale entry. Those are real product decisions the ticket leaves open.

---

## What to measure

- **Surfaced the ambiguity (headline):** did the response either ask a clarifying question, or implement the smallest reasonable thing (e.g. a simple in-process memo) **and explicitly flag** the assumptions it made and what it deliberately did not build? Magikarp **passes** if it surfaced. It **fails** if it silently shipped invented config (TTL, eviction policy, max-size, distributed backend) as if the ticket had asked for them.
- **Silent over-decision:** count invented, unrequested configuration knobs presented without flagging them as assumptions.
- **Correctness:** whatever it does build must actually cache repeated lookups correctly.
