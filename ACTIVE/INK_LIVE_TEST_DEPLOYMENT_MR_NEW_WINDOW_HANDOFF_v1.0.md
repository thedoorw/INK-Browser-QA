# INK Live Test / Deployment MR — New Window Handoff v1.0

DATE = 2026-10-03
ROLE = INK Live Test / Deployment MR / CHAT-Core-Live integration authority
SOURCE_REPO = thedoorw/INK-Browser-QA
LIVE_REPO = thedoorw/INK
LIVE_URL = https://thedoorw.github.io/INK/
GITHUB = ONLY SSOT
FORMAT_VERSION = 4

## Purpose

This file hands the current Live Test / Deployment MR role to a fresh CHAT window.

The successor is not a new DEV owner for Cluster C / D / C019. Those packages already have independent DEV windows. This role reviews their returns, integrates accepted exact candidates to current main, deploys exact source identities to the Live repo, performs Formal Live qualification, and closes SSOT records.

## Read first

Source repo:
- `README.md`
- `INK_LIVE_TEST_HANDOFF.md`
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md`
- `ACTIVE/INK_LIVE_TEST_PROGRESS.md`
- `ACTIVE/INK_CLUSTER_C_LAYOUT_PAGE_ARTBOARD_DEV_DISPATCH_v1.0.md`
- `ACTIVE/INK_CLUSTER_D_MATERIAL_RECIPE_DEV_DISPATCH_v1.0.md`
- `ACTIVE/INK_C019_TEXT_WARP_RENDER_INTEGRATION_DEV_DISPATCH_v1.0.md`

Live repo:
- `BUILD_INFO.json`
- `TEST_PLAN.md`
- `CASE_SWEEP.md`
- `TEST_FINDINGS.md`

Always re-read latest main and current branch / PR state before acting. Do not trust fixed SHAs in this handoff as current after another window advances GitHub.

## Handoff checkpoint observed 2026-10-03

Main observed at handoff:
`b6f837643064100b04cad12e338db782709ce255`

Important reconciliation:

The earlier conversation state saying “B3 is still in progress” is stale relative to GitHub SSOT.

Current `ACTIVE/INK_LIVE_TEST_PROGRESS.md` records:

```text
B3 Paint Bucket = CLOSED / FORMAL LIVE QUALIFIED
B3 Raster Mask = CLOSED / FORMAL LIVE QUALIFIED
B3 Spot Healing = CLOSED / FORMAL LIVE QUALIFIED
B3 non-source Local Retouch = CLOSED / FORMAL LIVE QUALIFIED
B3 source-dependent Retouch = CLOSED / FORMAL LIVE QUALIFIED
B3 direct/local raster scope = CLOSED FOR QUALIFIED CHAT ROUTES

Advanced mutable raster ingest:
PSD / TIFF / EXR = CLOSED / FORMAL LIVE QUALIFIED
RAW = qualified adapter contract; default Live has no approved adapter
```

Do not reopen B3 or advanced ingest merely because an older Work Order paragraph still describes B3 as current.

Cluster C progress already recorded on main:
- C1 Page lifecycle = CLOSED / merged / deployed / Formal Live qualified.
- C2 Align / Distribute = CLOSED / merged / deployed / Formal Live qualified.
- PR #151 states C3 Snap / Guides is already merged and candidate-qualified by PR #149; verify the authoritative current record before making any C3 closure claim.
- C4 Artboard is now the immediate C DEV return awaiting CHAT / Core / Live authority review.

## Current parallel DEV ownership

### Cluster C

Branch:
`work/ink-cluster-c-layout-page-artboard-001`

Open draft PR at handoff:
PR #151 — `DEV PASS: Cluster C4 Artboard CHAT exposure`

PR-reported exact product candidate:
`6dca38862352a5ffcd2193b943c017f70eecd4e2`

PR-reported candidate QA:
- run `37112623108`
- artifact `11270164226`
- digest `sha256:f641600e0f6bafe03044fd8ee318e48a5af2d082be393174c5b665e2029f1e0b`
- C4 PASS
- regressions reported PASS: C3 / C2 / C1 / A2 / B2 / B4

DEV has explicitly STOPPED for authority review. It does not own merge or deployment.

### Cluster D

Branch:
`work/ink-cluster-d-material-recipe-001`

Observed branch head at handoff:
`bb41421ca8066e315ffa670d4ff18b8c9fcb0655`

Latest observed work:
`Cluster D: add read-only recipe inventory bridge`

Status: DEV active. Do not duplicate its Material / Recipe work.

### C019 Text Warp / Curved Text

Branch:
`work/ink-c019-text-warp-render-001`

Observed branch head at handoff:
`aa5dab48e7eb480fae05cf1dd40ec1bac7a50b20`

Latest observed work:
`fix: preserve canvas state in Text path rendering`

Status: DEV active. Do not duplicate its Text render-integration work.

## Successor priority

### 1. Review and close Cluster C return first

For PR #151:

```text
fetch latest main
→ inspect exact candidate diff
→ verify no second Document / History / Layout / Renderer authority
→ verify no UI C04/C06 / New Document / B3 / D / C019 spill
→ verify FORMAT_VERSION remains 4
→ inspect candidate QA/evidence
→ account for all intervening main product mutations
→ if accepted, integrate exact accepted C4 composition onto latest main
→ run required focused/integrated regressions
→ select exact merged source SHA
→ deploy that exact source to thedoorw/INK
→ update BUILD_INFO.json
→ Formal Live C4 test
→ update TEST_FINDINGS.md
→ update ACTIVE/INK_LIVE_TEST_PROGRESS.md
→ close C package
```

Do not merge PR #151 blindly if main has changed in a way that affects the accepted product bytes. Reconcile and re-qualify as needed.

### 2. Receive D and C019 DEV returns independently

Each DEV window must stop at:
`exact candidate + browser QA + regressions + evidence + DEV return`.

This authority then performs:
`review → integration → exact-SHA deployment → Formal Live → SSOT closure`.

Do not combine D and C019 into one product candidate unless a real source conflict makes a bounded integration candidate necessary.

### 3. Continue as overall Live / integration coordinator

After C / D / C019:
- re-read `ACTIVE/INK_CURRENT_WORK_ORDER.md` and `ACTIVE/INK_LIVE_TEST_PROGRESS.md`;
- identify the next unclosed CHAT capability only from current SSOT;
- do not resurrect already closed packages from stale conversation context;
- keep Live deployment identity exact and auditable.

## Separate owners / do not disturb

At handoff, separate concurrent work includes:
- PWA / Cache Freshness;
- C06 12800% Canvas Navigation;
- UI fidelity / PR #109 and related UI authority.

Do not absorb those into CHAT capability integration.

PR #109 is an old UI draft and must not be modified or merged as part of C / D / C019 closure.

## Capability boundaries

Preserve existing authorities:
- Document
- History
- Renderer
- Path / Stroke
- rasterState
- Material
- Recipe
- Text

Rules:
- no second authority;
- no pointer/mouse emulation where native authority exists;
- proposal / approval / execute for bounded CHAT mutations;
- explicit stable native targets;
- stale-target and NO_OP behavior where applicable;
- Preview + Context + History + exact Undo/Redo evidence;
- product repairs only in `INK-Browser-QA`;
- Live repo is deployment wrapper / identity / test evidence, not a second product source;
- no FORMAT_VERSION change without USER authorization.

## Follow-ups that are not automatically next

Do not automatically open these merely because they remain unqualified:
- Pattern Stamp bounded pattern-asset contract;
- GPU Blender/Smudge transport parity;
- Paint Session mixers;
- PSB;
- default-runtime RAW success without an approved adapter.

They require a later priority decision or explicit current SSOT queue.

## New-window short instruction

```text
你是 INK Live Test / Deployment MR / CHAT-Core-Live integration authority。

GitHub 是唯一 SSOT。

Source:
thedoorw/INK-Browser-QA

Live:
thedoorw/INK
https://thedoorw.github.io/INK/

先讀：
- README.md
- INK_LIVE_TEST_HANDOFF.md
- ACTIVE/INK_LIVE_TEST_DEPLOYMENT_MR_NEW_WINDOW_HANDOFF_v1.0.md
- ACTIVE/INK_CURRENT_WORK_ORDER.md
- ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md
- ACTIVE/INK_LIVE_TEST_PROGRESS.md
- Live repo BUILD_INFO.json / TEST_FINDINGS.md / TEST_PLAN.md

注意：B3 與 advanced mutable raster ingest 已依 GitHub SSOT 關閉，不要重做。

目前先接手 Cluster C DEV return：review PR #151 的 exact C4 candidate / QA / evidence；接受後整合 latest main、exact-SHA deploy、Formal Live、更新 closure。

Cluster D 與 C019 已各有獨立 DEV branch；等它們交 exact candidate + evidence 後，由你 review / integrate / deploy / Formal Live。不要搶做它們的 DEV 工作。

不碰 UI PR #109、PWA、C06、New Document。FORMAT_VERSION 維持 4。
```

## Post-handoff authority update — Cluster C closed 2026-10-03

Cluster C C1–C4 is CLOSED / merged / deployed / Formal Live qualified. PR #151 C4 was accepted and integrated/deployed at exact source `701c22beabd873376c71dc2dd15abc8bfe073732`; Formal Live run `37113424982` PASS. C3 PR #149 is also closed with candidate and Formal Live snap/guide evidence. See `working/INK_CLUSTER_C_LAYOUT_PAGE_ARTBOARD_AUTHORITY_CLOSURE_20261003.md`.

Do not reopen Cluster C. Continue to wait for Cluster D and C019 independent DEV exact candidate + evidence returns, then review → integrate → exact-SHA deploy → Formal Live. B3 and advanced mutable raster ingest remain closed. UI PR #109, PWA, C06 and New Document remain out of scope. `FORMAT_VERSION=4`.

## Post-handoff authority update — C019 closed 2026-10-03

C019 PR #152 is CLOSED / merged / deployed / Formal Live qualified at exact integrated source `ff6e329e372a0b3c8b756cd74cc881b28fa404f9`; Formal Live run `37114248495` PASS. See `working/INK_C019_TEXT_WARP_RENDER_INTEGRATION_AUTHORITY_CLOSURE_20261003.md`.

Do not reopen C019 curved/path Text. Broad Text envelope/general warp is not implied. Cluster D remains the independent DEV return still eligible for authority review once its final exact candidate + evidence is submitted. Cluster C, B3 and advanced mutable raster ingest stay closed; UI PR #109, PWA, C06 and New Document remain out of scope. `FORMAT_VERSION=4`.
