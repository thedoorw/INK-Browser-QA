# INK-TECH-CLOSURE-001 — C2-B DEV Workpack

STATUS: `DEV_AUTHORIZED / START`

BRANCH: `work/ink-tech-closure-001`

C2A_REVIEW: `MR_SOURCE_PASS`

C2A_REVIEWED_HEAD: `f3e75f7574d8705d58e654977e8af0e07b74e8d4`

RUNTIME_POLICY: `DEFERRED_TO_FINAL_CLOSURE_BATCH`

## Mission

Close the accepted Repeat / Parametric + FrameLayout / LayoutItem CHAT exposure debt using existing INK native authorities only.

This is connector exposure over existing deterministic Repeat/Layout systems. It is not a new layout engine, Grid Layout engine, constraint solver or recompute system.

## C2-B target families

```text
Repeat mirror
Repeat grid
Repeat expand
FrameLayout set/remove
LayoutItem fixed/fill/hug/constraints set/remove
```

Radial Repeat is already present from C1 and must remain unchanged.

## Target bounded use_ink surface

Add exactly:

```text
repeat.mirror.v1
repeat.grid.v1
repeat.expand.v1
layout.frame.set.v1
layout.frame.remove.v1
layout.item.set.v1
layout.item.remove.v1
```

Expected vocabulary:

```text
C2-A accepted total = 21
C2-B additions = 7
expected total = 28
```

No additional operation family is authorized.

## Native authorities

### repeat.mirror.v1

Reuse:

```text
vector-core.js:createRepeat
mode = mirror
repeatTransforms / refreshRepeatInstances
```

One source target only.

Bounded arguments:

```text
axis = x | y
center = explicit world point or deterministic source center
linked = current accepted boolean
```

World→local center conversion must follow the same hierarchy-safe pattern already accepted for `repeat.radial.v1`.

Create a native Repeat adjacent to the source under existing History. Do not replace/delete the source.

### repeat.grid.v1

Reuse:

```text
createRepeat
mode = grid
repeatTransforms
refreshRepeatInstances
```

One source target only.

Bounded arguments should map only to existing native fields:

```text
columns
rows
dx
dy
linked
```

Hard bounds are required for row/column count and spacing.

Do not implement Frame/Grid Layout. This operation is only the existing procedural Repeat grid.

### repeat.expand.v1

Reuse:

`vector-core.js:expandRepeat`

Target must be one existing native Repeat.

Required behavior:

```text
Repeat
→ native expanded Group
→ replace or insert through an explicit bounded History transaction
→ stable fresh editable child identities as produced by existing authority
```

Do not create a second expansion algorithm.

DEV must inspect current editor semantics before choosing replace-vs-adjacent behavior. If no authoritative product behavior exists for committing expand, STOP for MR instead of inventing semantics.

### layout.frame.set.v1

Reuse:

`document/layout.js:setFrameLayout`

Target = one native Frame.

Only existing `INK-LAYOUT-1` fields are allowed:

```text
mode:
  manual
  horizontal
  vertical

gap >= 0

padding:
  top
  right
  bottom
  left

align.main:
  start
  center
  end
  space-between

align.cross:
  start
  center
  end
  stretch

sizing.horizontal:
  fixed
  hug

sizing.vertical:
  fixed
  hug
```

Do not add grid tracks, wrapping, min/max sizing, percentages or a general constraint solver.

### layout.frame.remove.v1

Reuse:

`setFrameLayout(app, frameId, null)`

Target = one native Frame.

No secondary cleanup/migration behavior beyond existing authority.

### layout.item.set.v1

Reuse:

`document/layout.js:setChildLayoutItem`

Target = one object whose structural parent is a Frame.

Only existing `INK-LAYOUT-ITEM-1` fields:

```text
participation:
  flow
  absolute

sizing.horizontal / vertical:
  fixed
  fill
  hug

fixedSize:
  width
  height

constraints.horizontal / vertical:
  start
  end
  center
  scale
  stretch
```

Do not invent new constraint semantics.

### layout.item.remove.v1

Reuse:

`setChildLayoutItem(app, objectId, null)`

Target = one current Frame child.

## Evaluation boundary

Existing:

```text
evaluateFrameLayout
evaluateResizeConstraints
```

are deterministic planning/evaluation authorities.

C2-B does not automatically authorize a new geometry-application engine for layout plans.

If existing product/editor code already has one accepted commit path for applying evaluated layout geometry, reuse it only if directly proven.

Otherwise C2-B v1 is limited to exposing the existing authoritative layout metadata mutation contract.

Do not silently convert metadata exposure into a new auto-layout execution engine.

## History / approval

All C2-B Document mutations must preserve:

```text
proposal
→ explicit approval
→ execute
→ existing native History authority
→ current Chat Creative Plan Revision compatibility
```

Do not wrap native functions that already transact in a second nested History transaction.

This is especially important for:

```text
setFrameLayout
setChildLayoutItem
```

which already own History-backed transactions.

## Authorized product files

Primary:

```text
product/source/src/editor/chat-bounded-edit.js
product/source/src/agent/capability-registry.js
```

Conditionally authorized only if required for existing exports/imports:

```text
product/source/src/editor/index.js
product/source/src/document/index.js
product/source/src/vector/index.js
```

Existing native authority files are inspection/frozen by default:

```text
product/source/src/document/layout.js
product/source/src/vector/vector-core.js
```

If modifying either native authority becomes necessary, STOP for MR before mutation.

No UI product file is authorized.

## QA authorization

DEV may add/update bounded QA under:

```text
qa/
qa/runtime/ink-cloud-018-browser-harness.html
```

Do not modify:

`qa/runtime/run-ink-runtime-batch.mjs`

without a separate MR decision.

## Hard prohibitions

```text
new Repeat engine = 0
new Layout engine = 0
Grid Layout engine = 0
general constraint solver = 0
new recompute system = 0
Document schema change = 0
migration change = 0
History semantic change = 0
Revision semantic change = 0
Renderer / Canvas / WebGL change = 0
UI mutation = 0
service worker / cache = 0
external transport = 0
IMAGE = 0
FORMAT_VERSION change = 0
product version change = 0
C2-C work = 0
Connector-005 work = 0
main product promotion = 0
```

## Focused QA gate

At minimum verify:

1. C2-A exact 21-operation prefix remains unchanged.
2. Exactly seven C2-B operations are appended.
3. Total bounded `use_ink` vocabulary = 28.
4. Capability registry exposes all seven schemas.
5. Mirror Repeat uses existing createRepeat/mirror semantics.
6. Grid Repeat uses existing createRepeat/grid semantics.
7. Repeat grid is not confused with Frame/Grid Layout.
8. Repeat expand uses existing expandRepeat only.
9. Expand preserves source/expanded identity/provenance evidence appropriate to current Repeat contract.
10. Frame layout target must be a native Frame.
11. Frame set/remove route to setFrameLayout.
12. Layout item target must be a current Frame child.
13. Item set/remove route to setChildLayoutItem.
14. Only current `INK-LAYOUT-1` / `INK-LAYOUT-ITEM-1` enums are accepted.
15. Layout metadata mutations do not bypass native History.
16. No nested History transaction is introduced around setFrameLayout/setChildLayoutItem.
17. proposal/approval/execute remains mandatory.
18. C1 radial Repeat remains unchanged.
19. C2-A operations and export tool remain unchanged.
20. no eval / Function / arbitrary JS / direct Document JSON replacement.
21. FORMAT_VERSION remains 4.
22. central Runtime runner remains unchanged.
23. final-batch browser proof includes the seven C2-B operations.
24. source does not falsely claim Windows Runtime PASS.

Executable focused QA should be authored. If the current DEV environment cannot execute it, record that explicitly rather than claiming PASS.

## Runtime policy

```text
FULL_WINDOWS_RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH
```

If any high-risk exception from the execution plan is triggered, STOP and report instead of running or expanding scope independently.

## Required checkpoint

Create:

`working/INK_TECH_CLOSURE_001_C2B_CHECKPOINT.md`

Required sections:

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

Successful result:

```text
RESULT = C2B_SOURCE_FOCUSED_PASS
RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH
NEXT = MR_SOURCE_REVIEW
DEV_HANDOFF → STOP
```

Do not start C2-C without MR release.
