# INK UI Normalization Technical-Debt Cleanup — Supervisor Review

STATUS: ACCEPTED_FOR_BOUNDED_CLEANUP_ONLY
DATE: 2026-10-02
CANDIDATE: f7e387c2977b3c69c160356bd368b4f387c602c2
BASE PRODUCT: c90df990cddedc7d7d7692b88200985a8b50d5aa
DISPATCH: ACTIVE/INK_UI_NORMALIZATION_TECH_DEBT_CLEANUP_DEV_DISPATCH_v1.0.md

## Independent review

The product mutation is limited to `product/source/styles.css`.

Confirmed:
- no JS/HTML/product-state mutation;
- `!important` remains 104 → 104; no new `!important`;
- breakpoint family set unchanged;
- no routing/state authority changes;
- covered duplicate exact-selector definitions in identical context are reported as 96 → 0 and spot-checks of the final source confirm the targeted families were consolidated rather than patched later;
- obsolete left-only `.tool-layout-toggle svg { width:9px; height:8px }` is gone;
- both left/right collapse SVGs resolve to the shared 7×5 px primitive;
- Tools foreground/background swatches resolve to one shared 18×18 px primitive in both dual and single layouts;
- panel tabs retain the shared 28 px grammar;
- current rendered states are materially preserved; the intended visible delta is the corrected left collapse glyph;
- sampled Layers, Edit, Preferences, Reference overflow and splitter behavior evidence show no cleanup regression.

## Correction to prior Supervisor finding

The prior `SUP-04` finding that single-column swatches had been shrunk was a visual inference and was incorrect.

Fresh numeric evidence shows the baseline candidate already used 18×18 px swatches in both Tools layouts. Any remaining Photoshop mismatch in that cluster must be reviewed as optical placement/composition, not primitive size.

## Remaining open issues

Not part of this cleanup:
- SUP-01 Specialist / Adjustments panel-state identity;
- SUP-02 Reference expanded-state content;
- full contextual Options / Capability → UI Exposure;
- remaining USER visual Photoshop deltas.

## Result

```text
BOUNDED_TECH_DEBT_CLEANUP = ACCEPTED
OVERALL_NORMALIZATION = STILL UNDER REVIEW
PHOTOSHOP_FIDELITY = NOT CLAIMED
CAPABILITY_BATCH_B = NOT AUTHORIZED BY THIS REVIEW
```
