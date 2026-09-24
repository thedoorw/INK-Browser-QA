# INK DEV PROGRESS

STATUS: `INK-WEB-UI-006 / PHASE_C_D / DEV_IN_PROGRESS`

## Task

```text
TASK_ID = INK-WEB-UI-006
PHASE = C_D
ROLE = UI DEV
BRANCH = work/ink-web-ui-standard-001
BASELINE = main @ 042b4f9f7528b14df6d10593b61f65565b3779ac
RECONCILIATION = CLEAN / MAIN PRODUCT+QA AUTHORITY + UI BRANCH DOCS
PHASE_E_PLUS = NOT_AUTHORIZED
DOCUMENT_AUTHORITY_CHANGE = 0
HISTORY_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
RENDERER_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4 / PRESERVE
```

## Authorized scope

- Phase C — top cleanup only.
- Phase D — left toolbar one/two-column layout only.
- UI preference may use localStorage.
- Must preserve tool order, shortcuts, Draw family and Core semantics.
- Must preserve technical-debt cleanup from `INK-TECH-DEBT-001`.
- `node product/source/generate-shell.mjs --check` must pass.
- STOP after `DEV_HANDOFF → UR_REVIEW`.

## Baseline reconciliation

The previous UI branch pre-dated the accepted technical-debt cleanup. This branch is reconciled explicitly to current `main` product/QA authority rather than carrying forward its old duplicated HTML/CSS/bootstrap implementation.

Preserved branch-local UI documents:
- `research/INK_IDEAL_UI_STANDARD_v0.1.md`
- `working/INK_UI_MODIFICATION_CHECKLIST_v0.1.md`
- `working/INK_WEB_UI_006_WORK_ORDER.md`
- `working/INK_WEB_UI_006_DEV_HANDOFF.md`
- `working/INK_WEB_UI_006_PHASE_A_COMMAND_MAP.md`

No Phase C/D product edits have been made at this checkpoint.
