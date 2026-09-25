# INK UI REBUILD 001 — Photoshop Alignment Work Order Draft A

STATUS: `UR_DRAFT / MR_AUTHORIZATION_REQUIRED / NOT_ACTIVE`

TITLE: `Photoshop Workstation Reference Lock + Shell Geometry v0.1`

SUGGESTED_TASK_ID: `INK-UI-REBUILD-001-PS-A`

PLANNING_BASELINE_MAIN: `79b76ccafd6e1d3443d2565fcc6d4f284e1d6eac`

UPSTREAM:
`INK-UI-REBUILD-001-TECH-DEBT-CLEANUP = COMPLETE / MR_PASS / PROMOTED`

## 1. Purpose

Start Photoshop alignment with the workstation skeleton only.

This first bounded order must:
1. lock exact reference measurements;
2. map current-main shell authorities;
3. align the main shell geometry;
4. prove that the cleaned UI health baseline remains intact.

It must not attempt the entire UI rebuild in one pass.

## 2. Fresh branch rule

MR must create a fresh implementation branch from current main at authorization time.

Suggested:

`work/ink-ui-rebuild-001-ps-a`

Do not:
- reuse `work/ink-ui-rebuild-001-tech-debt-cleanup`;
- develop from the old planning branch;
- merge development branch into development branch.

The exact authorized base SHA must be recorded in the Work Order.

## 3. Reference authority

Visual reference:
- user-supplied Photoshop `ps-1.png`;
- user-supplied Photoshop `ps-2.png`.

Known exact top reference:

```text
24px menu
1px divider
35px contextual options
1px divider
= 61px total
```

Functional placement:
- `working/INK_UI_REBUILD_001_PHOTOSHOP_ALIGNMENT_WORKPACK.md`
- accepted `INK_WORKSTATION_UI_CAPABILITY_MATRIX_v0.1.md`

Health:
- `governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`

## 4. Phase A0 — measurement lock

Before product mutation, record one evidence document containing:

### Photoshop
- top chrome = 61 px;
- left rail width single;
- left rail width double;
- right dock collapsed width;
- right expanded panel width in reference;
- bottom/status height;
- divider thickness;
- canvas boundary coordinates at 1280×1024.

### Current INK
Record the same values at:
- 1280×1024;
- 960×800.

### Delta table

For each shell surface:

```text
surface
Photoshop reference
current INK
target
source authority
planned action = KEEP / REPLACE / REMOVE
```

No product file changes are allowed before this table exists on the DEV branch.

## 5. Phase A1 — shell geometry only

Authorized visual surfaces:

- application/menu row;
- contextual options row;
- left tool-rail container geometry;
- central stage/canvas container geometry;
- right dock/panel container geometry;
- bottom status container geometry;
- shell dividers/spacing required for those boundaries.

Primary target:

`PS_TOP_CHROME_REFERENCE = 61px`

The center work area must remain dominant.

## 6. Preserve existing authorities

Must preserve without creating replacements:

```text
MENU_STATE_CONTROLLER = 1
VISIBLE_PANEL_STATE_OWNERS = 1
Dock same-item toggle contract
Window route convergence
FIRST_PAINT_AUTHORITY = 1
WIDTH_LAYOUT_MODES = 3
NORMAL_UI_FONT_AUTHORITY = 1
VISIBLE_LOGO_AUTHORITY = 1
FAVICON_AUTHORITY = 1
Web/Portable generator authority
```

This order is geometry alignment, not state-management redesign.

## 7. Allowed product scope

Preferred product files:

- `product/source/shell.template.html` — only if shell structure requires bounded markup adjustment;
- `product/source/styles.css` — existing authorities only;
- generated Web/Portable outputs only through the existing generator;
- `product/source/src/config.js` — BUILD_ID only if required;
- `product/source/service-worker.js` — matching BUILD_ID only if required.

QA / evidence as needed:
- focused UI source QA;
- existing Runtime UI harness;
- existing browser capture runner;
- task evidence / handoff / progress documents.

If another product source file appears necessary:

`STOP → MR`

## 8. Explicitly out of scope

Do not change in Work Order A:

- menu command inventory/content;
- panel state logic;
- Properties/Inspector behavior;
- left toolbar tool membership/order;
- actual single/two-column toggle behavior;
- right-panel family membership;
- Layers behavior;
- History behavior;
- Creative panels;
- responsive taxonomy;
- typography token system;
- logo/favicon;
- Core / Renderer / Canvas / WebGL;
- Document / schema / migration;
- History semantics;
- Revision semantics;
- Geometry / Recipe;
- CHAT execution/proposal authority;
- persistence;
- FORMAT_VERSION;
- product version.

Later bounded orders own those alignment stages.

## 9. CSS implementation rule

Forbidden:

```text
append new final override block
add stronger selector
add presentation !important
leave obsolete base rule active
```

Required:

```text
identify accepted selector authority
→ edit/replace that authority
→ remove obsolete predecessor when touched
→ keep desktop + responsive ownership explicit
```

## 10. Required focused QA

Static/source:
- generator `--check`;
- Web/Portable parity;
- CSS brace balance;
- presentation `!important = 0`;
- hard-coded normal UI px font-size = 0;
- width modes remain 3;
- duplicate literal DOM IDs = 0;
- panel state owner remains 1;
- menu controller remains 1;
- no new dead visible control.

Browser:
- reload first paint remains stable/light;
- 1280×1024 shell containment;
- 960×800 shell containment;
- panel open/close smoke test unchanged;
- File + non-File shared-menu smoke test unchanged.

## 11. Mandatory visual evidence

At minimum:

```text
ps-reference-measurement-overlay / table
ink-before-1280x1024
ink-after-1280x1024
ink-before-960x800
ink-after-960x800
ui-first-paint
```

The evidence must make boundary changes visually inspectable.

No source-only closure.

## 12. Health delta required at handoff

Use the exact template from:
`governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`

Minimum acceptance:

```text
NEW_PRESENTATION_IMPORTANT = 0
NEW_UNAUTHORIZED_WIDTH_THRESHOLD = 0
PANEL_STATE_OWNERS = 1
MENU_STATE_CONTROLLERS = 1
DUPLICATE_LITERAL_DOM_IDS = 0
DUPLICATE_PRIMARY_HOME = 0
DEAD_VISIBLE_CONTROLS = 0
HARD_CODED_NORMAL_UI_PX_FONT_SIZE = 0
FINAL_OVERRIDE_LAYER_ADDED = 0
FIRST_PAINT_BLACK_FLASH = 0
FROZEN_CORE_MUTATION = 0
```

## 13. Completion gate

MR may accept Work Order A only when:

```text
REFERENCE_MEASUREMENTS = LOCKED
PS_TOP_CHROME_61PX = PASS
SHELL_BOUNDARY_ALIGNMENT = PASS
1280x1024_VISUAL = PASS
960x800_VISUAL = PASS
UI_HEALTH_GUARDRAILS = PASS
FUNCTIONAL_RUNTIME = PASS
CORE_MUTATION = 0
```

Then STOP.

The next Photoshop alignment order should be separately authorized; no automatic expansion into menus, toolbar behavior or panel redesign.
