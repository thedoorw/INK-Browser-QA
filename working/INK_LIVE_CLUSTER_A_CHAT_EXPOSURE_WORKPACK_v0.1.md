# INK Live Cluster A — Drawing / Natural Media CHAT Exposure Workpack v0.1

TYPE = IMPLEMENTATION DESIGN / LIVE REPAIR SEQUENCING
DATE = 2026-10-02
PARENT_AUDIT = working/INK_LIVE_CLUSTER_A_DRAWING_NATURAL_MEDIA_SOURCE_AUDIT_20261002.md

## Objective

Expose existing Drawing / Natural Media authorities to CHAT without pointer-event emulation and without creating a second drawing, History or Renderer authority.

The repair sequence is intentionally split:

```text
A1 deterministic Paint Session
→ A2 native Stroke / formal NaturalMedia route
→ A3 Paper state
→ A4 targeted Eraser
→ A5 Blender / Smudge product integration later
```

A1 does not close A2–A5.

## A1 — deterministic Paint Session

Current candidate:
- branch `work/ink-live-drawing-exposure-002`
- Draft PR `#115`
- candidate HEAD `039c0022b8ce8e743b3953045844b8c4d824f1a2`
- superseded PR `#112` closed

Operation:
`paint.session.create.v1`

Authority:
```text
CHAT bounded edit
→ BrushPresetRegistry
→ StrokeSessionRecorder
→ replayStrokeSession
→ existing History
→ existing Studio renderer paint-session path
```

Qualified preset subset in the candidate excludes:
- blender;
- smudge;
- eraser.

A1 is deterministic drawing/replay exposure. It is not evidence that formal pigment-surface NaturalMedia transport is complete.

Required QA:
- propose → approve → execute;
- real `paint-session` object;
- replay present;
- renderer output changes;
- Preview;
- one History entry;
- undo/redo restores the same stable object/session;
- no duplicate drawing authority.

Known non-blocking limitation:
- `paint-session` currently has no dedicated `objectWorldBounds` branch in Studio renderer and therefore falls back to generic bounds. Do not close full selection/fit/manipulation ergonomics from A1.

## A2 — native Stroke / formal Natural Media exposure

Add a separate bounded operation only after A1 is reviewed:

`stroke.create.v1`

Goal:
create the same native `type:'stroke'` shape that interactive INK drawing already creates, but from structured CHAT samples rather than pointer events.

Requirements:
- explicit existing preset/tool semantics;
- bounded sample count;
- world-space x/y + pressure/time/tilt;
- existing native stroke fields only;
- use existing stabilization/normalization helpers where authority is reusable;
- insert through existing History;
- trigger existing spatial-index notification / render invalidation;
- return stable native ref;
- no synthetic pointer events.

Initial tool kinds:
- pen;
- pencil;
- marker;
- brush;
- drybrush;
- airbrush.

For brush/drybrush/airbrush, preserve the existing `mediaModel:'natural-v2'` semantics so `NaturalMediaController` remains the formal renderer.

A2 QA must separately exercise:
1. pencil fallback renderer;
2. brush through NaturalMediaController;
3. drybrush;
4. airbrush.

Do not infer A2 PASS from A1 Paint Session PASS.

## A3 — Paper state

Proposal-required operation:
`page.paper.set.v1`

Allowed fields should map directly to existing page.paper authority:
- type;
- color;
- absorbency;
- roughness;
- fiberStrength;
- fiberAngle;
- sizing;
- granulation;
- seed;
- textureVisible.

Requirements:
- active-page scoped;
- use existing History-backed paper mutation/cache invalidation;
- return normalized paper profile fingerprint where available;
- no duplicate paper model.

QA:
- change roughness/absorbency;
- render one native natural-media stroke before/after;
- verify Preview changes;
- undo/redo restores paper state and render.

## A4 — targeted Eraser

Do not expose pointer eraser gestures.

Use existing exported `eraseStrokeWithCircle()` authority around explicit stable native Stroke refs.

Candidate operation:
`stroke.erase.circle.v1`

Arguments:
- stable target stroke refs;
- world-space center;
- bounded radius.

Requirements:
- reject non-Stroke targets;
- target fingerprints/revision guards;
- existing geometry split fragments only;
- one History entry;
- return deleted/created stable refs;
- preserve source stroke metadata/provenance where current eraser authority already does so.

QA:
- partial erase creates fragments;
- full erase removes target;
- undo/redo exact topology/object count.

## A5 — Blender / Smudge

Current source audit says:
```text
preset/model = present
formal pigment pickup/transport integration = incomplete
```

Therefore:
- no CHAT exposure-only patch;
- no PASS from preset registry presence;
- no pointer emulation;
- requires a separate product render-integration workpack.

## Qualification order

```text
1. A1 exact candidate browser QA
2. A1 source review / promotion
3. Live A1 rerun against exact deployed source
4. A2 native pencil
5. A2 natural brush
6. A2 drybrush
7. A2 airbrush
8. A3 paper mutation + natural stroke
9. A4 eraser
10. keep Blender/Smudge open
11. rerun C016 / C017 / C018 by actually exercised family
```

Tool-call success alone is not PASS.

## Promotion boundary

Only an accepted exact source SHA may be copied to `thedoorw/INK`.

Do not combine A packages with:
- C04 workspace;
- C06 zoom;
- Raster B packages;
- New Document;
- History redesign;
- FORMAT_VERSION change.
