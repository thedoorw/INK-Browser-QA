# INK Command + State Architecture Contract v0.1

STATUS: **B1 COMPLETE / CONTRACT ONLY / NO PRODUCT MUTATION**  
DATE: 2026-10-03  
REPO: `thedoorw/INK-Browser-QA`  
ROLE: INK Architecture Recomposition MR — B0/B1

Related:
- `research/INK_ARCHITECTURE_RECOMPOSITION_EXECUTION_PLAN_v0.1.md`
- `research/INK_ARCHITECTURE_RECOMPOSITION_ASSESSMENT_v0.1.md`
- `research/INK_UI_ASSEMBLY_REBUILD_FEASIBILITY_v0.1.md`
- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
- `working/INK_ARCHITECTURE_RECOMPOSITION_B0_PWA_BLOCK_RECORD_20261003.md`

## 1. Architecture decision

INK keeps one mature Core and introduces one shared command/state authority.

```text
Human UI ─┐
CHAT/API ─┼→ Shared Command Authority → existing Core/model
Recipe ───┘             │
                         ├→ History
                         ├→ Revision policy
                         ├→ Dirty/autosave policy
                         └→ render/UI invalidation
```

The authority is a seam over existing product capabilities, not a second Core.

Protected authorities remain:
- Document model;
- HistoryManager;
- RevisionController;
- InkStore;
- Renderer algorithms;
- Drawing / Stroke;
- Vector / Raster / Text / Transform / Material Core;
- Recipe engine;
- CHAT governance;
- Public Creative API role;
- `FORMAT_VERSION = 4`.

## 2. Source evidence pinned for B1 analysis

Observed source blobs on current main during B1:

| Surface | Blob SHA | Current authority problem |
|---|---|---|
| `product/source/src/ink.js` | `4857d457ce2d4cd05e1018ed44fb368e2aa8c95f` | product mutation + History + view/input + DOM/UI in one InkApp |
| `product/source/ui/full-capability-controls.js` | `901be6e89052bc2ea60c5e73ef05da388fd12d6e` | UI imports Core mutators and calls History directly |
| `product/source/web-shell.js` | `1bb0d91e9a6f1731ef7d17ff64d4ac029b96c522` | proxy-click routing plus direct Frame/Layout mutation |
| `product/source/src/editor/chat-bounded-edit.js` | `7528ff6c873e0341b65402001a252a8d875149e5` | governance is good; approved execution still owns duplicate mutation branches |
| `product/source/src/agent/public-creative-api.js` | `ba796382adbe18b7e0a3de20a1fd9c52e22dcbc3` | adapter role is correct; some History routes still call app History directly |
| `product/source/src/recipe/recipe-engine.js` | `6682dd2c2a583aea1f17e1b844b7cf59d6ea8efd` | orchestration is reusable; applyStep mutates document/Core directly |
| `product/source/src/config.js` | `cf3cf6aeca4d5e7fd42f6aeae9392f56364def67` | `FORMAT_VERSION = 4` |

This contract does not modify any of those files.

## 3. Canonical state domains

### 3.1 Product State

Authoritative product/editing state. It may be persisted, undoable, revision-visible, or used as semantic editing context.

Includes:
- document metadata;
- pages;
- layers;
- object hierarchy;
- vector/raster/text/stroke/material content;
- artboard and paper;
- masks/effects/adjustments/filter stacks;
- components/layout/repeat/dependency data;
- page guides and snap metadata where currently persisted/undoable;
- semantic selection context;
- active page/layer where needed by product operations.

Rules:
- UI must not write Product State directly.
- CHAT/Recipe must not create a parallel product model.
- Product mutations happen only inside canonical command executors or retained Core called by them.

### 3.2 View State

Authoritative non-content viewing/editing context.

Includes:
- camera pan/zoom/rotation;
- workspace view;
- creation/layout viewport;
- fit/reset state;
- rulers and view overlays;
- fullscreen;
- inspector/panel geometry when it affects the workspace view;
- renderer preference and view-only diagnostics.

Rules:
- View State has named selectors and commands.
- Preserve existing persistence/History semantics during migration even when a later cleanup may classify a field differently.
- Reclassification is not allowed to change behavior inside a migration slice.

### 3.3 UI-local State

Ephemeral shell state only.

Includes:
- open menu/flyout;
- hover/pressed/focus;
- dialog visibility;
- transient popover position;
- temporary panel menu state;
- tooltip;
- local drag affordance before commit;
- visual-only disclosure state.

Rules:
- UI-local State may live in the UI adapter/shell.
- It must not become a hidden source of Product State.
- A dialog may stage values locally, but commit must invoke a command.

## 4. State selector contract

Callers read through selectors rather than reaching into mutable state when migrating.

Minimum selector families:

```text
document.current
page.active
page.byId
layer.active
layer.list
selection.current
object.byRef
artboard.current
paper.current
guides.current
snap.current
tool.current
tool.settings
view.current
workspace.current
history.summary
revision.summary
render.status
capability.current
```

Selectors are read-only projections. They must not return writable authority objects to external adapters.

## 5. Canonical command envelope

Existing CHAT operation IDs ending in `.v1` are retained as canonical IDs wherever semantics already match. Do not create a second synonym merely for Human UI.

Conceptual request contract:

```js
{
  schema: "INK-COMMAND",
  version: 1,
  commandId: "guide.add.v1",
  origin: "human-ui" | "chat" | "recipe" | "public-api" | "system",
  correlationId: "...",
  target: {
    documentId: "...",
    pageId: "...",
    layerId: "...",
    objectId: "..."
  },
  arguments: {},
  expected: {
    stateFingerprint: "...",
    documentFingerprint: "..."
  }
}
```

Fields not needed by a command may be absent.

### Authority rule

The caller supplies intent and arguments.

The command definition owns:
- input validation;
- target resolution;
- lock/visibility/availability guards;
- mutation function;
- History label and History scope;
- Revision policy;
- dirty/autosave policy;
- spatial invalidation;
- render invalidation;
- returned receipt.

Callers may not override those policies.

## 6. Command result/error contract

Success:

```js
{
  ok: true,
  commandId: "...",
  changed: true,
  result: {},
  receipt: {
    history: { applied: true, label: "...", paths: [] },
    revision: { policy: "NO_IMPLICIT_CAPTURE", revisionId: null },
    dirty: true,
    invalidation: ["OVERLAY"],
    stateFingerprint: "..."
  }
}
```

Failure:

```js
{
  ok: false,
  commandId: "...",
  changed: false,
  error: {
    code: "TARGET_NOT_FOUND",
    message: "...",
    details: {}
  }
}
```

Common error classes:
- `UNKNOWN_COMMAND`
- `ARGUMENTS_INVALID`
- `TARGET_NOT_FOUND`
- `TARGET_LOCKED`
- `CAPABILITY_UNAVAILABLE`
- `STATE_STALE`
- `HISTORY_BUSY`
- `NO_OP`
- `COMMAND_FAILED`

Existing more-specific CHAT/Core error codes may be preserved as `error.code` or nested `cause`; migration must not discard diagnostics.

## 7. History / Revision / dirty / invalidation policy

### History

Policy values:

```text
REQUIRED
JOIN_ACTIVE_TRANSACTION
NONE
PRESERVE_EXISTING_ROUTE
```

Rules:
1. A normal Product State mutation that is currently undoable remains one History step.
2. Drag/preview may mutate temporary state, but only the commit command creates the History step.
3. A caller must not separately call `history.pushScoped()` around a command that already owns History.
4. Undo/Redo are themselves canonical commands.
5. A migration may not change History labels/scope until parity is accepted.

### Revision

Default during recomposition:

`NO_IMPLICIT_CAPTURE`

Existing Revision behavior is preserved. Architecture migration does not start capturing Revisions automatically. Explicit Revision actions remain explicit commands.

### Dirty/autosave

Product mutation commands declare whether they dirty the document. The command authority invokes the existing dirty/autosave mechanism once.

View/UI-local commands do not dirty the document unless the current accepted behavior does so and parity requires preserving it.

### Render invalidation classes

```text
NONE
UI_REFRESH
OVERLAY
OBJECT_BOUNDS
PAGE
TILES
FULL_RENDER
OUTPUT_ONLY
```

The command declares intent; a centralized invalidation adapter translates it to the existing Renderer/refresh calls during migration.

## 8. UI-critical command registry v0.1

This is the contract registry, not an implementation claim.

### Document / Page

```text
document.new.v1
document.open.v1
document.save.v1
document.title.set.v1
page.create.v1
page.duplicate.v1
page.delete.v1
page.activate.v1
page.rename.v1
page.artboard.set.v1
page.paper.set.v1
page.snap.set.v1
```

### Guides

```text
guide.add.v1
guide.move.v1
guide.remove.v1
guide.lock.set.v1
guide.visibility.set.v1
```

### Layer

```text
layer.create.v1
layer.duplicate.v1
layer.delete.v1
layer.reorder.v1
layer.opacity.set.v1
layer.visibility.set.v1
layer.lock.set.v1
layer.filter.add.v1
```

### Selection / hierarchy

```text
selection.set.v1
selection.clear.v1
selection.all.v1
selection.delete.v1
selection.duplicate.v1
group.create.v1
group.ungroup.v1
object.order.v1
object.reparent.v1
frame.create.v1
layout.frame.set.v1
layout.frame.remove.v1
layout.item.set.v1
layout.item.remove.v1
```

### Transform

```text
object.translate.v1
object.rotate.v1
object.scale.v1
object.resize.v1
object.align.v1
object.distribute.v1
object.opacity.set.v1
object.skew.v1
path.perspective.v1
path.warp.v1
path.distort.v1
```

### Vector / Text / Material

```text
path.create.v1
path.edit.v1
path.refine.v1
path.simplify.v1
path.repaint.v1
path.material.apply.v1
path.material.remove.v1
boolean.apply.v1
repeat.radial.v1
repeat.mirror.v1
repeat.grid.v1
text.create.v1
text.edit.v1
text.path.set.v1
material.template.create.v1
material.instance.create.v1
```

### Drawing / Tool settings

```text
tool.activate.v1
tool.setting.set.v1
tool.color.set.v1
stroke.create.v1
stroke.erase.circle.v1
paint.session.create.v1
```

### Raster / Image

```text
image.adjustment.add.v1
image.filter.add.v1
image.effect.add.v1
image.blend.set.v1
image.mask.raster.set.v1
image.liquify.add.v1
image.raster.paintBucket.v1
image.raster.spotHeal.v1
image.raster.localRetouch.v1
image.raster.sourceRetouch.v1
image.crop.v1
image.resize.v1
image.bitDepth.convert.v1
image.colorMode.convert.v1
```

### View / workspace

```text
view.zoom.by.v1
view.zoom.set.v1
view.pan.v1
view.rotate.v1
view.reset.v1
view.fit.content.v1
view.fit.artboard.v1
workspace.activate.v1
workspace.layoutViewport.set.v1
workspace.layoutViewport.fit.v1
workspace.layoutViewport.reset.v1
view.fullscreen.set.v1
```

### History / Revision

```text
history.undo.v1
history.redo.v1
history.jump.v1
history.limit.set.v1
revision.capture.v1
revision.restore.v1
```

### Import / Export / Recipe control

```text
svg.import.v1
image.import.v1
project.import.v1
export.png.v1
export.svg.v1
export.pdf.v1
export.print.v1
recipe.studio.execute.v1
```

A later registry implementation may add commands, but aliases must resolve to one canonical semantic authority.

## 9. Old route → target command mapping

### 9.1 `src/ink.js`

| Current route | Target authority |
|---|---|
| `newDocument()` | `document.new.v1` |
| `addPage()/duplicatePage()/deletePage()/switchPage()` | existing `page.*.v1` commands |
| direct title `history.pushScoped` in `bindUI()` | `document.title.set.v1` |
| `addGuide()/moveGuide()/removeGuide()/setGuideLocked()/setGuideVisible()` | existing `guide.*.v1` commands |
| `setSnapEnabledState()/setSnapCategoryState()` | `page.snap.set.v1` |
| layer add/duplicate/delete/reorder/opacity/visibility/lock | `layer.*.v1` |
| selection delete/duplicate/group/ungroup/order | selection/group/object-order commands |
| translate/resize/rotate/align/distribute | existing object transform commands |
| `changeArtboard()` | `page.artboard.set.v1` |
| `changePaper()/commitPaperPreview()` | `page.paper.set.v1` |
| `setTool()/updateBrushSetting()/setColor()` | tool commands |
| zoom/pan/fit/reset/workspace/layout viewport | View/workspace commands |
| direct Undo/Redo buttons | `history.undo.v1` / `history.redo.v1` |
| import/export UI methods | import/export commands |

Compatibility method names may remain temporarily, but after migration they must be thin command adapters rather than mutation owners.

### 9.2 `ui/full-capability-controls.js`

Current direct mutations must be rehomed:

| Current route | Target authority |
|---|---|
| `addAdjustment()` + direct `createAdjustment` | `image.adjustment.add.v1` |
| `addFilter()` + direct `createFilter` | `image.filter.add.v1` |
| `addLayerEffect()` | `image.effect.add.v1` |
| layer filter direct mutation | `layer.filter.add.v1` |
| layer lock direct mutation | `layer.lock.set.v1` |
| object blend direct mutation | `image.blend.set.v1` or object appearance command by target type |
| filter/effect/adjustment reorder/remove | canonical stack commands to be added before migration |
| text property direct update | `text.edit.v1` |
| raster crop/resize | image crop/resize commands |
| bit depth/color mode conversion | image conversion commands |
| advanced transform/deformation | object/path transform commands |

The final UI file contributes controls and invokes commands; it does not import product mutators for direct write authority.

### 9.3 `web-shell.js`

| Current route | Target |
|---|---|
| proxy `#undoBtn/#redoBtn` clicks | History commands |
| file-command proxy clicks | Document/import/export commands |
| canvas-setting/fit/fullscreen proxy clicks | View commands |
| ruler drag calling `app.addGuide/moveGuide/removeGuide` | Guide commands |
| `mutateFrameLayoutFromShell()` direct History/write | `layout.frame.set/remove.v1` |
| `mutateLayoutItemFromShell()` direct History/write | `layout.item.set/remove.v1` |
| Library reuse proposal | keep proposal adapter; accepted execution calls canonical command |

Final shell must not depend on clicking hidden/legacy DOM controls to reach product behavior.

### 9.4 CHAT bounded edit

Keep:
- task normalization;
- validation;
- proposal;
- explicit approval token;
- stale-state checks;
- audit/result/provenance behavior.

Rehome:
- mutation branches in `executeApprovedTask()`.

Rule:

```text
approved CHAT task
→ canonical commandId (prefer same existing operation ID)
→ Shared Command Authority
→ existing Core/History/Renderer
```

Examples already suitable for 1:1 canonical IDs:
- `guide.*.v1`;
- `page.*.v1`;
- `object.translate/rotate/scale/resize/align/order/reparent.v1`;
- `frame.create.v1`;
- `layout.*.v1`;
- `path/text/image/material/repeat/boolean/stroke/paint.*.v1`.

CHAT approval remains outside the command executor; the command authority must not weaken the existing proposal→approval gate.

### 9.5 Public Creative API

Keep `public-creative-api.js` as adapter.

Migrate direct History operations:
- `history.undo` → `history.undo.v1`;
- `history.redo` → `history.redo.v1`.

Edit proposal/approval remains delegated to CHAT governance.

Recipe route remains an adapter to Recipe governance, whose mutating steps progressively move to canonical commands.

### 9.6 Recipe

Keep:
- role mapping;
- expressions;
- conditions;
- repeat-over;
- checkpoint/breakpoint;
- replay/report;
- deterministic orchestration.

Rehome product mutations in `RecipeEngine.applyStep()` when a matching canonical command exists.

Initial mapping:
- `path` → `path.create.v1`;
- `group` → `group.create.v1`;
- material create/update/detach → Material commands;
- hierarchy set-parent → `object.reparent.v1`;
- object duplicate → `object.clone.v1`;
- transform → object transform commands;
- layer changes → Layer commands;
- adjustment/filter → image/layer stack commands;
- deformation → path deformation commands.

Recipe-only orchestration operations such as expression evaluation and breakpoint control remain Recipe authority and are not forced into product commands.

## 10. Caller switching parity gate

A caller class may switch from old route to canonical command only when all applicable evidence passes against the same fixture:

1. identical normalized document/product-state result;
2. identical target resolution and error behavior;
3. identical History step count;
4. identical History label and scoped paths unless an explicitly approved contract change exists;
5. Undo returns the same pre-state;
6. Redo returns the same post-state;
7. no new implicit Revision;
8. same dirty/autosave behavior;
9. equivalent renderer invalidation / visible result;
10. equivalent Preview/output fingerprint where applicable;
11. CHAT proposal/approval semantics unchanged;
12. exact regression tests PASS.

For UI caller switching, also require assembled interaction evidence; a successful command unit test alone is insufficient.

## 11. RETIRE conditions

An old handler/route may be removed only when:

```text
canonical command exists
+ all intended caller classes are migrated
+ no direct product mutation remains in that old route
+ old/new parity evidence is accepted
+ History/Revision parity is accepted
+ render/output parity is accepted
+ static search/guard confirms no required callers remain
+ exact-SHA browser/Runtime regression passes
+ deployed evidence passes where the route is delivery-sensitive
```

Additional rules:
- do not delete old handlers during first migration;
- do not delete proxy routes merely because the replacement compiles;
- no mass file move as proof of architectural completion;
- no legacy CSS/DOM retirement until the new assembled UI has parity evidence;
- no product-source migration begins before B0 freeze is actually complete and a later Work Order authorizes B2.

## 12. B1 disposition

```text
B1_COMMAND_STATE_CONTRACT = COMPLETE
SHARED_COMMAND_AUTHORITY = SPECIFIED / NOT IMPLEMENTED
STATE_DOMAINS = DEFINED
UI_CRITICAL_REGISTRY = DEFINED
OLD_ROUTE_MAPPING = DEFINED
HISTORY_REVISION_INVALIDATION_POLICY = DEFINED
PARITY_GATE = DEFINED
RETIRE_CONDITIONS = DEFINED
PRODUCT_SOURCE_MUTATION = NONE
FORMAT_VERSION = 4 / UNCHANGED
```
