# A single config value
*Pattern: config nobody asked for*

**The ask** — Add pagination to the product-list endpoint with a default page size of `25`. No overrides, no per-environment behaviour, no caller-supplied size requested.

**The reflex** — what an unconstrained agent reaches for: a configuration system around a single number.

```ts
// config/PaginationConfig.ts
export interface PageSizeProvider { getPageSize(): number; }

export class PaginationConfigService implements PageSizeProvider {
  private cache?: number;
  constructor(private env = process.env, private file = loadConfigFile()) {}
  getPageSize(): number {
    if (this.cache != null) return this.cache;                  // "for later"
    const raw = this.env.PAGE_SIZE ?? this.file.pageSize ?? 25;  // env over file over default
    return (this.cache = PageSizeSchema.parse(Number(raw)));
  }
}
```

A service, an interface, a three-layer override, a cache, a schema — to hold the number `25`.

**The move** — what Magikarp does instead.

```
Considered: PaginationConfigService — but nothing happened.
```

```ts
// products.ts
// *splash* — single value; promote to config when a second page size appears
const DEFAULT_PAGE_SIZE = 25;
return products.slice(0, DEFAULT_PAGE_SIZE);
```

One constant, at the call site. The override path lives in the comment, not in an architecture.

**When it evolves** — marketing wants `50` on `/featured`, `25` everywhere else. A second value has genuinely appeared — exactly the trigger the marker named. So it grows, by one parameter:

```ts
// GYAOOO: evolved — a second page size (50 on /featured) appeared; the *splash* trigger fired
const DEFAULT_PAGE_SIZE = 25;
const FEATURED_PAGE_SIZE = 50;
// each route passes the size it needs
```

No service, no schema — two named constants and a parameter, introduced the day the second value was real.

**Measured** — Benchmark 2026-06-23 (claude-opus-4-8, n=3): the over-engineered build was 36 LOC in 1 file; Magikarp built 19 LOC. Absorbing the unplanned change cost 42% fewer changed lines (37 → 21). See [../benchmark/results/2026-06-23.md](../benchmark/results/2026-06-23.md).
