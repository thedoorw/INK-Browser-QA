# INK Combined Capability Qualification TEST — 2026-10-03

TYPE = PURE TEST / EVIDENCE
PRODUCT_MUTATION = NONE
SOURCE_REPO = thedoorw/INK-Browser-QA
LIVE_REPO = thedoorw/INK
LIVE_URL = https://thedoorw.github.io/INK/

## Authority / identity

- QA main before combined qualification: `d26539b3c98c11bf0d1da55b190ff5937b2a0f70`
- Live wrapper SHA at both tests: `8d2fba408efc205c903efaae24a958440a6a71b1`
- Exact deployed product source SHA: `ab84aafc3006f0f14a74d231ca862200bd0b5d94`
- Runtime: `apiReady=true`, `toolCount=23`
- Control path: CHAT → GitHub SSOT request → hosted browser → Live INK → `window.INK_APP.inkPublicApi` → named tools/native authority
- Pointer/mouse emulation: NONE

No `product/source`, Core, UI, FORMAT_VERSION, History implementation, Renderer implementation, or deployment product bytes were modified by this qualification lane.

## INK-QA-C Draw — PASS

Request:
- requestId: `ink-qa-c-draw-combined-001`
- request commit: `b6033cc2f8b107844084ce5cfd11b6f4cb3e4a0d`
- result commit: `f50c885ed80a0056dd9df098879e9473b3e5f071`
- workflow run: `37086517849`
- artifact: `11261115603`
- artifact digest: `sha256:283205a6522e5a6042b40e9effd2f1b60f28fdb453066c60314eef3a6e797585`

Closed loop:
```text
capability discovery
→ page.paper.set.v1 (absorbency 0.05)
→ native Brush Stroke
→ native DryBrush Stroke
→ Preview / Context / History inspection
→ CHAT correction: native Airbrush Stroke
→ Preview / Context / History inspection
→ Undo correction
→ Preview verification
→ Redo correction
→ final Context / History verification
→ PNG artboard export
```

Native state / structure:
- Brush: `chat-stroke-fnv1a32-2a2a1a3f`, `type=stroke`, `mediaModel=natural-v2`, 4 points.
- DryBrush: `chat-stroke-fnv1a32-e96edb78`, `type=stroke`, `mediaModel=natural-v2`, 4 points.
- CHAT correction Airbrush: `chat-stroke-fnv1a32-8a1da5a8`, `type=stroke`, `mediaModel=natural-v2`, 3 points.
- Final Context: 3 native editable Stroke objects.
- Paper execute returned normalized `absorbency=0.05`; paper profile fingerprint `50:420:360:0:280:320:1337000:1000`.

Visible result / Preview:
- Initial Brush + DryBrush Preview: `fnv1a32:287f934e`; document fingerprint `fnv1a32:4bf25ae2`; 456×290.
- After CHAT Airbrush correction: `fnv1a32:eb357f3b`; document fingerprint `fnv1a32:70a37c5c`; 456×359.
- Undo correction: Preview returned exactly to `fnv1a32:287f934e`.
- Redo correction: Preview returned exactly to `fnv1a32:eb357f3b`.

History:
- Before correction: 3 applied scoped entries:
  1. `調整畫布`
  2. `CHAT create Stroke`
  3. `CHAT create Stroke`
- After correction/final: 4 applied scoped entries, adding the Airbrush `CHAT create Stroke`.
- Undo: applied count 4 → 3, `canRedo=true`.
- Redo: applied count 3 → 4, `canRedo=false`.

Output:
- PNG artboard export completed.
- A4 physical size: 210×297 mm.
- Pixel size: 1191×1684 at requested 144 ppi.
- Export render fingerprint: `fnv1a32:73678494`.
- Export document fingerprint: `fnv1a32:70a37c5c`.
- Output handle: `ink-output-v1:65ae75d3`.

Classification:
```text
INK-QA-C_DRAW = PASS
NATIVE_STATE = PASS
VISIBLE_STRUCTURAL_RESULT = PASS
PREVIEW = PASS
CHAT_CORRECTION = PASS
HISTORY = PASS
UNDO_REDO = PASS
FINAL_VERIFICATION = PASS
OUTPUT = PASS
```

Retained known A3 gaps; neither invalidates this combined PASS:
1. `PAPER_SINGLE_STROKE_RENDER_INTEGRATION` — single native Stroke route does not consume page.paper; paper-coupled `renderStrokeRun` requires 2+ adjacent Brush/DryBrush. CLASS = PRODUCT_RENDER_INTEGRATION_GAP.
2. `PAPER_WEBGL_ROUGHNESS_PARITY` — roughness-only transparent Preview is unchanged in the tested WebGL multichannel backend. CLASS = PRODUCT_RENDER_INTEGRATION_GAP / backend parity.

This combined exercise deliberately used the already-qualified 2+ adjacent Brush/DryBrush paper-coupled route and continued through correction, History, Undo/Redo and output as required.

## INK-QA-B Reference — PASS

Request:
- requestId: `ink-qa-b-reference-combined-001`
- request commit: `61cb1278f4f84a79fe58396570b5509ab10a5ee5`
- result commit: `d889043a6d653ea96946f1643e9ddf6c150e696b`
- workflow run: `37086642087`
- artifact: `11261355427`
- artifact digest: `sha256:72e58741c507727f274d812e2fe295e550a4a7cd0a2fb262a06d21057b165f44`
- GitHub SSOT result is compacted because the full structured result is large; the full JSON + screenshot remain in the workflow artifact.

Closed loop:
```text
capability discovery
→ Reference intake
→ editable raster import from same fixture
→ inspect native editable raster
→ inspect document structure
→ object.translate.v1 on editable raster
→ Preview
→ capture baseline Revision
→ CHAT correction: brightnessContrast adjustment
→ Preview
→ capture corrected Revision
→ inspect Revision list + History
→ Undo correction
→ Preview / Context verification
→ Redo correction
→ Preview / Context / History verification
→ PNG artboard export
→ inspect output handle
```

Native state / inspection:
- Reference object: `7d9ce64f-9374-4793-9317-37adc78cd00e-reference`.
  - 1086×1448.
  - `editable=false`.
  - effective locked = true.
  - effective opacity = 0.5.
- Editable raster object: `7892c1c0-7b53-4ffd-90e5-e9586bc60a32`.
  - native `type=image`.
  - 1086×1448.
  - `editable=true`.
  - effective locked = false.
  - effective opacity = 1.
- `inspect_ink_objects` returned one exact editable raster target with no truncation.
- Imported Context returned both objects, preserving Reference lock semantics separately from the mutable raster.

Transform:
- `object.translate.v1` executed against the editable raster only with `dx=72`, `dy=36`.
- Document fingerprint after transform / before correction: `fnv1a32:163505a7`.

History before correction:
- 2 applied scoped entries after intake:
  1. `Reference import · CHAT attachment`
  2. `匯入可編輯影像`
- Transform then added `CHAT translate objects`.

Revision evidence:
- Baseline revision:
  - `ink-rev:7cee1722:r1:efc3c675:163505a7`
  - label: `Reference editable baseline after transform`
  - reason: `INK-QA-B`
  - sequence 1
  - fingerprint `fnv1a32:163505a7`
- Corrected revision:
  - `ink-rev:7cee1722:r2:164a463d:7fe7d877`
  - label: `Reference corrected brightness contrast`
  - reason: `INK-QA-B`
  - sequence 2
  - parent = baseline revision
  - fingerprint `fnv1a32:7fe7d877`
- Revision comparison identifies the editable raster object as the changed object; no additional object was created by the correction.

CHAT correction:
- `image.adjustment.add.v1`
- adjustment: `brightnessContrast`
- brightness = 14
- contrast = 24
- opacity = 1
- exact target = editable raster `7892c1c0-7b53-4ffd-90e5-e9586bc60a32`

Visible result / Preview:
- Before correction: `fnv1a32:c3bd4f5f`; 670×850.
- After correction: `fnv1a32:f279be47`; 670×850.
- Undo correction: Preview returned exactly to `fnv1a32:c3bd4f5f`.
- Redo correction: Preview returned exactly to `fnv1a32:f279be47`.

History after correction/final:
- 4 applied scoped entries:
  1. `Reference import · CHAT attachment`
  2. `匯入可編輯影像`
  3. `CHAT translate objects`
  4. `CHAT add image adjustment: brightnessContrast`
- Undo: applied count 4 → 3, `canRedo=true`.
- Redo: applied count 3 → 4, `canRedo=false`.
- Final Context retains both objects and current corrected Revision.

Output:
- PNG artboard export completed and output handle inspection completed.
- A4 physical size: 210×297 mm.
- Pixel size: 1191×1684.
- Export render fingerprint: `fnv1a32:0e7e514b`.
- Export document fingerprint: `fnv1a32:7fe7d877`.
- Revision: `ink-rev:7cee1722:r2:164a463d:7fe7d877`.
- Output handle: `ink-output-v1:ffb0d3ab`.

Classification:
```text
INK-QA-B_REFERENCE = PASS
REFERENCE_INTAKE = PASS
EDITABLE_RASTER_NATIVE_STATE = PASS
INSPECTION = PASS
TRANSFORM = PASS
PREVIEW = PASS
CHAT_CORRECTION = PASS
HISTORY = PASS
REVISION = PASS
UNDO_REDO = PASS
FINAL_VERIFICATION = PASS
OUTPUT = PASS
REFERENCE_LOCK_SEMANTICS = PRESERVED
```

## Consolidated disposition

```text
INK_QA_C_DRAW_CLOSURE = PASS
INK_QA_B_REFERENCE_CLOSURE = PASS
COMBINED_CAPABILITY_QUALIFICATION = PASS
NEW_PRODUCT_CAPABILITY_ADDED = NO
PRODUCT_SOURCE_MUTATION = NO
KNOWN_A3_GAPS_RETAINED = YES
STOP_ON_FIRST_PARTIAL = NO
```

Reproducer authority is the exact request commit for each test plus its exact Live result commit and workflow artifact. Do not substitute a later request file or a later Live wrapper identity for those immutable records.
