# INK UI Recovery + C04 Combined Promotion — DEV Dispatch v1.0

STATUS: ACTIVE / AUTHORIZED
DATE: 2026-10-02
REPOSITORY: thedoorw/INK-Browser-QA
SSOT: GitHub

## Purpose

Promote the already accepted UI recovery composition plus the already accepted C04 圖紙 / 手繪板 two-state repair onto latest main as one combined product promotion.

This is an integration/promotion task only. It is not a new UI or Core design pass.

## Accepted inputs

Core already integrated on main:
- integrated main checkpoint: `892c1917280b87c9e44b7a8567517bf24d7e0122`
- accepted Core product/source tree at that checkpoint: `5d234ef03f56dfc6148192a771016b7f90fe8407`

Accepted UI recovery:
- immutable product candidate: `cdb90787b8a17729a67e6318ded6557fee5b730f`
- branch HEAD: `8f1666804058caf9b968d51137967c61fd9cc222`
- Supervisor review: `working/INK_UI_CURRENT_MAIN_RECOVERY_SUPERVISOR_REVIEW_20261002.md`

Accepted C04 repair:
- immutable product candidate: `584e44ac75af294508440d8d4196c81942fff739`
- branch evidence HEAD: `d0b56db04630b4a9c41b50a7c54f25f3bd744bef`
- accepted product/source tree: `5ccaac62ed85176d69e07a1b72b1cac20c507f87`
- Supervisor review: `working/INK_C04_TWO_STATE_REPAIR_SUPERVISOR_REVIEW_20261002.md`

The C04 exact candidate already contains the accepted UI recovery product composition and the integrated Core baseline.

## Required method

```text
latest main
→ confirm no intervening product/source mutation outside the accepted sequence
→ fresh combined-promotion branch
→ replay/install accepted combined product delta only
→ preserve unrelated latest-main documentation / QA work
→ final product/source tree MUST equal 5ccaac62ed85176d69e07a1b72b1cac20c507f87
→ focused browser verification
→ integrate exact accepted product composition to latest main
→ verify post-integration identity
→ STOP to Supervisor / USER deployed visual checkpoint
```

Suggested branch:
`work/ui-recovery-c04-combined-promotion-001`

Do not merge or fast-forward either historical recovery or C04 branch wholesale.

## Pre-promotion guard

Before changing product/source on the promotion branch:

1. compare latest main against the C04 entry/main checkpoints;
2. verify intervening main commits do not contain unrelated `product/source` mutations;
3. if any intervening product/source bytes differ from the expected pre-promotion product composition, STOP to Supervisor instead of overwriting them.

Current Live-test / QA-only / documentation work must be preserved and must not be folded into the promoted product delta.

## Required product result

After replay, complete `product/source` must be byte-identical to:

`5ccaac62ed85176d69e07a1b72b1cac20c507f87`

Expected accepted product behavior includes:
- post-SUP11 recovery UI installed;
- workspace switch fixed-right in Options Bar through the accepted shared authority;
- eleven per-menu fixed width authorities absent;
- competing global `scrollbar-color` authority absent;
- rectangular shared panel-scrollbar grammar retained;
- visible terminology `手繪板 / 圖紙`;
- one existing C04 state authority;
- Creation and Layout both reachable;
- no-document switch disabled / no false active state;
- integrated Core spatial-index repair retained;
- FORMAT_VERSION remains 4.

If the final product/source tree is not exact, do not call the promotion complete. Explain the difference and STOP unless the divergence is a separately authorized latest-main product change.

## Focused browser verification

Run a fresh current-main-composition browser pass after replay.

At minimum verify:

### Identity
- loaded build/product files correspond to the promoted candidate;
- `product/source` tree = `5ccaac62ed85176d69e07a1b72b1cac20c507f87`;
- FORMAT_VERSION = 4.

### UI recovery
- 1280×1024 document state: workspace switch visible at Options Bar far right;
- 960×800 document state: switch visible without overlap;
- application-menu trigger spacing remains shared/content-driven;
- overflowing right panels use the accepted rectangular scrollbar treatment.

### C04
- no document: both workspace buttons disabled and unpressed;
- New: opens existing A4 Layout state;
- `圖紙 → 手繪板 → 圖紙`;
- repeated round trip;
- visible pressed state matches:
  - `app.dataset.space`
  - `InkApp.spaceMode()`
  - authoritative page workspace state;
- page switch preserves per-page state where exercised;
- autosave/reload restores authoritative state where existing schema supports it;
- selection/content/History do not change merely from workspace switching.

### Regression guard
- Core exact-ID spatial-index behavior remains present;
- no product-origin browser error/warning in exercised states;
- no C06 / Properties / New Document architecture / History mutation appears in the diff.

## Technical-debt guard

```text
NEW_IMPORTANT_COUNT = 0
NEW_BREAKPOINT_FAMILY = 0
NEW_DUPLICATE_UI_STATE_AUTHORITY = 0
NEW_DUPLICATE_WORKSPACE_STATE_AUTHORITY = 0
NEW_ONE_OFF_GRAY_LITERAL_FOR_COVERED_CLASSES = 0
NEW_FAKE_AFFORDANCE = 0
FORMAT_VERSION = 4
```

Do not add a promotion-only CSS or JS workaround to make the combined state pass.

## Hard boundaries

Do not include:
- C06 12800% zoom;
- Properties clipping repair;
- New Document / A4 architecture work;
- History redesign;
- Live CHAT drawing-exposure PR/candidate work;
- unrelated panel or toolbar redesign;
- any new workspace state owner.

## Completion

When the exact accepted composition is integrated onto latest main, record:

```text
LATEST_MAIN_BASE
PROMOTION_BRANCH
PROMOTION_CANDIDATE
INTEGRATED_MAIN_SHA
PRODUCT_SOURCE_TREE
TREE_IDENTITY = EXACT / NOT_EXACT
BROWSER_CHECKS
FORMAT_VERSION
UNRELATED_PRODUCT_MUTATION = NONE / DETAILS
USER_VISUAL_CHECKPOINT = READY
```

Final stop:

`COMBINED PROMOTION INTEGRATED → SUPERVISOR / USER DEPLOYED VISUAL CHECKPOINT`

C06, Properties clipping and New Document remain separate after this promotion.
