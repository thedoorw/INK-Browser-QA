# INK UI final checklist CSS — DEV handoff v1.0

TASK: `INK-UI-FINAL-CHECKLIST-CSS-001`
BASE: `0e49341ac24aedd53d903606d5e2c256628bc1c7`
BRANCH: `work/ink-ui-final-checklist-css-001`
RESULT: `CSS_SOURCE_AND_STATIC_QA_READY / VISUAL_RECHECK_REQUIRED / STOP → UR`

## AB02: complete before/after importance inventory

The 36 original occurrences are listed below in source order. `Retain` means an explicit visibility or interaction state; `remove` means the cascade does not require importance for that presentation rule. The two reduced-motion declarations remain paired.

| # | Original line | Selector | Declaration | Disposition and reason |
|---:|---:|---|---|---|
| 1 | 62 | `[hidden]` | `display:none` | Retain: global hidden-state contract. |
| 2 | 64 | `.mobile-only` | `display:none` | Retain: responsive visibility state. |
| 3 | 299 | `.mobile-only` | `display:grid` | Retain: compact visibility state. |
| 4 | 299 | `.desktop-only` | `display:none` | Retain: compact visibility state. |
| 5 | 373 | `*` in reduced-motion query | `animation:none` | Retain: accessibility motion override. |
| 6 | 373 | `*` in reduced-motion query | `transition:none` | Retain: accessibility motion override. |
| 7 | 877 | `.menu-strip` | `display:none` | Retain: compact shell visibility state. |
| 8 | 892 | `[data-artboard-fixed][hidden]` | `display:none` | Retain: hidden-state contract. |
| 9 | 930 | `.topbar-center .history-group` | `display:none` | Retain: shell route visibility; prevents duplicate history controls. |
| 10 | 989 | `.application-command-menu[hidden]` | `display:none` | Retain: menu hidden state. |
| 11 | 999 | `.workspace-menu[hidden]` | `display:none` | Retain: menu hidden state. |
| 12 | 1075 | `.layers-panel.active` | `display:flex` | Retain: active panel visibility. |
| 13 | 1121 | `.history-panel.active` | `display:flex` | Retain: active panel visibility. |
| 14 | 1350 | `.empty-hint .empty-mark, .empty-hint>span, .empty-hint .hint-keys` | `display:none` | **Remove**: static decoration/empty hint presentation; normal cascade suffices. |
| 15 | 1387 | `.panel-dock,.panel-window-menu` | `display:none` | Retain: compact dock visibility state. |
| 16 | 2348 | `.creative-workspace-toggle` | `display:none` | Retain: retired duplicate opener route. |
| 17 | 2350 | `#inspectorToggle.legacy-inspector-toggle` | `display:none` | Retain: retired legacy opener route. |
| 18 | 2351 | `#closeInspector,.creative-workspace-head [data-workspace-action="close"]` | `display:none` | Retain: retired duplicate close route. |
| 19 | 2581 | `.selection-command-proxies` | `display:none` | Retain: invisible command proxies are not a second Primary Home. |
| 20 | 2948 | `.topbar-leading` | `display:none` | Retain: retired duplicate topbar controls. |
| 21 | 2949 | `.topbar .history-group` | `display:none` | Retain: retired duplicate Undo/Redo route. |
| 22 | 2950 | `.file-group .desktop-file` | `display:none` | Retain: retired duplicate File route. |
| 23 | 2951 | `#pagesToggle,#inspectorToggle.legacy-inspector-toggle` | `display:none` | Retain: retired duplicate panel openers. |
| 24 | 3003 | `.status-hidden-telemetry` | `display:none` | Retain: hidden telemetry state. |
| 25 | 3004 | `.document-status-info` | `gap:8px` | **Remove**: status spacing presentation. |
| 26 | 3009 | `.tool-rail .tool-label` | `display:none` | **Remove**: static desktop label presentation; later selector already wins. |
| 27 | 3017 | `.brush-family-head` | `display:none` | **Remove**: static flyout heading presentation; later rule wins. |
| 28 | 3042 | `.panel-options-menu[hidden]` | `display:none` | Retain: options menu hidden state. |
| 29 | 3046 | `.shell-panel-section` | `padding:0` | **Remove**: panel spacing presentation. |
| 30 | 3046 | `.shell-panel-section` | `overflow:hidden` | **Remove**: panel clipping/layout presentation. |
| 31 | 3048 | `.shell-panel-section.active` | `display:flex` | Retain: active panel state. |
| 32 | 3071 | `.pages-panel` | `display:none` | Retain: retired duplicate Pages surface. |
| 33 | 3076 | `.app.panel-primary-open .inspector-resizer` | `display:none` | Retain: shared-resizer interaction state. |
| 34 | 3084 | `.app.panel-width-resizing .inspector,.app.panel-width-resizing .creative-workspace-panel` | `transition:none` | Retain: resize interaction state must track pointer without animation. |
| 35 | 3090 | `.panel-stack-framework[hidden]` | `display:none` | Retain: stack hidden state. |
| 36 | 3191 | `.document-shell-chrome` | `display:none` | Retain: compact shell visibility state. |

**After:** 30 semantic declarations remain; six presentation declarations lost `!important`. The focused test rejects any retained property outside `display`, `animation`, or `transition` and pins reduced-motion and resize transition exceptions. No new importance was introduced.

## AO03: normal Light UI color roles

The final shell Dock text, panel heading, options hover, footer controls, status note, Pages rows and fields, History controls, Creative panel controls, and scrollbars now use the existing `--ink-ui-*` semantic palette. The options menu uses surface for its base and control hover for hover/focus, preserving visible state contrast. One scrollbar thumb role was added to that same `:root` authority. The existing dark legacy rules and distinct Navigator proxy/guide colors were not repurposed as normal Light gray roles. There is no new override layer or panel state authority.

## Focused proof and limits

`node --test qa/ink-ui-final-checklist-css.test.mjs qa/ink-ui-a-photoshop-shell-panels.test.mjs qa/ink-ui-b-full-capability-controls.test.mjs qa/ink-ui-c-photoshop-fidelity-closure.test.mjs`: **26 PASS / 0 FAIL**.

Source health from the pinned base:

| Metric | Before | After |
|---|---:|---:|
| `styles.css` characters | 184,692 | 185,605 (+0.49%) |
| `!important` total | 36 | 30 |
| Presentation `!important` | 6 | 0 |
| CSS rule blocks | 1,769 | 1,769 |
| Width families | 3 | 3 |
| New width thresholds | 0 | 0 |
| Tracked selector definition counts (`topbar/tool-rail/inspector/stage-wrap/statusbar/control-row/inspector-tab/creative-workspace-panel`) | `13/7/13/16/6/11/8/12` | same |

No shell/JS/Core/global file changed. The UI-A/B/C tests include generated Web/Portable parity, logo/favicon, responsive taxonomy and build/cache assertions. No new font-size authority, DOM IDs, visible Primary Home, panel state owner or menu controller was added; this is established by the file diff and focused QA, not a fresh browser run.

**Browser evidence remains open.** Headless Playwright is available, but its Chromium binary is absent from this workspace, so no 1280×1024 or 960×800 screenshot or hover/disabled/expanded-panel interaction was captured. UR must compare those states on the changed product before closing affected IDs. First paint and panel scrolling/stacking remain visual QA obligations. The absence of a browser run is not a PASS.

This CSS product-byte delta requires the owning review authority to decide exact-SHA integrated Runtime revalidation under the repository policy. DEV did not launch central Runtime and did not promote the branch.

Changed files: `product/source/styles.css`, `qa/ink-ui-final-checklist-css.test.mjs`, this handoff. UR rechecks AB02, AO03 and adjacent affected IDs; USER acceptance remains separate.
