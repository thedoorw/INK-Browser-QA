# INK UI Current-Main Recovery — Supervisor Review 2026-10-02

STATUS: ACCEPTED / C04 ENTRY RELEASED / NOT USER VISUAL PASS

Repository: `thedoorw/INK-Browser-QA`

Branch:
`work/ink-ui-current-main-recovery-001`

Recovery base:
`0ad0c663597f4373b5815364c5a9d7cae40365b4`

Immutable product candidate:
`cdb90787b8a17729a67e6318ded6557fee5b730f`

Branch final HEAD:
`8f1666804058caf9b968d51137967c61fd9cc222`

Product/source tree:
`86bdf0eacebb6f930062d9d2c1bb9b048b9fc7ca`

## 1. Scope review

The product mutation is limited to the accepted current-main UI recovery package:

- existing `#workspaceSwitch` rehomed into `#contextualOptions`;
- one fixed-right switch relation after the flexible contextual host;
- eleven per-menu fixed width authorities removed;
- one shared 8 px application-menu trigger inset retained;
- competing global `scrollbar-color` authority removed;
- existing shared WebKit scrollbar primitive retained;
- delivery/cache identity advanced only for the recovered product bytes.

Changed product files:
- `product/source/index-standalone.html`
- `product/source/index.html`
- `product/source/service-worker.js`
- `product/source/shell.template.html`
- `product/source/src/config.js`
- `product/source/styles.css`

No `product/source/src/ink.js` mutation occurs in the recovery candidate.

No C04 state repair, C06 zoom expansion, New Document/A4 redesign, History semantic mutation or FORMAT_VERSION change is present.

## 2. Evidence completion

Final DEV return:
- `working/INK_UI_CURRENT_MAIN_RECOVERY_FINAL_DEV_RETURN_20261002.md`

Fresh evidence root:
- `qa/evidence/ui-recovery-complete-20261002/`

Supervisor checked the fresh visual evidence for:
- 1280×1024 no-document;
- 1280×1024 document / Brush;
- 960×800 document / Brush;
- current Properties state.

The recovered workspace switch is visibly present at the far right of the Options Bar in the reviewed states. Menu rhythm is no longer based on the old eleven fixed-width authorities. The rectangular panel scrollbar treatment is present in overflow evidence.

Browser/source identity records report exact candidate byte matches for the loaded HTML/CSS and sampled runtime files. Exercised browser logs contain no product-origin error/warning entries.

## 3. Numeric/state review

Accepted recovered geometry:
- `workspaceSwitch` count = 1 per delivery/template;
- parent = `contextualOptions`;
- switch right edge = 1271 px at 1280 viewport;
- switch right edge = 951 px at 960 viewport;
- switch/context-host gap = 6 px;
- no overlap in Brush/Text/Lasso evidence;
- all 11 menu triggers use 8 px inline padding;
- menu width follows label content;
- shared scrollbar width = 12 px;
- rendered thumb geometry remains rectilinear;
- `scrollbar-color = auto` on sampled overflowing owners.

C04 functional behavior remains intentionally unaccepted in this package.

## 4. Technical-debt guard

Verified return:

```text
NEW_IMPORTANT_COUNT = 0 / 103 → 103
NEW_BREAKPOINT_FAMILY = 0
NEW_DUPLICATE_UI_STATE_AUTHORITY = 0
PER_MENU_WIDTH_AUTHORITY_COUNT = 0 / 11 → 0
GLOBAL_SCROLLBAR_COLOR_COUNT = 0 / 1 → 0
WORKSPACE_SWITCH_NODE_COUNT = 1 per template/delivery
SUPERSEDED_RULES_REMOVED = YES
FORMAT_VERSION = 4
```

The recovery removes obsolete authority rather than adding another override layer.

## 5. Separate defect discovered during evidence

The Properties panel has a real pre-existing layout/clipping defect:

- the main Properties scroll owner reports no overflow;
- several child cards are internally clipped because their flex/overflow geometry compresses content;
- this means absence of a Properties scrollbar in the tested state is not a scrollbar-recovery failure.

Disposition:

```text
PROPERTIES_LAYOUT_CLIPPING = OPEN / SEPARATE UI DEFECT
RECOVERY_SCOPE_REGRESSION = NO
DO_NOT_PATCH_INSIDE_C04
```

This must be queued after the bounded recovery/C04 chain or in a separately authorized UI package.

## 6. Main movement after branch base

Current main is 59 commits ahead of the recovery base, but comparison shows:

```text
PRODUCT_SOURCE_CHANGES_AFTER_0ad0c663_ON_MAIN = NONE
```

Those main movements therefore do not invalidate the tested recovery product composition. Final combined promotion must still integrate onto latest main rather than moving the recovery branch wholesale.

## 7. Supervisor disposition

```text
RECOVERY_IMPLEMENTATION = ACCEPTED
RECOVERY_EVIDENCE = ACCEPTED
RECOVERY_TECH_DEBT_GUARD = ACCEPTED
RECOVERY_CANDIDATE = cdb90787b8a17729a67e6318ded6557fee5b730f
RECOVERY_BRANCH_HEAD = 8f1666804058caf9b968d51137967c61fd9cc222
USER_VISUAL_PASS = NOT CLAIMED
FINAL_UI_COMPLETE = NO
C04_ENTRY = RELEASED
```

Next:
- execute `ACTIVE/INK_C04_WORKSPACE_TWO_STATE_REPAIR_DEV_DISPATCH_v1.0.md`;
- create the C04 branch from the accepted recovery candidate/product composition;
- repair only the existing workspace authority;
- STOP to Core / Supervisor review;
- do not merge recovery to main as a placement-only intermediate deployment.

C06 12800% zoom, Properties clipping and New Document remain separate work.
