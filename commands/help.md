---
description: Explain the Splash test, markers, never-cut list, and evolve commands.
---

Print a concise in-chat explanation of how Magikarp works. No external links, no preamble — output the explanation directly. Cover exactly the four areas below, in this order, and keep each tight.

**1. The Splash test.** Two questions, asked before building any construct:

1. Did the spec ask for this? If not — Splash. Don't build it.
2. Is this structure for a single use? If yes — inline it, or hardcode the one value, and leave a `*splash*` marker naming the trigger that would promote it. If no — build it, correctly and completely.

State that this is a constraint on scope, not on code length. Name the reflexes it catches: an abstraction for one caller (inline it), config with one current value (hardcode it), a case the spec never mentions (drop it), a "while I'm here" change (stop, name it as a separate task).

**2. The markers.** List the three, byte-exact, with when each is used:

- `*splash*` — held the line; left where Magikarp inlined, hardcoded, or dropped something a reader would have expected. Format: `// *splash* — [what was done], [exact trigger for promotion]`. The asterisks are part of the token.
- `GYAOOO: evolved` — built the full structure under `evolve [reason]`; the reason goes in the comment.
- `GYAOOOOO: FORCE-EVOLVED` — built the full structure under `evolve force`; no reason required, but never silent. `/magikarp-review` surfaces every `FORCE-EVOLVED` before merge.

**3. The never-cut list.** Minimal is not missing. State that these are never cut, in full: correctness on the actual task; input validation at trust boundaries; error handling on the genuine path; security (auth, authorisation, injection defence, secrets handling); data integrity (no silent data loss, no unchecked destructive operations); accessibility on any UI output. When these conflict with minimalism, they win.

**4. The evolve commands.** Magikarp never evolves on its own initiative — the escape hatch belongs to the user:

- `evolve [reason]` — build the full structure for the named construct and write `// GYAOOO: evolved — [reason]` above it.
- `evolve force` — build the full structure and write `// GYAOOOOO: FORCE-EVOLVED — no reason given`.

State that an evolve covers one construct, not the session: the Splash test resumes on the very next construct. Note Gyarados mode (`/magikarp gyarados`) suspends the Splash test for explicitly architectural work — the never-cut list stays active — and is exited with `/magikarp splash` or at session end.

Mention the companion commands briefly: `/magikarp-review` (names speculative scope and every `FORCE-EVOLVED`, then exits — never auto-fixes), `/magikarp-evolve-check` (reports which `*splash*` promotion triggers have fired, then exits — never evolves anything itself), and `/magikarp-ultra` (aggressive retrospective scope-strip).
