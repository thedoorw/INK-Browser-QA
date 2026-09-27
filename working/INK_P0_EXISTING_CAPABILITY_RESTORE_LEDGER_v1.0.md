# INK P0 Restore All — Capability Ledger

TASK: `INK-P0-RESTORE-ALL-001`  
BASELINE: `b68a0a9fe1e0e65e30f6f2a691e8b60b15186c46`  
GATE: `PRE-RUNTIME / MR_REVIEW_REQUIRED`

This ledger maps **all 61 Section 4 rows in their original order**. `src/` below means `product/source/src/`. The source column identifies an existing native authority, not a claim of browser verification. QA paths without a prefix are historical tests under `qa/core/tests/unit/`; `qa/` paths are repository-root relative.

History key: `M` = document mutation is routed through native History at its existing scope; `R` = read-only or presentation state; `T` = transient device/canvas state, with persisted report/profile mutations using History. Save/load key: `D` = native `.ink` document via migration/storage; `L` = local profile/store or transient state by design; `O` = derived output from saved document. `P` = preserved source and native entry point; `F` = restored/reconciled in this branch. Static source mapping is not integrated Runtime evidence.

| # | Section 4 capability | Native source authority (`src/`) | Disposition / change | History | Save/load | Focused QA pointer | Remaining existing loss |
|---:|---|---|---|:---:|:---:|---|---|
| 01 | Document / project | `document/model.js`, `document/migration.js`, `document/integrity.js`, `document/storage.js` | P — existing authority retained | M | D | `document.test.mjs`, `storage.test.mjs` | 0 identified |
| 02 | Pages | `ink.js`, `document/model.js` | P — existing authority retained | M | D | `document.test.mjs` | 0 identified |
| 03 | Layers | `ink.js`, `document/model.js` | P — existing authority retained | M | D | `document.test.mjs` | 0 identified |
| 04 | Creation/Layout workspaces | `ink.js`, `document/workspace.js` | P — existing authority retained | M | D | `layout-persistence-contract-v0.1.test.mjs` | 0 identified |
| 05 | Artboard / print | `ink.js`, `document/artboard.js`, `export/pdf.js` | P — existing authority retained | M | D | `document.test.mjs` | 0 identified |
| 06 | Canvas navigation | `ink.js`, `document/workspace.js` | P — existing authority retained | T | D | `frame-regression-v0.1.test.mjs` | 0 identified |
| 07 | Selection | `ink.js`, `editor/selection.js` | P — existing authority retained | M | D | `frame-regression-v0.1.test.mjs` | 0 identified |
| 08 | Smart guides / snapping | `ink.js`, `editor/transform.js` | P — existing authority retained | M | D | `frame-regression-v0.1.test.mjs` | 0 identified |
| 09 | Align / distribute | `ink.js` | P — existing authority retained | M | D | `frame-regression-v0.1.test.mjs` | 0 identified |
| 10 | Pen / vector Path | `editor/path-edit.js`, `vector/vector-core.js` | P — existing authority retained | M | D | `path-editing-core-v0.1.test.mjs` | 0 identified |
| 11 | Shapes | `ink.js`, `vector/vector-core.js` | P — existing authority retained | M | D | `core.test.mjs` | 0 identified |
| 12 | Boolean | `vector/vector-core.js`, `studio-core.js` | P — existing authority retained | M | D | `studio-core-v090.test.mjs` | 0 identified |
| 13 | Transform | `ink.js`, `editor/transform.js` | P — existing authority retained | M | D | `frame-regression-v0.1.test.mjs` | 0 identified |
| 14 | Non-destructive deformation | `vector/deformation.js`, `editor/transform.js` | P — existing authority retained | M | D | `vector-geometry-kernel-v0.1.test.mjs` | 0 identified |
| 15 | Group / ungroup | `ink.js`, `editor/composition.js` | P — existing authority retained | M | D | `frame-regression-v0.1.test.mjs` | 0 identified |
| 16 | Frame / hierarchy | `ink.js`, `document/hierarchy.js` | P — existing authority retained | M | D | `frame-hierarchy-v0.1.test.mjs` | 0 identified |
| 17 | Repeat / parametric | `vector/vector-core.js`, `repeat/repeat-identity.js` | P — existing authority retained | M | D | `studio-core-v090.test.mjs` | 0 identified |
| 18 | Components | `studio-core.js`, `document/components.js` | P — existing authority retained | M | D | `component-instance-v0.1.test.mjs` | 0 identified |
| 19 | Auto/Flex layout | `editor/creative-workspace.js`, `document/layout.js` | P — existing authority retained | M | D | `layout-persistence-contract-v0.1.test.mjs` | 0 identified |
| 20 | Text | `ink.js`, `editor/text-object.js` | P — existing authority retained | M | D | `document.test.mjs` | 0 identified |
| 21 | SVG | `vector/vector-core.js`, `studio-core.js` | P — existing authority retained | M | D | `studio-core-v090.test.mjs` | 0 identified |
| 22 | Raster / Image objects | `ink.js`, `image/image-core.js` | P — existing authority retained | M | D | `studio-core-v090.test.mjs` | 0 identified |
| 23 | Raster/vector masks | `image/image-core.js`, `studio-core.js` | F — raster/vector mask render path and History | M | D | `ink-p0-restore-all-001-focused.test.mjs` | 0 identified |
| 24 | Adjustment stack | `image/image-core.js`, `studio-core.js` | F — adjustment History and cache | M | D | `ink-p0-restore-all-001-focused.test.mjs` | 0 identified |
| 25 | Filter stack | `image/image-core.js`, `studio-core.js` | F — filter History, ordering and cache | M | D | `ink-p0-restore-all-001-focused.test.mjs` | 0 identified |
| 26 | Blend modes | `image/image-core.js`, `ink.js`, `studio-core.js` | F — declared blend modes in render/pixel paths | M | D | `ink-p0-restore-all-001-focused.test.mjs` | 0 identified |
| 27 | Layer effects | `image/image-core.js`, `studio-core.js` | F — existing color overlay render path; other effects historically partial | M | D | `ink-p0-restore-all-001-focused.test.mjs` | 0 identified |
| 28 | Reusable raster source | `image/image-core.js`, `document/model.js` | P — existing authority retained | M | D | `pro-creative-core-v100.test.mjs` | 0 identified |
| 29 | Drawing tools | `ink.js`, `paint/brush-engine.js` | P — existing authority retained | M | D | `professional-drawing-v140.test.mjs` | 0 identified |
| 30 | Brush engine | `paint/brush-engine.js`, `studio-core.js` | F — brush package import/reload through studio authority | M | D | `professional-drawing-v140.test.mjs` | 0 identified |
| 31 | Natural media | `paint/brush-engine.js`, `render/natural-media-controller.js` | P — existing authority retained | M | D | `natural-media.test.mjs` | 0 identified |
| 32 | Brush dynamics | `paint/brush-engine.js`, `paint/stroke-model.js` | P — existing authority retained | M | D | `hand-drawing-v130.test.mjs` | 0 identified |
| 33 | Blender / Smudge | `paint/brush-engine.js`, `paint/stroke-session.js` | P — existing authority retained | M | D | `hand-drawing-v130.test.mjs` | 0 identified |
| 34 | Stroke editing | `stroke/edit.js`, `ink.js` | P — existing authority retained | M | D | `stroke.test.mjs` | 0 identified |
| 35 | Stroke Session | `paint/stroke-session.js`, `studio-core.js` | F — Stroke Session History | M | D | `hand-drawing-v130.test.mjs` | 0 identified |
| 36 | Stylus | `ink.js`, `input/input-arbiter.js`, `input/stylus-test.js` | P — existing authority retained | T | L | `input.test.mjs` | 0 identified |
| 37 | Device calibration | `input/pen-calibration.js`, `input/device-validation.js` | F — calibration embed History | T | L | `input.test.mjs` | 0 identified |
| 38 | Paper / media | `render/paper-profile.js`, `document/model.js` | P — existing authority retained | M | D | `natural-media.test.mjs` | 0 identified |
| 39 | Material system | `material/material-library.js`, `editor/repaint-material.js` | P — existing authority retained | M | D | `repaint-material-core-v0.1.test.mjs` | 0 identified |
| 40 | Reference import | `ai/chat-reference-handoff.js`, `ink.js` | P — existing authority retained | M | D | `qa/chat-validation-001-reference-handoff.test.mjs` | 0 identified |
| 41 | Extraction / vectorization | `extraction/core.js`, `extraction/install.js` | P — existing authority retained | M | D | `extraction-core-v0.1.test.mjs` | 0 identified |
| 42 | Structure reconstruction | `extraction/structure.js`, `structure/parametric-structure.js` | P — existing authority retained | M | D | `extraction-structure-v0.1.test.mjs` | 0 identified |
| 43 | History | `history/history.js`, `ink.js` | P — existing authority retained | M | D | `history.test.mjs` | 0 identified |
| 44 | Revision | `document/revision.js`, `ink.js` | P — existing authority retained | M | D | `revision-closure-core-v0.1.test.mjs` | 0 identified |
| 45 | Provenance | `provenance/provenance-graph.js` | P — existing authority retained | M | D | `revision-closure-core-v0.1.test.mjs` | 0 identified |
| 46 | Compare | `compare/visual-compare.js`, `render/pixel-compare.js` | P — existing authority retained | R | O | `studio-core-v090.test.mjs` | 0 identified |
| 47 | Storage | `document/storage.js` | P — existing authority retained | M | D | `storage.test.mjs` | 0 identified |
| 48 | Recovery | `document/storage.js`, `document/file-envelope.js` | P — existing authority retained | M | D | `storage.test.mjs` | 0 identified |
| 49 | Renderer | `ink.js`, `render/index.js` | F — studio cache invalidation on document replacement | R | D | `natural-media.test.mjs` | 0 identified |
| 50 | Natural-media renderer | `render/natural-media-controller.js`, `render/multi-channel-ink.js` | P — existing authority retained | R | D | `multi-channel.test.mjs` | 0 identified |
| 51 | GPU / large-canvas infra | `render/gpu-resource-budget.js`, `render/tile-atlas.js`, `render/live-canvas-tile-renderer.js` | F — cache invalidation on edits | R | D | `performance-v150.test.mjs` | 0 identified |
| 52 | High-resolution export | `render/tiled-export.js`, `export/png-worker-encoder.js` | P — existing authority retained | R | O | `performance-v150.test.mjs` | 0 identified |
| 53 | Output | `ink.js`, `export/pdf.js`, `vector/vector-core.js` | P — existing authority retained | R | O | `release-candidate.test.mjs` | 0 identified |
| 54 | Recompute | `recompute/local-recompute.js`, `recompute/dependency-graph.js` | P — existing authority retained | M | D | `integrated-creative-loop-v0.1.test.mjs` | 0 identified |
| 55 | Recipe / automation | `recipe/recipe-engine.js`, `studio-core.js` | P — existing authority retained | M | D | `studio-core-v090.test.mjs` | 0 identified |
| 56 | Program Import | `program-import/importer.js`, `studio-core.js` | F — Program Import attachment enclosed in History | M | D | `program-import-v110.test.mjs` | 0 identified |
| 57 | CHAT control | `editor/chat-bounded-edit.js`, `editor/chat-creative-plan.js` | P — existing authority retained | M | D | `chat-bounded-edit-core-v0.1.test.mjs` | 0 identified |
| 58 | Semantic grounding | `semantic/semantic-model.js`, `semantic/semantic-region-grounding.js` | F — positive overlap now emits the existing `intersects` relationship even without boundary crossings | R | D | `qa/core-mod-002-semantic-region.test.mjs` | 0 identified |
| 59 | Creative Library | `agent/creative-library-search.js`, `agent/public-creative-api.js` | P — existing authority retained | R | D | `qa/ink-connector-005-creative-library-search.test.mjs` | 0 identified |
| 60 | Creative Memory / Research | `memory/creative-memory.js`, `research/research-creation-bridge.js` | P — existing authority retained | R | D | `qa/core-mod-006-creative-memory.test.mjs` | 0 identified |
| 61 | FLORA specialization | `flora/hero`, `flora/recipe` | P — specialized boundary retained; generic Core unchanged | R | D | `flora-wp9a.test.mjs` | 0 identified |

## Evidence and explicit limits

- Changed render paths: image/object/layer masks, adjustment/filter stacks, color overlay, blend modes; cache invalidation on document replacement and mutation.
- Existing semantic region grounding now reports `intersects` for regions with positive overlapping area, including containment, using the same native geometry authority.
- Changed History paths: mask, adjustment, filter, filter reorder, brush replay, Stroke Session, drawing import report, calibration embedding, device/performance reports, and the full Program Import document attachment.
- Brush packages: built-in package export remains; native `INK_STUDIO.drawing.importBrushPackage(...)` persists imported packages in `.ink` and reloads them after document replacement, including Undo/Redo.
- Layer effects were historically **partial**. Color overlay is rendered from its existing model; drop/inner shadow, outer glow and stroke retain their historical data-model-only scope. This is not a claim of completed effects rendering.
- Stroke Session and brush package import are separate authorities; current canvas live drawing remains in `ink.js` and natural-media modules. No new brush engine was introduced.
- The original historical QA files listed above are source pointers. The branch ran the focused cases recorded in the handoff; integrated/browser Runtime and queue were not touched.
- No row has been intentionally retired. The `0 identified` column denotes loss against documented historical scope after source reconciliation; it does **not** mean the complete product has passed integrated Runtime. MR must review this classification before lifting the gate.
