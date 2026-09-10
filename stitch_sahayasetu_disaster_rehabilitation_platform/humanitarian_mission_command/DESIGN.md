---
name: Humanitarian Mission Command
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#40484c'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#70787d'
  outline-variant: '#bfc8cd'
  surface-tint: '#1e667f'
  primary: '#004357'
  on-primary: '#ffffff'
  primary-container: '#0d5c75'
  on-primary-container: '#93d3ef'
  inverse-primary: '#90cfec'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#004730'
  on-tertiary: '#ffffff'
  tertiary-container: '#006142'
  on-tertiary-container: '#6bdeac'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bde9ff'
  primary-fixed-dim: '#90cfec'
  on-primary-fixed: '#001f2a'
  on-primary-fixed-variant: '#004d64'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  data-metric:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter-xs: 0.25rem
  gutter-sm: 0.5rem
  gutter-md: 1rem
  gutter-lg: 1.5rem
  gutter-xl: 2rem
  gutter-2xl: 3rem
  margin-mobile: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  touch-target-min: 3rem
---

## Brand & Style

This design system is formulated for high-stakes humanitarian relief coordination, rapid volunteer deployment, and long-term socio-economic rehabilitation. The interface must communicate unwavering structural stability, operational readiness, and high-legibility clarity under extreme cognitive load.

Field workers, district relief officers, and displaced beneficiaries operate under severe constraints: glaring outdoor sunlight, erratic mobile network coverage, low-tier displays, and sustained fatigue. Therefore, the visual language avoids frivolous ornament in favor of a structured utilitarian aesthetic. The design relies on high-contrast surfaces, rigid functional compartmentalization, tactile touch affordances, and unmistakable status signifiers. The balance balances decisive, urgent mobilization with calm, reassuring recovery indicators.

## Colors

The color palette is built for rapid optical triage and strict sunlight contrast ratios exceeding WCAG AAA standards for critical controls.

- **Primary (`#0D5C75`)**: Deep Emergency Teal. Communicates state-level logistics, authoritative coordination, and resilient governance. Used for primary navigation rails, primary action commands, confirmed jurisdiction boundaries, and key structural headers.
- **Secondary (`#D97706`)**: Safety Ochre. Applied to urgent skill shortages, immediate volunteer dispatch calls, high-priority evacuation requests, and critical triage notifications. Never used decoratively.
- **Tertiary (`#059669`)**: Forest Green. Designates successful placements, delivered rations, operational camps, and finalized rehabilitation grants.
- **Neutral (`#0F172A`)**: Deep Slate. Anchors all primary typographic hierarchy, borders, and dense operational grids against high-glare backdrops.

### Surface Tones & Status Tiers
- **Background Canvas**: `#F8FAFC` (Slate 50) for maximum daylight readability without harsh pure-white eye strain.
- **Surface Elevation**: `#FFFFFF` with `#E2E8F0` micro-borders (1px solid) to compartmentalize critical data units.
- **Muted Elements**: `#475569` (Slate 600) for metadata stamps, GPS timestamps, and non-critical label prefixes.
- **Urgent Danger/Hazard**: `#DC2626` (Red 600) strictly reserved for live structural hazards, medical escalations, and critical quota failures.

## Typography

The typographic hierarchy uses **Plus Jakarta Sans** for structural headers and high-visibility data metrics to maintain distinct geometric definition, while **Inter** delivers maximum screen legibility across dense data tables, rapid triage lists, and form-heavy intake flows.

All metrics, emergency wages, survivor counts, and volunteer quotas must employ tabular figures (`font-variant-numeric: tabular-nums`) to prevent optical jitter during live real-time synchronization. Letter spacing on uppercase operational tags and jurisdiction badges is slightly expanded to guarantee legibility at small sizes on ruggedized field hardware.

## Layout & Spacing

This design system uses a strict 8pt grid with 4pt sub-divisions for atomic controls, badges, and inline tabular cells. 

### Fluid Layout Architecture
- **Desktop (Command Centers, ≥1280px)**: 12-column fluid grid, 24px gutters, 32px outer safe margins. Supports split views: real-time GIS map layers paired with high-density candidate verification queues.
- **Tablet (Field Camp Intake, 768px - 1279px)**: 8-column layout, 16px gutters, 24px margins. Dual-column card layouts collapse into single vertical workflows for offline cache synchronization.
- **Mobile (Volunteer Handheld, ≤767px)**: 4-column layout, 12px gutters, 16px margins. Dense stacks switch to full-width horizontal controls.

All touch interaction surfaces (buttons, chip selectors, status toggles, expandable list items) enforce a minimum touch target height of 48px (`touch-target-min: 3rem`) to allow error-free physical operation under adverse weather, rain splatters, or while wearing rescue gloves.

## Elevation & Depth

To maximize battery life on field tablets and maintain high contrast in outdoor sunlight, elevation relies on **low-contrast micro-outlines and tonal separation** rather than diffuse drop shadows.

- **Base Layer (L0)**: Ground canvas `#F8FAFC`.
- **Card Surface (L1)**: Pure white `#FFFFFF` bounded by a crisp 1px solid border of `#E2E8F0`. No ambient drop shadows.
- **Interactive Focus / Drawer Overlays (L2)**: Pure white `#FFFFFF` paired with an outline of `#0D5C75` (2px) and a tight, high-contrast offset shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)`.
- **Urgent Intervention / Alert Banner**: Tinted container backgrounds (e.g., Amber-50 `#FFFBEB` with `#F59E0B` 1.5px solid border) to signal situational priority without obscuring visual flow.

## Shapes

The design system adopts a soft, compact radius philosophy (`roundedness: 1`). 

- Default structural panels, cards, inputs, and command buttons feature **4px (`0.25rem`)** border radiuses. This avoids visual playfulness and maximizes available display screen real estate for dense multi-field records.
- Badges, status pills, and categorical calamity tags deviate with **full pill radius (`9999px`)** to distinctly segregate meta-information from actionable inputs and operational containers.

## Components

### 1. Buttons
- **Primary Action (Mobilize / Dispatch / Verify)**: Background `#0D5C75`, text `#FFFFFF`, 4px border radius. Padding: 12px 20px. Height: 48px. State changes rely on solid color shifts (Hover: `#083344`, Active: `#05222E`).
- **Urgent Callout (Critical Shortage)**: Background `#D97706`, text `#FFFFFF`. Used strictly for time-sensitive SOS job assignments and emergency supply requests.
- **Secondary / Offline Actions**: Background `#FFFFFF`, text `#0F172A`, 1px solid border `#CBD5E1`.

### 2. Multi-tenant Jurisdiction & Role Badges
- High-contrast, dense micro-pills with monospaced regional identifiers.
- **Locked District**: Border 1px solid `#94A3B8`, background `#F1F5F9`, text `#334155`. Displays locked padlock icon with format: `District: KL-WYD-2024 [Locked]`.
- **Calamity Triage Badges**:
  - *Flood*: Background `#E0F2FE`, border `#7DD3FC`, text `#0369A1`.
  - *Landslide*: Background `#FEF3C7`, border `#FCD34D`, text `#B45309`.
  - *Cyclone*: Background `#F3E8FF`, border `#D8B4FE`, text `#6B21A8`.

### 3. Skill & Qualification Chips
- Multi-select interactive pills with 36px height.
- **Unselected**: Surface `#FFFFFF`, border 1px solid `#CBD5E1`, text `#334155`.
- **Selected**: Surface `#E6FFFA`, border 1.5px solid `#0D5C75`, text `#0D5C75`, with right-aligned dismiss/check icon.

### 4. Cards & Case Record Blocks
- Modern flat architecture with 1px border `#E2E8F0`. Divided into clear semantic regions: Header zone (beneficiary name, triage level, live timestamp), Body zone (verified skills, physical capability indicators, camp location), and Persistent Action Footer (dispatch trigger, identity biometric check).

### 5. Input Fields
- Minimum height 48px. 1px `#CBD5E1` border with `#FFFFFF` background. High-contrast typography in `#0F172A`.
- Active/Focused: 2px ring in `#0D5C75`. Includes dedicated input states for low-bandwidth indicators and offline-queued indicators.

### 6. Dense Recovery Data Tables
- Row height: 52px. Zebra striping with `#F8FAFC` and `#FFFFFF`.
- Headers are sticky, typeset in uppercase `label-sm`, tracking wide with `#475569`.
- Numeric metric columns align right using tabular figures. Quick action triggers (Approve, Assign, Flag) persist on the row without requiring dropdown nesting.