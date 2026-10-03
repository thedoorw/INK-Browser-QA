# CHAT / Core / Live authority — 2026-10-03

USER appoints the current Codex authority to supervise remaining CHAT capability / Core / Live work only. UI and other research/program authorities remain independent.

## Ownership

The authority owns scoped prioritization, bounded architecture decisions, review, source integration, exact deployment identity and findings/progress closure. Existing DEV/QA/Live execution owners continue; no active task is reassigned by this appointment. DEV evidence is not self-acceptance. GitHub is the shared handoff authority, not a claim of background monitoring or communication to other sessions.

Source SSOT: thedoorw/INK-Browser-QA. Live mirror: thedoorw/INK.
Product changes belong in source; Live receives accepted builds and test records.
Preserve existing Document, History, Renderer, Path, Stroke, deformation and Recipe authorities. FORMAT_VERSION remains 4; changes require USER authorization.

B4 remains binding: transform-advanced.js owns projective math/planning; deformation.js owns native Path mutation and reversible state; chat-bounded-edit.js owns bounded orchestration only. Direct CHAT anchor mutation and a second deformation model remain unauthorized.

## Acceptance gate

Existing native authority → bounded CHAT exposure → exact candidate → focused QA and affected regressions → authority review → PR/source integration → deployment identity verification → Formal Live execution → findings/progress closure.

Unit PASS, candidate readiness, PR readiness, deployment alone and first Live timeout are not completion. Separate infrastructure failure from executed product failure. Recheck latest main and affected authority blobs before integration; preserve concurrent work. Escalate new architecture, FORMAT_VERSION or ownership conflicts with concrete evidence; routine bounded work continues.

## Audited checkpoint and queue

Execution always starts from latest main; accepted product/source identity is recorded separately from documentation-only main commits.

Closed / formally Live-qualified CHAT routes:
- A1 Paint Session;
- A2 native Stroke / Natural Media / Airbrush;
- A3 Paper exposure plus later single-stroke Paper integration and WebGL roughness parity;
- A4 targeted native Stroke Eraser;
- A5 Blender / Smudge on existing multi-channel pigment authority;
- B0/B1 web-raster bridge + mutable web-raster named-tool import;
- B2 representative non-destructive image stack: brightnessContrast / gaussianBlur / multiply / colorOverlay / twirl;
- B3.1 Paint Bucket;
- B3.2 raster Mask plus raster-pixel/mask stale fingerprints;
- B3.3 Spot Healing;
- B3.4 non-source local retouch: dodge / burn / sponge / local blur / local sharpen / color replacement;
- B3.5 source-dependent retouch: Clone Stamp / Healing Brush / Patch with explicit raster-local source contracts;
- B4 native Path warp / distort / perspective;
- advanced mutable raster ingest: PSD / TIFF / EXR Formal Live qualified; RAW adapter contract candidate-qualified with explicit default-runtime unavailability.

Latest accepted Live product source at this checkpoint:
`8d5a8ee9fdd0b4e2c63d910e75f29d48514ccf3f` (advanced mutable raster ingest, including B3.5 and accepted Core cache optimization).

B3 direct/local raster scope is closed for the qualified CHAT routes above. Pattern Stamp remains separate because its pattern-payload/asset contract is not yet defined; do not silently broaden B3.5 PASS to Pattern Stamp.

Remaining authority queue is:
- Cluster C native pages, align/distribute, snapping/guides and artboard operations;
- Cluster D existing Material / Recipe authorities and one governed execution route;
- Text warp / curved-text product rendering integration.

Representative coverage never implies every enum variant is qualified. Registry counts alone do not close capabilities. Empty default catalogs do not prove missing engines. UI C04/C06, New Document/A4 redesign and external workflow-IR research are outside this appointment.


## Cluster C1 authority closure — 2026-10-03

Cluster C1 native page lifecycle is accepted and formally Live-qualified.

- PR #145;
- exact candidate `8eb49051618ed0c12f4da5fc6e2c8a5cf0c6715b`;
- merged/deployed source `dfb197ca31dc1e2e5ca46c6452e998dce44c57c6`;
- candidate A2/A3/B1/B2 regressions PASS;
- Formal Live `clusterC-C1-page-ops-live-002`, run `37104322420`;
- create/duplicate/delete/rename/activate PASS;
- duplicate identity rekeying, navigation-only activate, delete Undo/Redo, stale/no-op guards, and minimum-one-page invariant PASS;
- no New Document/A4 redesign, second page/History/navigation authority, UI change, or FORMAT_VERSION change.

Remaining Cluster C queue:
1. C2 explicit-target align / distribute through existing `InkApp.alignSelection()` + `applyWorldTransformBatch()`;
2. C3 snap settings + ruler guides;
3. C4 bounded artboard state mutation.

```text
C1_PAGE_OPERATIONS = CLOSED
NEXT_AUTHORITY_QUEUE = C2_ALIGN_DISTRIBUTE
```


## Cluster C2 authority closure — 2026-10-03

Cluster C2 explicit-target align / distribute is accepted and formally Live-qualified.

- PR #147;
- exact candidate `6994160cae577f57e858919e261a57aa7f5fea18`;
- merged source `f8035bd862825b913d0157f51c62de15bbb9d29e`;
- integrated Formal Live source `f56e492af4954ae6da3be39cf10d2dbe2859d87e`;
- candidate C1/B4/A2/B2 regressions PASS;
- Formal Live `clusterC-C2-align-distribute-live-001`, run `37108065303`;
- `left` and `distributeX` executed through the existing `InkApp.alignSelection()` / `applyWorldTransformBatch()` authority with scoped History and Undo/Redo;
- candidate additionally qualified `centerX`, prior-selection restoration, and the minimum-three-target distribution guard;
- no second layout authority, pointer simulation, UI change, History redesign, or FORMAT_VERSION change.

Remaining Cluster C queue:
1. C3 snap settings + ruler guides through existing precision-layout / InkApp wrappers;
2. C4 bounded artboard state mutation.

```text
C2_ALIGN_DISTRIBUTE = CLOSED
NEXT_AUTHORITY_QUEUE = C3_SNAP_GUIDES
```
