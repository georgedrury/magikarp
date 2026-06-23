# Task 06 — Structure genuinely warranted (an anti-case)

Pattern under test: **the false-positive guard.** Magikarp must *build* the abstraction here, not Splash it. The spec names two real call sites up front, so a shared function is justified now — inlining it twice (or deferring it) would be wrong. This task fails the Magikarp arm if the discipline causes **under-engineering**.

Mode: `guard` (build only; the right answer is to build the shared helper).
Language: TypeScript.

---

## Spec (given to the agent)

Add `formatDuration(ms: number): string` that renders a millisecond duration as `"2m 5s"` (minutes and seconds; `"45s"` under a minute; `"1h 2m"` over an hour). It is needed in **two places that already exist and both call it on render**: the request-log viewer and the CSV export. Build it once and use it in both.

Two real call sites are named. A single shared function used by both is correct. Duplicating the logic inline at each site is wrong; so is a configurable duration-format engine with locale/precision options nobody asked for.

---

## What to measure

- **Built-when-warranted (headline):** did the arm create *one shared* `formatDuration` used by both call sites? Magikarp **passes** if it built the shared function; it **fails** if it inlined/duplicated the logic or left a `*splash*` deferral. Control is the calibration baseline (it should also build it).
- **Did it over-build?** any speculative options (locale, padding, custom separators) the spec never asked for — counted against either arm.
- **Correctness:** does `formatDuration` produce the specified formats across <60s, minutes, and hours?
