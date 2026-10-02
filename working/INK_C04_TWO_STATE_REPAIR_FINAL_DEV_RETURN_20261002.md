# C04 圖紙 / 手繪板 — completed bounded return — 2026-10-02

STATUS: EVIDENCE_COMPLETE / STOP_TO_CORE_SUPERVISOR_REVIEW

Branch: `work/c04-paper-freehand-two-state-repair-001`.
Authoritative dispatch: `ACTIVE/INK_C04_WORKSPACE_TWO_STATE_REPAIR_DEV_DISPATCH_v1.0.md`.
Entry authority: main `633e52f504b1b086d4837dd10cdf2951b5b4b49a`, recovery accepted and C04 entry released.
Recovery composition/base: `8f1666804058caf9b968d51137967c61fd9cc222`.
Immutable product candidate: `584e44ac75af294508440d8d4196c81942fff739`.
Candidate full tree: `4aeeadff99e774159dfd0980d3e758b6f1c5491a`.
Candidate product/source tree: `5ccaac62ed85176d69e07a1b72b1cac20c507f87`.
Build identity: `20261002-c04-two-state-repair`.

## Result and boundary

Native switch clicks now select both existing workspace states. There is one existing page.workspace authority, two existing cameras, one primary switch, and unchanged Format Version 4. No replacement state variable, CSS active-state workaround or new renderer/schema is introduced.

Exactly two unwanted coercions were removed from src/ink.js:
1. switchWorkspace no longer rewrites requested creation to layout.
2. refreshWorkspaceUI no longer activates layout or fits artboard while reading state.

Native New still opens its existing A4 Layout view. Its former incidental initialization through refreshWorkspaceUI is now an explicit activateWorkspace(page, 'layout') at the same New command boundary. defaultDocument/defaultPage, A4 fields, schema, migration and New Document architecture are unchanged. This relocation preserves the old initial visible result while allowing restored documents/pages to retain Creation.

No-document buttons are disabled and neither appears pressed. Existing no-document input/render visibility guards remain intact. Labels use USER terminology 手繪板 / 圖紙; menu aliases retain their command IDs. The template produces both deliveries. Existing Build IDs are advanced together; service-worker behavior is unchanged.

Changed product files (only these six):
- product/source/src/ink.js
- product/source/src/config.js
- product/source/service-worker.js
- product/source/shell.template.html
- product/source/index.html
- product/source/index-standalone.html

styles.css, web-shell.js, document/workspace.js, migration, History, renderer, spatial index, zoom ceiling, defaultDocument/defaultPage and FORMAT_VERSION are byte-unchanged. C06, Properties clipping and New Document redesign remain separate. Product/source has not been promoted to main.

## Investigation chain

#workspaceSwitch native click -> existing InkApp.switchWorkspace -> activateWorkspace -> ensureWorkspace / normalizeWorkspace -> page.workspace.activeSpace and cameras -> page.camera alias -> app.dataset.space -> refreshWorkspaceUI -> existing renderer -> markDirty / native autosave -> existing sanitizer on restore.

normalizeWorkspace already admits both spaces; activateWorkspace saves the outgoing camera and aliases the incoming one. Migration already restores activeSpace and both cameras. The two coercions in InkApp were the blockers; no document-format change was necessary. Switching pages uses the existing switchPage/refreshAll route, which now renders the saved per-page mode instead of overwriting it.

## Fresh evidence

Evidence root: `qa/evidence/c04-two-state-20261002/`.
Manifest: `evidence-manifest.json` (byte lengths and SHA-256 for every capture/record).
Reproducible evidence verifier: `qa/runtime/verify-ink-c04-evidence.mjs`.

49/49 captured-evidence checks pass: 29 state/geometry records, 8 behavior/persistence checks, 7 deployed asset hashes, 3 executed-method identities, technical-debt guard and available browser error logs. These are scoped evidence checks, not 49 unrelated Core capability tests.

Native operations exercised:
- File > New -> A4 Layout;
- 手繪板 -> Creation and 圖紙 -> Layout;
- three repeated round trips;
- create/select a rectangle by native shape control and drag;
- switch with unchanged objects, selection and History undo/redo counts;
- native keyboard zoom -> Creation scale 1.44, with Layout scale 0.7581158810325477 retained; switch back restores each camera;
- native Pages Add -> second page, first Layout visit, page1 Creation restoration and page2 Layout restoration;
- native autosave and reload restore Layout and Creation, page ID, per-page state, cameras and content;
- 960x800 no-document, Layout, Creation and round trip.

Persistence evidence respects the real existing sanitizer: restore adds the canonical low-risk semantic metadata to the previously raw shape. The verifier predicts that addition through unchanged sanitizeDocument and compares the entire normalized content, rather than ignoring geometry/appearance or asserting raw JSON equality. Workspace/camera equality is exact. Normal switching compares raw content exactly.

The early attempted Navigator-plus coordinates produced no zoom and are not used as zoom proof (`1280-creation-zoomed` retains scale1). Actual zoom evidence is the later native keyboard operation. A stale Navigator target after automatic Properties activation was resolved by inspecting current UI. No failed operation is represented as successful evidence.

## Visual / same-class / numeric review

Reference: USER C04 terminology/behavior plus canonical Photoshop shell and shared grammar; Photoshop does not provide an equivalent native C04 state control. This is the authorized existing INK control, not an invented Photoshop capability.

Input exposure: the required Work Order, recovery conclusions and known source causes had been read. This is a delta-first, source-exposed implementation review; it is not claimed as a fully blind independent Supervisor review. The fresh baseline native Creation click stayed Layout. After repair, rendered paper vs full Creation surfaces are visibly different and agree with native state records. No previous PASS closes current evidence.

Same-class member set: both primary workspace buttons in no-document, Layout, Creation, selected-object, page-switch, restored and narrow states. Both share height22, width66.375, 12px font, 14.4px line height, padding0/6 and flex optical centering. Group height26/width136.75. Label-driven width grows from recovery112.5 without a CSS fork. The group remains at right edge1271 for1280 and951 for960 (9px inset), with a6px gap after the flexible context host. One node remains under contextualOptions. Pressed state is true only for the active authoritative space; neither is pressed when closed.

The screenshots cover stable states. The1280 outer cloud viewport is1363x936; app iframe is1280x1024, DPR1. Captures are native JPEGs; export raster1348x926 must not be mistaken for CSS pixels. Final Layout top/bottom pair covers application y0..1024 with overlap; restored Creation top/bottom pair does likewise. Lower capture outer scrollY138. The960x800 app is entirely visible in one native screenshot. No image composition, image generation or reconstructed screenshot was used. No native top-level1280 screenshot is claimed.

This closes the C04 switch/state evidence only. It does not close all Photoshop UI classes, unobserved reference states or USER acceptance. Properties clipping and other existing UI findings are not silently waived.

## Identity chain and browser errors

candidate584e44ac -> product/source tree5ccaac62 -> exact tree reused at main QA-only `qa/previews/c04-584e44ac/` -> browser build20261002-c04-two-state-repair -> fresh state/screenshot evidence.

QA publication commit: b2cb440c8dc8591bf13b5a0b3ebe525de90cd88e. Later QA-only identity-harness commits a5614d8772331ebedfafb0e1420aca42fcffc88d and0f1ce365fdcc621b7c7ae9a39eee93444b0f75ad leave official product/source unchanged. Concurrent live-test documentation is preserved.

Native test harness: https://thedoorw.github.io/INK-Browser-QA/qa/runtime/ink-c04-two-state-review.html
Immutable identity harness: https://thedoorw.github.io/INK-Browser-QA/qa/runtime/ink-c04-two-state-identity-a5614d.html
Product preview: https://thedoorw.github.io/INK-Browser-QA/qa/previews/c04-584e44ac/?fresh

7 browser-fetched deployed assets match exact candidate SHA-256: HTML, CSS, ink.js, config.js, web-shell.js, workspace.js and migration.js. The actually instantiated switchWorkspace, refreshWorkspaceUI and newDocument method sources also match exact candidate source/hashes. This strengthens the executed C04 identity beyond URL/build markers. Full transitive-module byte attestation and official-main product verification are not claimed.

Available review/identity browser logs contain50/12 warn/error entries, all extension-origin; no product-origin warn/error observed. This covers exercised windows, not every unexercised path.

## Technical-debt and required source checks

NEW_IMPORTANT_COUNT = 0 (103 -> 103)
NEW_BREAKPOINT_FAMILY = 0
NEW_DUPLICATE_WORKSPACE_STATE_AUTHORITY = 0
NEW_ONE_OFF_GRAY_LITERAL = 0
NEW_FAKE_AFFORDANCE = 0
SUPERSEDED_FORCED_STATE_RULES_REMOVED = YES (2)
SHARED_PRIMITIVES_USED = YES / existing switch and existing workspace model
CSS_BYTES_CHANGED = 0
FORMAT_VERSION = 4

Generator --check and ink.js syntax pass. Existing artboard/output/workspace model suite passes8/8. Existing document.test.mjs has the same2 stale appVersion assertions on both unchanged recovery base and candidate (expects1.6.0-RC, current product0.1); its integrity test passes. Tests are retained and no assertion is weakened. Baseline/candidate TAP logs are included.

## Gate

C04_IMPLEMENTATION = COMPLETE
REQUIRED_SCOPED_EVIDENCE = COMPLETE
C04_CORE_SUPERVISOR_ACCEPTANCE = PENDING
RECOVERY_PLUS_C04_PROMOTION = NOT_EXECUTED
USER_VISUAL_PASS = NOT_CLAIMED
FINAL_UI_COMPLETE = NO

STOP -> Core / Supervisor review of this exact candidate. A separate owning review must inspect the small Core-facing delta and fresh evidence; this implementation return is not independent acceptance. Do not merge recovery alone or promote C04 before that gate. Final combined promotion still targets latest main and requires integrated product identity/browser state. Remaining separate issues: Properties clipping, C06 12800%, New Document decision gate, and outstanding whole-UI fidelity/USER acceptance.
