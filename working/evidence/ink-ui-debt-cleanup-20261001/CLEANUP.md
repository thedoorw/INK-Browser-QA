# UI technical debt cleanup — 2026-10-01

Baseline: 52fb379c2e972f6b7a40efcc60bf1b7536598b23
Source cleanup: 418a360d138f0a6bad50ac65dee390e4585a4c53
Browser-loaded build: 20261001-ui-debt1

## Completed bounded cleanup
1. Removed the retired hidden Advanced control from shell.template.html, its dynamic label/state/event handling, and 12 CSS selector occurrences. Regenerated both delivery shells.
2. Consolidated duplicated tool hold timers/cancellation into bindToolGroupHold; preserved click/contextmenu routing and hold duration.
3. Declared Raster switching state explicitly and removed redundant pre-transition capability assignment; retained post-transition assignment and native tool exit guard.
4. Removed overwritten margin/border declarations from existing toolbar header and panel splitter authorities. No late overrides added.

## Validation
- JS syntax: PASS; generated shell check: PASS; Web/Portable duplicate literal IDs: 0.
- CSS characters: 241815 -> 240584 (-1231); !important: 122 -> 122; brace balance: 0.
- Post-load assembled DOM: retired control absent; all main asset URLs contain debt1.
- 29 existing tool/chrome/panel surfaces: pre/post rectangles and sampled effective background/text/border/display/font styles identical.
- Seven Raster groups plus shape/text routes select their tool and return to native select without stale Raster options.
- Shape contextmenu opens correctly; navigator/properties tabs switch correctly; Window panel checks remain synchronized.
- Actual screenshot and pre/post metrics retained beside this record.

## Remaining audit findings
This is a bounded UI cleanup, not a declaration that all INK technical debt is eliminated. Existing 122 !important occurrences and 28 raw px font-size declarations remain; they require semantic/cascade classification rather than blind deletion or token replacement (current semantic font token values differ from some legacy raw sizes). Core, schema, persistence and release certification were outside this cleanup. No evidence/tests were deleted; no custom Actions workflow was started.
