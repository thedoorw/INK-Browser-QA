# INK UI REBUILD 001 — G7 Brand Contract Evidence

STATUS: `G7_BRAND_CONTRACT / HOLD_ASSET`

## Favicon authority

Web and Portable both use one dedicated favicon route:

`assets/favicon.svg?v=0.1`

Focused QA rejects favicon fallback to the visible-logo routes.

Therefore:

`FAVICON_AUTHORITY = 1 / SOURCE_PASS`

## Visible-logo routing

Web and Portable each expose the same single visible-logo asset route through `.brand-source-mark`.

Current route:

`assets/INK_MARK_SOURCE_W-300.jpg?v=0.1`

The route is used in two shell placements (application-menu mark and topbar brand), but the unique asset route count is one.

Focused QA now asserts route singularity without asserting that this JPG is the final approved brand asset.

The repository also contains `assets/ink-mark.svg`, but it is not referenced as the delivered visible shell mark or favicon.

## Asset approval boundary

The Work Order explicitly prohibits guessing the final visible-logo asset.

No repository evidence proves that the current JPG, the alternate SVG, or another file is the exact user-approved final visible logo.

Therefore DEV does not replace the visible logo and does not create a regression assertion that freezes the current JPG as the accepted final brand.

```text
VISIBLE_LOGO_ROUTE_SINGULARITY = PASS
VISIBLE_LOGO_EXACT_ASSET_APPROVAL = NOT_PROVEN
VISIBLE_LOGO_REPLACEMENT = 0
G7 = HOLD_ASSET
```

## Gate result

`G7_BRAND_CONTRACT = HOLD_ASSET`

This is an explicit evidence hold, not a source defect.

G8 Runtime / visual evidence must not be started by DEV under the current Work Order.

`DEV_HANDOFF → MR / USER ASSET AUTHORITY`
