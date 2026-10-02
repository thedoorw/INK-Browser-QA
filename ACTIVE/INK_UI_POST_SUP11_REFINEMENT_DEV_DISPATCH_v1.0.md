# INK UI Post-SUP11 Refinement — DEV Dispatch v1.0

STATUS: ACTIVE / USER-AUTHORIZED BOUNDED UI REFINEMENT
DATE: 2026-10-02
OWNER: DIRECT UI DEV
PRODUCT: thedoorw/INK-Browser-QA
BASELINE: a9d122ccba14734caf6220a53044545494a8429b

Read first:
1. `working/INK_UI_MICRO_MODULE_NORMALIZATION_SUPERVISOR_REVIEW_20261002.md`
2. `ACTIVE/INK_UI_MICRO_MODULE_GRAMMAR_v1.0.md`
3. `ACTIVE/INK_UI_PS_INSTANCE_DATASET_v1.0.md`
4. `ACTIVE/INK_UI_PS_ALIGNMENT_MASTER_GUIDE_v1.0.md`
5. `ACTIVE/INK_CURRENT_WORK_ORDER.md`

## Goal

Execute the next bounded UI pass on the accepted `a9d122c` base.

This pass contains only three UI subjects:

1. SUP-12 right-panel scrollbar rendering;
2. restore the existing workspace-space switch to the fixed right side of the Options Bar;
3. normalize top application-menu trigger spacing, including `物件(O)`.

Do not include New Document/A4 architecture or the Core spatial-index repair in this product mutation.

---

## UI-13A — SUP-12 / right-panel scrollbars

Rendered evidence, not source declarations, is authoritative.

Current intended grammar:
```text
ALL RIGHT-PANEL SCROLLBARS = RECTILINEAR
THUMB_RADIUS = 0
TRACK_RADIUS = 0
ONE SHARED SCROLLBAR PRIMITIVE
```

Inspect the actual scrolling owners for at least:
- Reference;
- Layers;
- History;
- Libraries;
- Properties / generic shell panel bodies;
- any `.inspector-section` / `.shell-panel-body` / panel-stack body that can scroll.

Requirements:
- identify why the current Chromium render still shows rounded/pill scrollbars despite the global zero-radius rule;
- correct the shared scrollbar authority or shared scroll-surface ownership;
- do not add separate scrollbar skins for individual panels;
- preserve document/canvas scrollbar semantics where intentionally different;
- no new breakpoint family;
- no new `!important`;
- no per-panel radius patch.

Evidence:
- 1:1 crops of at least 4 different right-panel scroll containers with enough content to visibly scroll;
- computed owner / selector evidence;
- source audit showing one shared authority.

---

## UI-13B — Options Bar fixed-right workspace switch

USER requires the existing two-space switch to return at the **far right of the Options Bar**.

Existing authority already exists:
- C04 Creation / Layout workspaces;
- `#workspaceSwitch`;
- `data-space="creation"` / `data-space="layout"`;
- existing `switchWorkspace()` / workspace-menu routes.

This is a **re-home / exposure task**, not a new workspace implementation.

Required structure:
```text
OPTIONS BAR
[ tool identity ][ contextual tool controls ........ flex / overflow ]
                                                [ fixed workspace switch ]
```

Rules:
- use the existing `#workspaceSwitch` node or the same existing authority; do not create a second state owner;
- right-side switch remains visible while left contextual controls change by tool;
- the contextual controls may scroll/clip within their own flex region; the workspace switch must not be pushed offscreen by long Brush/Text/Shape options;
- keep the two states visually compact and workstation-like;
- do not restore the old centered topbar placement as a second copy;
- menu workspace route may remain as a secondary route, but duplicate primary controls are not allowed.

### Authority check before UI close

Current source must be tested for two genuinely distinct existing states.

If the current C04 route aliases/coerces one requested state into the other, DEV must **not hide that fact behind a visual PASS**. Record it as a separate existing workspace-authority defect and STOP that sub-item for Core/Supervisor decision rather than inventing a second workspace state in UI code.

Acceptance evidence:
- both controls visible at Options Bar far right;
- Brush long-options state;
- Text state;
- Lasso state;
- 1280×1024 and 960×800;
- click each state and show the existing authoritative workspace state/readout changes correctly;
- no duplicate `#workspaceSwitch` identity.

---

## UI-13C — application menu equal-spacing grammar

USER requires `物件(O)` to participate in the same visual rhythm as all other top application-menu triggers.

This is not a one-off `物件(O)` margin fix.

Apply one shared trigger grammar to:
```text
檔案(F) 編輯(E) 影像(I) 圖層(L) 文字(Y) 選取(S)
濾鏡(T) 物件(O) 檢視(V) 視窗(W) 說明(H)
```

Requirements:
- one common horizontal padding / trigger-height / line-height authority;
- no per-menu `margin-left/right`, `translateX`, special width, or string-specific patch;
- do not force all triggers to equal width; text width remains content-driven;
- visual inter-label gaps should read consistently because the same inline padding owns every trigger;
- keep menu routing and mnemonic letters unchanged.

Evidence:
- 1:1 full top-menu crop;
- measured left/right inline padding for all triggers;
- list any legacy selector that was removed because it overrode one trigger.

---

## Technical-debt guard

```text
NEW_IMPORTANT = 0
NEW_BREAKPOINT_FAMILY = 0
NEW_STATE_AUTHORITY = 0
NEW_DUPLICATE_COVERED_VISUAL_AUTHORITY = 0
NO_ONE_OFF_MENU_OFFSET = TRUE
NO_PANEL_SPECIFIC_SCROLLBAR_SKIN = TRUE
NO_SECOND_WORKSPACE_STATE_OWNER = TRUE
```

Preserve:
- Core / History;
- FORMAT_VERSION = 4;
- current Tool → Options matrix behavior from `a9d122c`;
- SUP-08～SUP-11 accepted behavior.

## Explicit non-scope

Do not implement:
- New Document / A4 redesign;
- document dimension model changes;
- foreground/background-based document creation;
- Core spatial-index repair;
- new tools or capabilities;
- unrelated Photoshop parity.

## Required handoff

Return:
- candidate SHA;
- exact changed files;
- before/after screenshots;
- scrollbar owner/selector evidence;
- workspace switch state evidence;
- top-menu spacing measurement;
- technical-debt counters;
- any discovered C04 workspace-authority defect.

Then STOP for Supervisor / USER review.

No self-declared final UI PASS.
