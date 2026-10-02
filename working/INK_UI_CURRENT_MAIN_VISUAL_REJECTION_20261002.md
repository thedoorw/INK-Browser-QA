# INK UI Current-Main Visual Rejection — 2026-10-02

STATUS: USER VISUAL REJECTION / SUPERVISOR DELTA-FIRST REVIEW

Repository: `thedoorw/INK-Browser-QA`

Evidence:
- USER-supplied 1280×1024 browser screenshot of the deployed GitHub Pages current-main product on 2026-10-02.
- URL shown by USER: `thedoorw.github.io/INK-Browser-QA/product/source/`.
- This review is delta-first and does not reuse historical UI PASS claims.

## 1. Immediate visual findings

### UCV-01 — C04 workspace switch absent from visible desktop UI

Observed:
- no visible `圖紙 / 手繪板` (Layout / Creation) switch in the top shell;
- the Options Bar ends after the current tool controls and then remains empty.

Source cause on current main:
- `#workspaceSwitch` still exists under `.topbar-center`;
- desktop reconstruction CSS contains `.topbar-center{display:none!important}`.

Disposition:
`FIX_NOW`, but behavior cannot be solved by UI-only exposure. Existing C04 two-state authority remains separately open.

### UCV-02 — Options Bar is semantically under-assembled

Observed current selected-tool state:
- visible controls are essentially Home / tool icon / `全選` / `取消選取`;
- most of the 35 px Options Bar is empty;
- there is no meaningful parameter group for the visible selected tool state.

Source trace:
- `UI_B_NATIVE_OPTION_ROUTES.select = ['select-all','select-clear']`;
- the same commands already exist in the Select application menu.

This conflicts with the active grammar:
- Options Bar is contextual/tool-parameter territory;
- one-shot commands normally remain menus/dialogs;
- duplicated visible command homes require explicit justification.

Disposition:
`FIX_NOW` through the Capability → UI Surface Matrix, not by filling space decoratively.

### UCV-03 — accepted post-SUP11 UI refinement is not current-main product

The Supervisor-accepted candidate `592134bd814b6e684ed60abe008d9d039ea79b57` had:
- SUP-12 scrollbar authority cleanup;
- existing workspace switch rehomed to the fixed-right Options Bar position;
- equal top-menu trigger spacing.

Current main product source still shows the pre-candidate authorities:
- eleven per-menu fixed widths;
- global `scrollbar-color`;
- workspace switch located inside the desktop-hidden `.topbar-center`.

Therefore the deployed screenshot must not be described as containing the accepted post-SUP11 UI refinement.

Disposition:
`INTEGRATION_REQUIRED / FRESH CURRENT-MAIN UI PACKAGE`.
Do not merge the divergent old candidate blindly.

### UCV-04 — application-menu rhythm remains old fixed-width implementation

Observed:
- menu trigger rhythm remains visually compact and uneven rather than one shared content-driven spacing rule.

Source confirms eleven per-menu width rules remain on current main.

Disposition:
`FIX_NOW` using the already accepted shared-spacing approach.

### UCV-05 — no-document Navigator control state is visually ambiguous

Observed:
- Navigator preview is correctly empty with no active document;
- its footer still presents a white field/button/slider control row that reads as partially operable rather than clearly disabled/unavailable.

This screenshot alone does not prove interaction behavior.

Disposition:
`STATE_EVIDENCE_REQUIRED`.
Verify disabled/empty-document semantics by black-box interaction before changing source.

### UCV-06 — Reference panel is improved but still not a closure state

Observed:
- dashboard cards and saturated action treatment are absent;
- controls are substantially flatter;
- however field/button/label baseline rhythm and the low-contrast right-side status labels still require same-class/numeric review.

Disposition:
`MEASURE / SAME_CLASS_REVIEW`.
Do not patch individual baselines.

### UCV-07 — toolbar icon class still needs same-class optical review

Observed:
- double-column structure is present;
- visible icon envelopes and stroke/fill weights vary noticeably across the tool family.

Photoshop permits different icon envelopes but requires a coherent stroke/optical grammar.

Disposition:
`SAME_CLASS_REVIEW`; do not normalize by forcing identical bounding boxes.

## 2. Items not judged from this screenshot

The following cannot be closed or failed from this static state:
- SUP-12 scrollbar geometry (no useful overflow scrollbar state is visible);
- menus-open visual grammar;
- hover / focus / disabled states;
- right-panel collapse state;
- single-column Tools state;
- splitter drag;
- panel width resize;
- Layers drag reorder;
- rulers / guides;
- 12800% zoom behavior;
- C04 two-state behavior;
- New Document creation model.

## 3. Current-main source identity finding

The current GitHub Pages screenshot is consistent with current main product source rather than the unmerged post-SUP11 candidate.

Recent main commits after the reviewed product baseline are documentation/review work; the accepted post-SUP11 candidate has not been integrated into current main.

Therefore:
```text
OLD PASS != CURRENT EVIDENCE
POST_SUP11_ACCEPTED != CURRENT_MAIN_INSTALLED
CURRENT_MAIN_SCREENSHOT = USER_REJECTED
UI_COMPLETE = HOLD
```

## 4. Supervisor action boundary

Do not start a broad patch pass from this screenshot.

Required order after the currently bounded Core promotion integration is complete:

```text
latest main
→ fresh current-main UI branch
→ replay/reconcile already accepted post-SUP11 UI deltas
→ verify deployed/current product identity
→ blind visual delta
→ same-class sweep
→ numeric/density sweep
→ state matrix
→ USER checkpoint
```

C04 functional repair, C06 12800% zoom capability, and New Document architecture remain separate capability/product tasks unless USER explicitly combines them.

PRODUCT_SOURCE_MUTATION_BY_SUPERVISOR = NONE
USER_VISUAL_AUTHORITY = REJECTED_CURRENT_MAIN
