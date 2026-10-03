# INK C019 — Text Warp / Curved Text Render Integration DEV Return

Status: **DEV_COMPLETE — AWAITING CHAT / CORE / LIVE AUTHORITY REVIEW**

## Identity

- Repo: `thedoorw/INK-Browser-QA`
- Branch: `work/ink-c019-text-warp-render-001`
- Dispatch base main: `b6f837643064100b04cad12e338db782709ce255`
- Exact browser-qualified candidate: `35872e4f498950c58d47aac64f8e515967b081e9`
- Draft PR: #152
- FORMAT_VERSION: `4` — unchanged
- Merge: **NO**
- Deploy: **NO**

## Re-audit result

C019 was a genuine render-integration gap on the dispatch base:

- native Text already persisted a `pathText` descriptor;
- `product/source/src/editor/text-layout.js::layoutTextOnPath()` already supplied native glyph placement over editable Path geometry;
- formal `Renderer.drawText()` still rendered ordinary line Text only and did not consume `pathText`.

Therefore the missing authority was the formal Renderer integration, not another Text model, Path engine or layout engine.

## Native renderer integration

Changed formal Text rendering in:

`product/source/src/ink.js`

The Renderer now consumes the existing native descriptor:

`pathText = { pathId, startOffset, overflow }`

through the existing `layoutTextOnPath()` helper.

Key properties:

- object remains native editable `type:'text'`;
- Text id remains stable;
- referenced Path remains native editable `type:'path'`;
- attaching Text does not mutate the Path;
- no Text-to-Path conversion;
- no rasterization used to claim completion;
- no second Text layout engine;
- same native layer/container is required;
- singular/non-invertible Text local matrices are rejected by CHAT rather than silently claiming a non-renderable relation;
- invalid renderer relationships retain the existing straight-Text fallback for document robustness.

## Bounded CHAT exposure

Added:

`text.path.set.v1`

in the existing CHAT proposal → approval → execute authority.

It:

- targets exactly one stable native Text ref;
- references one explicit stable native Path ref;
- accepts bounded `startOffset` and currently qualified `overflow:'clip'`;
- requires Text and Path to share the same native layer/container;
- validates Text and Path renderability;
- fingerprints both the Text target and referenced Path for stale-state protection;
- mutates only the Text `pathText` field through existing `updateTextObject()`;
- records one scoped History entry: `CHAT set Text Path`;
- returns native Text/Path refs and resulting descriptor.

Broad `text.warp.v1` / envelope semantics were **not** exposed.

## Exact candidate browser QA

PASS against:

`35872e4f498950c58d47aac64f8e515967b081e9`

- Workflow run: `37113470082`
- Job: `111175683056`
- Artifact: `11270487286`
- Artifact digest: `sha256:26953eb734742959d361cd849e210290f399a77d2f987e5e554cb865054bb245`
- Runtime API ready: true
- Tool count: 23
- App version: 0.1

Visible formal Renderer evidence:

- straight Text canvas: `515b9e3d`
- curved Text canvas: `81aaa28d`
- Path-warped curved Text canvas: `dbcd65e7`
- straight Preview: `fnv1a32:e33c2b66`
- curved Preview: `fnv1a32:517e4286`
- warped Preview: `fnv1a32:72875984`
- curved placements: 18
- placements with non-zero tangent angle: 18

The browser screenshot was inspected and visibly shows the editable Text following the curved native Path.

## Editability / History / persistence

Verified on the exact candidate:

- Text remains `type:'text'`;
- Text content was changed after path attachment with existing `text.edit.v1`;
- the curved renderer updated after the text edit;
- existing B4 `path.warp.v1` changed the referenced Path while preserving its stable id;
- the Text continued to follow that Path after warp;
- Undo restored exact straight baseline canvas `515b9e3d`;
- Redo restored exact curved canvas `81aaa28d`;
- JSON serialize/restore retained:
  - FORMAT_VERSION 4
  - `type:'text'`
  - `pathText:{pathId:'qa-c019-path',startOffset:14,overflow:'clip'}`.

## Focused QA / negative guards

Final workflow Node gate:

- 30 tests
- 30 PASS
- 0 FAIL

Covered:

- native Text preservation;
- existing Text layout precision;
- scoped History and exact Undo/Redo;
- persistence;
- referenced Path follow-through after B4 warp;
- missing Path rejection;
- cross-container rejection;
- no-op rejection;
- stale Path rejection;
- singular Text renderability rejection.

The first temporary QA run failed before browser execution because the C019 test stub omitted the existing `layerObjectsPath()` History path authority and an unrelated current-main Connector-003 test required an app Document. Product code correctly refused to bypass History. The harness was corrected; final exact-candidate QA passed.

## Representative fresh-browser regressions

All PASS against the exact candidate:

- B4 `path-deformation-b4`
- A2 `stroke-create-a2`
- B2 `raster-stack-adjustment-b2`

Detailed evidence:

- `qa/evidence/c019-text-warp-render-20261003/C019_BROWSER_QA_EVIDENCE.json`
- `qa/evidence/c019-text-warp-render-20261003/C019_SOURCE_CANDIDATE_QA_REQUEST.json`

Temporary branch-only workflow / browser-case routing was removed after evidence capture. The focused C019 deterministic QA remains in the branch.

## Changed product authority

Only these product files belong to C019:

- `product/source/src/ink.js`
- `product/source/src/editor/chat-bounded-edit.js`
- `product/source/src/agent/capability-registry.js`

No B3, Cluster C, Cluster D, UI, New Document or deployment product work was added.

## Main advanced during DEV

After this branch was created, main advanced further. Final handoff review observed current main at:

`cbb847888848b1a2a9daf00aae3a63ca2f5d38a1`

Main incorporated Cluster C4 plus subsequent authority/evidence updates while this DEV remained isolated.

C4 also changes:

- `product/source/src/editor/chat-bounded-edit.js`
- `product/source/src/agent/capability-registry.js`

Because Cluster C is an explicit hard boundary for this DEV, this branch did **not** import or modify C4. GitHub currently reports Draft PR #152 as mergeable, but the PR still overlaps C4 in the shared CHAT integration files; CHAT / Core / Live authority must review the combined semantics before any merge.

## Boundary / STOP

- self-merge: **NO**
- deploy: **NO**
- Formal Live claim: **NO**
- FORMAT_VERSION change: **NO**

**STOP → CHAT / Core / Live authority.**
