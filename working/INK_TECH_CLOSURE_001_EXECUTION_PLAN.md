# INK Technical Closure 001 — Install-First Execution Plan

STATUS: `USER_APPROVED_PLAN / IMPLEMENTATION_NOT_STARTED`

DATE: 2026-09-25

BRANCH:

`work/ink-tech-closure-001`

## 1. User operational requirement

The closure must minimize repeated Windows Runtime transport and repeated manual evidence movement.

Therefore:

```text
INSTALL / INTEGRATE ON ONE CLOSURE BRANCH FIRST
→ source/static/unit/focused QA at every checkpoint
→ one concentrated exact-SHA Runtime near the end
→ one promotion after Runtime PASS
```

This is a batching policy, not a reduction of QA.

No unverified closure work is promoted to `main` before the final Runtime gate.

## 2. Why this plan exists

Previous work repeatedly consumed review context because:

```text
small change
→ Runtime
→ unrelated harness/transport/old assertion failure
→ manual evidence movement
→ correction
→ Runtime again
→ MR context exhaustion
→ later reviewer loses causal chain
```

Closure 001 must preserve the causal chain in GitHub rather than depending on one CHAT window.

## 3. Checkpoint evidence contract

Every closure checkpoint must record:

```text
WHY
  original promise / capability target being closed

NATIVE_AUTHORITY
  exact existing INK controller/module/command reused

WHAT_CHANGED
  exact files and operation families exposed

WHAT_DID_NOT_CHANGE
  frozen authorities and prohibited expansion

FOCUSED_QA
  syntax/static/unit/deterministic/schema checks

RESULT
  PASS / REVISE / HOLD

REMAINS
  unresolved dependencies after this checkpoint

NEXT
  exact next checkpoint
```

Each checkpoint receives its own commit boundary.

The branch commit history + closure ledger must be sufficient to recover the entire causal chain without prior CHAT context.

## 4. Runtime policy

### Default

Do not run full Windows Runtime after C1, C2-A, C2-B, or C2-C individually.

Instead:

```text
C1 focused PASS
→ C2-A focused PASS
→ C2-B focused PASS
→ C2-C focused PASS
→ FINAL exact-SHA Runtime
```

### Immediate Runtime exception

Stop batching and run Runtime immediately only if a checkpoint changes or creates material risk to:

- Document schema / migration / persistence integrity;
- destructive History / Revision semantics;
- Renderer / Canvas / WebGL behavior;
- service worker / cache delivery correctness;
- browser-only module/dependency compatibility that static QA cannot establish;
- pointer / pen / device behavior that cannot be established without browser interaction;
- a confirmed runtime regression;
- any case where MR cannot establish adequate confidence from source/static evidence.

If none of those conditions is met, Runtime remains deferred to the final batch.

## 5. C1 — Geometry Ops replay / reconcile

Purpose:

Close the already-implemented but unpromoted Geometry Ops debt.

Source implementation:

`work/ink-chat-geometry-ops-001`
reference HEAD:
`51dcc27570440e5a4a779e7ffed64dd634995489`

Operations:

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

Rules:

- replay product implementation onto the current closure branch;
- do not replay stale Work Order, Runtime queue, DEV progress, or old Working Status;
- reconcile QA only where current-main harness evolution requires it;
- no new operation family;
- no UI mutation;
- no second Geometry/Document/History authority.

Checkpoint gate:

`C1_SOURCE_FOCUSED_PASS`

Runtime:

`DEFERRED_TO_FINAL_CLOSURE_BATCH` unless an immediate-runtime exception is triggered.

## 6. C2-A — Basic structure / transform / import-export exposure

Purpose:

Close accepted connector exposure where native INK authority already exists.

Families:

```text
Frame/container
Text
SVG import
Resize
Scale
Z-order / reorder
Asset export
```

Rotate is not duplicated here because C1 already carries `object.rotate.v1`.

Implementation rule:

- expose existing accepted native authority only;
- operation schema must be bounded and capability-discoverable;
- proposal/approval rules remain consistent with current `use_ink`;
- no new Text engine;
- no new SVG parser;
- no new transform engine;
- no new export renderer.

Checkpoint gate:

`C2A_SOURCE_FOCUSED_PASS`

Runtime:

`DEFERRED_TO_FINAL_CLOSURE_BATCH` unless exception triggered.

## 7. C2-B — Parametric / layout exposure

Families:

```text
Repeat mirror
Repeat grid
Repeat expand
FrameLayout set/remove
LayoutItem sizing:
  fixed
  fill
  hug
LayoutItem constraints set/remove
```

Radial Repeat is not duplicated because C1 already carries it.

Rules:

- existing Repeat remains mutation authority;
- `document/layout.js` remains layout authority;
- no Grid Layout engine;
- no general constraint solver;
- no second recompute system.

Checkpoint gate:

`C2B_SOURCE_FOCUSED_PASS`

Runtime:

`DEFERRED_TO_FINAL_CLOSURE_BATCH` unless exception triggered.

## 8. C2-C — Component / Instance exposure

Families:

```text
component register
component create instance
component set accepted override
component reset accepted override
component detach
component duplicate definition
component repair reference
```

Rules:

- existing `document/components.js` remains sole authority;
- current accepted override surface remains bounded;
- no Variant system;
- no nested component expansion beyond current native contract;
- no second component tree/store.

Checkpoint gate:

`C2C_SOURCE_FOCUSED_PASS`

Runtime:

`DEFERRED_TO_FINAL_CLOSURE_BATCH` unless exception triggered.

## 9. Accepted closure without expansion

Creative Memory / Research remains:

```text
CLOSED_AT_ACCEPTED_ADVISORY_SCOPE
READ_ONLY
NO_AUTOMATIC_WRITE
NO_AUTOMATIC_FETCH/SCRAPE
```

No product mutation is required for this item unless source inspection later disproves the currently recorded accepted scope.

## 10. Explicit non-blocking future items

These remain visible but do not block the current capability baseline freeze:

```text
Grid Layout engine                  = DEFERRED
Component Variants                  = DEFERRED
Variables / Tokens                  = DEFERRED
Prototype interactions              = RETIRED_FROM_CURRENT_DRAWING_PLAN
Design → code                       = RETIRED_FROM_CURRENT_DRAWING_PLAN
Code/live UI → design               = OPTIONAL
Creative Library Search/Connector-005 = PLANNED_NOT_IMPLEMENTED / TRACKED
```

Connector-005 may receive its own later Work Order. It is not silently cancelled and is not bundled into Closure 001 implementation.

## 11. Final concentrated Runtime

After C1 + C2-A + C2-B + C2-C focused PASS:

Pin one exact branch HEAD.

Required final Runtime sequence:

```text
materialization
→ current UI regression suite
→ Creative regression suite
→ Geometry suite
→ Closure-specific connector/exposure suite
→ capability-discovery verification
→ History / approval / provenance invariants
→ final evidence bundle
```

The Runtime harness must not stop at a known unrelated timeout before later suites can be classified without explicit evidence. If the current central ordering still prevents Geometry/Closure suites from running, QA orchestration may be corrected as QA-only work without changing product semantics.

Required final classification:

```text
UI
CREATIVE
GEOMETRY
CLOSURE_CONNECTOR
CAPABILITY_DISCOVERY
HISTORY/REVISION/PROVENANCE
```

A single failure must identify:

- first failing checkpoint/assertion;
- whether product, QA contract, infrastructure, or transport;
- which closure commit family can causally affect it.

Do not reopen unrelated prior checkpoints without evidence.

## 12. Promotion

Only after final Runtime PASS:

```text
closure branch exact reviewed HEAD
→ clean promotion to current main
→ post-promotion equivalence check
→ update closure ledger
→ freeze CURRENT_CAPABILITY_BASELINE
```

No partial C1/C2 promotion.

## 13. C3 — Freeze Current Capability Baseline

C3 produces one authoritative file describing:

- all installed CHAT operation families;
- all UI-visible native operations;
- all Core-only capabilities;
- deferred/optional/retired capabilities;
- known future planned work;
- exact promoted main SHA.

Gate:

`CURRENT_CAPABILITY_BASELINE_FROZEN`

Only this frozen baseline is handed to UR for final Photoshop-aligned:

- menu structure;
- toolbar/tool rail;
- contextual options;
- panel allocation;
- History / Navigator placement;
- future-capability reservation.

## 14. Final closure criterion

```text
CLOSURE_001_COMPLETE
=
C1 installed
+ C2-A installed
+ C2-B installed
+ C2-C installed
+ focused QA checkpoints preserved
+ one final exact-SHA Runtime PASS
+ clean promotion
+ current capability baseline frozen
```

No item is allowed to become “complete” solely because code was written.


## 15. Supersession — post-Closure Connector-005 before final UI — 2026-09-26

Sections 10, 12, 13 and 14 remain valid for Closure 001 technical completion except where they previously implied that the Closure-only capability baseline is immediately handed to UR.

The authoritative program order is now:

```text
INK-TECH-CLOSURE-001
→ clean promotion / Closure technical completion
→ Connector-005 Creative Library Search
→ refresh CURRENT_CAPABILITY_BASELINE
→ freeze UI-authoritative baseline
→ Photoshop-aligned final UI rebuild
```

Therefore the Closure C3 output becomes a technical closure checkpoint rather than the final UI-authoritative baseline.

Connector-005 is a separate bounded Work Order, defined by:

`working/INK_CONNECTOR_005_BOUNDED_PLAN.md`

It may search / inspect / reuse existing INK reusable assets, but may not expand into a full Library Manager, cloud library, Variables/Tokens, Styles, Component Variants, or AI auto-classification system.

