# INK UI REBUILD 001 — G6 Responsive Authority Evidence

STATUS: `G6_RESPONSIVE_AUTHORITY / SOURCE_PASS`

Source checkpoint inherited from the accepted direction:

`f574731b0e920950211f04177826b3ad2ce0157b`

Focused contract checkpoint:

`9e42e74e596a57a5c1ce3e00773cc5bdd3bb0f87`

## Width taxonomy

The only width breakpoints remaining in `product/source/styles.css` are:

```text
1120
760 / 761 boundary
```

Named layout modes:

```text
DESKTOP_WIDE   = width > 1120
DESKTOP_NARROW = 761 <= width <= 1120
COMPACT        = width <= 760
```

`product/source/web-shell.js` exposes the same three-mode authority through `LAYOUT_MODES` and `resolveLayoutMode(width)`.

Pointer, height and reduced-motion queries remain capability/accessibility modifiers and do not create a second width taxonomy.

Removed legacy width-family thresholds remain absent:

```text
980 = 0
900 = 0
860 = 0
560 = 0
440 = 0
410 = 0
```

## Narrow desktop containment source contract

For the 761–1120 range, the existing narrow desktop rules keep primary panels bounded:

```text
.inspector
  width: min(var(--inspector-w), 38vw)
  min-width: min(244px, 38vw)
  max-width: 360px

.creative-workspace-panel
  width: clamp(244px, 38vw, 340px)
```

This is the source-level containment contract for the required 960px Runtime capture.

The default desktop authority remains the source contract for 1280px.

Actual 1280×1024 and 960px visual/browser evidence remains G8 and is not claimed by DEV here.

## Delivery parity

Web and Portable continue to consume the same generated shell/CSS authority.

Focused QA asserts:

- exact three-mode naming;
- exact 760/1120 resolver boundaries;
- no retired width thresholds;
- narrow inspector/workspace containment rules;
- normalized Web / Portable parity.

## Gate result

`G6_RESPONSIVE_AUTHORITY = SOURCE_PASS`

`WIDTH_TAXONOMY = DESKTOP_WIDE / DESKTOP_NARROW / COMPACT`

`NEW_ANONYMOUS_BREAKPOINT_FAMILY = 0`

`G8_VISUAL_CONTAINMENT = PENDING_MR_RUNTIME`

Next:

`G7_BRAND_CONTRACT`
