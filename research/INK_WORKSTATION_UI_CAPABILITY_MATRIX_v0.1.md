# INK Workstation UI × Capability Matrix v0.1

STATUS: `BASELINE_INVENTORY_COMPLETE`

Task: `INK-CORE-INTEGRATION-006 — Workstation Capability Exposure & UI-Function Mapping v0.1`

Branch: `work/ink-core-integration-006`

Baseline HEAD inspected: `7436e198b5c26199642e02e0667814b23a106d63`

## Authority rule

This matrix maps already accepted Core capabilities into the existing single-panel workstation grammar only:

`Properties / Layers / History / Reference / Compose / CHAT / Revision`

It does not authorize a second panel authority, second Document/History/Revision/Geometry/CHAT authority, new engine behavior, automatic Creative Memory writes, remote research fetches, automatic approval, or automatic execution.

## Matrix

| Capability | Engine / module source | Exact accepted operations | Current user-visible UI entry | Current CHAT / tool entry | History behavior | Revision behavior | State visibility before Integration-006 | Web / Portable parity | Runtime testability | Baseline disposition |
|---|---|---|---|---|---|---|---|---|---|---|
| Vector Geometry Kernel / Foundation A | `src/vector/vector-core.js`; `src/vector/geometry-kernel.js`; existing Path edit/repeat callers | Path Boolean union/difference/intersection/xor/divide; Path node edit/refine/simplify; Repeat radial/mirror/grid/expand; existing projection/intersection helpers remain engine-only unless already called | Properties → Object exposes Path edit; Properties → Core exposes Path Boolean + Repeat | Existing bounded edit supports path simplify/refine; no separate geometry authority | Mutating UI routes use existing `HistoryManager` / scoped history | Revision captures resulting authoritative Document | Operations exist, but capability family/selection status is not summarized in workstation | Shared source loaded by Web + Portable | Source/unit + browser interaction | `PARTIAL_WIRING` |
| AI Document Bridge | `src/ai/document-bridge.js`; rooted by `src/ai/creative-intelligence-context.js` | Bounded selected-object/document grounding; active page/layer; stable identity; visibility/editability hints; relationships; revision identity | No explicit workstation readout | `get_grounded_creative_context` via existing ToolCallRouter | Read-only; no fabricated History | Reads current Revision identity only | Hidden inside grounded CHAT context | Shared source | Deterministic context read | `WIRED_BUT_HIDDEN` |
| Semantic Region Grounding | `src/semantic/semantic-region-grounding.js`; rooted by Creative Intelligence Context | Ground outer/hole/island regions; contains/inside/intersects/overlaps; evidence-only adjacency/crossing/gap/bridge | No explicit selected-region readout | Included in `get_grounded_creative_context` | Read-only | Read-only provenance linkage only | Hidden inside grounded CHAT context | Shared source | Deterministic context read | `WIRED_BUT_HIDDEN` |
| Revision / Provenance | `src/document/revision.js`; `src/provenance/provenance-graph.js` | Revision capture/list/restore; revision comparison; bounded lineage graph / bridge context | Revision panel exposes capture/list/restore; selection header exposes limited source metadata | Provenance included in grounded context | History remains existing operation sequence and undo/redo authority | Existing Revision controller remains sole revision authority | Revision visible; provenance graph/lineage hidden | Shared source | Source/unit + browser revision flow | `PARTIAL_WIRING` |
| Visual Compare / Variant | `src/compare/visual-compare.js` plus existing Revision comparison and AI preview UI | Compare explicit reference/current/revision/variant subjects; side-by-side/overlay/wipe/difference/structural modes as metadata; pixel renderer is explicitly not executed by module; variant descriptor metadata | AI Plan Preview has Before/After, Split, Overlay, Difference; Revision lacks module comparison readout | `compare_visual_subjects` | Read-only comparison creates no History | Reads Revision documents/records; restore remains separate explicit action | Existing preview visible, new comparison evidence not exposed | Shared source | Deterministic source compare + browser readout | `PARTIAL_WIRING` |
| Parametric Creative Structure | `src/structure/parametric-structure.js` plus existing Repeat authority | Resolve explicit descriptor; parameter/default/bounds resolution; deterministic generated-node plan; advisory/read-only; existing Repeat remains mutation authority | Properties → Core exposes Repeat radial/mirror/grid/count/expand | `resolve_parametric_structure` | Resolver read-only; actual Repeat mutations use existing History | Resulting Document can be captured by existing Revision | Repeat controls visible; deterministic parametric resolution/status hidden | Shared source | Deterministic resolver + browser readout | `PARTIAL_WIRING` |
| Creative Memory | `src/memory/creative-memory.js`; Integration-005 grounded provider hook | Query/read advisory context; Accepted/Rejected/Unresolved disposition; evidence/refs; no automatic write | No workstation visibility | `get_creative_memory_context` exists when provider is attached | Read-only; no History entry | Read-only; no Revision write | Tool is present but product runtime does not attach a provider by default | Shared source | Deterministic provider/tool read | `PARTIAL_WIRING` |
| Research → Creation | `src/research/research-creation-bridge.js`; Integration-005 grounded provider hook | Evidence → principles → advisory creative constraints; resolved/unresolved/conflicting state; explicit-only memory candidate; no remote fetch | Reference panel has extraction but no Research evidence/principle/constraint readout | `get_research_creation_context` exists when provider is attached | Read-only | Read-only | Tool is present but product runtime does not attach a provider by default | Shared source | Deterministic provider/tool read | `PARTIAL_WIRING` |
| Grounded CHAT / Creative Decision / Plan | `src/ai/chat-runtime.js`; `src/ai/creative-intelligence-context.js`; grounded creative decision/plan modules; existing bounded edit + creative-plan adapters | Read grounded context; one continuation round; advisory evidence; explicit proposal → approval → execution; existing bounded edit; rollback | CHAT panel exposes conversation/context inspection + bounded proposal/approve/execute + multi-step plan | Grounded tools include context, memory, research, compare, parametric | Mutations execute through existing command/plan path and existing History | Plan result can report starting/ending Revision; Revision authority unchanged | Proposal flow visible; grounded module availability/status not summarized | Shared source | Unit + browser CHAT flow | `PARTIAL_WIRING` |

## Placement decision

- **Properties**: keep existing Object/Core controls. Add read-only selection capability status for Document Bridge + Semantic Regions and retain existing Path/Boolean/Repeat mutation controls.
- **Reference**: add Research → Creation read-only evidence/principle/constraint status. Existing Reference extraction remains unchanged.
- **Compose**: add deterministic Parametric Structure status for the selected Repeat/structure where a valid descriptor is available; do not invent a second Repeat executor.
- **CHAT**: add explicit grounded module status, Creative Memory advisory visibility, Research advisory visibility, while retaining existing proposal → approval → execution boundary.
- **Revision**: add provenance/lineage visibility and explicit current-vs-selected-revision structural comparison. Existing capture/restore stays authoritative.
- **History**: no duplicate UI. Existing operation sequence/undo-redo remains authoritative.
- **Layers**: no change; hierarchy remains authoritative.

## Missing wiring authorized for this workpack

1. Attach read-only Creative Memory and Research → Creation providers to the existing CHAT runtime. Empty providers mean “available, no records/evidence”, not fabricated content.
2. Expose bounded grounded Document/Semantic/Provenance status through the existing workstation.
3. Expose Research and Creative Memory advisory state through existing Reference/CHAT destinations.
4. Expose existing Visual Compare evidence in Revision without introducing renderer or restore side effects.
5. Expose Parametric Creative Structure status while leaving actual Repeat mutation on existing controls.
6. Add source/static regression coverage for panel authority, read-only boundaries, History/Revision convergence, Web/Portable parity, and `FORMAT_VERSION = 4`.

## Explicit non-goals

- no new geometry, comparison, parametric, memory, research, or CHAT engine;
- no second panel/router/history/revision/document model;
- no memory write UI;
- no research fetch/scrape UI;
- no automatic approval/execution;
- no Runtime PASS claim in this DEV turn: user directive is `RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH`.

## Gate

`WORKSTATION_CAPABILITY_MATRIX_COMPLETE = PASS`


## Post-implementation disposition

Validated product / QA checkpoint: `c5c979104ce42df866f7a14f9a5b8ae646efd14e`

| Capability | Integration-006 disposition | Final workstation placement |
|---|---|---|
| Vector Geometry Kernel / Foundation A | `EXPOSED_CORRECTLY` for accepted user commands; low-level cubic query/offset/fitting primitives remain `OUT_OF_SCOPE` as direct controls because Foundation A froze them as a UI-neutral shared-core boundary | Properties → Object/Core: existing Path Edit, Boolean, Repeat; no duplicate geometry UI |
| AI Document Bridge | `EXPOSED_CORRECTLY` | Properties selected-object grounded readout + CHAT grounded context |
| Semantic Region Grounding | `EXPOSED_CORRECTLY` | Properties selected-object grounded readout + CHAT grounded context |
| Revision / Provenance | `EXPOSED_CORRECTLY` | Revision provenance readout; existing capture/list/restore authority unchanged |
| Visual Compare / Variant | `PARTIAL_WIRING` by accepted authority boundary | Revision exposes current-vs-revision **structural** compare. Unrendered overlay/difference modes are intentionally not exposed here. Existing AI Plan Preview remains the visual preview surface. No new variant store/browser was invented. |
| Parametric Creative Structure | `EXPOSED_CORRECTLY` for accepted workstation state | Compose shows selected Repeat deterministic state; existing Core Repeat controls remain mutation authority; explicit descriptor resolution remains the existing CHAT `resolve_parametric_structure` PROPOSE path |
| Creative Memory | `EXPOSED_CORRECTLY` read-only | CHAT advisory readout through existing grounded tool router; no write UI |
| Research → Creation | `EXPOSED_CORRECTLY` read-only | Reference + CHAT advisory readout; no remote fetch/scrape |
| Grounded CHAT / Creative Decision / Plan | `EXPOSED_CORRECTLY` | CHAT shows grounded advisory state while bounded proposal → approval → execution remains unchanged |

### Runtime status

Source/static/parity validation is complete for this workpack.

`WORKSTATION_CAPABILITY_RUNTIME_PASS` is **not claimed** here.

Per user directive:

`RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH`

The concentrated Runtime batch must exercise the Work Order Phase G checklist against the exact promoted/reviewed SHA.
