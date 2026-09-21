# RA Geometry Brain Transition Brief v1.0

## 1. Frozen RA capability

RA now provides the stable notebook and pen needed by an AI Geometry Brain: evidence/working/formal/runtime/review separation; Observation–Hypothesis–Decision records; selected, rejected and unresolved candidates; confidence and provenance; stable IDs; semantic Recipe; topology relations; version and replay identities; deterministic compile/replay; Save/Open; JSON roundtrip; Undo/Redo; and iCAD Recipe v1.1 exchange.

The pen can express LINE, CIRCLE, ARC, ELLIPSE, POLYLINE and SPLINE, plus OFFSET, COMPOUND, BOOLEAN, HOLE, ISLAND, shared parameters, generators, arrays and transforms. It does not decide which primitive or topology is correct.

## 2. Responsibilities excluded from the frozen RA core

The Geometry Brain—not RA—must infer global structure, primitive choice, route continuity, loop/hole/island relationships, crossing and occlusion, symmetry and repetition grammar, perspective correction, controlled deviations, uncertainty and refusal. Poor resemblance or a low similarity score is not itself an RA Tool Gap.

## 3. Standard 10 diagnostic cases

### PL-036 — GEOMETRY_BRAIN_BLOCKED

The central route graph remains ambiguous. The current model does not reliably distinguish crossing, over/under, occlusion, shared boundary and separate compound. Future reasoning should build global route candidates first, score continuity and negative-region consequences, and refuse formalization when competing topologies remain equivalent.

### PL-094 — GEOMETRY_BRAIN_BLOCKED

The primary curve band, tangent continuity and center-hole interpretation remain unresolved. The Geometry Brain should infer a center path and width field, then compare boolean subtraction, compound hole and occlusion opening counterfactuals. Pixel score must not choose the topology.

### PL-104 — GEOMETRY_BRAIN_PARTIAL

A shared repeated structure is present, but the current candidate is over-regularized. The next rule should preserve a generator while allowing bounded per-instance displacement, compression, spacing and central twist. Mechanical symmetry needs an explicit penalty when local evidence contradicts it.

### PL-133 — GEOMETRY_BRAIN_PARTIAL

Central ellipse and stripe grammar exist, but stripe endpoints, occlusion cuts, top micro-form and negative-space cause are incomplete. Candidate competition must distinguish gap, hole, occlusion and boolean subtraction and verify that z-order persists through Save/Open.

### PL-034 — GEOMETRY_BRAIN_PARTIAL

The four-lobe grammar and shared parameters exist, but curvature, thickness, fold hierarchy and local rhythm remain too uniform. The Brain should use a shared generator with bounded deviations and keep shading/surface roles separate from geometric boundaries.

## 4. General reasoning improvements

### Observation / Hypothesis / Decision

Observations should identify measurable landmarks and continuity breaks without prematurely naming primitives. Hypotheses should include lower-complexity primitives, compounds and topology alternatives. Decisions must record rejected candidates, missing evidence, confidence and explicit refusal conditions.

### Primitive competition

Use LINE, CIRCLE, ARC and ELLIPSE first; then compound LINE/ARC or cubic Bezier; use SPLINE only after lower-level candidates fail. Compare editability, tangent/curvature continuity, parameter sharing and topology consequences—not only pixel similarity.

### Topology reasoning

Maintain a separate graph for contains, inside, touches, intersects, overlaps, occludes, occludedBy, sharesBoundary, drawOrder and canvasCrop. Separate measured, inferred and unresolved edges. Check hole/island validity and occlusion cycles before formal promotion.

### Counterfactual reconstruction

For each major ambiguity, render at least two competing semantic candidates using the same Reference, crop, ROI, mask and metric algorithm. Compare route continuity, hole/island consequences, negative spaces and neighboring decisions. Do not use masks or z-order to hide a geometric contradiction.

### Uncertainty and refusal

Confidence must reflect evidence sufficiency, not merely score separation. If topology alternatives remain structurally equivalent, retain `UNRESOLVED` or `GEOMETRY_BRAIN_BLOCKED`. Silent Formalization is prohibited.

## 5. Next benchmark method

Use Standard 10 as a diagnostic suite. For each new Geometry Brain rule, run blind candidate generation, record O/H/D and rejected candidates, compile through the frozen RA baseline, compare deterministic Runtime and topology, then measure cross-case improvement. A rule is accepted only if it generalizes across cases without adding case-specific identifiers or hard-coded coordinates.

## 6. Prohibition

Do not add one-off rules for PL-036, PL-094, PL-104, PL-133 or PL-034. Any new rule must be expressed as a general observation, primitive-competition, topology or uncertainty rule and evaluated on multiple cases.
