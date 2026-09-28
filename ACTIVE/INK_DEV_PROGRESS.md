# INK DEV Progress

STATUS: `UI-A / PROMOTED / DEV_STOP / UI-B_NOT_STARTED`
TASK: `INK-UI-A-PHOTOSHOP-SHELL-PANELS-001 / UI-A-R1`
BRANCH: `work/ink-ui-a-photoshop-shell-panels-001`

UPSTREAM_DEV_HANDOFF_HEAD: `9c1d1ef4c020603296154000cccaea5c9c111dc6`
UPSTREAM_EXACT_IMPLEMENTATION_QA_HEAD: `7ca7045b1de50173d33dee187a962b840419410a`
R1_EXACT_IMPLEMENTATION_QA_HEAD: `1b3df1f61f52fd373f082b6780118440b099e5a7`

Authority read from current GitHub SSOT:
- `working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_BOUNDED_REVISION_WORKPACK_v1.0.md`
- `working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_UR_REVIEW_v1.0.md`
- `working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_MR_REVIEW_v1.0.md`

The three revision authority files are current on the default branch and were not merged/rebased into the existing DEV branch. R1 was executed directly on the mandatory original branch.

## UI-A-R1 bounded closure

Only the three authorized UR blockers were changed.

### UR-A-01 — expanded stacked panel-group / splitter framework

CLOSED.

- `PANEL_DEFS` and `PANEL_GROUPS` remain the only panel registries.
- Added one shell-owned `shellPanelStackFramework`.
- Stack regions are generated directly from `PANEL_GROUPS`; no second panel registry/state machine exists.
- Added a `3 px` splitter structural token/host.
- The framework follows the existing active panel and moves between Inspector / Creative presentation without duplicating their authorities.
- Existing right-edge attachment and `--active-panel-w` canvas reflow are preserved.
- Detailed splitter drag/cursor fidelity remains UI-C as authorized.

### UR-A-02 — Light theme panel interiors

CLOSED.

Final UI-A Light overrides now cover:
- Properties / Specialist property cards, rows, form controls;
- Layers list/rows/footer;
- History list/rows/footer;
- Creative Workspace state, tabs, body, fields, status and CHAT/structure surfaces.

The closure uses the existing semantic Light tokens:
- `--ink-ui-surface`
- `--ink-ui-surface-subtle`
- `--ink-ui-border`
- `--ink-ui-text`
- `--ink-ui-text-muted`
- `--ink-ui-accent`

Legacy dark rules remain only as upstream historical CSS and are overridden later in the final UI-A desktop Light block. No second theme authority was created.

### UR-A-03 — shared Creative / Inspector resize authority

CLOSED.

- Added one shell-owned `shellActivePanelResizer` for the currently active expanded panel.
- Inspector's legacy direct resize edge is hidden in desktop primary-panel state so only the shared shell edge is interactive.
- Inspector and Creative panels both route width changes through the existing `--inspector-w` authority.
- Existing persistence key remains `ink-inspector-width`.
- Default remains `252 px`.
- Elastic bounds remain `244–420 px`.
- Canvas reflow remains coupled to measured `--active-panel-w`.
- No Creative Workspace Core/source authority was modified.

## Changed files — R1 only

From `9c1d1ef4c020603296154000cccaea5c9c111dc6` through the implementation/QA HEAD:

- `product/source/styles.css`
- `product/source/web-shell.js`
- `qa/ink-ui-a-photoshop-shell-panels.test.mjs`

Plus:
- `ACTIVE/INK_DEV_PROGRESS.md` — this handoff report.

No other product source file was changed in UI-A-R1.

## Focused/static QA

Central Runtime: **NOT RUN — prohibited.**

PASS:
- `web-shell.js` syntax compilation.
- exact 11 top-level menu order retained.
- exact 14 panel homes retained.
- exactly one `PANEL_DEFS` registry retained.
- exactly one `PANEL_GROUPS` registry retained.
- stacked expanded-panel framework derives from `PANEL_GROUPS`.
- `3 px` splitter framework exists.
- Light closure occurs after legacy dark rules.
- Properties Light interior coverage.
- Layers Light rows/footer coverage.
- History Light list/rows/footer coverage.
- Creative Workspace Light state/tabs/body coverage.
- one shared shell active-panel resize edge.
- shared `--inspector-w` + `ink-inspector-width` authority.
- elastic `244–420 px` width bounds.
- canvas reflow via `--active-panel-w` retained.
- `index.html` generation parity retained.
- `index-standalone.html` generation parity retained.
- focused QA file contains explicit UR-A-01 / UR-A-02 / UR-A-03 assertions.
- approved visible Logo route preserved.
- approved browser Favicon route preserved.

Local browser smoke: **NOT RUN**. The workpack marks browser smoke as allowed, not required; no central/runtime substitute was started.

## Regression / mutation boundary

```text
CORE_SEMANTIC_MUTATION = 0
FORMAT_VERSION_CHANGE = 0
P2_CAPABILITY_IMPLEMENTATION = 0
SECOND_PANEL_STATE_AUTHORITY = 0
SECOND_PANEL_WIDTH_AUTHORITY = 0
SECOND_THEME_AUTHORITY = 0
CREATIVE_WORKSPACE_CORE_FILE_MUTATION = 0
LOGO_ROUTE = PRESERVED
FAVICON_ROUTE = PRESERVED
CENTRAL_RUNTIME = NOT_RUN
UI_B = NOT_STARTED
```

Visible INK logo remains:
`assets/INK_MARK_SOURCE_W-300.jpg?v=0.1`

Browser favicon remains:
`assets/favicon.svg?v=0.1`

## Gate / handoff

```text
UI_A_R1_DEV = COMPLETE
UR_A_01 = CLOSED_BY_DEV / MR_UR_RECHECK_REQUIRED
UR_A_02 = CLOSED_BY_DEV / MR_UR_RECHECK_REQUIRED
UR_A_03 = CLOSED_BY_DEV / MR_UR_RECHECK_REQUIRED
NEXT_OWNER = MR
UI_A_PROMOTION = HOLD
UI_B = HOLD
CENTRAL_RUNTIME = HOLD
DEV = STOP
```

MR should technically re-review this exact R1 branch, then return accepted UI-A-R1 to UR for the bounded recheck.


## Promotion result

```text
UI_A_R1_MR = PASS
UI_A_R1_UR = PASS
UI_A_PROMOTION_PR = 83
UI_A_PROMOTION_MERGE = f839f542d6da1eaa68791a0c8f3a5834b6ba0868
UI_A = PROMOTED
UI_B = NOT_STARTED
DEV = STOP
CENTRAL_RUNTIME = NOT_RUN
```

No UI-B implementation is authorized by this progress update.
