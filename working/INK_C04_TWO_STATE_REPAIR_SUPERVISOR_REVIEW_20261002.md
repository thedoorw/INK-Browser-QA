# INK C04 圖紙 / 手繪板 Two-State Repair — Supervisor Review 2026-10-02

STATUS: ACCEPTED / COMBINED PROMOTION RELEASED / NOT USER VISUAL PASS

Repository: `thedoorw/INK-Browser-QA`

Branch:
`work/c04-paper-freehand-two-state-repair-001`

Accepted recovery composition:
- UI recovery product candidate: `cdb90787b8a17729a67e6318ded6557fee5b730f`
- UI recovery branch HEAD: `8f1666804058caf9b968d51137967c61fd9cc222`

Exact C04 product candidate:
- candidate: `584e44ac75af294508440d8d4196c81942fff739`
- branch evidence HEAD: `d0b56db04630b4a9c41b50a7c54f25f3bd744bef`
- product/source tree: `5ccaac62ed85176d69e07a1b72b1cac20c507f87`
- FORMAT_VERSION: `4`

## 1. Scope review

The C04 product delta is bounded to the existing workspace authority and accepted delivery identity.

Changed product files from the accepted UI recovery product candidate:
- `product/source/src/ink.js`
- `product/source/src/config.js`
- `product/source/service-worker.js`
- `product/source/shell.template.html`
- `product/source/index.html`
- `product/source/index-standalone.html`

`styles.css`, workspace model modules, migration, renderer, History, spatial-index implementation, zoom ceiling and document schema are unchanged.

The substantive C04 source repair is in the existing `InkApp` workspace path:
1. `switchWorkspace()` no longer rewrites `creation` to `layout`.
2. `refreshWorkspaceUI()` no longer mutates the page back to Layout or fits the artboard while merely reading/refreshing state.

The existing `page.workspace` / `activateWorkspace()` / camera authority remains the sole workspace-state owner.

The New command now explicitly initializes its newly created page to Layout at the existing New-command boundary. This preserves the previous initial A4/Layout result after removal of the accidental `refreshWorkspaceUI()` coercion. It is not a New Document architecture redesign and does not change defaults, schema or migration.

Visible labels are reconciled to the USER-authoritative terminology:
- `手繪板` = Creation
- `圖紙` = Layout

No-document controls are disabled and neither state is visually pressed.

## 2. Evidence review

Branch-local return:
- `working/INK_C04_TWO_STATE_REPAIR_FINAL_DEV_RETURN_20261002.md`

Evidence root:
- `qa/evidence/c04-two-state-20261002/`
- `qa/evidence/c04-two-state-20261002/evidence-manifest.json`

Accepted scoped evidence:
- 49 / 49 captured-evidence checks;
- both workspace states;
- three repeated round trips;
- selection/content/History preservation;
- independent Layout / Creation cameras;
- per-page state restoration;
- autosave/reload restoration;
- no-document state;
- 1280 and 960 viewport evidence;
- 7 fetched deployed asset hashes matching the exact candidate;
- instantiated `switchWorkspace`, `refreshWorkspaceUI`, and `newDocument` method identities matching the exact candidate;
- existing artboard/output/workspace suite 8 / 8.

The early Navigator-plus attempt that did not zoom is explicitly excluded from success evidence. The accepted zoom/camera evidence uses the later native keyboard operation.

Observed browser warn/error records are extension-origin only; no product-origin warning/error is claimed in the exercised review windows.

## 3. State-authority review

Accepted state chain:

```text
workspace switch
→ InkApp.switchWorkspace()
→ activateWorkspace()
→ ensureWorkspace() / page.workspace
→ page.workspace.activeSpace + cameras
→ page.camera alias
→ app.dataset.space
→ refreshWorkspaceUI()
→ renderer
→ autosave / existing restore sanitizer
```

No parallel workspace variable, CSS active-state workaround, replacement renderer or schema authority is introduced.

## 4. Technical-debt guard

```text
NEW_IMPORTANT_COUNT = 0 / 103 → 103
NEW_BREAKPOINT_FAMILY = 0
NEW_DUPLICATE_WORKSPACE_STATE_AUTHORITY = 0
NEW_ONE_OFF_GRAY_LITERAL = 0
NEW_FAKE_AFFORDANCE = 0
SUPERSEDED_FORCED_STATE_RULES_REMOVED = YES / 2
CSS_BYTES_CHANGED = 0
FORMAT_VERSION = 4
```

The two stale `appVersion` assertions in the existing document test occur on both the unchanged recovery baseline and the C04 candidate. They are not a C04 regression and no assertion was weakened.

## 5. Boundaries retained

This acceptance does not include:
- C06 12800% zoom;
- Properties layout clipping;
- New Document / A4 architecture redesign;
- History redesign;
- unrelated Live CHAT exposure candidates;
- whole-UI Photoshop fidelity completion;
- USER visual acceptance.

## 6. Supervisor disposition

```text
C04_IMPLEMENTATION = ACCEPTED
C04_EVIDENCE = ACCEPTED
C04_TECH_DEBT_GUARD = ACCEPTED
C04_CORE_SUPERVISOR_REVIEW = ACCEPTED

ACCEPTED_C04_CANDIDATE = 584e44ac75af294508440d8d4196c81942fff739
ACCEPTED_PRODUCT_SOURCE_TREE = 5ccaac62ed85176d69e07a1b72b1cac20c507f87

COMBINED_RECOVERY_C04_PROMOTION = RELEASED
OFFICIAL_MAIN_PRODUCT_PROMOTION = NOT_YET_EXECUTED
USER_VISUAL_PASS = NOT_CLAIMED
FINAL_UI_COMPLETE = NO
```

Next:
- execute `ACTIVE/INK_UI_RECOVERY_C04_COMBINED_PROMOTION_DEV_DISPATCH_v1.0.md`;
- target latest main;
- do not merge either historical branch wholesale;
- promote only the already accepted combined product composition;
- require final `product/source` tree byte identity with `5ccaac62ed85176d69e07a1b72b1cac20c507f87`;
- verify focused browser state on the latest-main composition;
- then publish the USER-visible deployed checkpoint.

