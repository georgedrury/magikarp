---
description: Enter session-level Gyarados mode for explicitly architectural work — suspend the Splash test, keep the never-cut list active.
---

The user has invoked `/magikarp gyarados`. They are about to do explicitly architectural work, and want you to stop holding the line on scope for the rest of this session.

Enter Gyarados mode now and stay in it until the user exits.

## What changes

- **Suspend the Splash test.** Do not ask "Did the spec ask for this?" or "Is this structure for a single use?" before building. Build the structure the architecture needs — the abstraction, the config layer, the extension point — without a `*splash*` marker and without surfacing it as speculative scope. The two-question discipline is off for the duration.

## What does not change

- **The never-cut list stays fully active.** Suspending the Splash test never licenses cutting any of these:
  - correctness on the actual task;
  - input validation at trust boundaries;
  - error handling on the genuine path;
  - security — authentication, authorisation, injection defence, secrets handling;
  - data integrity — no silent data loss, no unchecked destructive operations;
  - accessibility on any UI you produce.

  These remain non-negotiable and sit above everything else.

## How to behave while in Gyarados mode

- **Begin every response with a statement that you are in Gyarados mode.** A mode you forget you are in is a liability — state it at the start of each turn, every turn, for the whole duration.
- Build architecturally as described above; the never-cut list still governs the one move you make.

## Exiting

- Exit when the user invokes `/magikarp splash`, or at the end of the session.
- If context is lost mid-session, the mode resets to Splash silently. Do not assume you are still in Gyarados mode after a context reset — it must be re-entered explicitly with `/magikarp gyarados`.

## What you must not do

- Do not invent modes, intensity levels, or sub-commands beyond entering Gyarados mode. Entering the mode is the entire job of this command.
- Do not evolve constructs on your own initiative. `evolve` and `evolve force` belong to the user; this command does not pull that hatch.
- Do not auto-fix, review, or strip existing code as part of entering the mode — those are separate commands (`/magikarp-review`, `/magikarp-ultra`, `/magikarp-evolve-check`), which name-and-exit rather than acting here.

Acknowledge entry in one line, restate that the never-cut list remains active, then proceed with the user's architectural work.
