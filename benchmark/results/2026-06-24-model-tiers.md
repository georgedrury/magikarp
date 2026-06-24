# Model-tier benchmark — does the advantage hold below Opus? (2026-06-24)

The headline result ([2026-06-23.md](2026-06-23.md)) was measured on **Opus**, where Magikarp won all five tasks (42–76% fewer extension lines). This run re-ran the same extension-cost suite (control vs Magikarp) on **Sonnet** and **Haiku** to see whether the advantage generalises down the model tiers.

**Method:** identical to the v1 suite — build to spec → absorb a withheld extension → deterministic multiset line-diff. n=3 per cell. **No correctness gate in this run.** Opus figures below are the reference from the prior run.
**Raw data:** [2026-06-24-model-tiers-raw.json](2026-06-24-model-tiers-raw.json)

## Result: the advantage scales with how much the base model over-engineers

| Tier | Magikarp on extension cost | Reading |
|---|---|---|
| **Opus** (ref) | **5 win / 0 tie / 0 loss** (42–76% less) | Opus over-engineers most by default → most to cut |
| **Sonnet** | **2 win / 1 tie / 2 loss** | wins the genuinely sprawl-prone tasks; neutral where Sonnet was already lean |
| **Haiku** | **1 win / 1 tie / 3 loss** (+ 2 degenerate builds) | small model applies the discipline unreliably |

### Sonnet — per task (extension lines, ctrl → mk)

| Task | control | Magikarp | verdict | control build LOC |
|---|--:|--:|---|--:|
| 01-config | 7.3 | 7.3 | tie | **7** |
| 02-utility | 16.3 | 19.7 | loss | 20 |
| 03-error | 50.3 | 41.3 | **win** | 11 |
| 04-badge | 26.3 | 46.0 | loss | 37 |
| 05-payments | 178.7 | 105.3 | **win** | 53 |

The tell is the control build size. On Opus, the config control built **36 LOC** of pagination machinery; on Sonnet it built **7** — Sonnet barely over-engineers config, so there is nothing for Magikarp to cut, and it ties. But where Sonnet *does* sprawl — error handling (50 ext) and the payments architecture (179 ext) — Magikarp still cuts it (41 and 105). **Even within Sonnet, Magikarp wins exactly the tasks where over-engineering actually happens.**

### Haiku — unreliable

Haiku built less under Magikarp on most tasks but the extension cost was noisier and often higher, and it produced **2 degenerate 0-LOC builds** (02-utility) — i.e. it failed to produce a usable minimal implementation at all, then paid to build from nothing at extension. Haiku doesn't follow the discipline (or the harness) reliably enough to draw a conclusion beyond "no consistent advantage, sometimes worse."

## Honest verdict

The discipline is **not** a uniform win across tiers, and we shouldn't claim it is. It pays off **in proportion to the over-engineering present**:

- **Largest** on the most capable, most sprawl-prone tier (Opus) — a clean sweep.
- **Marginal and task-dependent** on a leaner model (Sonnet) — it wins the tasks that genuinely sprawl and ties the rest, never meaningfully hurting on the things it should win.
- **Unreliable** on a small model (Haiku) — which over-engineers less *and* applies instructions less faithfully.

This is a reasonable positioning: Magikarp is most valuable exactly where the over-engineering problem is worst — the capable models people reach for on real work.

## Limitations

- n=3; Sonnet/Haiku verdicts are directional. Haiku's 2 degenerate builds make its numbers partly an artifact of small-model unreliability, not of the discipline.
- No correctness gate in this run (extension cost only) — unlike the diverse suite.
- Opus figures are from a separate run (pre-hardening core); extension cost is scope-based, so the comparison holds, but it is not a single unified run.
