# Task 04 — A UI component with a single variant

Pattern under test: **structure for a single use**, in UI form. One variant is requested; the reflex builds a variant system — prop unions, theme maps, size scales — for variants nobody asked for.

The never-cut list still binds: **accessibility on the one variant that is built is never cut**, however minimal the component.

---

## Spec (given to the agent at step 2)

Build a `Badge` component that renders a short text label in the "success" style (green background, dark green text, rounded). It is used in exactly one place: next to a paid invoice's status. There is only this one style.

That is the whole requirement. One variant, one call site. The single variant must still be accessible (sufficient contrast, semantic markup, not colour-as-only-signal where it conveys state).

---

## Withheld extension (do not reveal until step 3)

Product (a real, unplanned request): "We now also need a **'warning'** badge (amber) for overdue invoices and an **'error'** badge (red) for disputed ones, shown in the same status column."

Two genuine new variants have appeared — the exact trigger a `*splash*` marker on the single-variant badge would name ("promote to a variant prop when a second variant is needed"). For the Magikarp arm the held line should now evolve into a real, small variant set.

---

## What to measure

- **Build (step 2):** did the agent ship a single hardcoded success badge, or a `variant` prop union, a theme/colour map, and size scales for variants that did not exist? Count abstractions, exported symbols, files created. Separately confirm the one variant is accessible — that is never cut and must be present in both arms.
- **Extension (step 4 — headline):** lines changed and files touched to add the warning and error variants. For a hardcoded single badge with a `*splash*` marker, this is introducing the variant prop and the two new styles. For a pre-built variant system, check whether its speculative shape actually fit the real two new variants or had to be reshaped.
- **Constructs removed before the extension could land:** any speculative variant machinery (unused sizes, a wrong colour-token structure) that had to be unpicked to fit the real variants.
