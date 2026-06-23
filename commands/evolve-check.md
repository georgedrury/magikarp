---
description: Harvest *splash* markers and report which promotion triggers have fired — RIPE / NEEDS-DATA / DORMANT. Names ripeness and exits; never evolves anything.
---

You are running `/magikarp-evolve-check`. Harvest every `*splash*` marker in scope and report which promotion triggers have demonstrably fired. You **name ripeness and exit** — you never evolve, never edit, never auto-fix. Magikarp never pulls the escape hatch on its own initiative; that belongs to the user.

## Input

A path or the whole repo. If the user gave a path, scope to it; otherwise scan the repository. Find every held-line marker — grep for the token `*splash*` (the asterisks are part of the token; bare `splash` collides with real code and is not a marker).

For each marker, read its **trigger** — the concrete promotion condition written after the comma in `// *splash* — [what was done], [exact trigger]`. Read triggers **semantically**; do not impose a rigid comment schema. The marker is human-first.

## What "the spec" is here

The original spec may be gone. Treat the available intent signal as the spec — PR/commit/issue text, or context the user supplies. Absent any signal, lean on what the code itself proves: a trigger like "second caller" is verifiable from the tree with no spec at all. Stay conservative — never claim a trigger fired unless you can point at the evidence.

## Output — in this exact order

1. **RIPE** — markers whose trigger is *structural* and has demonstrably fired. A structural trigger names a condition you can verify directly from the code: "second caller appears" → a second caller now exists in the tree; "second config value" → a second value is present; "second variant" → a second variant is rendered. For each RIPE marker give its **line reference** and the **verifying evidence** (the specific second caller / value / variant you found, with its location).

2. **NEEDS-DATA** — markers whose trigger is *empirical*: "measured hot path", "at scale", "when load justifies it", "if this gets slow". You have no profiling or production data, so you **never claim these fired**. Surface each one for human judgement, with its line reference, and say plainly that you cannot verify it from the code.

3. **DORMANT** — structural triggers still holding: the condition is checkable but has not yet fired. List each with its line reference and its trigger, so the full ledger is visible.

4. **Count** — ripe / needs-data / total markers.

## The honesty boundary (do not cross it)

The RIPE/NEEDS-DATA split is the point of this command. Assert only what you can verify from the code; flag — never fake — what you can't. If you cannot find concrete evidence that a structural trigger fired, it is DORMANT, not RIPE. If a trigger is empirical, it is NEEDS-DATA — no exceptions, no guessing from vibes. This command works at all only because triggers are concrete; honour that by reading them honestly.

## Constraints

- Do **not** evolve, edit, or modify any code. Name ripeness and exit.
- Do not invent triggers a marker doesn't state, and do not upgrade an empirical trigger to structural to make it claimable.
- Report the markers as they are. The user decides what to evolve.
