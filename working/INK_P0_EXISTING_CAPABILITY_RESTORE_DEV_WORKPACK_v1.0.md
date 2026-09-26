# INK P0 Existing Capability Restore DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV`

TASK: `INK-P0-RESTORE-ALL-001`

OWNER: `MR / MAIN REVIEW`

BRANCH: `work/ink-p0-restore-all-001`

BASELINE: `b68a0a9fe1e0e65e30f6f2a691e8b60b15186c46`

AUTHORITATIVE BASIS:
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `ACTIVE/INK_FULL_PRODUCT_CAPABILITY_REBASELINE_PLAN_v1.0.md`

## Goal

Restore/reconcile **all existing INK P0 capabilities** listed in Section 4 of the rebaseline plan to their accepted historical/current scope before any rebaseline integrated Runtime.

## Authorized scope

DEV may:
- inspect original/current product source and QA evidence;
- modify `product/source/` as needed to restore existing P0 behavior only;
- restore missing/broken native wiring;
- repair History/save-load/integrity participation needed for existing capabilities;
- add/update focused unit/static/non-integrated QA for restored existing capabilities;
- update branch-local progress and handoff evidence.

## Forbidden

- NO integrated/browser Runtime.
- NO Runtime queue submission.
- NO P1/P2 Photoshop gap implementation.
- NO new product capability beyond existing P0 restoration.
- NO UI rebuild / final UI placement work.
- NO FORMAT_VERSION/product-version change unless MR explicitly reauthorizes.
- NO promotion / merge main / package / release.
- NO autonomous next task.

## Required restoration families

Use Section 4 as the complete authority. At minimum the handoff must explicitly cover:
- Drawing / Brush / Natural Media / Stylus
- Raster / Image
- Mask / Adjustment / Filter / Blend / existing Layer Effects scope
- Vector / Path / Boolean / Transform / Deformation
- Page / Layer / Selection / Align / Smart Snap
- Document / History / Revision / Provenance
- Storage / Recovery
- Render / GPU / Tile / Export
- Material / Recompute / Recipe / Program Import
- Reference / Extraction
- Components / Layout / Repeat
- existing CHAT / Creative Library / Memory / Research accepted scope

No Section 4 row may silently disappear.

## DEV evidence before handoff

DEV must leave:
1. branch-local `ACTIVE/INK_DEV_PROGRESS.md`;
2. a capability restoration ledger mapping every Section 4 row to:
   - existing source authority;
   - restoration/change made, if any;
   - History status;
   - save/load status;
   - focused QA;
   - remaining gap;
3. exact changed-file list;
4. focused/unit/static QA results;
5. explicit count:
   `UNRESOLVED_EXISTING_CAPABILITY_LOSS = <N>`

Target for handoff:
`UNRESOLVED_EXISTING_CAPABILITY_LOSS = 0`

## Stop gate

When implementation + focused non-runtime QA is complete:

```text
DEV_HANDOFF
→ MR_REVIEW_REQUIRED
→ STOP
```

DEV must NOT run the first rebaseline Runtime. Runtime authorization belongs to MR only after reviewing the complete restore-all handoff.
