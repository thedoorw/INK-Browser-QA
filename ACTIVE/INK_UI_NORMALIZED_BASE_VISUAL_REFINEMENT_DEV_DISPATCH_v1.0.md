# INK UI Normalized Base Visual Refinement — DEV Dispatch v1.0

STATUS: ACTIVE / USER-AUTHORIZED BOUNDED VISUAL REFINEMENT
DATE: 2026-10-02
OWNER: DIRECT UI DEV
PRODUCT: thedoorw/INK-Browser-QA
BASELINE: a17cf7d46c151744668cf42f55b15212fe758415

Read first:
1. `working/INK_UI_MICRO_MODULE_NORMALIZATION_SUPERVISOR_REVIEW_20261002.md`
2. `ACTIVE/INK_UI_MICRO_MODULE_GRAMMAR_v1.0.md`
3. `ACTIVE/INK_UI_PS_INSTANCE_DATASET_v1.0.md`
4. `ACTIVE/INK_UI_PS_ALIGNMENT_MASTER_GUIDE_v1.0.md`
5. `ACTIVE/INK_CURRENT_WORK_ORDER.md`

## Goal

Refine the accepted normalized base without reopening technical debt or expanding capability scope.

This pass is for visible micro-geometry and optical alignment only.

Required sequence:

```text
inspect current rendered rows / glyphs
→ apply shared primitive correction
→ remove any superseded local vertical/baseline nudge
→ re-render 1:1
→ verify same-class optical centers
→ STOP for USER review
```

## Scope

### VR-01 — Right-panel fixed-row optical vertical centering

Apply the shared `Fixed-height row optical centering` grammar to all visible fixed-height rows in the right panel stack.

At minimum inspect:
- panel tabs;
- Reference parameter rows;
- `結構分析 / 選用`;
- `研究 → 創作 / 唯讀`;
- Layers `透明度` row;
- Layers `鎖定` row;
- compact footer/tool rows;
- any right-aligned state text inside a fixed-height row.

Acceptance:

```text
ROW VISUAL CENTER
≈ TEXT VISIBLE-GLYPH CENTER
≈ ICON / CONTROL CENTER
≈ RIGHT-SIDE STATE TEXT CENTER
```

Rules:
- preserve the authoritative row height;
- prefer flex/grid `align-items:center`;
- use shared line-height tokens;
- do not fix one label with ad-hoc `top`, `translateY`, asymmetric padding or per-string offset;
- when CJK metrics appear high/low even though the box is centered, correct the row primitive rather than the individual label;
- same-class visible centers should agree within approximately ±1 px at the 1280×1024 reference render.

### VR-02 — Reference row rhythm normalization

Reference is visually cleaner but its row classes must read as one coherent panel system.

Normalize:
- parameter-row height/baseline;
- summary-row height/baseline;
- left label / right state text vertical center;
- control center relative to label center;
- inter-row spacing using the shared spacing rhythm.

Do not:
- reintroduce cards;
- reintroduce special color CTA treatment;
- bold ordinary labels;
- add explanatory engineering prose.

### VR-03 — Layers row optical alignment

Do not redesign Layers or add capabilities in this pass.

Only correct visible same-class alignment for existing:
- opacity row;
- lock row;
- layer rows;
- footer action row.

Verify:
- labels, slider/value, icons and state indicators share row center;
- current row density is preserved;
- no extra borders/cards are introduced.

### VR-04 — Window-control optical fidelity

Recheck top-right minimize / restore-maximize / close controls against the Photoshop reference raster.

Keep:
- current right-edge anchoring;
- vector implementation;
- current disabled/honest state semantics.

Correct only:
- optical glyph size;
- stroke/shape sharpness;
- horizontal/vertical centering;
- spacing between the three controls.

Do not substitute Unicode text glyphs.

### VR-05 — Collapse-control optical centering recheck

The shared 7×5 double-chevron primitive is authoritative.

Verify left and right collapse controls:
- use the same SVG primitive;
- same button box;
- same strip height;
- same visible vertical center;
- orientation differs only by direction/transform.

Do not reintroduce any left-only size override.

## Explicitly deferred / non-scope

### SUP-04 single-column Tools swatch

Do not claim or implement Photoshop fidelity for the single-column swatch scale without a valid Photoshop single-column reference.

Current status:
```text
DUAL_SWATCH = MEASURED / IMPLEMENTED
SINGLE_SWATCH = REFERENCE_MISSING / USER CHECKPOINT
```

No speculative resize in this pass.

### Capability → UI Exposure / Options Bar

Do not perform full Capability → UI Exposure Batch B here.

The currently sparse Options Bar is a known later task.

This pass may only preserve and align controls that already exist. It must not:
- enumerate all 496 atomics;
- add missing tool parameters;
- move capability ownership;
- create new parameter state.

### Other exclusions

Do not:
- add Photoshop-only fake features;
- redesign Navigator;
- redesign Layers architecture;
- reopen Edit menu IA unless a regression is found;
- change Core/History/FORMAT_VERSION;
- add new breakpoint families;
- add new `!important`;
- add one-off vertical-offset patches.

## Technical-debt guard

This pass must preserve the accepted cleanup state:

```text
NEW_IMPORTANT = 0
NEW_BREAKPOINT_FAMILY = 0
NEW_STATE_AUTHORITY = 0
NEW_DUPLICATE_COVERED_VISUAL_AUTHORITY = 0
NO_LOCAL_BASELINE_NUDGE_PATCH = TRUE
```

If a fix requires a new local override for one label/row, STOP and repair the shared primitive instead.

## Required evidence

Render at minimum:
- 1280×1024 full active document;
- right panel normal;
- Reference normal;
- Reference details;
- Layers normal;
- top-right window-control crop;
- left/right collapse-control crop.

Return:
- bounded commit SHA;
- changed files;
- before/after screenshots;
- row-center measurements for representative Reference and Layers rows;
- window-control glyph bounding boxes;
- left/right collapse glyph bounding boxes;
- before/after technical-debt counters.

## Acceptance boundary

DEV must not self-declare final Photoshop fidelity.

Required completion state:

```text
VISUAL_REFINEMENT_IMPLEMENTED
TECH_DEBT_GUARD_PRESERVED
USER_REVIEW_REQUIRED
CAPABILITY_BATCH_B_NOT_STARTED
```

STOP after evidence handoff.
