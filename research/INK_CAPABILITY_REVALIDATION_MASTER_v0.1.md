# INK Capability Revalidation Master v0.1

STATUS: `MR_REVALIDATION / NO_IMPLEMENTATION_AUTHORIZATION`

BASELINE_MAIN: `c5725b817deaac686d076561de9e1d5ad97255f6`

Purpose: revalidate all previously decided INK capability directions against two separate questions:

1. Is this an operation model CHAT already knows from mature external creative connectors/tools?
2. Is this capability actually needed for INK to mature as a serious drawing / creative platform?

This file does not authorize implementation. It prevents old research, deferred work, implementation and promotion state from being conflated.

## Classification

External familiarity:

- `DIRECT` — current CHAT has an analogous direct Figma and/or Adobe connector capability.
- `REFERENCE` — documented mature Penpot MCP/Plugin API or mature editor operation pattern, but not a currently installed direct Penpot ChatGPT connector.
- `INK_NATIVE` — primarily an INK-specific AI/core capability, not meaningfully copied from those connectors.

Platform value:

- `CORE` — expected of a mature drawing/vector/creative editor.
- `AI_CORE` — specifically core to INK's USER + CHAT collaborative product.
- `ADVANCED` — valuable mature-platform capability but not required for the minimum drawing core.
- `OUTSIDE` — familiar elsewhere but not required for the present INK drawing-platform direction.

## A. Original Connector Capability Map — all 40 operation families

| # | Capability family | External familiarity | Platform value | Revalidation |
|---:|---|---|---|---|
| 1 | Current document/file context | DIRECT | CORE | KEEP |
| 2 | Stable node/object identity | DIRECT | CORE | KEEP |
| 3 | Selection | DIRECT | CORE | KEEP |
| 4 | Query hierarchy | DIRECT | CORE | KEEP |
| 5 | Screenshot/render check | DIRECT | AI_CORE | KEEP |
| 6 | Frame/container | DIRECT | CORE | KEEP |
| 7 | Group | DIRECT | CORE | KEEP |
| 8 | Path/vector | DIRECT | CORE | KEEP |
| 9 | Rectangle/Ellipse primitives | DIRECT | CORE | KEEP |
| 10 | Text | DIRECT | CORE | KEEP |
| 11 | Raster/image reference | DIRECT | CORE | KEEP |
| 12 | SVG import | REFERENCE | CORE | KEEP |
| 13 | Fill/stroke/opacity | DIRECT | CORE | KEEP |
| 14 | Material/expressive stroke | DIRECT | CORE | KEEP |
| 15 | Translate | DIRECT | CORE | KEEP |
| 16 | Resize/rotate/scale | DIRECT | CORE | KEEP |
| 17 | Z-order/reorder | DIRECT | CORE | KEEP |
| 18 | Path edit | DIRECT | CORE | KEEP |
| 19 | Simplify/refine | REFERENCE | CORE | KEEP |
| 20 | Boolean geometry | DIRECT | CORE | KEEP |
| 21 | Repeat / parametric | REFERENCE | ADVANCED | KEEP — INK differentiator |
| 22 | Auto/Flex layout | DIRECT | ADVANCED | KEEP |
| 23 | Grid layout | REFERENCE | ADVANCED | KEEP DEFERRED |
| 24 | Constraints/fill/hug | DIRECT | ADVANCED | KEEP |
| 25 | Components | DIRECT | ADVANCED | KEEP |
| 26 | Component overrides | DIRECT | ADVANCED | KEEP |
| 27 | Variants | DIRECT | ADVANCED | DEFER — not drawing-core requirement |
| 28 | Variables/tokens | DIRECT | ADVANCED | DEFER — activate only when library/system need is real |
| 29 | Styles/library reuse | DIRECT | ADVANCED | KEEP |
| 30 | History/Undo/Redo | REFERENCE | CORE | KEEP |
| 31 | Revision/version | REFERENCE | AI_CORE | KEEP |
| 32 | Compare | REFERENCE | AI_CORE | KEEP |
| 33 | Prototype interactions | REFERENCE | OUTSIDE | RETIRE FROM CURRENT DRAWING PLAN |
| 34 | Asset export | DIRECT | CORE | KEEP |
| 35 | Design → code | DIRECT | OUTSIDE | RETIRE FROM CURRENT DRAWING PLAN |
| 36 | Code/live UI → design | DIRECT | OUTSIDE | OPTIONAL SEPARATE INTEGRATION |
| 37 | Design-system search / Creative Library Search | DIRECT | ADVANCED / AI_CORE | KEEP — unresolved planned Connector-005 |
| 38 | Semantic grounding | INK_NATIVE | AI_CORE | KEEP |
| 39 | Reference decomposition / vectorization | DIRECT | AI_CORE | KEEP |
| 40 | Creative Memory / Research | INK_NATIVE | AI_CORE | KEEP |

Operation provenance is the 41st table entry in the original research but is an invariant rather than an operation family:

| Invariant | External familiarity | Platform value | Revalidation |
|---|---|---|---|
| Operation provenance | INK_NATIVE | AI_CORE | KEEP / REQUIRED |

## B. External familiarity is real, but not identical across sources

Current CHAT environment directly exposes:

```text
Figma tools = 41
Adobe tools = 79
```

Direct Figma examples include:

- get_screenshot
- get_design_context
- get_metadata
- use_figma
- get_libraries
- search_design_system
- create_new_file
- upload_assets / download_assets
- Code Connect tools

Direct Adobe examples include:

- asset upload/search/preview/handle flows
- image selection and deterministic edits
- vectorization
- vector/document rendering
- template/design search and fill/replace workflows
- fonts
- output/download flows

Penpot remains a research/reference source rather than a currently installed direct ChatGPT connector in this project context. Its official MCP/Plugin API still provides a mature reference for object creation, grouping, transforms, flex/grid, components, tokens, export and events.

Therefore `DIRECT` and `REFERENCE` must never be conflated.

## C. Previously decided mature-editor capabilities not fully represented by the 40-family Connector table

These came from the Penpot architecture gap audit and the later workstation/core program.

| Capability | External familiarity | Platform value | Current revalidation |
|---|---|---|---|
| Align / distribute | DIRECT/REFERENCE | CORE | KEEP |
| Persistent rulers / guides | REFERENCE | CORE | KEEP |
| Smart snapping / equal-distance snapping | REFERENCE | CORE | KEEP |
| Transform preview → commit interaction | REFERENCE | CORE | KEEP |
| Richer typography / visual effects | DIRECT | CORE/ADVANCED | KEEP, incremental |
| Editor overlay architecture | INK_NATIVE / mature-editor pattern | CORE | KEEP |
| Local storage / recovery | INK_NATIVE | CORE | KEEP |
| Render / viewport / artwork-vs-editor-overlay separation | INK_NATIVE / mature-editor pattern | CORE | KEEP |
| Geometry/snap worker/index scaling | REFERENCE | ADVANCED | KEEP CONDITIONAL — profiling driven |
| Cloud file/revision/media adapter | DIRECT/REFERENCE | ADVANCED | KEEP only for cloud delivery need |
| Stylus / natural-media input and rendering | INK_NATIVE / Adobe-class creative domain | CORE for drawing platform | KEEP |
| Portable/Web shared-core integrity | INK_NATIVE | CORE product-quality invariant | KEEP |

Important status evolution:

- Frame + Nested Hierarchy was later implemented.
- Component / Instance data model was later implemented.
- FrameLayout / LayoutItem / constraints foundations were later implemented.
- These must not remain described as historical `ADD` gaps merely because the first Penpot audit predates the implementation.

## D. AI Drawing Studio technical targets — revalidated

The eight Phase-1 technical targets remain valid, but not because they are all copied from external plugins.

| Target | External familiarity | Platform value | Revalidation |
|---|---|---|---|
| Vector Geometry Kernel | REFERENCE / mature vector math | CORE | KEEP |
| AI Document Bridge | INK_NATIVE | AI_CORE | KEEP |
| Revision / Provenance | REFERENCE + INK_NATIVE | AI_CORE | KEEP |
| Semantic Region / Selection Grounding | INK_NATIVE | AI_CORE | KEEP |
| Visual Compare / Variant | REFERENCE | AI_CORE | KEEP |
| Parametric Creative Structure | REFERENCE | ADVANCED / AI_CORE | KEEP |
| Style / Method / Creative Memory | INK_NATIVE | AI_CORE | KEEP |
| Research → Creation Bridge | INK_NATIVE | AI_CORE | KEEP |

The original Phase-1 completion record for these targets remains valid at its stated bounded scope.

## E. Explicitly non-mandatory / deferred capabilities

The following must not be resurrected as mandatory merely because Figma/Penpot/Adobe have analogous features:

| Capability | Why not mandatory now |
|---|---|
| Prototype interactions | product is a drawing/creative workstation, not currently a prototyping app |
| Design → code | useful Figma workflow, not required for mature drawing |
| Code/live UI → design | optional integration, not drawing core |
| CRDT / multiplayer | explicitly outside single-user + CHAT Phase-1 |
| shared cursors / realtime presence | team collaboration feature, not drawing-core requirement |
| team administration | platform SaaS concern |
| mandatory backend services | contradicts browser-local/shared-core rule |
| mandatory hosted AI | contradicts optional adapter rule |
| full general constraint solver | speculative beyond accepted layout needs |
| autonomous recursive agents | not required and violates bounded-control direction |
| automatic approval/execution | explicitly prohibited by collaboration model |
| automatic Research fetch/scrape | not core; evidence should remain explicit |
| automatic Creative Memory writes | not required; explicit promotion boundary retained |

## F. Current unresolved items after revalidation

### 1. Geometry Ops integration debt

Already implemented on `work/ink-chat-geometry-ops-001`, not Runtime accepted/promoted:

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

Revalidation:

```text
external mature-operation match = YES
mature INK platform value       = YES
implementation exists           = YES
promotion exists                = NO
disposition                     = RECONCILE / VERIFY / PROMOTE if current-main QA passes
```

### 2. Connector-005 Creative Library Search

Original staged connector work, never explicitly cancelled:

```text
components
materials
recipes
parametric structures
reference-derived structures
future tokens/styles
```

Revalidation:

```text
external mature-operation match = YES
  Figma get_libraries / search_design_system
  Adobe reusable template/design search pattern

mature INK platform value = YES, especially for USER + CHAT reuse
status                    = UNRESOLVED PLANNED WORK
```

### 3. Other mature capabilities whose Core exists but CHAT exposure is incomplete

The following should remain visible as exposure/closure candidates, not silently assumed complete:

- Frame/container operations;
- Group/hierarchy operations beyond the already coded Geometry Ops subset;
- Path/vector creation and editing;
- primitive creation;
- Text operation surface;
- SVG import operation surface;
- full resize/rotate/scale;
- z-order/reorder;
- Boolean;
- Repeat mirror/grid/expand beyond radial;
- Auto/Flex layout;
- constraints/fill/hug;
- Components/Instances;
- Component overrides;
- styles/library reuse;
- asset export completion.

This list does not mean “implement everything now.” Each item must be reconciled against the existing Core and exposed only through existing authoritative operations.

## G. Final decision rule

A capability should stay in the INK roadmap when either of these is true:

```text
A. mature external connector/editor operation
   + materially useful to INK's actual creative workflow

OR

B. required for a mature drawing/creative platform
   even if it is not an external CHAT-plugin operation

OR

C. required specifically for the USER + CHAT collaborative model
```

A capability should not be built merely because Figma, Penpot or Adobe has it.

A capability should also not be removed merely because CHAT does not already know it from another tool.

The original research direction therefore stands, but with explicit scope filtering and durable closure tracking.
