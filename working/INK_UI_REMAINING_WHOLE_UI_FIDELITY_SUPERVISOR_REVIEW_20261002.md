# INK Remaining Whole-UI Photoshop Fidelity — Supervisor Review

Date: 2026-10-02  
Owner: INK UI Standards Supervisor MR  
Status: FRESH_REVIEW_COMPLETE / PRODUCT_NOT_MODIFIED

## 1. Pinned baseline

- review base: `58adf13cd98a8594eb8e63faedc735ce0c5179f0`
- integrated Combined recovery + C04 checkpoint: `aa01f1e311eb22cb572a61efea19b8bb21a96157`
- accepted product/source tree: `5ccaac62ed85176d69e07a1b72b1cac20c507f87`
- current product/source tree: `18f04e089bac94826b55604e0810d93517504f82`
- compare `aa01f1e3… → 58adf13c…`: product/source changed in `src/agent/capability-registry.js` and `src/editor/chat-bounded-edit.js` only for the concurrent bounded CHAT Paint Session exposure.
- UI authority blobs used by this review are unchanged: `styles.css=ed897bbf…`, `web-shell.js=1bb0d91e…`, `index.html=413f5eb4…`, `capability-contributions.js=bb8e1d1a…`, `full-capability-controls.js=901be6e8…`.
- Current Work Order still says `FINAL_UI_COMPLETE = NO`
- C04 圖紙／手繪板 is retained and is not reopened.
- C06 12800%, Properties clipping, New Document/A4 architecture and Live CHAT exposure remain separate.

Fresh current INK evidence:
- `qa/evidence/combined-promotion-20261002/promotion-main-layout.jpg`
- `qa/evidence/combined-promotion-20261002/promotion-1280-layout.jpg`
- `qa/evidence/combined-promotion-20261002/promotion-deployed-checkpoint.jpg`
- `qa/evidence/combined-promotion-20261002/promotion-post-browser.json`

The promotion evidence explicitly has scope `not whole-UI acceptance`; its prior PASS records are not reused as whole-UI PASS.

Photoshop visual authority:
- `ps-1.png`
- `PS-2.png`
- `PS-3.png`

Retired PvsI composites are excluded as current authority.

## 2. Method

This review follows:

`fresh visual delta → same-class set → numeric geometry → state coverage → source cause → disposition`

Because prior project conclusions are known, this is a fresh delta-first review, not a claim of reviewer-information-isolated blind independence. No previous PASS is carried forward.

## 3. Fresh observed delta

### W01 — top-right window controls

The fresh INK capture does not justify another aesthetic horizontal nudge.

Photoshop reference-raster measurement of the whole cluster:
- outer horizontal bounds approximately `x=1174..1276` on the 1280 px reference;
- outer width approximately `103 px`;
- right inset approximately `3 px`.

Current INK source-computed cluster:
- minimize: `27.5 px`
- restore: `27.5 px`
- close: `46 px`
- outer left/right borders: `2 px`
- computed outer width: `103 px`
- right inset token: `3 px`

This is a numeric source match. It does **not** yet prove 1:1 rendered glyph placement because the fresh JPEG evidence raster is not a normalized 1280×1024 reference-equivalent raster even though browser-state evidence records a 1280×1024 DPR1 viewport.

Disposition:
`NO_GEOMETRY_MOVE_YET / REQUIRE_NORMALIZED_1_TO_1_RENDER_PROOF`

Do not change cluster margin or individual icon offsets until normalized evidence shows a concrete delta.

### O01 — Options Bar contextual home is semantically wrong for native Select/Lasso

Fresh current state shows Options Bar dominated by `全選 / 取消選取` with a large residual blank span.

Source cause is direct:
- `UI_B_NATIVE_OPTION_ROUTES.select = ['select-all','select-clear']`
- `UI_B_NATIVE_OPTION_ROUTES.lasso = ['select-all','select-clear']`
- both commands already exist in the Select menu and use existing handlers.
- `web-shell.js` already supports richer contextual homes for draw, eraser, shape, text, raster tools, path edit and stroke edit.

Therefore the problem is not absence of an Options Bar framework. It is incorrect routing of one-shot duplicate commands into the primary contextual surface.

Disposition:
`FIX_NOW`

Required behavior:
- remove Select/Lasso duplicate one-shot command routing from the Options Bar without deleting handlers or Select-menu routes;
- preserve genuine tool parameters in their contextual home;
- preserve C04 workspace switch at the accepted right-side location;
- do not fill remaining space with unrelated global commands or fake controls;
- residual space is acceptable when a tool genuinely has no parameter surface.

### O02 — Options Bar control-height source mismatch

Photoshop dataset:
- common Options control outer height ≈ `21 px`.

INK source contains:
- `--ui-options-control-height:21px`
- but desktop contextual buttons/selects/inputs currently use generic `--ui-control-height:22px`.

Disposition:
`FIX_NOW`

Use the Options-specific class/token for Options-Bar controls and verify actual border-box height at 1:1. Do not globally shrink panel controls.

### P01 — right-panel outer grammar is largely normalized; inner-row closure remains open

Source trace confirms the following shared geometry already exists:
- panel tab band: `28 px`
- panel padding: `6 px`
- panel options glyph: `10×7 px`
- visible group junction: `1 px`
- resize hit envelope: `5 px`
- Layers row target: `35 px`
- Layers footer: `25 px`
- core panel typography tokens: `11/12 px`, normal weight

These are consistent with the current light-theme authority and therefore must not be broadly redesigned.

Fresh visual evidence still does not close:
- optical row centering;
- same-role label/value baseline consistency;
- Reference/creative parameter-row rhythm;
- Navigator footer/readout rhythm;
- Layers opacity/lock/list/footer vertical rhythm;
- tab label side-space and active/inactive contrast across all three groups.

Disposition:
`MEASURE_FIRST_THEN_FIX_CONFIRMED_OUTLIERS`

Do not globally resize right panels from visual impression alone.

### S01 — same-class icon / tab / collapse / scrollbar source grammar exists, rendered set proof is incomplete

Source trace:
- left and right collapse controls both use `#i-collapse`;
- visible collapse envelope target is `7×5 px`;
- right expanded and collapsed controls both use the same SVG primitive;
- panel options use `#i-panel-menu` with `10×7 px` envelope;
- panel tabs use shared `.panel-stack-tab`;
- panel overflow scrollbars use one rectangular workstation grammar;
- document scrollbars are a separate 16 px document class;
- no pill scrollbar is authorized.

The remaining task is same-class rendered verification and bounded correction of proven outliers, not another independent icon system.

Disposition:
`VERIFY_SET / FIX_ONLY_PROVEN_OUTLIERS`

## 4. Numeric checkpoint

| class | Photoshop authority | latest INK source | status |
|---|---:|---:|---|
| top shell total | ≈61 px | 25 px menu class + 36 px options class = 61 px shell | SOURCE_MATCH |
| window cluster outer width | ≈103 px measured | 103 px computed | SOURCE_MATCH |
| window right inset | ≈3 px measured | 3 px | SOURCE_MATCH |
| Options common control | ≈21 px | 22 px generic applied; 21 px token exists | SOURCE_DELTA |
| panel tab/header band | ≈28 px | 28 px | SOURCE_MATCH |
| panel-menu glyph | ≈10×7 px | 10×7 px | SOURCE_MATCH |
| light-theme visible junction | 1 px approved adaptation | 1 px | SOURCE_MATCH |
| junction hit envelope | ≈5 px | 5 px | SOURCE_MATCH |
| Layers row pitch | ≈35 px class | 35 px token | SOURCE_MATCH |
| panel text visible class | ≈11–12 px | 11/12 px tokens | RENDER_PROOF_REQUIRED |

A source-token match is not a rendered PASS.

## 5. Required fresh state coverage

### Options Bar
Capture at 1280×1024 DPR1:
- neutral Select, no selection;
- Select with object selection;
- draw tool;
- eraser;
- shape;
- text;
- native lasso;
- one raster-selection tool with real parameter fields;
- path edit;
- stroke edit.

For each: visible controls, control homes, row height, group gaps, disabled/focus where applicable, no horizontal overlap, no unrelated global command substitution.

### Right panels
Fresh rendered coverage:
- Group A: Navigator / Properties / Color / Adjustments
- Group B: Libraries / Reference / Compose / CHAT / Revision
- Group C: Layers / History / Channels / Pages
- expanded stack and collapsed dock
- each group panel-options trigger
- one overflow/scroll state per scrollable class
- splitter resize
- outer width resize
- representative normal / hover / active / disabled / focus states
- 960×800 regression check after 1280 closure

### same-class set
One evidence table must enumerate:
- window-control buttons
- panel tabs
- collapse controls
- panel-menu controls
- tool icons in both left toolbar layouts
- panel overflow scrollbars
- document scrollbars
- sliders

No class receives PASS from a single representative member.

## 6. Source-cause constraints

Allowed bounded source areas for a DEV repair:
- `product/source/styles.css`
- `product/source/web-shell.js`
- `product/source/ui/capability-contributions.js`
- `product/source/ui/full-capability-controls.js`
- `product/source/index.html` / generated equivalents only when markup is actually required
- QA/evidence code needed for fresh measurements

Do not touch:
- document/workspace state ownership for C04
- zoom capability for C06
- New Document/A4 architecture
- Properties clipping task
- core render/data semantics
- Live repository promotion

## 7. Acceptance gate

A DEV return is reviewable only if it contains:
1. exact base SHA and candidate SHA;
2. proof that C04 workspace behavior is unchanged;
3. fresh normalized 1280×1024 DPR1 captures;
4. Options-Bar mode matrix;
5. right-panel same-class numeric table;
6. same-class icon/tab/collapse/scrollbar matrix;
7. representative state coverage;
8. source-cause diff;
9. no new `!important`, breakpoint family, duplicate state owner, gray fork or fake affordance;
10. scoped regression at 960×800;
11. no claim that C06, Properties clipping or New Document is solved.

Stop after evidence and return:
`REMAINING_WHOLE_UI_FIDELITY_SUPERVISOR_REVIEW_REQUIRED`

## 8. Supervisor disposition

```text
LATEST_MAIN_RECHECK = 58adf13cd98a8594eb8e63faedc735ce0c5179f0
PRODUCT_SOURCE_CHANGED_SINCE_COMBINED_PROMOTION = YES / NON_UI_AGENT_CHAT_ONLY
UI_AUTHORITY_BLOBS_CHANGED = NO
OLD_WHOLE_UI_PASS_REUSED = NO
WINDOW_CLUSTER_MOVE = NOT_AUTHORIZED_WITHOUT_1_TO_1_DELTA
OPTIONS_CONTEXT_ROUTING = FIX_NOW
OPTIONS_CONTROL_HEIGHT = FIX_NOW
RIGHT_PANEL_OUTER_REDESIGN = NOT_AUTHORIZED
RIGHT_PANEL_INNER_CLASS_CLOSURE = MEASURE_THEN_FIX
SAME_CLASS_RENDER_COVERAGE = REQUIRED
SUPERVISOR_PRODUCT_MUTATION = NONE
```
