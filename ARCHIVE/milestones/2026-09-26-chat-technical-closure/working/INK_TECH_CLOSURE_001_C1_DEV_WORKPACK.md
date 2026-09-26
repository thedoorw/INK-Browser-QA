# INK-TECH-CLOSURE-001 — C1 DEV Workpack

STATUS: `DEV_AUTHORIZED / START`

BRANCH: `work/ink-tech-closure-001`

UPSTREAM_MAIN_AT_DISPATCH: `53ec8886dcc9a1bb532f52c7980e46bf72982405`

AUTHORITATIVE_PLAN:
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `working/INK_TECH_CLOSURE_001_EXECUTION_PLAN.md`
- `working/INK_TECH_CLOSURE_001_CAPABILITY_LEDGER.md`

## Mission

Close the already-implemented but unpromoted Geometry Ops integration debt by replaying/reconciling the accepted C1 implementation onto the current closure branch.

This is not new feature development.

Source implementation branch:

`work/ink-chat-geometry-ops-001`

Reference implementation HEAD:

`51dcc27570440e5a4a779e7ffed64dd634995489`

Accepted old base:

`d6c28be13cddee0d83b9e7613b5498b06d1f7b0e`

MR preflight finding:

The C1 product authority files and related Geometry Ops QA source on current main are unchanged relative to the old accepted base. C1 may therefore replay the bounded implementation without importing stale branch governance/runtime-queue state.

## Required operation vocabulary

Add/recover exactly these eight bounded native operations:

```text
path.create.v1
path.edit.v1
object.rotate.v1
object.clone.v1
repeat.radial.v1
boolean.apply.v1
group.create.v1
object.reparent.v1
```

Together with the six already on main, expected bounded `use_ink` vocabulary after C1 source replay:

```text
14 operations total
```

Do not add a 15th operation in C1.

## Native-authority rule

Every operation must route through existing INK authority only.

Expected authority mapping:

```text
path.create.v1      → vector-core createPath / createAnchor
path.edit.v1        → PathEditController
object.rotate.v1    → Matrix.around / applyWorldTransformBatch
object.clone.v1     → cloneCompositionObject
repeat.radial.v1    → createRepeat
boolean.apply.v1    → booleanPaths / dividePaths
group.create.v1     → createVectorGroup
object.reparent.v1  → reparentPageObject
```

Preserve:

```text
proposal → explicit approval → execute
History authority
Revision / provenance compatibility
stable object refs
FORMAT_VERSION = 4
```

## Authorized product files

Only these product files are authorized for C1:

```text
product/source/src/editor/chat-bounded-edit.js
product/source/src/agent/capability-registry.js
```

Expected implementation action:

- replay/reconcile the old accepted Geometry Ops implementation into the current branch;
- preserve current-main content outside the bounded C1 delta;
- if an exact replay is no longer source-compatible, STOP and record the incompatibility instead of redesigning the operation.

## Authorized QA files

```text
qa/ink-chat-connector-004-use-ink-programmable-bridge.test.mjs
qa/ink-chat-geometry-ops-001.test.mjs
qa/runtime/ink-cloud-018-browser-harness.html
```

QA may be reconciled only as required by current-main harness state.

Do not modify:

`qa/runtime/run-ink-runtime-batch.mjs`

unless MR separately authorizes a QA-orchestration correction.

## Authorized evidence files

DEV may update/create:

```text
ACTIVE/INK_DEV_PROGRESS.md
working/INK_TECH_CLOSURE_001_C1_CHECKPOINT.md
research/INK_CHAT_GEOMETRY_OPS_001_REPORT_v0.1.md
working/INK_CHAT_GEOMETRY_OPS_001_DEV_HANDOFF.md
```

The old report/handoff may be retained as historical implementation evidence, but the new C1 checkpoint must state the current closure branch exact evidence.

## Explicitly forbidden replay

Do not copy from the old Geometry Ops branch:

```text
ACTIVE/INK_CURRENT_WORK_ORDER.md
ACTIVE/INK_DEV_PROGRESS.md
ACTIVE/INK_RUNTIME_QUEUE.json
working/WORKING_STATUS.md
```

Current closure governance is authoritative.

## Hard prohibitions

C1 must not introduce:

```text
new geometry engine
new Document authority
new History authority
new Revision authority
direct Document JSON writes
arbitrary JS / eval / Function execution
external transport
IMAGE
UI redesign
Renderer / Canvas / WebGL change
persistence change
service-worker change
FORMAT_VERSION change
product-version change
package promotion
main merge
Connector-005 work
C2-A / C2-B / C2-C work
```

## Focused QA required before handoff

At minimum verify:

1. modified JS parses/imports;
2. accepted bounded operation vocabulary is exactly 14;
3. all eight C1 descriptors are discoverable;
4. all eight route to existing native authorities;
5. proposal is non-mutating before approval;
6. execute-before-approval is blocked;
7. approved execution uses History;
8. stable refs / fresh clone IDs behave as specified;
9. radial center world→parent conversion remains correct;
10. Boolean same-parent/same-layer guard remains enforced;
11. group/reparent hierarchy cycle/cross-layer guards remain enforced;
12. no forbidden arbitrary execution primitive is introduced;
13. FORMAT_VERSION remains 4;
14. old six `use_ink` operations remain available;
15. current smart-loop/connector source contracts are not weakened.

Use repository-native deterministic/unit/static QA where available.

## Runtime policy

```text
FULL_WINDOWS_RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH
```

Do not run or request the full Runtime merely because C1 source work is complete.

Immediate Runtime is allowed only if the high-risk exception in:

`working/INK_TECH_CLOSURE_001_EXECUTION_PLAN.md`

is triggered.

If a high-risk exception is triggered:

```text
STOP
→ document exact reason
→ MR decides Runtime
```

## Required checkpoint record

Create/update:

`working/INK_TECH_CLOSURE_001_C1_CHECKPOINT.md`

It must contain exactly these causal sections:

```text
WHY
NATIVE_AUTHORITY
WHAT_CHANGED
WHAT_DID_NOT_CHANGE
FOCUSED_QA
RESULT
REMAINS
NEXT
```

Required successful state:

```text
RESULT = C1_SOURCE_FOCUSED_PASS
RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH
NEXT = MR_SOURCE_REVIEW
```

## Handoff

After focused QA:

```text
DEV_HANDOFF
→ record exact branch HEAD
→ STOP
```

DEV must not autonomously start C2-A.

MR will review the exact C1 checkpoint and then explicitly release C2-A on the same branch.
