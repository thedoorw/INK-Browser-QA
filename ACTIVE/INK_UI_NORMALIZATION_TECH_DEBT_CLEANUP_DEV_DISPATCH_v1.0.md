# INK UI Normalization Technical-Debt Cleanup — DEV Dispatch v1.0

STATUS: ACTIVE / USER-AUTHORIZED BOUNDED CLEANUP
DATE: 2026-10-02
OWNER: DIRECT UI DEV
PRODUCT: thedoorw/INK-Browser-QA
BASE CANDIDATE: c90df990cddedc7d7d7692b88200985a8b50d5aa

Read first:
1. `working/INK_UI_MICRO_MODULE_NORMALIZATION_SUPERVISOR_REVIEW_20261002.md`
2. `ACTIVE/INK_UI_MICRO_MODULE_GRAMMAR_v1.0.md`
3. `ACTIVE/INK_UI_PS_INSTANCE_DATASET_v1.0.md`
4. `ACTIVE/INK_UI_PS_ALIGNMENT_MASTER_GUIDE_v1.0.md`
5. `ACTIVE/INK_CURRENT_WORK_ORDER.md`

## Goal

Remove normalization-scope UI technical debt before any further visual or capability expansion.

This is **not** a new visual-polish pass.
This is **not** Capability → UI Exposure Batch B.
This is **not** permission to redesign unrelated product areas.

Required order:

```text
identify covered duplicate / legacy styling authority
→ classify intentional state/responsive variants vs obsolete overrides
→ delete obsolete covered rules
→ collapse each covered class onto shared tokens/primitives
→ preserve current rendered appearance as closely as possible
→ verify shared same-class geometry
→ return evidence
```

## Covered scope

Only UI classes/families touched by the current normalization pass:

- Tools rail and tool cells
- Tools single/dual-column layout
- Tools color swatch cluster
- left/right collapse strips and double-chevron controls
- top application/menu chrome
- contextual Options Bar controls
- right panel stack shell / tabs / panel-menu glyph / splitters
- Reference panel shared micro-controls
- Layers panel shared rows/footer/appearance controls
- shared sliders
- shared scrollbars
- top-right visual window controls
- common button/control primitives used by the above surfaces

Do not widen cleanup to unrelated application code.

## Mandatory debt-removal rules

### A. One visual authority per covered class

For each covered class:
- identify old Web-App-era base declarations that are later overridden by normalized Photoshop-aligned declarations;
- remove obsolete geometry/theme/spacing/radius/shadow/color declarations;
- preserve only intentional responsive/state variants;
- do not leave old and new grammars coexisting merely because the later rule wins.

### B. No patch replacement with new patch

- no new `!important`;
- do not add a later override to fix an earlier override;
- do not introduce another selector with higher specificity as the solution;
- change/remove the obsolete rule at its source;
- covered same-class geometry must resolve through shared variables/tokens.

### C. Shared primitive consistency

Required examples:
- left and right collapse glyphs must use the same 7×5 px double-chevron primitive;
- no left-only 9×8 px collapse override;
- single/dual Tools must use the same 18×18 px color swatch primitive;
- single-column state changes placement/reflow only, not swatch primitive size;
- panel tabs share one 28 px grammar;
- shared slider geometry must not have per-panel thumb/track sizes;
- shared scrollbar geometry must not have panel-specific rounded variants.

### D. Preserve behavior/state authority

Do not change:
- command IDs/handlers;
- document/core state ownership;
- History semantics;
- panel routing semantics;
- capability semantics;
- FORMAT_VERSION.

This pass may remove obsolete presentation rules only.

## Explicit non-scope

Do **not** address in this cleanup pass:
- SUP-01 Specialist / Adjustments panel-state identity;
- SUP-02 Reference expanded-state content cleanup;
- full Layers redesign beyond debt consolidation;
- missing contextual parameters / Capability → UI Exposure Batch B;
- new Photoshop feature parity work;
- new visual features.

Those are reviewed after the styling authority is clean.

## Required source audit

Return a table for each covered family:

| FAMILY | LEGACY AUTHORITY FOUND | SHARED AUTHORITY | RULES REMOVED | INTENTIONAL VARIANTS KEPT | RESULT |
| --- | --- | --- | ---: | --- | --- |

At minimum include:
- `.tool-rail`
- `.tool-button`
- `.primary-button` / ordinary shared button families used in covered UI
- `.tool-layout-toggle`
- `.panel-edge-toggle`
- `.edge-chevron`
- `.panel-stack-tab`
- `.panel-stack-options`
- `.panel-stack-splitter`
- `.creative-workspace-field`
- `.layer-row`
- `.ui-b-layer-appearance`
- shared range/slider selectors
- shared scrollbar selectors
- `.window-visual-controls`

## Quantitative debt gate

Report before/after:

```text
!important count
covered selector duplicate-definition count
covered hard-coded color literal count
covered hard-coded geometry literal count
covered border-radius declarations
covered box-shadow declarations
breakpoint families
state-authority count / routing authority
```

Targets:
```text
NEW_IMPORTANT = 0
NEW_BREAKPOINT_FAMILY = 0
NEW_STATE_AUTHORITY = 0
NEW_DUPLICATE_COVERED_VISUAL_AUTHORITY = 0
LEFT_RIGHT_COLLAPSE_GEOMETRY = SAME_PRIMITIVE
SINGLE_DUAL_SWATCH_SIZE = SAME_PRIMITIVE
```

Do not optimize metrics by deleting required state/responsive variants.

## Render preservation checks

Re-render at least:
- 1280×1024 active document;
- Tools dual;
- Tools single;
- right panels expanded;
- right dock collapsed;
- Reference normal;
- Layers normal;
- Edit menu open;
- Preferences representative state.

Expected outcome:
- no intentional major visual redesign;
- no new overflow;
- no missing controls;
- no regression in current normalized density;
- left/right collapse controls visually align as the same class;
- single-column swatches retain Photoshop-class size.

## Evidence required

Return:
- bounded commit SHA;
- changed files;
- debt-audit table;
- before/after debt metrics;
- screenshots listed above;
- exact list of legacy rules removed;
- any rule intentionally retained and why.

Do not self-declare Photoshop fidelity or final UI completion.

STOP after this cleanup for Supervisor + USER review.
