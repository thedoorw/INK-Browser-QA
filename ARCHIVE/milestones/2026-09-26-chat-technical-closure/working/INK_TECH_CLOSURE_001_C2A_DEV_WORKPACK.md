# INK-TECH-CLOSURE-001 — C2-A DEV Workpack

STATUS: `DEV_AUTHORIZED / START`

BRANCH: `work/ink-tech-closure-001`

C1_REVIEW: `MR_SOURCE_PASS`

C1_REVIEWED_HEAD: `6a9fb25558cda958b90140867ac054f3662dfa01`

RUNTIME_POLICY: `DEFERRED_TO_FINAL_CLOSURE_BATCH`

## Mission

Close the accepted basic structure / transform / import-export CHAT exposure debt using existing INK native authorities only.

This is connector exposure and authority factoring, not new drawing-engine development.

## C2-A target families

```text
Frame/container
Text
SVG import
Resize
Scale
Z-order / reorder
Asset export
```

## Target public surface

### use_ink bounded operations

Add exactly these C2-A operation names unless current source proves a naming collision:

```text
frame.create.v1
text.create.v1
text.edit.v1
svg.import.v1
object.resize.v1
object.scale.v1
object.order.v1
```

Expected bounded `use_ink` vocabulary after C2-A:

```text
C1 total 14
+ C2-A additions 7
= 21
```

Do not add unrelated operation names.

### Direct named export tool

Add one high-level named connector tool:

`export_ink_asset`

Reason:

Export is an asset-generation/readback action, not a Document mutation. It should follow the existing high-level preview/output-handle pattern rather than pretending to be a geometry edit.

Required route:

```text
export_ink_asset
→ existing INK export authority
→ INK_OUTPUT_HANDLE v1
→ inspect_ink_output / release_ink_output lifecycle
```

Supported v1 formats are limited to existing non-print export authorities:

```text
PNG
SVG
PDF
```

Do not add browser Print to the CHAT export tool.

Do not auto-download through a browser anchor. Return a bounded output handle + metadata.

## Native-authority requirements

### frame.create.v1

Reuse:

`document/hierarchy.js:createFrame`

Create an empty Frame in the active Layer under existing History authority.

Children are added through the already accepted `object.reparent.v1`; do not invent a second hierarchy mutation path.

### text.create.v1 / text.edit.v1

Reuse the existing Text document/render/export semantics already used by the editor.

Current accepted Text fields include the existing subset:

```text
text
matrix / position
opacity
color
fontFamily
fontSize
lineHeight
fontWeight where already supported
```

Do not add rich-text spans, font loading, typography tokens, text-on-path or new text layout.

If current UI Text mutation logic is not available as a callable shared command, DEV may factor the existing mutation semantics into a shared bounded helper and have both UI and CHAT use the same authority.

That factoring must preserve current UI behavior exactly and must not create two Text mutation implementations.

### svg.import.v1

Reuse:

`vector/vector-core.js:importSVGDocument`

and the existing structured INK object model.

Requirements:

- bounded raw SVG string input only;
- no URL fetch;
- no network;
- no script execution;
- no foreign code execution;
- preserve supported Path/Text/Group structure;
- report unsupported SVG evidence already returned by the parser;
- insert through History;
- generated/imported IDs must obey current identity/integrity rules.

Do not modify SVG parsing algorithms unless a current source incompatibility blocks exposure; if so STOP for MR.

### object.resize.v1

Expose absolute-size resize through existing transform/bounds authority.

v1 must be bounded to semantics already supported by the editor. Prefer one-target absolute resize.

No new constraint solver or oriented-bounds system.

### object.scale.v1

Reuse:

`editor/transform.js:applyWorldTransformBatch`

and existing Matrix authority.

Support bounded world-space scale around an explicit or deterministic center.

No new transform math.

### object.order.v1

Reuse existing parent-array / Layer order authority.

C2-A v1 is limited to ordering actions already supported natively by current editor behavior.

At minimum current `front` and `back` semantics must be supported.

Do not invent forward/backward semantics unless an existing native command is already present and directly reusable.

Targets must obey same-parent/same-layer structural safety where required.

### export_ink_asset

Reuse existing methods:

```text
app.exportPNG(...)
app.exportSVG(...)
app.exportPDF(...)
```

or a shared callable extraction of those exact authorities if needed.

Output must use the existing ephemeral output registry.

Do not add:
- external upload;
- automatic CHAT attachment transport;
- new renderer;
- alternate SVG serializer;
- new PDF renderer;
- print-window automation.

The tool should return sufficient metadata to identify:

```text
format
mimeType
byteLength
scope
source document/page
output handle
dimensions when already available
editable flag where meaningful
```

SVG should be identified as editable vector output.

PNG/PDF must not be falsely marked structurally editable.

## Authority factoring rule

Preferred implementation:

```text
CHAT facade
→ existing callable native authority
```

If an existing editor capability exists only inside a DOM-driven UI method:

```text
factor existing mutation/generation semantics into ONE shared callable helper
→ UI uses helper
→ CHAT uses helper
```

This is authorized only when:
- behavior is semantically unchanged;
- no schema change;
- no new engine;
- no duplicate authority;
- focused regression covers the existing UI call path.

## Authorized product files

Primary:

```text
product/source/src/editor/chat-bounded-edit.js
product/source/src/agent/capability-registry.js
product/source/src/agent/public-creative-api.js
```

Conditionally authorized only when necessary for shared-authority factoring:

```text
product/source/src/ink.js
product/source/src/editor/transform.js
product/source/src/document/hierarchy.js
product/source/src/vector/vector-core.js
product/source/src/editor/index.js
product/source/src/document/index.js
```

New small helper module under `product/source/src/editor/` or `product/source/src/agent/` is allowed only if it consolidates existing semantics and does not create a new engine/authority.

`product/source/src/agent/output-handle-registry.js` should remain unchanged unless a demonstrable metadata/lifecycle gap prevents export handle storage. If such a gap is found, STOP for MR before changing its lifecycle semantics.

## QA authorization

DEV may add/update focused QA under:

```text
qa/
qa/runtime/ink-cloud-018-browser-harness.html
```

Do not alter central Runtime orchestration:

`qa/runtime/run-ink-runtime-batch.mjs`

without separate MR authorization.

## Hard prohibitions

```text
UI redesign = 0
new Text engine = 0
new SVG parser = 0
new transform engine = 0
new export renderer = 0
new output registry lifecycle = 0 without MR stop
Document schema change = 0
migration change = 0
History semantic change = 0
Revision semantic change = 0
Renderer / Canvas / WebGL change = 0
service worker / cache change = 0
external transport = 0
IMAGE = 0
FORMAT_VERSION change = 0
product version change = 0
C2-B work = 0
C2-C work = 0
Connector-005 work = 0
main merge = 0
package promotion = 0
```

## Focused QA gate

At minimum verify:

1. C1 14-operation vocabulary remains unchanged/preserved;
2. C2-A adds exactly 7 bounded `use_ink` operations;
3. total bounded vocabulary = 21;
4. all new schemas are capability-discoverable;
5. zero-target create/import operations cannot mutate before approval;
6. all Document mutations use existing History;
7. Frame creation uses native Frame;
8. Text create/edit preserve current accepted Text semantics and stable IDs;
9. SVG import remains structured and rejects network/script execution paths;
10. resize/scale retain finite/non-singular transform safety;
11. object order preserves hierarchy ownership and target IDs;
12. export does not mutate Document/History/Revision;
13. export returns `INK_OUTPUT_HANDLE v1`;
14. inspect/release lifecycle works for export handles;
15. SVG export metadata marks editable vector output; PNG/PDF do not;
16. legacy C1 Geometry Ops focused contracts remain PASS;
17. proposal/approval/execute remains authoritative;
18. no new arbitrary JS/eval/Function/direct Document JSON bypass;
19. FORMAT_VERSION remains 4;
20. current UI call paths affected by authority factoring retain focused regression coverage.

## Runtime policy

```text
FULL_WINDOWS_RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH
```

If DEV encounters a change that would trigger the execution plan's high-risk immediate-Runtime exception, STOP and report it instead of expanding scope.

## Required checkpoint

Create:

`working/INK_TECH_CLOSURE_001_C2A_CHECKPOINT.md`

Required causal sections:

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

Successful state:

```text
RESULT = C2A_SOURCE_FOCUSED_PASS
RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH
NEXT = MR_SOURCE_REVIEW
```

## Handoff

After focused QA:

```text
update ACTIVE/INK_DEV_PROGRESS.md
record exact branch HEAD
DEV_HANDOFF → STOP
```

Do not start C2-B without MR release.
