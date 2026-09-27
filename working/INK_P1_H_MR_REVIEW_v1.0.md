# INK P1-H MR Review v1.0

STATUS: `MR_REVISE / P1_H_NOT_MODULE_READY / BOUNDED_CORRECTION_REQUIRED`

TASK: `INK-P1-H-FORMAT-INTEROPERABILITY-001`

REVIEWED_BRANCH: `work/ink-p1-h-format-interoperability-001`

REVIEWED_HEAD: `5c5481c8a93e9a1edea486237677f253c348b4a9`

IMPLEMENTATION_COMMIT: `b47ab6c67665355a0ec41b0bda7332fffc7f0d45`

DATE: 2026-09-27

## MR verdict

```text
P1_H_SCOPE = PASS
P1_H_AUTHORITY_ISOLATION = PASS
P1_H_DEPENDENCY_BOUNDARY = PASS
P1_H_FOCUSED_QA_REPORTED = PASS 48/48
P1_H_CHANNEL_SEMANTICS = REVISE
P1_H_MODULE_READY = NO
PROMOTION = BLOCKED
RUNTIME = NOT RUN
```

## Verified clean scope

Baseline `136ca9c961ff0f2e543e196e74a3ae0983faaf78` → handoff contains only:
- P1-H format Core additions;
- P1-H fixtures / focused QA;
- P1-H lane progress.

No P1-G / P1-F / image-core / Document / Renderer / History / CHAT / Recipe / FORMAT_VERSION / UI mutation was found.

Frozen P1-G authority blobs still match current main:
- color-management-core = `5e56e219e964912e85c68b644004f1b5c14dcbef`
- channel-core = `c3d5540f97af3c9fec94e6ac2a3e9b9053aa8bc1`

## Blocking finding 1 — EXR additional channels are misclassified

Current EXR decode collects every channel not named R/G/B/A into `extra`, then passes:

```text
alphaChannels: extra
```

The normalized payload converts every `alphaChannels` entry through P1-G `addAlphaChannel()`.

Therefore an EXR channel such as `Z` / custom data channel is semantically changed into an alpha channel.

This violates the P1-H contract requiring alpha/additional channel mapping through P1-G semantics without semantic fabrication.

## Blocking finding 2 — TIFF ExtraSamples semantics are not interpreted

Current TIFF path effectively does:

```text
extras = ExtraSamples tag values
alphaIndex = extras.length ? processChannelCount : null
```

and treats the first extra sample as alpha regardless of ExtraSamples value.

TIFF ExtraSamples distinguishes alpha from unspecified/non-alpha extra samples. Multiple extras are also possible.

Current behavior can therefore misclassify a non-alpha extra sample as alpha and ignore remaining extras.

## QA gap

The checked-in focused QA has:
- 48 test declarations;
- 0 skip tokens;
- EXR alpha fixture coverage;
- no explicit EXR additional/custom channel fixture;
- no TIFF non-alpha/multiple ExtraSamples semantics fixture.

The workpack explicitly required an EXR alpha/additional-channel fixture and P1-G channel-semantic convergence.

## Bounded correction authorization

DEV may continue on the same P1-H branch only for:

1. correct EXR non-R/G/B/A channel handling so arbitrary additional channels are not labeled alpha;
2. correct TIFF ExtraSamples interpretation so only actual alpha semantics map to alpha;
3. preserve unsupported/non-native additional-channel semantics explicitly when P1-G has no exact RGB auxiliary representation;
4. add deterministic fixtures for:
   - EXR custom/additional channel (for example Z);
   - TIFF non-alpha ExtraSamples;
   - TIFF multiple extras where bounded;
5. rerun full P1-H focused QA with fail=0 / skip=0;
6. update `working/INK_P1_H_DEV_PROGRESS.md`;
7. STOP for MR re-review.

Allowed source remains inside the original P1-H boundary.

Prohibited:
- P1-G Core mutation;
- P1-F mutation;
- image-core / Document / Renderer / History / UI;
- FORMAT_VERSION;
- Runtime;
- Integration.

## Environment note

MR attempted an independent exact-branch clone/run, but the isolated review container could not resolve github.com. MR therefore does not claim a second Node execution. Source/QA review was performed against the exact GitHub branch blobs and handoff HEAD.

## Current-main divergence

Current main has advanced beyond the P1-H baseline; the P1-H branch is behind current main.

Promotion must therefore use an MR-controlled reconcile/merge after P1-H passes re-review. Do not force-update or rebase the DEV branch merely to match main.
