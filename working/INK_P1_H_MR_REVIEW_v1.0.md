# INK P1-H MR Review v1.0

STATUS: `MR_PASS / P1_H_MODULE_READY / PROMOTED`

TASK: `INK-P1-H-FORMAT-INTEROPERABILITY-001`

REVIEWED_BRANCH: `work/ink-p1-h-format-interoperability-001`

FINAL_REVIEWED_HEAD: `89cb4d3569bd2ac0833627a415c2eeb6d58a0c00`

IMPLEMENTATION_COMMIT: `b47ab6c67665355a0ec41b0bda7332fffc7f0d45`

SEMANTICS_CORRECTION_COMMIT: `5ed7f3a8506b25156be12e8a91df0a4bbf5e1546`

QA_ONLY_COMMIT: `c1f3e258481a16153dba8d188491297992468a33`

DATE: 2026-09-27

## Final MR verdict

```text
P1_H_SCOPE = PASS
P1_H_AUTHORITY_ISOLATION = PASS
P1_H_DEPENDENCY_BOUNDARY = PASS
P1_H_EXR_ADDITIONAL_CHANNEL_SEMANTICS = PASS
P1_H_TIFF_EXTRASAMPLES_SEMANTICS = PASS
P1_H_MULTIPLE_EXTRASAMPLES_REGRESSION = PASS
P1_H_FOCUSED_QA_DECLARATIONS = 55
P1_H_SKIP_TOKENS = 0
P1_H_DEV_REPORTED_QA = PASS 55/55
P1_H_MODULE_READY = YES
PROMOTION = COMPLETE
RUNTIME = NOT RUN
```

## Final QA-only gate

The final QA-only delta from the prior reviewed HEAD `61193d695c17bb7c59aee3bf3f736662244e7510` contains only:

- `qa/fixtures/p1-h/fixtures.mjs`
- `qa/ink-p1-h-format-interoperability.test.mjs`
- `working/INK_P1_H_DEV_PROGRESS.md`

No P1-H Core file changed.

The added TIFF fixture contains:

```text
sample order = R, G, B, unspecified-extra, alpha
ExtraSamples = [0, 2]
pixel values = [10, 20, 30, 77, 128]
```

The regression test verifies:
- RGB process data remains `[10,20,30]`;
- unspecified extra remains a distinct additional channel;
- its sample index remains 3;
- its data remains `[77]`;
- raster alpha remains `[128]`;
- metadata preserves `ExtraSamples=[0,2]` in order;
- alpha association remains `unassociated`;
- P1-G normalized auxiliary layout contains exactly one alpha.

This closes the prior sample-ordering / cross-wire gate.

## Final exact QA blobs

```text
fixtures.mjs = caf052fd3c048b84701b250d0d4885129ef510b5
focused QA   = 1e2aefc020b6987a125cf60b468e88bafd7bc4b2
```

## Final Core blobs — unchanged by QA-only correction

```text
tiff.js                  = 871c3afb929d7cad6437c4dcd22ec2cd9818ac31
normalized-payload.js    = 52b11f397c362b122a8cd800ab4487c5bb0f6d7f
exr.js                   = 0a63bdfa5c3c00067221cd8ac09191108fb71bd0
color-management-core.js = 5e56e219e964912e85c68b644004f1b5c14dcbef
channel-core.js          = c3d5540f97af3c9fec94e6ac2a3e9b9053aa8bc1
```

## Format verdict

- PSD = PASS within bounded native parse/composite/flattened-export contract.
- PSB = PASS within bounded parse + explicit adapter-required export contract.
- TIFF = PASS within bounded classic TIFF / ExtraSamples / ICC / baseline encode contract.
- RAW = PASS as explicit approved decoder-adapter boundary; no fake Camera Raw engine.
- EXR = PASS within bounded single-part scanline HALF/FLOAT contract with explicit unsupported paths.

No perfect Adobe/OpenEXR parity is claimed.

## QA execution evidence

DEV reports:

```text
tests = 55
pass = 55
fail = 0
skip = 0
```

MR verified the exact checked-in QA has 55 test declarations and zero skip tokens, and reviewed the exact fixture/assertion source against the final handoff HEAD.

MR does not claim an independent second Node execution in this review environment.

## Promotion safety

Current main and P1-H branch are diverged because main advanced after the P1-H branch cut.

Therefore:
- do not force-update main;
- do not rebase/force-push the DEV branch;
- promotion must be an MR-controlled reconcile/merge preserving the reviewed P1-H payload.

Promotion completed through MR-controlled merge PR #73.

```text
P1_H = MODULE_READY / MR_PASS / PROMOTED
P1_H_PROMOTION_MERGE = 4eb9a8f18781840219217a7cc767ed73aebe3989
P1_INTEGRATION = BLOCKED_PENDING_P1_F
RUNTIME = PROHIBITED
```
