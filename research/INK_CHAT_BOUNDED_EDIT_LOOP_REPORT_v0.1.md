# INK CHAT Bounded Edit Loop Report v0.1

## Status

```text
TASK_ID = INK-CLOUD-011
BRANCH = work/ink-cloud-011
GATE = CHAT_BOUNDED_EDIT_LOOP_WORKS
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

## Objective completed

INK-CLOUD-011 adds the first transport-neutral CHAT Review + Structured Edit Task contract on top of the accepted INK creative-loop primitives.

The implemented boundary is:

```text
authoritative INK document
→ deterministic CHAT-readable state summary
→ bounded structured edit task
→ proposal
→ explicit local approval
→ revalidate expected state
→ execute through accepted editor controller
→ existing History
→ deterministic result / diagnostic
```

Proposal, approval and rejection do not mutate the authoritative document. Execution is not eligible until a matching local approval state/token exists.

## CHAT state summary contract

Implemented:

```text
INK-CHAT-STATE-SUMMARY / version 1
```

The summary exposes bounded, structured information suitable for CHAT/tool transport:

- document/page identity and active page/layer state;
- stable `pageId / layerId / objectId` references;
- deterministic hierarchy/render order;
- effective visibility, lock, opacity and interaction exposure;
- bounded geometry summaries;
- Path subpath/anchor counts and geometry fingerprint;
- bounded Path appearance state;
- bounded extraction/source provenance;
- deterministic per-object state fingerprints.

It intentionally does not serialize arbitrary raster/binary object payloads.

## Structured edit-task contract

Implemented:

```text
INK-CHAT-EDIT-TASK / version 1
INK-CHAT-EDIT-PROPOSAL / version 1
INK-CHAT-EDIT-RESULT / version 1
```

Initial allowlisted operations:

- `path.repaint.v1`
- `path.material.apply.v1`
- `path.material.remove.v1`
- `object.translate.v1`
- `path.simplify.v1`
- `path.refine.v1`

Each operation has bounded, operation-specific arguments. Target lists are bounded and use stable object references. Path simplify/refine are single-target operations.

There is no arbitrary script/eval field.

## Proposal and approval boundary

`ChatBoundedEditController` maintains browser-local proposal state.

State transition:

```text
PROPOSED
→ APPROVED + local approval token
→ EXECUTED
```

A proposal captures:

- current document ID;
- current page ID;
- target state fingerprints;
- overall state fingerprint.

Before approval and again immediately before execution, the task is revalidated.

Rejected before mutation:

- wrong/inactive page;
- missing/stale target;
- wrong Path target type;
- locked target;
- hidden target;
- interaction-unexposed target;
- singular target transform;
- busy History at execution;
- stale document/page/target fingerprint;
- missing or wrong approval token;
- unsupported operation or invalid arguments.

## Execution architecture

No second mutation engine was introduced.

Approved operations route to existing accepted paths:

### Repaint / material

Uses existing:

```text
PathRepaintMaterialController
→ HistoryManager.pushScoped(...)
```

### Object movement

Uses existing:

```text
InkApp.translateSelection(...)
→ existing composition/transform route
→ HistoryManager.pushScoped(...)
```

### Path simplify / refine

Uses existing:

```text
PathEditController
→ existing vector primitives
→ HistoryManager.pushScoped(...)
```

Temporary selection required by an accepted controller route is restored after the structured operation.

History remains the authoritative mutation/rollback mechanism. Successful execution consumes the approval state/token.

## Static/browser-local core

The core contract is installed directly in shared browser source:

- `app.chatBoundedEdit`
- `app.chatBoundedEditAdapter`

The module is exported by the shared editor barrel and included in the existing service-worker application shell.

The collaboration core requires no backend, WebSocket, XHR or remote AI service. A future transport or AI adapter can call the same bounded adapter without changing mutation semantics.

## Files changed

Product source:

- `product/source/src/editor/chat-bounded-edit.js` — state summary, task/proposal/result schema, validation, approval gate, execution routing and adapter;
- `product/source/src/editor/index.js` — shared export;
- `product/source/src/ink.js` — shared runtime installation and architecture marker;
- `product/source/service-worker.js` — static/offline shell cache entry.

QA:

- `qa/core/tests/unit/chat-bounded-edit-core-v0.1.test.mjs`;
- `qa/core/tests/unit/chat-bounded-edit-source-v0.1.test.mjs`;
- `qa/core/evidence/INK_CLOUD_011_STATIC_CHECKS.txt`.

Progress/report:

- `ACTIVE/INK_DEV_PROGRESS.md`;
- `research/INK_CHAT_BOUNDED_EDIT_LOOP_REPORT_v0.1.md`.

No package path, config format definition, document model, migration or file-envelope source was changed.

## Regression evidence

Executed checks recorded in:

`qa/core/evidence/INK_CLOUD_011_STATIC_CHECKS.txt`

Executed PASS evidence includes:

- exact GitHub-source architecture/static checks;
- lightweight syntax parse from exact committed branch source for the new collaboration module and new test files;
- isolated execution harness using the exact committed collaboration source blob;
- deterministic state summary;
- proposal zero mutation;
- approval zero mutation;
- unapproved execution rejection;
- repaint execution;
- transform execution;
- Path simplify execution;
- locked-target rejection;
- stale-target rejection;
- forced mutation failure rollback through a History-style transaction;
- branch scope compare against the authorized base;
- `FORMAT_VERSION = 4`;
- package mutation = 0;
- serialization surface mutation = 0.

The committed Node regression files additionally cover existing-controller History undo/redo, hidden/singular/missing guards, deterministic no-op behavior and atomic rollback.

## Not executed

The following are not claimed PASS:

- full repository Node unit runner;
- real browser interaction/runtime validation;
- service-worker browser lifecycle validation;
- rose-window benchmark.

The full Node runner was not executable in the available DEV environment because direct exact-branch checkout failed before checkout when the environment could not resolve `github.com`.

Per Current Work Order:

```text
RUNTIME_QA = DEFERRED
```

## Known bounded limitations

- proposal registry and approval tokens are intentionally browser-local/session-local; persistence/collaboration backend is outside this task;
- the first operation vocabulary is deliberately small and allowlisted;
- transform support in v0.1 is bounded to translation;
- Path edit task support in v0.1 is bounded to accepted simplify/refine operations;
- this task does not define Revision closure, cloud synchronization, collaboration presence/conflict resolution or a mandatory remote AI service;
- no broad end-user CHAT UI was added; the deliverable is the shared transport-neutral contract/adapter.

## Acceptance gate

```text
CHAT_STATE_SUMMARY = IMPLEMENTED
STRUCTURED_EDIT_TASK_SCHEMA = IMPLEMENTED
PROPOSAL_EXECUTION_SEPARATION = PRESERVED
APPROVAL_BOUNDARY = IMPLEMENTED
BOUNDED_EXECUTION = IMPLEMENTED
EXISTING_EDIT_CONTROLLERS = REUSED
HISTORY = REUSED
ATOMIC_FAILURE = PRESERVED
STATIC_BROWSER_LOCAL_CORE = PRESERVED
REMOTE_SERVICE_REQUIRED = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

## Handoff

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-011
BRANCH = work/ink-cloud-011
GATE = CHAT_BOUNDED_EDIT_LOOP_WORKS
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
