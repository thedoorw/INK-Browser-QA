# INK v0.1 Browser Runtime Dependency Map

STATUS: `M1 ANALYSIS FREEZE`

Branch: `working/INK-v0.1-structure-optionalization`

Authoritative baseline: `b1f65193b63fa3e2403752a197e19c998fd88ce6`

Measurement helper: `engineering/runtime-dependency-graph.mjs`

## Measurement method

The helper starts at `product/source/src/ink.js`, resolves local static ESM imports recursively, and sums UTF-8 source bytes once per reachable module. Literal dynamic imports are reported as optional edges and excluded from the mandatory reachable totals. Browser HTML, CSS, JSON fetched at runtime, and the separately loaded service worker are not counted as JS modules.

Reproduce:

```text
node engineering/runtime-dependency-graph.mjs
```

## Before graph — current mandatory startup

`product/source/index.html` has one browser module entry:

```text
index.html -> src/ink.js
```

Measured at the pre-refactor branch state whose product Runtime is unchanged from the authoritative baseline:

| Classification | Reachable JS modules | Reachable JS bytes | Startup role |
|---|---:|---:|---|
| CORE_RUNTIME | 66 | 568,612 | app, document, history, input, render, export, selection/transform, persistence, release diagnostics, program import |
| CORE_UI | 22 | 274,215 | Studio UI plus vector, raster/image, paint, semantic and composition surfaces |
| FLORA_CAPABILITY | 37 | 420,473 | mandatory solely because `src/ink.js` imports FLORA install and mask helpers |
| AI_CAPABILITY | 4 | 149,413 | mandatory through `src/ink.js -> src/studio-core.js -> src/ai/install-ai.js` |
| RECIPE_AUTOMATION | 1 | 41,656 | mandatory through `src/ink.js -> src/studio-core.js -> src/recipe/recipe-engine.js` |
| PWA_SHELL | 2 | 3,077 | update manager imported by `src/ink.js`; service worker is separately registered at runtime |
| RUNTIME_ASSET | 1 | 563 | asset migration helper reached through the existing live graph |
| SCHEMA | 0 | 0 | no schema file is a static ESM startup dependency |
| ENGINEERING_ONLY | 0 | 0 | intentionally outside `product/source/src/ink.js` graph |
| HISTORICAL_ONLY | 0 | 0 | intentionally outside `product/source/src/ink.js` graph |
| **Total mandatory eager graph** | **133** | **1,458,009** | 296 static import edges; 0 dynamic import edges |

Informative preservation totals, not optimization targets:

- all `product/source/src/flora/**/*.js`: 37 modules / 420,473 bytes;
- all `product/source`: 198 files / 1,989,019 bytes.

## Exact FLORA coupling list

### Static imports forcing FLORA into startup

1. `src/ink.js -> src/flora/index.js`
   - symbol: `installFloraActionLayer`
   - effect: constructor installs the complete FLORA action, recipe, crown, hero, species, reference and retention graph synchronously.
2. `src/ink.js -> src/flora/mask/vector-mask.js`
   - symbols: `normalizedPointToWorld`, `traceVectorMaskWorld`, `traceVectorPathWorld`
   - effect: general renderer cannot be evaluated without a FLORA-domain module.

No non-FLORA module other than `src/ink.js` imports `src/flora/**`.

### Live call/data sites in Core

| Site | Current dependency | Required boundary action |
|---|---|---|
| `InkApp` constructor | synchronous `installFloraActionLayer(this)` | replace with registered optional loader; Core starts without install |
| `Renderer.drawObject` | FLORA mask lookup and mask tracing | move to FLORA-owned render hook |
| `Renderer.drawLayerObjects` | checks `object.floraPaint` to prevent batched rendering | replace with capability-owned individual-render hook |
| renderer overlays | calls `drawFloraInspectionOverlay` from normal and export paths | replace with generic installed-capability overlay hook |
| `InkApp.replaceDocument` | directly clears `this.flora.hero.cache` | replace with generic document-replaced lifecycle notification |
| architecture reports | always claim three FLORA modules | derive optional capability state instead of claiming FLORA in Core mode |

The document model may retain FLORA extension fields as inert preserved data. Their presence does not require FLORA code to load.

## Other startup capability edges held in scope

- AI remains mandatory through `src/studio-core.js -> src/ai/install-ai.js` (4 modules / 149,413 bytes). This work order does not authorize AI optionalization.
- Recipe remains mandatory through `src/studio-core.js -> src/recipe/recipe-engine.js` (1 module / 41,656 bytes). This work order does not authorize Recipe optionalization.
- PWA update management remains part of the existing live graph. PWA boundary is not changed unless required by verification.
- Runtime schemas and bulk assets are preserved but are not eager JavaScript graph members.

## Planned change list frozen at M1

1. Add one small `OptionalCapabilityRegistry` in `product/source/src/capabilities/optional-capability-registry.js`.
2. Register one literal dynamic loader for `flora`; do not install it during normal Core startup.
3. Move FLORA object masking, per-object render isolation, inspection overlay, and document-replaced cache cleanup behind hooks installed by `src/flora/index.js`.
4. Expose observable deterministic states: `available`, `unavailable`, `failed`, `installed`.
5. Support explicit attach through `window.INK_CAPABILITIES.install('flora')` and an opt-in query parameter used by the Node-free Windows gate.
6. Preserve `installFloraActionLayer` and all 37 FLORA source modules for existing direct tests and evidence.
7. Add focused detached/enabled/failure and core-interaction checks to the authorized Windows workflow; keep the workflow Node-free.
8. Re-run graph measurement after each graph-affecting change and record every mandatory cut in `working/SLIMMING_REGISTER.md`.

## Authorized-surface justification before surgery

The new `src/capabilities/optional-capability-registry.js` is necessary because placing registry state in `ink.js` would couple the loader, lifecycle hooks, and public state reporting to the already large app entry. It is a small Core mechanism, has no FLORA-specific knowledge, creates one import edge, and prevents scattered conditionals. This is the explicit capability boundary required by P1/P4 and does not create a generalized plugin ecosystem.

