# INK Remaining Whole-UI Photoshop Fidelity — DEV Dispatch v1.0

Status: ACTIVE_AFTER_DOC_PROMOTION  
Owner: INK UI Standards Supervisor MR  
Executor: DEV  
Required base: latest main at execution time  
Supervisor review authority: `working/INK_UI_REMAINING_WHOLE_UI_FIDELITY_SUPERVISOR_REVIEW_20261002.md`

## Objective

Close only the remaining whole-UI Photoshop-fidelity work that is still open after Combined recovery + C04.

This task is **not** a broad redesign.

Priority:
1. normalized proof for the top-right window-control cluster;
2. correct Options Bar command/parameter homes and remove duplicate one-shot routing;
3. close Options-specific 21 px control geometry;
4. measure right-panel same-class rows, spacing, separators and typography;
5. fix only numeric/rendered outliers;
6. complete same-class and state-coverage evidence for icon / tab / collapse / scrollbar families.

## Required starting checks

Before editing:
- fetch latest `main`;
- record current product/source tree and compare UI-authority blobs against this Supervisor baseline:
  - styles.css `ed897bbf5f2a6a192d41db334f110696b4cab3c6`
  - web-shell.js `1bb0d91e9a6f1731ef7d17ff64d4ac029b96c522`
  - index.html `413f5eb4c5f1de8baa04b4eabd699e22f23a5fae`
  - ui/capability-contributions.js `bb8e1d1a3a68fecdd2feccfd44f30b1878684aaf`
  - ui/full-capability-controls.js `901be6e89052bc2ea60c5e73ef05da388fd12d6e`;
- read Current Work Order and the Supervisor review;
- inspect fresh deployed capture; do not inherit old PASS;
- keep C04 `圖紙 / 手繪板` behavior intact.

If latest main changes any of the UI-authority blobs above, or changes a source that can alter these rendered UI surfaces, STOP and return:
`BASELINE_CHANGED_SUPERVISOR_RECHECK_REQUIRED`.

A concurrent product/source mutation that is demonstrably outside this UI authority (for example the already-reviewed CHAT/agent mutation on `58adf13c…`) must be recorded but does not itself invalidate this task.

## Scope A — window controls

Reference:
- Photoshop measured whole cluster ≈103 px outer width;
- right inset ≈3 px.

Current source computes the same geometry.

Therefore:
- do not pre-emptively move the cluster;
- first capture normalized 1280×1024 DPR1 INK evidence at 1:1;
- measure cluster outer bounds, three button bounds and visible glyph envelopes;
- compare against `ps-1.png` measurements;
- only change source if a rendered delta is proven;
- move the cluster as one unit;
- no per-icon arbitrary translation.

## Scope B — Options Bar

### B1. Remove incorrect duplicate route

Current source route:
```js
select: ['select-all','select-clear']
lasso:  ['select-all','select-clear']
```

These one-shot commands already have Select-menu homes and handlers.

Required:
- stop presenting these duplicate one-shot routes as the primary default Options-Bar content;
- preserve the commands and their menu/shortcut access;
- preserve existing real contextual parameter homes for draw / eraser / shape / text / raster tools / edit modes;
- do not fill blank space with unrelated commands.

### B2. Options control height

Use the Options-specific `21 px` control class/token for Options-Bar bordered controls rather than the generic `22 px` panel control class.

Do not globally shrink panel controls.

### B3. Coverage

Fresh captures:
- neutral Select / no selection
- Select / selection present
- draw
- eraser
- shape
- text
- lasso
- raster-selection parameter tool
- path edit
- stroke edit

## Scope C — right-panel fidelity

Do not resize the whole stack by intuition.

Existing shared source geometry to preserve unless rendered evidence disproves it:
- 28 px panel tabs
- 6 px panel padding
- 10×7 panel-menu glyph
- 1 px visible group junction
- 5 px resize hit envelope
- 35 px Layers row pitch
- 25 px Layers footer
- normal-weight 11/12 px role tokens

For every visible panel family, collect:
- row border-box height
- control border-box height
- label/value visible baseline or optical center
- intra-row gap
- inter-group separator
- tab side spacing
- normal/active/disabled/focus presentation

Fix only same-class outliers whose difference is not explained by a documented class.

Required panel set:
- Navigator / Properties / Color / Adjustments
- Libraries / Reference / Compose / CHAT / Revision
- Layers / History / Channels / Pages

## Scope D — same-class consistency

Explicitly enumerate and verify:
- left/right collapse controls
- panel-menu controls
- panel tabs
- top-right window controls
- left-toolbar icons in both layouts
- panel overflow scrollbars
- document scrollbars
- sliders

Source reuse alone is not rendered PASS.

## Exclusions

Do not solve or mix in:
- C06 12800% zoom
- Properties clipping
- New Document/A4 architecture
- C04 workspace redesign
- Live repository promotion
- unrelated CHAT runtime work
- new Photoshop-only capabilities not already supported by INK

## Implementation constraints

- fresh branch from latest main;
- no new `!important`;
- no new breakpoint family;
- no duplicate visual/state owner;
- no gray-token fork;
- no text-glyph substitute for controlled SVG icon families;
- no fake affordance;
- preserve IDs/handlers and command semantics;
- keep generated/static shell counterparts synchronized where repository generation rules require it.

## Required evidence

At minimum:
- normalized 1280×1024 DPR1 reference-comparable captures;
- 960×800 regression captures;
- before/after numeric table;
- Options mode matrix;
- right-panel same-class matrix;
- icon/tab/collapse/scrollbar matrix;
- representative state matrix;
- source identity + diff manifest;
- browser-loaded candidate identity;
- scoped interaction smoke tests for moved/re-homed controls.

Tool call success or source token equality is not PASS.

## Return protocol

Commit implementation and evidence to the DEV branch, then STOP.

Return:
`REMAINING_WHOLE_UI_FIDELITY_SUPERVISOR_REVIEW_REQUIRED`

Do not merge to main and do not start C06 / Properties / New Document.
