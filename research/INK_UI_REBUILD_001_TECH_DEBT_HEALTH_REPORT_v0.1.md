# INK UI REBUILD 001 — Technical Debt Health Report v0.1

## Executive result

The cleanup now has a materially healthier UI foundation than the G0 baseline.

The main MR blocker at G5 is closed at source level:

`!important 223 → 19`

All remaining declarations are state-visibility or reduced-motion exceptions. Presentation cascade-war `!important` has been reduced to zero.

G6 is also source-complete on the accepted three-mode responsive taxonomy.

G7 asset authority is now resolved: the exact user-approved 300×300 JPEG is installed at the existing visible-logo route and locked to SHA256 `08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8`. G8 is the only remaining gate.

## What was cleaned

- obsolete UI regression contracts;
- duplicate panel-opening routes;
- application menu controller ownership;
- first-paint light workstation authority;
- typography family and semantic scale;
- desktop shell selector authority;
- presentation `!important` cascade debt;
- width breakpoint taxonomy;
- responsive QA expectations;
- favicon contract.

## Quantified change

```text
CSS chars                     157379 → 156111
!important                    223 → 19
presentation !important       → 0
hard-coded px font sizes      → 0
width threshold families      9 values → 3 boundary values
panel state owner             → 1
menu controller               → 1
duplicate literal DOM ids     → 0
favicon authority             → 1
visible logo route            → 1 / exact approved SHA locked
```

Tracked core selector definitions materially decreased while the accepted desktop authority has exactly one definition for each tracked selector.

## Remaining risk

### G7 — visible brand asset — RESOLVED

The exact user-approved JPEG was verified before source mutation and installed byte-for-byte at `product/source/assets/INK_MARK_SOURCE_W-300.jpg`.

```text
SHA256 = 08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8
BYTES = 19801
DIMENSIONS = 300x300
VISIBLE_LOGO_AUTHORITY = 1
FAVICON_AUTHORITY = 1
```

### G8 — browser / visual proof

DEV did not execute the exact-SHA Windows Runtime.

MR still must verify:

- fresh reload / first paint;
- same Dock open → close;
- different Dock switch;
- Window-route convergence;
- shared File + non-File menu behavior;
- 1280×1024 containment;
- 960px containment;
- Runtime regressions;
- evidence artifacts with exact SHA / run / artifact digest.

## Product authority preservation

No Core authority was changed by the G5 revision or G6/G7 completion work.

Photoshop workstation alignment remains intentionally blocked until the cleanup gate is accepted.

## DEV disposition

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## G8 isolation revision

Runtime `36109323685` tested `272c656cb98994540d3311f3f38dac1e95dfb519` and reached `105 / 110 PASS`.

The bounded revision addresses only the five accepted G8 blockers:

1. compact New/Open/Save hidden while Export remains the responsive alternative;
2. app/worker BUILD_ID unified;
3. Escape QA moved to the actual DOM keyboard path;
4. typography QA moved from obsolete Inter matching to the current `--ui-font` authority;
5. compact toolbar QA no longer requires the tool rail to be hidden.

The Runtime batch now creates three browser-native visual artifacts:

- `ui-first-paint.png`
- `ui-1280x1024.png`
- `ui-960x800.png`

No product screenshot API or alternate renderer was introduced.

Focused source/static verification and syntax parse checks pass. Final G8 status remains pending the MR-owned exact-SHA Windows Runtime rerun.

