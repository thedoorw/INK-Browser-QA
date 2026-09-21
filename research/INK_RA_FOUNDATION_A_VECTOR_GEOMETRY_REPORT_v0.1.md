# INK RA Foundation A — Vector Geometry Report v0.1

STATUS: `PHASE_A_COMPLETE / PHASE_B_COMPLETE / PHASE_C_COMPLETE / PHASE_D_COMPLETE / PHASE_E_IN_PROGRESS`

## Control

```text
TASK_ID = INK-RA-001
BRANCH = work/ink-ra-001
BASE_COMMIT = 94fbdb12753feecfe3dc7053677812c96cd2cf76
FORMAT_VERSION = 4 / PRESERVED
UI_MUTATION = 0
PRODUCT_DISPLAY_VERSION_CHANGE = 0
PACKAGE_MUTATION = 0
```

## Phase A — exact INK geometry inventory

| Capability | Existing INK | Exact gap | RA candidate | External candidate | Phase-A disposition |
|---|---|---|---|---|---|
| Path/curve intersection | Polygon Boolean internally discovers flattened contour crossings; editor split uses local de Casteljau math. | No public cubic↔cubic intersection API, no stable segment/t parameters, near-tangent curve queries absent. | `compound_topology_engine.js` models reviewed crossings but does not calculate curve intersections. | Paper.js / Bezier.js | `DECISION_PENDING` |
| Boolean union/subtract/intersect/exclude | `vector-core.js:booleanPaths()` supports union, difference, intersection and xor through deterministic Bezier flattening + `polygon-clipping`; results normalize to editable INK Path and retain outer/hole roles. | Curve-exact handles are not preserved through Boolean; flatten/refit error is bounded metadata rather than exact cubic topology. | RA topology records provide semantics only. | Paper.js / Clipper2 | `KEEP_INK` pending benchmark |
| Offset/inflate/deflate | `vector-core.js:offsetPath()` offsets flattened closed rings; `outlineStroke()` composes outer/inner roles. | Line-intersection implementation lacks robust joins, miter limits, self-intersection cleanup and collapse handling; unsafe for difficult concave/negative offsets. | RA compound/generator offset supports only bounded primitive cases and approximate compound repair. | Clipper2 / Bezier.js | `DECISION_PENDING` |
| Split/project/nearest | `path-edit.js` has internal de Casteljau `splitPathSegment()` used by editor transactions. Core math has point-to-segment distance. | Split is not a shared public kernel API; cubic project/nearest and reusable curve reduction absent. | RA measurement nearest is nearest sampled-point index only. | Bezier.js | `DECISION_PENDING` |
| Compound/winding/hole integrity | INK Path owns multiple subpaths, explicit `outer`/`hole`, `evenodd`, `pathToMultiPolygon()`, `multiPolygonToPath()`, SVG topology serialization and document normalization. | Offset cleanup and ambiguous nested-contour classification need stronger validation; nonzero winding semantics are not a separate topology engine. | `compound_topology_engine.js` supplies continuity/review/weave concepts, not authoritative closed-region Boolean. | Paper.js / Clipper2 | `KEEP_INK_AUTHORITY` |
| Geometry measurement/fitting | `pathBounds()` and `pathMetrics()` provide bounds, signed/absolute area, centroid, orientation, curvature and hole count; FLORA has separate measurement gates. | No reusable line/circle/arc fitting adapter in shared vector core; no confidence/residual contract for general paths. | `geometry_measurement_engine.js` | Bezier.js for curve-local measurements | `DECISION_PENDING` |
| Topology relations | Semantic relationship graph, explicit document dependency model, hierarchy, Repeat provenance and Boolean/divide metadata already exist. | No shared computed contains/intersects/overlaps relation service over cubic paths. | `compound_topology_engine.js` / constraint records | Clipper2 / Paper.js predicates | `DECISION_PENDING` |
| Dependency/recompute | `src/recompute/dependency-graph.js` already owns typed document relations, deterministic graph construction, cycle detection and topological order; document model stores `INK-DOCUMENT-DEPENDENCY-MODEL`. | No Foundation-A geometry-operation node adapter or local invalidation executor tied to geometry outputs. | `dependency_recompute_engine.js` | None required | `KEEP_INK / ADAPT_RA_CONCEPTS_ONLY` |

### Inventory conclusion

INK already owns the editable Path, compound/hole representation, polygon Boolean normalization, object identity, document dependency model, History and Revision. Foundation A must fill only three demonstrated low-level gaps: cubic queries, robust closed-polygon offset, and reusable measurement/fitting. It must not replace the existing Boolean/document/vector stack.

## Phase B — RA module disposition

Executed:

```text
node qa/core/benchmarks/ink-ra-001/ra-module-verification.cjs
PASS
deterministicRunsEqual = true
```

The imported baseline's broader `qa/run_ra_basic_function_freeze_contract.js` also passed, including three equal deterministic replay hashes, stable IDs, save/open and JSON roundtrip.

| RA module | Verification | Disposition | Reason |
|---|---|---|---|
| `geometry_measurement_engine.js` | line/circle fitting, sampled nearest index and repeated-result equality passed | `ADAPT` | The pure measurement/fitting functions are useful and authority-neutral. Normalize them behind an INK-owned measurement result; do not import RA candidate/review state. |
| `compound_topology_engine.js` | G0/G1/G2 join analysis and simple two-line offset passed | `REFERENCE_ONLY` | Continuity vocabulary is useful, but offset is primitive-local and repair-oriented; it does not preserve closed Boolean topology, holes or difficult offset cleanup. RA review envelopes cannot become Path authority. |
| `constraint_parameter_engine.js` | parallel residual, deterministic stable ID and explicit confirmation gate passed | `DEFER` | It is a bounded semantic constraint evaluator, not a general solver. Foundation A has no demonstrated requirement to persist RA constraints/shared parameters. |
| `generator_authoring_engine.js` | deterministic four-instance rotation and unique primitive IDs passed | `REFERENCE_ONLY` | INK already owns Repeat/Transform identity. Importing RA generator documents would duplicate that authority; retain only concepts for a later parametric stage. |
| `dependency_recompute_engine.js` | topological recompute, local invalidation, cycle rejection and undo/redo passed | `REFERENCE_ONLY` | INK already has a richer typed document dependency graph plus History/Revision. RA's graph and private history must not survive as a second authority. |

### Verified limitations

- RA nearest-point is nearest sampled point, not projection onto a cubic curve.
- RA compound offset supports LINE/CIRCLE/ARC/CUBIC as independent primitives and continuity repair; it does not perform polygon cleanup, Boolean hole reconstruction or safe negative-collapse handling.
- RA constraint records remain unresolved review candidates and do not implement a general geometric solver.
- RA generator/dependency documents carry their own scene/history semantics and therefore cannot be transplanted into INK.

## Phase C — external benchmark evidence

Harness:

`qa/core/benchmarks/ink-ra-001/external-geometry-benchmark.mjs`

Execution:

```text
cd qa/core/benchmarks/ink-ra-001
npm ci --ignore-scripts
npm run benchmark

STATUS = PASS
DETERMINISTIC_RUNS = 5
REPEATED_RUN_EQUALITY = true
AVERAGE_FIXTURE_SET = 20.307 ms (local Node run; informational)
```

### Candidate identity

| Candidate | Version | Project/source | License | Browser-local/dependency observation |
|---|---:|---|---|---|
| Paper.js | `0.12.18` | `paperjs/paper.js` / npm `paper` | MIT | Browser-capable; minified full build about 240 KB, but exposes its own scene/Path authority. |
| Clipper2 TypeScript port | `2.0.1-18` | `countertype/clipper2-ts`, derived from `AngusJohnson/Clipper2` | Boost Software License 1.0 | Pure ESM/browser-local; bundled module about 125 KB; integer/safe-number coordinate contract. Upstream reports 258 reference-oriented tests. |
| Bezier.js | `6.1.4` | `Pomax/bezierjs` / npm `bezier-js` | MIT | Browser ESM; focused curve math, about 50 KB unbundled source / 21 KB generated browser bundle. |

The older npm package `clipper2-js@1.2.4` was inspected but rejected from the accepted comparison: its own README says some polygon tests still fail, and a square `-10` offset produced a malformed polygon/area rather than the expected 80×80 result. The maintained `clipper2-ts` port passed the same fixture exactly.

### Fixture evidence

| Fixture | Paper.js | Clipper2 TS | Bezier.js | Result |
|---|---|---|---|---|
| Intersecting cubic Béziers | Paper curve intersection available | Not applicable without flattening | 3 deterministic intersection clusters after epsilon de-duplication | `PASS` |
| Overlapping closed contours | union area 15000; intersection 5000 | union area 15000; intersection 5000 | Not applicable | `PASS` |
| Subtract producing hole | net area 7500; two compound children | net area 7500; two signed contours | Not applicable | `PASS` |
| Compound/hole preservation | compound child structure serializable | signed outer/hole contours retained for normalization | Not applicable | `PASS` |
| Positive/negative offset | No built-in general offset selected | +10 square area 14400; -10 square area 6400 | Curve-local offset exists but not closed join cleanup | `PASS / CLIPPER2` |
| Near-tangent intersection | Supported | Not applicable | exactly 1 intersection cluster at strict threshold | `PASS` |
| Split/project/nearest | Scene-level APIs available | Not applicable | split join exact; project returned finite `t=0.418`, distance `10.852838` | `PASS` |
| Rose-derived 12-petal radial geometry | Not needed | 12 input contours → 12 deterministic output contours | Not applicable | `PASS` |

### Comparison conclusion

- Paper.js is correct on the bounded Boolean fixtures but would add a broad parallel Path/scene system for operations INK already owns. Keep it benchmark/reference-only.
- Clipper2 TS is materially stronger than current INK offset for polygon join/cleanup and preserves signed outer/hole contours. It is suitable only behind an INK-owned integer-scaling/normalization adapter.
- Bezier.js closes the exact cubic split/project/nearest/intersection gap with the smallest authority surface. Returned intersection pairs require deterministic epsilon de-duplication.
- All benchmark outputs are plain coordinates/parameters and can be normalized into existing INK Path without persisting external objects.

## Phase D — selection matrix

Selection gate result: `PASS / BOUNDED_ARCHITECTURE_ESTABLISHED`

| Capability | KEEP_INK | ADAPT_RA | USE_EXTERNAL_ADAPTER | REFERENCE_ONLY | DEFER |
|---|---|---|---|---|---|
| Authoritative Path/subpath/anchor/compound model | `YES` | — | — | — | — |
| Boolean union/subtract/intersect/exclude | `YES — existing polygon-clipping + INK normalization` | — | — | Paper.js comparison only | Curve-exact Boolean handle preservation |
| Cubic split/project/nearest/intersection | Editor split behavior retained | — | `Bezier.js 6.1.4` behind pure INK adapter | Paper.js | — |
| Robust polygon offset/inflate/deflate | Existing offset retained as legacy bounded fallback | — | `clipper2-ts 2.0.1-18` behind scale/orientation/validation adapter | old `clipper2-js` rejected | Curve-exact joined offset |
| Measurement/fitting | Existing `pathMetrics()` retained | `fitLine` / `fitCircle` numerical concepts only, normalized to INK result | Bezier.js supplies curve-local length/project data | RA review/candidate envelope | General fitting/solver expansion |
| Compound/hole/winding authority | `YES` | — | Clipper signed contours are temporary input to INK normalization only | RA compound review vocabulary / Paper compound paths | General weave/crossing authoring |
| Dependency/recompute | `YES — INK typed graph` | — | — | RA local recompute concepts | New geometry-operation graph nodes until demonstrated |
| Generator/constraints | `YES — existing Repeat/Transform` | — | — | RA generator concepts | General constraint solver/shared-parameter persistence |
| History/Revision/mutation | `YES` | — | External objects prohibited from state | — | — |

### Frozen adapter architecture

```text
INK Path (authoritative)
  → deterministic plain cubic/polygon inputs
  → Bezier.js or Clipper2 TS temporary computation
  → validation + epsilon/scaling normalization
  → plain INK Path/result only
  → existing INK History transaction for mutation
  → existing document save/load + Revision
```

Rules frozen at this gate:

- no Paper.js product dependency;
- no RA runtime module imported from `reference/` by product source;
- no external class instance stored in Document, Path metadata, History or Revision;
- all operation IDs/results are deterministic from authoritative INK IDs + parameters;
- Clipper coordinates are scaled within JavaScript safe-integer bounds, outer/hole orientation is normalized before execution, and results are reclassified by signed area;
- Bezier intersection pairs are sorted and epsilon-de-duplicated before return;
- offset collapse/empty/unsafe input fails explicitly rather than silently falling back;
- product mutation begins only after this recorded selection gate.

This architecture does not create a parallel vector authority; Phase E may continue automatically.

## Phase E — selected adapter architecture and product changes

Pending.

## Phase F — closure validation

Pending.

## Unresolved limitations

- Phase A does not assert that an external library is safe for product inclusion.
- Existing INK offset is not accepted as robust for concave/self-intersecting/negative-collapse cases.
- Existing Boolean remains polygonized/refitted rather than curve-exact.

## Final gate

`STUDIO_VECTOR_GEOMETRY_KERNEL_INTEGRATED = OPEN`
