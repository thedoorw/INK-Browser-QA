# INK-CHAT-CONNECTOR-001 — Agent Connector Foundation Evidence v0.1

STATUS: `DEV_SOURCE_STATIC_ISOLATED_QA_PASS / HANDOFF_READY`

## Scope

Implemented only the authorized Connector-001 foundation:

- one `app.inkPublicApi` facade;
- deterministic capability metadata;
- Adobe-style named-tool registry;
- JSON-safe `INK_AGENT_RESULT`;
- Document / Selection / Inspect through the existing Document Bridge;
- Reference decomposition through the existing CHAT Reference Handoff;
- bounded edit inspect / propose / approve / execute through the existing bounded-edit adapter;
- History inspect / undo / redo through the existing `HistoryManager`;
- Revision current / list / capture / restore through the existing `RevisionController`.

No `use_ink`, MCP/plugin transport, preview/screenshot transport, new drawing/trace behavior, schema change, or second authority was introduced.

## Product implementation

Implementation source checkpoint before documentation:

`f6495effb2bbcae927a247c26b134089f5ca6cbb`

Final product/QA diff from branch handoff base `611c025d983dbbde2dc8200ddebca0df55011596`:

- `product/source/src/agent/index.js`
- `product/source/src/agent/public-creative-api.js`
- `product/source/src/ink.js`
- `qa/ink-chat-connector-001-agent-foundation.test.mjs`

A transient Service Worker/build-identity maintenance edit was identified as outside the Current Work Order non-goals and fully reverted. Final diff for `product/source/service-worker.js` and `product/source/src/config.js` is zero.

## Public Creative API

Installed once after the existing bounded-edit authority:

`installChatBoundedEdit(this) → installInkPublicCreativeApi(this)`

Surface:

- `capabilities()`
- `context(options)`
- `selection(options)`
- `inspect(refsOrObjectIds, options)`
- `reference.decompose(referenceObjectId, options)`
- `edit.inspect()`
- `edit.propose(task)`
- `edit.approve(proposalId)`
- `edit.execute(proposalId, approvalToken)`
- `history.inspect()`
- `history.undo()`
- `history.redo()`
- `revision.current()`
- `revision.list(documentId)`
- `revision.capture(options)`
- `revision.restore(revisionId, options)`
- `tools.registry()`
- `tools.invoke(name, input)`

No unrestricted `window` or `globalThis` connector surface was added.

## Named tools

Registry order is deterministic and maps each named tool to one Public API method:

1. `get_ink_capabilities`
2. `get_ink_context`
3. `get_ink_selection`
4. `inspect_ink_objects`
5. `decompose_ink_reference`
6. `propose_ink_edit`
7. `approve_ink_edit`
8. `execute_ink_edit`
9. `get_ink_history`
10. `undo_ink`
11. `redo_ink`
12. `get_ink_revisions`
13. `capture_ink_revision`
14. `restore_ink_revision`

Each descriptor records role, authoritative route, approval requirement, History expectation, Revision expectation, availability, routing class, and result-envelope contract.

Routing classes exercised:

- `READ_ONLY`
- `NAMED_TOOL`
- `PROPOSAL_REQUIRED`
- `PROGRAMMABLE_FUTURE`
- `UNAVAILABLE`

`composition.programmable` is metadata-only / future; no programmable executor exists in Connector-001.
`external.transport` is explicitly unavailable.

## INK_AGENT_RESULT

All Public API and named-tool operations return the same JSON-safe envelope:

```text
schema
version
action
status
documentId
pageId
revisionId
targetRefs[]
createdRefs[]
changedRefs[]
historyReceipt
revisionReceipt
provenanceReceipt
outputHandles[]
diagnostics[]
result
```

The connector clones/sanitizes returned structures and does not return live mutable `app.doc` references, Blob/Canvas/DOM objects, functions, cyclic structures, or transport handles.

## Authority delegation

| Connector surface | Existing authority |
| --- | --- |
| Context / Selection / Inspect | `buildAIDocumentBridge` |
| Reference decomposition | `app.chatReferenceHandoff.decomposeReference` |
| Bounded edit | `app.chatBoundedEditAdapter` |
| History | `app.history` / existing `HistoryManager` |
| Revision | `app.revisions` / existing `RevisionController` |

Authority changes:

```text
DOCUMENT_AUTHORITY_CHANGE = 0
HISTORY_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
DECOMPOSITION_AUTHORITY_CHANGE = 0
FORMAT_VERSION_CHANGE = 0
```

## Executed DEV checks

Because this DEV environment is connector-only and cannot resolve `github.com` for a full checkout, the same accepted project method used by earlier Connector/Core work was used: exact GitHub branch blobs + V8 syntax/static parsing + isolated execution harness.

Executed against exact committed Connector-001 source:

- Public API source syntax parse — PASS
- focused QA source syntax parse — PASS
- deterministic capability/result serialization — PASS
- required 14 named tools and one-to-one Public API mapping — PASS
- routing-class coverage — PASS
- Document/Selection/Inspect detached-result behavior — PASS
- Reference Handoff delegation — PASS
- bounded proposal → approval → execute delegation — PASS
- invalid approval token rejection — PASS
- History inspect/undo/redo delegation — PASS
- Revision list/capture/restore delegation — PASS
- JSON-safe result serialization — PASS
- no `eval` / `Function` / direct `app.doc =` / new global / transport / new trace implementation — PASS
- `FORMAT_VERSION = 4` — PASS
- final branch scope compare — PASS

## Required regression preservation

Required regression test blobs on this branch are byte-identical to current `main` accepted baselines:

- Phase B: `qa/chat-validation-001-phase-b-line-color.test.mjs`
  - blob `bfb9f62074ebdee159670e635184e2525668beff`
- bounded edit: `qa/core/tests/unit/chat-bounded-edit-core-v0.1.test.mjs`
  - blob `53dfcbea5a301b09003bdcec8fc1c8c96b7b628d`
- document: `qa/core/tests/unit/document.test.mjs`
  - blob `4bc0449d5fe1ae5dc1f41de39bac834db5ae2ce0`
- history: `qa/core/tests/unit/history.test.mjs`
  - blob `b55fdbfa1628a9973c9cd9fe785b35247b1742c3`
- revision: `qa/core/tests/unit/revision-closure-core-v0.1.test.mjs`
  - blob `1afde9e32430f2daad297b2ab9b2fad94ca8a992`

Exact current authority blobs are also unchanged from `main`:

- Document Bridge `f55262329ea4d792bf55c5fb04e3e342301fddfd`
- Reference Handoff `7e63499c914670ce6176011d1d88a92c1d472bae`
- bounded edit `a0051d60d016d1875a881708e249590b9fe207e3`
- History `a1c3cefe60b9923d030bcead1d8565b134aebd21`
- Revision `18028bb15866ff07c87d81073a63a3265ff6839e`

Current exact regression/source blobs passed the available V8 syntax parse harness. Phase B, which contains top-level await, passed the async-function syntax harness.

Accepted historical execution evidence remains applicable to those unchanged blobs:

- bounded edit: `qa/core/evidence/INK_CLOUD_011_STATIC_CHECKS.txt`
- Revision: `qa/core/evidence/INK_CLOUD_012_STATIC_CHECKS.txt`
- retained Document/History core: `qa/core/evidence/INK_CLOUD_006_NODE_CHECKS.txt`

No full repository `node --test` rerun is claimed in this connector-only DEV environment. Browser Runtime QA remains deferred to MR per the active work status.

## Final boundaries

```text
DIRECT_DOCUMENT_JSON_MUTATION = 0
LIVE_MUTABLE_REFERENCE_RETURNED = 0
SECOND_TOOL_AUTHORITY = 0
SECOND_HISTORY = 0
SECOND_REVISION = 0
SECOND_GEOMETRY = 0
SECOND_DECOMPOSITION = 0
ARBITRARY_EXECUTION_BRIDGE = 0
MCP_PLUGIN_TRANSPORT = 0
PREVIEW_SCREENSHOT_TRANSPORT = 0
NEW_DRAWING_OPERATION = 0
NEW_TRACE = 0
ADOBE_RUNTIME_DEPENDENCY = 0
FORMAT_VERSION = 4 / PRESERVED
```

Gate: `DEV_HANDOFF → STOP → MR exact-HEAD review`.
