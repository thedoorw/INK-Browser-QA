# INK CHAT Geometry Ops 001 — Report v0.1

STATUS: `DEV_IMPLEMENTED / MR_RUNTIME_PENDING`

## Purpose

Expose the minimum native geometry operation set CHAT needs for geometric reconstruction work, including Lesson 002 Rose Window, without introducing a second geometry engine.

## Operation vocabulary

Existing Connector-004 operations remain unchanged:

```text
path.repaint.v1
path.material.apply.v1
path.material.remove.v1
object.translate.v1
path.simplify.v1
path.refine.v1
```

Authorized additions:

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

Total: 14 bounded `use_ink` operations.

## Native authority mapping

| CHAT operation | Existing INK authority |
|---|---|
| `path.create.v1` | `vector-core.createPath / createAnchor` |
| `path.edit.v1` | `PathEditController` |
| `object.rotate.v1` | `Matrix.around / applyWorldTransformBatch` |
| `object.clone.v1` | `cloneCompositionObject` |
| `repeat.radial.v1` | `createRepeat` |
| `boolean.apply.v1` | `booleanPaths / dividePaths` |
| `group.create.v1` | `createVectorGroup` |
| `object.reparent.v1` | `reparentPageObject` |

## Geometry contracts

### path.create.v1

Creates one editable native Path on the active layer with zero input targets.

Supported constructors:

```text
path
ellipse
circle
rectangle
polygon
polyline
```

Custom Path supports bounded subpaths and anchors. Caller-supplied object id is optional; collisions are rejected.

### path.edit.v1

Delegates to `PathEditController` and supports:

```text
move-anchor
move-handle
set-anchor-mode
add-anchor
delete-anchors
set-subpath-closed
```

### object.rotate.v1

Applies a world-space rotation to one or more editable objects. An explicit world-space center can be supplied.

### object.clone.v1

Uses `cloneCompositionObject`, regenerating object / subpath / anchor identity while retaining composition lineage.

### repeat.radial.v1

Creates one native editable Repeat from exactly one source object.

Public center coordinates are world-space. The adapter converts them to the source parent's coordinate system before calling native `createRepeat`.

### boolean.apply.v1

Supports:

```text
union
difference
intersection
xor
divide
```

Requires 2+ editable same-parent/same-layer Path targets. Source Paths are replaced by editable native result Paths.

### group.create.v1

Groups same-parent/same-layer objects. Child stable object ids are retained.

### object.reparent.v1

Delegates to native hierarchy authority. Current native contract supports reparenting to a Frame or layer root, preserves world appearance, rejects cycles and cross-layer reparent.

## Governance preserved

Every new mutation still follows:

```text
proposal
→ explicit approval
→ execute
→ authoritative History
→ Chat Creative Plan final Revision
```

Prohibited / unchanged:

```text
arbitrary JavaScript = 0
eval / Function = 0
direct Document JSON writes = 0
new geometry engine = 0
new renderer = 0
UI changes = 0
IMAGE model = 0
external transport = 0
FORMAT_VERSION = 4
```

## QA

Focused source/contract QA executed by DEV:

```text
modified source syntax parse = PASS
browser harness script parse = PASS
operation exposure = PASS
native authority routing = PASS
radial world-center conversion = PASS
guardrails = PASS
Runtime marker completeness = 13 / 13 PASS
```

Real-browser acceptance proof is present in `qa/runtime/ink-cloud-018-browser-harness.html` and exercises:

```text
capability discovery
→ create native geometry
→ Path edit
→ explicit-center rotate
→ clone
→ radial Repeat
→ Boolean
→ Group
→ reparent
→ History
→ Revision
→ Preview
```

Target gate:

`CHAT_NATIVE_GEOMETRY_OPS_V01`

Windows exact-SHA Runtime remains MR-owned and has not been run by DEV.

## Lesson 002 impact

After this gate passes, CHAT will have the native construction/editing vocabulary needed to reconstruct the Rose Window geometrically rather than accepting automatic Reference decomposition as the artwork result.

Lesson 002 itself remains separate and is not executed in this task.
