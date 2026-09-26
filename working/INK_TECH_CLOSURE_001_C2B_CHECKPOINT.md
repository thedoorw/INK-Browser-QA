# INK-TECH-CLOSURE-001 — C2-B Checkpoint

STATUS: `C2B_SOURCE_FOCUSED_PASS / DEV_HANDOFF / STOP`

BASE_REVIEWED_HEAD: `f3e75f7574d8705d58e654977e8af0e07b74e8d4`

PRODUCT_COMMITS:

```text
a630b6f25ac045c061b424c10e778bd883f0ca0e
  closure: expose C2-B repeat and layout native authorities

7ab8259754ef293d13830df64f742ac4b4d61f05
  closure: register C2-B repeat and layout capabilities
```

QA_COMMITS:

```text
3d8132fb1ed366e31aa217b5104080f11caedd0f
  qa: add C2-B final-batch browser proof

5ff0ccc9de501929f9e7aec630fbb4001812374e
  qa: add C2-B focused repeat/layout contract test
```

## WHY

Close the accepted Repeat / Parametric + FrameLayout / LayoutItem CHAT exposure debt only where current INK already has a complete mutation authority.

During native-authority preflight, `vector-core.js:expandRepeat` was confirmed to generate an expanded Group value, but current product source contains no authoritative command defining how that generated group is committed back to the Document.

The authorized C2-B workpack explicitly prohibited inventing replace-vs-adjacent commit semantics.

MR disposition:

```text
repeat.expand.v1
= CORE_ONLY_ACCEPTED
= NOT EXPOSED
reason = generation authority exists, commit authority does not
```

This is a closure decision, not forgotten work.

## NATIVE_AUTHORITY

Implemented exposure:

```text
repeat.mirror.v1
  → vector-core.js:createRepeat
  → mode = mirror
  → existing repeatTransforms / refreshRepeatInstances
  → existing History structural insertion

repeat.grid.v1
  → vector-core.js:createRepeat
  → mode = grid
  → existing repeatTransforms / refreshRepeatInstances
  → existing History structural insertion

layout.frame.set.v1
layout.frame.remove.v1
  → document/layout.js:setFrameLayout
  → native History-backed transact

layout.item.set.v1
layout.item.remove.v1
  → document/layout.js:setChildLayoutItem
  → native History-backed transact
```

No second Repeat or Layout engine was created.

## WHAT_CHANGED

Product:

```text
product/source/src/editor/chat-bounded-edit.js
product/source/src/agent/capability-registry.js
```

QA:

```text
qa/ink-tech-closure-001-c2b.test.mjs
qa/runtime/ink-cloud-018-browser-harness.html
```

New bounded `use_ink` operations:

```text
repeat.mirror.v1
repeat.grid.v1
layout.frame.set.v1
layout.frame.remove.v1
layout.item.set.v1
layout.item.remove.v1
```

Vocabulary:

```text
C2-A accepted prefix = 21
C2-B additions = 6
TOTAL = 27
```

## WHAT_DID_NOT_CHANGE

Byte-identical to C2-A reviewed HEAD:

```text
product/source/src/document/layout.js
product/source/src/vector/vector-core.js
product/source/src/history/history.js
qa/runtime/run-ink-runtime-batch.mjs
```

Also unchanged:

```text
Document schema / migration
Revision semantics
Renderer / Canvas / WebGL
UI product source
service worker / cache
FORMAT_VERSION = 4
product version
C2-C
Connector-005
main product promotion
```

## FOCUSED_QA

Deterministic GitHub-SSOT source gate:

```text
15 / 15 PASS
```

Verified:

1. bounded operation total = 27;
2. exact six-operation C2-B suffix;
3. `repeat.expand.v1` is not exposed;
4. all six capability schemas are discoverable;
5. Layout setters are imported from the existing native authority;
6. layout mutation routes call the native setters;
7. Repeat mirror/grid routes use existing `createRepeat`;
8. `layout.js` blob unchanged;
9. `vector-core.js` blob unchanged;
10. History core blob unchanged;
11. central Runtime runner unchanged;
12. FORMAT_VERSION = 4;
13. final-batch browser marker authored;
14. browser evidence explicitly records Repeat Expand CORE_ONLY disposition;
15. no eval / Function / network execution path introduced by C2-B exposure source.

Executable focused test:

`qa/ink-tech-closure-001-c2b.test.mjs`

Status:

`AUTHORED / NOT_EXECUTED_IN_THIS_DEV_TOOL_ENVIRONMENT`

Browser proof:

`AUTHORED / NOT_EXECUTED`

Full Windows Runtime:

`NOT_RUN / DEFERRED_TO_FINAL_CLOSURE_BATCH`

No unexecuted test is claimed as PASS.

## RESULT

```text
RESULT = C2B_SOURCE_FOCUSED_PASS
HIGH_RISK_RUNTIME_EXCEPTION = NOT_TRIGGERED
RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH
REPEAT_EXPAND = CORE_ONLY_ACCEPTED / NOT_EXPOSED
```

## REMAINS

```text
C2-B executable/browser Runtime acceptance
C2-C
final concentrated Closure Runtime
promotion
CURRENT_CAPABILITY_BASELINE freeze
```

## NEXT

```text
NEXT = MR_SOURCE_REVIEW
DEV_HANDOFF → STOP
```
