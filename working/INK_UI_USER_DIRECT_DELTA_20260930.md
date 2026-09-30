# INK / PS current visual delta

USER direct comparison, 2026-09-30. References: ps-1 / PS-2 / PS-3 and user INK screenshot. Live cloud browser 1363×936, expanded panels and rulers on; PS reference 1280×994. Browser still showed older cached UI, so no current-main visual PASS claimed.

|Area|Difference / action|
|---|---|
|Tools|Order, grouping, icon silhouettes and occupancy differ; reconcile supported families, preserve subtools. Open.|
|Advanced|Remove permanent options-bar shortcut; Properties remains reachable.|
|Mode|Move creation/layout into Image menu; hide top-right duplicate.|
|Adjustments|USER directs Edit menu primary entry; remove default overview tab, preserve Window access.|
|Collapse arrows|Move left control to left edge and right control to right edge.|
|Panel junctions|One visible line; retain larger invisible drag target.|
|Navigator|Old browser has fit-first zoom row and round blue slider; current source correction needs rendered verification.|
|Layers|Old browser opacity at bottom, mask/fx above list, weak eye/thumb grammar; source correction needs rendered verification.|
|Colors|Swatch overlap/reset/swap geometry needs current-version inspection.|
|Top shell|Options/menu alignment and total height need matched-viewport measurement.|
|Status|Zoom/info order differs; source correction needs rendered verification.|
|Preferences|Category/dialog structure requires follow-up state inspection.|
|Theme|Preserve USER Light palette override.|

Bounded UI changes; Core and format unchanged. Update SW build and entry query tokens to expose current version. No Actions test dispatch. Remaining visual items stay open; this checkpoint is not final UI completion.

## Actual browser follow-up

Deployment of product commit 617faf3c694989e9e2e1181eb375b3a32530b411 succeeded. Browser stylesheet URL now uses v=0.1-ui-20260930-2225; supported-tools grid reports eleven rows of 26 CSS px. Two panel separators measured 1 CSS px. Edit > Adjustments click displayed sixteen adjustment controls. Image > Layout switched app data-space to layout and status to 版面空間; Creation restored creation. Right collapse/expand and left single/dual operations were observed. Separator drag moved first boundary from y326.109 to y344.25 and changed adjacent group heights; drag restored the layout. This verifies operability, not full PS visual equivalence.

Additional observed cause: collapse buttons expanded to the entire strip (left button width65px); edge alignment alone therefore did not move the glyph. Commit 1c63dc2dc49e53adaadc9d8197c003e218d9556a bounds each button to16px and updates SW build token. Deployment succeeded; final browser activation is being verified. No custom Actions tests were dispatched.
