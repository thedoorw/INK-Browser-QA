# INK Current Capability Baseline

STATUS: `REOPENED / PREVIOUS POST-CONNECTOR-005 SNAPSHOT / NOT FINAL UI AUTHORITY`

DATE: 2026-09-26

## 1. Authority status

This file preserves the previously accepted post-Connector-005 CHAT public/control-surface snapshot.

It is **not** the complete INK product capability inventory and is **not** sufficient to authorize the final Photoshop-aligned UI rebuild while `INK-FULL-CAPABILITY-REBASELINE-001` is open.

Current MR development authority:

`ACTIVE/INK_FULL_PRODUCT_CAPABILITY_REBASELINE_PLAN_v1.0.md`

The 22 named tools / 34 bounded edit operations below remain valid as CHAT public-surface metrics only.

```text
PROMOTED_MAIN = 6ab67fe355b787d251c4431fe55b9d4f4990384b
RUNTIME_TESTED_EXACT_SHA = 5d6e6bd81f1bcc65ed9d52cc0249f29f199ffa8f
RUNTIME_RUN = 36240038654
RUNTIME_RESULT = PASS

FOCUSED_NODE = 32 / 32 PASS
UI = PASS
CLOSURE = PASS
GEOMETRY = PASS
CREATIVE = PASS

ARTIFACT_ID = 10905628104
ARTIFACT_DIGEST = sha256:beb8790c0c31583cde36eb7c59cf0dbcedbd55b2676f2c5c9b19beccab9fa858
```

The promoted main technical source/QA was verified blob-for-blob source-equivalent to the accepted exact Runtime candidate before promotion while preserving newer main governance and provisional UI planning.

## 2. Previously accepted CHAT public-surface invariants

```text
FORMAT_VERSION = 4
BOUNDED_EDIT_OPERATIONS = 34
NAMED_TOOLS = 22
PUBLIC_CREATIVE_API = installed
CONNECTOR_005 = installed
```

These counts do not define the full product. Existing native INK capabilities outside this CHAT surface remain subject to the full-product preservation audit and may not be removed by omission.

No final UI implementation is authorized from this snapshot until the refreshed full-product baseline is republished.

## 3. Installed named tools — exact order

```text
01 get_ink_capabilities
02 get_ink_context
03 get_ink_selection
04 inspect_ink_objects
05 decompose_ink_reference
06 propose_ink_edit
07 approve_ink_edit
08 execute_ink_edit
09 get_ink_history
10 undo_ink
11 redo_ink
12 get_ink_revisions
13 capture_ink_revision
14 restore_ink_revision
15 get_ink_preview
16 inspect_ink_output
17 release_ink_output
18 describe_ink_capability
19 use_ink
20 import_ink_reference
21 export_ink_asset
22 search_ink_library
```

Connector-005 is append-only: the accepted 21-tool prefix is preserved exactly and `search_ink_library` is tool 22.

## 4. Installed bounded edit operations — exact 34

```text
01 path.repaint.v1
02 path.material.apply.v1
03 path.material.remove.v1
04 object.translate.v1
05 path.simplify.v1
06 path.refine.v1
07 path.create.v1
08 path.edit.v1
09 object.rotate.v1
10 object.clone.v1
11 repeat.radial.v1
12 boolean.apply.v1
13 group.create.v1
14 object.reparent.v1
15 frame.create.v1
16 text.create.v1
17 text.edit.v1
18 svg.import.v1
19 object.resize.v1
20 object.scale.v1
21 object.order.v1
22 repeat.mirror.v1
23 repeat.grid.v1
24 layout.frame.set.v1
25 layout.frame.remove.v1
26 layout.item.set.v1
27 layout.item.remove.v1
28 component.register.v1
29 component.instance.create.v1
30 component.override.set.v1
31 component.override.reset.v1
32 component.instance.detach.v1
33 component.definition.duplicate.v1
34 component.reference.repair.v1
```

Mutating CHAT operations remain proposal/approval governed unless an already-accepted direct authority explicitly defines otherwise.

## 5. Current installed capability families

The following are installed at the accepted current scope and may receive final UI placement:

- document/file context, stable refs, selection and hierarchy inspection;
- grounded object/document inspection and semantic/provenance context;
- browser-native preview and internal output-handle lifecycle;
- local Reference import and Reference decomposition;
- native Path creation/editing, rectangle/ellipse/circle/polygon/polyline construction;
- Group, Frame and hierarchy/reparent operations;
- Text create/edit;
- bounded local SVG import;
- fill/stroke/opacity repaint and material appearance application/removal;
- translate, rotate, resize, scale and front/back ordering;
- simplify/refine and native Boolean operations;
- Repeat radial, mirror and grid creation;
- Frame Auto/Flex layout set/remove and child LayoutItem sizing/constraints set/remove;
- Component definition, instance, opacity override/reset, detach, definition duplicate and explicit reference repair;
- History inspect/undo/redo;
- Revision list/capture/restore;
- structural/grounded compare paths already accepted in current product;
- PNG/SVG/PDF asset export through existing native export authorities;
- programmable `use_ink` composition through the accepted Creative Plan authority;
- Creative Memory / Research advisory read paths at their accepted conditional-provider scope;
- Connector-005 Creative Library Search.

## 6. Connector-005 Creative Library Search contract

Installed searchable families:

```text
component
material
recipe
parametric-structure
reference-derived-structure
```

Public route:

```text
search_ink_library
→ library.query({ action: "search" | "inspect", ... })
```

Stable ref:

```text
INK_CREATIVE_LIBRARY_REF / 1
```

Search and inspect are read-only and were browser-proven mutation-neutral for Document / History / Revision state.

Reuse classifications:

| Family | Accepted current route |
|---|---|
| Component | existing proposal/approval → `component.instance.create.v1` |
| Material | existing proposal/approval → `path.material.apply.v1` |
| Recipe | read-only search/inspect; no new autonomous mutation route |
| Parametric structure | existing native object/clone/repeat authorities only |
| Reference-derived structure | existing native object/clone/composition authorities only |

Connector-005 does not create a second Library, Component, Material, Recipe, Repeat, renderer, History, Revision, or decomposition engine.

## 7. Explicitly not installed / not authorized by this baseline

These remain deferred, optional, or separate future work and must not be presented as operational final UI capability:

```text
full Library Manager subsystem
cloud asset library / remote asset search
AI automatic tagging or classification
general Variables / Tokens system
general Styles system
Component Variants system
general Grid Layout engine
CRDT / multiplayer library state
automatic Creative Memory writes
automatic Research fetch/scrape
autonomous asset application
external connector transport
prototype-interaction system
design-to-code as drawing-core capability
```

## 8. UI authority — suspended pending rebaseline

```text
PHOTOSHOP_ALIGNED_UI_REBUILD = HOLD
FINAL_UI_CAPABILITY_BASELINE = NOT YET REPUBLISHED
CURRENT_DEVELOPMENT_AUTHORITY = ACTIVE/INK_FULL_PRODUCT_CAPABILITY_REBASELINE_PLAN_v1.0.md
THIS_FILE_UI_AUTHORITY = SUSPENDED
CONNECTOR_005_CHAT_SURFACE_RECORD = PRESERVED
```

UI may change placement, grouping, density, panel behavior, icons, labels and Photoshop-aligned interaction presentation. It may not change Core capability semantics, History/Revision contracts, operation vocabulary, tool vocabulary, or document format merely to fit the UI.

Navigator and History panel interaction/placement remain UI-design requirements; History capability itself is installed as recorded above.

## 9. Supersession

This file supersedes pre-promotion capability counts and any earlier Closure ledger entry that still describes promoted C1/C2/Connector work as stale-branch, partial, planned, or not installed.

Historical ledgers and checkpoints remain evidence records and are not rewritten retroactively.
