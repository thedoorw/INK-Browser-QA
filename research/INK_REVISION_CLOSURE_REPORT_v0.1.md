# INK Revision Closure Report v0.1

Task: `INK-CLOUD-012`  
Branch: `work/ink-cloud-012`  
Base main: `8215489b7c52c741bccd927c38bd72749ea605cb`  
Gate: `CREATIVE_LOOP_V1_COMPLETE`

## Result

Revision Closure v0.1 is implemented as a browser-local, transport-neutral layer over the accepted INK structured document, file-envelope, storage, History and CHAT bounded-edit contracts.

No second document, History, hierarchy, vector, transform or renderer engine was introduced. Revision snapshots preserve authoritative structured INK state rather than flattened/raster output.

## Implemented contract

### Revision identity + snapshot

- `INK-REVISION-RECORD` version 1.
- Stable revision identity derived from document identity, parent relation, sequence and deterministic document fingerprint.
- Parent/base revision relation, creation time, reason and label are retained.
- Snapshot payload reuses `INK-FILE-ENVELOPE`.
- Record, envelope and document fingerprints are validated before use.

### Before/after metadata

- `INK-REVISION-COMPARISON` version 1.
- Deterministic before/after document fingerprints.
- Added / removed / changed / touched object counts.
- Bounded stable object-ID lists.
- Structure / geometry / appearance facet fingerprints.
- Equivalent capture is a no-op and retains the existing parent Revision.

### Browser-local capture + persistence

- `RevisionController` reuses the existing `InkStore`.
- Revision record and bounded document Revision index are persisted through the existing IndexedDB/localStorage/memory fallback path.
- Core semantics require no backend or remote service.
- Capture does not mutate the active document.

### Restore / reopen

- Revision records are fully validated before active-document mutation.
- Restore unwraps the existing file-envelope and verifies the exact document fingerprint.
- Successful restore creates an explicit `RESET_TO_REVISION` History boundary by clearing the existing History manager; it does not introduce a second History mechanism.
- Restore preserves structured objects, IDs, geometry, appearance, provenance and editable document state.
- Failed validation leaves the active document unchanged.
- Failed apply/postcondition restores the prior document, undo/redo stacks, selection, draft, stroke-edit state, dirty state and active Revision identity.

### CHAT binding

- Shared runtime installs Revision before CHAT bounded-edit.
- CHAT state summary exposes current `revisionId` and deterministic document fingerprint.
- Proposal expected-state captures `revisionId`.
- A proposal whose bound Revision is no longer current is rejected with `CHAT_EDIT_STALE_REVISION` before execution.
- Successful CHAT result records inspected/current Revision IDs plus resulting document fingerprint.
- CHAT remains a bounded proposal/edit layer; Revision does not become a parallel authoritative document.

## Runtime integration

Changed source integration:

- `product/source/src/document/revision.js`
- `product/source/src/document/index.js`
- `product/source/src/editor/chat-bounded-edit.js`
- `product/source/src/ink.js`
- `product/source/service-worker.js`

Regression coverage added:

- `qa/core/tests/unit/revision-closure-core-v0.1.test.mjs`
- `qa/core/tests/unit/revision-chat-binding-v0.1.test.mjs`
- `qa/core/tests/unit/revision-closure-source-v0.1.test.mjs`
- `qa/core/evidence/INK_CLOUD_012_STATIC_CHECKS.txt`

## QA actually executed

The exact committed source was exercised with connector-side syntax/static/isolated unit harnesses.

Passed checks include:

- capture creation and zero mutation;
- equivalent Revision no-op;
- record validation;
- deterministic changed-object comparison;
- parent relation;
- browser-local persistence reopen;
- restore equivalence;
- explicit History reset boundary;
- corrupt snapshot prevalidation without mutation;
- CHAT proposal Revision binding;
- stale Revision rejection before mutation;
- CHAT state Revision exposure;
- JSON Revision serialize/parse/restore integrity;
- forced mid-restore failure with full document/History/editor-state rollback;
- static `FORMAT_VERSION = 4`;
- Revision installed before CHAT;
- service-worker cache registration;
- no remote dependency in Revision core;
- no package/config/migration source mutation in the checked branch diff.

Authoritative evidence:

`qa/core/evidence/INK_CLOUD_012_STATIC_CHECKS.txt`

Not executed:

- browser runtime / external USER-path QA — `DEFERRED` by Work Order;
- full repository `node:test` runner — not executed in the connector-only DEV environment;
- package rebuild/regeneration — prohibited;
- main merge — prohibited.

## Acceptance gate

```text
REVISION_IDENTITY = IMPLEMENTED
REVISION_SNAPSHOT = IMPLEMENTED
BEFORE_AFTER_METADATA = IMPLEMENTED
RESTORE_REOPEN = IMPLEMENTED
ATOMIC_RESTORE_FAILURE = PRESERVED
CHAT_REVISION_BINDING = IMPLEMENTED
STRUCTURED_DOCUMENT = PRESERVED
HISTORY = REUSED_OR_EXPLICIT_BOUNDARY
STATIC_BROWSER_LOCAL_CORE = PRESERVED
REMOTE_SERVICE_REQUIRED = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

No Hard STOP condition was triggered.

## Checkpoints

- Phase A: `f99c72e64cd328725857509f1ad75387cc3680e8`
- Phase B: `b7424675d8cc3baa62d29a71226a8637c6e86bd9`
- Phase B syntax correction after exact-blob readback: `aa4c9bed77a30afb890d29c3d429cca0b6e77a85`
- Phase C: `ebca644021739b854351939f78ad3ba179d364ac`
- Phase D: `625ab0f240f405b38c3228553bd9f6ff7c3eb96e`
- Phase E tests: `60bcf7dac42f2b5a674f80dc7e64b87ebba42f35`
- Phase E evidence: `6fb15fd0fc83004bf71a1e505198307d65e9a059`

## Handoff

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-012
BRANCH = work/ink-cloud-012
GATE = CREATIVE_LOOP_V1_COMPLETE
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
