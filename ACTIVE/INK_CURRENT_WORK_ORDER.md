# INK CURRENT WORK ORDER

STATUS: `INK-CHAT-VALIDATION-001 / AUTHORIZED / PHASE_B_LINE_COLOR_DECOMPOSITION`

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
