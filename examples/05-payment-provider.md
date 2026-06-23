# The abstraction you think you need
*Pattern: the honesty case — when speculation should win*

**The ask** — Charge a card: a `charge(amountCents, currency, source)` function returning `{ ok, transactionId, error }`. The spec names one processor, and only that processor.

**The reflex** — what an unconstrained agent builds:

```typescript
// payment/provider.ts
export interface PaymentProvider {
  charge(amountCents: number, currency: string, source: string): Promise<ChargeResult>;
}
// payment/registry.ts
const registry = new Map<string, () => PaymentProvider>();
export function register(name: string, make: () => PaymentProvider) { registry.set(name, make); }
// payment/factory.ts
export function getProvider(cfg: PaymentConfig): PaymentProvider {
  const make = registry.get(cfg.providerName);
  if (!make) throw new Error(`unknown provider: ${cfg.providerName}`);
  return make();
}
// payment/config.ts — PaymentConfig type + loader
// payment/providers/primary.ts — the one real implementation
// index wires registry → factory → config → provider
```

A multi-file architecture for one processor: interface, registry, factory, config layer, a per-provider module — for a single caller.

**The move** — what Magikarp does instead:

```typescript
Considered: a PaymentProvider abstraction — but nothing happened.

// payment.ts
export async function charge(amountCents: number, currency: string, source: string) {
  // *splash* — held to one direct function; promote to an interface only when a second processor lands, routed by config
  const res = await client.charges.create({ amount: amountCents, currency, source });
  return res.ok
    ? { ok: true, transactionId: res.id }
    : { ok: false, error: res.failureMessage };
}
```

**When it evolves** — a real second processor arrives, routed by merchant config, with more on the roadmap. The marker's trigger has fired, so the held line grows cleanly:

```typescript
// GYAOOO: evolved — second processor + config routing landed; the *splash* trigger fired, so promote now
export interface Processor {
  charge(amountCents: number, currency: string, source: string): Promise<ChargeResult>;
}
function pick(cfg: MerchantConfig): Processor { /* primary | secondary, by cfg.processor */ }
```

Be honest: this is the case engineered to make speculation win. The withheld requirement — a second processor — is *exactly* what an abstraction anticipates. And it still lost. The unconstrained build wasn't a tidy interface waiting to pay off; it was sprawl across six files, so absorbing the new processor meant unpicking a registry and factory that never earned their keep. Caveat: a *deliberately minimal* provider interface might genuinely have fared better here than Magikarp's single function. The lesson is narrow — the real over-engineering reflex produces the wrong shape (a framework), not that abstraction can never pay off.

**Measured** — Benchmark 2026-06-23 (claude-opus-4-8, n=3): the over-engineered build was 423 LOC across 6 files; Magikarp built 70 LOC in 1 file. Absorbing the unplanned change cost 76% fewer changed lines (740 → 180). See [../benchmark/results/2026-06-23.md](../benchmark/results/2026-06-23.md).
