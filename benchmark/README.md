# Magikarp benchmark rig

**Purpose:** produce a measured *extension-cost* figure — proof that a minimal build absorbs an unplanned requirement in fewer changed lines and files than a speculative one — **and** honestly quantify the case where it does not.

The claim under test is not "less code is always cheaper." It is about *expected* cost:

```
expected cost = build + P(extension) × extension_cost
```

The speculative build pays `build` up front to lower `extension_cost`. Magikarp's bet is that `P(extension)` is low enough that deferring the structure wins on average. This rig exists to test that bet — including the task where the bet loses.

---

## Arms (two only)

| Arm | System prompt | Notes |
| --- | --- | --- |
| **Control** | Stock agent, no skill installed | The over-engineering reflex runs free. |
| **Magikarp** | Same agent + the always-on Magikarp core injected at session start | The Splash test is active. |

Both arms use the **same model and the same system prompt**, differing *only* by whether the Magikarp core is present.

### Why only two arms

A third "comparison skill" arm is the obvious thing to reach for, and we deliberately leave it out. Other minimalism tools optimise *length / necessity* and report lines of code removed; Magikarp optimises *scope* and reports extension cost. A head-to-head would compare extension cost against LOC removed — apples to oranges — and would measure Magikarp on a different axis than its own. Leaving the arm out is itself an application of the discipline: nothing asked for it, and it would not measure what this rig is for.

---

## Run procedure

Per arm, per task, run a **fresh agent instance** — no shared memory across arms or tasks.

1. **Fresh agent per arm per task.** Same model, same system prompt; the only difference is whether the Magikarp core is injected.
2. **Complete the task to spec.** The agent is given *only* the task's Spec section. The withheld extension is not visible to the agent at this point. This produces the **build** (step-2 artefact).
3. **Introduce the withheld extension.** Reveal the task's "Withheld extension" section to the same agent instance as a follow-up request.
4. **Measure step-4.** Record what it cost to absorb the extension — lines and files changed in this step.

Steps 1–2 produce the build cost; steps 3–4 produce the extension cost. Both halves are recorded; neither is discarded.

---

## Metrics (per task, per arm)

Recorded at step 2 (build) and step 4 (extension) as noted:

- **abstractions introduced** — classes, interfaces, factories, providers (build)
- **files created** (build)
- **exported symbols introduced** (build)
- **lines changed to absorb the extension** (step 4)
- **files touched to absorb the extension** (step 4)
- **constructs removed before the extension could land** (step 4 — e.g. a speculative arm tearing out a wrong guess before it can fit the real requirement)

### Headline metric

**Extension cost** — the lines and files changed in **step 4** to absorb the unplanned requirement. Lower is the argument. Everything else is supporting evidence.

---

## Honesty requirements

These are what separate this rig from a strawman. They are not optional.

- **Report build cost alongside extension cost.** The minimal arm *defers* structure; it does not escape it. Step-2 build cost is reported next to step-4 extension cost for every task, so the comparison is total cost — not just the speculative arm's worst day. A rig that showed only step 4 would flatter Magikarp by hiding the up-front work the control arm already paid for.
- **Include and report the "abstraction was earned" task (`05`) even when Magikarp loses it.** In that task the withheld extension is *exactly* the one a speculative build would have guessed, so the control arm's up-front structure pays off and Magikarp pays more at step 4. We run it, we measure it, and we publish the loss. The real claim is about *expected* cost across tasks, not a clean sweep. Omitting a task Magikarp loses would rig the rig.

---

## Tasks

Each common over-engineering pattern, one file in `tasks/`:

| Task | Pattern |
| --- | --- |
| `01-config-value.md` | a single configuration value (the page-size example) |
| `02-single-use-utility.md` | a utility used in one place |
| `03-undescribed-error-case.md` | an error case the spec never described |
| `04-single-variant-ui.md` | a UI component with a single variant |
| `05-abstraction-was-earned.md` | the honesty task — withheld extension *is* the speculative guess |

Each task file has a **Spec** (handed to the agent at step 2) and a clearly separated **Withheld extension** section (revealed only at step 3), plus what to measure.

---

## Results

Measured outputs land in `results/`, committed after each run with **model version, date, and full task output** for both arms. Until then the directory holds only `.gitkeep`.
