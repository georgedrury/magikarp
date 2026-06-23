# A formatter used once
*Pattern: abstraction for one caller*

**The ask** — On the order-confirmation page, show the order total as US currency (`$1,234.50`). One call site, one locale, one currency.

**The reflex** — what an unconstrained agent reaches for: a general-purpose utility in its own module, exported, parameterized over things no caller asked about.

```tsx
// utils/formatCurrency.ts
export interface FormatCurrencyOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
}

export function formatCurrency(
  amount: number,
  locale: string = "en-US",
  currency: string = "USD",
  options: FormatCurrencyOptions = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: options.showSymbol === false ? "decimal" : "currency",
    currency,
    ...options,
  }).format(amount);
}

// OrderConfirmation.tsx
import { formatCurrency } from "../utils/formatCurrency";
<span>{formatCurrency(order.total)}</span>
```

The `locale`, `currency`, and `options` parameters exist for callers that do not exist.

**The move** — what Magikarp does instead.

```
Considered: a generic formatCurrency module — but nothing happened.
```

```tsx
// OrderConfirmation.tsx
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
// *splash* — inline formatter, promote to a shared helper when a 2nd call site needs a different currency
<span>{usd.format(order.total)}</span>
```

One literal, one call site, no module, no exported surface.

**When it evolves** — months later the invoice email needs the same total, and it bills in EUR and GBP too. The marker's trigger has now genuinely fired: a second caller exists *and* it widens the requirement past a single currency. So the helper has to grow — not because the inline version was wrong, but because the shape it was guarding against finally arrived.

```tsx
// money.ts
// GYAOOO: evolved — 2nd caller (invoice email) added + needs EUR/GBP, so currency becomes a real param
export const formatMoney = (amount: number, currency: "USD" | "EUR" | "GBP" = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
```

Be honest: the second caller both arrives *and* widens the requirement, so even the right helper grows. This is not a clean win — just a cheaper one, because you grow from a working line instead of paying for a `locale`/`options` surface no one ever used.

**Measured** — Benchmark 2026-06-23 (claude-opus-4-8, n=3): the over-engineered build was 34 LOC across 2 files; Magikarp built 22 LOC in 1 file. Absorbing the unplanned change cost 34% fewer changed lines (54 → 36). See [../benchmark/results/2026-06-23.md](../benchmark/results/2026-06-23.md).
