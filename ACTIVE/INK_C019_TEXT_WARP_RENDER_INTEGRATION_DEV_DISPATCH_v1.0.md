# INK C019 — Text Warp / Curved Text Render Integration DEV Dispatch v1.0

DATE = 2026-10-03
ROLE = INK C019 Text Warp / Curved Text Render Integration DEV
SOURCE_REPO = thedoorw/INK-Browser-QA
LIVE_REPO = thedoorw/INK
GITHUB = ONLY SSOT
STATUS = AUTHORIZED PRODUCT / RENDER-INTEGRATION PACKAGE
MERGE = NO
LIVE_DEPLOY = NO
FINAL_ACCEPTANCE = CHAT / Core / Live authority

## Read first

- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md`
- `ACTIVE/INK_LIVE_TEST_PROGRESS.md`
- `working/INK_LIVE_CLUSTER_B_RASTER_EFFECTS_DEFORMATION_SOURCE_AUDIT_20261002.md`
- current Text object / renderer / Path deformation sources on latest main

Re-audit latest main before changing code. The 2026-10-02 audit found a genuine render-integration gap; confirm it still exists.

## Problem statement

Current audited state:

```text
Text object can store pathText descriptor
formal drawText() renders ordinary line text only
advanced Path warp/distort/perspective applies to Path, not Text
there is no proven installed editable Text warp/path-text renderer
```

Therefore:

```text
C019 TEXT WARP / CURVED TEXT = PRODUCT RENDER-INTEGRATION GAP
```

A registry descriptor or stored `pathText` field without visible rendering is not a capability.

## Branch

Create from latest main:

```text
work/ink-c019-text-warp-render-001
```

If an active text/render owner already changes the same authority surface, STOP and record the conflict.

## Objective

Implement the smallest truthful native render integration that makes at least one editable Text deformation mode renderer-observable and CHAT-qualifiable.

Preferred first target:

```text
editable curved/path text using the existing Text object + existing pathText semantics
```

Only extend into envelope/warp semantics if the existing architecture already provides a bounded native route and doing so does not create a second Text or deformation authority.

## Required design rules

- preserve native editable `type:'text'`; do not convert the result to Path/raster merely to claim PASS;
- keep existing Text object authority;
- reuse existing Path geometry/math helpers where appropriate;
- renderer must consume the native Text deformation descriptor;
- existing History / Revision remains authoritative;
- no pointer-event emulation;
- no hidden duplicate text layout engine unless the current renderer already requires a shared helper extraction;
- no registry-only or metadata-only exposure;
- FORMAT_VERSION remains 4 unless USER explicitly authorizes otherwise.

If a persistent schema change truly requires FORMAT_VERSION change, STOP with evidence.

## CHAT surface

Only after renderer-observable native behavior exists, expose the smallest bounded proposal-required operation.

Candidate first route:

```text
text.path.set.v1
```

or an equivalent name consistent with current capability naming after source audit.

It must:
- target exactly one stable native Text ref;
- target/reference an explicit stable native Path ref or bounded native path descriptor;
- validate Text/Path identities and current revision;
- preserve editable Text;
- commit through existing History;
- return structured native refs and resulting descriptor.

Do not expose broad `text.warp.v1` until its semantics genuinely render.

## Qualification

At minimum:

1. create native editable Text + native Path;
2. apply the new native path/curved-text relation;
3. prove visible Preview/render delta;
4. prove Text remains `type:'text'` and text content remains editable;
5. mutate text content after deformation and prove renderer updates;
6. mutate/rebind relevant path relation as supported and prove deterministic rendering;
7. History entry;
8. Undo exact baseline restoration;
9. Redo exact deformed restoration;
10. save/reload or serialize/restore if current Text descriptor is persisted;
11. stale / invalid Text ref / invalid Path ref rejection;
12. representative Text + B4 Path + drawing/raster regressions.

Tool-call success alone is not PASS.

## Evidence / return

Record:
- latest-main base SHA;
- exact candidate SHA;
- changed files;
- renderer authority changed;
- exact native descriptor consumed;
- Preview hashes/bounds or equivalent visual evidence;
- Text editability proof;
- History Undo/Redo;
- persistence proof where applicable;
- regressions;
- any deferred warp/envelope semantics.

Create branch-local return under `working/` and evidence under `qa/evidence/`.

## Hard boundaries

Do not fold in:
- Cluster C Layout/Page/Artboard;
- Cluster D Material/Recipe;
- B3 local Raster/masks;
- UI work;
- New Document/A4;
- unrelated typography redesign;
- Path B4 redesign;
- new general animation/text-effects engine.

Do not bypass B4 ownership: projective/deformation math already has existing authorities. Reuse shared math only where semantically valid.

## Completion gate

```text
latest-main render gap reconfirmed
→ smallest native Text render integration
→ renderer-observable editable result
→ bounded CHAT exposure
→ exact candidate
→ focused browser QA + regressions
→ branch-local return/evidence
→ STOP → CHAT / Core / Live authority
```

Do not merge to main.
Do not deploy to `thedoorw/INK`.
Do not claim Formal Live closure.
