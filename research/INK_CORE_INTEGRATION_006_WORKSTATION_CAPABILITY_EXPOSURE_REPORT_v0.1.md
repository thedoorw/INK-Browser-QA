# INK CORE INTEGRATION 006 — Workstation Capability Exposure Report v0.1

STATUS: `DEV_HANDOFF / MR_REVIEW_REQUIRED`

## Control

```text
TASK_ID = INK-CORE-INTEGRATION-006
BRANCH = work/ink-core-integration-006
BRANCH_BASE = d1ae24743e1be2067fe083674e133e9d0fc8d956
VALIDATED_PRODUCT_QA_SHA = c5c979104ce42df866f7a14f9a5b8ae646efd14e
UI_PANEL_AUTHORITY = SINGLE / PRESERVED
NEW_ENGINE_FEATURES = 0
FORMAT_VERSION = 4 / PRESERVED
TINYFISH_USED = 0
GITHUB_ACTIONS_USED = 0
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH / USER_DIRECTIVE
```

## Before / after capability summary

| Capability | Before Integration-006 | After Integration-006 |
|---|---|---|
| Vector Geometry / Foundation A | Path Edit, Boolean and Repeat were already visible; Foundation A low-level cubic/offset/fit primitives were intentionally UI-neutral | Existing Path/Boolean/Repeat routes retained as the workstation geometry surface. No duplicate geometry authority or low-level diagnostic buttons were invented |
| AI Document Bridge | Grounded in CHAT context but not visible as workstation state | Properties selected-object readout + CHAT Grounded Core readout |
| Semantic Region Grounding | Grounded but hidden | Properties + CHAT show semantic grounding availability/status |
| Revision / Provenance | Revision capture/list/restore visible; provenance graph hidden | Revision shows provenance status/event count while existing Revision authority stays unchanged |
| Visual Compare | Engine/tool available; no Revision surface | Revision adds current-vs-selected-revision structural comparison through the existing `compare_visual_subjects` tool |
| Parametric Creative Structure | Existing Repeat controls visible; deterministic structure status hidden | Compose shows selected Repeat deterministic state; existing Repeat controls remain mutation authority |
| Creative Memory | Tool route existed but product runtime attached no provider by default | Existing CHAT runtime receives a read-only Creative Memory provider and CHAT exposes advisory state |
| Research → Creation | Tool route existed but product runtime attached no provider by default | Existing CHAT runtime receives a read-only local Research provider; Reference + CHAT expose advisory state |
| Grounded CHAT / Plan | Proposal/approval/execute UI existed; new intelligence modules were not summarized | Grounded module state is visible without changing proposal → approval → execution |

## Newly exposed UI routes

### Properties — Grounded selection

UI:
- `#workstationSelectionCapabilities`
- `grounded-selection-refresh`

Backend:
- `CreativeWorkspaceController.runCapabilityAction('grounded-context-refresh')`
- existing `ToolCallRouter.route()`
- existing `get_grounded_creative_context`
- existing `createCreativeIntelligenceContextAdapter()`

Authority:
- `permission = OBSERVE`
- no Document / History / Revision / Geometry mutation.

### Reference — Research → Creation

UI:
- Reference → Research → Creation → `Refresh research context`

Backend:
- existing `get_research_creation_context`
- existing `createResearchCreationBridgeAdapter()`

Authority:
- local advisory evidence only;
- `networkRequired = false`;
- no fetch/scrape;
- no automatic Creative Memory promotion/write.

### Compose — Parametric / Repeat state

UI:
- Compose → Parametric Structure readout.

Backend:
- selected existing `repeat` object state;
- existing Core Repeat controls remain `createRepeat` / `expandRepeat` mutation surface;
- CHAT retains existing `resolve_parametric_structure` tool for explicit descriptors.

Authority:
- Integration-006 adds no generator executor and no second Repeat authority.

### CHAT — Grounded Core / Creative Memory / Research

UI:
- `Grounded context`
- `Creative Memory`
- `Research`

Backend:
- `get_grounded_creative_context`
- `get_creative_memory_context`
- `get_research_creation_context`

Provider attachment:
- `install-ai.js` attaches the existing Creative Memory and Research adapters to the existing `createChatRuntime(...)`.
- explicit app-provided providers are preserved when present;
- fallback local collections are empty, read-only collections, not fabricated evidence.

Mutation relationship:
- existing bounded edit remains `chatBoundedEditAdapter`;
- existing multi-step plan remains `chatCreativePlanAdapter`;
- proposal → approval → execution boundary is unchanged;
- continuation maximum is unchanged.

### Revision — structural compare + provenance

UI:
- `Compare structure with current`
- comparison evidence output
- provenance output

Backend:
- existing `RevisionController.loadRecord()`
- existing `compare_visual_subjects`
- provenance section from existing grounded creative-intelligence context.

Boundary:
- Revision comparison is structural only.
- `compareVisualSubjects` reports `renderingExecuted = false`; therefore Integration-006 deliberately does **not** expose Revision overlay/wipe/difference as visual buttons.
- existing AI Plan Preview remains the accepted visual preview surface where it already exists.
- capture/list/restore remain the sole Revision mutation controls.

## Geometry / Foundation A boundary

`research/INK_RA_FOUNDATION_A_VECTOR_GEOMETRY_REPORT_v0.1.md` froze `geometry-kernel.js` as a UI-neutral shared-core boundary.

The following are accepted engine primitives, not standalone workstation commands in this workpack:
- cubic segment intersection;
- point projection / nearest query;
- pure segment split geometry;
- robust offset;
- fitting / measurement.

Creating independent buttons for these primitives would require a new target/parameter interaction contract and would exceed bounded integration scope.

User-facing geometry remains on the already accepted workstation routes:
- Path node edit/simplify/refine;
- Boolean union/difference/intersection/xor/divide;
- Repeat radial/mirror/grid/expand.

## History / Revision relationship

New Integration-006 capability reads are advisory/read-only:
- grounded context;
- Creative Memory;
- Research → Creation;
- structural comparison;
- provenance display;
- selected Repeat status.

They do not create History entries or Revisions.

Mutation-capable capabilities continue through existing authorities:
- Path / Boolean / Repeat UI → existing mutation code → existing History;
- approved CHAT edit / plan → existing execution controller → existing History/Revision behavior;
- Revision capture/restore → existing `RevisionController`.

No second History, Revision, Document, Geometry or CHAT execution authority was added.

## Web / Portable parity

No delivery-specific capability UI was added to either HTML entry.

The established delivery contract remains:
- Web → `src/ink.js?v=0.1`;
- Portable → `dist/ink.compat.js?v=0.1`;
- Portable compatibility bootstrap → imports `../src/ink.js`;
- both load exactly one `web-shell.js?v=0.1`.

Therefore the new Creative Workspace wiring is shared source and reaches both deliveries.

## Focused QA

Added:

`qa/core-integration-006-workstation-capability-exposure.test.mjs`

Static/source verification performed against `c5c979104ce42df866f7a14f9a5b8ae646efd14e`:

```text
STATIC_PANEL_AUTHORITY = PASS
READ_ONLY_BOUNDARY = PASS
STRUCTURAL_COMPARE_BOUNDARY = PASS
CHAT_TOOL_CONVERGENCE = PASS
WEB_PORTABLE_BOOT_PARITY = PASS
FORMAT_VERSION_4 = PASS
CHANGED_SOURCE_SYNTAX = PASS
GITHUB_ACTIONS_USED = 0
```

The focused QA also guards:
- empty read-only Creative Memory/Research providers;
- no memory write tool;
- no remote research fetch/scrape;
- single panel authority;
- structural-only Revision compare;
- Portable convergence on authoritative `src/ink.js`.

## Capability still not exposed as a new direct UI command

1. **Foundation A low-level geometry primitives** — intentionally engine-level / UI-neutral; exposing them directly would require a new user interaction contract.
2. **Standalone Variant browser/store** — not added because Integration-006 found no accepted authoritative workstation variant repository/selection state to bind. The compare engine can consume explicit variant subjects, but inventing storage/navigation would create new product authority.
3. **Revision pixel overlay/difference** — not exposed because the accepted Visual Compare module explicitly reports no renderer execution for these modes.

These are not replaced by fake controls.

## Runtime debt

The Work Order originally names a Windows Chrome Runtime gate. The user explicitly changed this workpack to:

`DEFERRED_TO_INTEGRATION_BATCH`

Therefore no Runtime PASS is claimed.

The future concentrated Runtime batch must cover:
- existing panel open/close;
- selection → Properties grounded route;
- one existing Geometry mutation;
- Document/Semantic visibility;
- Compose Repeat/Parametric status;
- Revision structural compare + provenance;
- Creative Memory read-only route;
- Research read-only route;
- CHAT proposal/approval boundary;
- History/Revision effects for a mutation;
- Web shell integrity;
- narrow desktop containment;
- Web/Portable parity;
- exact tested SHA and regression evidence.

## Gates

```text
WORKSTATION_CAPABILITY_MATRIX_COMPLETE = PASS
CAPABILITY_PLACEMENT_APPROVED_BY_IMPLEMENTATION = PASS
COMPLETED_CAPABILITIES_VISIBLE_AND_WIRED = PASS
CHAT_UI_AUTHORITY_RELATIONSHIP_CORRECT = PASS
WORKSTATION_HISTORY_REVISION_RELATIONSHIP_CORRECT = PASS
WORKSTATION_WEB_PORTABLE_PARITY_PASS = PASS
WORKSTATION_CAPABILITY_RUNTIME_PASS = DEFERRED_TO_INTEGRATION_BATCH / NOT CLAIMED
```

## DEV handoff

```text
TASK_STATUS = DEV_HANDOFF
NEXT_ACTION = MR_REVIEW_REQUIRED
MAIN_MERGE = NOT PERFORMED
PACKAGE_INK_CURRENT = NOT MUTATED
STOP
```
