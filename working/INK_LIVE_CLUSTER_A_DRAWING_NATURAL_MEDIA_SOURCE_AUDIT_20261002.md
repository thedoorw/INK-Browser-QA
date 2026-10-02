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

## Current gate

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
