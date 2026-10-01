# INK Shared Micro-Module Normalization — bounded DEV result (2026-10-01)

Status: bounded implementation and focused local verification; USER review required. No final Photoshop fidelity or UI-completion declaration.

## Authority and source identity

- Dispatch: `ACTIVE/INK_UI_MICRO_MODULE_NORMALIZATION_DEV_DISPATCH_v1.0.md`.
- Design: PS Instance Dataset, Micro-Module Grammar, PS Alignment Master Guide; current Work Order; engineering guardrails and outside-in inspection standard.
- Original product source: `58f7435374dbbd42cd74d5ef31440e3de1de908f`.
- UI authority checkpoint: `0222ea071f9c25692fceae183877865898bc2c7d`. Its added capability-exposure instruction was read during this pass, before the additional parameter-exposure mutations. The first visual normalization preceded that newly published instruction; this sequence is recorded rather than rewritten as a pre-existing audit.
- USER UIE-00…06 pack and original PS-1/2/3 inspected. Retired PvsI images are excluded. Embedded old INK screenshots identify provenance only.
- All 273 source-file SHA-256 values are in [health.json](evidence/ink-ui-normalization-20261001/health.json). Untouched source files match original bytes. Only seven UI files change; Core, handlers, format, Service Worker and runtime build IDs are preserved.
- Main advanced with research-only commit `361ebc21ae6917b23031180bfd1b7b8fa278cfde`; the diff was revalidated and retained. No product/UI-authority changed.
- Commit identity is the Git commit containing this report. GitHub main/tree is used as the parent; unrelated concurrent documentation is retained.

## What changed

One shared token and primitive authority is located at the existing typography authority in `styles.css`; covered old declarations are removed in the same pass. This does not append ten final override patches.

| Surface | Result |
|---|---|
| Typography / gray | Semantic type roles; shared border/hover/active/scrollbar aliases; ordinary parameter text uses regular weight |
| Dividers / panels | Ordinary 1px separators remain distinct from the 3px stack splitter; strong group boundaries retained; transparent parameter groups replace redundant card frames |
| Tools | One two-column/single-column grid; short-height scrolling belongs to tool group; swatches/reset/swap/footer fit inside single rail |
| Parameters | Shared light fields/actions and active/disabled feedback remove remaining dark local form treatments; numeric roles use shared control heights |
| Scroll / slider | Rectangular scrollbars; one thin-track circular-thumb parameter range authority; document-scrollbar ranges retain their distinct navigation semantics |
| Window / strips / glyphs | Shared geometry tokens; crisp SVG collapse and three-line panel-menu symbols replace Unicode copies; existing unavailable window actions remain disabled |
| Reference | Remove bold boxed readouts, green primary button, card fill and range frame; normal and scrolled states checked |
| Edit | Existing duplicate labeled 建立副本; delete grouped with it; existing four transform commands and shortcuts grouped before Preferences; adjustments belongs to Image; IDs/handlers preserved; no fake clipboard command |
| Layers | Shared 35px row pitch, normal text, strong group boundary, unboxed appearance controls and consistent footer glyph; selection/lock/visibility/drag/delete/undo exercised |
| Capability assembly | Context-specific consumed-field metadata replaces nine raster parameter branches; missing opacity/hardness/tolerance exposed and unused fields removed; active drawing Options survive residual selection; existing Properties tab refreshes selected object |

Capability routes, existing authorities, tool/command inventory and newly exposed parameters are in [capability-surface-matrix.json](evidence/ink-ui-normalization-20261001/capability-surface-matrix.json). Persistent selected-text line height uses `updateTextObject` through the existing scoped History route. Brush extras use `updateBrushSetting`; raster fields use the existing controller `setOption`. No new command or state owner is introduced. Blender/Smudge remain the existing session workflow rather than pretending to be new direct canvas tools.

## Exact technical-debt accounting

| Metric | Before → after / change |
|---|---|
| `!important` | 116 → 104; new = 0; 104 retained items remain debt |
| Width breakpoint boundaries | 1120 / 760 / 761 → unchanged; new family = 0 |
| Shared tokens | 60 consolidated: 30 added, 17 changed, 13 retained |
| Shared primitive families | 10 (enumerated in health.json) |
| Legacy declarations removed | 935 across 170 selector identities; exact removal manifest linked below |
| Duplicate authority families consolidated | 5: parameter visual roles, range track/thumb, scrollbar, Tools grid, collapse/menu/window glyph geometry |
| Parameter renderer duplication | 9 inline branches → one metadata renderer |
| Literal `font-size:…px` declarations | 28 → 0 |
| New one-off color literals | 0; new gray values/aliases live in shared tokens |
| New one-off geometry literals | 0; new component measurements live in shared tokens/primitives; SVG path coordinates and capability numeric bounds are not CSS one-off geometry |
| New state authority / fake affordance | 0 / 0; unused existing raster affordances removed |

[removed-declarations.json](evidence/ink-ui-normalization-20261001/removed-declarations.json) lists every removed selector/property/value. Geometry literals inside reusable primitives (hairlines, icon path coordinates) are not counted as local patch geometry. The migration and primitive-input files are audit evidence only; product HTML does not load them.

## Current verification

42 focused assertions passed on the final product bytes; 40 tool contexts inventoried, 11 menus opened, 11 panel tabs inspected, six Preferences categories exercised, 26 candidate state screenshots. These counts describe this bounded inspection, not full capability coverage.

Fresh baseline and candidate captures use the same 1280×1024 / DPR 1 Chromium environment with QA-only Noto Sans TC 400 registration. Also exercise 960×800, short 960×500, compact 390×844. CPU rasterization/Canvas fallback avoids duplicate compositor fragments seen in the environment's SwiftShader screenshots; those exploratory fragments/failures are not accepted visual evidence. No exact Windows/CJK raster or GPU claim is made.

- Empty/active; Tools dual/single; right Dock collapsed/expanded; splitter resizing.
- Reference normal/details/scroll; all existing range instances enumerated; scrollbar computed geometry and screenshot inspection. Native range pseudo computed sizes are not used as thumb measurement evidence.
- Layers add/duplicate/selected/lock/visibility/drag reorder/delete/undo, using actual UI actions and authoritative layer state.
- Edit command IDs and grouping; Preferences width stays 740×540 across all categories.
- Existing raster consumed parameters exposed per tool; numeric edit preserves focus and updates controller state. Brush grain changes native settings. Text creation, line-height mutation, History undo and post-undo selection work. Selected-object → brush keeps drawing Options visible.
- No page/resource errors; compact document width stays within viewport; Tools required utilities fit rail/short viewport.
- `406` product-response records across initial load/reload match the served source bytes. Local service-worker controller is recorded, and cached responses are checked against source. This is a local independent preview identity chain, not evidence of the user's existing deployed session.
- `generate-shell.mjs --check`, JavaScript syntax and `git diff --check` pass. Generated HTML files track the template.

Evidence: [before-browser.json](evidence/ink-ui-normalization-20261001/before-browser.json), [after-browser.json](evidence/ink-ui-normalization-20261001/after-browser.json), [manifest.json](evidence/ink-ui-normalization-20261001/manifest.json).

Representative current pairs: [before active](evidence/ink-ui-normalization-20261001/before-active.png) → [after active](evidence/ink-ui-normalization-20261001/after-active.png); [before single Tools](evidence/ink-ui-normalization-20261001/before-tools-single.png) → [after single Tools](evidence/ink-ui-normalization-20261001/after-tools-single.png); [before Reference](evidence/ink-ui-normalization-20261001/before-reference.png) → [after Reference](evidence/ink-ui-normalization-20261001/after-reference.png); [Edit](evidence/ink-ui-normalization-20261001/after-edit-menu.png); [Preferences](evidence/ink-ui-normalization-20261001/after-preferences.png); [clone Options](evidence/ink-ui-normalization-20261001/after-options-clone.png); [text Properties](evidence/ink-ui-normalization-20261001/after-properties-text.png).

## Inspection limits and remaining differences

- This is implementation-author visual delta review, not an information-isolated independent blind review. Independent blind delta should inspect final screenshots before seeing implementation or old PASS labels.
- Same-class checks sample rendered panels and all tool contexts; the entire 496-atomic inventory and every combination of hover/focus/disabled/selection/imported content has not been individually exercised. Matrix records bounded menu/panel-family routes without declaring universal parameter completeness.
- Scrollbar pseudo geometry is inspectable; circular thumb appearance is supported by CSSOM plus actual screenshots, not misleading native pseudo bounding values.
- Existing specialist/diagnostic badges and metadata density, Properties numeric-transform framing/weights and all content-dependent panel states still deserve independent inspection. No Photoshop-specific unsupported parameters, browser-native window action or clipboard semantics are invented to mimic the reference.
- Fresh deployed bytes and the user's browser-loaded identity have not been verified. No production cache activation, Actions dispatch or central Runtime performed. Historical Runtime PASS is not carried forward as current UI proof.
- Photoshop references differ in OS/font/scale and color palette is not authority; numerical token choices plus current screenshots support this bounded change, not pixel-perfect Photoshop fidelity.

Stop here for USER review of this bounded pass.

## Changed product files

- `product/source/index-standalone.html`
- `product/source/index.html`
- `product/source/shell.template.html`
- `product/source/styles.css`
- `product/source/ui/capability-contributions.js`
- `product/source/ui/full-capability-controls.js`
- `product/source/web-shell.js`
