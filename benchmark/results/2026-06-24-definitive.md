# Magikarp benchmark — definitive unified run (2026-06-24)

This is the airtight version of the extension-cost headline, and it **supersedes** the earlier per-run figures ([2026-06-23.md](2026-06-23.md), [2026-06-24-model-tiers.md](2026-06-24-model-tiers.md)) for that claim: one unified run, the same hardened core throughout, **n=6**, a **correctness gate on every build**, and full distributions (mean / median / range). The v2 falsification suite ([2026-06-23-v2-diverse.md](2026-06-23-v2-diverse.md)) remains the separate qualitative study (anti-cases, never-cut, languages).

**Setup:** 5 extension-cost tasks × {Opus, Sonnet, Haiku} × {control, Magikarp} × n=6 = 180 cells (532 agents). Build → absorb a withheld extension → deterministic multiset line-diff. An independent judge scores correctness of the *extended* result; the judge runs on the cell's own model (Haiku judged by Sonnet). Builds under 3 LOC are flagged degenerate and excluded.
**Raw data:** [2026-06-24-definitive.json](2026-06-24-definitive.json)

## Headline — Opus (the capable tier)

| Task | extension: control → Magikarp | reduction | build LOC | correctness |
|---|--|--:|--|--|
| 01-config | 40 → 23 | **42%** | 32 → 16 | 100% → 83% |
| 02-utility | 48 → 45 | 6% (tie) | 34 → 26 | 67% → 100% |
| 03-error | 89 → 61 | **32%** | 39 → 26 | 100% → 100% |
| 04-badge | 105 → 52 | **50%** | 86 → 49 | 100% → 83% |
| 05-payments | 486 → 211 | **57%** | 274 → 68 | 67% → 100% |

**Magikarp wins extension on 4/5 (one tie), builds less on all 5, and is more correct on average (93% vs 87%).** The biggest gaps are the worst over-engineering: on payments the control built a 274-LOC / 7.7-file provider architecture and paid 486 lines to add a second processor; Magikarp built 68 LOC and paid 211. Variance is tight (05 Magikarp extension ranged 121–269), so this is not outlier-driven.

## Below Opus — the signal degrades (stated honestly)

| Tier | extension W / T / L | avg correctness (ctrl / mk) | reading |
|---|---|---|---|
| **Opus** | **4 / 1 / 0** | 87% / 93% | robust win |
| **Sonnet** | 2 / 0 / 3 | 60% / 73% | mixed — wins only where it sprawls |
| **Haiku** | 2 / 1 / 2 (+4 degenerate) | 50% / 47% | unreliable |

- **Sonnet** wins exactly the sprawl-prone tasks (error-handling +12%, payments +30%) and **loses** the already-lean ones (badge −122%, utility −71%): where Sonnet wasn't going to over-build, Magikarp's minimal version can cost *more* to extend. That is a real negative, reported as such. Correctness still improves under Magikarp (73% vs 60%).
- **Haiku** is below the floor: 4 degenerate (empty) builds, ~50% correctness in *both* arms, and wild variance (one utility build extended by 352 lines; mean 78 vs median 24). No dependable signal — small-model unreliability, not a Magikarp effect.

## What holds up

1. **On the capable tier the claim is robust:** Magikarp cuts build size on every task and extension cost on 4/5 (6–57%), with correctness held or improved — at n=6, tight variance, behind a correctness gate.
2. **It never trades correctness for brevity:** on every model the Magikarp arm is as correct or more correct on average (Opus 93/87, Sonnet 73/60, Haiku 47/50≈).
3. **The benefit tracks the disease:** it shows up where over-engineering actually happens (capable, sprawl-prone models) and fades where the base model is already lean or too small to be reliable.

## Honest limitations

- **Sonnet loses extension cost on 3/5 tasks.** The payoff is not guaranteed on leaner models — it helps on tasks that genuinely sprawl and can cost more on those that don't.
- Correctness on Sonnet/Haiku is low for **both** arms (a model-capability floor), so their extension-cost comparison is partly between imperfect builds — weight the Opus result accordingly.
- n=6; one run per cell; correctness is LLM-judged (judge = the cell's model; Haiku judged by Sonnet). Build/extension metrics are deterministic.

## Takeaway

Magikarp is a tool for the models people actually run for serious agentic coding (Opus-class), where it reliably cuts both the code written and the cost of the next change without hurting correctness. On smaller models the benefit is mixed and the models themselves are less reliable — position accordingly.
