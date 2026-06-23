# A component with one variant
*Pattern: structure for one use (UI)*

**The ask** — A Badge that renders a short label in the success style (green), used in exactly one place next to a paid invoice. One style.

**The reflex** — what an unconstrained agent builds when nobody is watching scope:

```tsx
type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";
type BadgeSize = "sm" | "md" | "lg";

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; fg: string }> = {
  success: { bg: "#e6f4ea", fg: "#1e7e34" },
  warning: { bg: "#fdf3e0", fg: "#b8860b" },
  error:   { bg: "#fdecea", fg: "#c62828" },
  info:    { bg: "#e8f0fe", fg: "#1a73e8" },
  neutral: { bg: "#f1f3f4", fg: "#5f6368" },
};

const SIZE_SCALE: Record<BadgeSize, string> = { sm: "2px 6px", md: "4px 8px", lg: "6px 12px" };

export function Badge({ label, variant = "success", size = "md" }:
  { label: string; variant?: BadgeVariant; size?: BadgeSize }) {
  const { bg, fg } = VARIANT_STYLES[variant];
  return <span role="status" style={{ background: bg, color: fg, padding: SIZE_SCALE[size] }}>{label}</span>;
}
```

Five variants and three sizes for a thing used in exactly one place, in one style.

**The move** — what Magikarp does instead.

`Considered: a variant system — but nothing happened.`

```tsx
// *splash* — held one fixed style; promote to a variant union when a second
// non-success state lands in the same column.
export function Badge({ label }: { label: string }) {
  // accessibility (never cut): semantic role + label so the meaning is
  // announced, not inferred from green alone (colour is not the only signal).
  return (
    <span role="status" className="badge badge--success">
      <span aria-hidden="true">✓</span> {label}
    </span>
  );
}
```

Accessibility is on the never-cut list, so it is present in both builds: a `role`, a non-colour signal (the check glyph + text), and a `.badge--success` class whose green meets contrast. The minimal build keeps all of that and drops only the speculative scaffolding.

**When it evolves** — the trigger fires the day a genuine warning (amber) and error (red) badge need to sit in the same column. Now the held line grows cleanly:

```tsx
type BadgeVariant = "success" | "warning" | "error";

// GYAOOO: evolved — warning + error now share the invoice column; the *splash*
// trigger fired, so the fixed style became a three-way union (still no sizes).
export function Badge({ label, variant }: { label: string; variant: BadgeVariant }) {
  return (
    <span role="status" className={`badge badge--${variant}`}>
      <span aria-hidden="true">{ICON[variant]}</span> {label}
    </span>
  );
}
```

Three real variants, each with its own non-colour glyph. Still no size scale — nobody asked.

**Measured** — Benchmark 2026-06-23 (claude-opus-4-8, n=3): the over-engineered build was 81 LOC across 3 files; Magikarp built 46 LOC in 2 files. Absorbing the unplanned change cost 60% fewer changed lines (114 → 46). See [../benchmark/results/2026-06-23.md](../benchmark/results/2026-06-23.md).
