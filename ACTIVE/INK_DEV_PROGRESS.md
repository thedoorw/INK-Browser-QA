# INK DEV PROGRESS

STATUS: `INK-CLOUD-008B / PHASE_C_COMPLETE / PHASE_D_NEXT`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-008B` |
| TITLE | `Expressive Stroke v0.1` |
| BRANCH | `work/ink-cloud-008b` |
| BASE_MAIN | `18edd731d1fb4e10100190a0b303b284010e3de6` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING` |
| GATE | `EDITABLE_PATH_AND_STROKE_WORKS` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED` |

## Authorized sequence

1. Phase A — Stroke appearance contract
2. Phase B — Style mutation + History
3. Phase C — Renderer integration
4. Phase D — Existing natural-media bridge
5. Phase E — Integration / regression evidence
6. Phase F — report + DEV handoff

## Core rule

```text
Path Geometry != Stroke Appearance
```

Style changes must not rewrite Path geometry, identity, topology or extraction provenance.

## Rules

- GitHub is SSOT.
- Work only on `work/ink-cloud-008b`.
- Read Current Work Order before implementation.
- Commit every meaningful checkpoint.
- Update this file continuously.
- Run feasible source/static/unit/serialization checks.
- Never claim unexecuted checks as PASS.
- Do not merge main.
- Do not update package.
- Do not begin Composition/Repaint/CHAT.
- Do not run the rose-window benchmark.
- STOP for FORMAT_VERSION change, accepted architecture break, second core engine, destructive authoritative Path conversion, broad UI redesign or scope expansion.

## Start state

`READY_FOR_DEV_WORK / BEGIN_PHASE_A`


## Checkpoint — Phase A

- `Stroke appearance contract` implemented as optional Path appearance payload.
- Contract is versioned and bounded: profile max `64` samples; finite width/pressure/taper/media ranges.
- Path geometry is not duplicated inside the appearance payload.
- `normalizeObject()` and document integrity now normalize/validate the optional payload.
- File envelope declares `ink.path-expressive-stroke.v1` when required; `FORMAT_VERSION` remains `4`.
- Ordinary `stroke/strokeWidth` remains on Path as the independent vector style/fallback source.
- Package mutation: `0`.
- Runtime QA: `DEFERRED`.

NEXT: `BEGIN_PHASE_B / STYLE_MUTATION_HISTORY`


## Checkpoint — Phase B

- Added `PathStrokeAppearanceController` on top of the existing Path object and existing scoped `HistoryManager`.
- Assign / replace / patch / remove all reject busy History, hidden/locked targets and singular transforms.
- Style-only mutation asserts stable Path ID, exact geometry fingerprint and metadata/extraction provenance.
- No-op style mutations return without creating a History entry.
- Brush assignment entrypoint is present but renderer/media bridge activation remains Phase D.
- No second History or geometry model introduced.

NEXT: `BEGIN_PHASE_C / RENDERER_INTEGRATION`


## Checkpoint — Phase C

- Existing vector renderer evaluates Path appearance from the same authoritative Bézier geometry using deterministic flattened segments.
- Geometry edits repaint the same styled Path; no generated outline or raster source object is created.
- Ordinary vector stroke remains the fallback when expressive appearance is absent or cannot draw.
- Structured SVG keeps the same Path `d` and records explicit `ordinary-vector` fallback metadata.
- Hit/spatial bounds include expressive stroke width without changing geometric `pathBounds()` semantics.
- New source modules are included in the existing service-worker source shell.
- No second renderer introduced.

Phase C source commits: `43715e92`, `759216a5`, `${swCommit.slice(0,8)}`.

NEXT: `BEGIN_PHASE_D / NATURAL_MEDIA_BRIDGE`
