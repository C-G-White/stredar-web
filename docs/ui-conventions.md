# UI Conventions

## Core Principle

All styling uses **CSS custom properties (design tokens) with inline styles**. There is no Tailwind, no CSS Modules, no styled-components. This means:

- Design tokens are referenced as `var(--token-name)` in inline `style` props
- Typography uses semantic class names (`.t-display-1`, `.t-h2`, `.t-label`, etc.)
- Responsive layout uses the utility classes defined in `globals.css`
- No third-party component library

---

## Design Tokens

All tokens are defined in `app/globals.css` (synced from `../stredar/colors_and_type.css` in the design system repo).

### Colour groups

| Group | Purpose | Key values |
|---|---|---|
| `--asphalt-*` | Dark structural backgrounds | `--asphalt-900: #0E1013`, `--asphalt-800: #15181C`, `--asphalt-700: #1C2025` |
| `--steel-*` | Borders, muted text, metadata | `--steel-500: #363C44` through `--steel-100: #C8CDD3` |
| `--concrete-*` | Light marketing backgrounds | `--concrete-50: #F5F6F7` |
| `--hivis-*` | Brand orange — CTAs, accents, active states | `--hivis-500: #FF6B1A` (primary) |
| `--ok-500` / `--warn-500` / `--over-500` | Speed state semantics | Green / Amber / Red |
| `--led-*` | LED display face | `--led-bg`, `--led-amber`, `--led-red` |
| `--*-tint` | Tinted backgrounds for status banners | `--ok-tint`, `--warn-tint`, `--over-tint`, `--hivis-tint` |

### Spacing

Eight-point scale: `--sp-1` (4px) through `--sp-24` (96px). Steps: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24.

### Typography

Four font families:
- `--font-display` — Barlow Semi Condensed (headings, CTAs, large UI)
- `--font-sans` — IBM Plex Sans (body text, UI labels)
- `--font-mono` — IBM Plex Mono (metadata, codes, data labels, eyebrows)
- `--font-led` — Doto (LED speed display numbers only)

### Borders

| Token | Value | Use |
|---|---|---|
| `--bd-light` | `1px solid var(--concrete-200)` | Light-background card borders |
| `--bd-dark` | `1px solid var(--steel-500)` | Dark-background card borders |
| `--bd-hair-dark` | `1px solid var(--steel-400)` | Subtle dividers on dark |
| `--bd-accent` | `3px solid var(--hivis-500)` | Active/alerting left or top border |

### Radii

`--r-xs` (3px), `--r-sm` (6px), `--r-md` (10px), `--r-lg` (14px), `--r-xl` (20px), `--r-pill` (999px).

---

## Typography Classes

Use semantic class names for all text. Never set font-family, font-size, or font-weight directly in inline styles — use a class.

| Class | Size | Family | Use |
|---|---|---|---|
| `.t-display-1` | 76px (responsive) | Display | Hero headlines |
| `.t-display-2` | 54px (responsive) | Display | Page-level h1 |
| `.t-h1` | 40px | Display | Section h1 |
| `.t-h2` | 30px (responsive) | Display | Section h2 |
| `.t-h3` | 22px | Display | Card headings |
| `.t-body-lg` | 19px | Sans | Lead paragraphs |
| `.t-body` | 16px | Sans | Body copy |
| `.t-body-sm` | 14px | Sans | Secondary copy, captions |
| `.t-label` | 12px mono, uppercase, 0.14em tracking | Mono | Eyebrows, metadata, table headers |
| `.t-data` | 15px mono | Mono | Numeric data, values |

**Casing rules:**
- `UPPERCASE` for display moments (`textTransform: 'uppercase'` inline alongside the class)
- Title Case for section headers
- Sentence case for body, UI labels, button text does NOT follow this — buttons are uppercase display font

---

## Responsive Layout Utilities

The following CSS classes are defined in `globals.css` and collapse at breakpoints. Use these instead of inline `gridTemplateColumns`:

| Class | Desktop columns | ≤768px | ≤480px |
|---|---|---|---|
| `.cols-2` | `1fr 1fr` | `1fr` | `1fr` |
| `.cols-2-1` | `2fr 1fr` (form + sidebar) | `1fr` | `1fr` |
| `.cols-form-2` | `1fr 1fr` (form field pairs) | `1fr 1fr` | `1fr` |
| `.cols-4` | `repeat(4, 1fr)` (stat cards) | `1fr 1fr` | `1fr 1fr` |
| `.cols-hist` | `2fr 1fr` (chart + panel) | `1fr` | `1fr` |

These classes set `display: grid` and `grid-template-columns` only. Always set `gap` as an inline style alongside the class:

```tsx
<div className="cols-2" style={{ gap: 'var(--sp-10)', alignItems: 'start' }}>
```

---

## Page Backgrounds

| Route group | Background | Token |
|---|---|---|
| `(marketing)` | Light concrete | `var(--concrete-50)` |
| `(dashboard)` | Dark asphalt | `var(--asphalt-800)` |

Section alternation on marketing pages:
- Odd sections: `var(--concrete-50)` or `var(--white)`
- Even sections: `var(--asphalt-900)` or `var(--asphalt-800)` (dark)

---

## Card Patterns

### Light card (marketing)
```tsx
<div style={{
  background: 'var(--white)',
  border: 'var(--bd-light)',
  borderTop: 'var(--bd-accent)',   // hi-vis accent top edge on featured cards
  borderRadius: 'var(--r-lg)',
  padding: 'var(--sp-8)',
  boxShadow: 'var(--sh-1)',
}}>
```

### Dark card (dashboard)
```tsx
<div style={{
  background: 'var(--asphalt-700)',
  border: 'var(--bd-dark)',
  borderLeft: 'var(--bd-accent)',  // hi-vis accent left edge on active/alerting items
  borderRadius: 'var(--r-md)',
  padding: 'var(--sp-6)',
}}>
```

The **3px hi-vis left/top accent border** (`--bd-accent`) is the signature Stredar pattern. Use it on:
- The first step in a numbered sequence
- Active/selected items
- Featured or highlighted cards
- The first stat card in a row

---

## Button / CTA Pattern

Buttons use the display font, uppercase, never the body font:

```tsx
// Primary CTA
<a style={{
  display: 'inline-block',
  background: 'var(--hivis-500)',
  color: 'var(--white)',
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 16,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  padding: '14px 32px',
  borderRadius: 'var(--r-sm)',
  textDecoration: 'none',
}}>
  Join the Scheme
</a>

// Secondary / ghost button
<a style={{
  display: 'inline-block',
  border: 'var(--bd-dark)',
  color: 'var(--ink)',
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 16,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  padding: '14px 32px',
  borderRadius: 'var(--r-sm)',
  textDecoration: 'none',
}}>
  How It Works
</a>
```

Large hero CTAs use `18px` and `padding: '18px 40px'`.

---

## Status Banners

Used for "Demo Data" notices and error states:

```tsx
// Warning / demo
<div style={{
  background: 'var(--warn-tint)',
  border: '1px solid var(--warn-500)',
  borderRadius: 'var(--r-sm)',
  padding: 'var(--sp-3) var(--sp-5)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--sp-4)',
}}>
  <span className="t-label" style={{ color: 'var(--warn-500)', whiteSpace: 'nowrap' }}>Demo Data</span>
  <span className="t-body-sm" style={{ color: 'var(--steel-200)' }}>Explanatory text.</span>
</div>

// Error
<div style={{
  background: 'var(--over-tint)',
  border: '1px solid var(--over-500)',
  borderRadius: 'var(--r-sm)',
  padding: 'var(--sp-4)',
}}>
  <p className="t-body-sm" style={{ color: 'var(--over-500)' }}>Error message.</p>
</div>
```

---

## LED Speed Display

Use `--font-led` and `--led-amber` for any large speed number:

```tsx
<span style={{
  fontFamily: 'var(--font-led)',
  fontSize: 48,
  color: speedColor,   // var(--ok-500), var(--warn-500), or var(--over-500)
  lineHeight: 1,
}}>
  {speedMph}
</span>
```

The `.t-label` eyebrow "MPH AVG" sits alongside it at `var(--steel-300)`.

---

## Brand Constraints

- **No emoji.** Use Lucide icons (stroke 1.75px, 18–22px) — not needed in stredar-web as icons are used only in the design system UI kits.
- **No photographic backgrounds, no gradient washes.** Dark asphalt or concrete flats only.
- **Numbers lead.** Use `--font-mono` for speeds, IDs, coordinates, timestamps.
- **Motion:** `--dur: 200ms`, `--ease-out`. No bounce. Use CSS `transition` properties on hover states only. Respect `prefers-reduced-motion` (handled globally in `globals.css`).
- **Corner radii:** tight. `--r-sm` (6px) for buttons and inputs, `--r-md` (10px) for cards, `--r-lg` (14px) for large panels, `--r-pill` only for status badges.
