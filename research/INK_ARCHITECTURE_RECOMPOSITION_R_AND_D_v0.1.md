# INK Architecture Recomposition R&D v0.1

STATUS: USER-INITIATED / RESEARCH-ONLY / NO PRODUCT MUTATION
DATE: 2026-10-03
PREPARED_FROM_MAIN: `01aaabac7d2a7a3d006029a616e7eed40fd334f4`

## 1. Why this line exists

The USER raised a critical architectural question after the PWA/cache-freshness repair consumed disproportionate time for an outwardly simple requirement:

> INK should open the currently published interface instead of first showing an old cached interface.

The immediate PWA defect is being repaired separately. This R&D line asks a larger question:

> Has INK accumulated enough structural coupling / authority diffusion that reorganizing the product architecture would now be faster and safer than continuing feature-by-feature repair?

This is **not** authorization to rewrite INK.

The first objective is to determine whether a bounded **Architecture Recomposition** can preserve mature capabilities while removing misplaced ownership, duplicated authority, assembly debt and deployment ambiguity.

## 2. Working hypothesis

INK now contains substantial mature product capability, but some of the cost of change may come from the way those capabilities are assembled rather than from the capabilities themselves.

Observed pattern:

```text
capability exists
→ UI home is unclear or duplicated
→ state/command ownership spreads across shell / ink.js / panel / helper
→ tests validate one layer
→ deployed browser can still load another version
→ small product change becomes a cross-layer repair
```

The PWA/cache issue is one concrete signal:

```text
source changed
≠ deployed revision clearly identified
≠ Service Worker revision clearly identified
≠ browser necessarily loading that revision
```

Other already-known signals include:
- very large `src/ink.js` responsibility surface;
- capability → UI exposure work required after capabilities already existed;
- repeated concern about duplicate UI state authority and one-off CSS overrides;
- product/Core/UI/PWA validation requiring separate identity reconciliation;
- old PASS evidence becoming invalid after unrelated assembly changes;
- need for repeated bounded reconciliation rather than simple compositional integration.

These are hypotheses to inspect, not pre-decided conclusions.

## 3. Recomposition, not full rewrite

Preferred question:

```text
What can remain intact?
What is merely in the wrong layer?
What has duplicate authority?
What actually needs replacement?
```

Do not start from:

```text
old INK bad
→ rewrite everything
```

Start from:

```text
verified mature INK capabilities
→ inventory ownership and dependencies
→ define correct architecture
→ rehome / consolidate only where justified
→ preserve proven Core where possible
```

## 4. Provisional target architecture

The target should make product ownership explicit and directional.

```text
1. PRODUCT MODEL
   Document / Page / Layer / Object / Selection / History / Revision

2. CAPABILITY CORE
   Draw / Vector / Raster / Text / Transform / Layout / Material /
   Import / Export / Recipe primitives

3. COMMAND + STATE AUTHORITY
   one command contract per operation
   one owner per mutable product state
   undo/history/revision integration
   capability discovery metadata

4. UI ASSEMBLY
   Menu / Tools / Options Bar / Panels / Dialogs / Context routes
   UI exposes capabilities; UI does not invent duplicate product state

5. AGENT / RECIPE / API BRIDGE
   CHAT / Recipe / Workflow IR / automation
   invokes the same native command/capability authorities as Human UI

6. RUNTIME + DELIVERY
   persistence / IndexedDB / PWA / Service Worker / build identity /
   deployment / offline / diagnostics / browser QA
```

Cross-cutting requirements:
- one build/deployment identity chain;
- one capability registry authority;
- one state owner per state domain;
- no UI-only hidden functional state unless explicitly UI-local;
- no duplicate command implementation between Human UI and CHAT;
- no deployment state that can silently invalidate product verification.

## 5. Core architectural principle

For any capability, the intended dependency direction is:

```text
Product Model
   ↑
Capability Core
   ↑
Command / State Authority
   ↑
UI + CHAT + Recipe adapters
```

Runtime/delivery supports the product but does not redefine product capability semantics.

Example:

```text
Crop capability
→ one native Crop command/state authority
→ Tools / Options Bar / Image menu expose the same authority
→ CHAT invokes the same authority
→ History records the same operation
```

Not:

```text
Tool owns one Crop behavior
Menu owns another
CHAT implements another
Options Bar stores another parameter state
```

## 6. First research deliverable — CURRENT vs TARGET architecture

Before implementation, produce two explicit architecture maps.

### A. CURRENT INK map

Trace at minimum:

- product/document model;
- `src/ink.js` responsibilities;
- capability modules;
- state owners;
- command/event routing;
- History / Revision;
- Human UI assembly;
- CHAT / agent / Recipe access;
- persistence;
- PWA / Service Worker;
- build/deployment identity;
- QA/evidence path.

For each responsibility, identify:
- authoritative file/module;
- callers;
- mutable state owned;
- duplicated/secondary owner if any;
- UI exposure;
- CHAT exposure;
- deployment/runtime dependency;
- known coupling or conflict hotspot.

### B. TARGET INK map

Define the desired same responsibilities with explicit layer boundaries and dependency direction.

Do not copy a generic architecture pattern. It must be derived from current INK capabilities and workflows.

## 7. Classification of current components

Every major subsystem/module should receive one primary disposition:

- `KEEP` — correctly placed and sufficiently isolated;
- `REHOME` — capability is valid but belongs in another layer/module;
- `CONSOLIDATE` — multiple authorities should become one;
- `SPLIT` — one module owns unrelated responsibilities;
- `REPLACE` — existing implementation is structurally unsuitable;
- `RETIRE` — obsolete duplicate / compatibility path after migration;
- `UNKNOWN` — evidence insufficient.

A component may not be marked `REPLACE` merely because it is large.

## 8. Special focus: src/ink.js

Do not assume `src/ink.js` must disappear.

Audit it by responsibility:

```text
bootstrap
application state
command routing
UI event binding
canvas interaction
selection
view/camera
drawing
document mutation
persistence
PWA/update
diagnostics
capability exposure
```

Determine which responsibilities are legitimate application composition and which are misplaced Core/state/service ownership.

The question is not file size alone; the question is **authority coupling**.

## 9. Decision options

The R&D must compare at least three paths.

### OPTION A — Continue bounded incremental repair

Use the current architecture and keep repairing specific defects.

Choose this only if:
- duplicate authority is limited;
- cross-layer coupling is bounded;
- most changes stay local;
- current assembly remains understandable and testable.

### OPTION B — Architecture Recomposition

Preserve verified Core/capabilities but create a cleaner product composition layer and migrate ownership in bounded phases.

Likely shape:

```text
freeze authority model
→ define target module boundaries
→ introduce command/state contracts
→ rehome existing capabilities
→ rebuild UI assembly on those contracts
→ unify CHAT/Recipe access
→ normalize runtime/deployment chain
→ retire old composition paths
```

### OPTION C — Full rewrite

Only consider if evidence shows the current product model/Core itself is structurally incompatible with the intended product.

Full rewrite is the highest-risk option and is **not the default**.

## 10. Decision evidence

The new-window R&D should quantify where possible:

- number of state domains with multiple owners;
- capabilities with multiple implementations vs multiple routes to one implementation;
- responsibilities currently concentrated in `src/ink.js`;
- capability families lacking a single command authority;
- UI controls that own product state instead of reflecting it;
- CHAT/Recipe paths bypassing native authority;
- deployment/build identity duplication;
- number of manual publication/update steps;
- cross-layer files repeatedly touched by unrelated feature work;
- recurring merge/rebase collision surfaces;
- tests that validate internals but can miss assembled-product failure;
- compatibility/migration paths that can be retired.

The output should estimate relative migration risk and likely reduction in future change cost.

## 11. Preserve-first constraints

Until the USER chooses a migration direction:

- no product source refactor;
- no capability rewrite;
- no FORMAT_VERSION change;
- no UI redesign;
- no PWA redesign;
- no mass file moves;
- no deletion of compatibility paths;
- no new architecture framework.

Current active work such as PWA integration/live gate and C06 remains independent.

## 12. Required R&D outputs

The first architecture window should produce:

1. `CURRENT_ARCHITECTURE_MAP`
2. `TARGET_ARCHITECTURE_MAP`
3. `AUTHORITY_DUPLICATION_REGISTER`
4. `KEEP_REHOME_CONSOLIDATE_SPLIT_REPLACE_RETIRE_MATRIX`
5. `src/ink.js RESPONSIBILITY MAP`
6. `OPTION_A_vs_B_vs_C decision comparison`
7. recommended migration sequence if Option B wins
8. explicit STOP / USER decision gate before implementation

## 13. Success criterion

This research succeeds when the USER can answer:

> Is it faster and safer to continue repairing current INK, or to recompose INK around the capabilities we already proved?

The answer must come from repository evidence, not architectural taste.

