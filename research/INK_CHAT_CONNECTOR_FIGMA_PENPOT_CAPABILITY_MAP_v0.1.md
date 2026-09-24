# INK CHAT Connector — Figma / Penpot / Adobe Capability Map v0.1

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


## User questions that initiated this connector direction

### Question set 1 — make INK connect like Figma / Penpot

User request:

> 將 INK 的連接方式設計得和 Figma 一樣，搜尋並規畫把 INK 加入 CHAT 最熟練的操作方式，盡量省略從頭調校的時間；利用 Figma 或 Penpot 已成熟的工作流，列出 CHAT 已熟悉的 Figma / Penpot 功能與操作方式，並與 INK 相同能力並列，讓 CHAT 能無縫接軌快速熟練 INK。

Analysis retained from the discussion:

- Do not teach CHAT a third bespoke editor language if the same design concepts already exist in Figma / Penpot.
- Reuse the mature mental model:
  `File / Page / Object / Frame / Path / Component / Instance / Layout / History`.
- Copy the **connector grammar**, not the Figma UI.
- Figma's general execution pattern is `use_figma → Plugin API`.
- Penpot's general execution pattern is `execute_code → Plugin API`.
- INK should expose one equivalent stable execution surface:
  `use_ink → INK Public Creative API`.
- Existing INK controllers must remain authoritative. The connector must not become a second Document, History, Revision, Geometry, or drawing engine.
- The biggest productivity gain will come from:
  inspect → stable IDs → reuse native modules → edit → return IDs → screenshot → targeted correction.
- A later searchable INK Creative Library should expose components, materials, recipes, parametric structures and future tokens so CHAT can compose mature work rather than rebuild everything from primitives.

### Question set 2 — rebuild the Reference → Color + Line → CHAT loop using mature workflows

User request:

> 針對原本要進行的「參考圖拆解輪廓與顏色分圖層，並回到 CHAT 的閉環測試」，列出如果用 Figma 與 Penpot 會如何作業完成，再對照 INK 的功能組合，建立成一個工作流，判斷是否更有效率。

Analysis retained from the discussion:

- Define the workflow independently of any editor:
  Reference → color-region vectorization → Color Paths → same-geometry Line boundaries → separate Reference / Color / Line structure → stable IDs → CHAT structural + visual readback → native corrections → History / Revision / provenance.
- Figma is a mature host for the resulting editable vectors, but fully agent-controlled decomposition should not depend on its separate AI Vectorize UI command.
- Penpot is also a mature host through `execute_code` and native Path/SVG objects, but its documented MCP/Plugin API does not supply a dedicated deterministic raster-vectorization primitive.
- INK already owns the specialized decomposition that both hosts otherwise need externally:
  bounded raster → ImageTracerJS color-regions → Color Paths → duplicate geometry as Line Paths → History + receipt + provenance.
- Therefore **do not replace or redo Phase B decomposition**.
- Borrow Figma/Penpot's agent-operation grammar and keep INK's decomposition engine.
- The missing closed-loop pieces are primarily:
  `use_ink` + connector metadata/query + visual screenshot feedback.
- Resume creative validation only when CHAT can execute the whole user-facing loop rather than isolated one-command tests.

### Combined design decision

```text
KEEP:
  INK Reference decomposition
  INK Document / Path / Geometry
  INK History / Revision / Provenance
  INK Grounding / Research / Memory

BORROW:
  Figma / Penpot agent workflow grammar
  inspect-first operation
  stable node IDs
  general programmable execution
  structure + screenshot feedback
  reusable design-library discovery

BUILD:
  INK Public Creative API
  → use_ink
  → get_ink_metadata / get_ink_screenshot
  → INK Skill
  → Creative Library Search
```

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


---

## 14. Concrete INK source connection map for development

Connector-001 must connect to the following existing product authorities.

| Public facade family | Existing INK source/authority | Current app surface | Connector rule |
|---|---|---|---|
| Document / selection / inspect | `src/ai/document-bridge.js` | app document + selection | return JSON-safe grounded summaries only |
| Reference import/decompose | `src/ai/chat-reference-handoff.js` + extraction | `app.chatReferenceHandoff` | delegate; preserve existing receipt/audit/provenance |
| Bounded edits | `src/editor/chat-bounded-edit.js` | `app.chatBoundedEditAdapter` | expose inspect/propose/approve/execute only |
| Repaint/material | `src/editor/repaint-material.js` | reached through bounded edit | do not bypass with a second direct mutation route |
| History | `src/history/history.js` | `app.history` | inspect/undo/redo on existing manager |
| Revision | `src/document/revision.js` | `app.revisions` | list/capture/restore/current on existing controller |
| Install point | `src/ink.js` `InkApp` constructor | existing app initialization | install exactly one facade after required authorities exist |

Current install facts:

```text
installChatReferenceHandoff(this)
→ app.chatReferenceHandoff

installChatBoundedEdit(this)
→ app.chatBoundedEdit
→ app.chatBoundedEditAdapter

installRevision(this)
→ app.revisions

HistoryManager
→ app.history
```

Connector-001 target:

```text
existing authorities
→ installInkPublicCreativeApi(app)
→ app.inkPublicApi
```

Do not create a new unrestricted `window` global in Connector-001.
External exposure belongs to the later `use_ink` / MCP transport stage.

### Development order

```text
1. define deterministic capability registry
2. add read-only context / selection / inspect facade
3. delegate reference decomposition
4. delegate bounded edit proposal / approval / execution
5. delegate History inspect / undo / redo
6. delegate Revision current / list / capture / restore
7. install one facade in InkApp
8. focused unit/static regression
9. DEV_HANDOFF → STOP
```

The facade is considered correct only if every mutation still passes through the same controller that the existing INK product already trusts.


---

## 15. Adobe for ChatGPT — third mature connector reference

### 15.1 Why Adobe changes the INK connector plan

Adobe's current ChatGPT integration is not primarily a generic editable-canvas scripting API like Figma `use_figma` or Penpot `execute_code`.

Its mature pattern is:

```text
CHAT intent
→ capability/tool routing
→ asset handle / URL
→ specialized Adobe operation
→ structured result / output asset
→ model inline preview
→ targeted follow-up operation
→ final preview / export / open in Adobe app
```

The installed Adobe connector in this CHAT session exposes more than 70 specialized tools across asset handling, Photoshop/Lightroom-style image operations, Illustrator vectorization/export, Adobe Express design templates, Acrobat, InDesign, Premiere/video, Fonts, Stock and Firefly.

Official Adobe documentation also describes the unified Adobe plugin for ChatGPT as replacing the older Photoshop-only plugin and combining Photoshop, Premiere, Firefly, Express, Acrobat and other Adobe capabilities under one connector.

This gives INK a second connector pattern worth borrowing:

```text
Figma / Penpot lesson
= generic programmable native-object access

Adobe lesson
= high-level capability routing + asset/result handles + visual verification
```

INK should combine both.

### 15.2 CHAT-visible Adobe capability families relevant to INK

#### Asset / project input

```text
asset_openai_file_upload
asset_add_file
asset_search
asset_get_presigned_urls
```

Pattern:

```text
user/chat asset
→ stable Adobe asset identity / presigned URL
→ processing tool
```

INK lesson:

Do not make every connector call depend on raw bytes or live DOM references.
Use stable INK document/object/reference identities and JSON-safe result handles.

#### Model-side visual inspection

```text
asset_inline_preview
```

Adobe explicitly separates:

```text
preview for CHAT/model inspection
≠
preview shown only to user
```

This is important for INK.

Target distinction:

```text
get_ink_preview
= visual evidence returned to CHAT for reasoning

user-facing canvas
= normal INK renderer/workstation
```

#### User-facing result preview

```text
asset_preview_file
```

INK equivalent should later allow the connector to surface the exact rendered result/thumbnail without inventing a second renderer.

#### Region / object targeting

Adobe provides:

```text
image_select_subject
image_select_by_prompt
image_invert_selection
```

and then routes the returned mask into another operation.

Pattern:

```text
identify target
→ produce explicit target artifact/mask
→ apply operation to that target
```

INK already has stronger native object identity for vector/editable work plus Semantic Region Grounding.

INK lesson:

```text
natural-language target
→ grounded stable object IDs / semantic region IDs
→ explicit operation
```

Do not let a natural-language edit mutate an unidentified region directly.

#### Deterministic image operations

Installed Adobe tools include:

```text
image_apply_adjustments
image_apply_auto_tone
image_apply_preset
image_crop_and_resize
image_crop_to_bounds
image_remove_background
image_fill_area
image_apply_gaussian_blur
image_apply_color_overlay
image_apply_monochromatic_tint
image_add_grain
image_add_noise
...
```

Adobe routing guidance explicitly prefers dedicated non-generative operations when they can satisfy the request.

INK lesson:

Prefer a named authoritative INK capability over arbitrary execution whenever one exists.

Example:

```text
request = repaint this path

preferred:
ink tool → path.repaint.v1

not preferred:
arbitrary use_ink script that rewrites appearance fields
```

#### Vectorization / Illustrator bridge

```text
image_vectorize
```

converts PNG/JPEG to SVG editable vector paths.

```text
document_render_vector
```

renders/exports Illustrator files to raster/vector formats.

This confirms that CHAT already uses a mature concept:

```text
raster input
→ vector conversion
→ editable vector asset
→ output/preview
```

However the current Adobe connector tool surface does **not** expose a generic Illustrator layer/node API equivalent to Figma SceneNode or Penpot Shape operations.

Therefore Adobe is not currently the strongest host for arbitrary post-vectorization layer graph manipulation from CHAT.

#### Adobe Express mature-output workflow

The installed Adobe Express workflow is:

```text
search_design
→ user chooses template
→ fill_text / replace_image / change_background_color / animate
→ preview
→ download_design / open in Express
```

Important lesson:

Mature results are accelerated by starting from reusable templates rather than rebuilding visual design from primitives.

This reinforces the planned INK Creative Library Search:

```text
components
materials
recipes
parametric structures
templates/compositions
future tokens/styles
```

### 15.3 Adobe closed loop for the Reference → Color + Line problem

The exact INK target remains:

```text
Reference
→ editable Color regions
→ editable Line boundaries
→ separate native layers
→ CHAT inspection
→ targeted correction
→ preview
→ History / Revision / provenance
```

#### Adobe-native route that is available now

```text
1. CHAT stages or finds the reference asset
   asset_openai_file_upload / asset_search

2. CHAT visually inspects source
   asset_inline_preview

3. Raster → vector
   image_vectorize
   → editable SVG asset

4. CHAT can preview the vectorized result
   asset_inline_preview / asset_preview_file

5. CHAT can perform separate raster-oriented targeted edits
   select_subject / select_by_prompt
   → mask
   → adjustment/effect/fill
   → preview again

6. Vector/Illustrator result can be rendered/exported
   document_render_vector where an Illustrator document is available
```

#### Current Adobe limitation for this exact INK workflow

The current Adobe ChatGPT tool surface does not expose a generic Illustrator vector-node/layer editing interface that lets CHAT deterministically:

```text
take vectorized SVG
→ enumerate every color-region path
→ create a Color layer
→ duplicate the exact same path geometry
→ remove fill
→ assign Line stroke
→ preserve one-to-one path IDs
→ continue arbitrary node-level editing
```

Adobe's selection/mask workflow is useful for targeted **raster** operations, but a mask is not equivalent to INK's editable native Color/Line Path structure.

Therefore:

```text
Adobe image_vectorize
= excellent reference for raster → vector asset conversion

INK Phase B decomposition
= better fit for deterministic Color + Line editable-layer production
```

Do not replace the accepted INK decomposition with Adobe vectorization.

### 15.4 What to borrow from Adobe for the INK closed loop

Add these workflow rules:

```text
A. capability router
   choose the narrowest authoritative tool first

B. explicit target handle
   object IDs / region IDs / reference IDs before mutation

C. asset/result envelope
   each operation returns identity + result metadata + receipt

D. visual inspection channel
   CHAT gets an actual rendered preview, not only structural metadata

E. verify after subjective/creative operations
   before/after preview when interpretation matters

F. reusable-template/library first
   reuse mature structures instead of reconstructing every work from primitives

G. native-app authority
   high-level connector never becomes a second editor engine
```

---

## 16. Revised combined connector architecture — Figma + Penpot + Adobe

### 16.1 Two complementary operation layers

The previous plan centered too heavily on `use_ink`.

Revised architecture:

```text
USER / CHAT intent
        ↓
INK Skill / Capability Router
        ↓
 ┌──────────────────────────────┐
 │ Layer A — INK Named Tools    │  ← Adobe pattern
 │ narrow, reliable workflows   │
 └──────────────────────────────┘
        ↓ when sufficient

 OR

        ↓ when composition/general access is required
 ┌──────────────────────────────┐
 │ Layer B — use_ink            │  ← Figma/Penpot pattern
 │ programmable native objects  │
 └──────────────────────────────┘
        ↓
INK Public Creative API
        ↓
existing INK authorities
        ↓
Document / Path / Layout / Components
Reference / History / Revision / Grounding
        ↓
INK Renderer
        ↓
get_ink_preview
        ↓
CHAT visual verification
```

### 16.2 Layer A — Adobe-style named INK tools

Initial named tool vocabulary:

```text
get_ink_capabilities
get_ink_context
get_ink_selection
inspect_ink_objects

import_ink_reference
decompose_ink_reference

propose_ink_edit
approve_ink_edit
execute_ink_edit

get_ink_history
undo_ink
redo_ink

get_ink_revisions
capture_ink_revision
restore_ink_revision

get_ink_preview
export_ink_asset
```

Later high-value tools:

```text
ground_ink_target
search_ink_creative_library
apply_ink_material
resolve_ink_parametric_structure
compare_ink_revision
```

These tools are not separate engines. They are stable high-level wrappers over the same Public Creative API.

### 16.3 Layer B — Figma/Penpot-style `use_ink`

Use only when:

- a multi-object composition needs several native operations;
- a named tool does not cover the task;
- CHAT needs a general inspect/create/compose script;
- a reusable Skill explicitly calls for a coherent batch.

Hard rule:

```text
If a named authoritative tool exists,
use_ink must call that Public API method,
not bypass it by mutating document fields.
```

### 16.4 Shared result envelope

Borrowing Adobe's asset/result pattern, every public connector operation should converge on one JSON-safe envelope:

```text
INK_AGENT_RESULT
{
  schema
  version
  action
  status

  documentId
  pageId
  revisionId

  targetRefs[]
  createdRefs[]
  changedRefs[]

  historyReceipt
  revisionReceipt
  provenanceReceipt

  outputHandles[]
  diagnostics[]
}
```

No live mutable object references.

For visual operations, later add:

```text
previewHandle
renderFingerprint
bounds
mimeType
```

### 16.5 Capability routing rule

CHAT Skill logic:

```text
1. inspect capability registry
2. resolve target IDs/regions
3. choose narrow named tool if available
4. otherwise use_ink for native composition
5. preserve proposal/approval boundary where required
6. obtain structural result receipt
7. obtain preview when visual interpretation matters
8. inspect preview
9. apply bounded correction
10. capture Revision only when explicitly appropriate
```

### 16.6 Revised connector development order

```text
Connector-001
Public Creative API
+ capability registry
+ normalized INK_AGENT_RESULT
+ named-tool facade foundation

Connector-002
Visual feedback
get_ink_preview + metadata/render fingerprint

Connector-003
use_ink programmable execution bridge

Connector-004
INK Skill / capability router
Figma + Penpot + Adobe workflow grammar

Connector-005
Creative Library Search
components / materials / recipes / structures / templates

Connector-006
Full creative closed loop
Reference → Color + Line → CHAT → correction → preview → Revision
```

The main change from the previous plan is:

```text
visual feedback moves before arbitrary use_ink
and
named workflow tools become first-class
```

Reason:

Adobe demonstrates that CHAT can complete many creative tasks more reliably through a small number of well-defined operations plus before/after visual verification, without exposing the entire application's internal object model for every action.

---

## 17. Adobe-informed connection-point acceptance principle

INK will be considered well connected to CHAT only when both styles work:

### Style 1 — short reliable command

```text
"把這張參考圖拆成 Color + Line"
→ decompose_ink_reference
→ result receipt
→ get_ink_preview
→ CHAT verifies
```

### Style 2 — complex native composition

```text
"把這三組 Path 做成放射重複，
再把第二組移到最上層並改材質"
→ use_ink
→ Public Creative API
→ existing Repeat / order / material authorities
→ result receipt
→ get_ink_preview
→ CHAT verifies
```

Target:

`CHAT_CAN_ROUTE_AND_OPERATE_INK_LIKE_A_MATURE_CREATIVE_CONNECTOR`


---

## 18. 2026-09-24 implementation checkpoint

This research baseline has now been partially realized in product code.

```text
Connector-001 = CLOSED / Public Creative API + named-tool foundation + INK_AGENT_RESULT
Connector-002 = CLOSED / visual preview + output-handle feedback
Connector-003 = CLOSED / capability descriptor + schema discovery
Connector-004 = CLOSED / use_ink programmable proposal → approval → execution bridge
```

The following original connector goals are therefore established at foundation level:

```text
CHAT can discover INK capabilities
CHAT can inspect document/selection/objects
CHAT can route through named tools
CHAT can receive structured results and output handles
CHAT can obtain bounded visual preview evidence
CHAT can invoke use_ink through existing Plan authority
CHAT writes remain governed by approval, History and Revision
```

The accepted `use_ink` v0.1 operation vocabulary remains intentionally narrow:

```text
path.repaint.v1
path.material.apply.v1
path.material.remove.v1
object.translate.v1
path.simplify.v1
path.refine.v1
```

Existing INK capabilities still reserved for later bounded native-operation exposure include, among others:

```text
Path geometry edit / creation where separately authorized
Boolean geometry
Repeat / parametric composition
Group / hierarchy operations
Frame operations
Component / Instance operations
Layout / constraints operations
additional transform / ordering / creation operations
```

Important distinction:

```text
connector foundation = completed through Connector-004
full native operation vocabulary = not completed
Creative Library Search = not completed
external transport = not implemented
canonical Reference → Color + Line → CHAT → correction → preview → Revision acceptance = still to be resumed as a whole-loop validation
```

This preserves the original project intent: finish the familiar CHAT-facing operating grammar first, then expose more native INK capabilities through that already-accepted grammar instead of inventing another interface.
