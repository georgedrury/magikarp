# Task 01 — A single configuration value

Pattern under test: **config nobody asked for**. The spec names one value; the reflex builds a configuration system around it.

---

## Spec (given to the agent at step 2)

Add pagination to the product list endpoint. The default page size is **25** items. The endpoint already exists and returns the full list; add the limit so it returns at most one page.

That is the whole requirement. Nothing about overriding the value, no per-environment behaviour, no caller-supplied page size.

---

## Withheld extension (do not reveal until step 3)

Product (a real, unplanned request): "Marketing wants the page size to be **50** on the `/featured` listing, but stay **25** everywhere else."

A second value for the same setting has now genuinely appeared. This is the exact trigger a `*splash*` marker on the hardcoded `25` would have named ("promote to config when a second value appears"), so for the Magikarp arm the held line should now evolve cleanly.

---

## What to measure

- **Build (step 2):** abstractions introduced (config service, provider, schema?), files created, exported symbols. Did a single value grow an architecture?
- **Extension (step 4 — headline):** lines changed and files touched to support the second value. For a hardcoded `25` with a `*splash*` marker, this is introducing the one parameter the second caller now needs. For a speculative config stack, count any layers that have to be re-touched or were never used.
- **Constructs removed before the extension could land:** any speculative layer the control arm has to unpick to make the real two-value case fit.
