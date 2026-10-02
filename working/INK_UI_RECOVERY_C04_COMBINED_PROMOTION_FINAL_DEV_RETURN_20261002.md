# UI Recovery + C04 Combined Promotion — Final DEV Return 2026-10-02

STATUS: COMBINED PROMOTION INTEGRATED / DEPLOYED CHECKPOINT READY

## Exact identity

- LATEST_MAIN_BASE: `1fb3f3d5046bb7b7e94b06b07a495e2cea5014ef`
- PROMOTION_BRANCH: `work/ui-recovery-c04-combined-promotion-001`
- PROMOTION_CANDIDATE: `78d4e9e5b749d74a8a93503d87f7c85f75e1bd98`
- ACCEPTED_INPUT: `584e44ac75af294508440d8d4196c81942fff739`
- INTEGRATED_MAIN_SHA: `aa01f1e311eb22cb572a61efea19b8bb21a96157`
- PRODUCT_SOURCE_TREE: `5ccaac62ed85176d69e07a1b72b1cac20c507f87`
- TREE_IDENTITY: EXACT on accepted input, fresh promotion candidate and integrated main.
- BUILD_ID: `20261002-c04-two-state-repair`
- FORMAT_VERSION: 4
- UNRELATED_PRODUCT_MUTATION: NONE
- USER_VISUAL_CHECKPOINT: READY / NOT ACCEPTED

Authority: `ACTIVE/INK_UI_RECOVERY_C04_COMBINED_PROMOTION_DEV_DISPATCH_v1.0.md`; Supervisor acceptance `working/INK_C04_TWO_STATE_REPAIR_SUPERVISOR_REVIEW_20261002.md`.

## Diff boundary and integration

Latest main had no intervening product/source mutation after accepted Core integration `892c1917`. It retained Core product tree `5d234ef03f56dfc6148192a771016b7f90fe8407`. Live Cluster B documentation added after the dispatch remains intact.

Fresh promotion candidate installs the accepted complete subtree as one Git-object operation, with its sole parent latest main. No historical branch was merged wholesale. Candidate changes only these seven product files:

- index.html
- index-standalone.html
- shell.template.html
- styles.css
- service-worker.js
- src/config.js
- src/ink.js

Their combined diff is 34 additions / 46 deletions. This includes already accepted UI recovery and C04; promotion introduces no extra product bytes. Integrated main additionally carries one QA-only read-only observer: `qa/runtime/ink-combined-promotion-78d4e9e5.html`. Evidence/report publication is a subsequent documentation/QA-only checkpoint.

## Fresh verification

Evidence: `qa/evidence/combined-promotion-20261002/`; SHA-256 and lengths in `evidence-manifest.json`.

- Captured evidence/Git identity verifier: 66/66. Reproduce with `python qa/runtime/verify-ink-combined-promotion.py`.
- Existing spatial-index + artboard/output/workspace suites: 11/11 (3 + 8). Test-only old QA import adapter symlink is not committed.
- Shell generator `--check` and `node --check src/ink.js`: PASS.
- Pre-integration pass: 15 fresh observations on the already deployed immutable composition, whose entire product tree equals the promotion candidate. Three native round trips, 1280/960 no-document/New/both states, actual rectangle with preserved selection/content/full History stats.
- Post-integration pass: 11 fresh observations on official `product/source`, including New A4 Layout, both states, two-page independent activeSpace, Layout autosave/reload preserving page ID/content/workspace/cameras, and 960 round trip.
- Seven freshly fetched assets and three actually instantiated workspace methods match candidate bytes, both before and after integration. This is not full transitive-module browser attestation; complete source identity is proven by Git tree equality.
- Switch is one node under contextualOptions, 136.75×26; its two buttons are each 66.375×22, 12px text / 14.4px line-height. Right edge 1271 at 1280, 951 at 960, both 9px inset. 960 control host does not overlap it.
- Eleven menu triggers share 8px horizontal inset and 12px text. Their content-driven widths range 51.28125–58.375px; no per-menu width owner.
- Overflowing right panels have computed scrollbar-color auto and thumb/track radius 0px, visibly rectangular.
- Exercised warning/error windows show extension-origin entries only; no product-origin warning/error observed.
- Core spatial-index source is byte-identical to pre-promotion main; fresh existing spatial tests pass. No new central Runtime or certification is claimed.

Screenshots retain native raster sizes; iframe CSS viewport is 1280×1024 or 960×800, DPR1. A 1280 top capture does not cover the entire 1024 height in the outer browser viewport; full visible 960 composition is separately supplied. Direct deployed screenshot uses the browser's 1363×936 viewport.

Review exposure: implementation/source-exposed delta-first review, not independent blind acceptance. Visible deltas checked against expected accepted composition before state conclusions; same-class, numeric and state coverage are recorded. Whole Photoshop fidelity PASS and USER visual PASS are not claimed.

## Technical-debt guard

- New important count 0 (103 → 103); new breakpoint families 0.
- New duplicate UI/workspace state owner 0.
- New one-off gray literal / fake affordance 0.
- No promotion-only CSS or JS patch.
- Eleven obsolete menu width owners and competing global scrollbar-color remain removed; shared fixed-right switch and rectangular scrollbar authority retained.
- Existing page.workspace / activateWorkspace / camera authority retained.
- Core, FORMAT_VERSION, History, renderer, C06 ceiling and New Document architecture unchanged by promotion.

## Recovery notes and open boundaries

Initial Playwright locator attempts did not change actual workspace state; they are excluded from successful coverage. Native AX control actions produced fresh, matching authoritative states. A later stale Pages AX node was refreshed and completed. Initial post-integration harness 404 was Pages propagation, then the exact checked-in route loaded successfully. None required a product workaround.

Previously recorded two document appVersion assertions remain an inherited baseline issue; they were not altered or presented as passing. This pass runs the scoped 11 tests above.

Separate open work: C06 12800%, Properties clipping, New Document/A4 architecture, remaining whole-UI fidelity and unrelated Live CHAT exposure. The `thedoorw/INK` Live-test repository is not changed by this source-repository promotion.

Verified deployed page: https://thedoorw.github.io/INK-Browser-QA/product/source/

STOP: COMBINED PROMOTION INTEGRATED → SUPERVISOR / USER DEPLOYED VISUAL CHECKPOINT.
