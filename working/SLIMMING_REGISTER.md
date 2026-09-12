# INK v0.1 Slimming Register

STATUS: `M6 FINAL GRAPH CANDIDATE`

Branch: `working/INK-v0.1-structure-optionalization`

Baseline: `b1f65193b63fa3e2403752a197e19c998fd88ce6`

Principle: only dependency-driven changes to the mandatory browser graph. No product, QA, Validation, research, governance, or historical file was deleted.

## Runtime cuts and decisions

| Item | Previous dependency | Action | Reason | Preserved location | Regression risk | Verification |
|---|---|---|---|---|---|---|
| FLORA action layer | `src/ink.js` statically imported `src/flora/index.js` and synchronously installed all 37 FLORA modules | replaced with one registered literal dynamic loader | general INK must start without loading FLORA | all source remains under `product/source/src/flora/**` | high: startup and action reachability | detached and enabled Windows Run `34666438827`: PASS; representative Hero action: PASS |
| FLORA mask helpers | Core renderer statically imported three symbols from `src/flora/mask/vector-mask.js` | moved masking and inspection behavior into FLORA-installed hooks | Core must not know FLORA rendering internals | `src/flora/index.js` and `src/flora/mask/vector-mask.js` | high: masked painting and inspection rendering | FLORA-enabled Windows gate: PASS; capability hook tests: PASS |
| FLORA render batching | Core tested `object.floraPaint` directly | replaced with domain-neutral `requiresIndividualRender` hook | eliminate domain field knowledge from Core | FLORA hook owns the existing field semantics | medium: natural-media batching | full JS syntax PASS; detached/enabled Runtime PASS |
| FLORA document cache reset | Core directly called `this.flora.hero.cache.clear()` | replaced with `documentReplaced` lifecycle notification | eliminate direct specialty object dependency | cache behavior remains in FLORA hook | medium: stale mask cache after load/reload | capability attach/action test PASS; Windows enabled gate PASS |
| Dead Core import bindings | `boundsContains`, `boundsIntersect`, `polygonContains`, `allObjects`, `renderTiledCanvas` appeared only in import declarations | removed unused bindings | no live call site; reduce stale API wiring without removing modules | defining modules and exports unchanged | low | exact-symbol scan, JS syntax scan, graph remeasurement; Windows Run `34666929560`: PASS |
| Dead Studio import binding | `createImageSnapshot` appeared only in the import declaration | removed unused binding | no live call site; does not reduce Raster/Image capability | `src/image/image-core.js` export unchanged | low | exact-symbol scan, JS syntax scan; Windows Run `34666929560`: PASS |

## Inspected and intentionally retained

| Item | Decision | Reason |
|---|---|---|
| AI graph (4 modules / 149,413 bytes) | RETAIN mandatory | Current Work Order forbids AI optionalization |
| Recipe engine (1 module / 41,656 bytes) | RETAIN mandatory | Current Work Order forbids Recipe optionalization and Core/Recipe capabilities are coupled |
| PWA manager (2 eager modules / 3,077 bytes) | RETAIN | PWA boundary change is not required for FLORA separation |
| `index-standalone.html` and `dist/ink.compat.js` | RETAIN outside primary ESM entry | compatibility/history value; service-worker precache still references them; no authorized package work |
| Runtime assets and schemas | RETAIN | not eager JS graph members; boundary is unchanged |
| all QA / Validation / research / governance / history | RETAIN | evidence and preservation invariants |

## Before / after mandatory Runtime graph

| Metric | Before | After M4 | Delta |
|---|---:|---:|---:|
| reachable eager JS modules | 133 | 97 | -36 (-27.1%) |
| reachable eager JS bytes | 1,458,009 | 1,040,023 | -417,986 (-28.7%) |
| static ESM edges | 296 | 215 | -81 (-27.4%) |
| FLORA modules in mandatory graph | 37 | 0 | -37 |
| FLORA bytes in mandatory graph | 420,473 | 0 | -420,473 |
| literal optional edges | 0 | 1 | +1 (`src/ink.js -> src/flora/index.js`) |
| optional FLORA source | 37 modules / 420,473 bytes | 37 modules / 423,935 bytes | source preserved; hooks added |

The net module delta is -36 rather than -37 because one 3,649-byte Core capability registry was added. Total `product/source` is informative only: 199 files / 1,994,968 bytes after M4; it is not the optimization target.

## M4 conclusion

The meaningful payload reduction is the removal of FLORA from the mandatory dependency graph. No further module cut was proven safe within this work order. AI, Recipe, PWA, compatibility launchers, assets, and evidence remain preserved rather than being removed for file-count reduction.

## Final M6 graph candidate

| Metric | Before | Final candidate | Delta |
|---|---:|---:|---:|
| reachable eager JS modules | 133 | 97 | -36 (-27.1%) |
| reachable eager JS bytes | 1,458,009 | 1,044,783 | -413,226 (-28.3%) |
| static ESM edges | 296 | 217 | -79 (-26.7%) |
| FLORA modules in mandatory graph | 37 | 0 | -37 |
| FLORA bytes in mandatory graph | 420,473 | 0 | -420,473 |
| literal optional edges | 0 | 1 | +1 (`src/ink.js -> src/flora/index.js`) |
| optional FLORA source | 37 modules / 420,473 bytes | 37 modules / 423,935 bytes | source preserved; hooks added |

The final candidate retains the same 97-module mandatory topology as M4. Its additional bytes and two static edges come from live `INK v0.1` identity observability and the bounded query-gated regression smoke, not from FLORA, AI, Recipe, or other optionalization expansion.
