# INK REVIEW STATUS

STATUS: `INK-WEB-UI-002 / DEV_READY / MR_REVIEW_PENDING_HANDOFF`

| Field | Value |
|---|---|
| TASK_ID | `INK-WEB-UI-002` |
| DEV_BRANCH | `work/ink-web-ui-002` |
| TARGET_GATE | `INK_UI_RUNTIME_GUARD_SOURCE_COMPLETE` |
| DEV_HANDOFF | `NO` |
| MR_REVIEW | `NOT_STARTED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| UI_MUTATION | `NO NEW VISUAL REDESIGN` |
| WORKFLOW_MUTATION | `AUTHORIZED / BOUNDED` |
| PACKAGE_INK_CURRENT | `NO_MUTATION` |
| BROWSER_RUNTIME_QA | `DEFERRED_TO_BATCH` |

## MR review boundary

MR will verify:

- full Runtime no longer auto-triggers from ordinary DEV push in the current batch workflow;
- no `-ExecutionPolicy Bypass`, `Set-ExecutionPolicy`, AV exclusions, or downloaded remote PS execution in the current batch path;
- no child PowerShell process pattern that opens a visible extra window;
- exact target ref/SHA remains testable;
- Portable/Web shared-shell parity test is deterministic and catches structural drift;
- intentional delivery-specific differences remain allowed;
- `FORMAT_VERSION = 4`;
- product UI behavior is not redesigned again in this task;
- no package mutation.

## Previous accepted UI baseline

```text
INK-WEB-UI-001 = MR_PASS / PROMOTED
PR = #22
MAIN = 29f06010fa539e5951d18d48b88045ab75ace84a
```
