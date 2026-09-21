# INK RA Foundation A — Vector Geometry Report v0.1

STATUS: `PHASE_A_COMPLETE / PHASE_B_COMPLETE / PHASE_C_IN_PROGRESS`

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

Pending isolated benchmark.

## Phase D — selection matrix

Pending.

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
