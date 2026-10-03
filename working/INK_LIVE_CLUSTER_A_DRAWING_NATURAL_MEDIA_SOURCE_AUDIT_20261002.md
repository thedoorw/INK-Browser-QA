# INK Live Cluster A — Drawing / Natural Media Source Audit — 2026-10-02

TYPE = SOURCE AUDIT / LIVE GAP CLASSIFICATION
SOURCE_REPO = thedoorw/INK-Browser-QA
AUDIT_BASE_MAIN = 0ef57c468f10f9e8b8c2f7fefb59f1385c9d6365
LIVE_DEPLOYED_SOURCE = 66cdb5b4ddc322a2b1027cab2627426f868027d3
LIVE_FINDING = R1-DRAWING-EXPOSURE-001
CASES = C016 / C017 / C018
FAMILIES = C29 C30 C31 C32 C33 C34 C35 C38

## Result

Cluster A is not one undifferentiated product gap.

```text
GENERAL DRAWING / BRUSH SESSION = PRODUCT EXISTS / CHAT EXPOSURE GAP
NATIVE INTERACTIVE STROKE = PRODUCT EXISTS / CHAT EXPOSURE GAP
PAPER PROFILE / PAPER MUTATION = PRODUCT EXISTS / CHAT EXPOSURE GAP
ERASER GEOMETRY = PRODUCT EXISTS / CHAT EXPOSURE GAP, SEPARATE BOUNDED DESIGN REQUIRED
BLENDER / SMUDGE = PRESET + MODEL EXISTS / RENDER INTEGRATION INCOMPLETE / PRODUCT GAP
```

## Existing native authorities

### Interactive Stroke

`product/source/src/ink.js` already owns the normal drawing path.

Existing tools:
- pen
- pencil
- marker
- brush
- airbrush
- eraser

`beginStroke()` creates the existing native `type:'stroke'` object and records through existing History. The object carries size, opacity, color, kind, smoothing, pressure, taper, grain, softness, flow, wetness, bristle, mediaModel and sampled pressure/tilt/time data.

Brush / drybrush / airbrush native strokes set `mediaModel:'natural-v2'`.

### Formal Natural Media Renderer

`NaturalMediaController` is already installed by the renderer. Its native stroke support accepts `type:'stroke'` with kinds:
- brush
- drybrush
- airbrush

The multi-channel run path consumes the current page paper profile.

This authority must be reused; CHAT must not create a second natural-media renderer or pointer emulator.

### Brush Engine / Stroke Session

The existing paint authority already provides:
- `BrushPresetRegistry`
- `StrokeSessionRecorder`
- `replayStrokeSession`
- existing `paint-session` object rendering through Studio / renderer authority

Built-in Brush Engine presets currently include:
- pencil
- ink
- marker
- opaque-paint
- soft-paint
- watercolor
- oil-like
- dry-brush
- texture-brush
- blender
- smudge
- eraser

Studio already records deterministic Stroke Sessions and inserts `paint-session` objects through existing History.

Important boundary: Stroke Session replay is a deterministic visual paint path. It is not evidence that every preset is wired into the formal multi-channel pigment surface.

### Paper

The page document already owns a native `paper` object with:
- type
- color
- gridSize
- absorbency
- roughness
- fiberStrength
- fiberAngle
- sizing
- granulation
- seed
- textureVisible

`render/paper-profile.js` supplies `normalizePaperProfile`, `paperSampleAt`, `buildPaperField`, and `paperProfileFingerprint`.

`InkApp.changePaper()` commits paper mutation through existing `history.pushScoped`; preview/commit paths already invalidate tiles and clear paper/natural-media caches.

Disposition: paper is a CHAT exposure gap, not a missing product capability.

### Eraser

The existing stroke authority exports `eraseStrokeWithCircle()` from `stroke/edit.js`.

The interactive eraser already wraps this authority in History and replaces affected native Stroke objects with generated fragments.

Disposition: eraser is an exposure gap, but it requires a separate bounded operation design with explicit stable targets / optimistic-concurrency behavior. Do not expose area-wide interactive pointer emulation.

## Blender / Smudge boundary

Brush Engine presets and compilation modes exist for:
- blender → `color-blender`
- smudge → `pigment-transport`

However current formal `NaturalMediaController` / multi-channel surface does not provide a corresponding pigment pickup / transport mutation route, and `paint-session` fallback replay does not establish true existing-surface transport.

Disposition:

```text
BLENDER / SMUDGE = PRODUCT RENDER-INTEGRATION GAP
DO NOT LABEL AS CHAT-EXPOSURE-ONLY
DO NOT MARK PASS FROM PRESET REGISTRY PRESENCE
```

## Bounded exposure candidate

Branch:
`work/ink-live-drawing-exposure-001`

Draft PR:
`#112 CHAT: bounded Paint Session exposure for Live drawing tests`

Candidate head:
`96d873d45ba86a4760a82648a9ee31972714b936`

Candidate operation:
`paint.session.create.v1`

The candidate:
- requires existing proposal → explicit approval → execute;
- reuses BrushPresetRegistry / StrokeSessionRecorder / replayStrokeSession / History / Renderer;
- uses zero targets and bounded stroke/sample counts;
- exposes only pencil / ink / marker / opaque / soft / watercolor / oil-like / dry-brush / texture-brush;
- explicitly excludes Blender / Smudge / Eraser;
- does not create Document / History / Renderer / drawing authority;
- does not change FORMAT_VERSION.

Static module syntax check:
```text
chat-bounded-edit.js = SYNTAX_OK
capability-registry.js = SYNTAX_OK
```

No browser/runtime PASS is claimed.

## A1 accepted / deployed closure — 2026-10-02

The historical PR #112 / branch `work/ink-live-drawing-exposure-001` is superseded.

Accepted line:

```text
FINAL_PR = #116
EXACT_BROWSER_TESTED_CANDIDATE = c654a6fb22be2eaadfebc83b01171270c71cf1b1
SOURCE_MAIN_INTEGRATION = 58adf13cd98a8594eb8e63faedc735ce0c5179f0
PRODUCT_BLOBS_AT_MERGE = EXACT TO TESTED CANDIDATE
LIVE_SOURCE_SHA = 58adf13cd98a8594eb8e63faedc735ce0c5179f0
LIVE_REQUEST = clusterA-A1-live-rerun-004
A1_RESULT = PASS
```

Candidate browser evidence:
- Paint Session object created;
- two strokes compiled/replayed;
- canvas render changed;
- Preview PASS;
- History + Undo + Redo PASS.

Formal Live evidence:
- capability registry exposes `paint.session.create.v1`;
- direct bounded-edit proposal/approval/execution PASS;
- `pencil` + `watercolor` strokes, 6 samples;
- scoped History entry created;
- Undo removes the object;
- Redo restores the same native `paint-session`;
- Preview PASS.

The earlier one-step `use_ink` request failure `CHAT_PLAN_STEPS_INVALID` is a QA-route misuse: Chat Creative Plan intentionally requires 2–32 steps. Single-operation A1 uses the direct bounded-edit named tools.

A1 remains intentionally narrower than the whole Drawing cluster:
- no claim for formal native `type:'stroke'` NaturalMedia/Airbrush exposure;
- no Paper exposure;
- no targeted Eraser exposure;
- no Blender/Smudge closure.

### Follow-up: Paint Session world/content bounds

Studio renderer has a real `paint-session` draw route, but current renderer world-bounds specialization covers Path/Repeat and lets Paint Session fall through to generic bounds.

Observed Live consequence:
- strokes span substantially more than 49×49 in sample coordinates;
- `get_ink_preview(scope='content')` returned fallback 49×49 bounds.

Classification:
```text
PAINT_SESSION_RENDER = PASS
PAINT_SESSION_HISTORY = PASS
PAINT_SESSION_CONTENT_BOUNDS = PRODUCT INTEGRATION / USABILITY GAP
A1 EXPOSURE CLOSURE = NOT BLOCKED
```

## Current gate

```text
A1 PAINT SESSION = MERGED / DEPLOYED / LIVE PASS
A2 NATIVE STROKE + NATURALMEDIA + AIRBRUSH = NEXT CLUSTER-A EXPOSURE PACKAGE
A3 PAPER = OPEN
A4 TARGETED ERASER = OPEN
A5 BLENDER / SMUDGE = PRODUCT RENDER-INTEGRATION GAP
```

Current active whole-UI fidelity task remains separate. Live CHAT exposure may continue only without touching its reviewed UI-authority surfaces.



Current Work Order now has the separate C04 combined-product sequence at Supervisor review.

Therefore:

```text
PR112 = DRAFT CANDIDATE
MERGE = HOLD
LIVE PROMOTION = HOLD
REASON = required focused runtime/review + do not perturb current C04 integration baseline
```

No thedoorw/INK product-source file has been modified.

## Next Cluster A packages after gate permits

1. Review / browser-qualify PR #112 Paint Session exposure.
2. Add native Stroke creation exposure for the formal interactive Stroke/NaturalMedia path, including airbrush, without pointer emulation.
3. Add bounded page paper profile mutation through existing page.paper + History/cache invalidation authority.
4. Design targeted eraser exposure around exported stroke geometry authority and stable refs.
5. Keep Blender / Smudge as a separate product-integration package; do not fold it into exposure work.

Only accepted exact source SHA may be promoted to Live.


## TEST A formal qualification checkpoint — 2026-10-03

Evidence:
`working/INK_TEST_A_DRAWING_NATURAL_MEDIA_QUALIFICATION_20261003.md`

Exact Live identities:

```text
DEPLOYED_SOURCE_SHA = cc9b623258123da0e00e31a9e686357fba0d4ec0
LIVE_REPO_HEAD_AT_TEST = 145a00587bcc6dbc9717b05179f2c5e131a5b587
```

Formal Live results:

```text
A2_NATIVE_STROKE = BLOCKED_AT_PUBLIC_EXPOSURE / EXPOSURE_GAP
NATURALMEDIA = BLOCKED_AT_SHARED_STROKE_EXPOSURE / EXPOSURE_GAP
AIRBRUSH = BLOCKED_AT_SHARED_STROKE_EXPOSURE / EXPOSURE_GAP
A3_PAPER = BLOCKED_AT_PUBLIC_EXPOSURE / EXPOSURE_GAP
A1_REGRESSION = PASS
```

Reproducers:
- `clusterA-A2-native-stroke-discovery-live-001` → `describe_ink_capability("stroke.create.v1")` returned `INK_CAPABILITY_NOT_FOUND`;
- `clusterA-A3-paper-discovery-live-001` → `describe_ink_capability("page.paper.set.v1")` returned `INK_CAPABILITY_NOT_FOUND`;
- `clusterA-A1-regression-live-001` completed proposal → approval → execution → native `paint-session` → History → Preview → Undo → Redo on the current deployed source.

A1 regression specifics:
- one native `paint-session`, stable id `chat-paint-fnv1a32-a5525b8e`;
- one scoped History entry `CHAT create Paint Session`;
- Preview fingerprint `fnv1a32:a6535881`;
- Undo reduced document object count to 0;
- Redo restored the same object id and the same Preview fingerprint;
- JSON-safe structured result;
- no pointer/mouse simulation.

This checkpoint does not authorize implementation. The source audit disposition remains:
- A2 / NaturalMedia / Airbrush: existing product authority, missing CHAT exposure;
- A3 Paper: existing product authority, missing CHAT exposure;
- A1: remains closed and regression-clean;
- Paint Session 49×49 content-bounds fallback remains a separate known integration/usability gap.

## A2 native Stroke / Natural Media — Live closure 2026-10-03

- Source: `d0248e9661cc242081507e4bf73fc8b73aeb6256` (PR #127).
- Request: `clusterA-A2-native-stroke-live-002`; request commit `fce87d4a853d9e209665cb581a33e024cf74bf63`.
- Result commit: `e1967d7342a3b72f9bba72e683d1a4a92d863e9e`.
- Hosted run: `37041501266`; artifact: `11242318263`, digest `sha256:542d205593213f8f79a7471435cc31bdd598c33faa8c23a9923234f9476a9ef8`.
- `apiReady=true`; exact source verified; 23 named tools.
- Pencil / Brush / Airbrush / DryBrush proposal → approval → execution: PASS.
- Four native Stroke objects / four scoped `CHAT create Stroke` entries.
- Content Preview: 451×351; bounds `x=-233.6 y=-182 w=451 h=350.6`; fingerprint `fnv1a32:28606ccc`.
- Four Undo operations remove all strokes; four Redo operations restore identical stable refs and Preview fingerprint.
- Preserved result: `qa/evidence/live-a2-20261003/ink-live-chat-result.json`.
- Candidate QA separately proved existing NaturalMediaController/WebGL path, Canvas delta, A1 and B2 brightnessContrast regression.
- Live runner screenshot captures the shell with no open document canvas; no live visible-canvas screenshot PASS is inferred from that screenshot. Renderer-backed content Preview and candidate Canvas evidence establish the tested rendering path.
- Initial `-001` stopped before readiness with new exact-SHA module transport failures; same-source warm `-002` completed.

```text
A2 = PASS / MERGED / DEPLOYED / LIVE QUALIFIED
A3_PAPER = NEXT / EXPOSURE_GAP
A4_ERASER = SEPARATE
A5_BLENDER_SMUDGE = SEPARATE PRODUCT_RENDER_INTEGRATION_GAP
```

## A3 Paper exposure — accepted / deployed / Live qualified 2026-10-03

PR #128 merged. Exact tested candidate: `1afb52a9c6fc77f5f121f5b7e8d9be2c626006be`; merged/deployed source: `ab84aafc3006f0f14a74d231ca862200bd0b5d94`. Complete product/source tree equals `30d55495650acd365acc2b1e92c7669fa01f1870` for candidate and merge. Live wrapper deployment commit: `8d2fba408efc205c903efaae24a958440a6a71b1`.

- Formal Live request: `clusterA-A3-paper-live-001`; request commit `e64806bf08bcdc2c26c5fd3323af8c78b474356a`; result commit `d85cd4a766a18cdd526ccc54354c6f7f52b93573`.
- Hosted run `37085274905`; artifact `11260127110`; digest `sha256:ad69149bf5c08577a1908e8b370584a777b2f41f050618e537aeb0e4dedc4df1`.
- Exact source verified; apiReady=true; 23 named tools; no pointer emulation.
- `page.paper.set.v1` uses existing InkApp.changePaper and native scoped History. Roughness .42→.95, absorbency .58→.05; normalized paper receipt returned.
- Two native adjacent Brush/DryBrush strokes; two Stroke History entries plus two scoped `調整畫布` entries.
- Transparent content Preview `fnv1a32:dd280788→fnv1a32:20df496f`; two Undo restore `dd280788`; two Redo restore `20df496f`. Two stable native Stroke objects remain.
- Candidate Paper QA, A2 four-mode Stroke, A1 Paint Session and B2 brightnessContrast regressions PASS. Invalid/no-op/stale/pending-preview safety checks PASS.
- Evidence: `qa/evidence/live-a3-20261003/`; source review: `working/INK_LIVE_A3_PAPER_MR_REVIEW_20261003.md`.

Explicit separate confirmed gaps, retained outside this exposure closure:
1. `PAPER_SINGLE_STROKE_RENDER_INTEGRATION`: single native stroke uses renderStroke without page.paper; paper-coupled renderStrokeRun requires 2+ adjacent Brush/DryBrush strokes. Single-stroke candidate probe FAIL is preserved. Classification PRODUCT_RENDER_INTEGRATION_GAP.
2. `PAPER_WEBGL_ROUGHNESS_PARITY`: roughness state changes but roughness-only transparent Preview is unchanged in the tested WebGL multichannel backend; source GPU simulation has no dedicated roughness uniform whereas Canvas2D paper-field resistance consumes roughness. Classification PRODUCT_RENDER_INTEGRATION_GAP / backend parity. No all-field or all-backend completeness claim.

```text
A2_NATIVE_STROKE = PASS / LIVE QUALIFIED
A3_PAPER_EXPOSURE = PASS / MERGED / DEPLOYED / LIVE QUALIFIED
A3_PAPER_RENDER_QUALIFIED_SUBSET = TWO-OR-MORE ADJACENT BRUSH/DRYBRUSH / ABSORBENCY
PAPER_SINGLE_STROKE_RENDER_INTEGRATION = OPEN / CONFIRMED
PAPER_WEBGL_ROUGHNESS_PARITY = OPEN / CONFIRMED
A4_TARGETED_ERASER = OPEN / SEPARATE
A5_BLENDER_SMUDGE = OPEN / SEPARATE PRODUCT_RENDER_INTEGRATION_GAP
FULL_NATURAL_MEDIA_COMPLETENESS = NOT_CLAIMED
```
