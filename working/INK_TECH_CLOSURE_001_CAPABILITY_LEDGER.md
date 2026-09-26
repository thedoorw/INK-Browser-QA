# Final closure supersession — 2026-09-26

```text
STATUS = CLOSED / PROMOTED
PROMOTION_MAIN = 6ab67fe355b787d251c4431fe55b9d4f4990384b
RUNTIME_TESTED_EXACT_SHA = 5d6e6bd81f1bcc65ed9d52cc0249f29f199ffa8f
RUNTIME_RUN = 36240038654
RUNTIME = PASS

BOUNDED_EDIT_OPERATIONS = 34
NAMED_TOOLS = 22
FORMAT_VERSION = 4

FINAL_UI_AUTHORITY = ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md
```

All historical entries below that describe C1/C2 capability work as stale-branch, exposure debt, Runtime-pending, promotion-pending, or Connector-005 as planned/not implemented are superseded by the promoted post-Connector baseline.

The historical ledger remains intact as provenance.

---

# INK Technical Closure 001 — Capability Ledger

STATUS: `AUTHORITATIVE_CLOSURE_LEDGER / CLOSURE_IN_PROGRESS`

Purpose:

Unify the previously fragmented states of research, Core implementation, CHAT exposure, Runtime verification and promotion before the next full UI rebuild.

Closure categories:

```text
CLOSED_INSTALLED
PARTIAL_INSTALL
IMPLEMENTED_NOT_PROMOTED
CORE_ONLY_EXPOSURE_DEBT
PLANNED_NOT_IMPLEMENTED
DEFERRED
OPTIONAL
RETIRED
```

`CLOSED` is reserved for capability families whose intended current-scope path is actually present on current main. Code on an old branch is not installed.

## A. Original connector capability map — 40 operation families

| # | Capability family | Current technical state | Closure disposition |
|---:|---|---|---|
| 1 | Current document/file context | CHAT-accessible on main | CLOSED_INSTALLED |
| 2 | Stable node/object identity | CHAT-accessible stable refs on main | CLOSED_INSTALLED |
| 3 | Selection | CHAT-accessible on main | CLOSED_INSTALLED |
| 4 | Query hierarchy | Document Bridge / inspect path available | CLOSED_INSTALLED |
| 5 | Screenshot/render check | get_ink_preview + output handle | CLOSED_INSTALLED |
| 6 | Frame/container | native Frame implemented | CORE_ONLY_EXPOSURE_DEBT |
| 7 | Group | native Group exists; group.create.v1 implemented only on stale Geometry Ops branch | IMPLEMENTED_NOT_PROMOTED |
| 8 | Path/vector | native Path exists; path.create.v1 implemented only on stale Geometry Ops branch | IMPLEMENTED_NOT_PROMOTED |
| 9 | Rectangle/Ellipse primitives | implemented through path.create.v1 on stale Geometry Ops branch | IMPLEMENTED_NOT_PROMOTED |
| 10 | Text | native/editor Text capability exists; no complete CHAT write surface | CORE_ONLY_EXPOSURE_DEBT |
| 11 | Raster/image reference | import_ink_reference available | CLOSED_INSTALLED |
| 12 | SVG import | native SVG import exists; no complete CHAT operation surface | CORE_ONLY_EXPOSURE_DEBT |
| 13 | Fill/stroke/opacity | bounded repaint/appearance path available | CLOSED_INSTALLED |
| 14 | Material/expressive stroke | bounded material operations available | CLOSED_INSTALLED |
| 15 | Translate | object.translate.v1 available | CLOSED_INSTALLED |
| 16 | Resize/rotate/scale | transform Core exists; rotate wrapper is stale-branch-only; resize/scale not fully exposed | PARTIAL_INSTALL / CLOSURE_DEBT |
| 17 | Z-order/reorder | hierarchy/layer ordering exists; CHAT write surface incomplete | CORE_ONLY_EXPOSURE_DEBT |
| 18 | Path edit | PathEditController exists; path.edit.v1 stale-branch-only | IMPLEMENTED_NOT_PROMOTED |
| 19 | Simplify/refine | bounded operations available | CLOSED_INSTALLED |
| 20 | Boolean geometry | native Boolean exists; boolean.apply.v1 stale-branch-only | IMPLEMENTED_NOT_PROMOTED |
| 21 | Repeat / parametric | read resolver installed; radial wrapper stale-branch-only; mirror/grid/expand not fully exposed | PARTIAL_INSTALL |
| 22 | Auto/Flex layout | FrameLayout core implemented; CHAT mutation surface incomplete | CORE_ONLY_EXPOSURE_DEBT |
| 23 | Grid layout | no mature executor | DEFERRED |
| 24 | Constraints/fill/hug | LayoutItem/constraints core implemented; CHAT mutation surface incomplete | CORE_ONLY_EXPOSURE_DEBT |
| 25 | Components | ComponentDefinition/Instance core implemented; CHAT mutation surface incomplete | CORE_ONLY_EXPOSURE_DEBT |
| 26 | Component overrides | bounded opacity override/reset/detach foundation exists; CHAT mutation surface incomplete | CORE_ONLY_EXPOSURE_DEBT |
| 27 | Variants | no general Component Variant system | DEFERRED |
| 28 | Variables/tokens | no general design-token system | DEFERRED |
| 29 | Styles/library reuse | materials/recipes/research exist; no generic library search | PLANNED_NOT_IMPLEMENTED / MERGE_WITH_CONNECTOR_005 |
| 30 | History/Undo/Redo | named History tools installed | CLOSED_INSTALLED |
| 31 | Revision/version | named Revision tools installed | CLOSED_INSTALLED |
| 32 | Compare | grounded compare path available | CLOSED_INSTALLED |
| 33 | Prototype interactions | intentionally outside current drawing-product scope | RETIRED |
| 34 | Asset export | legacy CHAT export route exists but ends at USER_GESTURE_REQUIRED; native export exists | PARTIAL_INSTALL |
| 35 | Design → code | intentionally outside current drawing-product scope | RETIRED |
| 36 | Code/live UI → design | not drawing core | OPTIONAL |
| 37 | Design-system search / Creative Library Search | formally planned Connector-005, never cancelled | PLANNED_NOT_IMPLEMENTED |
| 38 | Semantic grounding | grounded CHAT context available | CLOSED_INSTALLED |
| 39 | Reference decomposition / vectorization | decompose_ink_reference installed | CLOSED_INSTALLED |
| 40 | Creative Memory / Research | CHAT tools exist; provider availability is conditional | PARTIAL_INSTALL |

Operation provenance is preserved as a required invariant and is treated as `CLOSED_INSTALLED` at the accepted current scope.

## B. Count snapshot

```text
CLOSED_INSTALLED                    = 15 families
PARTIAL_INSTALL                     = 3 families
IMPLEMENTED_NOT_PROMOTED            = 5 families
PARTIAL / MIXED CLOSURE DEBT        = 1 family
CORE_ONLY_EXPOSURE_DEBT             = 8 families
PLANNED_NOT_IMPLEMENTED             = 2 families
DEFERRED                            = 3 families
RETIRED                             = 2 families
OPTIONAL                            = 1 family
TOTAL                               = 40 families
```

The mixed family is Resize/Rotate/Scale because its Core exists, rotate is already coded on the old Geometry Ops branch, and resize/scale remain incompletely exposed.

## C. Mature-editor capabilities outside the 40-family connector table

These were previously accepted as valid mature-editor directions. They remain visible so UI design does not mistake absence from the connector map for cancellation.

| Capability | Current state | Closure treatment |
|---|---|---|
| Align / distribute | existing editor/core capability | CURRENT_BASELINE |
| Persistent rulers / guides | no first-class persistent model proven | VALIDATED_BACKLOG |
| Smart snapping / equal-distance snapping | smart snapping exists; scalable/equal-distance maturity incomplete | VALIDATED_BACKLOG |
| Transform preview → commit | transform/history foundation exists | CURRENT_BASELINE / maturity may expand |
| Richer typography / visual effects | basic Text/style exists; richer production surface incomplete | VALIDATED_BACKLOG |
| Editor overlay architecture | existing overlays, not fully formalized | CURRENT_BASELINE / UI architecture concern |
| Local storage / recovery | implemented | CLOSED_CORE |
| Render / viewport separation | implemented foundation | CLOSED_CORE |
| Geometry/snap worker scaling | not mandatory without profiling need | CONDITIONAL |
| Cloud file/revision/media adapter | not required for current local/shared-core closure | DEFERRED_BY_DELIVERY_NEED |
| Stylus / natural media | implemented foundation | CLOSED_CORE |
| Portable/Web shared core | established product invariant | CLOSED_CORE |

## D. Closure blockers before CURRENT_CAPABILITY_BASELINE may be frozen

Only these are immediate closure blockers:

1. `Geometry Ops integration debt`
   - existing implementation must be reconciled to current main;
   - exact-SHA QA/Runtime must reach the Geometry gate;
   - only after PASS may the eight stale-branch operations be promoted.

2. `Exposure-debt disposition`
   - the eight CORE_ONLY_EXPOSURE_DEBT families and the mixed transform family must each receive one explicit decision:
     - expose now because it was part of the accepted connector target; or
     - retain as Core-only/current UI capability with a documented reason.
   - no family may remain ambiguous.

3. `Partial-install disposition`
   - Repeat/Parametric, Asset Export, and Creative Memory/Research must each have their accepted current-scope behavior stated explicitly.

Connector-005 Creative Library Search is unresolved planned work, but it is not silently merged into Geometry Ops. It receives its own later bounded work order if retained active.

Deferred/retired/optional items do not block closure.

## E. UI dependency rule

The Photoshop-aligned UI may use this ledger for planning, but final menu/tool/panel placement must use the later frozen `CURRENT_CAPABILITY_BASELINE`.

No UI should expose a command as operational merely because it appears in research or an unpromoted branch.

## F. C2 disposition checkpoint

MR disposition is recorded in:

`working/INK_TECH_CLOSURE_001_C2_DISPOSITION.md`

Result:

```text
ACTIVE_EXPOSURE_WORK = Frame, Text, SVG import, full Transform/Order,
                       Repeat remainder, Auto/Flex Layout, Constraints,
                       Components/Overrides, Asset Export

CLOSED_AT_ACCEPTED_ADVISORY_SCOPE = Creative Memory / Research

C1_GEOMETRY_OPS = still blocks closure until reconcile + Runtime + promotion
```


## G. Install-first closure policy

User-approved execution:

`working/INK_TECH_CLOSURE_001_EXECUTION_PLAN.md`

```text
C1
→ C2-A
→ C2-B
→ C2-C
→ FINAL_RUNTIME
→ PROMOTION
→ CURRENT_CAPABILITY_BASELINE_FROZEN
```

Each checkpoint must pass source/static/unit/focused QA and receive a durable commit boundary.

Full Windows Runtime is batched to the final closure branch HEAD unless a high-risk exception is triggered.

This policy reduces repeated transport/evidence churn while preserving exact causal recovery in GitHub.


## H. C1 MR source checkpoint

```text
REVIEWED_HEAD = 6a9fb25558cda958b90140867ac054f3662dfa01
C1_SOURCE = MR_PASS
REPLAY_IDENTITY = 7 / 7 exact accepted blobs
USE_INK_TOTAL_ON_CLOSURE_BRANCH = 14

RUNTIME = PENDING_FINAL_CLOSURE_BATCH
PROMOTION = PENDING
MAIN_INSTALLED = NO
```

C1 therefore moves from `IMPLEMENTED_NOT_PROMOTED` to:

`INTEGRATED_ON_CLOSURE_BRANCH / SOURCE_ACCEPTED / RUNTIME_AND_PROMOTION_PENDING`

C2-A is released on the same branch. The main capability state is not yet changed until final Runtime PASS and promotion.


## Scope boundary — Photoshop-aligned final UI rebuild excluded from current Closure — 2026-09-26

```text
INK-TECH-CLOSURE-001 =
  technical capability closure only

IN_SCOPE =
  residual defect fixes
  source/focused QA
  exact-SHA Runtime
  clean promotion to current main
  CURRENT_CAPABILITY_BASELINE freeze

OUT_OF_SCOPE =
  Photoshop-aligned final UI rebuild
  final command/menu/tool/panel placement
  Navigator / History panel UI alignment
  final UI visual/interaction closure

NEXT_AFTER_CLOSURE =
  hand frozen capability baseline to UR
  → separate UI Work Order
```

The Photoshop-aligned final UI rebuild is NOT part of the completion percentage or completion criteria for `INK-TECH-CLOSURE-001`.

---



## UI-authoritative baseline sequencing supersession — 2026-09-26

The previous Closure-only handoff rule is superseded by:

```text
INK-TECH-CLOSURE-001
→ Connector-005 Creative Library Search
→ refresh CURRENT_CAPABILITY_BASELINE
→ freeze UI-authoritative baseline
→ hand to UR
→ Photoshop-aligned final UI rebuild
```

Closure 001 still must complete its own Runtime / promotion / ledger closure. Connector-005 is not absorbed into Closure 001 and does not block Closure 001 from becoming technically complete.

However:

```text
CLOSURE_001_COMPLETE
!= FINAL_UI_BASELINE_READY
```

The final UI-authoritative baseline is produced only after the bounded Connector-005 work is promoted and the capability ledger is refreshed.

Connector-005 bounded scope authority:

`working/INK_CONNECTOR_005_BOUNDED_PLAN.md`

