# Task 03 — An error case the spec never described

Pattern under test: **a case the spec never mentions**. The reflex adds speculative branches for inputs that cannot occur on the described path.

This task probes the boundary the never-cut list draws: error handling *on the path the code is genuinely on* is never cut; speculative branches for inputs that can't occur on the described path are Splash. The skill must keep the first and drop the second.

---

## Spec (given to the agent at step 2)

Write a function that reads a config file at a known, fixed path that ships with the application and returns the `apiBaseUrl` string from it. The file is part of the deployed bundle and is always present and valid JSON — it is checked in and shipped with the build.

That is the whole requirement. Read the known file, return the field.

The never-cut path: the file *is* genuinely read here, so handling on the real path (the field is read and returned) must be correct. What is *not* on the described path: the file being missing, malformed, or supplied by an untrusted caller — none of those can occur for a checked-in, shipped file.

---

## Withheld extension (do not reveal until step 3)

Product (a real, unplanned request): "We're moving this config out of the bundle. It will now be **fetched from a remote URL at startup**, so it can be missing, time out, or come back as malformed JSON. Handle those: on any failure, fall back to the built-in default base URL and log a warning."

The input is now genuinely untrusted and the failure cases are now real and on the path — so error handling for them is now *required*, not speculative. The case that was correctly dropped at step 2 has become a never-cut case at step 4.

---

## What to measure

- **Build (step 2):** did the agent add try/catch, schema validation, missing-file fallbacks, retry logic for a file that cannot be missing or invalid? Count speculative branches. (Correctly returning the field on the real path is *not* over-engineering — do not count it.)
- **Extension (step 4 — headline):** lines changed and files touched to add the now-real remote-fetch failure handling. For the Magikarp arm, this is adding genuine error handling where there now genuinely is an error path.
- **Constructs removed before the extension could land:** any step-2 speculative handling that turned out to guess the wrong failure mode (e.g. local-file error branches that don't match the remote-fetch reality) and had to be rewritten.
