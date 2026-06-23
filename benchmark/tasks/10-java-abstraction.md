# Task 10 — The over-abstraction archetype, in Java

Pattern under test: **abstraction for one use, in the language most prone to it.** Java idiom invites a `DisplayNameProvider` interface, a factory, and dependency injection for what is one method. Tests the language-agnostic claim where the reflex is strongest.

Mode: `extend` (build to spec, then absorb a withheld second variant).
Language: Java.

---

## Spec (given to the agent)

Write code that returns a user's display name: `firstName + " " + lastName`, or the user's `email` if both names are blank. The `User` has `getFirstName()`, `getLastName()`, `getEmail()`.

One rule, one caller. Nothing about formats, strategies, or locales.

---

## Withheld extension (do not reveal until step 3)

Product (a real, unplanned request): "The admin table needs the name as `"Last, First"` instead. The rest of the app keeps `"First Last"`."

A second genuine format has appeared — the trigger a `*splash*` marker on the single inlined rule would have named.

---

## What to measure

- **Build (step 2):** a static method / inline expression, or a `DisplayNameProvider` interface + factory + DI for one rule? Count interfaces, classes, files.
- **Extension (step 4 — headline):** lines and files changed to add the second format. For a held inline rule, this is introducing the small branch/parameter the second caller now needs. For a pre-built strategy framework, count whether its shape fit the real second format or had to be reworked.
- **Constructs removed before the extension could land:** speculative Java scaffolding (factory, registry, unused strategy interface) torn out to fit the real second case.
- **Correctness:** both formats, and the blank-names → email fallback.
