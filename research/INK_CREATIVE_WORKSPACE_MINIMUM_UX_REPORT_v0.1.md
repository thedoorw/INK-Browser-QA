# INK Creative Workspace Minimum UX Report v0.1

Task: `INK-CLOUD-014`  
Branch: `work/ink-cloud-014`  
Target gate: `CREATIVE_WORKSPACE_MINIMUM_UX_WORKS`

## 1. Result

The accepted INK creative engine chain is now exposed through one compact Creative Workspace without introducing a second document, selection, History, CHAT, extraction, Path-edit, material or Revision authority.

The workspace covers:

`Reference → Extract → editable Path → Path Edit / Expressive Stroke → Compose / Repaint / Material → CHAT bounded edit → Revision capture / restore`

The implementation remains static-hosted and browser-local.

## 2. Workspace state model

The workspace renders current runtime state rather than owning a parallel document model.

Visible context includes:

- current document ID/title and page ID/name;
- active workspace stage and current editor/tool context;
- selected object ID/type;
- extraction/source provenance when available;
- current Revision ID;
- current CHAT proposal state;
- History pending/undo/redo diagnostics.

Normal tool, selection and History refresh paths now also refresh the workspace state view.

## 3. Reference → Extract → Path

The previous extraction engine was not replaced.

The workspace delegates to the existing extraction authority:

- `decodeReferenceFile`;
- `extractIntoDocument`;
- ImageTracer adapter;
- `setReferenceOverlay`.

The old duplicate Core-panel extraction controls were removed from `installExtraction`; that module is now controller/API-only.

A successful extraction keeps existing provenance and selects the first accepted editable Path through the existing selection API.

## 4. Edit → Compose → Repaint

The workspace exposes existing editor operations only.

Path/edit:

- enter/exit Path editing;
- simplify/refine;
- assign/remove expressive stroke.

Composition/appearance:

- duplicate;
- group;
- frame;
- front/back organization;
- repaint selected Path;
- apply/remove material reference.

No alternate Path editor, composition tree, material engine or History engine was introduced.

## 5. CHAT ↔ canvas bounded edit

The workspace exposes the accepted bounded-edit sequence:

`Inspect → Propose → Approve / Reject → Execute`

Execution requires a local approval token. A pre-approval execute attempt is blocked with `APPROVAL_REQUIRED`.

Supported workspace proposals use the existing `INK-CHAT-EDIT-TASK v1` operations and current canvas selection. Stale/invalid targets remain failures from the accepted controller; the workspace does not silently retarget them.

No multi-step planner or autonomous approval was added.

## 6. Revision UX

The workspace exposes:

- current Revision identity;
- labeled capture checkpoint;
- stored Revision list;
- bounded before/after object-count summary from the existing Revision comparison;
- restore of a selected Revision;
- visible `RESET_TO_REVISION` History boundary after restore.

The comparison shown in the UI is read directly from `RevisionController.capture().comparison.objectCounts`; no second diff/comparison engine was added.

Failed restore atomicity remains owned by the accepted Revision controller.

## 7. Bounded fixes found during Phase F

Two workspace-level gaps were found and corrected during executable regression:

1. **Live state synchronization**
   - Initial shell refresh was guaranteed for full refreshes and workspace-originated actions, but ordinary tool/selection/History changes could leave the panel stale.
   - Fixed by wiring the view refresh into existing tool, selection and History UI refresh paths.

2. **Revision comparison visibility**
   - Capture already retained the accepted comparison metadata but did not render its bounded before/after summary.
   - Fixed by showing object counts: before→after, added, removed, changed and touched.

Neither fix changes document format or engine authority.

## 8. QA

Executed against exact GitHub branch source:

| Check | Result |
|---|---|
| creative-workspace source parse/evaluation | PASS |
| state model / provenance / Revision diagnostics | PASS |
| deterministic controller-delegation workspace path | PASS |
| CHAT execute-before-approval guard | PASS |
| Revision restore `RESET_TO_REVISION` boundary | PASS |
| source/static gate before final bounded fix | 28/28 PASS |
| source/static gate after final bounded fix | 25/25 PASS |
| Revision comparison display harness | PASS |

Reproducible test added:

`qa/core/tests/unit/creative-workspace-minimum-ux-v0.1.test.mjs`

Evidence:

`qa/core/evidence/INK_CLOUD_014_WORKSPACE_QA.txt`

GitHub Actions are unavailable because the Work Order records exhausted quota.

Browser/runtime interaction was not executed and is not claimed:

`RUNTIME_QA = DEFERRED`

## 9. Acceptance gate

```text
MINIMUM_WORKSPACE = IMPLEMENTED
STATE_VISIBILITY = IMPLEMENTED
REFERENCE_EXTRACT_PATH_UI = CONNECTED
PATH_EDIT_UI = CONNECTED
COMPOSE_REPAINT_UI = CONNECTED
CHAT_APPROVAL_LOOP_UI = CONNECTED
REVISION_CAPTURE_RESTORE_UI = CONNECTED
EXISTING_CONTROLLERS = REUSED
STRUCTURED_DOCUMENT = PRESERVED
HISTORY_REVISION_BOUNDARY = PRESERVED
STATIC_BROWSER_LOCAL_CORE = PRESERVED
REMOTE_SERVICE_REQUIRED = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Gate:

`CREATIVE_WORKSPACE_MINIMUM_UX_WORKS`

## 10. Handoff

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-014
BRANCH = work/ink-cloud-014
GATE = CREATIVE_WORKSPACE_MINIMUM_UX_WORKS
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
