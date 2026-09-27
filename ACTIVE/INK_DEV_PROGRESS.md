# INK DEV Progress

TASK: `INK-P1-E-ADVANCED-SELECTION-001`

BRANCH: `work/ink-p1-e-advanced-selection-001`

BASELINE_MAIN: `e932003795a19f286327b63a6c6b9af6970014e6`

PRODUCT_BASELINE_MAIN: `206f027785c04e56e91293e439fef8fb0cdd8521`

STATUS: `MODULE_READY / DEV_HANDOFF / STOP_FOR_MR`

WORKPACK:
`working/INK_P1_E_ADVANCED_SELECTION_DEV_WORKPACK_v1.0.md`

AUTHORITY:
`product/source/src/image/raster-selection-tools.js`

UPSTREAM:
- `P1-A = MODULE_READY / MR_PASS / PROMOTED`
- `P1-B = MODULE_READY / MR_PASS / PROMOTED`
- `P1-C = MODULE_READY / MR_PASS / PROMOTED`
- `P1-D = MODULE_READY / MR_PASS / PROMOTED`

RUNTIME: `NOT RUN / PROHIBITED UNTIL ALL P1 A-H + INTEGRATION CLOSE`

## P1-E completion

| Capability | DEV result |
|---|---|
| Magnetic Lasso Core | COMPLETE |
| Object Selection Core | COMPLETE |

### Magnetic Lasso Core

Implemented in the existing P1-A raster-selection authority.

Bounded behavior:
- deterministic alpha-aware finite-difference edge evidence;
- bounded anchor-segment corridor;
- deterministic 8-neighbor shortest-path search with fixed tie-breaking;
- edge preference plus path-continuity penalty;
- hard work limit;
- closed-lasso raster fill;
- resolved path and per-segment evidence in metadata;
- deterministic straight raster fallback when edge evidence is below threshold.

### Object Selection Core

Implemented in the same P1-A raster-selection authority.

Bounded behavior:
- rectangle or polygon ROI;
- alpha-aware/background-contrast candidate evidence;
- deterministic connected components;
- explicit-seed component preference with bounded seed-color fallback;
- deterministic unseeded component ranking;
- pixels outside ROI always remain unselected;
- hard work limit;
- bounded confidence/evidence metadata;
- predictable empty result on insufficient unseeded evidence.

No ML/network/semantic object recognition was added.

## Implementation commits

```text
P1-E Core implementation = e8cd2b84b9f18135160ddebf0514d3711d00d908
P1-E focused QA        = 7e4aac8569c5481697d58273451d6a4000481565
IMPLEMENTATION_HEAD_BEFORE_HANDOFF_DOC = 7e4aac8569c5481697d58273451d6a4000481565
```

## DEV changed files

Product:
- `product/source/src/image/raster-selection-tools.js`

Focused QA:
- `qa/ink-p1-e-advanced-selection.test.mjs`

Handoff/progress:
- `ACTIVE/INK_DEV_PROGRESS.md`

No `raster-selection-edge.js` helper was required.

## Exact blobs

```text
P1-A authority before P1-E = 181fafbabff7d71e05015e8479a664880291551d
P1-E authority final       = 818c2674d402f13b5efb12c2f99672e7309ab9f6
P1-E focused QA            = dda2ebf7d342b7bbb7c996038192354de18365b5
```

## Focused QA

Checked-in QA imports:
`../product/source/src/image/raster-selection-tools.js`

Command:
```text
node --test qa/ink-p1-e-advanced-selection.test.mjs
```

Result:
```text
P1_E_FOCUSED_QA = PASS
TESTS = 25
PASS = 25
FAIL = 0
SKIP = 0
```

Exact-blob verification before execution:
```text
git hash-object product/source/src/image/raster-selection-tools.js
= 818c2674d402f13b5efb12c2f99672e7309ab9f6

git hash-object qa/ink-p1-e-advanced-selection.test.mjs
= dda2ebf7d342b7bbb7c996038192354de18365b5
```

Coverage includes:
- Magnetic Lasso high-contrast attraction, raster bounds, closed selection, alpha edge evidence, corridor radius, deterministic fallback/tie-breaking, hard work guard and repeat determinism;
- Object Selection transparent/opaque separation, color contrast, ROI exclusion, explicit seed, deterministic unseeded ranking, alpha awareness, polygon ROI, insufficient evidence, hard work guard and deterministic confidence evidence;
- P1-A-compatible output shape, `refineRasterSelection()` composition, Polygonal Lasso / Quick Selection preservation, source immutability and bounded seed validation.

## Bounded limitations

- Magnetic Lasso is a deterministic classical raster edge follower; it is not Photoshop visual-parity edge intelligence or semantic contour recognition.
- Magnetic paths operate on integer raster-grid nodes and remain limited to the configured corridor.
- Open Magnetic Lasso returns the resolved path pixels; closed mode produces the region selection.
- Object Selection is classical ROI segmentation using boundary/background contrast, alpha separation, edge evidence and connected-component ranking; it does not claim semantic identity.
- Low-contrast objects similar to the ROI boundary/background may return an empty low-confidence result unless an explicit seed provides bounded evidence.
- Highly textured backgrounds or foreground touching most ROI boundaries can reduce unseeded separation quality.
- UI interaction, History, persistence, save/load, migration and final integration remain deferred by the workpack.

## Scope confirmation

```text
UI changes = 0
CHAT changes = 0
Recipe changes = 0
FORMAT_VERSION change = 0
History/save-load integration = 0
studio-core.js changes = 0
ink.js changes = 0
editor/selection.js changes = 0
second Selection authority = 0
second Mask authority = 0
ML/network segmentation = 0
P1-F/G/H scope intrusion = 0
Runtime = NOT RUN
```

## Handoff

```text
PRODUCT_SOURCE_CHANGES = 1 authority file
FOCUSED_QA = PASS / 25 of 25
DEV_HANDOFF = YES
NEXT_OWNER = MR
DEV_ACTION = STOP
```

DEV stops here for MR review.
