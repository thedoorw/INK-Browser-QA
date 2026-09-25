# INK UI REBUILD 001 — Technical Debt Cleanup Evidence

STATUS: `DEV_SOURCE_COMPLETE / G7_SOURCE_PASS / G8_ISOLATION_SOURCE_READY`

BRANCH: `work/ink-ui-rebuild-001-tech-debt-cleanup`

KNOWN-GOOD PRODUCT BASE: `d6c28be13cddee0d83b9e7613b5498b06d1f7b0e`

MR revision baseline: `f574731b0e920950211f04177826b3ad2ce0157b`

## Gate register

| Gate | Result | Checkpoint / evidence |
|---|---|---|
| G0 Baseline evidence | PASS | `working/INK_UI_REBUILD_001_TECH_DEBT_BASELINE_EVIDENCE.md` |
| G1 Obsolete UI QA contracts | PASS | `a358a2f9e0071b4633031640c517f024aca0ed80` |
| G2 Menu / panel authority | SOURCE_PASS | `c229e6ec15355aa6ca99a987105f5a90bce5d7c4` |
| G3 First paint authority | SOURCE_PASS | `63a660c856a1d0019beafb184899671f704752cd` |
| G4 Typography authority | SOURCE_PASS | `dcbc8c086a7da4ae202cc2c78eca424befba347f` |
| G5 CSS shell authority | REVISED_SOURCE_PASS | `f9bf8481f7f0050db47c0c4bc551f154056c2eed` + G5 evidence |
| G6 Responsive authority | SOURCE_PASS | `6731d07d01cc059054212592e6e34716e55d2ff5` + G6 evidence |
| G7 Brand contract | SOURCE_PASS | approved exact JPEG SHA locked; G7 evidence |
| G8 Full Runtime / visual evidence | ISOLATION_SOURCE_READY / MR_RERUN_REQUIRED | Runtime runner emits required PNG evidence |

## Health metrics — G0 → current source

```text
styles.css characters
157379 → 156111

!important
223 → 19

presentation !important
historical cascade-war population → 0

exact selector definitions
.topbar                   14 → 11
.tool-rail                 9 → 6
.inspector                14 → 8
.stage-wrap               18 → 4
.statusbar                 6 → 3
.control-row              12 → 6
.inspector-tab             8 → 4
.creative-workspace-panel 12 → 3

accepted desktop authority region
each of the eight selectors above = exactly 1
```

Remaining 19 `!important` declarations are semantic-only:

```text
display:none = 14
display:flex = 2
display:grid = 1
reduced-motion animation:none = 1
reduced-motion transition:none = 1
```

No presentation property retains `!important`.

## Responsive health

Baseline width families included:

`410 / 440 / 560 / 760 / 761 / 860 / 900 / 980 / 1120`

Current width authority:

```text
DESKTOP_WIDE   > 1120
DESKTOP_NARROW 761–1120
COMPACT        <= 760
```

Current width media query values are limited to:

`max-width:1120px / max-width:760px / min-width:761px`

Pointer/height/reduced-motion queries are modifiers, not width modes.

The formerly accepted `final-ui-responsive-regression-v0.1.test.mjs` was updated so it no longer requires retired `980 / 560 / 440` breakpoints.

## Typography health

```text
normal UI font-family authority = var(--ui-font)
other observed font-family = inherit
hard-coded px font-size declarations = 0
Georgia = 0
normal workstation direct font stack = 0
```

## Panel / menu health

```text
primary panel state owner = 1
selectPanel() authority = 1
togglePanel() authority = 1
application menu controller = 1
Dock same item = toggle/close
Dock different item = switch
Window route = same panel state authority
contextual Advanced = Properties navigation only
edge-panel competing presenter = retired
```

## First-paint / delivery health

```text
first paint theme = light / #e7e7e7
body first-paint state = workstation
service-worker BUILD_ID = 20260925-ui-rebuild-001-g3-first-paint-r1
generator template/output equality = PASS
Web / Portable normalized parity = PASS
duplicate literal DOM ids = 0
FORMAT_VERSION = 4
```

## Brand health

```text
favicon authority = assets/favicon.svg?v=0.1
favicon route count = 1 per delivery
visible logo unique route count = 1
visible logo exact approved asset = PASS
visible logo SHA256 = 08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8
visible logo bytes = 19801
G7 = SOURCE_PASS
```

The visible JPG now contains the exact user-approved bytes and is locked by SHA256 QA.

## Focused source verification

Connector-side deterministic source verification: **PASS**.

Verified:

- template regeneration equality for Web and Portable outputs;
- normalized Web / Portable parity;
- duplicate literal DOM IDs = 0;
- CSS brace balance;
- `!important = 19` and semantic-only;
- presentation `!important = 0`;
- single desktop selector authority for the tracked shell selectors;
- three-mode responsive taxonomy;
- retired width thresholds absent;
- responsive regression test updated to the accepted taxonomy;
- favicon singularity;
- visible-logo route singularity and exact approved SHA256 contract;
- FORMAT_VERSION remains 4;
- service-worker build identity matches G3.

Container network access could not clone GitHub, so no local Node checkout run is claimed here. No Windows Runtime was started by DEV.

## Frozen authority check

From MR reviewed HEAD `f574731b0e920950211f04177826b3ad2ce0157b`, the bounded revision touches UI CSS, focused UI QA and evidence/docs only.

No Renderer, Canvas/WebGL, Document, History, Revision, Geometry, CHAT, persistence, FORMAT_VERSION or product-version authority was modified.

## Exit disposition

```text
G0-G7 = SOURCE PASS
G8 = MR_OWNED / NOT RUN
UI_FOUNDATION_DEBT = PENDING G8
PHOTOSHOP_WORKSTATION_REBUILD = HOLD
```

DEV source work for the authorized cleanup is complete.

`DEV_HANDOFF → STOP`

## G8 UI Runtime isolation revision — source ready

MR Runtime diagnostic:

```text
TESTED_HEAD = 272c656cb98994540d3311f3f38dac1e95dfb519
RUNTIME_RUN = 36109323685
UI = 105 / 110 PASS
G0-G7 = ACCEPTED
G8 = REVISE
```

Bounded product delta:

```text
COMPACT:
  newBtn  = hidden
  openBtn = hidden
  saveBtn = hidden
  exportBtn = visible / RESPONSIVE_ALTERNATIVE

BUILD_ID:
  config.js         = 20260925-ui-rebuild-001-g8-runtime-r1
  service-worker.js = 20260925-ui-rebuild-001-g8-runtime-r1

FORMAT_VERSION = 4 / preserved
PRODUCT_VERSION = 0.1 / preserved
```

Runtime QA isolation:

- Escape now exercises a real DOM `KeyboardEvent('keydown')` path from an actual File-menu item and verifies focus return to the trigger.
- typography validates the current `--ui-font` token and computed authority; no obsolete Inter requirement remains.
- compact toolbar validates effective single mode, no dual class, and viewport containment without requiring `.tool-rail` to be hidden.

Browser-native Runtime evidence contract:

```text
ui-first-paint.png  = 1280x1024 / delivered shell / JavaScript disabled
ui-1280x1024.png    = 1280x1024 / Runtime enabled
ui-960x800.png      = 960x800 / Runtime enabled
```

Each capture is validated as PNG with exact requested dimensions and recorded in `batch.json` with capture kind, transport, script mode, pixel size, byte length and SHA256.

The existing central Windows Runtime workflow uploads the entire `evidence/` directory, so these files require no workflow mutation.

Focused connector-side source QA: **PASS**.

Syntax parse smoke checks:

```text
qa/runtime/run-ink-runtime-batch.mjs = PASS
qa/runtime/ink-web-ui-001-harness.html script = PASS
qa/core/tests/unit/ui-debt-001-shell-panel-authority-v0.1.test.mjs = PASS
```

DEV did not start the MR-owned exact-SHA Windows Runtime rerun.

`G8_RUNTIME_RESULT = PENDING_MR_EXACT_SHA_RERUN`



## G8 final Windows Runtime closure — 2026-09-25

```text
PROMOTED_MAIN_BASE = 9ebdbe771346e6509c902f71766b117ab674f503
TESTED_EXACT_SHA = 5bd8754aad3e53886ce6109bd350fa4fc5f68db9
RUNTIME_RUN = 36112690309
RUNNER = DESKTOP-NSOQH69
UI_SUITE = PASS
G8_UI_GATE = PASS
CENTRAL_BATCH = FAIL_AFTER_UI / PRE-EXISTING_CREATIVE_TIMEOUT_360S
PRODUCT_UI_RUNTIME_FAIL = 0
ARTIFACT_ID = 10854191875
ARTIFACT_DIGEST = sha256:7f06e3fe7876ad1e9d9d302b2867646928b5630b191069de0a166ae86ec0c3f2
```

Required visual evidence was produced through browser-native CDP capture and validated for PNG signature, exact dimensions, byte length and SHA-256:

```text
ui-first-paint.png
  1280x1024
  DELIVERED_FIRST_PAINT / SCRIPT_DISABLED
  sha256=b0cbbd73fc5b807ec7d3e2bc920b60494604af4009592c37ef9784991fa059a6

ui-1280x1024.png
  1280x1024
  RUNTIME_ENABLED
  sha256=e3ca10151dd2f939183e9018f0d2e2e37904b4e9a4b5f765499eb577c9ea7986

ui-960x800.png
  960x800
  RUNTIME_ENABLED
  sha256=095d785c2367d303f47ca0eedc4eef35b46498c2201ac4c409a2bf6f37813148
```

MR visually inspected all three captures: delivered first paint is light/stable with no black-screen transition; both Runtime viewport captures are contained without horizontal overflow.

The same central Creative-harness timeout pattern existed before this UI cleanup in run `36088550693`: UI PASS → Creative 360s timeout → Geometry not reached. Both runs progressed far enough to emit smart-loop before/after evidence. Therefore that shared Creative baseline issue is retained separately and is not attributed to this UI cleanup payload.

Clean promotion copied only the reviewed product/QA/evidence payload onto then-current main; branch-local `ACTIVE/INK_DEV_PROGRESS.md` was excluded.

```text
G0-G8_UI = PASS
UI_TECH_DEBT_CLEANUP = COMPLETE
CREATIVE_BASELINE_TIMEOUT = SEPARATE_MR_HOLD
PHOTOSHOP_WORKSTATION_REBUILD = RELEASED_FOR_NEXT_WORK_ORDER
```
