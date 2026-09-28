# INK UI-C Photoshop Fidelity & Final UI Closure — DEV Workpack v1.0

STATUS: `PLANNED / WAIT_FOR_UI_B_PROMOTION`

TASK: `INK-UI-C-PHOTOSHOP-FIDELITY-CLOSURE-001`

OWNER: `MR / MAIN REVIEW`

MANDATORY_DEV_BRANCH: `work/ink-ui-c-photoshop-fidelity-closure-001`

MASTER_PLAN:
`working/INK_UI_PSH_ALIGNED_IMPLEMENTATION_MASTER_WORKPLAN_v1.0.md`

## 1. Goal

Perform the final Photoshop-aligned visual/interaction reconciliation after all capability UI is wired.

This package does not add product capability. It closes fidelity, interaction detail, responsive behavior, and final audit evidence.

## 2. Geometry closure

Validate/correct:
- 24 + 1 + 35 + 1 = 61 px top shell;
- active document tab 28 px + divider;
- rulers 17 px;
- ruler corner 17×17;
- active-document status 16 px + 1 px boundary;
- no dead status/tab space with no document;
- single Tools 39 px reference;
- double Tools 72 px reference;
- collapsed Dock 39 px reference;
- expanded panel 252 px reference state but elastic;
- crisp 1 px boundaries;
- no shell overlap/gaps;
- canvas remains derived/flexible space.

## 3. Fine-detail closure

Use Photoshop measurement authority for:
- selected tool fill ~31×24;
- tool pitch ~26 px;
- 3×3 flyout marker;
- panel header/tab 28 px;
- stacked splitters ~3 px;
- History row pitch ~23 px;
- Layers row pitch/reorder state ~35 px;
- panel/application popup border and separators;
- compact flyout/menu rows;
- tooltip grammar;
- foreground/background swatch geometry where retained;
- status popup grammar;
- document scrollbars ~16 px reference where current canvas requires them.

Reference-state dimensions are not hard-coded when the source is elastic/content-dependent.

## 4. Interaction closure

Required:
- tool flyout open/selection;
- Tooltip;
- menu keyboard/outside-click/Escape;
- panel tab switching;
- panel options menus;
- panel width resize;
- stacked panel splitter resize;
- Layers drag ghost + insertion indicator;
- Navigator proxy drag/click/zoom sync;
- ruler guide drag with live coordinate readout;
- ruler origin behavior where implemented by current authority;
- guide/snap feedback;
- active/empty document transitions;
- focus/disabled/hover states;
- no mouse-pointer pixel matching requirement.

## 5. Light theme closure

Finalize semantic Light tokens using:
- Adobe/Photoshop Light visual hierarchy;
- Photoshop-on-web Light as current Adobe reference;
- Adobe Spectrum numeric reference;
- desktop Photoshop geometry/interaction.

Do not claim exact desktop Photoshop RGB equivalence without controlled evidence.

The result must read as a quiet light-gray Photoshop-style workstation, not a generic card-based web app.

## 6. Responsive/mobile

Preserve one command/state authority.

Mobile/responsive UI may use sheets/pickers/compact routes, but:
- does not create duplicate tools or state;
- desktop placement remains authoritative for workstation design;
- touch targets may adapt without changing capability semantics.

## 7. Final reconciliation audit

Before handoff:
- 64/64 family placement preserved;
- 501/501 atomic disposition preserved;
- PUI-001..074 each final-state classified;
- G-01..G-34 each closed or explicitly bounded with MR-approved reason;
- predecessor 212 buttons / 29 selects accounted;
- 22 CHAT named tools preserved;
- 34 bounded edit operations preserved;
- no headless false chrome;
- no dead menus/panels/tool slots;
- no duplicate Core authority.

Refresh the final UI completion checklist so current P1 Filter/Color/Channels/Adjustments placement supersedes old pre-P1 checklist wording.

## 8. Visual evidence pack

Prepare comparison evidence for final Runtime/UR:
- 1280×994 normalized desktop;
- single Tools + collapsed Dock;
- double Tools + expanded panels;
- active document / rulers off;
- active document / rulers on;
- populated Navigator + History;
- Layers reorder state;
- tool flyout;
- tooltip;
- menu/panel popup;
- guide drag;
- empty workspace;
- light theme final state.

Local captures may be prepared in C; final authoritative exact-SHA captures are produced only by the final integrated Runtime.

## 9. Allowed source boundary

Prefer UI-only files:
- `product/source/shell.template.html`
- `product/source/styles.css`
- `product/source/web-shell.js`
- `product/source/src/ink.js`
- `product/source/src/studio-core.js`
- shell-generation files only as needed
- QA/evidence/checklist/progress.

No Core semantic mutation without STOP → MR.

## 10. Prohibited

- no new capability;
- no Core redesign;
- no FORMAT_VERSION;
- no P2;
- no central Runtime;
- no arbitrary Photoshop values where reference says REFERENCE_MISSING;
- no freezing elastic panel dimensions;
- no Adobe branding/assets.

## 11. Package-C QA

Required:
- focused/static final UI contract tests;
- engineering health delta;
- current source generation parity;
- local interaction smoke;
- completion checklist refreshed;
- UR visual/fidelity review;
- USER revision incorporated if requested;
- central Runtime remains prohibited until C is promoted.

Suggested focused QA:
`qa/ink-ui-c-photoshop-fidelity-closure.test.mjs`

## 12. Handoff and next gate

After MR + UR acceptance, promote C.

Only then MR may authorize:
`INK-UI-FINAL-INTEGRATED-RUNTIME-001`

The final Runtime must target the exact fully promoted UI SHA and is the first central Runtime after UI implementation begins.
