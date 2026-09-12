# INK WORKING STATUS

STATUS: `IN_PROGRESS`

Product: `INK v0.1`

Branch: `working/INK-v0.1-structure-optionalization`

Authoritative work order: `ACTIVE/INK_CURRENT_WORK_ORDER.md`

Baseline commit: `b1f65193b63fa3e2403752a197e19c998fd88ce6`

Latest commit: `ddfb400e5f4e78e714125b1e56b09643629686ad` (latest verified Runtime-bearing commit)

Latest verified Runtime baseline:
- Workflow: `INK v0.1 Runtime Baseline`
- Run ID: `34667753479`
- Result: `PASS`
- Runner: `DESKTOP-NSOQH69`
- OS: Windows
- Browser: Chrome
- Node required: No

## Current milestone

`M6 — Regression closure: IMPLEMENTED / WINDOWS INTERACTION GATE PENDING`

## Files changed

- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `engineering/runtime-dependency-graph.mjs`
- `.github/workflows/ink-v0.1-runtime-baseline.yml`
- `product/source/src/capabilities/optional-capability-registry.js`
- `product/source/src/flora/index.js`
- `product/source/src/ai/install-ai.js`
- `product/source/src/ink.js`
- `product/source/src/studio-core.js`
- `product/source/index.html`
- `product/source/index-standalone.html`
- `product/source/service-worker.js`
- `qa/core/tests/unit/optional-capability-registry-v01.test.mjs`
- `working/DEPENDENCY_MAP.md`
- `working/IDENTITY_REGISTER.md`
- `working/SLIMMING_REGISTER.md`
- `working/WORKING_STATUS.md`

## Authorized-surface justification

- `engineering/runtime-dependency-graph.mjs` will be added as a focused, read-only graph measurement helper required by Current Work Order Gate F. It lives outside Runtime, introduces no product dependency, and makes before/after module and byte counts reproducible.
- `.github/workflows/ink-v0.1-runtime-baseline.yml` will later be adjusted within the explicitly authorized workflow surface so this DEV branch actually runs the authoritative Windows gate and can report detached/enabled evidence.
- `product/source/src/capabilities/optional-capability-registry.js` will be added as the one small, domain-neutral install/lifecycle/render boundary required by P1/P4. Keeping it separate from the 170 KB entry avoids new scattered conditionals and does not create a generalized plugin ecosystem.
- `product/source/index-standalone.html` requires identity-only normalization because it remains a user-loadable compatibility launcher and is still precached by the live service worker. Its compatibility behavior and historical role will not change.
- `product/source/service-worker.js` requires one dependency-list update because `src/capabilities/optional-capability-registry.js` is now a mandatory Core import. This keeps the existing offline shell internally complete without changing PWA architecture.

## Decisions already fixed

- Product identity remains `INK v0.1` throughout development.
- FLORA is to become optional, not deleted.
- General INK Runtime must survive without FLORA loaded.
- Evidence / Validation / research remain preserved.
- Node-free Windows Runtime baseline remains authoritative for startup compatibility.
- This work ends at READY_FOR_REVIEW; no single-file Candidate or certification is authorized.

## Required DEV outputs

Completed:
- `working/DEPENDENCY_MAP.md`
- baseline mandatory graph: 133 modules / 1,458,009 bytes
- exact FLORA coupling list and frozen planned change list
- one domain-neutral optional capability registry
- all static Core-to-FLORA import edges removed
- FLORA detached from `InkApp` construction and general renderer evaluation
- lifecycle/render hooks replace Core FLORA call sites
- capability state unit checks: PASS (3/3)
- full `product/source/src/**/*.js` syntax scan: PASS
- M2 Windows / Chrome / Node-free Runtime: PASS — Run `34665925650`
- FLORA-owned masking, individual-render, inspection overlay, and document-replaced hooks
- explicit attach path: `window.INK_CAPABILITIES.install('flora')`
- explicit browser-enabled mode: `?ink-capability=flora`
- representative FLORA Hero initialization unit check: PASS
- capability state and failure isolation unit checks: PASS (4/4 total)
- M3 detached Core + FLORA-enabled Windows / Chrome / Node-free Runtime: PASS — Run `34666438827`
- dependency-driven removal of six proven dead import bindings
- `working/SLIMMING_REGISTER.md` with cut, retain, risk, preservation, and verification decisions
- final M4 eager graph: 97 modules / 1,040,023 bytes; 0 FLORA modules
- M4 detached Core + FLORA-enabled Windows / Chrome / Node-free Runtime: PASS — Run `34666929560`
- current-product HTML, Studio facade, AI facade, importer construction, and demo surfaces normalized to `0.1`
- component protocol, schema, `FORMAT_VERSION = 4`, and historical evidence identities preserved
- mandatory capability registry added to the existing PWA shell dependency list
- M5 focused local verification: Program Import / Document / AI / Chat `20/20`; optional capability registry / FLORA attach `4/4`
- M5 Windows / Chrome / Node-free Runtime: PASS — Run `34667753479`
- live Runtime / Studio / AI identities: `0.1 / 0.1 / 0.1`; document format: `4`
- bounded query-gated Core interaction smoke covering initialization, stroke creation, undo/redo, layer create/reorder/delete, selection/transform, serialization, SVG export initialization, persistence save/load, reload, and FLORA-detached state
- M6 focused local verification: workflow YAML PASS; all Runtime JS syntax PASS; Document / History / Storage / Program Import / AI / Chat `26/26`; optional capability registry / FLORA attach `4/4`
- final candidate graph: 97 modules / 1,044,724 bytes; 217 static edges; one optional dynamic FLORA edge

Pending:
- Windows M6 Core interaction / persistence evidence
- Windows M6 detached and enabled evidence on the same Runtime-bearing commit

## Unresolved risks

- Windows Run `34677440349` exposed a smoke-harness timing issue: Chrome serialized the DOM while the IndexedDB Promise was still pending (`data-ink-core-smoke="running"`). The product startup check passed; the smoke now uses synchronous browser localStorage plus the formal document reload path, while the storage module is separately covered by passing unit tests. Windows rerun is pending.
- M5 live identity and service-worker dependency completeness passed the Windows gate; AI/Recipe architecture and PWA behavior remain unchanged.
- Studio Core also couples Recipe / AI; do not widen scope unless required for a clean FLORA seam.
- Historical version literals may represent protocol/schema/component identity rather than current product identity; classify before changing.
- Browser startup PASS does not by itself prove interaction or persistence behavior.

## Latest results

- Runtime startup: `PASS` — Run `34667753479`, commit `ddfb400e5f4e78e714125b1e56b09643629686ad`.
- Core interaction: `LOCAL STRUCTURE READY / WINDOWS PENDING`
- Persistence: `LOCAL STRUCTURE READY / WINDOWS PENDING`
- FLORA detached: `PASS` — no eager FLORA module and Windows Node-free startup passed.
- FLORA enabled: `PASS` — installed state, representative Hero action, failure absent, and Chrome error absent all verified by Run `34666438827`.
- Runtime graph before: `133 modules / 1,458,009 bytes` (FLORA: 37 modules / 420,473 bytes)
- Runtime graph after M2: `97 modules / 1,039,420 bytes`; FLORA eager graph `0 modules / 0 bytes`; optional dynamic edge `src/ink.js -> src/flora/index.js`.
- Runtime graph after M4: `97 modules / 1,040,023 bytes`; FLORA optional source `37 modules / 423,935 bytes`; static edges `215`; dynamic optional edges `1`.
- Runtime graph final M6 candidate: `97 modules / 1,044,724 bytes`; FLORA eager graph `0 modules / 0 bytes`; optional FLORA source `37 modules / 423,935 bytes`; static edges `217`; dynamic optional edges `1`.

## Next authorized step

Commit and push the M6 Runtime-bearing verification surface, then require the Windows Node-free Runtime, Core interaction/persistence, FLORA detached, and FLORA enabled checks to PASS before marking `READY_FOR_REVIEW`.
