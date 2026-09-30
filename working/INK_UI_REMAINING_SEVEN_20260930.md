# Remaining seven UI areas — USER direct execution, 2026-09-30

Product basis: current main; PS originals and current live browser at 1363×936, expanded panels/rulers on. Light palette retained. Shared chrome is compared in CSS pixels; different viewport/state is recorded, not treated as pixel equality.

|ID|Area|Concrete changes|Verification|
|---|---|---|---|
|R1|Tools|Move glyph; brush at brush row and pen family at pen row; 16px grip space; 26px row pitch; image placement moved to File; working zoom flyout at zoom row. Native tool/subtool owners preserved.|Rendered 26px pitch; brush/pen activation exclusive; zoom flyout works; File placement opens native file picker.|
|R2|Navigator|Zoom percentage entry; small/large mountain glyphs; house-shaped slider thumb; full-width 26px footer; remove permanent fit overlay (View > Fit remains).|100%→150% entry, mountain zoom→180%, flyout zoom→150%; 26×251px footer.|
|R3|Layers|Remove unusable layer blend control (native layer blend authority absent); full-width lock/opacity rows; layer filters rehomed to footer flyout; native-rendered thumbnails; 35px rows and full-width footer.|35px row; native brush stroke appears in thumbnail; lock/unlock and undo restore blank document; footer filter opens.|
|R4|Colors|25px overlapping swatches; 15px offset; reset lower left and swap upper right; existing native color authority.|Measured foreground (17,383) and background (32,398), each25×25; swap/reset synchronize quick color.|
|R5|Top|Compact current-tool icon, accessible name retained; aligned 25px contextual controls within 61px chrome; keep real supported options per active tool.|Brush context12/88 vs pen2/100; selection context changes; tool icon19px.|
|R6|Status|Zoom first, existing document/space metadata beside it; move rotation/fit/zoom duplicate controls to View. IDs and shortcuts retained.|View zoom100→120%, Navigator restores100%; bottom status17px.|
|R7|Preferences|824×624 maximum dialog; work-area positioning; 144px category column including inset/border; 20px categories; bounded 22px inputs; real tab/tabpanel semantics; category/body spacing; existing settings and Branding persistence preserved.|All8 real categories open; history30→20 survives reload, restored30; final dialog824×624, category20px. Branding controls retained.|

Photoshop-only toolbar slots for crop/frame/history-brush/path-selection are not populated with invented capabilities. INK retains crop as an existing image command in Image; current selection combines selection and movement. Raster layer blend is absent; object blend remains in Properties. Photoshop file-byte status, unavailable preference categories and multi-document home/tab behavior are not fabricated. These are capability/authority limitations, not claims that the entire INK UI is an exact Photoshop clone.

No Core/format/persistence model changes. No custom Actions test dispatch. A single product rollback checkpoint includes final SW build token; browser verification follows deployment.

## Actual browser verification

Source commit: 2795a18be60f9f79f7a3d8d01644d5d696c3019b. Pages deployment completed successfully. Browser entry/assets seven5; actual viewport1363×936. Tool first row y89, brush y193, zoom y349; swatches x17/y383 and x32/y398. Preferences x188.5/y178,824×624. Source JS syntax checks passed; CSS braces balanced. Test stroke/lock actions undone; history preference restored30.

Evidence: `working/evidence/ink-ui-seven-20260930/final-overview.jpg` and `preferences.jpg`. This closes the seven bounded implementation/verification areas; it does not claim pixel equality for every UI or substitute for USER visual acceptance.
