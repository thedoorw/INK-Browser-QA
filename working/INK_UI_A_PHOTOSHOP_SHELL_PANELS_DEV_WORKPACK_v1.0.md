# INK UI-A Photoshop Workstation Shell & Panels — DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

TASK: `INK-UI-A-PHOTOSHOP-SHELL-PANELS-001`

OWNER: `MR / MAIN REVIEW`

MANDATORY_DEV_BRANCH: `work/ink-ui-a-photoshop-shell-panels-001`

PLANNING_BASELINE_MAIN: `cc772245f636f8f76f63564faad2dea61045333d`

MASTER_PLAN:
`working/INK_UI_PSH_ALIGNED_IMPLEMENTATION_MASTER_WORKPLAN_v1.0.md`

## 1. Goal

Build the Photoshop-aligned workstation shell and one panel/dock authority before full capability-control wiring.

This is a large bounded package. It is not split into per-panel micro-tasks.

## 2. Photoshop shell contract

Required desktop geometry/form:
- menu 24 px;
- 1 px divider;
- contextual Options 35 px;
- 1 px divider;
- y=61 workstation origin;
- active-document tab band 28 px + divider;
- rulers 17 px when on;
- active-document-only status content 16 px + 1 px bottom boundary;
- single Tools reference 39 px + divider;
- double Tools reference 72 px + divider;
- collapsed Dock reference 39 px + divider;
- expanded right panel reference 252 px but elastic/resizable;
- panel header/tab 28 px reference;
- stacked splitter ~3 px reference;
- edge-attached workstation regions with no rounded floating-card grammar.

Empty workspace:
- no document tab band;
- no document status strip;
- workbench begins below base 61 px shell.

## 3. Required shell/menu structure

Create/normalize top menu framework:

```text
File / Edit / Image / Layer / Type / Select / Filter / Object / View / Window / Help
```

Package A must establish the menu host/controller and Photoshop-like popup grammar. Package B owns complete capability command wiring.

Retire duplicate desktop New/Open/Save and desktop Undo/Redo controls according to PUI-005..009.

## 4. Tools host framework

Implement:
- left edge attachment;
- single/double column modes;
- Photoshop compact tool-cell grammar;
- active/hover/focus/flyout-indicator states;
- host support for the final tool grouping defined by the Master Plan;
- same membership authority in single/double layouts.

Package A does not need to finish every P1 flyout command; Package B does.

## 5. Right Dock/panel system

Implement one panel authority for:
- collapsed icon Dock;
- expanded panels;
- Window menu state;
- panel tab state;
- panel resizing;
- vertical group stacking/splitters;
- panel-local options menus;
- panel footer grammar.

Normal inventory must have a valid home:
Properties, Layers, History, Navigator, Pages, Color, Channels, Adjustments, Libraries, Reference, Compose, CHAT, Revision, Specialist.

Required interaction:
- edge-attached right;
- no canvas overlap in normal desktop mode;
- canvas reflows on width change;
- active tab obvious;
- body scroll;
- panel header options trigger is functional;
- Window and Dock converge on same state;
- no duplicate floating edge opener.

## 6. Panel functional scope in A

A must normalize and make usable:
- Properties host and target-aware section framework;
- Layers hierarchy/selection/visibility/lock/opacity/add/duplicate/delete/drag reorder host;
- History list/jump/Undo/Redo convergence;
- Navigator thumbnail/proxy/pan/jump/zoom controls using existing viewport authority;
- Pages add/duplicate/delete/switch/rename;
- Color panel host;
- Channels panel host;
- Adjustments panel host;
- existing creative panels under one Photoshop-like dock grammar.

Do not create new Core state for any panel.

## 7. Ruler/document shell scope

Establish normal workstation host for:
- document tab;
- top/left rulers;
- 17×17 ruler origin corner;
- View menu ruler/guide/snap routes;
- active-document status strip;
- document scrollbars where current canvas behavior requires them.

Full guide/snap functional closure remains in B if additional wiring is needed.

## 8. Light theme

Implement one semantic light-gray UI token authority.

Use:
- Adobe/Photoshop Light hierarchy;
- current Adobe Light/Spectrum evidence;
- Photoshop desktop geometry.

Do not copy dark-reference RGB.
Do not claim web Light RGB values are exact desktop Photoshop 21.2.12 values.
Do not use Adobe branding/assets.

## 9. Planning IDs primarily hosted/closed in A

At minimum:
- PUI-005..009;
- PUI-028..040;
- PUI-052 host framework;
- PUI-053..055 host/menu/ruler framework;
- PUI-057..068 negative-control/Help-host architecture as applicable.

Rows whose functional command depends on P1 wiring may remain PARTIAL until B, but the owning surface must exist and no conflicting surface may be created.

## 10. Allowed source boundary

UI implementation may modify:
- `product/source/shell.template.html`
- `product/source/styles.css`
- `product/source/web-shell.js`
- `product/source/src/ink.js`
- `product/source/src/studio-core.js`
- `product/source/generate-shell.mjs` only if shell-generation consistency requires it
- generated entry HTML only through the accepted generation path
- package-specific QA/evidence/progress files.

No other Core module mutation without STOP → MR.

## 11. Prohibited

- no Core semantic changes;
- no second panel/document/history/viewport/selection authority;
- no P2 capability implementation;
- no FORMAT_VERSION change;
- no central Runtime queue/run;
- no package-B full dialog/tool implementation by scope creep;
- no hard-freezing elastic 252 px panel width;
- no fake Photoshop functions.

## 12. Package-A QA

Required before handoff:
- source/static contract QA for top/menu/options/workspace regions;
- shell geometry assertions;
- panel state convergence assertions;
- no duplicate desktop file/history controls;
- Navigator/History/Layers/Pages focused behavior tests;
- light-theme token authority test;
- responsive authority sanity check;
- local browser/manual interaction evidence is allowed;
- central exact-SHA Runtime is prohibited.

Suggested focused QA:
`qa/ink-ui-a-photoshop-shell-panels.test.mjs`

## 13. DEV handoff

Provide:
- exact branch HEAD;
- changed-file list;
- QA commands/results;
- PUI rows completed/partial;
- gap rows closed/remaining;
- screenshots/evidence if locally produced;
- confirmation Core authority changes = 0;
- health delta;
- STOP to MR.

MR then obtains UR Photoshop alignment review before promotion.
