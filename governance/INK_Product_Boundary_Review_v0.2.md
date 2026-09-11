# INK Product Boundary Review v0.2

STATUS: `REVIEWED / CANDIDATE BUILD DIRECTION`

BASELINE: `main` after full original import promotion.

## Purpose

Define the first product-build boundary without deleting preserved source or historical evidence. This document does not certify a product build.

## Evidence reviewed

- `product/source/src/ink.js` directly imports FLORA, PWA, Studio Core and other core runtime modules.
- `product/source/src/studio-core.js` directly imports Vector, Raster/Image, Recipe, Paint, Program Import and AI.
- Browser runtime dependency graph from `src/ink.js` currently contains 133 JavaScript modules.
- Current runtime graph includes 37 FLORA modules, 4 AI modules, 1 Recipe engine module, 2 PWA modules and 1 asset-migration module.
- `index.html` links `manifest.webmanifest` and external `styles.css` and runs as a modular browser application; current `index-standalone.html` is not a true self-contained single-file build.
- No icon files exist in the authoritative source ZIP although manifest / service worker refer to `icons/ink-192.png` and `icons/ink-512.png`.
- AI schema paths are used as schema references/contracts; the inspected AI runtime does not require fetching those schema files to execute core logic.

## Product definition for first Candidate

INK's primary product identity remains a general creation tool combining hand drawing, vector editing and raster/image editing. The following are accepted as PRODUCT CORE for the first build:

- UI shell / canvas / panels
- Drawing / Stylus input
- Stroke editing
- Vector
- Raster / Image
- Natural Media
- Document / Storage
- History
- Selection / Transform / Spatial
- Render
- Export / Print
- Material
- Recompute
- Program Import
- Release health / diagnostics required by the runtime

## Boundary decisions

### 1. FLORA — OPTIONAL SPECIALIZATION; exclude from first general INK Candidate

Decision: `OPTIONAL_CAPABILITY`.

Reason:
- FLORA is domain-specific botanical specialization rather than a general drawing/vector/raster primitive.
- All 37 FLORA modules are concentrated under `src/flora/**`.
- The current coupling is visible and bounded: `src/ink.js` directly imports the FLORA action layer and vector-mask helpers.
- Removing FLORA from the first general Candidate therefore requires explicit decoupling, not deletion of the preserved source.

Preservation rule: keep all FLORA source in the repository. Do not delete it.

### 2. AI — retain in first Compatibility Candidate; optionalize later

Decision: `CANDIDATE_RETAIN / FUTURE_OPTIONAL`.

Reason:
- AI is already installed through `studio-core.js` and participates in the current browser dependency graph.
- Removing it now would require Studio Core refactoring and would mix product-boundary work with capability redesign.
- Keeping it in the first Candidate minimizes regression risk while preserving the existing product behavior.

This is not a declaration that AI is permanent INK Core. A later bounded refactor may move it behind an optional capability interface.

### 3. Recipe — retain in first Compatibility Candidate

Decision: `CANDIDATE_RETAIN`.

Reason:
- Recipe is currently used by Studio Core and Program Import flows.
- Program translation/execution registers and executes Recipe objects.
- Recipe therefore currently supports broader automation/import behavior and cannot safely be treated as only a FLORA feature.

A later refactor may separate generic Recipe infrastructure from botanical recipes.

### 4. PWA / service worker — exclude from first self-contained INK.html

Decision: `NOT_REQUIRED_FOR_FIRST_SINGLE_FILE_CANDIDATE`.

Reason:
- PWA installation/offline update behavior is not required for the core drawing/editing/export product.
- The authoritative package contains broken icon references.
- A self-contained `INK.html` should not require an external manifest or service-worker file.

Preservation rule: keep PWA source in repository for a later optional installable-web-app package.

### 5. Runtime assets — embed only assets actually required by the Candidate

Decision: `BUILD_TIME_EMBED_OR_EXCLUDE_BY_REACHABILITY`.

- Do not delete source assets.
- Assets required by runtime behavior must be embedded into the single-file build or represented internally.
- Research/reference assets not required at runtime stay in repository but are not copied into `INK.html` merely because they exist.

### 6. Schemas — preserve as contracts; no external runtime dependency allowed

Decision: `PRESERVE / EMBED ONLY IF EXECUTION_REQUIRES`.

- Schema files remain authoritative API/data-contract evidence in the repository.
- The first self-contained Candidate must not depend on external schema files being present next to `INK.html`.
- Where runtime only exposes a schema reference string, no external file fetch should be introduced.
- If any schema is actually required for execution during build verification, it must be embedded or its validator logic bundled.

## First Candidate architecture

```text
INK GENERAL CORE
├─ UI shell
├─ Drawing / Stylus
├─ Stroke editing
├─ Vector
├─ Raster / Image
├─ Natural Media
├─ Document / Storage
├─ History
├─ Selection / Transform / Spatial
├─ Render / Export / Print
├─ Material / Recompute
├─ Program Import
├─ Recipe (retained for compatibility)
└─ AI (retained for compatibility)

OPTIONAL / NOT IN FIRST GENERAL CANDIDATE
├─ FLORA
└─ PWA install/offline shell

PRESERVED CONTRACT / DATA
├─ schemas
└─ non-runtime research/reference assets
```

## Required implementation sequence

1. Create a build-only decoupling of FLORA from `src/ink.js` without deleting FLORA source.
2. Build a Compatibility Candidate retaining AI + generic Recipe behavior.
3. Inline HTML/CSS/JavaScript and all truly required runtime data into one `INK.html`.
4. Do not register a service worker and do not require `manifest.webmanifest` in the single-file Candidate.
5. Verify no unresolved external runtime paths remain.
6. Run smoke tests for drawing/stylus, vector, raster/image, history, program import, Recipe/AI compatibility, export and print.
7. Produce only after PASS:
   - `INK.html`
   - `WORKING_STATUS.md`
   - `SHA256SUMS.txt`

## Non-goals

- Do not delete FLORA, AI, Recipe, PWA, schema or asset source from the repository.
- Do not redesign UI in this phase.
- Do not change version identity yet.
- Do not mark a build certified until runtime verification passes.
