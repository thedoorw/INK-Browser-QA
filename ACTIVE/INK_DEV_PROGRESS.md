# INK DEV PROGRESS

## MR_REVISE — G5_CSS_HEALTH_DELTA_ONLY — 2026-09-25

```text
MR_REVIEWED_HEAD = f574731b0e920950211f04177826b3ad2ce0157b
RESULT = MR_REVISE
BLOCKING_GATE = G5_CSS_SHELL_AUTHORITY

G0 = PASS
G1 = PASS
G2 = SOURCE_PASS
G3 = SOURCE_PASS
G4 = SOURCE_PASS
G5 = REVISE
G6 = PARTIAL / three-mode width taxonomy direction accepted
G7 = HOLD
G8 = HOLD
PHOTOSHOP_WORKSTATION_REBUILD = HOLD
```

Reason:

`!important` moved only `223 → 220`. This does not satisfy the Work Order requirement that cascade-war debt be materially reduced.

Authorized next delta only:

- continue on this branch;
- inspect remaining `!important` declarations on workstation/shell presentation surfaces;
- remove obsolete competing authorities rather than blindly deleting declarations;
- consolidate touched selectors so ordinary specificity/cascade is sufficient;
- preserve genuinely necessary exceptional `!important` only with evidence;
- update `working/INK_UI_REBUILD_001_G5_CSS_AUTHORITY_EVIDENCE.md` with exact before/after count and remaining semantic inventory;
- add/adjust focused QA so the cleanup contract cannot regress;
- no new final-override block;
- no frozen Core/Renderer/Document/History/Revision/Geometry/CHAT/persistence/FORMAT_VERSION mutation.

Acceptance:

```text
G5_IMPORTANT_REDUCTION = SUBSTANTIVE
TOUCHED_SHELL_CASCADE_WAR = 0
NEW_FINAL_OVERRIDE = 0
CORE_MUTATION = 0
FOCUSED_QA = PASS
```

After G5 passes locally, continue:

`G6 → G7 → focused QA → DEV_HANDOFF / STOP`

Do not start G8 Runtime and do not start Photoshop alignment. MR owns exact-HEAD review and G8.

---

STATUS: `INK-CHAT-CLOSED-LOOP-001 / DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

- Branch: `work/ink-chat-closed-loop-001`
- Starting exact HEAD: `2634e5481906c248ee3396bf83e2ddc7bb341cbe`
- Work Order upstream base: `9ab4a6b557628f8fcdd1b58312b219423c68fe34`
- Latest GitHub implementation checkpoint: `baa716942febdd4be0f16070799d215efb06c4f1`
- Handoff HEAD: subsequent evidence/progress commit, reported exactly in the DEV final response.
- Milestone: import facade + tool 20 + sequential smart browser proof + QA-only PNG materialization implemented.
- Product files: only `product/source/src/agent/public-creative-api.js` and `capability-registry.js`.
- QA files: `qa/ink-chat-closed-loop-001-smart-proof.test.mjs`, `qa/runtime/ink-cloud-018-browser-harness.html`, `qa/runtime/run-ink-runtime-batch.mjs`.
- Focused QA: 8/8 PASS on Node v24.19.0; existing reference handoff QA PASS.
- Full Connector 001–004 diagnostic run: 29/36 PASS, 7 FAIL. Four old exact-total assertions expect 19 instead of authorized 20. Three other failures reproduce on unchanged starting source (baseline 33/36 PASS). These tests are outside this Work Order's file allowlist and were not modified.
- Browser Runtime: NOT_RUN_BY_DEV; exact-SHA Windows self-hosted Runtime and CHAT image retrieval remain the MR gate, per Work Order I.
- Evidence report: `research/INK_CHAT_CLOSED_LOOP_001_SMART_PROOF_REPORT_v0.1.md`.
- Handoff: `working/INK_CHAT_CLOSED_LOOP_001_DEV_HANDOFF.md`.
- QA helper and harness EOF whitespace normalized after the implementation checkpoint; no semantic source changes.
- Current gate: `DEV_HANDOFF → STOP`. MR owns exact-SHA Runtime and real PNG retrieval.
- No Runtime queue, main, package, UI, transport, operation vocabulary or FORMAT_VERSION changes.

Read: README, AGENTS, 我說, ACTIVE README/Current Work Order/DEV New Window Start/branch-local Progress, Working Status, MR/DEV governance, development handoff, Windows Runtime standard, existing Reference Handoff/Public API/capability registry/output registry/preview/plan/History/Revision paths and focused QA.


## MR_REVISE / QA_BRIDGE_ONLY — realm-local output resolver loader

- Revision baseline: `2b3c2f79147b6122f5ac78ed47d19c9878522386`.
- Scope: QA-only resolver loader; product source frozen.
- Replaced iframe dynamic inline module text with deterministic same-origin external QA route `/__qa_smart_loop_resolver.js`.
- Route is available only to the Creative Runtime suite and contains one fixed resolver binding to `resolveInkOutputPayload(window.INK_APP, handleId)`.
- Loader executes in the INK iframe realm via `script.src`.
- Cleanup after after-preview: delete temporary QA global + remove script node + explicit harness assertion.
- Focused QA contract extended for route body, JavaScript content type, external loader, inline-code absence, cleanup and forbidden bridge primitive absence.
- Runtime: NOT_RUN_BY_DEV; exact-SHA Windows Runtime remains MR gate.
- Product transport / external transport / MCP / WebSocket / postMessage / eval / Function / alternate renderer / UI / native operation / FORMAT_VERSION changes: 0.
- Current gate: `DEV_HANDOFF → STOP`.


### Focused QA result

Connector-side static QA: **PASS**.

Verified against revision checkpoint `5637d54e308b994d30d1de59ee67c90557487a30`:

- revision diff contains only the six authorized QA/report/handoff/progress files;
- both frozen product source blob SHAs are unchanged from `2b3c2f79147b6122f5ac78ed47d19c9878522386`;
- no inline resolver module remains in the harness;
- loader uses `/__qa_smart_loop_resolver.js` through `script.src`;
- route is Creative-suite-only and preflighted;
- fixed resolver calls only `resolveInkOutputPayload(window.INK_APP, handleId)`;
- temporary QA global and module node are removed after materialization;
- new loader/resolver implementation contains no WebSocket, postMessage, eval or Function path.

No automatic workflow run was associated with that checkpoint. Browser Runtime remains unexecuted by DEV and is not claimed PASS.


### Final QA-bridge verification

Final code checkpoint: `7d8dbb20dd452d78fd9da029206ed9e97a8b8b12`.

Result: **PASS for the authorized QA-bridge revision scope**.

- exact revision diff: six QA/report/handoff/progress files only;
- frozen product blobs unchanged:
  - `public-creative-api.js` = `72111d866584c7c414cd0e4f061953038e23596a`;
  - `capability-registry.js` = `acb56063c3c8a26bcc0b92c9088786b77620bdf6`;
- external resolver route / iframe loader / cleanup contract: PASS;
- resolver route is Creative-suite-only and calls `resolveInkOutputPayload(window.INK_APP, handleId)` only;
- newly added route-regex literals received a direct Node parse/match smoke check: PASS;
- browser Runtime was not run by DEV and remains the MR exact-SHA gate.

`DEV_HANDOFF → STOP`.

## MR_REVISE / DIAGNOSTIC_ONLY — SMART_LOOP_PREVIEW_BEFORE_CAPTURED

- Runtime evidence supplied by MR: run `36006888089`; UI `106/106 PASS`; import PASS; decomposition PASS; stable refs PASS; failure at `SMART_LOOP_PREVIEW_BEFORE_CAPTURED`.
- Authorized change: assertion diagnostics only in `qa/runtime/ink-cloud-018-browser-harness.html`.
- Implementation checkpoint: `be77d526f963849924e91e2e6e30711207324229`.
- Assertion now reports `status`, `diagnostics`, `result`, `outputHandles`, and `previewOptions` on failure.
- Safe optional-length check prevents missing `outputHandles` from masking the intended assertion with a TypeError.
- `smartPreviewOptions` unchanged: `{scope:'content',maxDimension:960,background:true}`.
- Frozen product blob SHAs unchanged:
  - `public-creative-api.js` = `72111d866584c7c414cd0e4f061953038e23596a`;
  - `capability-registry.js` = `acb56063c3c8a26bcc0b92c9088786b77620bdf6`.
- Focused connector-side static QA: PASS.
- Product source / renderer / visual-feedback / output registry / resolver route / timeout / retry / external transport / UI / FORMAT_VERSION changes: 0.
- Runtime rerun: NOT_RUN_BY_DEV.
- Current gate: `DEV_HANDOFF → STOP`.


## MR_REVISE / PRODUCT_DEFECT_ONLY — content preview boundary rounding

- Runtime evidence supplied by MR: run `36009581263` attempt 2; UI PASS; Reference import PASS; Color + Line decomposition PASS; stable refs PASS; fail at `SMART_LOOP_PREVIEW_BEFORE_CAPTURED`.
- Diagnostic: `INK_PREVIEW_DIMENSION_LIMIT_EXCEEDED` with `{scope:'content',maxDimension:960,background:true}`.
- Revision baseline: `2a56b602af280fcc923a394d68accab755d0611f`.
- Product fix: `product/source/src/agent/visual-feedback.js` only.
- Content planning now uses the raw padded dimensions that `renderExportCanvas` also sizes with, and applies an epsilon-derived backoff only when `Math.ceil(baseDimension * scale)` would otherwise exceed requested `maxDimension` by floating rounding.
- Hard dimension / hard pixel assertions remain active and unchanged.
- Refs, output handles, renderer, `renderExportCanvas`, output registry, resolver route, timeout, retry, external transport, UI, native operation vocabulary and `FORMAT_VERSION` remain unchanged.
- Deterministic focused regression added in `qa/ink-chat-closed-loop-001-smart-proof.test.mjs` for `1302.370453 * (960 / 1302.370453) = 960.0000000000001`.
- Old result: `Math.ceil = 961`; corrected result: `960 × 478`.
- Focused connector-side QA: PASS; source/test syntax compile PASS; renderer formula alignment PASS.
- Browser Runtime rerun: NOT_RUN_BY_DEV.
- Current gate: `DEV_HANDOFF → STOP`.

## MR_REVISE / QA_ASSERTION_ONLY — SMART_LOOP_HISTORY_RECORDED

- Runtime diagnostic: run `36012548161`, tested SHA `20262d942c7a4d1a5ca03898856a2d7ddff9f5d6`, runner `DESKTOP-NSOQH69`.
- First fail: `SMART_LOOP_HISTORY_RECORDED`.
- MR classification: `QA_ASSERTION_SEMANTICS_MISMATCH`; `PRODUCT_RUNTIME_FAIL = NOT ESTABLISHED`; product source frozen.
- Removed the invalid requirement that repaint History `entry.objectIds` include the target Path ID.
- Revised acceptance:
  - exactly 2 smart execution History receipt steps;
  - each step increments undo count by exactly 1 and reports `CHAT repaint Path`;
  - `get_ink_history.status === COMPLETED`;
  - final two History entries are scoped `CHAT repaint Path` entries with `patchCount > 0`;
  - returned History has at least two applied/retained entries.
- Focused QA now explicitly prevents `objectIds` from becoming part of the smart History proof again.
- Code checkpoints:
  - `43ceec0af6b8acfd60e1f21b7cd1b756eda37174` — harness assertion correction;
  - `3901d2bd5cae0aba029170ca7cc943ec0df7fd86` — focused QA lock.
- Focused connector-side QA: PASS.
- Diff from Runtime tested SHA through code checkpoint: only the two authorized QA files.
- Frozen product blobs unchanged:
  - `visual-feedback.js` = `f24dbe4f231bdc8c1acb9c197e59485815f8dc22`;
  - `public-creative-api.js` = `72111d866584c7c414cd0e4f061953038e23596a`;
  - `capability-registry.js` = `acb56063c3c8a26bcc0b92c9088786b77620bdf6`.
- Windows Runtime: NOT_RERUN_BY_DEV.
- Current gate: `DEV_HANDOFF → STOP`.

## MR_REVISE / QA_ORDER_ISOLATION_ONLY

- Runtime evidence: run `36014703794`, tested SHA `b57a3471ceaaba915a296aa1fe46680ee3e44134`, runner `DESKTOP-NSOQH69`.
- Smart loop: `18 / 18 PASS`; smart proof accepted.
- First post-proof failure: `WORKSTATION_REVISION_UNAVAILABLE_STATE_EXPLICIT`.
- MR classification: `QA_STATE_ORDER_CONTAMINATION`; product Runtime fail not established; product source frozen.
- QA-only correction:
  - moved the real unavailable-state assertion before smart-loop Revision creation;
  - removed only the later invalid unavailable-state assumption;
  - preserved the later Revision panel open + baseline capture path;
  - preserved structure capture / compare / restore coverage;
  - preserved the smart-loop block byte-for-byte.
- Code checkpoints:
  - `9b00d832fa5e081233d7b8b6509cbc8428399172` — harness order isolation;
  - `213f96aea61fbfadd4e47d1213746d2ad29ce645` — focused ordering contract.
- Focused connector-side ordering QA: PASS.
- Product source / smart-loop logic / Revision system changes: 0.
- Windows Runtime rerun: NOT_RUN_BY_DEV.
- Current gate: `DEV_HANDOFF → STOP`.



## 2026-09-25 — INK-UI-REBUILD-001 technical-debt cleanup initialized

```text
TASK = INK-UI-REBUILD-001-TECH-DEBT-CLEANUP
BRANCH = work/ink-ui-rebuild-001-tech-debt-cleanup
G0_BASELINE_EVIDENCE = PASS
PRODUCT_UI_MUTATION = 0 at initialization
KNOWN_GOOD_PRODUCT_BASE = d6c28be13cddee0d83b9e7613b5498b06d1f7b0e
CORE = FROZEN
PHOTOSHOP_REBUILD = HOLD
```

UR preflight and bounded cleanup scope were imported unchanged from the audit branch.

Verified baseline metrics are recorded in:
`working/INK_UI_REBUILD_001_TECH_DEBT_BASELINE_EVIDENCE.md`

Next gate:
`G1 OBSOLETE_UI_QA_CONTRACTS`


## 2026-09-25 — UI debt cleanup G1

```text
G1_OBSOLETE_UI_QA_CONTRACTS = PASS
CHECKPOINT_SHA = a358a2f9e0071b4633031640c517f024aca0ed80
PRODUCT_UI_MUTATION = 0
OLD_JPG_FAVICON_ASSERTION = 0
REQUIRED_EDGE_PRESENTER_ASSERTION = 0
REQUIRED_LEGACY_INSPECTOR_OPENER = 0
REQUIRED_MOBILE_BOTTOM_DOCK_GRAMMAR = 0
UNCONDITIONAL_PASS = 0
```

Evidence:
`working/INK_UI_REBUILD_001_G1_QA_CONTRACT_EVIDENCE.md`

Next:
`G2_MENU_PANEL_AUTHORITY`


## 2026-09-25 — UI debt cleanup G2

```text
G2_MENU_PANEL_AUTHORITY = SOURCE_PASS
CHECKPOINT_SHA = c229e6ec15355aa6ca99a987105f5a90bce5d7c4
DOCK_SAME_ITEM = toggle → close
DOCK_DIFFERENT_ITEM = switch
WINDOW_ROUTE = same toggle authority
CONTEXTUAL_ADVANCED = navigation only
EDGE_PANEL_CONTROL = retired
APPLICATION_MENU_CONTROLLER = 1
LIVE_APP_MENUS = file / window
DEAD_MENU_LIVE_BUTTONS = 0
WEB_PORTABLE_PARITY = PASS
DUPLICATE_LITERAL_IDS = 0
CORE_MUTATION = 0
```

Evidence:
`working/INK_UI_REBUILD_001_G2_MENU_PANEL_EVIDENCE.md`

Next:
`G3_FIRST_PAINT_AUTHORITY`


## 2026-09-25 — UI debt cleanup G3

```text
G3_FIRST_PAINT_AUTHORITY = SOURCE_PASS
CHECKPOINT_SHA = 63a660c856a1d0019beafb184899671f704752cd
DELIVERED_WORKSTATION_STATE = explicit
CRITICAL_FIRST_PAINT = light / #e7e7e7
DARK_FIRST_PAINT_TOKEN = 0
SERVICE_WORKER_BUILD_ID = 20260925-ui-rebuild-001-g3-first-paint-r1
WEB_PORTABLE_PARITY = PASS
CORE_MUTATION = 0
```

Evidence:
`working/INK_UI_REBUILD_001_G3_FIRST_PAINT_EVIDENCE.md`

Fresh reload visual proof remains required at G8.

Next:
`G4_TYPOGRAPHY_AUTHORITY`


## 2026-09-25 — UI debt cleanup G4

```text
G4_TYPOGRAPHY_AUTHORITY = SOURCE_PASS
CHECKPOINT_SHA = dcbc8c086a7da4ae202cc2c78eca424befba347f
NORMAL_UI_FONT_AUTHORITY = 1 / --ui-font
MONO_DIAGNOSTIC_AUTHORITY = 1 / --ui-font-mono
SEMANTIC_SCALE = XS / SM / MD / LG / XL / DISPLAY
HARD_CODED_FONT_SIZE_DECLARATIONS = 0
DIRECT_FONT_STACKS = 0
GEORGIA = 0
LEGACY_FONT_VARIABLE = 0
CORE_MUTATION = 0
```

Evidence:
`working/INK_UI_REBUILD_001_G4_TYPOGRAPHY_EVIDENCE.md`

Next:
`G5_CSS_SHELL_AUTHORITY`


## 2026-09-25 — UI debt cleanup G5

```text
G5_CSS_SHELL_AUTHORITY = SOURCE_PASS
CHECKPOINT_SHA = 8d686989fd0c71c0f2319f93e73d72455c7388af
DESKTOP_CORE_SELECTOR_AUTHORITIES = 1 each
TOPBAR = 14 → 11
TOOL_RAIL = 9 → 6
INSPECTOR = 14 → 8
STAGE_WRAP = 18 → 4
STATUSBAR = 6 → 3
CONTROL_ROW = 12 → 6
INSPECTOR_TAB = 8 → 4
CREATIVE_WORKSPACE_PANEL = 12 → 3
IMPORTANT = 223 → 220
NEW_FINAL_OVERRIDE = 0
CORE_MUTATION = 0
```

Evidence:
`working/INK_UI_REBUILD_001_G5_CSS_AUTHORITY_EVIDENCE.md`

Next:
`G6_RESPONSIVE_AUTHORITY`
