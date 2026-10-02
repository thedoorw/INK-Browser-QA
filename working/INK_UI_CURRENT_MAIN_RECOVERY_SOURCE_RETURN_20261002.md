# Current-main UI recovery — source candidate 2026-10-02

STATUS: SOURCE_IMPLEMENTED / BROWSER_EVIDENCE_BLOCKED / SUPERVISOR_ACCEPTANCE_HOLD

Base: 0ad0c663597f4373b5815364c5a9d7cae40365b4.
Integrated Core: 892c1917280b87c9e44b7a8567517bf24d7e0122; complete product/source tree equals accepted exact browser candidate 66cdb5b4ddc322a2b1027cab2627426f868027d3 (5d234ef03f56dfc6148192a771016b7f90fe8407).

Recovery replays accepted UI-R01/R02/R03 semantic deltas only. Existing workspaceSwitch rehomed under contextualOptions after contextualControlHost. Eleven fixed menu widths and obsolete 7px padding removed. Global scrollbar-color removed; shared WebKit primitive retained. Delivery BUILD_ID synchronized in config.js/service-worker.js; stylesheet identity updated. No service-worker behavior change.

Checks: generator --check PASS; exact normalized Web/Portable shell parity PASS; one workspaceSwitch per template/delivery; shared parent/order verified; important 103 -> 103; CSS chars 233558 -> 232493; media queries unchanged; global scrollbar-color 1 -> 0; per-menu width rules 11 -> 0; Core ink.js unchanged; no new workspace state owner.

Old shared-portable-web-shell-parity-v0.1.test.mjs reports 3 failures: obsolete exact runtime query string, mount ordering matcher dependent on that string, removed contextualAdvancedBtn hook. These are unresolved stale harness assertions, not substituted PASS claims. Explicit current delivery normalization passes separately. No regression coverage deleted.

Environment has no Chrome/Chromium executable. Playwright Chromium download failed repeatedly with invalid/truncated ZIP. No browser run, screenshot, computed geometry, loaded-asset identity, visual PASS or interaction PASS claimed.

Required next: fresh 1280x1024 no-document/document; 960x800 document; Brush/Text/Lasso; all menu trigger geometry; Reference/Layers/History/Libraries/Properties overflow scrollbars; browser-loaded identity and page errors; Supervisor delta-first/same-class/numeric/state review. Reviewer already read previous conclusions: do not claim fully blind independent review.

C04 remains FUNCTIONAL HOLD. Do not start C04 until Supervisor accepts recovery candidate. No merge to main. No USER placement-only deployment checkpoint. C06/New Document/Options parameter redesign excluded.
