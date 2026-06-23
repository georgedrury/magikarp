---
description: Aggressively strip speculative scope from existing code or a diff, leaving *splash* markers. Inlines single-use abstractions, hardcodes single-variant config, removes unrequested cases — never touches the never-cut list.
---

You are running `/magikarp-ultra`. Apply the Splash test retrospectively and aggressively to code that already exists. Magikarp normally stops over-engineering before it is written; ultra is the cleanup pass for code that was written without it.

## Input

Take exactly one of, in this order of preference:

1. An explicit path or paths the user named.
2. A diff the user supplied or pasted.
3. The current working changes, if nothing was named.

This is a retrospective command, so the original spec may be gone. Treat the available **intent signal** as the spec — PR text, commit messages, issue text, or whatever context the user supplies. Absent any signal, lean on question 2 (structure-for-one-use needs no spec to detect) and stay **conservative on question 1** rather than guessing what was asked for. Do not invent a spec; do not strip a construct on the assumption it was unrequested when you cannot tell.

## What to do

Walk the code and apply the Splash test to every construct. Collapse what fails it:

- **Abstraction with one caller** — an interface, factory, wrapper, or provider with a single implementation. Inline it at the call site.
- **Config with one current value** — a setting, flag, or env layer with one value in the tree. Hardcode the value.
- **A case the spec never mentions** — a speculative branch for input that cannot occur on the path the code is genuinely on. Remove it.

For everything you collapse, write a `*splash*` marker at the point of the decision, immediately above the affected line or block:

```js
// *splash* — inlined single-use provider, promote when a second caller appears
```

Format: `// *splash* — [what you collapsed], [the exact, checkable trigger that would promote it back]`. Name a concrete trigger ("a second caller", "a second config value", "a second variant") — never a vague one. The asterisks are part of the token: write `*splash*`, not `splash`.

## Constraints

- **Leave the never-cut list intact.** Never strip: correctness on the actual task; input validation at trust boundaries; error handling on the genuine path; security (auth, authorisation, injection defence, secrets handling); data integrity (no silent data loss, no unchecked destructive operations); accessibility on any UI. When minimalism conflicts with any of these, they win — every time.
- **Defer to existing patterns.** If the codebase already routes everything through a config service or a shared error type, do not hardcode against the grain — consistency with the surrounding code beats raw minimalism.
- **Never evolve on your own initiative.** Ultra only collapses scope. It does not build structure, and it does not write `GYAOOO: evolved` or `GYAOOOOO: FORCE-EVOLVED` markers — those belong to the user's escape hatch alone.
- **Leave existing evolve markers alone.** If a construct already carries a `GYAOOO: evolved` or `GYAOOOOO: FORCE-EVOLVED` marker, the user evolved it deliberately. Do not collapse it.

Unlike `/magikarp-review` and `/magikarp-evolve-check`, which name and exit, ultra **does modify the code**. Apply the edits.

## Output

In order:

1. The modified code, with every collapsed construct carrying its `*splash*` marker.
2. A summary of what was collapsed and why — one line per construct, naming the Splash-test reason it failed.
