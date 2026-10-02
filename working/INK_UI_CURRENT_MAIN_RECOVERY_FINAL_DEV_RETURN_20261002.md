# Current-main UI recovery — final DEV return — 2026-10-02

STATUS: REQUIRED_EVIDENCE_COMPLETE / STOP_TO_SUPERVISOR / ACCEPTANCE_PENDING

Branch: `work/ink-ui-current-main-recovery-001`.
Immutable product candidate: `cdb90787b8a17729a67e6318ded6557fee5b730f`.
Product/source tree: `86bdf0eacebb6f930062d9d2c1bb9b048b9fc7ca`.
Base after accepted Core integration: `0ad0c663597f4373b5815364c5a9d7cae40365b4`.

This evidence continuation does not change candidate product bytes. It completes the USER directive in the current main Work Order and recovery dispatch. It supersedes the incomplete-evidence disposition in `INK_UI_CURRENT_MAIN_RECOVERY_CLOUD_REVIEW_20261002.md`, without deleting that provenance. This is a DEV handoff, not Supervisor acceptance, USER visual PASS, or permission to begin C04.

## Evidence completion matrix

Evidence root: [`../qa/evidence/ui-recovery-complete-20261002/`](../qa/evidence/ui-recovery-complete-20261002/). Every named file is indexed with size and SHA-256 in `evidence-manifest.json`. Prior same-candidate fresh cloud captures remain in `../qa/evidence/ui-recovery-cdb90787-cloud/`.

| Dispatch gate | Result | Evidence |
|---|---|---|
| 1280×1024 no-document | COMPLETE | `1280-no-document-top.jpg`, `1280-no-document-bottom.jpg`; state-geometry `1280-no-document`; actual frame innerWidth/Height 1280/1024, DPR1; four Navigator controls disabled |
| 1280×1024 document-open | COMPLETE | `1280-brush-top.jpg`, `1280-brush-bottom.jpg`; native File > New; `1280-stable-brush`; Navigator enabled, visible A4 document |
| 960×800 document-open | COMPLETE | `960-brush.jpg`, `960-text.jpg`, `960-lasso.jpg`; frame 960/800, DPR1; full content visible within outer screenshot |
| Brush Options | COMPLETE | stable 1280 and 960 state records and screenshots |
| Text Options | COMPLETE | `1280-text.jpg`, `960-text.jpg`; font/size/direction, switch visible |
| Lasso Options | COMPLETE | `1280-lasso.jpg`, `960-lasso.jpg`; tool selected via existing flyout, switch visible |
| Menu geometry | COMPLETE | all 11 triggers in state-geometry; shared left/right padding8px; label-dependent widths51.28125–58.375px |
| Reference scrollbar | COMPLETE | `1280-reference-scrollbar.jpg`; actual expanded summaries, client243/scroll282px |
| Layers scrollbar | COMPLETE | `960-layers-scrollbar.jpg`; actual 13 layer rows, client192/scroll470px; later14 rows506px |
| History scrollbar | COMPLETE | same-candidate fresh `../ui-recovery-cdb90787-cloud/history-scroll-1363.jpg`; 12/30 real history steps; `history-sample-disposition.json` measures painted square thumb8×264px, ±1px JPEG tolerance |
| Libraries scrollbar | COMPLETE | `960-libraries-scrollbar.jpg`; actual empty library content, client167/scroll360px |
| Properties scrollbar or valid disposition | COMPLETE — NO_RENDERED_OVERFLOW_IN_TESTED_STATE | stable Brush topology, ancestor chain and cards measured; details below |
| Browser-loaded HTML/CSS identity | COMPLETE | actual browser downloads byte-identical to exact candidate; `browser-source-byte-identity.json`, loaded DOM/CSSOM and selector alignment |
| Page error check | COMPLETE — NO_PRODUCT_ERROR_OBSERVED | `browser-errors.json`; all available warn/error entries from4 QA tabs, limit10000, totals30/11/28/20, all extension-origin |
| Tech-debt return | COMPLETE | `source-identity-tech-debt.json`, source return and table below |
| Final DEV return | COMPLETE | this document, manifest, branch evidence publication |

## Capture geometry and honest scope

The browser has a1363×936 outer viewport and no documented viewport resize API. The actual application browsing contexts are verified at1280×1024 and960×800 through HTTPS iframe harnesses. The dispatch specifies application viewport states; it does not require a top-level browsing context. The earlier partial review's statement that framed evidence could only supplement a top-level capture is therefore replaced by this explicit, measured evidence method. No native top-level1280 capture is claimed.

For1280, two native screenshots cover the full application height: outer scrollY0 covers application y0–936; outer scrollY88 covers y88–1024. Their overlap and exact frame geometry provide full state coverage without resizing, image synthesis, or hiding content. Screenshot raster export is1348×926 in the fresh harness; DOM viewport units remain1280×1024. Raster size must not be mistaken for CSS viewport size. 960 content is fully contained in the1363×936 screenshot. The capture pair is the evidence unit; neither1280 image alone is claimed to be a full-height screenshot.

Full-page and out-of-viewport clip capture timed out; work continued using the native capture route. The unused local-file harness was blocked by browser URL policy and is not evidence. HTTPS repository QA artifacts were used instead. Stable tool labels were checked after runtime settling; an interim `1280-document-brush` record showing the prior selection label is excluded. Corrected Text/Lasso captures include the complete Options Bar upper edge. No old-branch PASS is substituted for current evidence.

## Numeric and same-class findings

In all tested Brush/Text/Lasso states, `workspaceSwitch` count=1, parent=`contextualOptions`, right edge=1271 at1280 and951 at960. Host right=1152.5/832.5; switch left=1158.5/838.5: gap6px, viewport right inset9px, width112.5px, height26px. No overlap. Contextual host overflow remains the existing flex/overflow authority.

The11 menu trigger widths are53.4375,53.875,51.28125,53.5,54,53.796875,53.875,56.578125,54.40625,58.375,56.09375px. All have8px inline padding. Labels and routes are unchanged. Help fits; no menu-clipping defect is claimed.

Reference, Layers and Libraries actual overflowing owners report shared scrollbar width12px, `scrollbar-color:auto`, thumb background rgb184/184/184 and radius0px. The shared border2px leaves an8px painted thumb; History's fresh same-candidate screenshot confirms this rendered rectangle numerically. Document scrollbar/range controls remain separate. No panel-specific skin is introduced.

This is source-informed DEV delta review. The reviewer had read prior findings, so it is not represented as an independent blind Supervisor visual verdict. Supervisor should independently assess the fresh visible deltas and same-class/state coverage.

## Properties explicit disposition and separate defect

Stable Brush, Properties selected,1280×1024, no selected object: the real scroll owner is `.inspector-section.tab-content.active.stack-visible`, `display:flex`, column, `flex:1 1 auto`, min-height0, overflow:auto, clientHeight251=scrollHeight251. Its panel-stack-body/region/framework ancestors are overflow:hidden. It has no actual overflowing scrollbar in this state.

The child cards retain `flex:0 1 auto` and overflow:hidden. Stable preview client24/scroll68px, color19/54px, slider21/60px. The frame/layout authority shrinks and clips these cards, so their internal overflow does not produce a visible scrollbar. This is a real visible defect, recorded in `1280-properties.jpg` and `state-geometry.json`, not silently fixed or dismissed as PASS. It is not caused by the accepted scrollbar-color removal or switch/menu recovery delta; these Properties layout authorities are unchanged from the recovery base. No artificial content or styles were injected to fabricate a sample. Requirement disposition is satisfied; Properties visual conformance remains open for a separate authorized package.

## Browser delivery identity

Exact candidate tree was already exposed under `qa/previews/ui-recovery-cdb90787` by QA-only commit `e18fdcb9a19b89741c3e12a0258b05d018e2e48d`. Existing dimension harnesses came from `208aa8424c6f8314d2a060dfa2daa72d0f00270c`. This continuation adds only a fresh-state QA harness (`b159a8ea71f266bf9b23da0453860f7147581d97`) and identity-download QA page (`f82f71df3fd94709c012a19db47eef46a4089ddb`); official `product/source` is unchanged and the recovery branch is not merged.

Browser URL: `https://thedoorw.github.io/INK-Browser-QA/qa/previews/ui-recovery-cdb90787/?fresh`. The native download of exact deployed index.html succeeded even though the download-event observer timed out. The actual downloaded bytes were located and hashed; three downloaded copies agree. A downloadMedia call on the HTML root returned a JPEG fallback and is explicitly excluded from HTML identity evidence.

| Browser file | Bytes | SHA-256 / exact candidate match |
|---|---:|---|
| index.html |105355| `97d174def0ef9c7b0323cea69304df7847c22a1162e81fd118c1202a72872a4a` — YES |
| styles.css |232579| `33e3ccaaf333ab7682261fbd58ed0a8cada90dc9cdd232bb5c378dd9272a24e8` — YES |
| web-shell.js |118888| `27ac033ab161220ce38702a72440daca8f200c3f4a4a86046a8a8c07e08e4ff9` — YES |
| ui/branding-settings.js |15980| `3efb404b0f3dd0aa2128e3a17433d2cc1dd90faeb79bda4dde5282a4bd2d8058` — YES |
| src/ink.js |201417| `3ed3f42cd96030d7fe886323ded85fbc0b5492c821b435b115594c633aef9cd7` — YES |

Loaded stylesheet URL carries `v=0.1-ui-20261002-current-main-recovery`. Live DOM proves the single moved node; full loaded CSSOM has1034 selector rules matching candidate source in order. The remaining3 source rules are Firefox-only pseudo-elements rejected by Chrome. The source and downloaded CSS hash identity is stronger than this serialization comparison. Runtime entry query suffixes remain existing SUP08-11 strings; downloaded bytes match the current candidate despite that suffix. Full transitive dependency/cache byte verification is not claimed or required by this UI HTML/CSS gate.

The page-error check covers all logs available from the cloud API and exercised state window. Only `chrome-extension://.../content-script.bundle.js` metadata errors appear. No product-origin errors/warnings were observed. This is not an assurance that every unexercised path is error-free; no separate unsupported pageerror listener is claimed.

## Technical-debt return

| Required field | Result |
|---|---|
| NEW_IMPORTANT_COUNT |0;103→103 |
| NEW_BREAKPOINT_FAMILY |0; media-query sequence unchanged |
| NEW_DUPLICATE_UI_STATE_AUTHORITY |0; Core ink.js bytes unchanged |
| PER_MENU_WIDTH_AUTHORITY_COUNT |0;11 superseded authorities removed |
| GLOBAL_SCROLLBAR_COLOR_COUNT |0; competing global declaration removed |
| WORKSPACE_SWITCH_NODE_COUNT |1 each in template/Web/Portable |
| SUPERSEDED_RULES_REMOVED |YES; global scrollbar-color, menu widths,7px padding, original hidden switch placement |
| CHANGED_PRODUCT_FILES |shell.template.html, index.html, index-standalone.html, styles.css, src/config.js, service-worker.js |
| CANDIDATE_SHA |cdb90787b8a17729a67e6318ded6557fee5b730f |
| EVIDENCE_FILES |manifest + state/identity/error records + screenshots; prior same-candidate History sample explicitly indexed |

Generator `--check` PASS. Exact normalized Web/Portable parity PASS, normalizing only explicit title/badge/manifest/runtime delivery differences. The old parity unit's same3 failures were already reproduced on unchanged base0ad0c663; no test weakened/deleted. Service-worker behavior unchanged, delivery BUILD_ID only. FORMAT_VERSION4 and accepted Core integration bytes retained. No C04/C06/New Document/History semantic change.

## Input-review incident and boundary

One native Add Layer operation on the QA document succeeded. A subsequent batch of11 was auto-review rejected because it interpreted USER's no-History boundary as forbidding History-producing test mutations. No retry or indirect mutation followed. The already recorded fresh same-candidate History overflow sample is sufficient and was inspected/measured rather than regenerated. Therefore no evidence gate is left dependent on that rejected action, and no approval request is needed for its repetition.

No A–D early-stop condition is invoked. C04's previously reproduced state defect remains `PLACEMENT PRESENT / FUNCTIONAL HOLD`; no repair, second state owner, or new C04 execution begins. Properties clipping is returned as a separate finding. No recovery candidate merge to main, no official product deployment and no USER deployed visual acceptance claim.

```text
RECOVERY_IMPLEMENTATION = COMPLETE (unchanged cdb90787)
REQUIRED_BROWSER_EVIDENCE = COMPLETE
REQUIRED_STATE_COVERAGE = COMPLETE (explicit measured iframe + tile method)
BROWSER_IDENTITY = COMPLETE
TECH_DEBT_RETURN = COMPLETE
FINAL_DEV_RETURN = COMPLETE
NEXT = STOP → SUPERVISOR REVIEW
C04_ENTRY = BLOCKED_UNTIL_SUPERVISOR_ACCEPTANCE
```
