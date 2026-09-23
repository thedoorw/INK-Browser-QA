# INK DEV PROGRESS

STATUS: AUTHORIZED / NOT_STARTED

TASK_ID: INK-UI-DEBT-001
TITLE: Shell / Panel Authority Consolidation v0.1
BRANCH: work/ink-ui-debt-001
BASE_MAIN: 4c1834fdb1b93c843e15455f6468e39bceef8ef1

TASK_STATUS: AUTHORIZED / NOT_STARTED
DEV_HANDOFF: NOT_YET
UR_REVIEW: PENDING_AFTER_HANDOFF

RUNTIME_QA: REQUIRED
TINYFISH_USED: NO
PORTABLE_WEB_PARITY: REQUIRED

## Priority

P0:
- single primary-panel authority;
- fresh-entry collapsed;
- reliable open/close;
- remove competing Chevron handler;
- remove Dock occlusion.

P1:
- duplicate navigation removal;
- Inspector/header geometry cleanup;
- CSS shell authority consolidation.

P2:
- Advanced shared-state cleanup;
- architecture-aware tests;
- preserve favicon.

## Explicit non-goal

Do not add new UI features.
Do not perform cosmetic theme redesign.
Do not expand Core scope.

## Runtime policy

Complete implementation + source/static/unit/parity checks first.
Run PowerShell Windows Runtime only after the full bounded cleanup is complete.
TinyFish is prohibited.

Runtime blocked:
`RUNTIME_BLOCKED → STOP`
