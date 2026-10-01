# INK UI Normalization Technical-Debt Cleanup — Return

STATUS: STOP / AWAITING SUPERVISOR + USER REVIEW
AUTHORITY DATE: 2026-10-02; execution environment: 2026-10-01 UTC

This bounded pass consolidates covered CSS authority, retires superseded declarations, and isolates existing compact presentation from desktop workstation primitives. It adds no product feature or later visual override. The product change is `product/source/styles.css` only.

Baseline product: `c90df990cddedc7d7d7692b88200985a8b50d5aa`. Authority/main checkpoint: `87f47dedcb97bd62708d58cd5ef4454626f1079c`. The bounded commit is the commit containing this return and its evidence; its exact SHA is provided in the delivery.

## Source audit

“Rules removed” counts original covered CSS rule nodes deleted, coalesced or relocated; family rows overlap and must not be summed. The declaration manifest distinguishes actual retirement from compact-only relocation.

| FAMILY | LEGACY AUTHORITY FOUND | SHARED AUTHORITY | RULES REMOVED | INTENTIONAL VARIANTS KEPT | RESULT |
| --- | --- | --- | ---: | --- | --- |
| `.tool-rail` | Rounded/elevated base; several desktop/narrow width blocks | Desktop rail at shared workstation authority; --tool-w | 15 | Compact placement/theme and existing coarse-pointer affordance | Consolidated; current render checked |
| `.tool-button` | 52/45/40/36/34px historical cells; several active fills | --ui-tool-cell-width / --ui-tool-row-pitch; shared hover/active | 31 | Compact cells, active indicator, hover/focus/disabled and native tool-state selectors | Consolidated; current render checked |
| `.primary-button / shared buttons` | Repeated base/desktop button definitions | Live primary CTA role and existing common neutral control primitives | 31 | Compact CTA geometry; live primary vs ordinary role; Preferences role sizing | Consolidated; current render checked |
| `.tool-layout-toggle` | Left-only 9×8 SVG | Shared collapse control and .edge-chevron svg | 1 | Hover/focus and single/dual direction | Consolidated; current render checked |
| `.panel-edge-toggle` | No additional obsolete exact rule | Shared collapse control | 0 | Dock/framework direction and hover/focus | Consolidated; current render checked |
| `.edge-chevron` | Left child override retired through tool-layout-toggle | --ui-collapse-icon-width:7px / --ui-collapse-icon-height:5px | 0 | Existing rotations only | Consolidated; current render checked |
| `.panel-stack-tab` | No additional obsolete exact rule | --ui-panel-tab-height:28px | 0 | Active/hover/focus and overflow handling | Consolidated; current render checked |
| `.panel-stack-options` | No additional obsolete exact rule | --ui-icon-box and shared panel glyph tokens | 0 | Hover/focus; sticky menu control | Consolidated; current render checked |
| `.panel-stack-splitter` | No additional obsolete exact rule | --ui-panel-splitter-height:3px | 0 | Hover; existing 5px hit envelope; native resize state | Consolidated; current render checked |
| `.creative-workspace-field` | 92/82/72px legacy grids; redundant scoped 72px grid | One shared 72px label grid and --ui-row-pitch | 4 | Native form/control roles; expanded content unchanged | Consolidated; current render checked |
| `.layer-row` | Repeated base/theme/radius/active definitions | --ui-layer-row-pitch:35px; consolidated desktop row | 27 | Compact row, selection, hover, drag/drop, lock/visibility, empty-document visibility | Consolidated; current render checked |
| `.ui-b-layer-appearance` | Duplicated select/button declarations across base/desktop | Shared appearance container; role-specific controls | 1 | Compact control presentation, live native filter/blend/lock roles | Consolidated; current render checked |
| `Shared ranges/sliders` | No per-panel track/thumb authority added | Global 2px track / 9px thumb tokens | 0 | Disabled styling; document scrollbar semantics; container sizing | Consolidated; current render checked |
| `Shared scrollbars` | No rounded panel-specific variant introduced | 12px rectangular native scrollbar primitive | 1 | Intentional hidden rail/tab scrollbars; hover | Consolidated; current render checked |
| `.window-visual-controls` | No additional obsolete exact rule | Shared window box/icon tokens | 0 | Close/hover roles; compact hidden state | Consolidated; current render checked |
| `Top/menu and Options` | Repeated contextual/menu definitions | Existing menu/Options shared primitives | 10 | Open/active/disabled; compact overflow; live control roles | Consolidated; current render checked |

Original covered rule nodes retired/coalesced/relocated: **125**. Covered declarations: **1476 → 1308** (net 168 removed). The exact manifest contains 287 declaration operations, including necessary responsive relocation; that operation count is not a net deletion count.

[Exact removed rule/declaration manifest and retained reasons](evidence/ink-ui-normalization-cleanup-20261002/source-audit.json). Original line numbers refer to the baseline stylesheet. No source rule was added at higher specificity; exact-selector definitions are coalesced within the same context, and live shorthand/longhand ordering is retained. Compact declarations stay at their effective original cascade position, including the rail’s later shared light-surface styling.

The existing primary CTA role remains distinct from ordinary neutral buttons. Its surviving live styling is preserved; superseded global/desktop duplicates are removed. Existing compact corner/shadow styling is confined to compact context. This cleanup does not silently turn all remaining live roles or state variants into one generic button.

## Quantitative debt gate

| Metric | Before | After |
| --- | ---: | ---: |
| !important | 104 | 104 |
| Covered exact-selector duplicate definitions | 96 | 0 |
| Covered hard-coded color literal occurrences | 101 | 61 |
| Covered hard-coded geometry literal occurrences | 440 | 339 |
| Covered border-radius declarations | 67 | 54 |
| Covered box-shadow declarations | 44 | 31 |
| Breakpoint families | 7 | 7 (same set) |
| New state authority | 0 | 0 |
| State/command/routing source changes | 0 | 0 |

Duplicate count is excess exact selector-text definitions within the identical normalized ancestor/media context (`sum(max(definitions−1,0))`). Shared grouped primitives and distinct state/role selectors are separate identities; zero here is not a claim that all selectors matching an element have disappeared. Color and geometry counts are literal occurrences in covered declaration values, not unique values. Radius/shadow counts include required zero/none declarations and intentional responsive/state roles. Coverage predicate and complete breakpoint set are in the source-transform harness/audit.

All 273 product files were compared byte-for-byte against the published product baseline: only the stylesheet differs. All 224 JS/MJS files remain identical; HTML, FORMAT_VERSION, command IDs/handlers, History and panel routing remain identical. This is exact source preservation, not an inferred count of semantic authorities.

## Render and same-class evidence

Chromium 153.0.8010.0; 1280×1024; DPR 1; browser scale 100%; QA-only Noto Sans TC 400 registration; isolated localhost preview. Additional matched viewports: 960×800, 960×500 and 390×844. No production cached-session activation or central Runtime/Actions run was performed.

Actual DOM/computed CSS was measured after runtime installation. The fresh before/after trace contains 22 matched states and 1,156 candidate region measurements. The candidate passed 19 focused checks, including Tools containment, Layers add/duplicate/lock/visibility/reorder/delete/undo, Preferences category width, splitter resize, Edit command preservation and resource errors.

| Shared class | Fresh evidence |
| --- | --- |
| Collapse glyph | Left and right 7×5 in both Tools layouts; obsolete left 9×8 rule removed |
| Color swatches | Both foreground/background 18×18 in dual and single; same 10px positioning token; single cluster/utilities contained |
| Panel tabs | All visible stack tabs measured 28px |
| Slider | One global track/thumb source authority, 2px/9px tokens; no panel thumb/track size rules added |
| Scrollbar | Reference overflow measured native 12px, thumb radius 0px |

Native range pseudo-element size is source/CSSOM evidence plus rendered screenshot inspection; it is not mislabeled as a direct browser thumb-rectangle measurement. The shared scrollbar is measured in the actual overflowing Reference state.

The intended visible change is the left collapse glyph. All other measured region geometry/style and region counts remain equal across matched states; compact pixels are equal. Pixel comparison also records any tiny raster differences separately rather than treating them as source geometry changes. See the exact pixel bounds and computed deltas below.

An initial screenshot method could return stale compositor content despite correct DOM measurements. Final captures use CDP `Page.captureScreenshot` with `fromSurface:false`, and fresh Reference/control crops were checked against actual content. Early unreliable captures are not the delivery evidence.

| Required state | Before | After |
| --- | --- | --- |
| 1280 active document / Tools dual | [PNG](evidence/ink-ui-normalization-cleanup-20261002/before-active.png) | [PNG](evidence/ink-ui-normalization-cleanup-20261002/after-active.png) |
| Tools single | [PNG](evidence/ink-ui-normalization-cleanup-20261002/before-tools-single.png) | [PNG](evidence/ink-ui-normalization-cleanup-20261002/after-tools-single.png) |
| Right panels expanded | [PNG](evidence/ink-ui-normalization-cleanup-20261002/before-dock-expanded.png) | [PNG](evidence/ink-ui-normalization-cleanup-20261002/after-dock-expanded.png) |
| Right dock collapsed | [PNG](evidence/ink-ui-normalization-cleanup-20261002/before-dock-collapsed.png) | [PNG](evidence/ink-ui-normalization-cleanup-20261002/after-dock-collapsed.png) |
| Reference normal | [PNG](evidence/ink-ui-normalization-cleanup-20261002/before-reference.png) | [PNG](evidence/ink-ui-normalization-cleanup-20261002/after-reference.png) |
| Layers normal | [PNG](evidence/ink-ui-normalization-cleanup-20261002/before-layers-normal.png) | [PNG](evidence/ink-ui-normalization-cleanup-20261002/after-layers-normal.png) |
| Edit menu open | [PNG](evidence/ink-ui-normalization-cleanup-20261002/before-edit-menu.png) | [PNG](evidence/ink-ui-normalization-cleanup-20261002/after-edit-menu.png) |
| Preferences representative | [PNG](evidence/ink-ui-normalization-cleanup-20261002/before-preferences.png) | [PNG](evidence/ink-ui-normalization-cleanup-20261002/after-preferences.png) |
| Preferences branding | [PNG](evidence/ink-ui-normalization-cleanup-20261002/before-preferences-branding.png) | [PNG](evidence/ink-ui-normalization-cleanup-20261002/after-preferences-branding.png) |
| Reference actual scrollbar | [PNG](evidence/ink-ui-normalization-cleanup-20261002/before-reference-scroll.png) | [PNG](evidence/ink-ui-normalization-cleanup-20261002/after-reference-scroll.png) |
| Short viewport / single Tools | [PNG](evidence/ink-ui-normalization-cleanup-20261002/before-short-single.png) | [PNG](evidence/ink-ui-normalization-cleanup-20261002/after-short-single.png) |
| Compact preservation | [PNG](evidence/ink-ui-normalization-cleanup-20261002/before-compact.png) | [PNG](evidence/ink-ui-normalization-cleanup-20261002/after-compact.png) |

[Browser summary and checks](evidence/ink-ui-normalization-cleanup-20261002/browser-summary.json) · [Exact rendered deltas](evidence/ink-ui-normalization-cleanup-20261002/render-deltas.json) · [Full before trace, gzip JSON](evidence/ink-ui-normalization-cleanup-20261002/before-browser.json.gz) · [Full after trace, gzip JSON](evidence/ink-ui-normalization-cleanup-20261002/after-browser.json.gz)

Browser-loaded product responses: before 203, after 203; all response bytes matched the served snapshot. This proves isolated-preview source identity only, not deployed or existing user-cache identity.

Before stylesheet SHA-256: `1d234d83376e0e2c87b739ca93f58dad74bfecbe24eed55d977e8c9e0c8f21d2`. Candidate stylesheet SHA-256: `a4657f28b5005b11b1e6dcf2ad4e979efb2261049b879699989ac539a0d276db`.

## Reproduction and boundaries

Review support files:
- `working/qa/ink-ui-normalization-cleanup-20261002.cjs` (browser harness).
- `working/qa/ink-ui-normalization-cleanup-source-transform-20261002.cjs` (exact bounded transform/audit recipe; do not apply to a different baseline).

Run the harness with `INK_REPO_ROOT` set to the candidate checkout, `INK_QA_BASELINE` set to the baseline checkout for the before run (omit for after), and Playwright on NODE_PATH. Set `INK_QA_CHROMIUM_MODULE` to the packaged Chromium ESM entry and `INK_QA_FONT_ROOT` to @fontsource/noto-sans-tc. This run used the environment Playwright, @sparticuz/chromium and Noto Sans TC packages. For the audit recipe, set `INK_CLEANUP_BASELINE_CSS` to the exact baseline styles.css and resolve `INK_POSTCSS_MODULE` to PostCSS 8.5.28. Node syntax checks passed for both delivered scripts.

SUP-01 Specialist/Adjustments panel-state identity and SUP-02 Reference expanded content remain for Supervisor/USER review. Existing compact overflow or unobserved coarse-pointer states are not claimed repaired by this pass. No capability expansion, Layers redesign, feature parity work or further visual-polish pass was performed.

**STOP. Supervisor + USER must review the containing commit and fresh renders before any further work. These results do not declare Photoshop fidelity or final UI completion.**
