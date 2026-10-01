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


## USER visual evidence pack — 2026-10-01

USER visual evidence is encoded as the following attachment set. When these files are supplied in the DEV chat/window, inspect them before editing. They are direct USER problem-identification evidence and supplement the authoritative Photoshop Dataset / Micro-Module Grammar.

| Code | Filename | Primary use |
| --- | --- | --- |
| UIE-00 | `INK-UIE-00_CURRENT_FULL.png` | Current INK full-screen baseline; macro context for shell, Tools, workspace and right panels |
| UIE-01 | `INK-UIE-01_TOOLS_COLLAPSED_DETAIL.png` | USER-03 collapsed Tools overflow; USER-07 side-collapse separator/arrow/utility layout |
| UIE-02 | `INK-UIE-02_TOP_CHROME_OPTIONS_DETAIL.png` | Photoshop↔INK top Menu / Options comparison; typography/control/spacing/icon; USER-06 window-control relation |
| UIE-03 | `INK-UIE-03_RIGHT_PANEL_CURRENT_DETAIL.png` | Current right-panel detail; USER-01/02/04/05/07/08 |
| UIE-04 | `INK-UIE-04_WINDOW_COLLAPSE_ICON_DETAIL.png` | Enlarged window-control, collapse-arrow and panel-menu/hamburger sharpness/placement; USER-06/07 |
| UIE-05 | `INK-UIE-05_REFERENCE_PANEL_ZOOM.png` | Enlarged Reference panel; cards, bold, special color, slider frame, scrollbar, tabs; USER-02/04/05/08 |
| UIE-06 | `INK-UIE-06_PS_EDIT_LAYERS_REFERENCE.png` | Photoshop Edit-menu grouping plus Layers/panel reference; USER-09/10 |

Evidence handling rules:
- do not treat these screenshots as a separate design authority that overrides `ACTIVE/INK_UI_PS_INSTANCE_DATASET_v1.0.md`;
- use them to identify the exact current INK defects USER pointed out;
- where a screenshot contains Photoshop and INK together, distinguish reference UI from the embedded/current INK image before measuring;
- do not infer unseen functionality from a static screenshot;
- if a current product state has changed since UIE-00/UIE-03/UIE-05, recheck the actual current rendered page and use the screenshots as defect provenance, not stale PASS/FAIL evidence.

