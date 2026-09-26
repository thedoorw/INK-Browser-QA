# INK UI REBUILD 001 — G5 CSS Shell Authority Evidence

STATUS: `G5_CSS_SHELL_AUTHORITY / REVISED_SOURCE_PASS`

Primary authority checkpoint:

`8d686989fd0c71c0f2319f93e73d72455c7388af`

Substantive cascade-health correction:

`f9bf8481f7f0050db47c0c4bc551f154056c2eed`

## Method

No late override block was added.

The earlier G5 pass consolidated exact desktop shell selector authorities but reduced `!important` only `223 → 220`, which MR correctly rejected as non-substantive.

The revision therefore audited every remaining `!important` and removed it from presentation declarations where ordinary source order / selector specificity already provides authority.

Retained `!important` is limited to semantic state visibility and accessibility behavior:

- `display:none` = 14
- `display:flex` = 2
- `display:grid` = 1
- `animation:none` under `prefers-reduced-motion` = 1
- `transition:none` under `prefers-reduced-motion` = 1

No typography, color, background, border, width, height, spacing, shadow or blur declaration retains `!important`.

## Desktop authority result

Inside:

`INK-UI-DEBT-001 — SINGLE DESKTOP SHELL AUTHORITY`

the exact core selector count remains:

```text
.topbar = 1
.tool-rail = 1
.inspector = 1
.stage-wrap = 1
.statusbar = 1
.control-row = 1
.inspector-tab = 1
.creative-workspace-panel = 1
```

Whole-file exact selector movement from G0 remains:

```text
.topbar                  14 → 11
.tool-rail                9 → 6
.inspector               14 → 8
.stage-wrap              18 → 4
.statusbar                6 → 3
.control-row             12 → 6
.inspector-tab            8 → 4
.creative-workspace-panel 12 → 3
```

Remaining whole-file duplicates belong to the accepted responsive taxonomy and are handled under G6; there is still only one desktop authority block.

## CSS health delta

```text
!important:
  G0 baseline       = 223
  original G5       = 220
  revised G5        = 19
  total reduction   = 204 / 91.5%

presentation !important = 0
semantic visibility/accessibility !important = 19

CSS brace balance = PASS
single desktop authority marker = 1
new final-override block = 0
frozen Core mutation = 0
```

Focused QA now enforces:

- `!important <= 19`;
- every retained `!important` must be either semantic `display:none|flex|grid` state or reduced-motion animation/transition suppression;
- presentation properties cannot use `!important`;
- the eight accepted desktop core selectors remain single-authority inside the desktop authority region.

## Gate result

`G5_CSS_SHELL_AUTHORITY = REVISED_SOURCE_PASS`

`G5_IMPORTANT_REDUCTION = SUBSTANTIVE`

`TOUCHED_SHELL_CASCADE_WAR = 0`

`NEW_FINAL_OVERRIDE = 0`

`CORE_MUTATION = 0`

Next:

`G6_RESPONSIVE_AUTHORITY`
