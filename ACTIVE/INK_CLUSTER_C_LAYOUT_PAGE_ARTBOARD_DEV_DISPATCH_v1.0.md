# INK Cluster C — Layout / Page / Artboard DEV Dispatch v1.0

DATE = 2026-10-03
ROLE = INK Cluster C Layout / Page / Artboard DEV
SOURCE_REPO = thedoorw/INK-Browser-QA
LIVE_REPO = thedoorw/INK
GITHUB = ONLY SSOT
STATUS = AUTHORIZED DEV PACKAGE
MERGE = NO
LIVE_DEPLOY = NO
FINAL_ACCEPTANCE = CHAT / Core / Live authority

## Read first

- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md`
- `ACTIVE/INK_LIVE_TEST_PROGRESS.md`
- `working/INK_LIVE_CLUSTER_C_LAYOUT_PAGE_ARTBOARD_SOURCE_AUDIT_20261002.md`

Re-read latest main before implementation. Check concurrent product branches/PRs and do not overwrite unrelated work.

## Objective

Close Cluster C CHAT capability gaps by exposing existing native authorities for:

```text
C1 Page operations
C2 Align / Distribute
C3 Snap / Guides
C4 Artboard state
```

This is primarily **PRODUCT EXISTS / CHAT EXPOSURE GAP**. Do not create a second page, layout, snapping, guide, artboard, History, Document or Renderer authority.

Cluster C here is the Live capability cluster. It is not UI C04 / C06.

## Branch

Create from latest main:

```text
work/ink-cluster-c-layout-page-artboard-001
```

If an existing active branch already owns the same capability surface, STOP and record the conflict instead of duplicating work.

## Required native routes

### C1 Page operations

Expose bounded proposal-required operations using existing page authority:

```text
page.create.v1
page.duplicate.v1
page.delete.v1
page.rename.v1
page.activate.v1
```

Requirements:
- existing `doc.pages / activePageId`;
- existing `InkApp` page methods where semantics match;
- minimum-one-page invariant;
- stable page IDs in structured results;
- Document/Page/Revision preconditions;
- no New Document redesign.

### C2 Align / Distribute

Expose:

```text
object.align.v1
```

Modes:

```text
left / centerX / right / top / centerY / bottom / distributeX / distributeY
```

Requirements:
- explicit stable object refs;
- >=2 refs for alignment;
- >=3 refs for distribution;
- reuse existing `InkApp.alignSelection()` and `applyWorldTransformBatch()`;
- no duplicate alignment/distribution math;
- preserve target fingerprint / Revision guards.

### C3 Snap / Guides

Expose existing precision-layout authority:

```text
page.snap.set.v1
guide.add.v1
guide.move.v1
guide.remove.v1
guide.lock.set.v1
guide.visibility.set.v1
```

Requirements:
- active-page scoped;
- use existing precision-layout functions / InkApp wrappers;
- structured normalized snap/guide result;
- no pointer simulation.

### C4 Artboard state

Expose:

```text
page.artboard.set.v1
```

Initial accepted keys:

```text
orientation
ppi
bleedMm
safeMarginMm
unit
showBleed
showSafeArea
showCenter
clipContent
```

Route through existing `InkApp.changeArtboard()`.

Do not expand custom paper / width / height / New Document architecture inside this package.

## Qualification

At minimum prove in browser/native runtime:

1. create second page → Context / History;
2. duplicate page → unique identities;
3. activate / rename / delete → minimum-page invariant;
4. align two or more explicit refs;
5. distribute X or Y on three refs;
6. snap setting mutation + guide add/move/remove;
7. artboard orientation and one bleed/safe mutation;
8. Preview after visible layout/artboard-affecting mutations;
9. Undo / Redo exact state restoration;
10. stale target / invalid ref / invalid enum or bound rejection where applicable;
11. affected existing CHAT regressions, including representative drawing/raster/path routes.

Tool-call success alone is not PASS.

## Evidence / return

Record:
- latest-main base SHA;
- exact candidate SHA;
- exact changed files;
- native authority reused;
- browser evidence;
- History / Undo / Redo evidence;
- regressions;
- any unresolved gap or product defect.

Create a branch-local return under `working/` and evidence under `qa/evidence/`.

## Hard boundaries

Do not touch:
- New Document / A4 redesign;
- UI C04 workspace;
- UI C06 12800% zoom;
- remaining whole-UI Photoshop fidelity work;
- B3 raster/masks;
- Cluster D Material/Recipe;
- C019 Text Warp;
- History redesign;
- new output serializer;
- FORMAT_VERSION.

If a required change would create a new core authority, alter FORMAT_VERSION, or conflict with an active owner, STOP with evidence.

## Completion gate

```text
source audit confirmed
→ existing authority reused
→ bounded CHAT exposure
→ exact candidate
→ focused browser QA + affected regressions
→ branch-local return/evidence
→ STOP → CHAT / Core / Live authority
```

Do not merge to main.
Do not deploy to `thedoorw/INK`.
Do not claim Formal Live closure.
