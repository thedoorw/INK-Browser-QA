# INK UI REBUILD 001 — Photoshop Reference Measurement Sheet v0.1

STATUS: `UR_MEASURED / REFERENCE_LOCK_READY / NO_PRODUCT_CHANGE`

REFERENCE_PACK:
- `ps-1.png` — 1280 × 1024 — SHA256 `9bb8f329df55f6e6617e32e60a138c6cd21451509465073d4821802482815f76`
- `ps-2.png` — 1280 × 1024 — SHA256 `df316d46821c2840acf1dad277dca6442b4b093034b9dd809d6cb4aa917860e2`

PURPOSE:
Turn the two fixed Photoshop captures into a numeric shell/geometry answer key before INK implementation begins.

## 0. Measurement policy

Photoshop contains resizable/dockable panels. A pixel value observed in one screenshot is not automatically a permanent product dimension.

Classification:

- `LOCKED_FIXED` — fixed shell geometry that should be reproduced unless a later reference explicitly supersedes it.
- `ALIGNMENT_RELATION` — an edge/boundary relationship that must remain true even when a panel is resized.
- `REFERENCE_STATE_ONLY` — the exact size in the captured Photoshop state; useful for screenshot matching, but not a permanent min/max/fixed width.
- `OBSERVED_DENSITY` — useful local spacing/pitch evidence; do not promote to a hard contract without a specific interaction need.
- `EXCLUDED_OVERLAY` — visible content that is not part of the workstation shell measurement.

USER rule:

> Resizable Photoshop panels are aligned by boundary/behavior first. Their captured width/height may be used as a reference state but must not become an unnecessary fixed constraint.

## 1. Coordinate normalization

Both source images are 1280 × 1024 desktop screenshots.

The Photoshop application occupies:

```text
x = 0 .. 1279
y = 0 .. 993
size = 1280 × 994
```

The Windows taskbar occupies:

```text
y = 994 .. 1023
height = 30 px
```

Therefore:

`PS_NORMALIZED_APP_CROP = 1280 × 994`

For Photoshop ↔ INK pixel comparison, the OS taskbar must be excluded. Do not compare an INK browser-viewport screenshot against the 30 px Windows taskbar.

## 2. Global vertical shell geometry — common to ps-1 and ps-2

Coordinates use half-open ranges `[start, end)`.

| Surface | Y range | Height | Contract | Notes |
|---|---:|---:|---|---|
| Application/menu row | [0, 24) | 24 px | `LOCKED_FIXED` | Includes Ps mark/menu text/window controls in this capture |
| Divider 1 | [24, 25) | 1 px | `LOCKED_FIXED` | full-width shell divider |
| Contextual options row | [25, 60) | 35 px | `LOCKED_FIXED` | current-tool options |
| Divider 2 | [60, 61) | 1 px | `LOCKED_FIXED` | separates top chrome from workspace |
| Main workstation area | [61, 994) | 933 px | `ALIGNMENT_RELATION` | toolbar + canvas + right dock/panels |
| Windows taskbar | [994, 1024) | 30 px | `EXCLUDED_OVERLAY` | not part of Photoshop UI |

Locked top result:

```text
24 + 1 + 35 + 1 = 61 px
PS_TOP_CHROME_REFERENCE = 61 px
```

## 3. ps-1 horizontal geometry — double toolbar + expanded right panels

Observed shell equation:

```text
72 + 1 + 954 + 1 + 252 = 1280
```

| Surface | X range | Width | Contract | Notes |
|---|---:|---:|---|---|
| Left toolbar — double column | [0, 72) | 72 px | `REFERENCE_STATE_ONLY` + `ALIGNMENT_RELATION` | captured double-column state |
| Left/canvas divider | [72, 73) | 1 px | `LOCKED_FIXED` | edge must remain crisp |
| Central workspace/canvas | [73, 1027) | 954 px | `DERIVED_STATE` | remaining width after side regions |
| Canvas/right divider | [1027, 1028) | 1 px | `LOCKED_FIXED` | panel boundary |
| Right expanded panel stack | [1028, 1280) | 252 px | `REFERENCE_STATE_ONLY` | resizable; **not a fixed INK width** |

Alignment contracts:
- left toolbar touches the left app edge;
- central workspace begins immediately after one divider;
- expanded panel stack touches the right app edge;
- central workspace ends immediately before one divider;
- no floating gap exists between toolbar/canvas/panel regions.

## 4. ps-2 horizontal geometry — single toolbar + collapsed right dock

Observed shell equation:

```text
39 + 1 + 1200 + 1 + 39 = 1280
```

| Surface | X range | Width | Contract | Notes |
|---|---:|---:|---|---|
| Left toolbar — single column | [0, 39) | 39 px | `REFERENCE_STATE_ONLY` + `ALIGNMENT_RELATION` | captured single-column state |
| Left/canvas divider | [39, 40) | 1 px | `LOCKED_FIXED` | |
| Central workspace/canvas | [40, 1240) | 1200 px | `DERIVED_STATE` | |
| Canvas/right divider | [1240, 1241) | 1 px | `LOCKED_FIXED` | |
| Right collapsed icon dock | [1241, 1280) | 39 px | `REFERENCE_STATE_ONLY` + `ALIGNMENT_RELATION` | Photoshop collapsed dock state |

Important relation:

```text
single left tool rail observed width = 39 px
collapsed right dock observed width  = 39 px
```

This symmetry is a useful Photoshop reference, but INK acceptance should still prioritize edge alignment and usable interaction over blindly forcing all future dock states to 39 px.

## 5. Left toolbar local geometry

Common vertical structure in both captures:

| Surface | Y range | Height | Contract |
|---|---:|---:|---|
| toolbar top collapse/handle strip | [61, 72) | 11 px | `OBSERVED_DENSITY` |
| toolbar local divider | [72, 73) | 1 px | `LOCKED_FIXED` |
| tool body | [73, 993) | 920 px | `ALIGNMENT_RELATION` |
| toolbar bottom border | [993, 994) | 1 px | `LOCKED_FIXED` |

Tool-cell evidence:
- selected-tool fill in `ps-2`: x=4..34, y=116..139 → 31 × 24 px visible fill;
- same selected-tool fill class in `ps-1`: x=37..67, y=90..113 → 31 × 24 px visible fill;
- observed vertical tool-row pitch ≈ 26 px;
- observed double-column horizontal origin shift ≈ 33 px.

Classification:

`OBSERVED_DENSITY`

These values guide icon/button density; they are not yet independent hard contracts for every future tool cell.

## 6. Right panel / dock local geometry

### 6.1 Collapsed state — ps-2

Outer captured dock:

```text
x = [1241, 1280)
width = 39 px
```

Local top structure:
- top collapse/handle strip: y=[61,72) → 11 px;
- local divider: y=[72,73) → 1 px;
- icon region continues below.

Contract:
- `REFERENCE_STATE_ONLY` for exact width;
- `ALIGNMENT_RELATION` for edge attachment, vertical continuity and same-panel open/close behavior.

### 6.2 Expanded stacked-panel state — ps-1

Outer captured panel stack:

```text
x = [1028, 1280)
width = 252 px
inner content width ≈ 250 px between 1 px side borders
```

This width is `REFERENCE_STATE_ONLY`.

Visible stacked panel groups in the reference state:

| Region | Y range | Height | Contract |
|---|---:|---:|---|
| panel group A | [73, 342) | 269 px | `REFERENCE_STATE_ONLY` |
| splitter A/B | [342, 345) | 3 px | `OBSERVED_DENSITY` |
| panel group B | [345, 606) | 261 px | `REFERENCE_STATE_ONLY` |
| splitter B/C | [606, 609) | 3 px | `OBSERVED_DENSITY` |
| panel group C | [609, 993) | 384 px | `REFERENCE_STATE_ONLY` |
| bottom border | [993, 994) | 1 px | `LOCKED_FIXED` |

Panel-tab/header bands observed:
- group A header: [73,101) → 28 px;
- group B header: [345,373) → 28 px;
- group C header: [609,637) → 28 px.

Header height is currently `OBSERVED_DENSITY`, not a permanent panel-height lock.

The vertical group heights and 252 px expanded width may change when the user drags/resizes panels. INK must reproduce the resizing/docking grammar, not freeze the screenshot.

## 7. Central workspace geometry

The central dark workspace is the remainder between the left and right edge-attached UI.

Reference states:

| Capture | Canvas X | Width | Canvas Y | Height |
|---|---:|---:|---:|---:|
| ps-1 | [73,1027) | 954 px | [61,994) | 933 px |
| ps-2 | [40,1240) | 1200 px | [61,994) | 933 px |

Contract:
- `DERIVED_STATE` for exact width;
- `ALIGNMENT_RELATION` for all boundaries.

Rule:

```text
canvas width = available workstation width
             - left edge UI
             - left divider
             - right divider
             - current right dock/panel width
```

No implementation should hard-code the 954 px or 1200 px canvas widths.

## 8. Reference gray roles — geometry-reading aid only

The source screenshots use a dark Photoshop theme. INK's target is the USER-requested light-gray Photoshop version, so these colors are **not target palette locks**.

Dominant source roles measured from the screenshots:
- menu/options/toolbar/panel base ≈ RGB(83,83,83) / #535353;
- canvas ≈ RGB(38,38,38) / #262626;
- major divider ≈ RGB(56,56,56) / #383838;
- boundary highlight ≈ RGB(71,71,71) / #474747;
- local top strip ≈ RGB(66,66,66) / #424242.

Use these only to detect boundaries in the dark references. The light-gray INK palette must preserve hierarchy, not copy these RGB values.

## 9. Capture-specific exclusions

### ps-1
Valid for:
- double-column toolbar geometry;
- expanded/right stacked panels;
- panel headers/splitters;
- full shell boundaries.

### ps-2
Valid for:
- single-column toolbar geometry;
- collapsed right icon dock;
- full shell boundaries.

The centered Photoshop About dialog in ps-2 is:

`EXCLUDED_OVERLAY`

It must not influence canvas shell measurements.

## 10. Fixed vs elastic answer key

### Hard / structural targets

```text
TOP MENU = 24
DIVIDER = 1
OPTIONS = 35
DIVIDER = 1
TOP CHROME TOTAL = 61

left UI touches left edge
right UI touches right edge
canvas fills the remainder
toolbar/canvas boundary = one crisp divider
canvas/right boundary = one crisp divider
no accidental shell gap/overlap
```

### Elastic / state targets

```text
left single rail observed = 39
left double rail observed = 72
right collapsed dock observed = 39
right expanded panel observed = 252
stacked panel heights observed = 269 / 261 / 384
```

Elastic values are used for reference screenshot matching and initial defaults only where appropriate. They do not override resizable/dockable Photoshop behavior.

## 11. Acceptance comparison geometry

For later INK comparison:

1. normalize Photoshop to `1280 × 994` app crop;
2. run INK at the explicitly recorded viewport;
3. compare major shell edges first;
4. compare fixed heights/dividers;
5. compare the matching toolbar state (single or double);
6. compare the matching right-side state (collapsed or expanded);
7. do not fail a resizable panel merely because the user has dragged it to a different valid width;
8. fail if resizing breaks docking, canvas fill, edge continuity, panel toggle/switch behavior, or introduces overlap/gaps.

## 12. Measurement lock result

```text
REFERENCE_FILES_IDENTIFIED = PASS
SOURCE_HASHES_RECORDED = PASS
PS_APP_CROP_IDENTIFIED = PASS
TOP_CHROME_61PX = LOCKED
GLOBAL_DIVIDERS = LOCKED
LEFT_SINGLE_REFERENCE = 39PX / ELASTIC_STATE
LEFT_DOUBLE_REFERENCE = 72PX / ELASTIC_STATE
RIGHT_COLLAPSED_REFERENCE = 39PX / ELASTIC_STATE
RIGHT_EXPANDED_REFERENCE = 252PX / ELASTIC_STATE
CANVAS_BOUNDARY_RELATIONS = LOCKED
PANEL_RESIZABILITY_NOT_OVERRIDDEN = PASS
PS_1_PS_2_ROLE_SEPARATION = PASS
PRODUCT_MUTATION = 0
```

Result:

`PS_REFERENCE_MEASUREMENT_SHEET_v0.1 = LOCK_READY`
