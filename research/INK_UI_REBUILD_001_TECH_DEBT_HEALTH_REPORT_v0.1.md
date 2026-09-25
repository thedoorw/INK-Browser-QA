# INK UI REBUILD 001 — Technical Debt Health Report v0.1

## Executive result

The UI technical-debt cleanup is complete, MR-approved and promoted to main.

```text
UI_TECH_DEBT_CLEANUP = COMPLETE
G0-G8_UI = PASS
PROMOTED_MAIN = 9ebdbe771346e6509c902f71766b117ab674f503
TESTED_SHA = 5bd8754aad3e53886ce6109bd350fa4fc5f68db9
RUNTIME_RUN = 36112690309
UI_SUITE = PASS
PRODUCT_UI_RUNTIME_FAIL = 0
```

The main G5 debt was reduced from `!important 223 → 19`; all remaining declarations are semantic visibility/reduced-motion exceptions and presentation cascade-war `!important` is zero.

Responsive authority is now the accepted three-mode taxonomy, the exact user-approved visible logo is locked by SHA256, first-paint evidence is stable/light, and the required 1280×1024 / 960×800 browser captures passed.

The pre-existing Creative harness 360-second timeout remains a separate baseline/integration HOLD and does not reopen this completed UI cleanup.

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



## Final Runtime closure

```text
TESTED_SHA = 5bd8754aad3e53886ce6109bd350fa4fc5f68db9
RUNTIME_RUN = 36112690309
UI = PASS
ARTIFACT_ID = 10854191875
ARTIFACT_DIGEST = sha256:7f06e3fe7876ad1e9d9d302b2867646928b5630b191069de0a166ae86ec0c3f2
```

Validated browser evidence:

- `ui-first-paint.png` — 1280×1024;
- `ui-1280x1024.png` — 1280×1024;
- `ui-960x800.png` — 960×800.

Final disposition:

```text
UI_FOUNDATION_DEBT = PASS
PHOTOSHOP_WORKSTATION_REBUILD = RELEASED / NEW WORK ORDER
CREATIVE_BASELINE_TIMEOUT = SEPARATE MR_HOLD
```

Canonical completion record:

`working/INK_UI_REBUILD_001_TECH_DEBT_CLEANUP_COMPLETION_RECORD.md`
