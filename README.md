# Magikarp

*But nothing happened.*

It only knows one move. So your agent builds only what you asked for — nothing speculative, nothing clever, nothing extra. Magikarp is an always-on behavioural skill that stops coding agents from over-engineering: the axis is **scope, not length** — it doesn't shorten your code, it stops the agent building the abstraction for one caller, the config nobody asked for, the case the spec never mentioned. The one move it makes, it makes correctly and completely.

## Before / after

You ask for a default page size of 25. Your agent writes a `PaginationConfigService`, defines a `PageSizeProvider` interface, layers an env var over a file over a default, and adds an in-memory cache "for later." You asked for a number; you got an architecture.

With Magikarp — *Considered: PaginationConfigService — but nothing happened.*

```ts
// *splash* — single value; promote to config when a second appears
const DEFAULT_PAGE_SIZE = 25
```

One move, done. The upgrade path sits in the comment for the day a second value actually appears — and when [the benchmark](benchmark/results/2026-06-23.md) made that day arrive, the held line absorbed it in **42% fewer changed lines** than the architecture did.

More moves that did nothing — and what the alternative cost — in [examples/](examples/).

## Install (Claude Code)

```
/plugin marketplace add georgedrury/magikarp
/plugin install magikarp
```

The behavioural core loads at session start — active by default, no configuration, no Node dependency. Using another agent? See [Other agents](#other-agents).

## The Splash test

Before building any construct, the agent asks two questions:

1. **Did the spec ask for this?** → no: Splash. Don't build it.
2. **Is this structure for one use?** → yes: inline/hardcode it, and mark the trigger. → no: build it, correctly.

That's the whole discipline. Splash does nothing; doing nothing extra is the point.

## Never cut

Minimal is not missing. Magikarp never removes correctness, input validation at trust boundaries, error handling on the genuine path, security, data integrity, or accessibility. When these conflict with minimalism, they win — every time.

## The markers

Every held decision is marked in the code, with a concrete trigger for when to promote it:

| Decision | Marker |
| --- | --- |
| Held the line (inline / hardcode / drop) | `// *splash* — single value, promote when a second appears` |
| Earned evolve | `// GYAOOO: evolved — third caller landing next sprint` |
| Forced evolve | `// GYAOOOOO: FORCE-EVOLVED — no reason given` |

The louder the cry, the more the line wants a human's eyes. `/magikarp-review` surfaces every `FORCE-EVOLVED` before merge — a forced evolve indicts itself.

## Evolve — the escape hatch is yours

Magikarp never evolves on its own initiative. You pull the hatch:

- **`evolve [reason]`** — build the full structure; the reason flows into the `GYAOOO: evolved` comment.
- **`evolve force`** — build it anyway, no reason required; the `GYAOOOOO: FORCE-EVOLVED` comment is loud on purpose.

## Commands

- **`/magikarp-review`** — name speculative scope and every `FORCE-EVOLVED`; never auto-fixes.
- **`/magikarp-ultra`** — aggressively strip speculative scope from existing code, leaving `*splash*` markers.
- **`/magikarp-evolve-check`** — harvest `*splash*` markers; report which triggers have fired (RIPE / NEEDS-DATA / DORMANT).
- **`/magikarp-help`** — the test, markers, never-cut, and evolve commands, in chat.
- **`/magikarp gyarados`** · **`/magikarp splash`** — suspend / resume the discipline for explicitly architectural work.

## Other agents

The same discipline ports to other tools — copy the relevant file into your project:

- Cursor — [rules/cursor.mdc](rules/cursor.mdc)
- Windsurf — [rules/windsurf.md](rules/windsurf.md)
- Cline — [rules/cline.md](rules/cline.md)
- GitHub Copilot — [rules/copilot-instructions.md](rules/copilot-instructions.md)
- Aider — [rules/aider.md](rules/aider.md)
- Kiro — [rules/kiro.md](rules/kiro.md)

## What Magikarp measures

Most "write less code" tools count the lines they removed. Magikarp counts what you didn't have to unpick later — its headline metric is **extension cost**: how cheaply an unplanned requirement lands once the speculative scaffolding was never built. The axis is scope, not length. See [benchmark/](benchmark/).

## Docs

- [CONCEPT.md](CONCEPT.md) — the why
- [SPEC.md](SPEC.md) — the what: deliverables, command specs, the benchmark rig
