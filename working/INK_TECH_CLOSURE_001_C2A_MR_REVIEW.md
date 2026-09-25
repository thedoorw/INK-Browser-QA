# INK-TECH-CLOSURE-001 — C2-A MR Source Review

STATUS: `MR_SOURCE_PASS / RUNTIME_DEFERRED_TO_FINAL_CLOSURE_BATCH`

REVIEWED_EXACT_HEAD: `f3e75f7574d8705d58e654977e8af0e07b74e8d4`

PRODUCT_CHECKPOINT: `6d19efac3e0e87bcc97044121eb41d2c7cef6184`

C1_REVIEWED_HEAD: `6a9fb25558cda958b90140867ac054f3662dfa01`

## Decision

```text
C2A_SOURCE_FOCUSED_PASS = ACCEPTED
HIGH_RISK_RUNTIME_EXCEPTION = NOT_TRIGGERED
FULL_WINDOWS_RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH
C2-B = RELEASED
```

## Scope review

C1 reviewed HEAD → C2-A reviewed HEAD product changes are limited to:

```text
product/source/src/editor/chat-bounded-edit.js
product/source/src/agent/capability-registry.js
product/source/src/agent/public-creative-api.js
product/source/src/editor/text-object.js
product/source/src/agent/export-asset.js
product/source/src/ink.js
```

QA/evidence changes are limited to the authorized C2-A focused tests, browser proof, checkpoint/workpack and DEV progress.

No C2-B/C2-C product implementation is present.

Unchanged/frozen authorities include:

```text
Document schema / migration
History core semantics
Revision core semantics
Renderer / Canvas / WebGL
editor/transform.js
document/hierarchy.js
vector/vector-core.js
output-handle-registry lifecycle
service worker / cache
central Runtime runner
FORMAT_VERSION = 4
```

## Accepted C2-A surface

Bounded `use_ink` additions:

```text
frame.create.v1
text.create.v1
text.edit.v1
svg.import.v1
object.resize.v1
object.scale.v1
object.order.v1
```

Direct named tool:

`export_ink_asset`

Accepted bounded vocabulary:

```text
C1 = 14
C2-A additions = 7
TOTAL use_ink operations = 21
named tools = 21
```

## Native-authority review

Accepted routes:

```text
Frame
→ document/hierarchy.js:createFrame

Text
→ shared editor/text-object.js helper
→ UI commitTextEditor and CHAT use the same Text object semantics

SVG
→ vector/vector-core.js:importSVGDocument

Resize
→ resizeFrameGeometry for Frame
→ existing renderer bounds + Matrix/applyWorldTransformBatch for other objects

Scale
→ Matrix + applyWorldTransformBatch

Order
→ existing structural parent-array front/back semantics

Asset export
→ app.exportPNG / app.exportSVG / app.exportPDF
→ existing INK output registry
→ inspect/release lifecycle
```

No second Text, SVG, transform, hierarchy, export or output-registry authority was introduced.

## Specific risk review

### Text authority factoring

PASS.

The previous UI inline Text object construction/edit path now delegates to:

```text
createTextObject
updateTextObject
```

The same helpers are used by CHAT C2-A Text operations. UI History ownership remains in the existing UI path; CHAT History ownership remains in the bounded edit controller.

### Asset export neutrality

SOURCE PASS.

The new facade calls only existing export authorities and records an ephemeral `INK_OUTPUT_HANDLE / 1`.

It fingerprints identity before/after export and rejects a changed Document/Revision identity.

No browser-anchor download, external upload, new renderer or alternate serializer is added.

Final browser proof remains required before promotion.

### SVG safety boundary

SOURCE PASS.

C2-A accepts bounded raw local SVG only and rejects script/foreignObject/iframe/object/embed, event-handler attributes, remote/javascript href patterns, remote/javascript CSS url() and @import before the native parser is called.

No URL fetch/network path was added.

## QA classification

DEV recorded deterministic source/contract evidence:

`25 / 25 PASS`

MR source review confirms the required operation vocabulary, native routes, scope boundaries and final-batch browser evidence are present.

Important distinction:

```text
SOURCE/STATIC CONTRACT REVIEW = PASS
EXECUTABLE NODE FOCUSED TEST = AUTHORED / NOT EXECUTED
BROWSER PROOF = AUTHORED / NOT EXECUTED
FULL WINDOWS RUNTIME = NOT RUN
```

The unexecuted Node test is not relabeled as PASS.

Under the user-approved install-first policy this does not require an intermediate full Runtime because no high-risk exception was triggered.

## Remaining C2-A debt

Only:

```text
executable/final Runtime acceptance
promotion to main
post-promotion equivalence
```

These remain open until the final Closure batch.

## Next

```text
C2-A source integration = ACCEPTED
C2-B = RELEASED
Runtime = DEFERRED
No partial promotion
```
