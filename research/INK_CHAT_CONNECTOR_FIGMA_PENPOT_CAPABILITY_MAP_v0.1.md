# INK CHAT Connector — Figma / Penpot Capability Map v0.1

STATUS: `RESEARCH_BASELINE / NO_IMPLEMENTATION_AUTHORIZATION`

## User directive

```text
DRAWING_VALIDATION = PAUSED
GOAL = make CHAT operate INK with the same mature mental model used for Figma / Penpot
PRIORITY = reuse existing mature agent workflows instead of training a bespoke operation path from zero
IMAGE_MODEL = 0
```

This document is a capability and connector architecture baseline. It does not authorize implementation.

---

## 1. Main conclusion

The strongest shared pattern is not "copy Figma UI".

It is:

```text
AI client / CHAT
→ one general design-context tool
→ design application API
→ native document / node / history authority
→ inspectable canvas result
```

Current mature examples:

```text
Figma
CHAT → use_figma → Figma Plugin API → native Figma nodes

Penpot
AI client → execute_code → Penpot Plugin API → native Penpot shapes

Target INK
CHAT → use_ink → INK Public Creative API → existing INK authorities
```

INK should not create a second drawing engine. `use_ink` must only expose existing accepted INK commands/controllers through a stable public API.

---

## 2. Figma — CHAT's current direct capability surface

The Figma connector is installed in the current CHAT environment.

### 2.1 Read / inspect / visual QA

Installed tools:

```text
get_screenshot
get_design_context
get_motion_context
get_metadata
get_variable_defs
get_figjam
whoami
```

Operational pattern:

```text
inspect file / node
→ obtain stable node IDs
→ inspect design context / variables / screenshot
→ mutate through use_figma
→ return affected IDs
→ screenshot / structural validation
```

### 2.2 General canvas execution

Primary tool:

```text
use_figma
```

It executes JavaScript against the Figma Plugin API in the target file context.

Native design-mode node families supported by the current workflow include:

```text
Rectangle
Frame
Component
Text
Ellipse
Star
Line
Vector
Polygon
BooleanOperation
Slice
Page
Section
TextPath
```

Common direct operations:

```text
inspect/query nodes
create nodes
rename
resize
position
transform
fill / stroke / opacity
parent / append / reorder
remove / clone
group-like composition
Auto Layout
text editing
font loading
component / instance / variant operations
variables / modes / aliases / bindings
text/effect styles
library component import
library variable/style import
screens / composed views
node screenshot
```

### 2.3 Design-system workflow

Installed tools:

```text
get_libraries
search_design_system
```

Mature CHAT workflow:

```text
inspect existing screen
→ discover Code Connect / libraries
→ search components + variables + styles
→ reuse existing design-system primitives
→ create wrapper/container
→ compose sections from instances
→ bind tokens
→ screenshot
→ targeted correction
```

This is particularly important for INK: mature output comes from reuse of known modules, not redrawing every object from primitives.

### 2.4 Code ↔ design

Installed tools:

```text
get_design_context
generate_figma_design
get_code_connect_map
add_code_connect_map
get_code_connect_suggestions
send_code_connect_mappings
get_context_for_code_connect
list_file_components_for_code_connect
```

Capabilities:

```text
design → structured context/code
live web UI → editable Figma layers
component ↔ code mapping
design-system-aware screen generation
```

### 2.5 Assets / files

Installed tools:

```text
create_new_file
upload_assets
download_assets
```

### 2.6 FigJam / Slides

Installed tools:

```text
get_figjam
generate_diagram
generate_deck
```

### 2.7 Extended Figma media / generative surfaces

Installed tool families:

```text
Weave:
  weave_list_tools
  weave_get_tool_inputs
  weave_run_tool
  weave_upload_asset
  weave_get_tool_run_output
  weave_cancel_tool_run
  weave_find_model
  weave_run_model
  weave_get_model_run_output

Video:
  export_video

Shaders:
  list_file_shaders
  list_shaders
  get_shader
  create_shader
  update_shader

Generative plugins:
  list_generative_plugins
  get_generative_plugin
  create_generative_plugin
  update_generative_plugin
```

These are not required for INK Connector v0.1.

---

## 3. Penpot — official MCP / Plugin API capability surface

Penpot is not currently installed as a direct ChatGPT connector in this conversation.
Its official MCP architecture is nevertheless directly relevant to INK.

### 3.1 Official MCP tools

Current official Penpot MCP documents the following local tools:

```text
execute_code
high_level_overview
penpot_api_info
export_shape
import_image
```

The key tool is `execute_code`: an agent can execute JavaScript using the Penpot Plugin API against the active design page.

### 3.2 Context / inspect

Penpot Plugin API exposes:

```text
currentFile
currentPage
root
selection
viewport
history
library
fonts
events
active users / context
```

### 3.3 Create / structure

Penpot API supports:

```text
createBoard
createRectangle
createEllipse
createPath
createText
createBoolean
createShapeFromSvg
createShapeFromSvgWithImages
group
ungroup
appendChild
insertChild
clone
remove
```

### 3.4 Appearance / transform / ordering

Shape-level capabilities include:

```text
fills
strokes
opacity / appearance properties
resize
rotate
bringToFront
bringForward
sendToBack
sendBackward
plugin data
shared plugin data
```

### 3.5 Layout

Penpot exposes native:

```text
FlexLayout
GridLayout
gap
padding
alignment
justify
fill / auto / fixed sizing
rows / columns
child placement
```

### 3.6 Components / variants / libraries

Penpot exposes:

```text
createComponent
component instance
main instance
detach
swapComponent
resetOverrides
combineAsVariants
switchVariant
local / connected libraries
library colors
library typography
library components
```

### 3.7 Design tokens

Penpot exposes:

```text
TokenCatalog
TokenSet
TokenTheme
applyToken
token properties for:
  color
  dimensions
  sizing
  spacing
  radius
  opacity
  border width
  font family / size / weight
  letter spacing
  text case / decoration
  typography
  shadows
```

### 3.8 Prototype / interactions

Penpot shape API supports:

```text
interactions
addInteraction
removeInteraction
navigation/prototype actions
```

### 3.9 Export / code generation

Penpot supports:

```text
export:
  SVG
  PNG
  JPEG
  WEBP
  PDF

generateMarkup:
  HTML
  SVG

generateStyle:
  CSS

generateFontFaces
```

### 3.10 Events / live context

Penpot plugins can listen for:

```text
pagechange
shapechange
selectionchange
themechange
filechange
contentsave
finish
```

---

## 4. Figma / Penpot / INK operational equivalence

Legend:

```text
READY = existing INK authority/capability exists
PARTIAL = core exists but public CHAT operation surface is incomplete
HIDDEN = capability exists but is not a clean public connector operation
GAP = no mature equivalent yet
N/A-v0.1 = deliberately outside initial connector scope
```

| Operation family | Figma | Penpot | INK today | INK Connector target |
|---|---|---|---|---|
| Current document/file context | file/page metadata | currentFile/currentPage | READY: Document/Page | `ink.currentDocument/currentPage` |
| Stable node/object identity | node ID | shape ID | READY: stable object IDs | `ink.getNodeById(id)` |
| Selection | selection via file context / Plugin API | `selection` | READY: selection | `ink.selection` |
| Query hierarchy | `query`, metadata traversal | root/page/shape traversal | READY: hierarchy + Document Bridge | `ink.query(...)` |
| Screenshot/render check | `get_screenshot`, node.screenshot | export_shape / agent vision | PARTIAL: renderer exists, no connector screenshot primitive | `ink.getScreenshot` |
| Frame/container | Frame | Board | READY: native Frame | `ink.createFrame` |
| Group | group/container composition | group/ungroup | READY: Group/hierarchy | `ink.group / ungroup` |
| Path/vector | Vector/Line/Polygon/etc | Path | READY: Path kernel | `ink.createPath` + path commands |
| Rectangle/Ellipse primitives | native primitives | native primitives | PARTIAL: representable/importable; no unified public create API | convenience constructors over Path |
| Text | native Text | native Text | PARTIAL: document/SVG text support; public editing surface needs audit | `ink.createText / text.set` after audit |
| Raster/image reference | image fills/assets | import_image/image fills | READY: Reference import | `ink.importReference` |
| SVG import | vector/plugin APIs | createShapeFromSvg | READY: INK SVG import | `ink.importSVG` |
| Fill/stroke/opacity | node paints | fills/strokes | READY: repaint/material appearance | `ink.setAppearance` |
| Material/expressive stroke | effects/plugins | fills/effects | READY: INK-specific advantage | `ink.material.*` |
| Translate | transform | position/transform | READY | `ink.translate` |
| Resize/rotate/scale | native transform | resize/rotate | PARTIAL: transform core exists; public CHAT coverage incomplete | common transform API |
| Z-order/reorder | node order | front/back methods | READY/PARTIAL: Layers/hierarchy exists | public node ordering API |
| Path edit | vector edit | path commands | READY: Path edit | `ink.path.edit` |
| Simplify/refine | Plugin API/custom | execute_code/custom | READY + already CHAT bounded | preserve same operation |
| Boolean geometry | BooleanOperation | createBoolean | READY: union/difference/intersection/xor/divide | `ink.boolean` |
| Repeat / parametric | component/plugin/script | script/plugin | READY: radial/mirror/grid/expand | INK advantage; public API |
| Auto/Flex layout | Auto Layout | FlexLayout | PARTIAL: FrameLayout horizontal/vertical/gap/padding/alignment foundation | Figma-like layout wrapper |
| Grid layout | layout/grid ecosystem | GridLayout | GAP / not equivalent mature executor | later |
| Constraints/fill/hug | Auto Layout sizing | layout sizing | PARTIAL: LayoutItem fixed/fill/hug + constraints foundation | public layout item API |
| Components | Component/Instance | LibraryComponent | PARTIAL: component definitions/instances exist | public component API |
| Component overrides | component properties | override/reset/swap | PARTIAL: opacity override foundation | expand bounded overrides |
| Variants | ComponentSet/variants | VariantContainer | GAP / no mature equivalent | later |
| Variables/tokens | Variables/modes/aliases | TokenCatalog/themes/sets | GAP as general design-token system | connector phase after base drawing |
| Styles/library reuse | libraries/search design system | connected libraries | PARTIAL: materials/recipes/research but no generic design library query | add searchable INK creative library |
| History/Undo/Redo | app-native | history context | READY and authoritative | expose read/undo/redo via same authority |
| Revision/version | file/version ecosystem | file versions/history | READY: Revision + Provenance | `ink.revision.*` |
| Compare | screenshot/design compare workflows | agent/design comparison | READY/PARTIAL: structural compare + preview | connector compare readout |
| Prototype interactions | prototype features | addInteraction | GAP | N/A-v0.1 for image workstation |
| Asset export | export/download | SVG/PNG/JPEG/WEBP/PDF | PARTIAL: INK export UI exists; exact connector formats need audit | unified export tool |
| Design → code | get_design_context / Code Connect | generateMarkup/style | GAP as product connector | N/A initially |
| Code/live UI → design | generate_figma_design | MCP/code-to-design workflows | GAP | optional later |
| Design-system search | search_design_system | libraries/tokens/components | GAP | important later for mature reusable artwork modules |
| Semantic grounding | not primary native concept | agent via execute_code | READY: INK Semantic Region Grounding | INK advantage |
| Reference decomposition | external/plugin workflow | plugin/script workflow | READY: Reference → Color + Line | INK advantage |
| Creative Memory / Research | external/contextual | external/agent | READY/HIDDEN | expose through connector advisory tools |
| Operation provenance | normal file changes | normal file changes | READY and stronger: explicit provenance | preserve as required invariant |

---

## 5. CHAT-compatible vocabulary map

The skill layer should teach CHAT one translation dictionary.

| Figma mental model | Penpot mental model | INK canonical model |
|---|---|---|
| Document/File | File | Document |
| Page | Page | Page |
| SceneNode | Shape | Object |
| Frame | Board | Frame |
| Vector | Path | Path |
| Group | Group | Group |
| Component | LibraryComponent | ComponentDefinition |
| Instance | Component copy | ComponentInstance |
| Auto Layout | FlexLayout | FrameLayout |
| Variables | Tokens | future INK Tokens |
| Fill/Stroke | Fill/Stroke | Appearance / Material |
| Version/history | History/FileVersion | History + Revision |
| Plugin API | Plugin API | INK Public Creative API |
| use_figma | execute_code | use_ink |

CHAT should learn INK through this dictionary instead of a separate bespoke language.

---

## 6. Proposed minimal INK MCP / connector tool surface

Do not expose hundreds of one-off tools first.

### Core tools

```text
use_ink
get_ink_metadata
get_ink_screenshot
get_ink_design_context
get_ink_capabilities
import_ink_asset
export_ink_asset
```

### Why `use_ink` is the center

```text
Figma: use_figma
Penpot: execute_code
INK: use_ink
```

`use_ink` should execute bounded JavaScript or an equivalent structured script in a sandbox with one injected object:

```js
ink
```

The script may inspect freely. Mutations must route through authoritative INK command/controller paths.

Every write returns exact affected IDs and operation receipts.

Example target style:

```js
const paths = ink.currentPage.query('PATH');
const target = paths.first();
const result = await ink.path.repaint(target.id, { fill: '#8f4c78' });
return {
  mutatedNodeIds: [target.id],
  result
};
```

No direct rewriting of document JSON is permitted.

---

## 7. Proposed INK Public Creative API families

### Read

```text
ink.currentDocument
ink.currentPage
ink.selection
ink.getNodeById(id)
ink.query(selector)
ink.inspect(nodeId)
ink.capabilities()
```

### Structure

```text
ink.createFrame(...)
ink.createGroup(...)
ink.createPath(...)
ink.createText(...)          // after current text audit
ink.importSVG(...)
ink.importReference(...)
ink.appendChild(...)
ink.reparent(...)
ink.remove(...)
ink.clone(...)
ink.order(...)
```

### Appearance

```text
ink.path.repaint(...)
ink.path.material.apply(...)
ink.path.material.remove(...)
ink.appearance.inspect(...)
```

### Geometry / transform

```text
ink.translate(...)
ink.scale(...)
ink.rotate(...)
ink.path.edit(...)
ink.path.simplify(...)
ink.path.refine(...)
ink.boolean.union(...)
ink.boolean.difference(...)
ink.boolean.intersection(...)
ink.boolean.xor(...)
ink.boolean.divide(...)
```

### Parametric / composition

```text
ink.repeat.radial(...)
ink.repeat.mirror(...)
ink.repeat.grid(...)
ink.repeat.expand(...)
ink.layout.inspect(...)
ink.layout.evaluate(...)
```

### Component

```text
ink.component.register(...)
ink.component.createInstance(...)
ink.component.setOverride(...)
ink.component.detach(...)
ink.component.duplicateDefinition(...)
ink.component.repairReference(...)
```

### History / revision

```text
ink.history.inspect()
ink.history.undo()
ink.history.redo()
ink.revision.capture(...)
ink.revision.list()
ink.revision.restore(...)
ink.revision.compare(...)
```

### AI-native INK advantages

```text
ink.grounding.document(...)
ink.grounding.semanticRegions(...)
ink.reference.decompose(...)
ink.compare(...)
ink.research.context(...)
ink.memory.context(...)
```

---

## 8. Required `use_ink` behavioral contract

Borrow the mature Figma/Penpot agent pattern:

1. Inspect before creating or mutating.
2. Resolve stable IDs; never guess IDs.
3. Return every created/mutated ID.
4. Batch coherent related edits when safe.
5. Use native INK structure instead of flattening.
6. Reuse existing components/materials/recipes when available.
7. Validate structure from returned evidence.
8. Obtain one visual screenshot after a coherent composition.
9. Apply targeted fixes rather than rebuild.
10. Stop when evidence passes.

INK-specific invariants:

```text
DIRECT_DOCUMENT_JSON_MUTATION = PROHIBITED
SECOND_HISTORY = PROHIBITED
SECOND_REVISION = PROHIBITED
SECOND_GEOMETRY_ENGINE = PROHIBITED
WRITE_WITHOUT_OPERATION_RECORD = PROHIBITED
FORMAT_VERSION_CHANGE = NOT IMPLIED
IMAGE_MODEL = 0 unless user explicitly requests it
```

Where current INK approval policy requires proposal/approval, `use_ink` must call that existing authority rather than bypass it.

---

## 9. How this saves development/training time

Old validation style:

```text
one CHAT operation
→ custom adapter
→ custom test
→ next operation
→ another adapter
→ another test
```

Target style:

```text
one general connector
→ stable public creative API
→ skill translation dictionary
→ CHAT reuses mature Figma/Penpot workflow
→ new INK capabilities become callable automatically when registered
```

The main reusable asset is not only API code. It is the workflow grammar:

```text
inspect
→ discover reusable assets/modules
→ create/compose
→ mutate
→ return IDs
→ screenshot
→ targeted revision
```

---

## 10. Proposed staged implementation — planning only

### Connector-001 — Public API adapter

Wrap existing accepted INK authorities behind stable methods.

No new drawing behavior.

### Connector-002 — `use_ink`

One sandboxed general execution surface.

Read operations first; writes through existing authoritative command paths.

### Connector-003 — Metadata + Screenshot

Provide the two feedback channels CHAT uses constantly in mature Figma workflows:

```text
structure evidence
+
visual evidence
```

### Connector-004 — INK Skill

Create reusable agent instructions equivalent in purpose to Figma skills:

```text
inspect first
stable IDs
reuse native modules
safe mutation
return IDs
visual validation
error recovery
```

Include the Figma/Penpot → INK vocabulary map.

### Connector-005 — Creative Library Search

Expose reusable:

```text
components
materials
recipes
parametric structures
reference-derived structures
future tokens/styles
```

This is the step that most directly helps CHAT produce mature work instead of rebuilding primitives.

### Connector-006 — Resume creative validation

Only after the connector is usable:

```text
real user request
→ CHAT inspect
→ use_ink
→ native INK operations
→ screenshot
→ targeted corrections
→ History / Revision / provenance
→ finished artwork
```

This replaces the current narrow Phase-by-Phase drawing tests as the primary user-facing validation model.

---

## 11. Acceptance target

The final success condition is not "all APIs exist".

It is:

```text
USER gives ordinary design instruction
→ CHAT already knows the workflow from Figma/Penpot
→ CHAT inspects INK using the same mental model
→ CHAT finds the correct INK objects/modules
→ CHAT executes native INK operations without bespoke per-feature training
→ CHAT receives stable IDs + structural evidence + screenshot
→ CHAT performs bounded visual correction
→ History / Revision / provenance remain authoritative
→ finished editable INK artwork
```

Target phrase:

`CHAT_CAN_USE_INK_AS_FLUENTLY_AS_A_MATURE_MCP_DESIGN_TOOL`

---

## 12. Research sources checked

Current official/reference sources checked on 2026-09-24:

- Figma MCP guide / write-to-canvas / skills documentation.
- Current installed Figma ChatGPT connector tool surface.
- Penpot official MCP server documentation.
- Penpot official Plugin API documentation.
- Penpot official MCP implementation lineage in the Penpot repository.

Key Penpot MCP architecture:

```text
MCP client
→ MCP server
→ Penpot MCP plugin
→ focused Penpot page
→ execute Plugin API code
```

This architecture is the closest direct reference for the proposed INK connector.


---

## 13. Reference → Color + Line → CHAT closed-loop workflow

This section replaces the previous idea of validating the workflow as a sequence of isolated CHAT edit phases.

### 13.1 Common target

The editor-independent target is:

```text
reference image
→ bounded raster preparation
→ color-region vectorization
→ Color editable paths
→ derive Line boundary paths from the same geometry
→ commit Reference / Color / Line as separate native layers
→ return stable IDs + counts + palette + source identity
→ CHAT structural inspection
→ visual screenshot
→ native editor corrections
→ History / Revision / provenance
→ inspectable editable artwork
```

Important semantic boundary:

```text
Line = boundary geometry derived from Color regions
Line ≠ semantic centerline
Line ≠ object-recognition contour
```

The current INK Phase B implementation intentionally follows this boundary model.

### 13.2 Figma workflow

#### Fast native-assisted Figma route

Figma currently provides an AI `Vectorize` feature for static images. Full-color mode can preserve multiple source colors and lets the user choose the number of colors.

A practical Figma workflow is:

```text
1. place Reference image
2. Figma AI Vectorize → full-color editable vector layers
3. group resulting filled vectors as Color
4. duplicate the same vector geometry
5. remove fills + apply stroke → Line
6. retain original raster as Reference
7. organize:
   Reference
   Color
   Line
8. CHAT inspects stable node IDs
9. CHAT uses use_figma for native edits
10. screenshot → visual QA → targeted correction
```

Caveat:

The current external Figma `use_figma` workflow writes through the Plugin API.
The documented Plugin API exposes vector/image/node creation and mutation, but the Figma AI `Vectorize` command is a separate product AI feature rather than a documented Plugin API primitive.

Therefore the **fully CHAT-controlled closed loop** should not depend on invoking Figma AI Vectorize.

#### Fully agent-controlled Figma route — preferred benchmark

```text
CHAT receives Reference
→ shared trace/decomposition engine
→ TraceBundle:
   source identity
   palette
   Color SVG/paths
   Line SVG/paths
→ use_figma
→ create native Reference image node
→ create/import Color vectors
→ create/import Line vectors
→ preserve alignment
→ return created node IDs
→ get_screenshot
→ CHAT correction through use_figma
```

Figma can create vector nodes directly and can create Figma nodes from SVG, so it is a strong host for the resulting vector structures.

### 13.3 Penpot workflow

Penpot MCP exposes `execute_code`, `import_image`, `export_shape`, `high_level_overview`, and Plugin API access to the currently focused page.

Penpot Plugin API can create/import native Path/SVG structures, group them, and apply fills/strokes.

For this exact task, the recommended closed loop is:

```text
CHAT receives Reference
→ import_image → Reference
→ shared trace/decomposition engine
→ TraceBundle
→ execute_code
→ createShapeFromSvg(Color SVG)
→ group/name as Color
→ createShapeFromSvg(Line SVG)
   or clone same paths + fill none + stroke
→ group/name as Line
→ align with Reference
→ return Penpot shape IDs
→ high_level_overview / export_shape
→ CHAT visual inspection
→ execute_code targeted native corrections
```

The current official Penpot MCP / Plugin API documentation does not define a dedicated raster-vectorization primitive comparable to Figma AI Vectorize, so the shared trace engine remains the deterministic decomposition stage.

### 13.4 INK workflow — current implementation

INK already contains the specialized decomposition stage that Figma/Penpot would otherwise need to obtain externally.

Current accepted Phase B path:

```text
Reference
→ decodeReferenceFile
→ boundedColorTraceRaster
→ ImageTracerJS adapter
→ executeExtraction(mode = color-regions)
→ editable Color Paths
→ duplicate same geometry as Line Paths
   fill = null
   stroke = requested lineStroke
→ create separate Color / Line layers
→ authoritative History pushScoped
→ stable object IDs
→ CHAT decomposition receipt
→ audit / provenance
```

Current bounded trace contract:

```text
COLOR_TRACE_MAX_PIXELS = 64,000
COLOR_TRACE_MAX_DIMENSION = 320
colorsampling = 2
colorquantcycles = 1
```

Current layer commit:

```text
Reference layer = original source
Color layer     = filled editable Paths
Line layer      = boundary copies of the same Paths
```

Current receipt already contains:

```text
referenceObjectId
colorLayerId
lineLayerId
colorObjectIds[]
lineObjectIds[]
colorCount
lineCount
palette
source identity
History evidence
Revision before/after
audit
provenance
```

The post-commit selection is intentionally bounded to one representative Line Path rather than selecting every generated path.

### 13.5 Cross-editor comparison

| Closed-loop stage | Figma | Penpot | INK |
|---|---|---|---|
| Reference ingest | image node / image fill | `import_image` / image fill | READY |
| Raster → vector color regions | Figma AI Vectorize available, but not a documented `use_figma` Plugin API primitive | shared/external trace needed | **native READY** |
| Deterministic bounded tracing | external/shared tracer | external/shared tracer | **native READY** |
| Editable Color paths | native Vector nodes | native Path/SVG shapes | **native Path** |
| Line boundary layer | duplicate/import vector geometry + stroke | duplicate/import vector geometry + stroke | **native READY** |
| Separate Reference/Color/Line structure | Frames/groups/layers | Boards/groups/layers | **native READY** |
| Stable IDs | node IDs | shape IDs | **native stable IDs** |
| Structured receipt | agent must assemble | agent must assemble | **native READY** |
| History | Figma native undo/history | Penpot native history context | **authoritative HistoryManager** |
| Revision/provenance | file/version ecosystem | file/history ecosystem | **native Revision + provenance** |
| CHAT write surface | `use_figma` | `execute_code` | target = `use_ink` |
| CHAT screenshot loop | `get_screenshot` | `export_shape` / visual agent | **renderer exists; connector primitive missing** |

### 13.6 Efficiency conclusion

For this exact workflow, INK should **not** replace its current decomposition with Figma or Penpot.

Instead:

```text
borrow Figma/Penpot connector grammar
+
keep INK's existing decomposition engine
```

Target:

```text
CHAT
→ use_ink
→ ink.reference.import(...)
→ ink.reference.decompose(...)
→ native receipt
→ ink.getScreenshot(...)
→ CHAT inspects result
→ native bounded edits
```

This removes the previous need to teach CHAT each decomposition/edit step as a separate bespoke integration.

### 13.7 Standard TraceBundle

To make the workflow portable and benchmarkable, define one editor-neutral decomposition result:

```text
TraceBundle
{
  source
  sourceTransform
  palette[]
  colorPaths[]
  linePaths[]
  diagnostics
  extractionParameters
}
```

Adapters:

```text
TraceBundle → Figma native vectors
TraceBundle → Penpot native shapes
TraceBundle → INK native Paths
```

INK remains the production authority; Figma and Penpot can be used as comparison/benchmark hosts.

### 13.8 Recommended INK closed-loop command grammar

```text
ink.reference.import(file)

ink.reference.decompose(referenceId, {
  mode: "color-regions",
  numberOfColors,
  lineStroke,
  lineStrokeWidth
})

→ returns:
{
  referenceObjectId,
  colorLayerId,
  lineLayerId,
  colorObjectIds,
  lineObjectIds,
  palette,
  diagnostics,
  operationReceipt
}

ink.getScreenshot({
  layerIds: [referenceLayerId, colorLayerId, lineLayerId]
})

CHAT visual inspection

ink.path.repaint(...)
ink.path.edit(...)
ink.history.undo()
ink.history.redo()
ink.revision.capture(...)
```

### 13.9 Revised validation strategy

Do not resume with isolated Phase C/D/E feature tests as the primary user-facing path.

Resume only after `use_ink` + screenshot feedback exists, then validate the whole workflow:

```text
USER uploads real reference
→ CHAT imports
→ CHAT decomposes
→ CHAT receives stable Color/Line IDs
→ CHAT gets screenshot
→ CHAT visually identifies one required correction
→ CHAT performs native INK edit
→ screenshot again
→ History/Undo/Redo
→ optional Revision capture
→ final editable artwork
```

This becomes the canonical creative-loop acceptance workflow.

Target gate:

`REFERENCE_TO_COLOR_LINE_TO_CHAT_CLOSED_LOOP`
