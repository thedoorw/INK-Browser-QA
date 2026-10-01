# INK UI Micro-Module Normalization — DEV Dispatch v1.0

STATUS: ACTIVE / USER-AUTHORIZED BOUNDED UI REFACTOR
DATE: 2026-10-01
OWNER: DIRECT UI DEV
PRODUCT: thedoorw/INK-Browser-QA

Read only these UI authorities first:
1. ACTIVE/INK_UI_PS_INSTANCE_DATASET_v1.0.md
2. ACTIVE/INK_UI_MICRO_MODULE_GRAMMAR_v1.0.md
3. ACTIVE/INK_UI_PS_ALIGNMENT_MASTER_GUIDE_v1.0.md
4. ACTIVE/INK_CURRENT_WORK_ORDER.md

## Goal

Normalize the current INK UI using one shared micro-module system.

This is not ten isolated CSS patches.

Implementation order:
```text
AUDIT CURRENT SHARED/LOCAL RULES
→ DEFINE/CONSOLIDATE SHARED TOKENS + PRIMITIVES
→ MIGRATE TOP/TOOLS/PANELS/REFERENCE/LAYERS/MENUS
→ REMOVE SUPERSEDED LOCAL RULES
→ VERIFY STATES
→ RETURN EVIDENCE
```

## Required scope

Implement the current ten USER findings plus the shared grammar:

1. reduce gray-role proliferation;
2. preserve strong right panel-group boundaries while removing unnecessary internal boxes/lines;
3. fix collapsed left Tools overflow/reflow;
4. normalize parameter UI;
5. rectangular scrollbars + circular-thumb sliders;
6. correct top-right window-control geometry/icon sharpness;
7. correct left/right collapse strip separators/arrows and panel-menu glyph;
8. simplify Reference panel;
9. reorganize Edit menu using existing INK command semantics;
10. align Layers panel structure/density/states.

Also apply the shared Typography / Gray / Divider / Control / Spacing / Icon / Scrollbar / Slider / Panel-content grammar to all touched surfaces.

## Non-negotiable engineering rules

- no new !important;
- no local patch when a shared token/primitive can solve the class;
- no new state authority;
- no new Core semantics;
- no FORMAT_VERSION change;
- preserve current command IDs/handlers and document authority;
- do not invent unsupported Photoshop features;
- no fake controls;
- no new breakpoint family without explicit escalation;
- remove obsolete overrides in the same change;
- do not leave both old and new component styling active;
- do not solve collapsed state by clipping/hiding required controls.

## Required focused verification

At minimum verify:
- 1280×1024 desktop active document;
- empty workspace;
- left Tools expanded/collapsed;
- right panels expanded/collapsed;
- Reference panel normal + scroll;
- Layers selected + reorder + footer actions;
- Edit menu open;
- Preferences representative controls;
- all touched slider/scrollbar instances;
- window-control and collapse/menu glyph sharpness;
- no horizontal/vertical overflow caused by the refactor.

## Technical-debt report

Return exact values:
```text
important count before / after
breakpoint families before / after
shared token/primitives added/changed
legacy local rules removed
duplicate implementations removed
new one-off color literals
new one-off geometry literals
state-authority changes
```

Target:
```text
NEW_IMPORTANT = 0
NEW_BREAKPOINT_FAMILY = 0
NEW_STATE_AUTHORITY = 0
NEW_FAKE_AFFORDANCE = 0
```

## Evidence

Return:
- bounded commit SHA;
- changed files;
- representative current screenshots;
- before/after visual delta summary;
- functional checks for Layers/Edit/collapse states;
- technical-debt report.

Do not self-declare final Photoshop fidelity or UI completion.
STOP after this bounded normalization pass for USER review.
