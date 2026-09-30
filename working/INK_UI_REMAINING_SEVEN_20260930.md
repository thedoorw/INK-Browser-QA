# Remaining seven UI areas — USER direct execution, 2026-09-30

Product basis: current main; PS originals and current live browser at 1363×936, expanded panels/rulers on. Light palette retained. Shared chrome is compared in CSS pixels; different viewport/state is recorded, not treated as pixel equality.

|ID|Area|Concrete changes|Verification|
|---|---|---|---|
|R1|Tools|Move glyph; brush at brush row and pen family at pen row; 16px grip space; 26px row pitch; image placement moved to File; working zoom flyout at zoom row. Native tool/subtool owners preserved.|Awaiting rendered and click check|
|R2|Navigator|Zoom percentage entry; small/large mountain glyphs; house-shaped slider thumb; full-width 26px footer; remove permanent fit overlay (View > Fit remains).|Awaiting input/button/slider check|
|R3|Layers|Remove unusable layer blend control (native layer blend authority absent); full-width lock/opacity rows; layer filters rehomed to footer flyout; native-rendered thumbnails; 35px rows and full-width footer.|Awaiting selection/visibility/lock/thumbnail check|
|R4|Colors|25px overlapping swatches; 15px offset; reset lower left and swap upper right; existing native color authority.|Awaiting swap/reset check|
|R5|Top|Compact current-tool icon, accessible name retained; aligned 25px contextual controls within 61px chrome; keep real supported options per active tool.|Awaiting draw/select context check|
|R6|Status|Zoom first, existing document/space metadata beside it; move rotation/fit/zoom duplicate controls to View. IDs and shortcuts retained.|Awaiting zoom/menu check|
|R7|Preferences|824×624 maximum dialog; work-area positioning; 144px category column including inset/border; 20px categories; bounded 22px inputs; real tab/tabpanel semantics; category/body spacing; existing settings and Branding persistence preserved.|Awaiting category/reload check|

Photoshop-only toolbar slots for crop/frame/history-brush/path-selection are not populated with invented capabilities. INK retains crop as an existing image command in Image; current selection combines selection and movement. Raster layer blend is absent; object blend remains in Properties. Photoshop file-byte status, unavailable preference categories and multi-document home/tab behavior are not fabricated. These are capability/authority limitations, not claims that the entire INK UI is an exact Photoshop clone.

No Core/format/persistence model changes. No custom Actions test dispatch. A single product rollback checkpoint includes final SW build token; browser verification follows deployment.
