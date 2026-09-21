# INK CHAT Multi-Step Creative Collaboration Report v0.1

Task: `INK-CLOUD-015`  
Branch: `work/ink-cloud-015`  
Base main: `425c58c400bd08610574c0d5e8085e1cb55ec1f5`  
Gate: `CHAT_MULTI_STEP_CREATIVE_LOOP_WORKS`

## 1. Result

INK now supports one reviewable multi-step CHAT creative plan on top of the accepted browser-local collaboration chain.

Implemented path:

```text
INK structured state
→ CHAT / external adapter proposes ordered plan data
→ deterministic local validation
→ user reviews intent + ordered operations + targets
→ explicit local plan approval
→ ordered execution through existing CHAT bounded-edit authority
→ immediate per-step revalidation
→ deterministic STOP on stale/failed step
→ existing History records successful operations
→ accepted Revision authority captures resulting state
→ before/after Revision relation is exposed
```

The plan is orchestration data. It is not a second document model, editor, History engine, Revision engine or mutation authority.

Remote AI remains optional. Validation, approval state, execution and result semantics work browser-locally with static hosting.

## 2. Creative plan contract

Added:

```text
INK-CHAT-CREATIVE-PLAN / version 1
INK-CHAT-CREATIVE-PLAN-VALIDATION / version 1
INK-CHAT-CREATIVE-PLAN-RESULT / version 1
```

A plan preserves:

- stable `planId`;
- source document ID;
- source page ID;
- source Revision ID;
- source document fingerprint;
- bounded user-intent summary;
- ordered `steps[]`;
- stable `stepId`;
- operation;
- stable target references;
- bounded arguments;
- optional dependency references;
- plan status;
- deterministic diagnostics/results.

Plans contain at least two and at most 32 steps in v0.1.

Every step is normalized through the existing `INK-CHAT-EDIT-TASK v1` operation contract. No arbitrary script/eval operation was added.

## 3. Dependency and order semantics

Dependency references must:

- point to an existing step ID;
- be unique within the step;
- point only to an earlier step in the declared order.

Because dependencies may only point backward, cycles and forward-order ambiguity are rejected deterministically.

The declared `steps[]` array remains the execution order.

## 4. Validation and preconditions

Before proposal/approval eligibility, local validation checks:

- plan schema/version;
- step count and stable IDs;
- supported bounded-edit operation;
- target reference structure;
- target existence/type;
- source document/page identity;
- source Revision identity;
- source document fingerprint;
- dependency validity/order;
- effective locked/hidden/unexposed guards through the accepted bounded-edit validator;
- existing operation-specific guards;
- valid, idle History authority.

Validation is mutation-neutral.

At execution, every step is revalidated immediately before it is executed.

A second document-fingerprint chain is not created. The plan records the actual authoritative document fingerprint after every successful bounded operation and requires that exact state before the next step. This allows declared sequential edits while rejecting unaccounted state drift.

## 5. Approval boundary

Plan lifecycle:

```text
PROPOSED
→ APPROVED
→ EXECUTING
→ COMPLETED | STOPPED | REJECTED
```

Execution requires a browser-local plan approval token:

`INK-LOCAL-PLAN-APPROVAL:<planId>:<sequence>`

The plan cannot execute before this explicit user approval boundary.

After plan approval, the orchestrator creates the already-required technical child proposal/approval token for each accepted `ChatBoundedEditController` operation immediately before execution. This does not create an autonomous human-approval path: the child operation is one of the exact ordered operations the user approved in the reviewed plan, and no child operation is eligible until the plan-level approval token has been validated.

There is no autonomous plan approval and no free-running recursive planner.

## 6. Ordered local execution

`ChatCreativePlanController` delegates every step through the accepted `ChatBoundedEditController`.

Therefore the existing edit authorities remain unchanged:

- repaint/material → existing repaint/material controller;
- translate → existing transform/composition route;
- simplify/refine → existing Path-edit controller;
- mutations → existing `HistoryManager`.

No alternate execution engine was added.

Successful steps are recorded individually with:

- step ID/index;
- operation;
- bounded proposal ID;
- changed state;
- target result;
- History metadata;
- Revision/document-fingerprint metadata returned by the bounded operation.

## 7. Deterministic STOP behavior

On the first stale/failed step, execution stops.

Covered stop conditions include:

- stale source Revision;
- stale/missing target;
- invalid target precondition;
- unexpected document-fingerprint drift;
- busy/invalid History authority;
- failed bounded operation;
- unmet dependency.

A `STOPPED` plan result records:

- all successfully completed steps;
- the stopped step ID/index;
- diagnostic code;
- remaining step IDs;
- resulting Revision relation where applicable.

Remaining steps are never silently retargeted, skipped or executed.

An exact-source isolated harness initially exposed that execution-time stale state was being rejected before a `STOPPED` plan record could be formed. This was corrected by retaining full validation at approval time while routing execution-time state checks through immediate per-step revalidation. The corrected harness then passed.

## 8. Revision-aware result and continuation

Plan execution binds to the source Revision recorded at proposal time.

On `COMPLETED`:

- the accepted `RevisionController.capture()` creates or references the ending Revision;
- the result exposes starting and ending Revision IDs;
- accepted Revision comparison metadata is retained;
- the resulting Revision can be used explicitly as the source for a later plan.

On a mid-plan `STOPPED` state after successful edits:

- the partial resulting state is captured through the accepted Revision authority when the source Revision is still current;
- if the Revision identity changed externally, capture is skipped rather than silently rebased.

No second diff or Revision engine was introduced.

## 9. Creative Workspace integration

The existing CHAT pane now minimally exposes:

- intent summary;
- ordered plan-step builder;
- operation per step;
- concrete target object IDs;
- dependency-derived order;
- validation/execution state;
- Propose plan;
- Approve plan;
- Reject plan;
- Execute plan;
- stopped-step diagnostic;
- resulting Revision relation.

The existing single bounded-edit UI remains available.

This is a bounded extension of the minimum Creative Workspace, not a broad UI redesign.

Runtime installation order is:

```text
Revision
→ CHAT bounded edit
→ CHAT creative plan
→ Creative Workspace
```

The new module is included in the existing service-worker static shell.

## 10. Optional AI / external plan adapter

The browser-local `chatCreativePlanAdapter` accepts structured plan data from a future external or AI proposer.

That adapter may propose intent and ordered steps, but it cannot:

- bypass plan validation;
- approve the plan for the user;
- execute without the local approval token;
- create arbitrary script operations;
- replace the authoritative structured document;
- require a backend for core execution.

Thus:

```text
AI / CHAT proposal
≠
direct document mutation
```

## 11. Product/source changes

Product source:

- `product/source/src/editor/chat-creative-plan.js` — plan schema, validation, approval, orchestration, results and adapter;
- `product/source/src/editor/creative-workspace.js` — minimal plan review/action UX;
- `product/source/src/editor/index.js` — shared export;
- `product/source/src/ink.js` — runtime installation;
- `product/source/service-worker.js` — static shell cache entry.

QA:

- `qa/core/tests/unit/chat-multi-step-creative-plan-v0.1.test.mjs`;
- `qa/core/tests/unit/chat-multi-step-creative-plan-source-v0.1.test.mjs`;
- `qa/core/tests/unit/chat-multi-step-creative-workspace-v0.1.test.mjs`;
- `qa/core/evidence/INK_CLOUD_015_STATIC_CHECKS.txt`.

No package path, migration, document-model format, History engine or Revision engine source was changed.

## 12. QA actually executed

Exact committed branch source was exercised through connector-side isolated/static harnesses.

Executed:

- exact-source creative-plan orchestration harness: `14 / 14 PASS`;
- exact-source Creative Workspace action harness: `7 / 7 PASS`;
- exact-source syntax/architecture checks: `21 / 21 PASS`;
- authorized-base branch scope comparison.

The exact-source plan harness covers:

- deterministic plan data;
- zero-mutation validation;
- execute-before-approval rejection;
- ordered two-step execution;
- existing History reuse;
- Revision before/after;
- stale Revision STOP;
- stale target STOP;
- no retarget/skip;
- mid-plan failure;
- retained successful step;
- untouched later step;
- partial Revision capture.

The Workspace harness covers:

- two-step building;
- dependency wiring;
- propose without approval;
- explicit approval token;
- approved execute;
- token consumption;
- resulting Revision relation.

Reproducible Node test files additionally include explicit plan/result JSON round-trip assertions and invalid/busy History cases.

Authoritative evidence:

`qa/core/evidence/INK_CLOUD_015_STATIC_CHECKS.txt`

## 13. QA not executed

Not claimed:

- full repository Node test runner;
- real browser interaction/runtime validation;
- service-worker browser lifecycle validation;
- GitHub Actions;
- package regeneration/build;
- main merge;
- release/certification.

Direct local checkout was unavailable because the execution environment could not resolve `github.com`.

Per Work Order:

`RUNTIME_QA = DEFERRED`

## 14. Acceptance gate

```text
MULTI_STEP_PLAN_SCHEMA = IMPLEMENTED
PLAN_VALIDATION = IMPLEMENTED
EXPLICIT_APPROVAL = PRESERVED
ORDERED_BOUNDED_EXECUTION = IMPLEMENTED
STEP_REVALIDATION = IMPLEMENTED
STOP_ON_FAILURE = IMPLEMENTED
STALE_REVISION_REJECTION = IMPLEMENTED
STALE_TARGET_REJECTION = IMPLEMENTED
PLAN_RESULT_RECORD = IMPLEMENTED
REVISION_BINDING = IMPLEMENTED
WORKSPACE_PLAN_UI = CONNECTED
EXISTING_CONTROLLERS = REUSED
HISTORY_AUTHORITY = PRESERVED
STRUCTURED_DOCUMENT = PRESERVED
STATIC_BROWSER_LOCAL_CORE = PRESERVED
REMOTE_SERVICE_REQUIRED = 0
AUTONOMOUS_APPROVAL = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Gate candidate:

`CHAT_MULTI_STEP_CREATIVE_LOOP_WORKS`

No Hard STOP condition was triggered.

## 15. DEV handoff

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-015
BRANCH = work/ink-cloud-015
GATE = CHAT_MULTI_STEP_CREATIVE_LOOP_WORKS
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
