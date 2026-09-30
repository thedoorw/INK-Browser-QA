# INK UI — PvsI Pixel Alignment Evidence v1.0

STATUS: EXECUTED / USER_INSPECTION_REQUIRED / UI_COMPLETE_NOT_DECLARED
DATE: 2026-09-30
TASK: INK-UI-PVSI-PIXEL-ALIGNMENT-001

## 1. Identity

```text
PARENT_MAIN = 7b533e4ba6b933fc2fa03e1d7878c1d6a7f90f3b
TARGET_IMPLEMENTATION_COMMIT = 049fc0dfbed9227dc3ef84b9b0b343731bf68066
PRODUCT_MUTATION = product/source/styles.css only
FORMAT_VERSION = 4 / unchanged
CORE_CAPABILITY_AUTHORITY = unchanged
```

Reference authority:
- `reference/ui/photoshop/PvsI-1.png`
- `reference/ui/photoshop/PvsI-2.png`
- `reference/ui/photoshop/PvsI-3.png`

Direct USER-provided mirrors inspected in this execution are all 1920×1080 raster composites.

## 2. Normalization

The PvsI composites visibly contain Photoshop at a document-view zoom of 66.67%; they are therefore not treated as 1 raster pixel = 1 CSS pixel.

Stable Photoshop anchors from the PvsI pack and its canonical measurement provenance are normalized to:

```text
PS_APPLICATION_CROP = 1280 × 994
MENU_CONTENT = 24 px
DIVIDER_1 = 1 px
OPTIONS_CONTENT = 35 px
DIVIDER_2 = 1 px
WORKSTATION_Y = 61 px
```

Browser zoom / Windows display scaling of the embedded INK raster cannot be recovered reliably from the composite screenshots. No raw cross-screenshot scale assumption was used. Effective CSS geometry is compared after normalization to the shared anchors.

The normalized vector overlay used for the difference pass is:
`working/INK_UI_PVSI_PIXEL_ALIGNMENT_GEOMETRY_OVERLAY_v1.0.svg`.

## 3. Before / after delta table

All values below are normalized CSS px. Negative/positive before deltas are relative to the Photoshop target.

| Element | Reference | Before | Before delta | After | Residual |
|---|---:|---:|---:|---:|---:|
| menu content height | 24 | 24 | 0 | 24 | 0 |
| menu/options divider | 1 | 1 | 0 | 1 | 0 |
| Options content height | 35 | 35 | 0 | 35 | 0 |
| workstation origin Y | 61 | 61 | 0 | 61 | 0 |
| Tools double outer width incl. divider | 73 | 73 | 0 | 73 | 0 |
| Tools single outer width incl. divider | 40 | 40 | 0 | 40 | 0 |
| Tools top strip incl. divider | 12 | 15 | +3 | 12 | 0 |
| Tools selected cell fill | 31×24 | 31×24 | 0 | 31×24 | 0 |
| dual Tools row pitch | 26 | 28 | +2 | 26 | 0 |
| dual Tools column pitch | 33 | 33 | 0 | 33 | 0 |
| foreground/background swatch | 18×18 | 22×22 | +4 | 18×18 | 0 |
| swatch overlap X/Y | 10 / 10 | 10 / 10 | 0 | 10 / 10 | 0 |
| expanded right stack width | 252 | 252 | 0 | 252 | 0 |
| right stack top strip incl. divider | 12 | 12 | 0 | 12 | 0 |
| Group A height @1280×994 | 269 | 265.35 | −3.65 | 268.99934 | −0.00066 |
| splitter A/B | 3 | 3 | 0 | 3 | 0 |
| Group B height @1280×994 | 261 | 256.20 | −4.80 | 261.00184 | +0.00184 |
| splitter B/C | 3 | 3 | 0 | 3 | 0 |
| Group C height @1280×994 | 384 | 393.45 | +9.45 | 383.99882 | −0.00118 |
| right stack bottom boundary | 1 | 0 | −1 | 1 | 0 |
| panel header/tab band | 28 | 28 | 0 | 28 | 0 |
| Navigator body @reference Group A | 208 | 209.35 | +1.35 | 208.00 | 0 |
| Navigator footer | 33 | 28 | −5 | 33 | 0 |
| Layers row pitch | 35 | 35 | 0 | 35 | 0 |
| Layers footer total | 25 | 30 | +5 | 25 | 0 |
| common bordered Options input/select | 21 | 24 | +3 | 21 | 0 |
| ruler thickness | 17 | 17 | 0 | 17 | 0 |
| active-document status height | 17 | 17 | 0 | 17 | 0 |

### Panel ratio derivation

At the normalized 994 px application height:

```text
stack outer height = 994 - 61 = 933
edge strip = 12
splitters = 3 + 3
bottom boundary = 1
group content = 933 - 12 - 6 - 1 = 914
target = 269 + 261 + 384 = 914
```

New default flex-basis ratios are:
- Overview: 29.431%
- Creative: 28.556%
- Structure: 42.013%

Computed maximum residual from these ratios is 0.00184 CSS px before browser raster rounding.

## 4. Mutation performed

`product/source/styles.css`:
- removed the extra 3 px Tools top-strip margin;
- removed the 2 px vertical dual-Tools grid gap;
- reduced foreground/background swatches 22→18 px while retaining the 10 px overlap;
- added the missing right-stack bottom 1 px boundary;
- corrected default A/B/C stack proportions to the 269/261/384 reference state;
- corrected Navigator footer 28→33 px, yielding the 208 px reference body;
- corrected Layers footer 30→25 px;
- corrected common bordered contextual input/select height 24→21 px.

No Core state owner, panel controller, tool authority, FORMAT_VERSION, CHAT tool surface, or product capability was removed or replaced.

## 5. Remaining deltas / disposition

```text
MAX_COMPUTED_SHARED_GEOMETRY_RESIDUAL = 0.00184 CSS px
INTEGER_SHARED_EDGES = 0 CSS px residual in source-computed reference state
EXPECTED_BROWSER_RASTER_ROUNDING = <= 1 CSS px
POST_DEPLOY_RENDER_RESIDUAL = USER_INSPECTION_REQUIRED
```

Remaining non-numeric differences:
- light palette vs Photoshop dark palette: USER_OVERRIDE;
- font anti-aliasing / raster glyph edge differences: PLATFORM_RENDERING;
- exact icon visible envelopes and scrollbar raster widths inside the 66.67% PvsI composites cannot be converted to trustworthy CSS px without a native-scale post-deploy capture: REFERENCE_SCALE_LIMIT / do not invent;
- persisted user-resized right-panel width may override the 252 px default; use the panel menu “reset width” command when inspecting the canonical default state: VALID_USER_STATE.

## 6. USER inspection state

After GitHub Pages serves `049fc0dfbed9227dc3ef84b9b0b343731bf68066` or later evidence-only HEAD, refresh and inspect:

1. desktop default dual Tools: first tool row begins immediately after the 11+1 px collapse strip; repeated row pitch is 26 px;
2. lower-left foreground/background colors: each swatch 18×18 with 10×10 overlap;
3. expanded right panels at default/reset width 252 px: Navigator / Reference / Layers stack boundaries align to 269 / 261 / 384 at a 1280×994 normalized viewport;
4. Navigator: 28 px header, 208 px body, 33 px footer;
5. Layers: 35 px layer rows and 25 px bottom action footer;
6. contextual Options Bar: bordered input/select controls are 21 px high;
7. drag right-panel splitters and width resizer once to confirm interaction remains live after the default-geometry correction.

No UI completion declaration is made by this evidence.
