# INK UI REBUILD 001 — Technical Debt Baseline Evidence

STATUS: `G0_BASELINE_EVIDENCE / PASS`

BRANCH: `work/ink-ui-rebuild-001-tech-debt-cleanup`

KNOWN-GOOD PRODUCT BASE:

`d6c28be13cddee0d83b9e7613b5498b06d1f7b0e`

Current main product/source delta from that base: **0 files**.

Geometry Ops 001 is not part of this baseline. Its exact-SHA Runtime `36088550693` timed out in Creative and the branch remains unpromoted.

## Baseline CSS measurements

Measured from `product/source/styles.css` on this cleanup branch before any product mutation.

```text
styles.css characters = 157379
!important = 223

exact selector-definition count:
.topbar = 14
.tool-rail = 9
.inspector = 14
.stage-wrap = 18
.statusbar = 6
.control-row = 12
.inspector-tab = 8
.creative-workspace-panel = 12
```

These exact-selector counts reproduce the UR preflight measurements.

Media-query inventory:

```text
@media blocks = 55
width thresholds observed =
410
440
560
760
761
860
900
980
1120
```

Typography inventory:

```text
font-family authorities observed =
Inter,"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif
Georgia,serif
inherit
var(--font)

hard-coded px font sizes observed =
6
7
8
8.5
9
9.5
10
10.5
11
12
13
14
16
17
```

## Shell / panel authority evidence

Verified in `product/source/web-shell.js`:

```text
Panel Dock click → selectPanel(...)
Window menu panel click → selectPanel(...)

selectPanel(activePanel):
  remembers + syncs
  returns true
  DOES NOT CLOSE

togglePanel(activePanel):
  closePrimaryPanels()
  return true
```

Therefore the user-observed "same Dock button cannot close the panel" has a direct source-level cause and is not a visual-only defect.

Competing right-panel routes currently present in source include:

```text
Panel Dock
contextualAdvancedBtn
inspectorToggle
inspectorEdgeToggle
panel close control
Window menu route
```

## Regression-contract debt

Verified conflict:

```text
qa/core/tests/unit/ui-debt-001-shell-panel-authority-v0.1.test.mjs
  still requires:
  <link rel="icon" href="assets/INK_MARK_SOURCE_W-300.jpg?v=0.1" type="image/jpeg">

qa/core/tests/unit/ui-maint-002-readability-panel-favicon-v0.1.test.mjs
  requires:
  assets/favicon.svg?v=0.1
```

The older test also protects legacy panel presentation contracts. Current browser QA still references `inspectorEdgeToggle` / `inspectorToggle`.

These assertions must be replaced with the accepted new contract, not weakened.

## Brand / delivery baseline

Generated Web and Portable shells currently both reference:

```text
assets/favicon.svg
assets/INK_MARK_SOURCE_W-300.jpg
```

Service worker baseline:

```text
PRODUCT_VERSION = 0.1
BUILD_ID = 20260924-ui-006-main-r1
```

Service-worker shell inventory includes:

```text
assets/INK_MARK_SOURCE_W-300.jpg
assets/ink-mark.svg
assets/favicon.svg
```

Final visible-logo asset authority is therefore not yet singular. G7 remains asset-contract work; exact user-approved logo replacement must not be guessed.

## DOM baseline

Static `shell.template.html` duplicate literal id scan:

`duplicate IDs = 0`

This must remain zero.

## Health contract

Every later cleanup checkpoint must compare against this file.

A cleanup is not accepted merely because the new UI looks correct.

Required final direction:

```text
obsolete QA contracts ↓ to 0
visible panel state owners → 1
application menu controller → 1
first-paint authority → 1
normal UI font-family authority → 1
normal UI type scale authority → 1
core repeated selector definitions materially ↓
!important materially ↓
responsive taxonomy → DESKTOP_WIDE / DESKTOP_NARROW / COMPACT
brand contract → singular / explicit
duplicate DOM ids = 0
Web / Portable parity = PASS
full Runtime = PASS
```

No Photoshop visual rebuild is authorized until final cleanup evidence reaches `UI_FOUNDATION_DEBT = PASS`.
