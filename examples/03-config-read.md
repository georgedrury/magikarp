# An error case that cannot happen yet
*Pattern: a case the spec never mentions — the never-cut boundary*

**The ask** — Read a config file that ships inside the deployed bundle (checked in, always present, always valid JSON) and return its `apiBaseUrl` field.

**The reflex** — what an unconstrained agent adds: handling for failures that cannot occur on the described path.

```ts
export function getApiBaseUrl(): string {
  try {
    const raw = readFileSync(CONFIG_PATH, "utf8");           // can't be missing — it ships in the bundle
    const parsed = ConfigSchema.safeParse(JSON.parse(raw));  // can't be invalid — it's checked in
    if (!parsed.success) return DEFAULT_BASE_URL;            // a fallback for a case that cannot happen
    return parsed.data.apiBaseUrl;
  } catch {
    return retryOrDefault();                                 // retry logic for a local bundled file
  }
}
```

Validation, a missing-file fallback, retry — for a file that is part of the build and cannot be missing or malformed.

**The move** — what Magikarp does instead.

```
Considered: speculative file-error handling — but nothing happened.
```

```ts
// *splash* — no failure handling: this file ships in the bundle and cannot fail;
//            add handling if the source ever becomes one that genuinely can.
export function getApiBaseUrl(): string {
  return JSON.parse(readFileSync(CONFIG_PATH, "utf8")).apiBaseUrl;
}
```

Note what is *not* cut: the field is genuinely read and returned correctly on the real path — that is never dropped. Only the branches for inputs that cannot occur are.

**When it evolves** — the config moves out of the bundle: now fetched from a remote URL at startup, so it can be missing, time out, or return malformed JSON. The failure path is now *real and on the path*, so handling it is now required — a never-cut case, not a speculative one:

```ts
// GYAOOO: evolved — config moved to a remote fetch; failure is now a real path, so handle it
export async function getApiBaseUrl(): Promise<string> {
  try {
    const res = await fetch(CONFIG_URL, { signal: AbortSignal.timeout(3000) });
    return ConfigSchema.parse(await res.json()).apiBaseUrl;
  } catch (err) {
    logger.warn("config fetch failed; using built-in default", err);
    return DEFAULT_BASE_URL;
  }
}
```

The error handling lands exactly when there is genuinely an error to handle — not a turn sooner. That is the line the discipline draws: drop the speculative case, keep the real one.

**Measured** — Benchmark 2026-06-23 (claude-opus-4-8, n=3): the over-engineered build was 29 LOC; Magikarp built 18 LOC. Absorbing the unplanned change cost 51% fewer changed lines (96 → 47). See [../benchmark/results/2026-06-23.md](../benchmark/results/2026-06-23.md).
