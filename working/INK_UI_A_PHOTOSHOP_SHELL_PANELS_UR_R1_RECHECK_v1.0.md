# INK UI-A Photoshop Shell / Panels — UR R1 Bounded Recheck v1.0

STATUS: `UR_PASS / RETURN_TO_MR / NOT_PROMOTED_BY_UR`

DATE: 2026-09-28

TASK:
`INK-UI-A-PHOTOSHOP-SHELL-PANELS-001 / UI-A-R1`

BRANCH:
`work/ink-ui-a-photoshop-shell-panels-001`

R1_DEV_HANDOFF_HEAD:
`74542bcff80017da04aca5a412f610f4810024f0`

R1_EXACT_IMPLEMENTATION_QA_HEAD:
`1b3df1f61f52fd373f082b6780118440b099e5a7`

UPSTREAM_UR_REVIEW:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_UR_REVIEW_v1.0.md`

UPSTREAM_MR_REVIEW:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_MR_REVIEW_v1.0.md`

BOUNDED_WORKPACK:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_BOUNDED_REVISION_WORKPACK_v1.0.md`

Review scope is limited to UR-A-01 / UR-A-02 / UR-A-03. No full UI-A redesign, no UI-B review, no central Runtime.

## 1. Recheck result

```text
UR_A_01_STACKED_PANEL_SPLITTER = PASS
UR_A_02_LIGHT_PANEL_INTERIORS = PASS
UR_A_03_SHARED_PANEL_RESIZER = PASS

NEW_UI_A_BLOCKER = 0
UI_A_R1_UR = PASS
UI_A_PROMOTION = HOLD_FOR_MR_DECISION
UI_B = HOLD
CENTRAL_RUNTIME = NOT_RUN
NEXT_OWNER = MR
```

## 2. UR-A-01 — stacked expanded panel-group / splitter framework

PASS.

R1 now provides:
- one `shellPanelStackFramework`;
- regions generated directly from the existing `PANEL_GROUPS`;
- existing `PANEL_DEFS` / `PANEL_GROUPS` remain the single panel registries;
- group regions follow the existing active-panel state;
- a `3 px` splitter structural token/host;
- panel selection routes through the existing `selectPanel()` authority;
- right-edge/canvas reflow remains on the existing active panel width path.

This closes the UI-A architecture blocker.

Detailed splitter drag behavior, cursor fidelity and final stacked-panel proportion tuning remain UI-C as previously scoped.

## 3. UR-A-02 — Light panel interiors

PASS.

The prior blocker was not the existence of historical dark CSS itself; it was that dark panel-interior rules remained visually authoritative under the Light shell.

R1 adds a later final Light interior closure using the established semantic Light authority:
- `--ink-ui-surface = #FFFFFF`;
- `--ink-ui-surface-subtle = #F4F4F4`;
- `--ink-ui-border = #CFCFCF`;
- `--ink-ui-text = #222222`;
- `--ink-ui-text-muted = #666666`;
- `--ink-ui-accent = #3B63FB`.

The final override covers the previously blocked surfaces:
- Properties / Specialist property cards, rows and form controls;
- Layers list, rows, active row and footer;
- History list, rows, current/future states and footer;
- Creative Workspace state, tabs, body fields, controls, status and CHAT/structure surfaces.

The resulting rule hierarchy is consistent with the Photoshop Light reference model: white/near-white panel surfaces, light structural gray chrome, quiet gray borders and bounded accent selection.

No second theme authority is introduced.

No new UI-A blocker is raised for exact row pitch, fine control density or pixel-level color tuning; those remain UI-C fidelity work.

## 4. UR-A-03 — shared Inspector / Creative direct resize surface

PASS.

R1 adds one shell-owned `shellActivePanelResizer` for the currently active desktop primary panel.

Verified authority behavior:
- shared default width = `252 px`;
- elastic bounds = `244–420 px`;
- width writes only to existing `--inspector-w`;
- persistence remains `ink-inspector-width`;
- the same `panel-primary-open` state covers Inspector and Creative primary panels;
- canvas reflow remains coupled to `--active-panel-w`;
- the old Inspector-specific resize edge is hidden while the shared shell edge is active;
- no Creative Workspace Core/source authority is replaced.

This closes the UI-A resize-framework blocker.

Final cursor visual fidelity remains UI-C.

## 5. Bounded regression check

Compared original DEV handoff
`9c1d1ef4c020603296154000cccaea5c9c111dc6`
to R1 handoff
`74542bcff80017da04aca5a412f610f4810024f0`.

R1 changed only:
- `product/source/styles.css`;
- `product/source/web-shell.js`;
- `qa/ink-ui-a-photoshop-shell-panels.test.mjs`;
- `ACTIVE/INK_DEV_PROGRESS.md`.

No new regression requiring a broader UI-A re-review was found.

Preserved:
- 11-menu order;
- 14 panel homes;
- existing panel registries;
- approved Logo route;
- approved Favicon route;
- Core semantics;
- `FORMAT_VERSION = 4`;
- no P2 capability implementation;
- no UI-B start;
- no central Runtime.

## 6. Environment note

UR could not execute a full local product browser session in this review environment because the repository cannot be network-cloned into the local browser container.

This does not reopen the bounded blockers:
- UR-A-01 and UR-A-03 are framework/authority findings proven directly in R1 source;
- UR-A-02 is the specific CSS-authority mismatch from the initial review, and the final later Light override now covers every named blocked interior surface.

Full integrated visual/runtime fidelity remains intentionally deferred by program policy until the later UI-C/final exact-SHA gate.

## 7. UR disposition

`UI_A_R1_UR = PASS`

All three bounded findings from the initial UR review are closed at UI-A scope.

UR does not promote UI-A and does not authorize UI-B directly.

```text
UR_A_01 = CLOSED
UR_A_02 = CLOSED
UR_A_03 = CLOSED
NEW_BOUNDED_FINDINGS = 0
UI_A_PROMOTION = HOLD_FOR_MR
UI_B = HOLD
CENTRAL_RUNTIME = NOT_RUN
DEV = STOP
NEXT_OWNER = MR
STOP = YES
```
