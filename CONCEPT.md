# Magikarp

*But nothing happened.*

It only knows one move. So your agent builds only what you asked for — nothing speculative, nothing clever, nothing extra.

---

## The problem

You ask for a default page size of 25. Your agent writes a `PaginationConfigService`, defines a `PageSizeProvider` interface, layers environment variables over a file over a default, adds an in-memory cache "for later", and introduces a typed config schema. You asked for a number. You got an architecture.

This is the over-engineering reflex, and agents have it badly: abstractions for a single use, configuration nobody requested, handling for cases the spec never mentioned, design patterns applied to a one-off. Every speculative piece is a guess about the future, and most guesses are wrong — which is why they cost more to unpick later than they ever saved.

Magikarp doesn't shorten the code your agent writes — it stops the agent building the thing in the first place. The axis is **scope, not length**: speculative abstraction, configuration nobody asked for, cleverness applied to a one-off. The least code is the code that was never justified.

## The Splash test

Magikarp knows one move. Before building anything, it asks two questions:

```
1. Did the spec ask for this?       → no:  Splash. Don't build it.
2. Is this structure for one use?    → yes: inline/hardcode it, and mark the trigger.
                                     → no:  build it — correctly and completely.
```

That's the whole discipline. Splash does nothing, and doing nothing extra is the point.

The two questions catch the same handful of reflexes every time. You'll recognise them:

- **Abstraction for one caller** — an interface, factory, or provider with a single implementation. Inline it.
- **Config nobody asked for** — a setting with one current value. Hardcode it.
- **Cases the spec never mentioned** — speculative branches for inputs that can't occur on the described path. Drop them. *(Not to be confused with error handling on the path the code is genuinely on — that's never cut. See below.)*
- **"While I'm here"** — a change outside the stated task. Stop, and name it as a separate task.

These aren't extra steps — they're what question 1 and question 2 look like in the wild.

## Splash, not slop

What gets cut: speculative scope, premature abstraction, unrequested configuration, cleverness.

What is **never** cut:

- Correctness on the actual task
- Input validation at trust boundaries
- Error handling on the path the code is genuinely on
- Security — authentication, authorisation, injection, secrets handling
- Data integrity — no silent data loss, no unchecked destructive operations
- Accessibility on any UI output

The one move it makes, it makes correctly and completely. **Minimal is not the same as missing.**

When the spec is genuinely ambiguous about whether something is in scope, Magikarp **surfaces the choice** — it does not silently build *or* silently drop. A quiet omission can surprise you as much as a quiet over-build.

When the codebase already has an established pattern, **consistency wins**: if there's already a config service, the page size goes through it. Minimalism defers to the conventions already in the code — it doesn't fight them.

## The comment convention

When Magikarp inlines, hardcodes, or drops something a reader would reasonably have expected to see built, it marks the decision at that point — not a vague TODO, a trigger:

```js
// *splash* — single value, promote to config when a second appears
const DEFAULT_PAGE_SIZE = 25
```

The upgrade path lives in the code, never in someone's head.

No comment on every literal — only where Magikarp resisted a real pull. The marker is a signal, not noise. The asterisks are load-bearing: bare `splash` collides with real code (CSS, animation classes, UI copy), so `*splash*` stays the distinctive, greppable token.

And the marker is not silent. Whenever Magikarp holds the line, it says so — `Considered: <what> — but nothing happened.` The move ran, the speculative build was evaluated and declined, and the world was left unchanged. The chat line announces the restraint; the `*splash*` comment records it. Making the non-event visible is the point — a quiet omission surprises you as much as a quiet over-build.

## Evolving into Gyarados

Magikarp evolves only when reality earns it, never on a guess. The passive trigger is the one written into the `*splash*` comment — a genuine second call site, a real second config value, a measured hot path. When it fires, the constraint has done its job: build the full structure cleanly.

Sometimes you know the abstraction is earned before the code does. **The escape hatch is yours, not the agent's** — Magikarp can never talk itself into evolving.

**`evolve [reason]`** — the disciplined path. The justification flows into the audit comment:

```js
// GYAOOO: evolved — third caller landing next sprint
class PageSizeProvider { … }
```

**`evolve force`** — the pressure-release valve. No reason required, but never silent:

```js
// GYAOOOOO: FORCE-EVOLVED — no reason given
class PageSizeProvider { … }
```

The vowel count *is* the volume: feeble flop → growl → roar, tracking exactly how much the line wants a human's eyes. The cry is flavour; the uppercase phrase is the contract. If `FORCE-EVOLVED` survives to review, it indicts itself — `/magikarp-review` surfaces every one before merge.

### The markers, fixed and exact

| Decision | Marker | Review greps |
| --- | --- | --- |
| Held the line (inline / hardcode / drop) | `// *splash* — …` | `*splash*` |
| Earned evolve | `// GYAOOO: evolved — …` | `evolved` |
| Forced evolve | `// GYAOOOOO: FORCE-EVOLVED — …` | `FORCE-EVOLVED` |

`FORCE-EVOLVED` is the grep anchor for the override, independent of the cry — even a fat-fingered `GYAOOOOO` is still caught. The override is always allowed; it is never invisible. What Magikarp never does is pull the hatch on your behalf.
