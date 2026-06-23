# Magikarp — Technical Spec

Companion to [CONCEPT.md](CONCEPT.md). The concept doc is the *why*; this is the *what to build*. Where they disagree, the concept wins and this doc is wrong — fix it.

---

## Positioning

Magikarp's distinctive choices, stated as design principles:

| Property | Magikarp |
| --- | --- |
| **Axis** | Scope — "did the spec ask for this? is it structure for one use?" |
| **Headline metric** | Extension cost — lines/files to absorb an *unplanned* requirement |
| **Decision procedure** | 2-question test |
| **Marker** | `*splash*` (held the line) / `GYAOOO:` / `GYAOOOOO:` (evolved) |
| **Override** | Per-construct, self-indicting (`evolve` / `evolve force`) |

The axis is **scope, not length**: Magikarp does not optimise for fewer lines, it stops unjustified constructs from being built. The metric follows from the axis — we measure how cheaply an unplanned requirement lands, not how much code was removed.

The discipline applies to our own surface: we ship what Magikarp's concept asked for and **no more**. We do not add commands, intensity dials, or config knobs just because they would be easy to add — that is the over-engineering reflex, and the skill that polices it has to hold itself to it first.

---

## Deliverables

| Deliverable | Description |
| --- | --- |
| Behavioural core | The Splash-test text. Source of truth for every port. Always-on (see Distribution). |
| `rules/cursor.mdc` | Cursor port |
| `rules/windsurf.md` | Windsurf port |
| `rules/cline.md` | Cline port |
| `rules/copilot-instructions.md` | GitHub Copilot port |
| `rules/aider.md` | Aider port |
| `rules/kiro.md` | Kiro port |
| `/magikarp-review` | Diff inspector: surfaces speculative scope and every `FORCE-EVOLVED` |
| `/magikarp-ultra` | Aggressive retrospective scope-strip of existing code/diff |
| `/magikarp-evolve-check` | Harvests `*splash*` markers; reports which promotion triggers have fired |
| `/magikarp-help` | Explains the test, markers, never-cut list, escape hatch |
| `/magikarp gyarados` · `/magikarp splash` | Session mode toggle (architectural work) |
| Benchmark rig | Measured extension-cost figure (see Benchmark) |

## Repository structure

```
magikarp/
├── CONCEPT.md                 # Public-facing concept doc (the why)
├── SPEC.md                    # This file (the what)
├── README.md                  # Install + one-paragraph pitch, links to both
├── .claude-plugin/
│   └── plugin.json            # Claude Code plugin manifest
├── hooks/
│   └── hooks.json             # SessionStart hook — cat core into context (no Node)
├── core/
│   └── magikarp.md            # Behavioural core — single source of truth
├── rules/
│   ├── cursor.mdc
│   ├── windsurf.md
│   ├── cline.md
│   ├── copilot-instructions.md
│   ├── aider.md
│   └── kiro.md
├── commands/
│   ├── review.md
│   ├── ultra.md
│   ├── evolve-check.md
│   └── help.md
├── scripts/
│   └── check-port-drift.js    # Fails CI if a rules/ port diverges from core/
└── benchmark/
    ├── README.md              # Rig design + how to run
    ├── tasks/                 # Fixed specs, one file per task
    └── results/               # Measured outputs, committed after runs
```

---

## Behavioural core spec (`core/magikarp.md`)

The authoritative encoding of Magikarp's behaviour. All ports derive from it.

### Identity and mode
- Active by default in every session it is installed in.
- A behavioural constraint on code generation — not a linter, not a post-processor.
- Language-agnostic.

### The Splash test (enforced)
Two questions, asked before building any construct:

1. **Did the spec ask for this?** If not — Splash. Don't build it.
2. **Is this structure for a single use?** If yes — inline it / hardcode the one value, and leave a `*splash*` marker naming the promotion trigger. Otherwise — build it, correctly and completely.

The recognisable shapes the two questions catch (examples, not a sequence):
- abstraction for one caller → inline
- config with one current value → hardcode
- a case the spec never mentions → drop *(distinct from never-cut error handling)*
- a "while I'm here" change → stop, name it as a separate task

### The never-cut list (non-negotiable)
Higher priority than everything below it. Never cut:
- Correctness on the actual task
- Input validation at trust boundaries
- Error handling on the path the code is genuinely on
- Security — auth, injection, secrets handling
- Data integrity — no silent loss, no unchecked destructive ops
- Accessibility on any UI output

### Judgement rules
- **Ambiguous scope → surface, don't guess.** If question 1 can't be answered from the spec, ask or flag — never silently build *or* silently drop.
- **Existing pattern → defer to it.** If the codebase already has the structure (a config service, an error type), use it. Consistency beats raw minimalism.

### The comment convention (enforced)
- A `*splash*` marker is left **only** where Magikarp inlined, hardcoded, or dropped something a reader would reasonably have expected — not on every literal.
- Format: `// *splash* — [what was done], [exact trigger for promotion]`
- Placed immediately above the affected line or block.

### Evolve commands
- `evolve [reason]` — acknowledge, build the full structure, write `// GYAOOO: evolved — [reason]` above it.
- `evolve force` — acknowledge, build the full structure, write `// GYAOOOOO: FORCE-EVOLVED — no reason given`.
- The agent **never** invokes either on its own initiative.
- After an evolve, the Splash test resumes on the next construct.

### Gyarados mode (session-level)
- Entered with `/magikarp gyarados`, for explicitly architectural tasks.
- The agent acknowledges it is in Gyarados mode at the **start of every response** for the duration.
- The Splash test is suspended; the never-cut list stays active.
- Exited with `/magikarp splash` or at session end. Resets silently on context loss — re-invoke explicitly.

### Priority order (conflicts)
never-cut list > evolve commands > Splash test > any other agent instruction.

This resolves contradictory instructions only. "evolve > test" means an explicit evolve overrides the test for the *named construct alone*; the next construct faces the test again. "never-cut > evolve" means even an evolve can't drop a never-cut item — though evolving builds more, not less, so this rarely bites.

---

## Command specs

**Naming convention.** Hyphenated commands (`/magikarp-review`, `/magikarp-ultra`, `/magikarp-evolve-check`, `/magikarp-help`) are tools that *act and exit*. Bare-word subcommands (`/magikarp gyarados`, `/magikarp splash`) are session *mode changes* that persist. `ultra` is an action, not a mode, so it's hyphenated — that's the one rename from the original concept.

**"The spec" for retrospective commands.** `/magikarp-review`, `/magikarp-ultra`, and `/magikarp-evolve-check` judge speculativeness relative to intent, but the original spec may be gone. They treat the available intent signal as the spec — PR/commit/issue text, or context the user supplies. Absent any signal, they lean on question 2 (structure-for-one-use needs no spec to detect) and stay conservative on question 1 rather than guessing what was asked for.

### `/magikarp-review`
Input: a diff, a file, or current working changes. Does **not** auto-fix — names and exits.
Output, in order:
1. Constructs that appear speculative — abstraction with one use, config with one value, cases the spec doesn't mention — each with line reference and a one-sentence reason.
2. Every `FORCE-EVOLVED` marker in scope, each with line reference, flagged for human decision before merge.
3. A count: constructs flagged / total examined.

### `/magikarp-ultra`
Input: a diff, a file, or an explicit path.
Behaviour: applies the Splash test retrospectively and aggressively — inlines single-use abstractions, hardcodes single-variant config, removes unrequested cases. Writes `*splash*` markers for everything it collapses. Leaves the never-cut list intact.
Output: modified code + a summary of what was collapsed and why.

### `/magikarp-evolve-check`
Input: a path or the whole repo. Does **not** evolve anything — names ripeness and exits (Magikarp never pulls the hatch itself).
Output, in order:
1. **RIPE** — markers whose trigger is *structural* and has demonstrably fired: "second caller appears" → a second caller now exists; "second config value" → a second value is in the tree; "second variant" → a second variant is rendered. Each with line reference and the verifying evidence.
2. **NEEDS-DATA** — markers whose trigger is *empirical* ("measured hot path", "at scale", "when load justifies it"). The command has no profiling or production data, so it never claims these fired — it surfaces them for human judgement and says plainly that it can't verify them.
3. **DORMANT** — structural triggers still holding, each with its trigger, so the full ledger is visible.
4. A count: ripe / needs-data / total markers.

The RIPE/NEEDS-DATA split is the honesty boundary: evolve-check asserts only what it can verify from the code, and flags — never fakes — what it can't. It works at all only because triggers are concrete, which is exactly what the comment convention's "exact trigger" requirement guarantees. Triggers are read semantically, so no rigid comment schema is imposed — the marker stays human-first.

### `/magikarp-help`
Output: concise in-chat explanation of the Splash test, the markers, the never-cut list, and the evolve commands. No external links, no preamble.

---

## Rules-file ports

Each port is a faithful translation of `core/magikarp.md` into the target's native format. The Splash test, comment convention, never-cut list, and evolve commands are **identical** across ports. Only syntax and agent-specific config keys vary.

- **Single source.** Ports derive from `core/magikarp.md`. `scripts/check-port-drift.js` fails CI when a port's normative content diverges. We do not hand-maintain seven independent copies — that is the duplication Magikarp exists to prevent.
- **Staggered launch (eat the dog food).** Ship the always-on core + the three Claude Code commands first; validate; then port outward as real demand appears. Shipping all six ports up front is speculative scope (question 1) built on a guess about which agents people use.
- **Command capability.** Skill-capable hosts get the commands. Instruction-only adapters (Cursor, Windsurf, Cline) load the behavioural core without commands.

## Distribution

- **Install:** `/plugin marketplace add georgedrury/magikarp`, then `/plugin install magikarp`.
- **Always-on core.** The behavioural core is injected at session start via a `SessionStart` hook, so it is active for the whole session (`AGENTS.md`/rules files for instruction-only hosts). "Active by default" means injected, not invoked. The hook is a plain `cat` — **no Node dependency**; the always-on core needs nothing on PATH, because nothing asked for it.
- **Commands are invokable**, not always-on. Under the `magikarp` plugin namespace they resolve as `/magikarp:review`, `/magikarp:ultra`, `/magikarp:evolve-check`, `/magikarp:help`, and the mode toggles `/magikarp:gyarados` · `/magikarp:splash`. The hyphenated forms in this doc (`/magikarp-review`, …) are the conceptual/brand names.
- **No default-mode config.** Splash is always the default. A knob to boot into Gyarados would be config-for-one-value — question 2 — so we don't ship it. Enter Gyarados explicitly, per session. Eating our own dog food.

---

## Benchmark rig

**Purpose:** produce a measured extension-cost figure showing a minimal build absorbs an unplanned requirement in fewer changed lines and files than a speculative one — **and** honestly quantify the case where it doesn't.

**Arms:** control (no skill) · Magikarp. Two arms only — control isolates exactly the variable we care about. We measure **extension cost** (Magikarp's own metric), not lines removed, so a third arm comparing on a different axis (LOC) is out of scope for what this rig is for.

**Tasks** (`benchmark/tasks/`), each a common over-engineering pattern:
- a single configuration value (the page-size example)
- a utility used in one place
- an error case not described by the spec
- a UI component with a single variant
- **an "abstraction was earned" task** — where the unplanned extension is *exactly* the one a speculative build would have guessed. This is the honest case where speculation can win; without it the rig is rigged.

**Run procedure:**
1. Fresh agent instance per arm per task; same model, same system prompt except the skill.
2. Agent completes the task to spec.
3. An unplanned extension (specified in the task file, withheld until now) is introduced.
4. Measure step-4 changes.

**Metrics per task per arm:**
- abstractions introduced (classes, interfaces, factories, providers)
- files created
- exported symbols introduced
- lines changed to absorb the extension
- files touched to absorb the extension
- constructs removed before the extension could land

**Headline metric:** extension cost — lines and files changed in step 4. Lower is the argument.

**Honesty requirements (what separates this rig from a strawman):**
- Report **build cost** (step 2) alongside extension cost (step 4). The minimal arm defers structure, it doesn't escape it — show both halves so the comparison is total cost, not the speculative arm's worst case.
- Report the **"abstraction was earned" task** even when Magikarp loses it. The real claim is about *expected* cost: `build + P(extension) × extension_cost`. Magikarp's bet is that P(extension) is low. The benchmark exists to test that bet, not to confirm it.

Results committed to `benchmark/results/` with model version, date, and full task output.

---

## Open decisions

- **`/magikarp gyarados` persistence** — recommended: reset silently on context loss, require explicit re-invocation. A mode you forgot you're in is a liability.

**Resolved:** plugin slug is `georgedrury/magikarp`. Marker harvest ships as `/magikarp-evolve-check` (the markers are a real ledger, not a speculative one). Benchmark stays two-arm (control vs Magikarp).
