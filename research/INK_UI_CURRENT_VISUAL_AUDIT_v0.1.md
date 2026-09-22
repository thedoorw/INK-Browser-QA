# INK CURRENT UI VISUAL AUDIT v0.1

Baseline:
`main = 31403199aae6d6a38ec74ddd297d3b6b291c8ab6`

Reference:
`INK-UI-MAINT-001 — Photoshop Shell Geometry / Pixel Alignment`

## What is confirmed correct

Runtime-confirmed from INK-UI-MAINT-001:
- menu 24 px;
- shared options row 36 px;
- workspace y = 60;
- left rail x = 0 / 40 px;
- right dock 40 px;
- document title 236 px;
- default primary panel 252 px;
- Layout dark workbench + real A4;
- Web / Portable parity;
- UI runtime 61/61 PASS.

These remain accepted geometry targets.

## UR self-audit findings

### 1. Previous acceptance over-weighted geometry

The previous gate proved rectangles and command reachability, but did not require a separate visual-composition verdict for the second row.

Current second row contains, within one 36 px row:
- document title;
- contextual tool identity;
- contextual controls;
- workspace switch;
- History Undo/Redo;
- New / Open / Save / Export;
- fullscreen / inspector / settings.

This can satisfy rectangle tests while still appearing over-packed or visually fragmented.

Status:
`REVIEW_GAP_FOUND`

Required future gate:
`TOP_OPTIONS_COMPOSITION`

### 2. Creation-space visual relationship remains intentionally different from Layout

Current source still defines Creation as a light paper-colored infinite canvas, while Layout uses dark workbench.

This is technically consistent with dual-workspace design, but previous review wording about “dark workbench + page” applied only to Layout runtime evidence.

Therefore UR must not claim the entire default application has Photoshop-like pasteboard behavior.

Status:
`DESIGN_DECISION_NEEDS_EXPLICIT_REVIEW`

If user expectation is that the default opening view should also present a dark pasteboard / page relationship, this crosses into Creation-space rendering behavior and may require:
`INTEGRATION_REQUIRED = CREATION_PASTEBOARD_RENDERER`

### 3. Stylesheet still contains many historical shell authorities

The final INK-UI-MAINT-001 block correctly overrides desktop geometry, but styles.css still contains multiple earlier values for:
- --topbar-h;
- --tool-w;
- --inspector-w;
- .tool-rail;
- .stage-wrap;
- .doc-title;
- panel placement.

The final cascade currently wins, but this is fragile and makes future visual regressions easier.

Status:
`MAINTENANCE_DEBT`

Recommended bounded follow-up:
consolidate desktop shell authority without changing accepted behavior.

### 4. Pixel rhythm was not independently acceptance-tested

The prior runtime measured rectangles but did not provide independent optical checks for:
- vertical text baseline;
- icon optical center;
- slider/input alignment;
- separator rhythm;
- equal button pitch;
- perceived density at 100% zoom.

Status:
`REVIEW_GAP_FOUND`

### 5. Favicon / brand clarity was not part of the promoted maintenance package

The user-provided source mark exists, but favicon broken-state and small-size optical reconstruction were deliberately deferred.

Status:
`OPEN_UI_MAINTENANCE`

### 6. Web / Portable parity is correctly institutionalized

Current product source still carries both:
- product/source/index.html
- product/source/index-standalone.html

Shared style/shell remain common.

Status:
`PASS / KEEP_AS_PERMANENT_GATE`

## Current UR decision

The prior `INK-UI-MAINT-001` geometry PASS remains valid.

However, the new checklist exposes review dimensions that were not previously gated.

Current state:
```text
GEOMETRY_BASELINE = PASS
PORTABLE_WEB_PARITY = PASS
RUNTIME_BASELINE = PASS
TOP_OPTIONS_COMPOSITION = REQUIRES_VISUAL_REVIEW
PIXEL_RHYTHM = REQUIRES_VISUAL_REVIEW
CSS_AUTHORITY_CLEAN = MAINTENANCE_DEBT
CREATION_WORKSPACE_VISUAL_GRAMMAR = REQUIRES_EXPLICIT_DECISION
BRAND_ASSET_CLARITY = OPEN
```

No Core semantics are implicated by the checklist itself.
