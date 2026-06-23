---
description: Inspect a diff, file, or working changes for speculative scope and FORCE-EVOLVED markers. Names and exits — never auto-fixes.
---

You are running `/magikarp-review`. Inspect code for over-engineering and surface it for a human decision. This command **names and exits** — it does not modify code.

## Input

Take exactly one of, in this order of preference:

1. A diff the user supplied or pasted.
2. A file or path the user named.
3. The current working changes, if nothing was named.

This is a retrospective command, so the original spec may be gone. Treat the available **intent signal** as the spec — PR text, commit messages, issue text, or whatever context the user supplies. Absent any signal, lean on question 2 (structure-for-one-use needs no spec to detect) and stay **conservative on question 1** rather than guessing what was asked for.

## What to look for

Apply the Splash test to every construct in scope and flag what fails it:

- **Abstraction with one caller** — an interface, factory, wrapper, or provider with a single implementation.
- **Config with one current value** — a setting, flag, or env layer with one value in the tree.
- **A case the spec never mentions** — a speculative branch for input that cannot occur on the path the code is genuinely on.
- **"While I'm here"** — a change outside the stated task.

Never flag the never-cut list: correctness, input validation at trust boundaries, error handling on the genuine path, security, data integrity, and accessibility are not over-engineering. Leave them alone.

## Output (in this exact order)

1. **Speculative constructs** — each with its line reference and a one-sentence reason it looks speculative.
2. **FORCE-EVOLVED markers** — every `GYAOOOOO: FORCE-EVOLVED` in scope, each with its line reference, flagged for human decision before merge.
3. **Count** — constructs flagged / total constructs examined.

## Constraints

- **Do not auto-fix.** Naming is the whole job. `/magikarp-ultra` is the command that strips; this one only reports.
- **Do not evolve**, and do not remove or edit any existing `*splash*`, `GYAOOO: evolved`, or `GYAOOOOO: FORCE-EVOLVED` marker.
- If nothing is speculative and there are no `FORCE-EVOLVED` markers, say so plainly and give the count — a clean diff is a valid result.
