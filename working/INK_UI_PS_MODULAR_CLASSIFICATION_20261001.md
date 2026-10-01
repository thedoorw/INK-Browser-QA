# Photoshop modular UI baseline — 2026-10-01
STATUS: REFERENCE_CLASSIFICATION_AND_CURRENT_INVENTORY / NOT_FULL_FIDELITY_PASS

## Authority and scale
Inspected all six GitHub reference/ui/photoshop images. ps-1, PS-2, PS-3 are1280×1024; native chrome is measured separately from embedded artwork/screenshots. PS-3 visibly selects UI font size Medium and UI scaling Auto. OS scale/DPR/font rasterizer and PS version are not established, so screenshot glyph height cannot be labeled CSS font-size.
INK inspected isolated preview at1363×936, stylesheet repair3, product source08180aa. Informed review, not blind.

## Official findings
Adobe documents Tiny/Small/Medium/Large UI font sizes and Scale UI To Font; OS display settings affect results. Source: https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/change-text-size.html
Adobe recommends Spectrum-based controls for UXP plugins and provides components/semantic behavior. That is plugin guidance, not a published pixel specification for every legacy native Photoshop menu/dialog.
https://developer.adobe.com/photoshop/uxp/design/user-interface/
https://developer.adobe.com/photoshop/uxp/guides/uxp_guide/uxp-misc/spectrum-css/
No comprehensive native Chinese Photoshop pixel-token table found in sources reviewed. Spectrum typography/color/divider direct pages returned404; no unavailable values invented.

## Photoshop text functional classes
Six functional classes observed/provisionally mapped; these are roles, NOT six font sizes:
|Role|Reference instances|Visual rule / INK mapping|
|---|---|---|
|Navigation|application menus, panel tabs, Preferences categories|compact shared body scale; selected state need not increase font size|
|Control label/value/action|Character labels, selects, percentages, Preferences controls/buttons|same compact body scale; numeric alignment separate from font hierarchy|
|Section/dialog title|Preferences title and 外觀/呈現/選項 captions|hierarchy mainly position/group boundary; no oversized dashboard heading|
|Object/document identifier|document title, layer names|body scale; selection background distinguishes active row|
|Supporting text|Preferences restart note/information|body-related compact scale; muted color permitted, avoid bold badges|
|Coordinates/status|rulers, zoom/status|separate compact numeric role; artwork text-size14pt is document content, not UI font size|

Raster shows narrow size range, not escalating typography across every subsection. Exact family/nominal size/weight cannot be recovered uniquely from screenshot. Do not claim these six roles are official Adobe classes. Current INK values below are measured, not PS targets.

## Photoshop measured geometry/grayscale
PS-3 dialog outer x144 y227 width824 height623; titlebar about30; category area x154..279 (125); content begins x288; actioncolumn x866..958. This is one state, not proof of invariant dimensions for all PS categories.
Right panel native x1028..1279. Repeated junction at y342..344 and606..608 has dark/light/dark raster #383838/#474747/#383838. Ordinary Navigator internal divider y317 at x1100 is #3e3e3e. Group junction is structurally distinct, not a randomly darkened internal line.
Large native panel fills sampled #535353 / #4d4d4d; inactive tab/control surfaces #454545 / #424242; text includes #dddddd; selected layer#6b6b6b. Antialiasing pixels are not extra semantic color classes. Preserve USER light theme; transfer roles, not dark-theme RGB literally.

## INK existing semantic grayscale inventory
SOURCE_MEASURED: 15 grayscale role tokens,13 unique grayscale values in initial --ink-ui-* block. This is NOT total rendered colors of entire INK.
|Functional family|Existing tokens and values|
|---|---|
|Surfaces|bg-base#e9e9e9, surface#ffffff, subtle#f4f4f4, tooltip-bg#2b2b2b|
|Text|normal#222222, muted#666666, disabled#919191|
|Borders/separators|border#e5e5e5, soft#e2e2e2, strong#c8c8c8, active-border#d5d5d5, popup-separator#e5e5e5|
|Interaction fill|hover#eeeeee, active#eeeeee|
|Scrollbar|thumb#b8b8b8|

Important defect: soft#e2 is DARKER than normal#e5 despite its name; panel-group splitter uses the same#e5 as ordinary borders. No separate junction semantic role.
Typography aliases xs/sm=11,md/lg=12,xl=13 in later root block, but other literal10px/weights650/800 persist.

## Actual current INK measurements
- Panel tabs13px; selected600 versus inactive400; height28.
- Reference form label/value12px400, field minheight25; range-containing row34.
- File-picker output10px650; status output12px650.
- Details summary12px800 with actualheight39 despite minheight23, from inherited padding.
- Group splitter actual1px background#e5e5e5.
- Preferences inner width525 in Branding versus543 in Interface; height540. Earlier report's525 was one category only, not invariant proof.
These explain USER visible density/weight inconsistency. All values from actual DOM/computed CSS, not source-only assertions.

## Shared rule disposition
Use body, supporting, numeric and title/navigation semantic roles; do not assign a unique style per feature. Role map needs further PS glyph measurement before numeric typography replacement.
Introduce panel-group-junction distinct from internal-separator, keeping1px thickness per current USER request unless later structural decision; junction grayscale must be darker and shared by both junctions. Border-soft ordering must be reconciled.
Ordinary workflow actions use neutral treatment; emphasize only a genuinely primary action. Adobe action-button guidance explicitly favors low visual attention.
Keep real state distinctions (selected/disabled/focus); do not eliminate them in the name of uniformity.
Edit-popup content reference is absent from all six captures; do not manufacture PS command order. Current popup has undo/redo, duplicate/delete, Preferences, adjustment; command semantic/home review remains open.

## Bounded repairs initiated
CSS commit1c0253d29fe7950e1c8853181d7ab3f4e1ae131e makes desktop Preferences width viewport-based instead of an indefinite grid percentage; removes Navigator-specific triangular/square thumb rules so common circular range thumb owns it. Preview deployment/render check pending at report preparation; do not mark closed yet.
Toolbar broken icons UIR-06 remains OPEN; no prior SVG normalization PASS. Full font/grayscale application, menu reference gap, all panel state inventory and final USER review remain open.
