# INK UI REBUILD 001 — Technical Debt Health Report v0.1

## Executive result

The cleanup now has a materially healthier UI foundation than the G0 baseline.

The main MR blocker at G5 is closed at source level:

`!important 223 → 19`

All remaining declarations are state-visibility or reduced-motion exceptions. Presentation cascade-war `!important` has been reduced to zero.

G6 is also source-complete on the accepted three-mode responsive taxonomy.

The only unresolved pre-Runtime gate is G7 asset authority: the current visible-logo route is singular, but the exact user-approved final logo asset cannot be proven from repository evidence. The correct result is therefore `HOLD_ASSET`, not a guessed replacement.

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
visible logo route            → 1 / asset approval pending
```

Tracked core selector definitions materially decreased while the accepted desktop authority has exactly one definition for each tracked selector.

## Remaining risk

### G7 — visible brand asset

The repository contains multiple candidate brand assets, but only one current delivered visible-logo route. The current route is not sufficient evidence that the asset is the exact approved final logo.

No asset guess was made.

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
