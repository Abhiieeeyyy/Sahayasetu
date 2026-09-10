---
name: Humanitarian Field & Relief OS
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#40484b'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#70787c'
  outline-variant: '#c0c8cb'
  surface-tint: '#306576'
  primary: '#003441'
  on-primary: '#ffffff'
  primary-container: '#0f4c5c'
  on-primary-container: '#87bbce'
  inverse-primary: '#9acee1'
  secondary: '#7c5714'
  on-secondary: '#ffffff'
  secondary-container: '#ffcc7e'
  on-secondary-container: '#795511'
  tertiary: '#1e3241'
  on-tertiary: '#ffffff'
  tertiary-container: '#354858'
  on-tertiary-container: '#a2b6ca'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b6ebfe'
  primary-fixed-dim: '#9acee1'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#114d5d'
  secondary-fixed: '#ffddae'
  secondary-fixed-dim: '#f0be72'
  on-secondary-fixed: '#281800'
  on-secondary-fixed-variant: '#604000'
  tertiary-fixed: '#d1e5f9'
  tertiary-fixed-dim: '#b5c9dd'
  on-tertiary-fixed: '#081d2c'
  on-tertiary-fixed-variant: '#364959'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Newsreader
    fontSize: 34px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
  data-tabular:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  gutter-mobile: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  content-max-width: 84rem
---

## Brand & Style

This design system serves humanitarian coordination teams, field responders, logistics directors, and grant overseers operating under high-stress conditions. The visual language merges high-functionality utilitarian toolsets with refined, editorial-grade clarity.

### Personality & Demeanor
- **Composed & Authoritative:** The interface rejects visual noise, theatrical urgency, and loud gamified patterns. Clarity communicates competence.
- **Utilitarian Elegance:** Every border, line of metadata, and numerical figure serves triage, distribution, and situational clarity.
- **Respectful & Sober:** Relief operations deal with vulnerability and disruption; the aesthetic avoids garish marketing colors or aggressive saturation in favor of calm, high-legibility surfaces.

### Design Movement
The interface operates under a hybrid of **Swiss Functionalism** and **Minimalist Editorial Utility**:
- Crisp 1px structure lines replacing heavy container fills.
- Generous breathable margins contrasting tight, highly structured tabular data clusters.
- Low-contrast architectural grid planes that recede entirely, allowing critical field metrics and relief statuses to dominate user attention.

## Colors

The palette relies on clean mineral off-white canvas surfaces, slate structure lines, and deeply restrained, low-chroma functional accents.

### Palette Architecture
- **Primary (`#0F4C5C` - Deep Slate Teal):** Applied surgically to primary actions, selected navigation items, key quantitative highlights, and authoritative confirmations. It never coats entire full-width headers or heavy banner backgrounds.
- **Secondary (`#76520E` - Muted Field Amber):** Reserved exclusively for pending states, logistical constraints, priority triage alerts, and watch-level notifications. Retains high contrast against off-white backgrounds without introducing neon panic.
- **Tertiary (`#4A5D6E` - Deep Slate Gray):** Handles secondary interaction affordances, structured tab lines, column indicators, and inactive state borders.
- **Neutral Surface & Slate (`#64748B` / `#FBFBFA` / `#F0F2F4`):** Canvas grounding. The base canvas is `#FBFBFA` (warm clean off-white), nested work cards sit on `#FFFFFF`, and structural separating lines utilize `#E2E8F0` / `#CBD5E1`.

### Signal Hierarchy
- **Critical Urgency / Hazard:** `#991B1B` (Deep Crimson Slate), rendered primarily as text and hairline outlines, never solid block fills.
- **Resolution / Verified:** `#166534` (Deep Forest Muted), used sparingly for supply deliveries and verified civilian safe zones.
- **Informational / Tracking:** `#1E293B` (Near Black Slate) for data integrity and highest visual weight.

## Typography

The typography system pairs the intellectual gravitas of an authoritative serif with an impeccably neutral sans-serif and an engineered monospace for data fidelity.

### Hierarchy & Pairing
- **Editorial Headlines (`Newsreader`):** Applied to view titles, high-level briefing dossiers, and incident overviews. Its quiet literary rhythm establishes human focus over clinical detachment.
- **Operational Interface & Narrative Body (`Inter`):** Drives all standard prose, descriptive inputs, forms, and general layout controls. Selected for supreme legibility at low contrast and small sizes.
- **Telemetry & Identification (`JetBrains Mono`):** Applied to coordinate sets, resource lot identifiers, timestamps, inventory quantities, and status markers. Monospace numbers ensure columns remain precisely aligned in dense field sheets.

### Rules of Typesetting
- All monospaced indicators and metadata tags must be set with slight positive tracking (`0.04em` to `0.05em`) and uppercase styling.
- Incident report headers should avoid pure black; use `#0F172A` (Slate 900) for headers and `#334155` (Slate 700) for body reading comfort.
- Tabular figures (`font-variant-numeric: tabular-nums`) are mandatory across all metric blocks.

## Layout & Spacing

The layout philosophy relies on an architectural, column-guided fluid grid anchored by strict horizontal baseline spacing. Space is used deliberately to reduce cognitive burden in high-velocity field scenarios.

### Grid & Structure
- **Desktop (1024px+):** 12-column grid, max-width `84rem` (1344px), with `2rem` gutters. Margins auto-center with a minimum outer boundary of `2rem`.
- **Tablet (768px - 1023px):** 8-column layout, `1.5rem` gutters and side margins. Sidebars collapse to icon/dock drawers.
- **Mobile (320px - 767px):** 4-column layout, `1rem` margins and gutters. Multi-column metric displays reflow to clean single-column or 2x2 key-value cards.

### Layout Principles
- **Airy Framing vs. Dense Interiors:** Layout containers maintain generous perimeter breathing room (`space-xl` or `space-2xl`), while internal data tables utilize compact, calibrated spacing (`space-xs` and `space-sm`) to maximize visible information density without clutter.
- **Hairline Dividers:** Vertical column borders (`1px solid #E2E8F0`) separate summary telemetry from live event logs, preserving structural order without heavy container fills.

## Elevation & Depth

Visual hierarchy is communicated through planar framing, 1px neutral borders, and strictly restrained, low-diffusion ambient shadows.

### Elevation Tiers
- **Tier 0 (Ground Canvas):** `#FBFBFA` flat background. No shadow, zero elevation.
- **Tier 1 (Resting Panel / Card):** `#FFFFFF` surface bounded by a subtle `1px solid #E2E8F0` border. Shadow is nearly imperceptible: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
- **Tier 2 (Active Dropdown / Hovered Tile):** `#FFFFFF` surface with `1px solid #CBD5E1` border and a crisp, light shadow: `0 4px 12px -2px rgba(15, 23, 42, 0.06)`.
- **Tier 3 (Modal / Tactical Overlay / Dispatch Panel):** `#FFFFFF` surface with `1px solid #94A3B8` border and focused structural depth: `0 12px 24px -4px rgba(15, 23, 42, 0.08)`. Backdrops use `#0F172A` at `20%` opacity without heavy blur.

### Depth Rules
- Absolutely no colored ambient shadows or exaggerated neon drop shadows.
- Depth is primarily conveyed by spatial nesting: Canvas (`#FBFBFA`) → Card (`#FFFFFF`) → Inset Table Sub-surface (`#F8FAFC`).

## Shapes

The geometric identity is calibrated to `roundedness: 1` (subtle `rounded-md` corners).

### Geometry Standards
- **Standard Elements (Buttons, Inputs, Cards, Badges):** Fixed at `4px` to `6px` radius (`0.25rem` to `0.375rem`). This imparts a disciplined, surgical, and professional instrument aesthetic.
- **Large Modals and Drawers:** Maximize at `8px` (`0.5rem`).
- **No Pill Radii:** Fully rounded pill shapes (`9999px`) are forbidden for buttons and badges; indicators retain square or minimally softened rectangular geometry to sustain a serious, technical profile.
- **Data Tables & Code Insets:** Hard `2px` or `4px` corners with hairline borders.

## Components

### Buttons
- **Primary:** Filled `#0F4C5C` (Deep Slate Teal) with `#FFFFFF` text. Minimal hover transition to `#0C3C49`. `4px` border radius, `0 1px 2px rgba(0,0,0,0.05)` resting shadow.
- **Secondary / Outline:** Pure `#FFFFFF` background with `1px solid #CBD5E1` border and `#1E293B` text. Hover shifts border to `#94A3B8` and background to `#F8FAFC`.
- **Ghost:** Transparent background, `#475569` text, transitioning on hover to `#F1F5F9`.
- **Destructive:** White surface with `1px solid #FCA5A5` and `#991B1B` text. Active hover shifts to `#FEF2F2`.

### Indicators & Status Badges
- Strictly zero full-bleed, high-saturation color chips.
- Built as light hairline enclosures: `1px solid` border, subtle tinted background (at 6-8% opacity), and deep legible text.
- Example (Priority / Amber): Background `#FEF9EE`, Border `#FDE68A`, Text `#76520E`, accompanied by a `6px` monospaced status indicator or dot.

### Inputs & Field Controls
- Clean `#FFFFFF` fill with `1px solid #CBD5E1`. Internal vertical padding of `0.5rem` (8px) and horizontal padding of `0.75rem` (12px).
- Focus state: Subtle ring in Deep Slate Teal `#0F4C5C` at `1px` offset, avoiding loud browser-default halos.
- Label: Positioned top, rendered in `label-sm` monospaced or `Inter` semi-bold at 12px with slate-gray `#475569`.

### Tabular Data Layout
- Grid headers in uppercase `JetBrains Mono` 11px with `#64748B` slate tint, separated by a bottom `1px solid #CBD5E1`.
- Row heights spacious enough for rapid scanning (`44px` minimum for mobile, `36px` compact for desktop command centers).
- Numerical metrics align right and use tabular figures. Alternating zebra stripes are avoided in favor of thin bottom borderlines (`#F1F5F9`) and immediate hover highlights (`#F8FAFC`).

### Cards & Dossiers
- Canvas: White `#FFFFFF` with `1px solid #E2E8F0` and `0.375rem` radius.
- Card Header: Separated by a hairline horizontal line rather than a background shade shift.
- Action links and export affordances sit cleanly within the right-aligned header sector.

### Incident Status Timeline / Log
- Left-aligned hairline rail in `#E2E8F0` with micro `6px` square or circular node markers.
- Time stamps formatted strictly in UTC or localized ISO via `JetBrains Mono`.