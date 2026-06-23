# Task 05 — The abstraction was earned (the honesty task)

Pattern under test: **the case where speculation wins.** Here the withheld extension is *exactly* the one a speculative build would have guessed. The control arm's up-front structure pays off; Magikarp, having deferred it, pays more at step 4.

This task is in the rig on purpose. Without a task Magikarp can lose, the benchmark is rigged. We run it, measure it, and report the loss — the real claim is about *expected* cost across all tasks, not a clean sweep.

---

## Spec (given to the agent at step 2)

Build a payment processor that charges a card via **Stripe**. Expose a `charge(amountCents, currency, source)` function that calls Stripe and returns a normalised result `{ ok, transactionId, error }`.

The spec mentions Stripe and only Stripe. A disciplined build wires directly to Stripe and leaves a `*splash*` marker noting that a provider interface should be introduced when a second processor appears — naming that exact, concrete trigger.

---

## Withheld extension (do not reveal until step 3)

Product (a real, unplanned request): "We're adding **Adyen** as a second payment processor. Route by the merchant's configured provider; both must return the same normalised result. We'll likely add more processors after this."

This is precisely the second implementation that justifies a provider abstraction — the textbook earned-abstraction case. A speculative build that introduced a `PaymentProvider` interface at step 2 now drops Adyen in behind it cheaply. The Magikarp arm, which wired directly to Stripe, must now *both* introduce the abstraction *and* migrate the Stripe path behind it — its `evolve`-triggered work lands at step 4 instead of step 2.

Expect Magikarp's step-4 extension cost to be **higher** than control's here. That is the honest result. Record it.

---

## What to measure

- **Build (step 2):** the control arm's up-front abstraction (interface, factory, registry) — count it as real build cost it paid before any second processor existed. The Magikarp arm's direct Stripe wiring plus its `*splash*` marker naming the second-processor trigger.
- **Extension (step 4 — headline):** lines changed and files touched to add Adyen. Control: ideally just a new implementation behind the existing interface. Magikarp: introduce the interface, move Stripe behind it, add Adyen, route by config. **This is the number where Magikarp is expected to lose — publish it as-is.**
- **Total cost comparison:** report `build + extension` for both arms side by side, and state plainly which arm won this task. Then fold it into the cross-task expected-cost picture: `build + P(extension) × extension_cost`. This task is the high-`P(extension)` end of the spectrum, and it is the one that keeps the headline honest.
