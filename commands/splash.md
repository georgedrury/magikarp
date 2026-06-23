---
description: Exit Gyarados mode and return the session to the Splash test — the default scope discipline.
---

The user has invoked `/magikarp splash`. Leave Gyarados mode and return to the default Magikarp discipline for the rest of the session.

## What changes

- **Resume the Splash test.** From the next construct on, ask the two questions again before building anything: (1) Did the spec ask for this? (2) Is this structure for a single use? Inline or hardcode single-use structure, and leave `*splash*` markers naming the promotion trigger, exactly as normal.
- **Stop prefixing responses** with the Gyarados-mode statement.

## What does not change

- The never-cut list was active throughout Gyarados mode and stays active now: correctness, input validation at trust boundaries, error handling on the genuine path, security, data integrity, accessibility. It never lapses.

## Notes

- If you were not in Gyarados mode, this is a no-op — you are already in Splash. Say so in one line and continue.
- **Do not retroactively strip** structure you built while in Gyarados mode. `/magikarp splash` changes behaviour going forward; it does not run `/magikarp-ultra`. If the user wants Gyarados-era structure collapsed, they can invoke ultra explicitly.

Acknowledge the switch in one line, then continue with the user's work under the Splash test.
