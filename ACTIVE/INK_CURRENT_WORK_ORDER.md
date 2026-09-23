# INK CURRENT WORK ORDER

STATUS: `INK-CHAT-VALIDATION-001 / MR_REVISE / PHASE_B_LINE_COLOR_DECOMPOSITION`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-CHAT-VALIDATION-001` |
| PHASE | `B — REFERENCE → LINE + COLOR LAYERS` |
| TITLE | `CHAT Reference Decomposition Validation v0.1` |
| DEV_BRANCH | `work/ink-chat-validation-001-phase-b` |
| FORMAT_VERSION | `4 / PRESERVE` |
| NEW_DRAWING_ENGINE | `PROHIBITED` |
| DOCUMENT_AUTHORITY_CHANGE | `PROHIBITED` |
| HISTORY_AUTHORITY_CHANGE | `PROHIBITED` |
| REVISION_AUTHORITY_CHANGE | `PROHIBITED` |
| USER_REFERENCE_FILE_PUBLIC_COMMIT | `PROHIBITED` |
| GITHUB_HOSTED_DEV_WORKFLOW | `PROHIBITED` |

## Product intent

Phase A is closed. Do not reopen upload / cross-realm hardening.

Phase B proves the next real creative step:

```text
existing INK Reference
→ deterministic decomposition
→ editable Color regions
→ editable boundary Line paths
→ separate Color / Line layers
→ normal History / Audit / Provenance record
→ inspectable result
```

The first acceptance target is the user's current flat-color flower reference.

## Required result

Starting from an already imported Reference object, produce:

```text
Line layer
  editable Path objects
  fill = none
  stroke = visible
  boundary-line semantics

Color layer
  editable closed Path objects
  fill = extracted / quantized source color
  stroke = none

Reference
  remains available as the source image
```

Required layer order for the fresh validation document:

```text
Line
Color
Reference / existing source layer
```

If moving/renaming the Reference layer would require unsafe assumptions about unrelated objects, leave the Reference in its existing layer and create only the two required sibling layers. Do not move unrelated content.

## Extraction strategy

Use the smallest mature path already present in INK.

Preferred implementation:

```text
Reference raster
→ existing ImageTracerJS / existing vector import machinery
→ bounded deterministic color quantization / color-region trace
→ editable filled Paths
→ derive aligned boundary-line Paths from the same region geometry
```

Rules:

- reuse existing decoder, ImageTracerJS/vendor, Path import and Path model where practical;
- no remote model, no network acquisition, no IMAGE model;
- do not build a new segmentation platform;
- do not require semantic labels such as petal / leaf / stamen in this phase;
- do not implement centerline skeleton tracing;
- Line means visible region-boundary line art;
- color fidelity may be quantized, but regions must remain editable vectors;
- Line and Color geometry should remain aligned by deriving them from the same accepted region geometry whenever possible.

## Authoritative operation

CHAT must be able to invoke a bounded operation against an existing Reference object.

Acceptable shape:

```text
referenceObjectId
→ authoritative decomposition operation
→ History mutation
→ Color layer + Line layer
→ source/provenance linkage
→ receipt
```

Do not directly rewrite document JSON from the CHAT boundary.

The receipt must include at minimum:

- source Reference object ID;
- source SHA where available;
- Color layer ID;
- Line layer ID;
- generated Color object IDs/count;
- generated Line object IDs/count;
- extracted/quantized palette summary;
- History before/after;
- Audit identity where available;
- Provenance/source linkage;
- status/error.

No automatic Revision is required.

## Acceptance

Phase B passes when browser Runtime proves:

1. existing Reference object is used as source;
2. at least one editable Line Path is produced;
3. multiple editable filled Color regions are produced for a multi-color fixture;
4. Line objects have no fill and have visible stroke;
5. Color objects have fill and no stroke;
6. Line and Color are on separate named layers;
7. source/reference identity is retained;
8. operation creates normal History evidence;
9. CHAT receipt is inspectable;
10. existing manual Reference / extraction flow still works;
11. UI / Creative / Geometry regression suites pass.

MR private acceptance will then use the user's `1.jpg` without committing it.

## Scope stop

Do not add:

- semantic object recognition;
- SAM/model acquisition;
- perfect botanical part labeling;
- centerline extraction;
- manual correction UI redesign;
- preview return to CHAT;
- Phase C composition;
- new document schema;
- new layer authority;
- broader UI redesign.

This phase is only:

```text
Reference → editable Color + Line → separate layers
```

## DEV completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CHAT-VALIDATION-001
PHASE = B_LINE_COLOR_DECOMPOSITION
PRODUCT_SCOPE = BOUNDED
PHASE_A = CLOSED / DO_NOT REOPEN
PHASE_C = NOT_STARTED
FORMAT_VERSION = 4
USER_IMAGE_COMMITTED = 0
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## MR Phase B Runtime checkpoint — 79af1c96a55635f6b8471e1ee02edade9fb25dac

```text
SOURCE_REVIEW = PASS
DEV_HEAD = 79af1c96a55635f6b8471e1ee02edade9fb25dac
RUNTIME_RUN = 35854909964
TESTED_SHA = 79af1c96a55635f6b8471e1ee02edade9fb25dac
RUNNER = DESKTOP-NSOQH69
UI = PASS
CREATIVE = FAIL / HARNESS_TIMEOUT_240S
GEOMETRY = NOT_REACHED
ARTIFACT = 10747521014
ARTIFACT_DIGEST = sha256:7569e8327cd411d998ea72bde1fa0915c18d1b37084e4e6c4070c465979283a8
PRIVATE_USER_1_JPG = HELD
DECISION = MR_REVISE
```

### Runtime blocker

Phase B currently sends the full decoded source raster directly into synchronous ImageTracerJS color-region tracing:

```text
full Reference raster
→ imagedataToTracedata(...)
→ color quantization / path trace
```

The decoder accepts images up to the existing raster limit, while the new color-region path has no smaller workload bound before the synchronous tracer call. In the authoritative browser Runtime the Creative suite did not return evidence within 240 seconds.

This is a practical execution blocker, not a request for more upload hardening.

### Bounded revision

Do not redesign Phase B.

1. Make `color-regions` tracing computationally bounded before entering synchronous ImageTracerJS.
2. Prefer a bounded trace raster / deterministic downsample if needed, then map generated vector geometry back into original Reference coordinate space.
3. Preserve source SHA, Reference identity, editable Path output, Color/Line alignment, separate layers, History/Audit/Provenance, and FORMAT_VERSION 4.
4. Do not lower quality by flattening the result to raster.
5. Do not merely increase the global 240-second Runtime timeout.
6. No semantic labeling, centerline tracing, UI redesign, Phase C, or new extraction engine.
7. Browser QA only needs to prove the Phase B operation returns in a practical bounded time and all existing Phase B assertions still pass.

Return:

```text
DEV_HANDOFF → MR_REVIEW_REQUIRED → STOP
```


## MR Phase B Runtime checkpoint — 1ad65b932835ef754b7d42291f7e70cdcd048925

```text
SOURCE_REVIEW = PASS
DEV_HEAD = 1ad65b932835ef754b7d42291f7e70cdcd048925
RUNTIME_RUN = 35860798446
TESTED_SHA = 1ad65b932835ef754b7d42291f7e70cdcd048925
RUNNER = DESKTOP-NSOQH69
UI = PASS
CREATIVE = FAIL / HARNESS_TIMEOUT_240S
GEOMETRY = NOT_REACHED
ARTIFACT = 10750058548
ARTIFACT_DIGEST = sha256:cf43a094bbe926e7bf61158da7b3d4e6f765d211ee6143ad23f1c7a88caf8261
PRIVATE_USER_1_JPG = HELD
DECISION = MR_REVISE
```

### Finding

The first performance revision is structurally correct:

```text
full source raster
→ deterministic bounded work raster
→ ImageTracerJS color-regions
→ source-coordinate matrix remap
```

and preserves editable Color/Line geometry and the accepted authorities.

However, the authoritative Windows browser Runtime still does not complete the Creative suite within 240 seconds. The current upper bound of 160,000 trace pixels / 512 px dimension is therefore not a practical bound for this validation path.

Do not add more architecture or diagnostics. This is now a tuning correction only.

### Bounded revision — validation-grade trace budget

1. Keep the existing deterministic work-raster + source-coordinate remap design.
2. Reduce the synchronous ImageTracerJS color-regions workload substantially; target an initial upper bound no greater than:
   - 64,000 work pixels;
   - 320 px on either side.
3. Reduce color quantization cycles to the minimum practical deterministic setting (prefer 1) while keeping the requested palette count bounded.
4. Preserve editable filled Color Paths and aligned boundary Line Paths.
5. Preserve Reference identity, source SHA, separate Color/Line layers, History, Audit, Provenance, and FORMAT_VERSION 4.
6. Browser Phase B operation must complete under the existing 30-second Phase B assertion.
7. Do not increase the global 240-second Runtime timeout.
8. Do not add semantic labeling, centerline tracing, UI redesign, Phase C, or a new extraction engine.

This is the final Phase B performance-tuning pass before MR decides whether ImageTracerJS is adequate for this first validation slice.

Return:

```text
DEV_HANDOFF → MR_REVIEW_REQUIRED → STOP
```
