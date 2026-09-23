# INK DEV PROGRESS

STATUS: IN_PROGRESS / CHECKPOINT_1_AUTHORITY

TASK_ID: INK-UI-DEBT-001
TITLE: Shell / Panel Authority Consolidation v0.1
BRANCH: work/ink-ui-debt-001
BASE_MAIN: 4c1834fdb1b93c843e15455f6468e39bceef8ef1

TASK_STATUS: IN_PROGRESS
DEV_HANDOFF: NOT_YET
UR_REVIEW: PENDING_AFTER_HANDOFF

RUNTIME_QA: REQUIRED / NOT_RUN
TINYFISH_USED: NO
PORTABLE_WEB_PARITY: REQUIRED

## Checkpoint 1 — primary authority + navigation de-duplication

Implemented:
- explicit desktop primary-panel state set: collapsed / properties / layers / history / reference / compose / chat / revision;
- `web-shell.js` is the desktop open/close + active-selection authority;
- removed legacy `ink.js` ownership of `#inspectorEdgeToggle` and `#closeInspector`;
- desktop object-context reveal routes through `INK_WEB_SHELL.open('properties')`;
- tool changes no longer hijack an already selected Dock Layers / History route;
- mobile Inspector behavior remains separate;
- Inspector top navigation is now explicit Properties-only sub-navigation;
- Layers / History were removed from internal top-level navigation while their content surfaces remain direct Dock destinations;
- fresh entry is explicitly collapsed; only last panel identity is persisted.

Pre-cleanup debt confirmed:
- `ink.js` and `web-shell.js` both bound the same Chevron;
- Layers / History existed both in Dock and Inspector top tabs;
- legacy object/tool context could directly change desktop Inspector open/active state.

## Next checkpoint

- consolidate desktop shell CSS authority;
- relocate Chevron to canvas / primary-panel boundary;
- remove known contradictory legacy shell/tab overrides;
- add architecture-aware unit/parity guards;
- run source/static/unit/parity checks.

## Runtime policy

Runtime has NOT been run.
Complete implementation + source/static/unit/parity checks first.
PowerShell Windows Runtime is final-stage only.
TinyFish is prohibited.

Runtime blocked rule:
`RUNTIME_BLOCKED → STOP`
