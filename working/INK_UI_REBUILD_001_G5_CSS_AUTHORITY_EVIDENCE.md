# INK UI REBUILD 001 — G5 CSS Shell Authority Evidence

STATUS: `G5_CSS_SHELL_AUTHORITY / SOURCE_PASS`

Checkpoint SHA:

`8d686989fd0c71c0f2319f93e73d72455c7388af`

## Method

No late override block was added.

All exact core-selector rules inside every existing `@media(min-width:761px)` block were collected in source order, their declarations were merged using normal last-declaration-wins semantics, and the resulting rule was moved into the existing:

`INK-UI-DEBT-001 — SINGLE DESKTOP SHELL AUTHORITY`

Historical exact desktop rules were deleted.

Mobile / narrow breakpoint rules were intentionally left untouched for G6.

## Desktop authority result

Inside the accepted desktop authority region:

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

## Whole-file exact selector movement

G0 → G5:

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

The remaining duplicates are predominantly mobile/narrow/responsive contracts and are owned by G6.

Other source health:

```text
styles.css chars:
  G0 = 157379
  G5 = 157817
  note: semantic typography tokens added in G4; duplicate desktop rule bodies removed in G5

!important:
  G0 = 223
  G5 = 220

CSS brace balance = PASS
single desktop authority marker = 1
new "final override" marker = 0
forbidden Core mutation = 0
```

QA now asserts exactly one occurrence of each of the eight core selectors inside the accepted desktop authority region.

## Gate result

`G5_CSS_SHELL_AUTHORITY = SOURCE_PASS`

Next:

`G6_RESPONSIVE_AUTHORITY`
