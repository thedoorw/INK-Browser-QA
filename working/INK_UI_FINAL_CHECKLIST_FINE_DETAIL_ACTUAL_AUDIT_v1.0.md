# INK UI Final Checklist — Fine Detail Actual Audit v1.0

STATUS: `PARTIAL_IMPLEMENTATION_AUDIT / ITEM_SPECIFIC / NO_PRODUCT_MUTATION`

TASK: `INK-UI-FINAL-CHECKLIST-CLOSURE-001`
EXACT_CURRENT_PRODUCT: `306ff4e5364eeebe66fd811f5d93693bc96a3575`

This table applies the contract from `working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md §25`.
Unresolved fine-detail families remain open; no missing target is replaced by an invented Photoshop number.

| Checklist | Component | Field | Target | Actual | Evidence | Result |
|---|---|---|---|---|---|---|
| AJ10 | Scrollbar | geometry | Photoshop reference track = 16 px; thumb length elastic | WebKit width/height = 16 px; tokenized track/thumb; real Layers scrolling exercised | `working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md`; `qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json` | PASS |
| AJ12 | Navigator | drag cursor | semantic grab → grabbing | `.shell-navigator-proxy{cursor:grab}`; `.dragging{cursor:grabbing}` | `working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md`; `product/source/styles.css` | PASS |
| AJ12 | Panel width | resize cursor | semantic horizontal resize | `ew-resize` | `product/source/styles.css`; existing panel resize browser checks | PASS |
| AJ12 | Panel stack | splitter cursor | semantic vertical resize | `ns-resize` | `product/source/styles.css`; PR93 targeted browser report records splitter cursor `ns-resize` after drag | PASS |
| AJ16 | Panel options | trigger/commands | compact consistent header trigger; no dead trigger; panel-local commands only | shared `.panel-options-trigger`; menu = reset width + close | `product/source/web-shell.js`; R3 AH06 closure | PASS |
| AJ16 | Panel options | menu item geometry | compact Photoshop-like popup; observed menu pitch ≈19–20 px | item height = 20 px; browser item = 156×20 px in both required viewports | `product/source/styles.css`; PR93 targeted browser report | PASS |
| AJ16 | Panel options | hover/focus | shared popup grammar | hover/focus both resolve to semantic `--ink-ui-control-hover`; browser confirms both | PR93 targeted browser report | PASS |
| AJ22 | Motion | ordinary transitions | minimal workstation presentation motion | interactive presentation transitions are short (primarily 0.1–0.22 s); no motion is used as state authority | `product/source/styles.css` | PASS |
| AJ22 | Motion | reduced motion | animations/transitions disabled when requested | `@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}` | `product/source/styles.css`; `qa/ink-ui-final-checklist-css.test.mjs` static assertion | PASS |

## Still open in Fine Detail

`AJ01 AJ02 AJ03 AJ04 AJ05 AJ06 AJ07 AJ11 AJ13 AJ14 AJ15 AJ19 AJ20 AJ21 AJ24 AJ25 AJ26 AJ27`

These require broader component tables, visual/keyboard state evidence, or explicit final disposition of remaining reference fields.

## Ledger after this partial audit

```text
TOTAL = 592
PASS = 450
FAIL = 141
N_A = 1
UNREVIEWED = 0
OPEN = 141
USER_ACCEPTANCE = 10 / PENDING
UI_COMPLETE = HOLD
```

No product source changed. Central Runtime not run.
