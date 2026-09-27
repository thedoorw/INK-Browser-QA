# INK P1-H MR Review v1.0

STATUS: `MR_REVISE / QA_ONLY_BOUNDED_CORRECTION_REQUIRED / CORE_SEMANTICS_PASS`

TASK: `INK-P1-H-FORMAT-INTEROPERABILITY-001`

REVIEWED_BRANCH: `work/ink-p1-h-format-interoperability-001`

FIRST_REVIEWED_HEAD: `5c5481c8a93e9a1edea486237677f253c348b4a9`

CORRECTION_REVIEWED_HEAD: `61193d695c17bb7c59aee3bf3f736662244e7510`

CORRECTION_COMMIT: `5ed7f3a8506b25156be12e8a91df0a4bbf5e1546`

DATE: 2026-09-27

## Re-review verdict

```text
P1_H_SCOPE = PASS
P1_H_AUTHORITY_ISOLATION = PASS
P1_H_DEPENDENCY_BOUNDARY = PASS
P1_H_EXR_ADDITIONAL_CHANNEL_SEMANTICS = PASS
P1_H_TIFF_EXTRASAMPLES_SEMANTICS = PASS
P1_H_FOCUSED_QA_REPORTED = PASS 54/54
P1_H_REQUIRED_MULTIPLE_EXTRA_FIXTURE = MISSING
P1_H_MODULE_READY = NO
PROMOTION = BLOCKED
RUNTIME = NOT RUN
```

The two original Core blockers are corrected.

## Correction scope verification

Previous reviewed HEAD `5c5481c8a93e9a1edea486237677f253c348b4a9` → correction handoff changes only:

- `product/source/src/image/formats/normalized-payload.js`
- `product/source/src/image/formats/exr.js`
- `product/source/src/image/formats/tiff.js`
- `qa/fixtures/p1-h/fixtures.mjs`
- `qa/ink-p1-h-format-interoperability.test.mjs`
- `working/INK_P1_H_DEV_PROGRESS.md`

No P1-G, P1-F, Document, Renderer, History, UI, FORMAT_VERSION, Integration or Runtime mutation was found.

Frozen P1-G authority blobs still match current main:
- color-management-core = `5e56e219e964912e85c68b644004f1b5c14dcbef`
- channel-core = `c3d5540f97af3c9fec94e6ac2a3e9b9053aa8bc1`

## Original blocker 1 — EXR additional channels

RESOLVED.

Current EXR decode:
- keeps true `A` as alpha;
- keeps non-R/G/B/A channels in a distinct `additionalChannels` payload;
- preserves descriptors/metadata;
- does not inject arbitrary channels into P1-G alpha/spot semantics;
- explicitly rejects encode when additional channels cannot be faithfully emitted.

The new `Z` fixture verifies it is not alpha/spot and retains sample data.

## Original blocker 2 — TIFF ExtraSamples

RESOLVED at Core semantics level.

Current TIFF decode:
- `ExtraSamples=0` → unspecified additional channel, not alpha;
- `ExtraSamples=1` → associated alpha, normalized to INK straight-alpha raster semantics;
- `ExtraSamples=2` → unassociated alpha;
- unsupported ExtraSamples values → explicit rejection;
- more than one alpha semantic → explicit rejection;
- unsupported additional-channel encode → explicit rejection rather than silent data loss.

Focused QA includes distinct tests for 0 / 1 / 2 semantics.

## Remaining QA-only blocker

The prior MR correction authorization explicitly required:

```text
TIFF multiple extras where bounded
```

The corrected implementation supports a bounded multiple-extra case, but the checked-in QA still contains no deterministic fixture where multiple extra samples coexist.

Required final correction:

1. add one deterministic TIFF fixture with multiple extras in the same image, preferably:
   - one `ExtraSamples=0` unspecified data channel; and
   - one `ExtraSamples=2` unassociated alpha;
2. assert:
   - unspecified extra remains in `additionalChannels`;
   - alpha remains the sole raster alpha;
   - sample ordering/data are not cross-wired;
   - metadata records both ExtraSamples values in order;
3. rerun the full P1-H QA with fail=0 / skip=0;
4. update lane progress;
5. STOP for MR re-review.

This is a QA-only bounded correction unless the new fixture exposes a Core defect.

## Exact corrected blobs reviewed

```text
normalized-payload.js = 52b11f397c362b122a8cd800ab4487c5bb0f6d7f
exr.js               = 0a63bdfa5c3c00067221cd8ac09191108fb71bd0
tiff.js              = 871c3afb929d7cad6437c4dcd22ec2cd9818ac31
fixtures.mjs          = c37ea00dcc216f9b573b0ddfaf1b0f94d93ffae9
focused QA            = 226ab9caa910bcd07583da58ef7f6ff679163411
```

DEV reported:
```text
tests = 54
pass = 54
fail = 0
skip = 0
```

MR reviewed the exact GitHub source and QA blobs. MR does not claim an independent second Node run.

## Current-main divergence

Current main has advanced beyond the P1-H branch baseline.

Promotion remains an MR-controlled reconcile/merge after final PASS. No DEV rebase/force-push is authorized.
