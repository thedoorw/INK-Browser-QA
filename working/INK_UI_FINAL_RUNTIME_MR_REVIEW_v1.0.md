# INK Photoshop-Aligned UI — Final Runtime MR Review v1.0

STATUS: `MR_FINAL_RUNTIME_PASS / UI_COMPLETE`

DATE: 2026-09-28

PROGRAM:
`INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001`

## 1. Final disposition

```text
UI_A = PROMOTED
UI_B = UR_PASS / PROMOTED
UI_C = UR_PASS / PROMOTED

UI_C_PROMOTION_SHA = 77ee44c94a848588aceeb7797fa8aa737c69b248

FINAL_RUNTIME_TESTED_SHA = 24d3b3f607a17b3cb9331ec3635b34d804ee445b
FINAL_RUNTIME_RUN = 36445204976
FINAL_RUNTIME = PASS

UI_BROWSER = 110 / 110 PASS
CLOSURE_BROWSER = PASS
GEOMETRY_BROWSER = PASS
CREATIVE_BROWSER = PASS
P1_EXACT_TARGET = PASS
CLOSURE_FOCUSED = PASS

FORMAT_VERSION = 4 / UNCHANGED
PRODUCT_SOURCE_REGRESSION = 0
OPEN_FINAL_RUNTIME_BLOCKERS = 0
UI_COMPLETE = YES
```

## 2. Exact-SHA / product equivalence

UI-C was promoted at:

`77ee44c94a848588aceeb7797fa8aa737c69b248`

The first final Runtime exposed a stale Runtime UI harness. MR corrected only:

`qa/runtime/ink-web-ui-001-harness.html`

through PR #88.

QA-harness promotion merge:

`24d3b3f607a17b3cb9331ec3635b34d804ee445b`

Comparison from UI-C promotion SHA to the final Runtime tested SHA showed:

```text
product/source/** changes = 0
PRODUCT_SOURCE_EQUIVALENCE = PASS
```

Therefore the second final Runtime tests the same promoted UI-C product bytes with the current promoted UI-A/B/C Runtime contract.

## 3. First final Runtime — diagnostic failure

Run:
`36443008810`

Tested SHA:
`77ee44c94a848588aceeb7797fa8aa737c69b248`

Result:

```text
P1 exact-target = 234 PASS / 0 FAIL
Closure focused = 38 PASS / 0 FAIL
Closure browser = PASS
Geometry browser = PASS
Creative browser = PASS
UI browser = 99 PASS / 11 FAIL
OVERALL = FAIL
```

Artifact:
`10979755694`

Artifact digest:
`sha256:87a98758245a8341ec46072c918870b5f350cac76961bc7f573bfd4f6c950515`

MR diagnosis:

The 11 UI failures were stale pre-UI-A / UI-006 Runtime assertions, including old assumptions for:
- 60 px workstation origin;
- old document-title geometry;
- 68 px dual toolbar;
- expanded panel plus separate collapsed Dock geometry;
- two-entry application-menu registry;
- eight-panel / three-group Window inventory.

These assumptions had already been superseded by the promoted Photoshop-aligned UI authority.

No product/source repair was authorized or performed.

## 4. MR-owned Runtime harness reconciliation

PR:
`#88 — Runtime: reconcile final UI browser harness to promoted Photoshop contract`

Changed file only:

`qa/runtime/ink-web-ui-001-harness.html`

Reconciled Runtime assertions:
- 25 px application/menu outer row = 24 + 1;
- 36 px Options outer row = 35 + 1;
- 61 px base workstation shell;
- 29 px active-document tab band / 28 px active tab;
- active-document workspace y=90 with rulers off;
- 73 px dual Tools outer width;
- expanded panel replaces collapsed Dock width rather than adding to it;
- 11 application menus;
- 14 panel homes;
- 4 panel groups;
- one shared active-panel resizer;
- current fullscreen/narrow panel geometry.

```text
PRODUCT_SOURCE_MUTATION = 0
CORE_MUTATION = 0
FORMAT_VERSION_CHANGE = 0
```

## 5. Authoritative final Runtime

Run:
`36445204976`

Tested SHA:
`24d3b3f607a17b3cb9331ec3635b34d804ee445b`

Workflow trigger SHA:
`e131a30e93cc191b30aecfd1e9d17856d884a044`

Windows runner:
`DESKTOP-NSOQH69`

Result:

```text
MATERIALIZE_EXACT_REVISION = PASS
P1_EXACT_TARGET = PASS
CLOSURE_FOCUSED = PASS
UI_BROWSER = PASS
CLOSURE_BROWSER = PASS
GEOMETRY_BROWSER = PASS
CREATIVE_BROWSER = PASS
EVIDENCE_PRESERVATION = PASS
FINAL_RUNTIME = PASS
```

UI browser evidence:

```text
TOTAL = 110
PASS = 110
FAIL = 0
FORMAT_VERSION = 4
```

Creative browser evidence reached:

```text
HARNESS_FINAL_EVIDENCE_READY
CHECK_COUNT = 154
STATUS = PASS
```

## 6. Final artifact

Artifact ID:
`10979718534`

Artifact name:
`ink-runtime-batch-24d3b3f607a17b3cb9331ec3635b34d804ee445b-36445204976`

Artifact digest:
`sha256:e4d822f19aea910db3a19a583d95843c57b012bb8062a47ba20609dfa4d91aad`

Evidence includes:
- batch report;
- UI / Closure / Geometry / Creative browser evidence;
- P1 Runtime coverage evidence;
- smart-loop before/after evidence;
- Runtime UI screenshots;
- browser logs.

## 7. Runtime visual evidence review

Authoritative Runtime captures:

```text
ui-first-paint.png
1280×1024
sha256 = 3e2c9c1ed58e4139c7f9cfaee30f7fd1dbdc34eb919d19cf94e97b72bcf055a7

ui-1280x1024.png
1280×1024
sha256 = acedcb2b2db74843a1bc832a49df788955d15cd882ea502dbc765004780d6ceb

ui-960x800.png
960×800
sha256 = dccc241ee8543d7c52af0748d863aaafe93711c1d33e0929755e7fd3809b0d92
```

MR inspected the Runtime-enabled desktop captures.

Observed:
- Photoshop-aligned Light workstation shell is present;
- application menu / Options / active-document band are structurally coherent;
- left Tools and right Dock remain edge attached;
- canvas remains the dominant flexible workspace;
- 1280×1024 and 960×800 workstation states remain contained;
- no catastrophic panel/canvas overlap is visible;
- Runtime UI contract independently reports 110/110 PASS.

The delivered first-paint contract also passes the Runtime harness.

## 8. Final program closure

```text
UI_A_B_C_PROMOTED = YES
FINAL_EXACT_SHA_RUNTIME = PASS
FUNCTIONAL_RUNTIME = PASS
PHOTOSHOP_UI_RUNTIME = PASS
UI_RUNTIME_FAILURES = 0
CORE_CROSS_LANE_REGRESSION = 0
FORMAT_VERSION = 4
RUNTIME_ARTIFACT = PRESERVED
UI_COMPLETE = VERIFIED
```

No additional UI mutation or central Runtime is required for this program.

Future UI or technical expansion requires a new bounded Work Order.
