# INK CORE INTEGRATION 004 — Grounded Creative Decision & Plan Bridge Report v0.1

## Status

`INK_CORE_INTEGRATION_004_SOURCE_READY`

Task: `INK-CORE-INTEGRATION-004`

Branch: `work/ink-core-integration-004`

Runtime: `DEFERRED_TO_CENTRAL_RUNTIME_QUEUE`

## Objective

Connect one completed grounded reasoning result to the existing editable creative-plan path without creating another plan schema or execution authority:

```text
grounded context / tool evidence
→ final grounded decision
→ existing INK-CHAT-CREATIVE-PLAN candidate
→ existing source / target / operation / dependency validation
→ PROPOSED editable plan
→ STOP at existing user approval boundary
```

## Implemented contract

The browser-local module:

`product/source/src/ai/grounded-creative-decision.js`

defines the thin `INK-GROUNDED-CREATIVE-DECISION` envelope with:

- decision type: `DISCUSSION_ONLY`, `PLAN_PROPOSAL`, `INSUFFICIENT_EVIDENCE` or `UNSUPPORTED`;
- original request and session identity;
- grounded-context fingerprint;
- Runtime-verified tool call/result evidence references;
- explicit grounded object target references;
- bounded rationale and assumptions;
- optional existing-schema creative-plan candidate;
- explicit unresolved and unsupported evidence;
- deterministic fingerprint.

Equivalent target, assumption and evidence sets normalize deterministically. A supplied fingerprint must match the locally derived fingerprint.

## Existing plan authority reuse

Only `PLAN_PROPOSAL` may include a plan candidate. The candidate must use the existing:

`INK-CHAT-CREATIVE-PLAN / version 1`

The bridge calls `createChatCreativePlanProposal()` and then the installed `ChatCreativePlanController.propose()` path. Therefore existing authority remains responsible for:

- current document, page, Revision and document-fingerprint identity;
- operation allowlist and argument bounds;
- visible, unlocked, exposed and invertible target validation;
- target type and target-fingerprint validation;
- ordered dependency graph validation;
- History-idle validation.

Every candidate target must additionally be present in the grounded decision target set. Unknown, hidden, stale and ungrounded targets are rejected; unsupported operations are rejected by the existing bounded-edit validator.

## CHAT Runtime integration

The existing one-round grounded continuation may return the explicit decision envelope. `ChatSessionManager.requestConversation()` then:

1. accepts the decision only after an approved grounded continuation;
2. binds source request identity to the Runtime-owned original request/session;
3. binds the grounded-context fingerprint to trusted context/tool evidence when available;
4. resolves every cited tool result from Runtime-owned tool envelopes;
5. creates an existing-schema plan proposal only after validation;
6. returns normalized `groundedDecision` and `planProposal` evidence on the existing conversation response.

Plain discussion remains unchanged. A discussion-only or insufficient/unsupported decision returns evidence without creating a plan.

The new module was added to the static service-worker source inventory. No network service is required for validation or proposal creation.

## User-governed boundary

Bridge creation ends at:

```text
status = PROPOSED
approved = false
approvalToken = null
```

It does not:

- call plan approval;
- create or consume an approval token;
- invoke bounded-edit proposal/approval/execution;
- mutate the Document;
- add History entries;
- capture a Revision;
- alter Geometry or Renderer state.

The existing user action remains required to approve and later execute the proposal.

## Source and deterministic QA

Task-specific QA:

`qa/core-integration-004-grounded-plan-bridge.test.mjs`

Coverage includes:

- valid grounded continuation to existing `PROPOSED` creative plan;
- grounded fingerprint and tool-result traceability in bridge metadata;
- deterministic normalization of equivalent evidence;
- stale document, page, Revision and document fingerprint rejection;
- unknown and hidden target rejection;
- ungrounded target rejection;
- unsupported operation rejection;
- discussion-only response creates no plan;
- unresolved evidence remains explicit;
- no Document / History / Revision mutation during proposal creation;
- no approval token or approval-sequence change;
- no bounded-edit execution or Revision capture;
- static source inventory and prohibited network/dynamic-code checks;
- `FORMAT_VERSION = 4`.

Passing QA set:

```text
node qa/core-integration-001-grounded-context.test.mjs
node qa/core-integration-002-grounded-tool-surface.test.mjs
node qa/core-integration-003-bounded-grounded-reasoning.test.mjs
node qa/core-integration-004-grounded-plan-bridge.test.mjs
node --test \
  qa/core/tests/unit/chat-multi-step-creative-plan-v0.1.test.mjs \
  qa/core/tests/unit/chat-multi-step-creative-plan-source-v0.1.test.mjs \
  qa/core/tests/unit/chat-bounded-edit-core-v0.1.test.mjs \
  qa/core/tests/unit/chat-bounded-edit-source-v0.1.test.mjs
```

Result:

```text
Integration-001 = PASS
Integration-002 = PASS
Integration-003 = PASS
Integration-004 = PASS
existing creative-plan / bounded-edit unit + source checks = 21 / 21 PASS
FORMAT_VERSION = 4
```

## Runtime disposition

No Windows/Chrome Runtime claim is made by DEV.

Per the Work Order:

```text
RUNTIME_DEBT = ACCUMULATE
CENTRAL_BATCH_TARGET = 3
RUNTIME_QA = DEFERRED_TO_CENTRAL_RUNTIME_QUEUE
```

## DEV conclusion

```text
GATE = INK_CORE_INTEGRATION_004_SOURCE_READY
AUTO_APPROVAL = 0
AUTO_EXECUTION = 0
UI_LAYOUT_MUTATION = 0
DOCUMENT_SCHEMA_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
REVISION_SEMANTICS_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
RENDERER_MUTATION = 0
CHAT_EXECUTION_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_CENTRAL_RUNTIME_QUEUE
NEXT_ACTION = MR_REVIEW_REQUIRED
```
