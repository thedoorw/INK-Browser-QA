# INK UI PS Visual Detail Conformance — Direct MR result v1.0

Task: INK-UI-PS-VISUAL-DETAIL-CONFORMANCE-001
Product commit: f10acf3384e27becb6a5eb54e009077e0d7da7a0
Date: 2026-09-30
Status: PUBLISHED / USER_INSPECTION_REQUIRED / UI_COMPLETE_NOT_DECLARED

## Visible result
- Preserve the existing double-column Tools, three simultaneous stacked panels and splitter authority.
- Shared narrow collapse strips work on both sides; verified single/double Tools and right collapsed icon Dock/re-expansion.
- Global foreground/background color controls, swap and reset remain in the left Tools footer.
- Drawing tools retain contextual color/size/opacity; selecting Select removes that drawing context. No document title in Options Bar.
- Native automatic hover titles are removed while accessible names remain; final DOM title attribute count was 0.
- Hide the redundant floating zoom readout and desktop fullscreen duplicate (menu capability retained).
- Correct legacy descendant contrast: layer name computed color rgb(34,34,34); Preferences body labels readable; dark Preferences titlebar has white close glyph.
- Localize ordinary creative labels and blend-mode options; preserve internal enum values.
- Keep visible panel state in Window-menu synchronization aware of all three open groups, rather than only the last focused panel.
- Preserve existing categorized Preferences: 一般 / 介面 / 工具 / 畫布與輸入 / 標尺、參考線、吸附 / 效能 / 儲存 / 品牌. Branding retains name, title, logo, favicon, preview, persistence and all three reset/default actions.

## Changed product files
product/source/index.html
product/source/index-standalone.html
product/source/shell.template.html
product/source/styles.css
product/source/web-shell.js
product/source/ui/full-capability-controls.js
product/source/src/editor/creative-workspace.js
product/source/src/ink.js (presentation toast policy only)
product/source/src/config.js (deployment ID only)
product/source/service-worker.js (deployment ID only)

The existing Preferences framework was established by preceding main commit 681c400; this commit corrects its effective CSS contrast rather than creating another settings owner.

## Actual-page evidence
Verified deployed page:
https://thedoorw.github.io/INK-Browser-QA/product/source/index.html

The old service-worker build first remained active. Used Edit > Preferences > Storage > Activate Update and reloaded. Final stylesheet URL ended styles.css?v=0.1-ps-detail2.
Final post-runtime DOM: three panel-stack-region nodes, zero title attributes.
Inspected workstation and Preferences screenshots, effective CSS, Settings/Branding accessibility structure, left layout toggle, right collapse/re-expand and tool-context change.

## Focused checks
PASS: shell generator --check, JavaScript syntax checks, git diff --check.
PASS: spacing tokens, layers selection synchronization, snap readout, control health, Navigator slider.
Existing properties/layers source assertion fails on /data.reparentAction = 'root'/; both pre-change origin/main and final source use button.dataset.reparentAction = 'root'. This is a pre-existing stale source assertion, not evidence of a new product regression. No central Runtime run.

## Remaining visible differences / limits
COLOR_OVERRIDE: INK professional light palette and light canvas background, explicitly required by USER.
CAPABILITY_ABSENT: reference-only Photoshop capabilities outside the current INK baseline are not invented.
FIX_NOW: browser-native reference file picker still exposes browser-language English text. This remains visible and is not accepted as final conformity.
FIX_NOW: full-panel/full-dialog pixel-level sweep and all preserved drag interactions require further direct evidence; this pass does not label untested states PASS.
USER_OVERRIDE: fake document-tab row remains removed as explicitly required.

USER refresh targets: left Tools color footer and collapse strip; right panel collapse strip/stack; layer text; Select vs drawing Options Bar; Edit > Preferences categories and Branding.
If an old worker is active, use Edit > Preferences > Storage > Check Update > Activate Update, then reload.
