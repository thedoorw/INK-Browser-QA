# INK Architecture Recomposition Assessment v0.1

STATUS: R&D COMPLETE / STOP → USER DECISION / NO PRODUCT MUTATION  
DATE: 2026-10-03  
REPO: `thedoorw/INK-Browser-QA`  
EVIDENCE_MAIN: `35b9231e636da9acaaf6a8b318dcf31495e5dd28`

Primary authority:
- `research/INK_ARCHITECTURE_RECOMPOSITION_R_AND_D_v0.1.md`
- `ACTIVE/INK_ARCHITECTURE_RECOMPOSITION_NEW_WINDOW_HANDOFF_v0.1.md`

## 1. Executive decision

Repository evidence supports:

```text
A. Continue bounded repair       = viable short-term, poor total-cost path
B. Architecture Recomposition   = RECOMMENDED
C. Full Rewrite                 = not justified by current evidence
```

Reason:

INK already has a substantial modular capability core. The current Service Worker source shell enumerates 189 `src/` entries across document, editor, vector, raster/image, paint, render, recipe, history, AI/agent, program-import, recompute and other domains. The strongest authorities — Document model, History, Revision, storage and CHAT approval/execution boundaries — already exist and are reusable.

The repeated cost is concentrated in product composition:

- `product/source/src/ink.js`: 200,798 chars, 928 physical lines, 193 InkApp methods;
- `product/source/src/editor/chat-bounded-edit.js`: 189,869 chars / 3,910 lines;
- `product/source/ui/full-capability-controls.js`: 84,058 chars / 904 lines;
- `product/source/src/studio-core.js`: 54,379 chars / 154 dense physical lines.

The problem is therefore not “INK lacks a Core”. It is that Human UI, InkApp, Studio and CHAT each contain operation-routing or mutation orchestration, while renderer, UI, state and delivery responsibilities are composed through a few very broad files.

The fastest lower-debt path is to preserve proven Core implementations and introduce one shared command/state composition layer, then migrate existing routes into it incrementally.

## 2. Evidence summary

### 2.1 Existing modular Core is real

Current Service Worker `SOURCE_SHELL` enumerates 189 `src/` source entries.

Largest domain groups include:

```text
flora          37
render         16
ai             14
program-import 13
document       12
editor         11
paint          10
recompute       6
semantic        6
vector          6
recipe          5
core            5
history         3
input           4
export          3
release         3
pwa             2
```

This is not a single-file product internally. Most capability algorithms already live outside `ink.js`.

### 2.2 `ink.js` is a composition monolith

`InkApp` currently constructs or owns:

- `doc`;
- `InkStore`;
- `HistoryManager`;
- runtime health / diagnostics;
- Service Worker update manager;
- input arbiter / pen calibration;
- selection / draft / edit / interaction state;
- spatial index;
- tool / brush / font / inspector state;
- Renderer;
- autosave / dirty state;
- Human UI bindings.

Its constructor then installs:

```text
Studio Core
Extraction
CHAT Reference Handoff
Path Editing
Expressive Stroke
Repaint Material
Revision
CHAT Bounded Edit
INK Public Creative API
CHAT Creative Plan
Creative Workspace
Full Capability Controls
```

It also contains document/page/layer operations, History wrapping, selection, transforms, tools, UI refresh, export, input gestures, canvas navigation and rendering-facing behavior.

This is the primary `SPLIT` candidate.

### 2.3 command routing is duplicated more than product state

Observed History/mutation orchestration counts:

```text
ink.js                      history push/begin/commit: 68
full-capability-controls.js history push:              10
chat-bounded-edit.js        history push/commit:       36
studio-core.js              history push/begin/commit: 25
```

The same Core functions are imported by multiple front ends. Examples shared by Human UI and CHAT include:

```text
createAdjustment
createFilter
createLayerEffect
createLiquifyFilter
applyNonDestructiveDeformation
createWarpDeformationPlan
updateTextObject
colorRasterToRgba8
serializeColorRaster
deserializeColorRaster
```

CHAT and Studio also overlap on vector/paint/image operations such as `booleanPaths`, `createPath`, `createRepeat`, `createAdjustment`, `createFilter`, `StrokeSessionRecorder` and `replayStrokeSession`.

This is the main technical-debt signal: multiple routes are wrapping the same native primitives separately.

### 2.4 canonical state authorities mostly already exist

Positive evidence:

- Document state is centered on `app.doc` and `document/model.js`;
- History is one `HistoryManager`;
- Revision is one `RevisionController`;
- storage is one `InkStore` abstraction with IndexedDB → localStorage → memory fallback;
- CHAT Public Creative API routes bounded mutations through `chatBoundedEditAdapter` and composition through `chatCreativePlan`;
- CHAT does not contain a second renderer or second document model.

Therefore a full rewrite is not supported by the evidence.

### 2.5 delivery identity is a separate composition problem

Current main still contains duplicated manual build identity:

```text
src/config.js        BUILD_ID = 20261002-c04-two-state-repair
service-worker.js    BUILD_ID = 20261002-c04-two-state-repair
index.html           independent asset query/version tokens
```

The accepted PWA v3 candidate already corrects the core direction by deriving Pages runtime identity from the published Git revision and retaining a deterministic local fallback.

Architecture Recomposition must absorb that accepted result after integration; it must not redesign the active PWA repair.

## 3. CURRENT_ARCHITECTURE_MAP

```text
index.html / styles.css / web-shell.js
        │
        ├────────────── Human UI markup / data-command / panels
        │
        ▼
src/ink.js → bootInk() → new InkApp()
        │
        ├─ app.doc ------------------------------┐
        ├─ InkStore                             │
        ├─ HistoryManager                       │
        ├─ Renderer                             │
        ├─ Input / Pen                          │
        ├─ Selection / Draft / Interaction      │
        ├─ Tool / View / UI-local state         │
        ├─ RuntimeHealth / diagnostics           │
        └─ ServiceWorkerUpdateManager            │
        │                                        │
        ├─ bindUI / bindInput                    │
        ├─ document/page/layer methods           │
        ├─ selection/transform/edit methods      │
        ├─ view/navigation methods               │
        ├─ export methods                        │
        └─ render-facing methods                 │
        │                                        │
        ├──────── installStudioCore() ───────────┤
        │          ├─ Recipe / Program Import    │
        │          ├─ paint/image/vector routes  │
        │          ├─ renderer monkey-patching   │
        │          └─ direct DOM/UI bindings     │
        │                                        │
        ├──────── installFullCapabilityControls()│
        │          ├─ direct Core imports        │
        │          ├─ direct History wrapping    │
        │          └─ UI commands/dialogs        │
        │                                        │
        ├──────── installRevision()              │
        │          └─ RevisionController ── Store│
        │                                        │
        ├──────── installChatBoundedEdit()       │
        │          ├─ proposal/approval          │
        │          ├─ operation validation       │
        │          ├─ direct Core execution      │
        │          └─ History / Revision         │
        │                                        │
        ├──────── installChatCreativePlan()      │
        │          └─ multi-step bounded edits   │
        │                                        │
        └──────── installInkPublicCreativeApi()  │
                   └─ CHAT named tools / read /
                      proposal / approval /
                      execution / History /
                      Revision / Preview
                                                 │
Core capability modules <─────────────────────────┘
document / editor / vector / image / paint / render /
recipe / material / export / recompute / semantic / etc.

Delivery:
config.js BUILD_ID
  + service-worker.js BUILD_ID + SOURCE_SHELL
  + update-manager.js
  + GitHub Pages publication
  + Runtime / deployment workflows

QA:
exact-SHA Runtime workflow
  → runtime-test-bridge.js
  → window.INK_APP
  → source/function/render evidence

PWA Live Gate:
published Pages revision
  → ordinary open/F5/reopen/offline
  → app/worker/cache identity evidence
```

## 4. TARGET_ARCHITECTURE_MAP

```text
                         ┌─────────────────────────────┐
                         │       PRODUCT MODEL         │
                         │ Document / Page / Layer /   │
                         │ Object / Selection domain   │
                         └──────────────┬──────────────┘
                                        │
                         ┌──────────────▼──────────────┐
                         │      CAPABILITY CORE        │
                         │ vector / raster / paint /   │
                         │ text / transform / recipe / │
                         │ import / export / render    │
                         └──────────────┬──────────────┘
                                        │
                         ┌──────────────▼──────────────┐
                         │ COMMAND + STATE AUTHORITY   │
                         │ one command contract        │
                         │ one mutable-state owner     │
                         │ validation / targets        │
                         │ History policy              │
                         │ Revision policy             │
                         │ capability metadata         │
                         └───────┬───────────┬─────────┘
                                 │           │
               ┌─────────────────┘           └─────────────────┐
               ▼                                               ▼
      ┌──────────────────┐                           ┌──────────────────┐
      │ HUMAN UI ADAPTER │                           │ CHAT/RECIPE/API  │
      │ menu/tool/panel  │                           │ proposal/approve │
      │ options/dialog   │                           │ plan/workflow    │
      └──────────────────┘                           └──────────────────┘
               │                                               │
               └───────────────── same commands ───────────────┘
                                        │
                              ┌─────────▼─────────┐
                              │ History / Revision│
                              │ Persistence       │
                              └─────────┬─────────┘
                                        │
                              ┌─────────▼─────────┐
                              │ Renderer / Output │
                              └───────────────────┘

Composition root:
bootstrap only
→ construct services
→ wire adapters
→ expose Runtime/QA handles

Delivery plane:
single generated publication identity
→ app manifest
→ worker/cache identity
→ Pages deployment identity
→ diagnostics
→ exact deployed Live Gate

QA plane:
command contract tests
+ adapter parity tests
+ assembled browser tests
+ exact-SHA Runtime
+ actual deployed Pages gate
```

Target rule:

```text
Human UI ─┐
CHAT/API ─┼→ Command Authority → Core mutation → History → Revision
Recipe ───┘
```

No front end should own an alternate implementation of the same product mutation.

## 5. AUTHORITY_DUPLICATION_REGISTER

| Domain | Current finding | Severity | Target |
|---|---|---:|---|
| Document model | `app.doc` + document modules are effectively canonical | LOW | keep one document authority |
| Selection | canonical value is `app.selection`, but many surfaces assign it directly | MEDIUM | selection service / commands; adapters do not assign directly |
| History | one HistoryManager, not duplicated; tightly coupled to app UI callbacks | MEDIUM coupling | keep algorithm, narrow dependency contract |
| Revision | one RevisionController; correctly layered above document/history/store | LOW | keep |
| Core algorithms | broadly modular and reused | LOW | keep |
| Mutation commands | InkApp, Full Capability UI, CHAT bounded edit and Studio separately orchestrate Core + History | HIGH | one command registry/dispatcher |
| Renderer | base Renderer in `ink.js` plus `studio-core.installRenderer()` method replacement plus render modules | HIGH | one renderer composition/service boundary |
| Human UI | event/command assembly spread across HTML, `ink.js`, Full Capability Controls and Studio | HIGH | UI adapters only |
| CHAT | proposal/approval is sound, but bounded-edit execution duplicates operation orchestration | MEDIUM/HIGH | retain governance adapter; rehome execution to shared commands |
| Recipe / Studio | good engines exist; Studio installer also owns UI and renderer patching | HIGH coupling | split engine/services from UI/renderer adapters |
| Capability metadata | agent canonical registry + Studio capability object + partial `window.INK_ARCHITECTURE` + UI contribution metadata | MEDIUM | canonical machine registry with generated/projection views |
| Persistence | InkStore canonical; app also holds autosave/preference orchestration | LOW/MEDIUM | keep InkStore; rehome settings/autosave service |
| Build identity | current main duplicates hardcoded BUILD_ID and asset tokens | HIGH, active repair | accepted publication-bound identity becomes single source |
| QA identity | exact-SHA Runtime strong; deployed browser identity historically separate | MEDIUM | one release manifest and mandatory deployed identity gate |

## 6. src/ink.js RESPONSIBILITY MAP

Primary disposition: **SPLIT**

### KEEP inside a thin composition root

- `bootInk()`;
- service construction;
- dependency wiring;
- Runtime-ready signal;
- optional QA bridge installation;
- stable `window.INK_APP` compatibility exposure during migration.

### REHOME from `ink.js`

- document/page/layer mutations → shared commands;
- selection mutation → selection/command authority;
- view/camera/navigation → view controller;
- pointer/gesture orchestration → input/tool controllers;
- Human UI event binding/refresh → UI adapters;
- persistence/autosave → document session service;
- preferences/localStorage → settings service;
- release/PWA UI callbacks → delivery adapter;
- Renderer implementation → render service;
- export orchestration → output service.

### RETAIN existing imported Core modules

Do not rewrite proven document, vector, image, paint, transform, material, render, export or geometry algorithms merely to reduce `ink.js` size.

## 7. KEEP / REHOME / CONSOLIDATE / SPLIT / REPLACE / RETIRE MATRIX

| Component / responsibility | Disposition | Reason |
|---|---|---|
| `document/model.js` + hierarchy/layout/artboard/components | KEEP | mature canonical product model |
| `document/storage.js` / InkStore | KEEP | isolated persistence authority with recovery |
| `history/history.js` | KEEP | single working History authority; only dependency narrowing needed |
| `document/revision.js` | KEEP | single revision authority, already coordinated with History/store |
| vector/image/paint/material/recompute Core | KEEP | proven reusable capability implementations |
| render submodules | KEEP | substantial reusable render capability already exists |
| `src/ink.js` | SPLIT | application shell + state + commands + UI + input + render responsibilities mixed |
| `src/studio-core.js` | SPLIT | engine/service logic mixed with renderer patching and direct DOM/UI |
| `ui/full-capability-controls.js` mutation logic | REHOME | UI directly imports mutators and wraps History |
| `editor/chat-bounded-edit.js` | SPLIT | keep proposal/validation; move operation execution to shared command authority |
| `editor/chat-creative-plan.js` | KEEP | good governed multi-step layer if steps invoke shared commands |
| `agent/public-creative-api.js` | KEEP | adapter correctly routes to native authorities |
| `agent/capability-registry.js` + other capability projections | CONSOLIDATE | use one canonical machine registry; generate/projection views elsewhere |
| partial `window.INK_ARCHITECTURE` capability inventory | RETIRE | explicitly incomplete duplicate after canonical registry is sufficient |
| Renderer monkey-patching from Studio | REPLACE | replace dynamic method replacement with explicit renderer extension/composition contract |
| UI event routing across HTML/InkApp/Studio/Full Controls | CONSOLIDATE | one UI command adapter layer |
| local UI preferences in InkApp | REHOME | settings service; not product document state |
| current hardcoded BUILD_ID duplication | RETIRE | accepted PWA v3 publication identity supersedes manual token |
| Service Worker update manager | KEEP | bounded delivery adapter; absorb accepted v3 |
| manual Service Worker source/cache inventory | CONSOLIDATE | generate/verify from release manifest/build process where practical |
| runtime-test-bridge + exact-SHA workflow | KEEP | strong evidence path |
| Pages post-integration Live Gate | KEEP | closes source→deployment→browser-loaded identity chain |
| `UNKNOWN` bucket | KEEP UNKNOWN until inspected | do not mass-move low-traffic specialist modules without evidence |

## 8. A vs B vs C

| Criterion | A Incremental repair | B Recomposition | C Full rewrite |
|---|---|---|---|
| Immediate disruption | lowest | medium | highest |
| Reuse of proven capabilities | full | full | low/uncertain |
| Removes command duplication | weak | strong | strong |
| Removes `ink.js` / Studio composition debt | weak | strong | strong |
| Preserves History/Revision behavior | easiest | controllable with parity tests | high regression risk |
| Preserves CHAT qualification evidence | easiest | strong if adapters retained | much evidence invalidated |
| Deployment/PWA cleanup | separate patches | can normalize release plane after accepted fix | must rebuild |
| Time to next small fix | fastest | slower initially | slowest |
| Total time over continuing UI/Core changes | increasingly poor | best current evidence | worst current evidence |
| Regression risk | accumulates | bounded migration risk | very high |
| Technical-debt reduction | low | high | theoretically high, practically expensive |

### A — Continue bounded repair

Use only if the architecture R&D had found that command duplication was isolated.

It did not.

A remains appropriate for already-running bounded tasks such as the current PWA integration/live gate and C06. It is not the preferred long-term composition strategy.

### B — Architecture Recomposition

Best supported option.

Preserve mature models, engines and algorithms. Introduce a shared command/state authority and progressively move Human UI, CHAT and Studio routes onto it.

This directly targets the observed cost center without invalidating the product.

### C — Full Rewrite

Not supported.

Current evidence shows reusable product model, History, Revision, storage, render, vector, image, paint, Recipe and CHAT governance. A rewrite would intentionally discard or re-prove large amounts of already-qualified behavior.

Only reconsider C if a later migration spike demonstrates that the Product Model itself cannot support the intended target contracts.

## 9. Recommended migration sequence if USER selects B

No implementation is authorized by this document.

Proposed bounded sequence:

```text
B0  close/absorb active PWA publication-identity repair; pin exact baseline
B1  define Command Contract + Command Registry interfaces; no behavior change
B2  create command execution context:
      document / selection / history / revision / renderer invalidation
B3  migrate one low-risk vertical slice from InkApp + UI + CHAT to same commands
B4  parity gate:
      same document result
      same History receipt
      same Revision behavior
      same Preview/output
B5  migrate repeated high-churn command families:
      page/layer/selection/transform
      then raster/vector/text/material
B6  reduce chat-bounded-edit to proposal/approval/validation adapter over shared commands
B7  split full-capability-controls into UI contribution metadata + thin UI adapters
B8  split studio-core:
      engine/services
      renderer extension contract
      UI adapter
B9  split ink.js into thin bootstrap + application/session/view/input services
B10 consolidate capability metadata as projections of canonical command/capability registry
B11 normalize release manifest / generated deployment identity around accepted PWA v3
B12 delete old mutation paths only after exact-SHA Runtime + assembled browser + deployed gate PASS
```

Important migration rule:

```text
introduce new authority
→ dual-route parity evidence
→ switch one caller class
→ exact regression
→ retire old route
```

Do not mass-move files first. Authority migration comes before directory cleanup.

## 10. USER decision gate

Current R&D result:

```text
RECOMMENDED_PATH = B / ARCHITECTURE_RECOMPOSITION
CORE_REWRITE = NO
PRODUCT_SOURCE_MUTATION = NOT AUTHORIZED
FORMAT_VERSION_CHANGE = NO
CURRENT_ACTIVE_PWA_WORK = REMAINS INDEPENDENT
CURRENT_ACTIVE_C06_WORK = REMAINS INDEPENDENT
NEXT = STOP → USER DECISION
```

The next authorized action, if USER selects B, should be **B1 Architecture Contract / Command Authority workpack**, not a refactor commit.
