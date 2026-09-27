# INK DEV Progress

TASK: `INK-P1-B-LOCAL-RASTER-RETOUCH-001`

BRANCH: `work/ink-p1-b-local-raster-retouch-001`

BRANCH_BASE: `c96a89b0131081600b0f39ffcd0d00dc4951e1d4`

WORKPACK_BASELINE_MAIN: `c750b8f2803d87c369edcf9c320a531a32f92d62`

STATUS: `DEV_COMPLETE / MODULE_READY_HANDOFF / WAITING_MR`

WORKPACK:
`working/INK_P1_B_LOCAL_RASTER_RETOUCH_DEV_WORKPACK_v1.0.md`

UPSTREAM:
`P1-A = MODULE_READY / MR_PASS / PROMOTED`

RUNTIME: `PROHIBITED / NOT RUN`

UI_IMPLEMENTATION: `PROHIBITED / CHANGES_0`

CHAT_EXPANSION: `PROHIBITED / CHANGES_0`

FORMAT_VERSION_CHANGE: `PROHIBITED / CHANGES_0`

## Branch baseline note

The mandatory P1-B branch was initialized at
`c96a89b0131081600b0f39ffcd0d00dc4951e1d4`.

This commit is 4 governance/workpack commits ahead of the formal product baseline
`c750b8f2803d87c369edcf9c320a531a32f92d62`.

The intervening files are governance/review/workpack documents only; product source is unchanged across that delta.

## Capability completion

| Capability | Result | Core contract |
|---|---|---|
| Clone Stamp | COMPLETE | relative source-offset mapping; bounded brush; opacity; source/target edge clipping |
| Pattern Stamp | COMPLETE | external pattern raster; deterministic tiling/origin; bounded mask; opacity |
| Healing | COMPLETE | explicit source mapping; deterministic target-tone adaptation; target alpha preserved |
| Spot Healing | COMPLETE | bounded neighboring-pixel replacement; deterministic mean rule; empty-neighbor guard |
| Patch | COMPLETE | compatible source/target region mapping; clipping; opacity; optional feather |
| Dodge | COMPLETE | bounded local luminance increase; strength; alpha preserved |
| Burn | COMPLETE | bounded local luminance decrease; strength; alpha preserved |
| Sponge | COMPLETE | saturate/desaturate; strength; alpha preserved |
| Local Blur | COMPLETE | bounded box-kernel read from immutable source; outside pixels preserved |
| Local Sharpen | COMPLETE | bounded unsharp-style local sharpening; byte-clamped output; outside pixels preserved |
| Color Replacement Brush | COMPLETE | reuses P1-A color-distance authority; tolerance; strength; alpha preserved; luminance-normalized replacement |

## Shared authority

All 11 tools are implemented through one reusable local-raster authority:

- `createLocalRetouchMask`
- shared raster validation/clipping
- shared immutable output path
- shared opacity/strength semantics
- shared pixel read/write and blend helpers

P1-A authorities reused directly:

- `colorMatchesTolerance` from `raster-selection-tools.js`
- `normalizeRgba` from `raster-fill-tools.js`

No second raster/image/document authority was introduced.

## Changed files

Added:
- `product/source/src/image/raster-retouch-tools.js`
- `qa/ink-p1-b-local-raster-retouch.test.mjs`

Updated for handoff only:
- `ACTIVE/INK_DEV_PROGRESS.md`

No existing product source file was modified.

## Focused QA

```text
NODE_SYNTAX_CHECK = PASS
COMMAND = node --test qa/ink-p1-b-local-raster-retouch.test.mjs
P1_B_FOCUSED_QA = PASS
TESTS = 13 / 13 PASS
FAIL = 0
SKIP = 0
```

Coverage includes:

- Clone source→target exact mapping
- Clone source/target edge clipping
- Clone opacity and source immutability
- Pattern deterministic tile/origin mapping
- Healing structure transfer + target-tone adaptation + determinism
- Spot Healing bounded neighbor replacement + outside preservation
- Patch mapping + boundary clipping + invalid geometry guard
- Dodge luminance increase + alpha preservation
- Burn luminance decrease + alpha preservation
- Sponge saturation increase/decrease + alpha preservation
- Local Blur selected-only change using immutable source pass
- Local Sharpen selected-only change + byte bounds
- Color Replacement tolerance inclusion/exclusion
- Color Replacement alpha preservation
- Color Replacement known-fixture luminance preservation
- global outside-mask preservation
- repeated-input determinism
- invalid dimensions/options predictable failure
- Node parse/import of the P1-B module in the focused isolated harness

Focused QA was executed in an isolated Node harness containing the exact committed P1-B source/QA blobs and API-compatible P1-A import stubs. The branch P1-A upstream export names/blobs were separately verified from GitHub before implementation.

## Implementation checkpoint

`3d1ee69a45535eb9046f1262d2b3c4f61c3b66b5`

Exact committed blobs:

```text
raster-retouch-tools.js = f2b63749ecbeffe753ae33608410695772f9b0a3
focused QA              = 9889bcfdc4d421233bcd2b1584e3b522c27ffade
P1-A selection upstream = 181fafbabff7d71e05015e8479a664880291551d
P1-A fill upstream      = 4881e9ecd7929500d6f307a0d379ac33e99ac81e
```

The committed P1-B source/QA blob SHAs match the exact locally tested files.

## Bounded limitations / deferred integration

- Core + focused QA only; no document mutation, History, save/load, UI, CHAT, Recipe or Renderer wiring.
- Clone/Healing/Spot Healing/Patch are deterministic bounded raster algorithms; no content-aware or generative synthesis.
- Spot Healing uses a bounded neighboring-pixel mean rule.
- Local Blur uses a deterministic bounded box kernel.
- Local Sharpen uses a deterministic source-buffer unsharp-style rule.
- Color Replacement preserves weighted luminance where feasible subject to byte clamping.
- Runtime is intentionally not run under the all-P1-before-runtime rule.

## Scope confirmation

```text
UI changes = 0
CHAT changes = 0
FORMAT_VERSION change = 0
History/save-load integration = 0
P1-C/D/E/F/G/H scope intrusion = 0
second raster/image authority = 0
Runtime = NOT RUN
P1_B_FOCUSED_QA = PASS
DEV_HANDOFF = YES
NEXT = STOP / WAIT_MR
```
