# Task 02 — A utility used in one place

Pattern under test: **abstraction for one caller**. One call site invites a general-purpose helper, a module, an exported API — built for callers that do not exist.

---

## Spec (given to the agent at step 2)

On the order confirmation page, show the order total formatted as US currency — e.g. `1234.5` renders as `$1,234.50`. This is the only place a price is displayed on this page.

That is the whole requirement. One call site, one locale, one currency.

---

## Withheld extension (do not reveal until step 3)

Product (a real, unplanned request): "The invoice email also needs the order total formatted the same way — and the invoice is generated in the user's locale, so it has to support **EUR** and **GBP** as well as USD."

A genuine second caller has appeared, *and* it needs behaviour the first never did (multiple currencies/locales). Note this is deliberately not a clean win: the second use also widens the requirement, so even a well-placed helper has to grow. Measure honestly.

---

## What to measure

- **Build (step 2):** was the formatting inlined at the single call site, or lifted into a `formatCurrency` utility / module / exported symbol with options it had no caller for? Count abstractions, files created, exported symbols.
- **Extension (step 4 — headline):** lines changed and files touched to serve the second caller with multi-currency support. For an inlined formatter with a `*splash*` marker, this is extracting the now-shared logic *and* adding the locale/currency parameter. For a pre-built generic util, count whether its speculative shape actually fit the real second requirement or had to be reworked.
- **Constructs removed before the extension could land:** any pre-built generality (options, hooks) that turned out not to match the real second caller and had to be torn out.
