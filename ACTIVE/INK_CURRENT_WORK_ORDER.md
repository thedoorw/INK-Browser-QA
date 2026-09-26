## Scope boundary — Photoshop-aligned final UI rebuild excluded from current Closure — 2026-09-26

```text
INK-TECH-CLOSURE-001 =
  technical capability closure only

IN_SCOPE =
  residual defect fixes
  source/focused QA
  exact-SHA Runtime
  clean promotion to current main
  CURRENT_CAPABILITY_BASELINE freeze

OUT_OF_SCOPE =
  Photoshop-aligned final UI rebuild
  final command/menu/tool/panel placement
  Navigator / History panel UI alignment
  final UI visual/interaction closure

NEXT_AFTER_CLOSURE =
  hand frozen capability baseline to UR
  → separate UI Work Order
```

The Photoshop-aligned final UI rebuild is NOT part of the completion percentage or completion criteria for `INK-TECH-CLOSURE-001`.

---

## Runtime Fix 2 DEV package issued — 2026-09-26

```text
TASK = INK-TECH-CLOSURE-001
PHASE = FINAL_RUNTIME_FIX_2
BRANCH = work/ink-tech-closure-001
DISPATCH_HEAD = 399b039ffcd4677e073391418f50e77f8b0a0a63
WORKPACK = working/INK_TECH_CLOSURE_001_RUNTIME_FIX_2_DEV_WORKPACK.md

AUTHORITATIVE_RUNTIME = 36220214402
FOCUSED_NODE = 25 / 25 PASS
UI = PASS
GEOMETRY = PASS
CLOSURE = FAIL / HISTORY_SATURATION_ASSERTION
CREATIVE = FAIL / $.modifiedAt ONLY

DEV = AUTHORIZED
WINDOWS_RUNTIME_BY_DEV = PROHIBITED
PROMOTION = HOLD
```

Required DEV result:

```text
DEV_FIX_2_READY_FOR_MR_REVIEW
→ DEV_HANDOFF
→ STOP
```

---

## MR source PASS — Final Runtime defect fix — 2026-09-26

```text
TASK = INK-TECH-CLOSURE-001
PHASE = FINAL_RUNTIME_DEFECT_FIX
REVIEWED_EXACT_HEAD = 399b039ffcd4677e073391418f50e77f8b0a0a63
RESULT = MR_SOURCE_PASS
MR_REVIEW = working/INK_TECH_CLOSURE_001_RUNTIME_FIX_MR_REVIEW.md

DEFECT_A = ACCEPTED / C2-C browser single-edit routing corrected
DEFECT_B = ACCEPTED / grounded Document snapshot isolation

WINDOWS_WORKFLOW_QA_ONLY_UPDATE = 09c694bc60d09378c0b995593282039fbc4b3c66
NEW_FOCUSED_REGRESSION = qa/ink-tech-closure-001-runtime-fix.test.mjs
EXACT_SHA_RUNTIME = AUTHORIZED
PROMOTION = HOLD
```

Required next gate:

```text
focused Node contracts including runtime-fix regression
→ UI
→ Closure
→ Geometry
→ Creative
```

---

## Final Runtime defect fix DEV package issued — 2026-09-26

```text
TASK = INK-TECH-CLOSURE-001
PHASE = FINAL_RUNTIME_DEFECT_FIX
BRANCH = work/ink-tech-closure-001
DISPATCH_HEAD = f5eaf45715859004436d15d4645209b7be29a120
WORKPACK = working/INK_TECH_CLOSURE_001_RUNTIME_FIX_DEV_WORKPACK.md

DEFECT_A =
  component.register.v1 proposal FAIL in browser Runtime

DEFECT_B =
  get_grounded_creative_context OBSERVE mutates Document JSON
  History unchanged
  Revision unchanged

UI_RUNTIME = PASS
GEOMETRY_RUNTIME = PASS
FOCUSED_NODE_CONTRACTS = PASS

MR_DIRECT_DEBUG = STOP
DEV = AUTHORIZED
WINDOWS_RUNTIME_BY_DEV = PROHIBITED
PROMOTION = HOLD
```

Required DEV result:

```text
DEV_FIX_READY_FOR_MR_REVIEW
→ DEV_HANDOFF
→ STOP
```

---

## FINAL RUNTIME authorized — Closure 001 — 2026-09-26

```text
TASK = INK-TECH-CLOSURE-001
TARGET_EXACT_SHA = 98529265aacf548389934d47641a22d55dad6666
PRODUCT_SOURCE = FROZEN
C1 = MR_SOURCE_PASS
C2-A = MR_SOURCE_PASS
C2-B = MR_SOURCE_PASS
C2-C = MR_SOURCE_PASS

FINAL_RUNTIME_PREP = PASS
STATIC_ORCHESTRATION_GATE = 21 / 21 PASS

WINDOWS_BATCH =
  focused Node contracts
  → UI
  → Closure
  → Geometry
  → Creative

SUITE_FAILURE_STARVATION = DISABLED
PARTIAL_PROMOTION = 0
PROMOTION = HOLD UNTIL FINAL RUNTIME CLASSIFICATION
```

Runtime workflow materialization now includes the isolated Closure harness and all five Closure focused Node tests.

---

## MR source PASS — C2-B / C2-C released — 2026-09-25

```text
TASK = INK-TECH-CLOSURE-001
C2B_REVIEWED_EXACT_HEAD = f44416b6a41af0235adeb01ed402408c005b4255
C2B = MR_SOURCE_PASS
REPEAT_EXPAND = CORE_ONLY_ACCEPTED / NOT_EXPOSED
HIGH_RISK_RUNTIME_EXCEPTION = NOT_TRIGGERED
FULL_WINDOWS_RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH

C2C = RELEASED
WORKPACK = working/INK_TECH_CLOSURE_001_C2C_DEV_WORKPACK.md

PARTIAL_PROMOTION = 0
FINAL_RUNTIME = HOLD UNTIL C2C SOURCE CHECKPOINT PASS
```

C2-B review authority:
`working/INK_TECH_CLOSURE_001_C2B_MR_REVIEW.md`

---

## MR source PASS — C2-A / C2-B released — 2026-09-25

```text
TASK = INK-TECH-CLOSURE-001
C2A_REVIEWED_EXACT_HEAD = f3e75f7574d8705d58e654977e8af0e07b74e8d4
C2A_PRODUCT_CHECKPOINT = 6d19efac3e0e87bcc97044121eb41d2c7cef6184
C2A = MR_SOURCE_PASS
HIGH_RISK_RUNTIME_EXCEPTION = NOT_TRIGGERED
FULL_WINDOWS_RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH

C2B = RELEASED
WORKPACK = working/INK_TECH_CLOSURE_001_C2B_DEV_WORKPACK.md

PARTIAL_PROMOTION = 0
C2C = HOLD
FINAL_RUNTIME = HOLD UNTIL C2B + C2C SOURCE CHECKPOINTS PASS
```

C2-A review authority:
`working/INK_TECH_CLOSURE_001_C2A_MR_REVIEW.md`

---

## MR checkpoint — Closure 001 C1 source PASS / C2-A authorized — 2026-09-25

```text
TASK = INK-TECH-CLOSURE-001
C1_REVIEWED_HEAD = 6a9fb25558cda958b90140867ac054f3662dfa01
C1 = MR_SOURCE_PASS
C1_RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH

C2_A = AUTHORIZED
BRANCH = work/ink-tech-closure-001
DISPATCH_HEAD = aa21b4f185344697c6d4a4d434ee064b90ac0b51
WORKPACK = working/INK_TECH_CLOSURE_001_C2A_DEV_WORKPACK.md

C2_B = HOLD UNTIL C2-A DEV_HANDOFF + MR_SOURCE_REVIEW
```

C2-A authorized target:

```text
use_ink:
  frame.create.v1
  text.create.v1
  text.edit.v1
  svg.import.v1
  object.resize.v1
  object.scale.v1
  object.order.v1

named tool:
  export_ink_asset
```

No full Windows Runtime between C1 and C2-A unless the approved high-risk exception is triggered.

---

## INK-TECH-CLOSURE-001 — Capability closure before final UI rebuild — 2026-09-25

STATUS: `MR_AUTHORIZED / CLOSURE_IN_PROGRESS`

User decision:

```text
TECHNICAL_CLOSURE_FIRST
→ freeze truthful current capability baseline
→ then final Photoshop-aligned UI function placement/rebuild
```

Authoritative ledger:

`working/INK_TECH_CLOSURE_001_CAPABILITY_LEDGER.md`

Execution plan authority:

`working/INK_TECH_CLOSURE_001_EXECUTION_PLAN.md`

User-approved Runtime policy:

```text
INSTALL_FIRST_ON_ONE_CLOSURE_BRANCH
→ focused QA at C1 / C2-A / C2-B / C2-C
→ ONE concentrated exact-SHA Runtime after all focused checkpoints PASS
→ ONE clean promotion after Runtime PASS
```

The earlier C1 wording that implied an immediate standalone Runtime is superseded by this batching policy. Immediate Runtime is required only when the execution plan's high-risk exception rule is triggered.

Primary rule:

```text
planned != implemented != installed != Runtime verified != promoted
CLOSED requires an explicit final disposition.
```

### Closure Phase C1 — Geometry Ops integration debt

Old source branch:

`work/ink-chat-geometry-ops-001`
tested/head evidence: `51dcc27570440e5a4a779e7ffed64dd634995489`

The two product authorities and related Geometry Ops QA were verified unchanged on current main relative to the old accepted base `d6c28be13cddee0d83b9e7613b5498b06d1f7b0e`. Therefore the implementation may be replayed exactly onto a fresh current-main branch without importing old governance/runtime-queue state.

Fresh closure branch:

`work/ink-tech-closure-001`

Authorized replay files:

```text
product/source/src/editor/chat-bounded-edit.js
product/source/src/agent/capability-registry.js
qa/ink-chat-connector-004-use-ink-programmable-bridge.test.mjs
qa/ink-chat-geometry-ops-001.test.mjs
qa/runtime/ink-cloud-018-browser-harness.html
research/INK_CHAT_GEOMETRY_OPS_001_REPORT_v0.1.md
working/INK_CHAT_GEOMETRY_OPS_001_DEV_HANDOFF.md
```

Do NOT replay stale:

```text
ACTIVE/INK_CURRENT_WORK_ORDER.md
ACTIVE/INK_DEV_PROGRESS.md
ACTIVE/INK_RUNTIME_QUEUE.json
working/WORKING_STATUS.md
```

Required:
- preserve post-cleanup UI/current-main product state;
- no new geometry operation beyond the already authorized eight;
- no UI change;
- no Renderer/Document/History/Revision semantics change;
- no FORMAT_VERSION change;
- focused QA;
- record C1 checkpoint commit and causal evidence;
- continue to C2-A after MR source/focused review;
- full Runtime = DEFERRED_TO_FINAL_CLOSURE_BATCH unless the high-risk exception is triggered;
- no promotion until the final concentrated Runtime passes all required gates.

### Closure Phase C2 — exposure-debt disposition

After C1 source closure, MR audits the remaining CORE_ONLY/PARTIAL families in the ledger against current native authorities and the original connector target.

No implementation is automatically authorized by C2.

Each family must end as one of:

```text
CLOSED_INSTALLED
CORE_ONLY_ACCEPTED
ACTIVE_EXPOSURE_WORK
DEFERRED
RETIRED
```

### Closure Phase C3 — freeze current capability baseline

Only after C1 and C2:

```text
CURRENT_CAPABILITY_BASELINE = FROZEN
→ hand to UR
→ final Photoshop-aligned command/menu/tool/panel mapping may be locked
```

Connector-005 Creative Library Search remains separately tracked planned work and may not disappear from the ledger.

---

## MR_PASS — INK-UI-REBUILD-001 technical-debt cleanup COMPLETE — 2026-09-25

```text
TASK = INK-UI-REBUILD-001-TECH-DEBT-CLEANUP
RESULT = MR_PASS / COMPLETE
PROMOTED_MAIN = 9ebdbe771346e6509c902f71766b117ab674f503
FINAL_EVIDENCE_COMMIT = 15ef1b4ec62312f7a843e18fbf787957b08da4f2

TESTED_EXACT_SHA = 5bd8754aad3e53886ce6109bd350fa4fc5f68db9
RUNTIME_RUN = 36112690309
RUNNER = DESKTOP-NSOQH69
UI_SUITE = PASS
G0-G8_UI = PASS

ARTIFACT_ID = 10854191875
ARTIFACT_DIGEST = sha256:7f06e3fe7876ad1e9d9d302b2867646928b5630b191069de0a166ae86ec0c3f2

PRODUCT_UI_RUNTIME_FAIL = 0
FROZEN_CORE_MUTATION = 0
PHOTOSHOP_WORKSTATION_REBUILD = RELEASED / NEXT_WORK_ORDER
```

Final G8 captures:

- `ui-first-paint.png` — 1280×1024 — SHA256 `b0cbbd73fc5b807ec7d3e2bc920b60494604af4009592c37ef9784991fa059a6`
- `ui-1280x1024.png` — 1280×1024 — SHA256 `e3ca10151dd2f939183e9018f0d2e2e37904b4e9a4b5f765499eb577c9ea7986`
- `ui-960x800.png` — 960×800 — SHA256 `095d785c2367d303f47ca0eedc4eef35b46498c2201ac4c409a2bf6f37813148`

The central batch continued after UI PASS and hit the already-known Creative harness 360s timeout. The same UI-PASS → Creative-timeout pattern existed before this cleanup in run `36088550693`; it is therefore retained as a separate baseline/integration HOLD and does not reopen this completed UI work order.

Clean promotion rule was followed: reviewed product/QA/evidence blobs were promoted onto current main; branch-local DEV progress was not promoted.

Next UI direction remains the previously approved Photoshop workstation alignment/rebuild, but it starts under a new bounded Work Order rather than extending this cleanup task.

---

## MR source PASS — G8_QA_CAPTURE_ONLY rerun — 2026-09-25

```text
TASK = INK-UI-REBUILD-001-TECH-DEBT-CLEANUP
REVIEWED_EXACT_HEAD = 5bd8754aad3e53886ce6109bd350fa4fc5f68db9
REVISION = G8_QA_CAPTURE_ONLY
SOURCE_REVIEW = PASS
PRODUCT_SOURCE_DELTA = 0
AUTHORIZED_QA_DELTA = PASS
G0-G7 = PASS
G8 = WINDOWS EXACT-SHA RERUN AUTHORIZED
PHOTOSHOP_WORKSTATION_REBUILD = HOLD
```

MR verified delta from prior tested SHA `5c37db9c9e64333ece3b492f7cc2eabbd7aae1e8`:

- product/source changes = 0;
- only `ACTIVE/INK_DEV_PROGRESS.md` and `qa/runtime/run-ink-runtime-batch.mjs` changed;
- visual capture transport now uses Chrome CDP `Page.captureScreenshot`;
- exact viewport is enforced through `Emulation.setDeviceMetricsOverride`;
- PNG signature/dimensions are validated;
- captured bytes are explicitly persisted and re-read;
- persisted byte length and SHA256 are cross-checked;
- missing capture bytes/files are explicit failures;
- UI / Creative / Geometry Runtime suites remain intact;
- no workflow change;
- no product capture hook / alternate renderer.

Required Runtime artifacts remain:

```text
ui-first-paint.png = 1280x1024 / delivered shell / script disabled
ui-1280x1024.png   = 1280x1024 / runtime enabled
ui-960x800.png     = 960x800 / runtime enabled
```

Exact G8 rerun target:
`5bd8754aad3e53886ce6109bd350fa4fc5f68db9`

---

## MR_REVISE — G8_QA_CAPTURE_ONLY — 2026-09-25

```text
TASK = INK-UI-REBUILD-001-TECH-DEBT-CLEANUP
TESTED_SHA = 5c37db9c9e64333ece3b492f7cc2eabbd7aae1e8
RUNTIME_RUN = 36111515142
RUNNER = DESKTOP-NSOQH69
MATERIALIZATION = PASS
BROWSER_BATCH = FAIL_BEFORE_UI_ASSERTIONS
PRODUCT_RUNTIME_FAIL = NOT_ESTABLISHED
G0-G7 = PASS
G8_SOURCE_PRODUCT_DELTA = ACCEPTED
G8 = REVISE / QA_CAPTURE_ONLY
ARTIFACT_ID = 10853825533
ARTIFACT_DIGEST = sha256:4dd9bc4b1d1841acf342c3720d9f9ab0eea83df34b0d3dd533c64f025d8a9658
```

Failure:

```text
Error: ENOENT
missing:
  evidence/ui-first-paint.png
Chrome screenshot process exit code = 0
visualCaptures = []
```

Classification:

- product CSS / BUILD_ID corrections from the previous G8 revision remain accepted;
- this run failed in the newly added QA screenshot transport before the normal UI Runtime suite could be evaluated;
- no product defect is established by this run.

Authorized revision only:

`qa/runtime/run-ink-runtime-batch.mjs`

Required:

1. Make browser-native visual capture deterministic on the Windows self-hosted runner.
2. Do not assume that Chrome exit code 0 implies the screenshot file exists.
3. Prefer a bounded browser-native method that returns/captures pixels explicitly (for example CDP `Page.captureScreenshot` with an exact viewport) over relying on Chrome CLI screenshot side effects.
4. Required exact artifacts remain:
   - `ui-first-paint.png` 1280×1024;
   - `ui-1280x1024.png`;
   - `ui-960x800.png`.
5. Each capture must:
   - be real Chrome/browser pixels;
   - validate PNG signature and dimensions;
   - record byte length and SHA256;
   - use a fresh bounded browser context/profile;
   - fail explicitly if capture bytes are absent.
6. First-paint evidence must remain delivered-shell / pre-runtime evidence and be labeled as such.
7. Preserve the existing UI / Creative / Geometry Runtime suites and their assertions.
8. No product/source mutation.
9. No workflow mutation unless the runner cannot implement capture within its existing Node/browser process model; if that becomes necessary, STOP for MR authorization instead.
10. No Photoshop rebuild.

After focused syntax/source QA:

`DEV_HANDOFF → STOP`

MR will rerun the exact new HEAD.

---

## MR source PASS — G8 Runtime isolation rerun — 2026-09-25

```text
TASK = INK-UI-REBUILD-001-TECH-DEBT-CLEANUP
REVIEWED_EXACT_HEAD = 5c37db9c9e64333ece3b492f7cc2eabbd7aae1e8
G0-G7 = PASS
G8_REVISION_SOURCE = PASS
G8_WINDOWS_RUNTIME = AUTHORIZED
PHOTOSHOP_WORKSTATION_REBUILD = HOLD
```

MR verified the bounded G8 revision:

- COMPACT hides New / Open / Save and keeps Export as the responsive alternative.
- `config.js` and `service-worker.js` share BUILD_ID `20260925-ui-rebuild-001-g8-runtime-r1`.
- Escape QA uses the real DOM keyboard path.
- Typography QA validates the current `--ui-font` authority without the obsolete Inter requirement.
- COMPACT toolbar QA verifies effective single mode and containment without the retired hidden-rail assumption.
- Runtime runner emits browser-native:
  - `ui-first-paint.png` 1280×1024;
  - `ui-1280x1024.png`;
  - `ui-960x800.png`;
  with per-capture metadata and SHA256.
- Frozen Core authorities unchanged.

A stale earlier G3 BUILD_ID line remains in the cumulative evidence narrative; the later G8 section supersedes it and source files are authoritative. Do not alter the exact tested head for that documentation-only residue.

Exact G8 target:
`5c37db9c9e64333ece3b492f7cc2eabbd7aae1e8`

MR owns Runtime result classification and any subsequent revision.

---

## MR_REVISE — G8 Runtime UI isolation — 2026-09-25

```text
TASK = INK-UI-REBUILD-001-TECH-DEBT-CLEANUP
TESTED_SHA = 272c656cb98994540d3311f3f38dac1e95dfb519
RUNTIME_RUN = 36109323685
RUN_ATTEMPT_1 = MATERIALIZATION_FAIL / transient GitHub blob fetch HTTP 500
RUN_ATTEMPT_2 = MATERIALIZATION_PASS / UI_BROWSER_EXECUTED
RUNNER = DESKTOP-NSOQH69
UI = FAIL / 105 of 110 PASS
CREATIVE = NOT_REACHED
GEOMETRY = NOT_REACHED
ARTIFACT_ID = 10852681462
ARTIFACT_DIGEST = sha256:3cb2e0682b39ef9ea6cbecdd76073f7242556ded6342e32d86ee189e0f286a31

G0-G7 = REMAIN PASS
G8 = MR_REVISE
PRODUCT_RUNTIME_FAILURES_CONFIRMED = 2
QA_CONTRACT_FAILURES_CONFIRMED = 3
G8_VISUAL_ARTIFACT_REQUIREMENT = NOT YET SATISFIED
```

The first attempt did not execute browser QA. It failed while materializing one Git blob through the GitHub API with a transient HTTP 500. MR reran the Windows job without product/source change.

Attempt 2 reached the real UI browser suite and produced five failures.

### A. Product/source corrections required

1. Compact File-route regression:

```text
exportBtn = visible / RESPONSIVE_ALTERNATIVE
newBtn = incorrectly visible
openBtn = incorrectly visible
saveBtn = incorrectly visible
```

Accepted contract remains:

```text
File menu = PRIMARY
compact Export = RESPONSIVE_ALTERNATIVE
compact New/Open/Save permanent copies = HIDDEN
```

Authorized product change:
`product/source/styles.css` only for this visibility correction.

2. Delivery build identity mismatch:

```text
app BUILD_ID    = 20260924-ui-006-main-r1
worker BUILD_ID = 20260925-ui-rebuild-001-g3-first-paint-r1
```

Authorized product change:
- `product/source/src/config.js` — BUILD_ID only;
- `product/source/service-worker.js` — BUILD_ID only.

Use one new identical cleanup/G8 build identity in both files. Preserve:
`INK_VERSION = 0.1`, `PRODUCT_VERSION = 0.1`, `FORMAT_VERSION = 4`.

### B. QA-contract corrections required

The following Runtime failures are old assertion semantics, not accepted product defects:

1. Escape menu assertion dispatches `Escape` directly to `window`, while the real application-menu controller is bound on the document/menu DOM path.
   - Preserve a real Escape interaction assertion.
   - Dispatch through the real DOM keyboard path; do not replace with constant PASS.

2. Typography assertion still requires `Inter`.
   - G4 accepted font authority is the single `--ui-font` stack beginning with Segoe UI.
   - Preserve CJK/Latin/numeric same-size and same-family verification.
   - Validate against the current token authority; remove only the obsolete Inter requirement.

3. Compact toolbar assertion requires the desktop `.tool-rail` to be hidden.
   - This was inherited from the retired mobile-bottom-dock-only UI-006 contract.
   - Preserve verification that COMPACT forces effective single-column toolbar state, no dual class, and no shell overflow.
   - Do not require the old hidden-rail grammar.
   - Do not redesign compact navigation in this revision.

Authorized QA change:
`qa/runtime/ink-web-ui-001-harness.html`

Focused source QA may be updated/added only as needed to lock the corrected contracts.

### C. Missing G8 visual evidence

The current central Runtime artifact contains JSON/log evidence but does not yet produce the mandatory visual set.

G8 must produce actual Chrome/browser pixels for:

```text
ui-first-paint.png
ui-1280x1024.png
ui-960x800.png
```

Requirements:
- 1280×1024 and 960×800 are real browser viewport evidence;
- first-paint capture must come from a fresh browser profile/reload path and identify the capture milestone;
- use browser-native capture/CDP or equivalent QA-only browser mechanism;
- do not add a product screenshot hook;
- do not use an alternate renderer or DOM-to-canvas reconstruction;
- store capture metadata in Runtime evidence;
- preserve the existing UI / Creative / Geometry batch.

Authorized QA infrastructure:
`qa/runtime/run-ink-runtime-batch.mjs`
and the existing UI Runtime harness only where necessary.

### Hard bounds

No Renderer / Canvas / WebGL / Document / History / Revision / Geometry / CHAT / persistence semantics.
No FORMAT_VERSION or product-version change.
No Photoshop workstation rebuild.
No broad mobile redesign.
No weakening assertions into unconditional PASS.

After bounded correction:

```text
FOCUSED_QA = PASS
DEV_HANDOFF → STOP
MR exact-HEAD source review
→ one new exact-SHA G8 Windows Runtime
```

---

## MR_PASS — G7 / G8 Runtime authorization — 2026-09-25

```text
TASK = INK-UI-REBUILD-001-TECH-DEBT-CLEANUP
REVIEWED_EXACT_HEAD = 272c656cb98994540d3311f3f38dac1e95dfb519
G0-G7 = MR SOURCE PASS
G8 = AUTHORIZED / MR_OWNED
PHOTOSHOP_WORKSTATION_REBUILD = HOLD
```

G7 exact user-approved visible-logo contract:

```text
VISIBLE_LOGO_SHA256 = 08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8
VISIBLE_LOGO_ROUTE = assets/INK_MARK_SOURCE_W-300.jpg?v=0.1
VISIBLE_LOGO_AUTHORITY = 1
FAVICON_AUTHORITY = assets/favicon.svg?v=0.1
CORE_MUTATION = 0
```

G7 bounded delta review PASS:
only the approved JPEG, focused UI QA and evidence/progress files changed.

G8 exact-SHA Runtime target:

`272c656cb98994540d3311f3f38dac1e95dfb519`

Required G8 acceptance remains:

- full UI / Creative / Geometry Runtime regression;
- same Dock open → close;
- different Dock switch;
- Window-route convergence;
- File + non-File shared-menu behavior;
- reload / first-paint evidence;
- 1280×1024 containment capture;
- 960px containment capture;
- exact tested SHA, run id, artifact id + digest.

The central Runtime queue is authorized to run this task immediately as high-risk/single-item because G8 is the mandatory blocking gate for the UI foundation and cannot be batched with stale unpromoted Geometry Ops.

---

## MR_REVISE — G7 USER-APPROVED VISIBLE LOGO ASSET — 2026-09-25

```text
TASK = INK-UI-REBUILD-001-TECH-DEBT-CLEANUP
SOURCE_REVIEWED_HEAD = cfa9fa01e6e0fa71e1bb59cbc8e6d607f91d0560
G0-G6 = MR SOURCE PASS
G7 = USER ASSET AUTHORITY RESOLVED / DEV_DELTA_REQUIRED
G8 = HOLD
```

User supplied and approved the official INK visible logo in CHAT.

Approved asset identity:

```text
SOURCE_NAME = W-300.jpg
DIMENSIONS = 300x300
BYTES = 19801
SHA256 = 08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8
ROLE = OFFICIAL_INK_VISIBLE_LOGO
```

Transport-only staging copy for DEV retrieval:

```text
LIBRARY_PATH = /INK-DEV-ASSET-STAGING/INK_APPROVED_VISIBLE_LOGO_W-300.jpg
AUTHORITY = USER_APPROVAL_IN_THIS_WORK_ORDER
NOTE = Library is transport only; GitHub remains the sole final SSOT.
```

Bounded G7 implementation authorization on the existing cleanup branch:

1. Retrieve the exact staged approved image and verify SHA-256 equals `08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8`.
2. Replace the bytes of:
   `product/source/assets/INK_MARK_SOURCE_W-300.jpg`
   with the exact approved asset.
3. Keep the existing visible-logo route unless changing it is strictly required; do not introduce a second visible-logo authority.
4. Do not substitute `ink-mark.svg` as the authority. It is not the approved source.
5. Favicon authority remains `product/source/assets/favicon.svg`; do not change it in this delta.
6. Update G7 evidence and focused QA to lock the exact approved visible-logo SHA / route contract.
7. If `ink-mark.svg` is demonstrably unreferenced and only preserves stale logo bytes, DEV may retire it only if focused QA proves zero active references; otherwise leave it untouched and document it as non-authoritative.
8. No other UI redesign, no G8 Runtime, no Photoshop alignment.
9. Frozen Core / Renderer / Document / History / Revision / Geometry / CHAT / persistence / FORMAT_VERSION remain unchanged.

Completion:

```text
G7_VISIBLE_LOGO_SHA256 = 08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8
VISIBLE_LOGO_AUTHORITY = 1
FAVICON_AUTHORITY = 1
CORE_MUTATION = 0
FOCUSED_QA = PASS
DEV_HANDOFF → STOP
```

MR will then pin the new exact HEAD and authorize G8.

---

## MR source review — UI debt cleanup handoff — 2026-09-25

```text
TASK = INK-UI-REBUILD-001-TECH-DEBT-CLEANUP
DEV_BRANCH = work/ink-ui-rebuild-001-tech-debt-cleanup
REVIEWED_EXACT_HEAD = cfa9fa01e6e0fa71e1bb59cbc8e6d607f91d0560
SOURCE_REVIEW = PASS

G0 = PASS
G1 = PASS
G2 = PASS_AT_SOURCE
G3 = PASS_AT_SOURCE
G4 = PASS_AT_SOURCE
G5 = PASS_AT_SOURCE / REVISED
G6 = PASS_AT_SOURCE
G7 = HOLD_USER_ASSET_AUTHORITY
G8 = NOT_AUTHORIZED_YET

CSS_HEALTH =
  !important 223 → 19
  presentation !important = 0
  final override block = 0

RESPONSIVE =
  DESKTOP_WIDE > 1120
  DESKTOP_NARROW 761–1120
  COMPACT <= 760

FROZEN_CORE_MUTATION = 0
DEV_SCOPE = ACCEPTED
```

MR verified the post-revision delta and independently recomputed the main CSS-health invariants.

G7 is the only pre-Runtime blocker:

```text
favicon = assets/favicon.svg / authority proven
visible logo current route = assets/INK_MARK_SOURCE_W-300.jpg
alternate ink-mark.svg = embedded wrapper around the same JPEG payload
exact user-approved visible logo asset = not proven by GitHub SSOT
```

Do not guess or silently freeze the current JPG as the final accepted logo.

Required next input:

- USER identifies/approves the exact visible-logo asset, or supplies the approved source so it can become GitHub SSOT.
- Then perform a bounded G7 contract update if needed.
- Only after G7 PASS may MR authorize G8 exact-SHA Windows Runtime + visual evidence.

`PHOTOSHOP_WORKSTATION_REBUILD = HOLD`

---

## MR checkpoint — UI debt cleanup G5 health revision — 2026-09-25

```text
TASK = INK-UI-REBUILD-001-TECH-DEBT-CLEANUP
REVIEWED_HEAD = f574731b0e920950211f04177826b3ad2ce0157b
MR = REVISE / G5_CSS_HEALTH_DELTA_ONLY
G0 = PASS
G1 = PASS
G2 = SOURCE_PASS
G3 = SOURCE_PASS
G4 = SOURCE_PASS
G5 = NOT YET MR_PASS
G6 = PARTIAL / WIDTH TAXONOMY DIRECTION ACCEPTED
G7 = NOT_STARTED
G8 = NOT_STARTED

BLOCKER =
  !important 223 → 220 does not satisfy the existing
  "materially decrease" CSS-health rule.

OBSERVED_G6 =
  width taxonomy is now limited to:
    DESKTOP_WIDE > 1120
    DESKTOP_NARROW 761–1120
    COMPACT <= 760
  pointer/height/accessibility media features remain modifiers.
  This direction is accepted, but G6 may not mask the unresolved G5 gate.
```

Authorized bounded revision:

1. Return to G5 only for `!important` debt on touched workstation/shell presentation surfaces.
2. Remove avoidable cascade-war `!important` declarations by deleting/replacing obsolete competing authorities; do not bulk-strip declarations blindly.
3. Preserve only declarations that have a documented concrete necessity after authority consolidation.
4. Update G5 evidence with:
   - exact before/after total;
   - remaining `!important` inventory by semantic family/property;
   - explanation for any remaining touched-shell `!important`;
   - proof that no new late override block or frozen-Core mutation was introduced.
5. G5 MR acceptance requires a substantive reduction, not a cosmetic 3-count change. The evidence must demonstrate that touched shell authorities no longer depend on cascade-war `!important` rules.
6. After G5 is corrected, continue G6 → G7 → focused QA → `DEV_HANDOFF / STOP`.
7. Do not start Photoshop workstation rebuild.
8. Do not run/promote Geometry Ops from the stale branch.

Frozen authorities remain unchanged.

`DEV → bounded G5 health delta → continue G6/G7 → DEV_HANDOFF → STOP`

---

### Health baseline release note — 2026-09-25

```text
KNOWN_GOOD_PRODUCT_BASE = d6c28be13cddee0d83b9e7613b5498b06d1f7b0e
CURRENT_MAIN_PRODUCT_SOURCE_DELTA_FROM_BASE = 0 files

GEOMETRY_OPS_RUNTIME =
  36088550693 / FAIL / Creative harness timeout
  branch remains unpromoted

DECISION =
  do not block UI debt cleanup on an unpromoted experimental branch
  start cleanup from current main because its product/source tree is unchanged
```

## INK-UI-REBUILD-001-TECH-DEBT-CLEANUP — health-first cleanup authorization — 2026-09-25

STATUS: `INK-UI-REBUILD-001-TECH-DEBT-CLEANUP / AUTHORIZED / DEV_START_FROM_KNOWN_GOOD_MAIN`

User priority:

```text
INK health > schedule/management convenience.
Safely remove the UI technical debt identified by UR and leave auditable evidence.
```

Authoritative UR evidence:

```text
working/INK_UI_REBUILD_001_TECH_DEBT_PREFLIGHT.md
  source commit: c0e9177d13d6efaf390f662cccc999ae5d1654e4

working/INK_UI_REBUILD_001_TECH_DEBT_CLEANUP_SCOPE.md
  source commit: 273e17c33616a421d7738b93e352896e48b4e55b
```

Implementation-base safety rule:

1. `INK-CHAT-GEOMETRY-OPS-001` remains `MR_HOLD / NOT_PROMOTED`; it does not block UI cleanup.
2. Create a fresh UI cleanup branch from the current known-good `main`, whose `product/source` tree is unchanged from `d6c28be13cddee0d83b9e7613b5498b06d1f7b0e`.
3. Copy the two UR audit/scope documents into that fresh branch as the cleanup baseline.
4. Do not reuse the old audit branch as the implementation base.
5. Execute cleanup in bounded health gates. A later gate may not mask a failure from an earlier gate.
6. Geometry Ops must later be replayed/reconciled onto the post-cleanup main rather than merged from its stale Runtime-harness branch as-is.

Frozen product authorities throughout cleanup:

```text
Renderer / WebGL / Canvas engine
Document model / schema / migration
History semantics
Revision semantics
Recipe / Geometry contracts
CHAT proposal / approval / execution semantics
persistence semantics
FORMAT_VERSION
product base version
```

Cleanup gates, in required order:

```text
G0  BASELINE_EVIDENCE
G1  OBSOLETE_UI_QA_CONTRACTS
G2  MENU_PANEL_AUTHORITY
G3  FIRST_PAINT_AUTHORITY
G4  TYPOGRAPHY_AUTHORITY
G5  CSS_SHELL_AUTHORITY
G6  RESPONSIVE_AUTHORITY
G7  BRAND_CONTRACT
G8  FULL_RUNTIME_AND_VISUAL_EVIDENCE
```

Health evidence is mandatory. DEV must produce one machine-readable/Markdown evidence register that records before/after metrics and exact proof for every gate.

Required before/after metrics at minimum:

```text
styles.css bytes / characters
!important count
.topbar definition count
.tool-rail definition count
.inspector definition count
.stage-wrap definition count
.statusbar definition count
.control-row definition count
.inspector-tab definition count
.creative-workspace-panel definition count

media-query thresholds / named layout modes
font-family authorities
hard-coded workstation font-size inventory
visible panel-open route count
panel state owner count
menu controller count
brand visible-logo authorities
favicon authorities
obsolete UI regression assertions
duplicate DOM ids
service-worker build identity
```

Required behavioral evidence:

```text
same Dock panel click: open → close
different Dock item: switch
Window menu route: converges on same panel state
floating edge tab: retired
legacy duplicate Inspector opener: retired where superseded
File + >=1 non-File menu: same menu controller
Escape / outside click: menu closes
first delivered paint: intended workspace state
no black/dark legacy flash contract
DESKTOP_WIDE / DESKTOP_NARROW / COMPACT = one responsive taxonomy
1280 shell containment
960 shell containment
Web / Portable parity
generator --check
no duplicate DOM IDs
```

CSS health rule:

```text
NO new final-override block.
Touched shell surfaces must delete/replace obsolete authorities.
Repeated core selectors must materially decrease.
!important must materially decrease.
No new anonymous breakpoint family.
```

Regression rule:

Retired QA assertions must be replaced by the new accepted contract, never deleted into unconditional PASS.

Brand rule:

If exact approved visible logo cannot be proven, G7 remains `HOLD_ASSET`. Do not guess. Favicon and visible-logo tests must still converge on one declared contract.

Evidence artifacts required before MR can declare cleanup PASS:

```text
working/INK_UI_REBUILD_001_TECH_DEBT_BASELINE_EVIDENCE.md
working/INK_UI_REBUILD_001_TECH_DEBT_CLEANUP_EVIDENCE.md
research/INK_UI_REBUILD_001_TECH_DEBT_HEALTH_REPORT_v0.1.md
qa focused source/static evidence
browser Runtime evidence
reload / first-paint capture
1280×1024 shell capture
960px shell capture
exact tested SHA
Runtime run id
artifact id + digest
```

Exit gate:

```text
UI_FOUNDATION_DEBT = PASS
CORE_MUTATION = 0
NEW_TECH_DEBT = 0
FULL_RUNTIME = PASS
NORMAL_UI_REBUILD = READY
```

Until G8 passes:

`PHOTOSHOP_WORKSTATION_REBUILD = HOLD`

---

## INK-CHAT-GEOMETRY-OPS-001 — CHAT native geometry operation exposure — 2026-09-25

STATUS: `INK-CHAT-GEOMETRY-OPS-001 / MR_HOLD / RUNTIME_TIMEOUT / NOT_PROMOTED`

User authorization:

```text
Add these CHAT geometry capabilities now:
create path / primitive
edit path geometry
rotate around center
radial repeat
clone / reuse module
boolean geometry
group / hierarchy
```

Purpose:

Expose existing INK native geometry authorities through the already accepted
`use_ink → Chat Creative Plan → bounded edit → History / Revision` route.
Do not build a second geometry engine.

Authoritative existing sources:

```text
Path creation:
  vector/vector-core.js
  createPath / createAnchor

Path geometry editing:
  editor/path-edit.js
  PathEditController

rotation:
  core/math.js
  Matrix.rotate / Matrix.around
  editor/transform.js
  applyWorldTransformBatch

clone:
  editor/composition.js
  cloneCompositionObject

repeat:
  vector/vector-core.js
  createRepeat / repeatTransforms / expandRepeat
  repeat/repeat-identity.js

boolean:
  vector/vector-core.js
  booleanPaths / dividePaths

group / hierarchy:
  vector/vector-core.js
  createVectorGroup
  document/hierarchy.js
  reparentPageObject
```

Required `use_ink` v0.2 operation vocabulary:

```text
existing:
  path.repaint.v1
  path.material.apply.v1
  path.material.remove.v1
  object.translate.v1
  path.simplify.v1
  path.refine.v1

add:
  path.create.v1
  path.edit.v1
  object.rotate.v1
  object.clone.v1
  repeat.radial.v1
  boolean.apply.v1
  group.create.v1
  object.reparent.v1
```

Required behavior:

- all new writes use the existing proposal → explicit approval → execute boundary;
- all writes commit through authoritative History;
- final plan Revision behavior remains owned by Chat Creative Plan;
- no arbitrary JS / eval / Function / direct document JSON writes;
- stable refs returned for created / changed objects;
- creation operations must support deterministic geometry sufficient for rose-window reconstruction:
  custom Path anchors/subpaths, ellipse/circle, rectangle, polygon/polyline;
- `path.edit.v1` must expose bounded existing PathEditController actions, at minimum:
  move-anchor, move-handle, set-anchor-mode, add-anchor, delete-anchors, set-subpath-closed;
- `object.rotate.v1` accepts degrees and optional explicit world-space center;
- `object.clone.v1` creates fresh stable object/path/subpath/anchor IDs and preserves composition lineage;
- `repeat.radial.v1` creates an editable native Repeat from exactly one source object and explicit center/count/sweep/startAngle;
- `boolean.apply.v1` supports union / difference / intersection / xor / divide over 2+ Path targets and returns editable result refs;
- `group.create.v1` groups selected same-parent/same-layer objects while preserving world appearance;
- `object.reparent.v1` uses hierarchy authority and rejects cycles / cross-layer invalid moves.

Acceptance gate:

`CHAT_NATIVE_GEOMETRY_OPS_V01`

Runtime proof must demonstrate in one approved plan or bounded sequence:

```text
create primitive/path
→ edit path geometry
→ rotate around explicit center
→ clone
→ radial repeat
→ boolean
→ group
→ reparent
→ History receipts
→ Revision
→ preview
```

Non-goals:

```text
UI changes = 0
IMAGE model = 0
external transport = 0
new renderer = 0
new geometry engine = 0
FORMAT_VERSION = 4 / preserve
Drawing Validation Phase C = HOLD_BY_USER
Lesson-002 artwork comparison = NOT YET; this task only exposes the operation authority needed for it
```

DEV branch:

`work/ink-chat-geometry-ops-001`

Authorized implementation files:

```text
product/source/src/editor/chat-bounded-edit.js
product/source/src/agent/capability-registry.js
product/source/src/editor/chat-creative-plan.js        # only if generic sequencing requires it
product/source/src/editor/composition.js               # only if an adapter helper is required; preserve existing semantics
qa/ink-chat-geometry-ops-001.test.mjs
qa/ink-chat-connector-004-use-ink-programmable-bridge.test.mjs   # update stale exact-six vocabulary assertion only
qa/runtime/ink-cloud-018-browser-harness.html
ACTIVE/INK_DEV_PROGRESS.md
working/INK_CHAT_GEOMETRY_OPS_001_DEV_HANDOFF.md
research/INK_CHAT_GEOMETRY_OPS_001_REPORT_v0.1.md
```

Existing native geometry modules are upstream authorities and should remain unchanged unless a focused defect is proven.

Compatibility rule:

```text
Connector-004 accepted six-operation vocabulary = exact preserved prefix/subset
Geometry Ops 001 = authorized additive expansion to fourteen operations
Any old QA asserting "exactly six forever" must be revised; all six original operations remain unchanged.
```

DEV must run focused QA, report exact HEAD, then:

`DEV_HANDOFF → STOP`

MR owns exact-SHA Windows Runtime, review and promotion.

---

## INK-CHAT-CLOSED-LOOP-001 final closure — 2026-09-24

```text
TASK = INK-CHAT-CLOSED-LOOP-001
MR = PASS
TESTED_SHA = ac1f3407376a3e7f7cba1b792bac2bfb15f47cd3
RUNTIME_RUN = 36017580698
RUNNER = DESKTOP-NSOQH69

UI = PASS
CREATIVE = PASS
GEOMETRY = PASS

SMART_LOOP_MARKERS = 18 / 18 PASS
SMART_REFERENCE_COLOR_LINE_CHAT_CLOSED_LOOP = PASS

BEFORE_PNG_SHA256 = 19eb289da30929082ecc9e59b34d89b7e066a5df06aa4a1e3bd535492cfab4e5
AFTER_PNG_SHA256 = 9c45b05df543b86e4e1a57174c3ce538d98db213fa8dabed551e79c53f378b1d

ARTIFACT_ID = 10815532458
ARTIFACT_DIGEST = sha256:e9778946a951d238b0474a9847f05f392a4a68970de0ec994c55736640fdf2fb

PROMOTION_PR = #52 / MERGED
PROMOTED_MAIN = d6c28be13cddee0d83b9e7613b5498b06d1f7b0e
PROMOTION_EQUIVALENCE = 9 / 9 exact

NAMED_TOOL_TOTAL = 20
import_ink_reference = AVAILABLE

RETURN_PATH =
  RUNTIME_ARTIFACT_BRIDGE / NOT_LIVE_EXTERNAL_TRANSPORT

EXTERNAL_TRANSPORT = UNAVAILABLE / unchanged
FORMAT_VERSION = 4 / PRESERVED

CLOSED_LOOP_001 = CLOSED
NEXT_CONNECTOR_WORK_ORDER = NOT_AUTHORIZED
DRAWING_VALIDATION = HOLD_BY_USER
```

Proven chain:

```text
CHAT-style capability discovery
→ import_ink_reference
→ native INK Reference
→ decompose_ink_reference
→ native Color + Line Paths
→ stable refs
→ get_ink_preview
→ use_ink
→ proposal
→ explicit approval
→ native repaint × 2
→ History
→ Revision
→ get_ink_preview
→ before/after PNG artifact returned to CHAT
```

This closure does not claim live external ChatGPT binary transport. The accepted proof return path remains the bounded Runtime artifact bridge.

---

## MR_REVISE / QA_ORDER_ISOLATION_ONLY — 2026-09-24

Runtime evidence:

```text
RUN = 36014703794
TESTED_SHA = b57a3471ceaaba915a296aa1fe46680ee3e44134
RUNNER = DESKTOP-NSOQH69
UI = PASS

SMART_LOOP_MARKERS = 18 / 18 PASS
SMART_LOOP_BEFORE_PNG = PASS
SMART_LOOP_AFTER_PNG = PASS
SMART_LOOP_JSON = PRESENT

BEFORE_SHA256 = 19eb289da30929082ecc9e59b34d89b7e066a5df06aa4a1e3bd535492cfab4e5
AFTER_SHA256 = 9c45b05df543b86e4e1a57174c3ce538d98db213fa8dabed551e79c53f378b1d

FIRST_POST_SMART_LOOP_FAIL =
  WORKSTATION_REVISION_UNAVAILABLE_STATE_EXPLICIT
```

MR classification:

```text
SMART_REFERENCE_COLOR_LINE_CHAT_PROOF = PASS
FULL_CREATIVE_REGRESSION = FAIL
PRODUCT_RUNTIME_FAIL = NOT_ESTABLISHED
CLASSIFICATION = QA_STATE_ORDER_CONTAMINATION
```

Cause:

The smart closed-loop proof intentionally captures a final Revision before the legacy Workstation Revision block runs.
The legacy marker `WORKSTATION_REVISION_UNAVAILABLE_STATE_EXPLICIT` was originally written for the pre-revision state and still asserts that Revision Compare is disabled.
After the smart loop, that precondition is no longer true.

Authorized revision only:

```text
qa/runtime/ink-cloud-018-browser-harness.html
qa/ink-chat-closed-loop-001-smart-proof.test.mjs   # focused ordering contract only
research/INK_CHAT_CLOSED_LOOP_001_SMART_PROOF_REPORT_v0.1.md
working/INK_CHAT_CLOSED_LOOP_001_DEV_HANDOFF.md
ACTIVE/INK_DEV_PROGRESS.md
```

Required correction:

- preserve `WORKSTATION_REVISION_UNAVAILABLE_STATE_EXPLICIT` as a real browser assertion;
- execute that assertion before the smart loop creates any Revision;
- remove only the now-invalid later duplicate assumption;
- do not weaken it to a constant / skipped / unconditional PASS;
- preserve all later Revision capture / compare / restore coverage;
- preserve the smart-loop sequence and all 18 passing smart-loop markers.

Product source is frozen:

```text
product/source/** = FROZEN
History = FROZEN
Revision = FROZEN
Renderer = FROZEN
Public Creative API = FROZEN
Capability Registry = FROZEN
UI product source = FROZEN
EXTERNAL_TRANSPORT = 0
FORMAT_VERSION = 4 / PRESERVE
```

After focused QA:

`DEV_HANDOFF → STOP`

MR then runs one new exact-SHA Windows Runtime.

---

## MR_REVISE / QA_ASSERTION_ONLY — 2026-09-24

Runtime diagnostic:

```text
RUN = 36012548161
TESTED_SHA = 20262d942c7a4d1a5ca03898856a2d7ddff9f5d6
RUNNER = DESKTOP-NSOQH69
UI = PASS
SMART_LOOP_REFERENCE_IMPORTED = PASS
SMART_LOOP_COLOR_LINE_DECOMPOSED = PASS
SMART_LOOP_STABLE_REFS_RETURNED = PASS
SMART_LOOP_PREVIEW_BEFORE_CAPTURED = PASS
SMART_LOOP_PREVIEW_BEFORE_MATERIALIZED = PASS
SMART_LOOP_USE_INK_PROPOSE_MUTATION_NEUTRAL = PASS
SMART_LOOP_USE_INK_EXECUTE_BLOCKED_BEFORE_APPROVAL = PASS
SMART_LOOP_USE_INK_APPROVED = PASS
SMART_LOOP_TWO_STEP_REPAINT_EXECUTED = PASS
FIRST_FAIL = SMART_LOOP_HISTORY_RECORDED
```

MR classification:

```text
PRODUCT_RUNTIME_FAIL = NOT_ESTABLISHED
CLASSIFICATION = QA_ASSERTION_SEMANTICS_MISMATCH
PRODUCT_SOURCE = FROZEN
```

Reason:

`HistoryManager` does record the repaint steps, but `patchObjectIds()` only derives IDs from `patch.id` or `patch.value.id`.
Scalar fill/stroke patches do not necessarily carry either field. Therefore an assertion requiring repaint History summaries to contain target IDs in `entry.objectIds` is not an authoritative History contract.

Authorized revision only:

```text
qa/runtime/ink-cloud-018-browser-harness.html
qa/ink-chat-closed-loop-001-smart-proof.test.mjs   # only if focused regression needs the assertion contract
research/INK_CHAT_CLOSED_LOOP_001_SMART_PROOF_REPORT_v0.1.md
working/INK_CHAT_CLOSED_LOOP_001_DEV_HANDOFF.md
ACTIVE/INK_DEV_PROGRESS.md
```

Replace the invalid History assertion with evidence that uses existing authoritative receipts:

```text
smartExecuted.historyReceipt.steps.length === 2

for each step:
  history.beforeUndoCount is integer
  history.afterUndoCount === history.beforeUndoCount + 1
  history.latestLabel === 'CHAT repaint Path'

get_ink_history:
  status === COMPLETED
  applied / retainedCount reflect both executed repaint steps
  final two entries are scoped History entries
  each final entry label === 'CHAT repaint Path'
  each final entry patchCount > 0
```

Do not require `entry.objectIds` for scalar repaint proof.

No product source changes are authorized.

```text
visual-feedback.js = FROZEN
public-creative-api.js = FROZEN
capability-registry.js = FROZEN
History engine = FROZEN
patchObjectIds = FROZEN
Renderer = FROZEN
UI = 0
EXTERNAL_TRANSPORT = 0
FORMAT_VERSION = 4 / PRESERVE
```

After focused QA:

`DEV_HANDOFF → STOP`

MR will rerun the exact new HEAD on Windows Runtime.

---

## MR_REVISE — smart preview diagnostic only — 2026-09-24

```text
TASK = INK-CHAT-CLOSED-LOOP-001
RUNTIME_RUN = 36006888089
TESTED_SHA = 74c02f41dd9bde3262a6e7ee507126b74c2e18c9
RUNNER = DESKTOP-NSOQH69

UI = PASS / 106 of 106
CREATIVE = FAIL
GEOMETRY = NOT_REACHED

PASS_BEFORE_FAILURE =
  SMART_LOOP_CAPABILITIES_DISCOVERED
  SMART_LOOP_REFERENCE_IMPORTED
  SMART_LOOP_IMPORT_HISTORY_PROVENANCE_RECORDED
  SMART_LOOP_COLOR_LINE_DECOMPOSED
  SMART_LOOP_STABLE_REFS_RETURNED

DECOMPOSITION =
  Color Paths = 1471
  Line Paths = 1471

FAIL_AT =
  SMART_LOOP_PREVIEW_BEFORE_CAPTURED

PRODUCT_PREVIEW_FAIL = NOT YET ESTABLISHED
QA_BRIDGE_FAIL = NOT YET ESTABLISHED
CURRENT_MISSING_EVIDENCE =
  smartBefore.status / diagnostics / result were not attached to the failed assertion

MR = REVISE / DIAGNOSTIC_ONLY
PRODUCT_SOURCE = FROZEN
QA_RESOLVER_ROUTE = FROZEN
NEW_OPERATION_FAMILIES = 0
EXTERNAL_TRANSPORT = 0
UI_CHANGE = 0
FORMAT_VERSION = 4
```

Authorized revision only:

```text
qa/runtime/ink-cloud-018-browser-harness.html
research/INK_CHAT_CLOSED_LOOP_001_SMART_PROOF_REPORT_v0.1.md
working/INK_CHAT_CLOSED_LOOP_001_DEV_HANDOFF.md
ACTIVE/INK_DEV_PROGRESS.md
```

Required change:

At the `SMART_LOOP_PREVIEW_BEFORE_CAPTURED` assertion, attach a JSON-safe diagnostic payload containing at minimum:

```text
smartBefore.status
smartBefore.diagnostics
smartBefore.result
smartBefore.outputHandles
preview options
```

Do not alter the preview request, renderer, product API, output registry, resolver route, fixture, decomposition, or acceptance condition in this revision.

Goal: one exact-SHA Runtime rerun that identifies the real `INK_PREVIEW_*` failure code without changing behavior.

`DEV_HANDOFF → STOP → MR REVIEW`

---

## INK-CHAT-CLOSED-LOOP-001 MR bounded revision — 2026-09-24

```text
REVIEWED_HEAD = 2b3c2f79147b6122f5ac78ed47d19c9878522386
RUNTIME_RUN = 36003623197
RUNTIME_TESTED_SHA = 2b3c2f79147b6122f5ac78ed47d19c9878522386
RUNNER = DESKTOP-NSOQH69

UI = PASS
CREATIVE = FAIL / QA artifact resolver injection timeout
GEOMETRY = NOT_REACHED

SMART_CHAIN_REACHED =
  capability discovery
  → reference import
  → import History/provenance
  → Color + Line decomposition
  → 1471 Color refs + 1471 Line refs

FAIL_LOCATION =
  before first get_ink_preview
  dynamic inline module did not install __INK_SMART_LOOP_QA_RESOLVE

PRODUCT_DEFECT = NOT_ESTABLISHED
PRODUCT_SOURCE = FROZEN
MR = REVISE / QA_BRIDGE_ONLY
PROMOTION = BLOCKED
```

Authorized revision only:

```text
qa/runtime/ink-cloud-018-browser-harness.html
qa/runtime/run-ink-runtime-batch.mjs
qa/ink-chat-closed-loop-001-smart-proof.test.mjs   // only if needed for QA coverage
research/INK_CHAT_CLOSED_LOOP_001_SMART_PROOF_REPORT_v0.1.md
ACTIVE/INK_DEV_PROGRESS.md
working/INK_CHAT_CLOSED_LOOP_001_DEV_HANDOFF.md
```

Required correction:

- replace the failing dynamically injected inline module with a deterministic same-origin external QA module/route or equivalent static QA-only loading path;
- the resolver must execute in the INK app iframe realm so it reaches that realm's existing output registry;
- keep the resolver fixed-purpose: `resolveInkOutputPayload(window.INK_APP, handleId)` only;
- remove the temporary QA global after smart-loop materialization;
- no product hook, public payload API, external transport, eval, Function, arbitrary module execution or alternate renderer;
- preserve all 17 SMART_LOOP markers and the same before/after artifact contract.

Then:

`DEV_HANDOFF → STOP → MR source re-check → new exact-SHA Runtime`

---

# INK CURRENT WORK ORDER — SMART CLOSED LOOP PROOF

## MR_REVISE — PREVIEW DIMENSION BOUNDARY DEFECT

Runtime attempt 2:

```text
RUN = 36009581263 / attempt 2
TARGET_SHA = 2a56b602af280fcc923a394d68accab755d0611f
RUNNER = DESKTOP-NSOQH69

UI = PASS
REFERENCE_IMPORT = PASS
DECOMPOSITION = PASS
STABLE_REFS = PASS

FIRST_PRODUCT_FAILURE =
  SMART_LOOP_PREVIEW_BEFORE_CAPTURED

PREVIEW_STATUS = FAILED
PREVIEW_DIAGNOSTIC = INK_PREVIEW_DIMENSION_LIMIT_EXCEEDED
PREVIEW_OPTIONS =
  scope: content
  maxDimension: 960
  background: true
```

MR classification:

```text
PRODUCT_DEFECT = YES
AREA = product/source/src/agent/visual-feedback.js
RENDERER_FAILURE = NO
TRANSPORT_FAILURE = NO
REFERENCE_PIPELINE_FAILURE = NO
```

Observed source behavior:

```text
content bounds
→ safeScale(..., maxDimension)
→ plannedPixelSize uses Math.ceil(bounds × scale)
→ boundary floating-point overshoot can become maxDimension + 1
→ assertPixelBounds rejects the preview before rendering
```

Authorized revision scope:

```text
MR_REVISE / PRODUCT_DEFECT_ONLY

ALLOW:
- product/source/src/agent/visual-feedback.js
- focused QA for preview content-dimension boundary
- existing smart-loop browser harness only if assertion coverage needs bounded update
- report / handoff / progress

REQUIRE:
- content preview planning must never exceed requested maxDimension because of rounding
- planned dimensions must remain consistent with renderExportCanvas content sizing
- add deterministic regression for a fractional/boundary content size that previously yields maxDimension + 1
- preserve existing hard dimension / hard pixel limits
- preserve all object-ref validation and output-handle behavior

FORBID:
- smartPreviewOptions changes
- renderer changes
- renderExportCanvas changes
- output registry changes
- resolver route changes
- timeout / retry changes
- external transport
- UI
- FORMAT_VERSION
- new native operation families
```

After focused QA:

```text
DEV_HANDOFF → STOP
MR exact-HEAD Runtime rerun required
```

STATUS: `INK-CHAT-CLOSED-LOOP-001 / MR_REVISE / QA_BRIDGE_ONLY`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-CHAT-CLOSED-LOOP-001` |
| TITLE | `Reference → Color + Line → CHAT Smart Closed Loop Proof v0.1` |
| DEV_BRANCH | `work/ink-chat-closed-loop-001` |
| ACCEPTED_UPSTREAM | `INK-CHAT-CONNECTOR-004 / CLOSED / MR_PASS / PROMOTED` |
| TARGET_GATE | `SMART_REFERENCE_COLOR_LINE_CHAT_CLOSED_LOOP` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_VERSION | `v0.1 / PRESERVE` |
| UI_CHANGE | `0` |
| IMAGE_MODEL | `0` |
| EXTERNAL_TRANSPORT | `0` |
| NEW_NATIVE_OPERATION_FAMILIES | `0` |

## Purpose

Prove the original first creative lesson as one coherent mature-connector workflow instead of another isolated feature test.

```text
CHAT-style capability discovery
→ import_ink_reference
→ decompose_ink_reference
→ get_ink_preview
→ inspect stable Color / Line refs
→ use_ink
→ explicit approval
→ existing path.repaint.v1 operations
→ History
→ Revision
→ get_ink_preview
→ before/after PNG evidence materialized
→ MR returns those Runtime artifacts to CHAT
```

This Work Order proves that the Figma / Penpot / Adobe-inspired connector grammar already installed in INK can operate as one workflow.

It does not attempt to expand the general native-operation vocabulary.

## A — Existing authorities are mandatory

Reuse exactly:

```text
app.chatReferenceHandoff.importReference
app.chatReferenceHandoff.decomposeReference
app.inkPublicApi capability discovery
app.inkPublicApi get_ink_preview / output handles
app.inkPublicApi use_ink
app.chatCreativePlan
app.chatBoundedEditAdapter
path.repaint.v1
History
Revision
Renderer
```

Do not create a second Reference importer, decomposition engine, plan executor, History, Revision, Renderer, or Document mutation route.

## B — Only product connector gap to close

Expose the already-implemented Reference import authority through the existing Public Creative API and Named Tool facade.

Required Public API:

```text
reference.import(input, options?)
→ app.chatReferenceHandoff.importReference(input, options)
```

Required Named Tool:

```text
20. import_ink_reference
```

The accepted Connector-004 19-tool registry must remain the exact ordered prefix.

Required capability descriptor:

```text
reference.import
availability = true
namedTool = import_ink_reference
publicMethod = reference.import
routingClass = NAMED_TOOL
```

The input may be a browser-local File/Blob handoff as already accepted by `normalizeChatAttachment`.

The returned public result must remain JSON-safe `INK_AGENT_RESULT / 1`; raw File/Blob bytes must not escape through the result envelope.

## C — Smart routing proof

The browser proof must not jump directly to implementation methods.

It must begin through the accepted connector surface:

```text
get_ink_capabilities
→ describe_ink_capability where needed
→ choose narrow named tool first
→ use_ink only for the coherent multi-step correction
```

This is the intended combined mature pattern:

```text
Adobe:
named capability routing + result handle + preview verification

Figma / Penpot:
stable native object refs + programmable multi-step native edit

INK:
same grammar over existing INK authorities
```

## D — One sequential browser proof

Use the already-versioned Runtime fixture:

`qa/fixtures/rose-window/rose-window-primary.png`

The exact browser sequence must be one traceable chain:

1. discover the required capabilities;
2. create a browser File/Blob from the Runtime fixture;
3. call `import_ink_reference`;
4. verify Reference stable ID + History/provenance receipt;
5. call `decompose_ink_reference`;
6. verify separate Color / Line layers and stable Path IDs;
7. call `get_ink_preview` and retain the output handle;
8. materialize the internal preview payload in the **QA harness only** as `smart-loop-before.png`;
9. choose at least one returned Color Path and one returned Line Path by their real stable refs;
10. call `use_ink` with a two-step plan using only existing `path.repaint.v1`:
    - visibly change one Color Path fill;
    - visibly change one Line Path stroke;
11. prove propose is mutation-neutral;
12. prove execute-before-approval is blocked;
13. approve and execute;
14. verify ordered execution + History receipts + final Revision;
15. call `get_ink_preview` again;
16. materialize `smart-loop-after.png` in the QA harness only;
17. prove before/after render fingerprints differ;
18. emit one JSON evidence record binding input source, stable refs, plan ID, History, Revision, preview handles and materialized image names.

Do not use IMAGE generation, Python image modification, direct Document JSON mutation, DOM screenshotting, or an alternate renderer.

## E — Runtime artifact bridge is proof transport, not product transport

For this proof only:

```text
INK_OUTPUT_HANDLE
→ internal payload resolver
→ QA-only Runtime materialization
→ evidence/*.png
→ GitHub Runtime artifact
→ MR retrieves artifact into CHAT
```

This is allowed as the existing Visual / Asset Interchange Standard Runtime fallback.

It must not change:

```text
external.transport = unavailable
```

No MCP, WebSocket, postMessage, arbitrary upload/download API, persistence service, or live ChatGPT connector transport is authorized here.

The proof must label the return path truthfully:

`RUNTIME_ARTIFACT_BRIDGE / NOT_LIVE_EXTERNAL_TRANSPORT`

## F — Required browser markers

At minimum:

```text
SMART_LOOP_CAPABILITIES_DISCOVERED
SMART_LOOP_REFERENCE_IMPORTED
SMART_LOOP_IMPORT_HISTORY_PROVENANCE_RECORDED
SMART_LOOP_COLOR_LINE_DECOMPOSED
SMART_LOOP_STABLE_REFS_RETURNED
SMART_LOOP_PREVIEW_BEFORE_CAPTURED
SMART_LOOP_PREVIEW_BEFORE_MATERIALIZED
SMART_LOOP_USE_INK_PROPOSE_MUTATION_NEUTRAL
SMART_LOOP_USE_INK_EXECUTE_BLOCKED_BEFORE_APPROVAL
SMART_LOOP_USE_INK_APPROVED
SMART_LOOP_TWO_STEP_REPAINT_EXECUTED
SMART_LOOP_HISTORY_RECORDED
SMART_LOOP_FINAL_REVISION_CAPTURED
SMART_LOOP_PREVIEW_AFTER_CAPTURED
SMART_LOOP_PREVIEW_AFTER_MATERIALIZED
SMART_LOOP_RENDER_FINGERPRINT_CHANGED
SMART_LOOP_ARTIFACT_EVIDENCE_READY
```

## G — Allowed files

Product:

```text
product/source/src/agent/public-creative-api.js
product/source/src/agent/capability-registry.js
```

QA / Runtime, as necessary:

```text
qa/ink-chat-closed-loop-001-smart-proof.test.mjs
qa/runtime/ink-cloud-018-browser-harness.html
qa/runtime/run-ink-runtime-batch.mjs
```

Evidence / handoff:

```text
research/INK_CHAT_CLOSED_LOOP_001_SMART_PROOF_REPORT_v0.1.md
working/INK_CHAT_CLOSED_LOOP_001_DEV_HANDOFF.md
ACTIVE/INK_DEV_PROGRESS.md
```

If another product source file appears necessary, STOP and return to MR before modifying it.

## H — Hard non-goals

```text
Boolean / Repeat / Group / Frame / Component / Layout exposure
raw Path creation
Path geometry editing
new transform operations
new drawing or trace engine
Creative Library Search
UI changes
external transport
arbitrary JS / eval / Function
arbitrary app method dispatch
direct Document JSON writes
automatic approval
automatic retry
FORMAT_VERSION change
package/ink-current mutation
```

## I — Completion gate

DEV handoff is allowed only when source/focused QA evidence supports the exact chain.

MR acceptance requires:

```text
exact-HEAD source review
→ Windows self-hosted browser Runtime
→ all existing UI / Creative / Geometry regression PASS
→ all SMART_LOOP_* markers PASS
→ smart-loop-before.png present
→ smart-loop-after.png present
→ evidence JSON present
→ tested exact SHA pinned
→ MR retrieves both PNGs into this CHAT
```

Only after the images are actually retrieved and inspectable here may MR declare:

`SMART_REFERENCE_COLOR_LINE_CHAT_CLOSED_LOOP = PASS`

Then:

`DEV_HANDOFF → STOP → MR REVIEW`

---

## INK-CHAT-CONNECTOR-004 final closure — 2026-09-24

```text
TASK = INK-CHAT-CONNECTOR-004
MR = PASS
TESTED_SHA = bae2353fdd057f5334a219bcdfcda67cc9090c46
RUNTIME_RUN = 35990559349
RUNNER = DESKTOP-NSOQH69
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS
USE_INK_BROWSER_MARKERS = 10 / 10 PASS
ARTIFACT_ID = 10804102899
ARTIFACT_DIGEST = sha256:d7abcfa4c2f30b908103fc09fa3feb3ecce58801d90881b59479715dd9693339
PROMOTION_PR = #51 / MERGED
PROMOTED_MAIN = 9af585df4667e37b9676cd73b9fd0b1db9a52530
PROMOTION_EQUIVALENCE = 10 / 10 Connector-004 product/QA/evidence blobs exact
NAMED_TOOL_TOTAL = 19
USE_INK = AVAILABLE
FORMAT_VERSION = 4 / PRESERVED
CONNECTOR_004 = CLOSED
NEXT_CONNECTOR_WORK_ORDER = NOT_AUTHORIZED
```

## UI-006 main integration visual gate — 2026-09-24

```text
UI_INTEGRATION_PR = #49 / MERGED
UI_INTEGRATION_MAIN = 9852f7ef67fd530c683cf1257406494e31c3b51d
UI_PAYLOAD = UI-006 accepted shell/template/styles/web-shell + authoritative UI harness
CONNECTOR_CORE_SOURCE_MUTATION = 0
FAVICON = assets/favicon.svg / restored from accepted UI-MAINT-002 authority
VISIBLE_INK_MARK = existing INK mark / preserved

PAGES_DEPLOY_RUN = 35979527212
PAGES_DEPLOY_HEAD = 9852f7ef67fd530c683cf1257406494e31c3b51d
PAGES_BUILD = PASS
PAGES_DEPLOY = PASS

VISUAL_GATE = REQUIRED
DEPLOYED_SCREENSHOT = NOT_YET_CAPTURED
CAPTURE_BLOCKER = external live-page capture requires Playwright MCP; unavailable in current MR tool surface
RUNTIME = HOLD
CONNECTOR_004_PROMOTION = BLOCKED / unchanged
```

## MR Runtime timeout classification / rerun queued

```text
PRIOR_RUNTIME_RUN = 35970456976
PRIOR_TESTED_SHA = a050e0d87d9b53b2d0ad5c34baffb4a88a070fdc
RUNNER = DESKTOP-NSOQH69 / ACCEPTED JOB
UI = PASS
CREATIVE = HARNESS_TIMEOUT / 240 seconds
GEOMETRY = NOT_REACHED

PRODUCT_RUNTIME_FAIL = NOT_ESTABLISHED
CLASSIFICATION = QA_HARNESS_TIME_BUDGET_INSUFFICIENT
PRODUCT_SOURCE_CHANGE = 0

QA_REVISION =
  run-ink-runtime-batch.mjs
  per-suite timeout 240s → 360s

RERUN_TARGET_SHA = 448eef0fd15a9543464bfd6830a5840f81d196f0
FINAL_RUNTIME_GATE = RERUN_REQUIRED
PROMOTION = BLOCKED_UNTIL_REAL_RUNTIME_RESULT
```

# INK CURRENT WORK ORDER

STATUS: `INK-CHAT-CONNECTOR-004 / CLOSED / MR_PASS / PROMOTED`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-CHAT-CONNECTOR-004` |
| PHASE | `USE_INK_PROGRAMMABLE_EXECUTION_FOUNDATION` |
| TITLE | `use_ink — CHAT-native programmable composition bridge v0.1` |
| DEV_BRANCH | `work/ink-chat-connector-004` |
| ACCEPTED_UPSTREAM | `INK-CHAT-CONNECTOR-003 / CLOSED / MR_PASS / PROMOTED` |
| CONNECTOR_003_PROMOTION | `96f8c553e87fd53b5ca0d2b01cc2972902f2fd69` |
| CONNECTOR_003_RUNTIME | `35961649436 / PASS` |
| TARGET_GATE | `INK_USE_INK_PROGRAMMABLE_BRIDGE_WORKS` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_VERSION | `v0.1 / PRESERVE` |
| IMAGE_MODEL | `0` |

## Purpose

Connector-004 establishes the general CHAT-native programmable entry:

```text
CHAT
→ Capability Discovery
→ use_ink
→ existing Chat Creative Plan authority
→ existing bounded edit authority
→ existing History
→ existing Revision
→ explicit get_ink_preview when visual verification is needed
```

`use_ink` is declarative plan execution, not arbitrary code execution.

## A — Authoritative route

Required route:

```text
use_ink
→ app.inkPublicApi.composition.*
→ app.chatCreativePlan
→ app.chatBoundedEditAdapter
→ accepted operation authorities
→ History
→ Revision
```

Reuse `product/source/src/editor/chat-creative-plan.js` and its existing proposal / approval / execution / partial-stop / Revision behavior.

Do not create a second plan store, approval-token format, execution loop, History system, Revision system, or Document authority.

## B — Public Creative API

Extend the existing single `app.inkPublicApi` with:

```text
composition.inspect(input?)
composition.propose({ plan })
composition.approve({ planId })
composition.execute({ planId, approvalToken })
composition.cancel({ planId })
```

Canonical object input is authoritative. Backward-compatible positional forms may remain, but Descriptor v1 must describe the canonical object form.

No `composition.*` method may directly mutate `app.doc`.

## C — Named Tool

Append exactly:

```text
19. use_ink
```

Existing 18 Named Tools remain the exact ordered prefix.

Canonical `use_ink` input:

```text
{
  action: "inspect" | "propose" | "approve" | "execute" | "cancel",
  plan?: INK-CHAT-CREATIVE-PLAN / 1,
  planId?: string,
  approvalToken?: string
}
```

Routing:

```text
inspect  → composition.inspect
propose  → composition.propose
approve  → composition.approve
execute  → composition.execute
cancel   → composition.cancel
```

Unknown action returns deterministic FAILED with:

`INK_USE_INK_ACTION_UNSUPPORTED`

The tool is facade/router only. No Document mutation logic belongs in `use_ink`.

## D — Capability Discovery

Change the existing `composition.programmable` descriptor from unavailable to available:

```text
availability = true
namedTool = use_ink
publicMethod = composition.propose
routingClass = PROPOSAL_REQUIRED
```

Descriptor must state:

- no arbitrary JS;
- proposal is mutation-neutral;
- execute requires explicit plan approval token;
- every step still passes bounded-edit validation;
- History and Revision behavior remains the existing Chat Creative Plan behavior;
- Preview remains a separate `get_ink_preview` action.

`external.transport` remains unavailable.

## E — v0.1 operation scope

Connector-004 validates the programmable bridge before expanding operation vocabulary.

Allowed plan step operations remain exactly:

```text
path.repaint.v1
path.material.apply.v1
path.material.remove.v1
object.translate.v1
path.simplify.v1
path.refine.v1
```

Do not add Boolean / Repeat / Group / Frame / Component / Layout / raw Path creation or arbitrary property-write operations in this Work Order.

These existing INK capabilities are reserved for a later bounded native-operation exposure stage behind the accepted `use_ink` architecture.

## F — Existing plan semantics must remain authoritative

Preserve:

- 2–32 steps;
- deterministic plan ID and stable step IDs;
- dependency graph validation;
- exact source Document / Revision / fingerprint checks;
- History idle requirement;
- explicit top-level approval;
- execute-before-approval rejection;
- ordered execution;
- stop remaining steps after failure;
- partial execution receipt;
- existing partial/final Revision capture;
- stale Revision rejection;
- no autonomous retry loop.

The existing Chat Creative Plan controller may continue its accepted per-step bounded-edit technical approval only after the explicit top-level plan approval gate is passed.

## G — Result envelope

All `composition.*` methods and `use_ink` return existing `INK_AGENT_RESULT / 1`.

Map real plan receipts into existing fields where available:

```text
status
targetRefs[]
createdRefs[]
changedRefs[]
historyReceipt
revisionReceipt
diagnostics[]
result
```

Do not fabricate refs/status. Keep the raw JSON-safe plan receipt under `result` when useful.

## H — Inspection

`composition.inspect()` must return bounded JSON-safe data from the existing Chat Creative Plan authority only. No live controller record/reference may escape.

At minimum expose plan ID, status, approval state, intent summary, step count/progress, and source Document/Revision identity when the existing authority provides them.

## I — Preview relationship

Expected closed loop:

```text
use_ink(propose)
→ explicit approval
→ use_ink(execute)
→ INK_AGENT_RESULT
→ get_ink_preview
→ visual inspection
→ next bounded plan if needed
```

No automatic Preview generation in Connector-004.

## J — Security boundary

Strictly prohibited:

```text
eval
Function constructor
dynamic import from user input
arbitrary app[method] dispatch
arbitrary property-path writes
raw Document JSON replacement
user-supplied callback/function
unregistered operation execution
unrestricted window/global bridge
MCP transport
postMessage transport
WebSocket transport
```

Every executable step remains inside the accepted bounded-edit allowlist.

## K — Canonical metadata authority

Connector-003 `capability-registry.js` remains the single metadata authority.

Expected:

```text
Named Tools = 19
composition.programmable = available
external.transport = unavailable
```

Do not maintain a second independent `use_ink` metadata table.

## L — Required QA

Focused QA must cover:

1. existing 18 tools remain exact prefix; total = 19;
2. `use_ink` appended exactly once;
3. `composition.programmable` available and mapped to `use_ink`;
4. `external.transport` still unavailable;
5. no eval / Function / arbitrary dispatch / direct Document write;
6. inspect/propose are mutation-neutral;
7. proposal identity/state matches direct Chat Creative Plan;
8. execute-before-approval rejected;
9. approve uses existing plan approval-token contract;
10. execute delegates to existing Chat Creative Plan;
11. unsupported step operation still rejected by bounded edit;
12. deterministic two-step execution order;
13. History behavior matches direct Chat Creative Plan;
14. Revision behavior matches direct Chat Creative Plan;
15. stale Revision blocks before mutation;
16. mid-plan failure stops remaining steps;
17. partial-success Revision behavior preserved;
18. cancel preserves existing semantics;
19. unknown action returns `INK_USE_INK_ACTION_UNSUPPORTED`;
20. canonical object input works through Named Tool and Public API;
21. result JSON-safe; no live refs/functions/binary;
22. no automatic Preview;
23. Connector-001/002/003 QA remain PASS;
24. Chat Creative Plan unit/source QA remain PASS;
25. bounded edit / History / Revision regressions remain PASS;
26. `FORMAT_VERSION = 4`;
27. Web / Portable share implementation.

## M — Runtime coordination

UI/main work remains a separate lane. Connector DEV must not rewrite UI or central Runtime queue.

```text
DEV = source + focused QA
DEV_HANDOFF → STOP
browser Runtime = MR exact-HEAD stage
```

## Explicit non-goals

- new geometry algorithm;
- new Boolean/Repeat engine;
- new Group/Frame/Component/Layout command exposure;
- arbitrary native-object mutation;
- external connector transport;
- Creative Library / Recipe / Workflow / Creative Session / Design Critic;
- automatic approval;
- autonomous agent loop;
- automatic Preview;
- UI redesign;
- Service Worker/bootstrap/cache changes;
- Document schema / FORMAT_VERSION change.

## Planned next — not authorized by Connector-004

```text
Native operation exposure
= Boolean / Repeat / Group / Frame / Component / Layout
  added behind accepted use_ink

Connector-005
= INK Skill / Capability Router

Connector-006
= Creative Library + Recipe

Connector-007
= Creative Session + reusable Workflow

Connector-008
= Design Critic / Fix

Final
= full creative closed loop
```

## MR bounded revision — browser feature coverage

```text
REVIEW_HEAD = adb994650c62ea7e917cb15af574545ab0d72d9a
SOURCE_REVIEW = PASS
EXACT_SHA_RUNTIME = PASS / REGRESSION ONLY
RUNTIME_RUN = 35968312192
RUNTIME_TESTED_SHA = adb994650c62ea7e917cb15af574545ab0d72d9a

BLOCKER =
  browser Runtime does not exercise use_ink / composition.*
  therefore target gate is not yet proven

MR = REVISE
PROMOTION = BLOCKED
```

### Revision scope

Stay on:

`work/ink-chat-connector-004`

Product source is frozen unless browser QA exposes a real defect.

Authorized:

```text
qa/runtime/ink-cloud-018-browser-harness.html
qa/runtime/run-ink-runtime-batch.mjs
qa/ink-chat-connector-004-use-ink-programmable-bridge.test.mjs   (only if needed)
research/INK_CHAT_CONNECTOR_004_USE_INK_PROGRAMMABLE_BRIDGE_REPORT_v0.1.md
ACTIVE/INK_DEV_PROGRESS.md
working/WORKING_STATUS.md
working/INK_CHAT_CONNECTOR_004_DEV_HANDOFF.md
```

Required new browser checks:

```text
USE_INK_TOOL_AVAILABLE
USE_INK_PROPOSE_MUTATION_NEUTRAL
USE_INK_EXECUTE_BLOCKED_BEFORE_APPROVAL
USE_INK_APPROVAL_TOKEN_ISSUED
USE_INK_TWO_STEP_EXECUTION_ORDERED
USE_INK_HISTORY_RECORDED
USE_INK_FINAL_REVISION_CAPTURED
USE_INK_UNSUPPORTED_ACTION_REJECTED
USE_INK_NO_AUTO_PREVIEW
```

Equivalent marker names are acceptable, but `run-ink-runtime-batch.mjs` must require them.

No new native operation families, external transport, UI changes, eval/arbitrary execution, or FORMAT_VERSION change.

Return:

`DEV_HANDOFF → STOP`.


## Gate

```text
DEV_AUTHORIZED
→ implement use_ink facade over existing Chat Creative Plan
→ focused QA + regressions
→ DEV_HANDOFF / STOP
→ MR exact-HEAD source review
→ MR exact-SHA Runtime
→ MR_PASS / MR_REVISE
```

Acceptance:

`INK_USE_INK_PROGRAMMABLE_BRIDGE_WORKS`
