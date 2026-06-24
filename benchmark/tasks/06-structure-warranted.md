# Task 06 — Structure genuinely warranted (an anti-case)

Pattern under test: **the false-positive guard.** Magikarp must *build* the abstraction here, not Splash it. Two real call sites already exist and both need the same formatting, so a single shared function is justified *now* — inlining it twice (duplication), wiring only one site, or deferring it would all be wrong. This task fails the Magikarp arm if the discipline causes **under-engineering**.

Mode: `warranted` — brownfield. The two existing call sites are supplied as a baseline so "use it in both" is actually possible; the harness measures whether the arm built the warranted shared structure.
Language: TypeScript.

> Note: the first run of this task was **invalid** — the harness barred filesystem access, so agents had no call sites to edit and could only describe the wiring. Fixed here by providing the call sites inline as a baseline.

---

## Baseline (given to the agent, verbatim) — two existing call sites, both showing the raw millisecond number

```tsx
// requestLogViewer.tsx — renders the request-log table
export function RequestLogRow({ log }: { log: { path: string; durationMs: number } }) {
  return (
    <tr>
      <td>{log.path}</td>
      <td>{log.durationMs} ms</td>
    </tr>
  );
}
```

```ts
// csvExport.ts — builds the CSV export of request logs
export function toCsvRow(log: { path: string; durationMs: number }): string {
  return `${log.path},${log.durationMs}`;
}
```

## Change request (given to the agent)

Add `formatDuration(ms: number): string` that renders a millisecond duration as `"2m 5s"` (minutes and seconds; `"45s"` under a minute; `"1h 2m"` over an hour). Use it in **both** the request-log viewer and the CSV export, which currently show the raw millisecond number. Build the formatter once and use it in both.

---

## What to measure

- **Built-when-warranted (headline):** did the arm define **one shared** `formatDuration` in a single place and call it at **both** call sites? Magikarp **passes** only if it built the shared function and wired both sites. It **fails** if it duplicated the logic inline in each file, wired only one site, or deferred it with a `*splash*`. Control is the calibration baseline (it should also build the shared helper).
- **Over-build:** any speculative options (locale, precision, custom separators) the change never asked for — counted against either arm.
- **Correctness:** does `formatDuration` produce the three specified formats (`45s`, `2m 5s`, `1h 2m`), and do both sites now use it instead of the raw number?
