# Core performance / stability authority closure — 2026-10-03

AUTHORITY: ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md
FINAL_DISPOSITION = ACCEPTED / CLOSED / MERGED / DEPLOYED / FORMAL LIVE QUALIFIED
PR = #142
REVISED_EXACT_CANDIDATE = 0ac6e236a2baff587224398bc6f3e3aff35f5318
MERGED_DEPLOYED_SOURCE = e095ee54a51f8562d03af248dca658cf321e6479
PRODUCT_SOURCE_TREE = 93cafdeb5e448ce322904ceeadc3cf27cc12d90a
SOURCE_ENTRY_BLOB = 413f5eb4c5f1de8baa04b4eabd699e22f23a5fae

## Accepted behavior

Repeated identical cacheable native Canvas2D multichannel runs return the existing retained raster without repeating prepareNaturalMediaRun(). Existing Renderer/cache/Stroke/History authorities, cache limit and transient Preview/export semantics remain in place.

Original DEV candidate 17bfdeccec76cba24970578f048296485e3af4bb was not accepted as submitted: PERF-01 reproduced stale bounds/scale after a fractional transform. Authority revision preserves exact points, matrix, opacity and preferred scale in the early request identity. The regression test compares bounds/scale and pixel bytes with a fresh renderer; equal local pixel hashes alone did not detect the original defect.

One pre-A5 Paper singleton test asserted obsolete source spelling. Its Canvas2D assertion now tests actual default 2+ behavior, explicit singleton support and accepted mixers. No product repair was made for that stale assertion.

## Verification

- Authority checkout: 24/24 PASS.
- Revised exact candidate browser: core-perf-cache-authority-candidate-003 / run37098594186 / artifact11264723960 / digest sha256:c121e6c79e6ed1227b7ef46f625def448dc80fc61ab82be7909586204d39070c.
- Integrated exact source browser: core-perf-cache-integrated-001 / run37098763701 / artifact11265541621 / digest sha256:4ed0d3f3430b4ff3da1e59792fe1eafa6c86ac04b6a4bc6f44596fe6ccaf9edd.
- A5, A1/A2/A3/B2/B4, Paper singleton/roughness and concurrent B3 bucket/mask/localRetouch browser regressions PASS.
- Real Canvas2D sink verifies warm preparation skip; fractional transform/point/opacity, scale, Paper and render-budget invalidation against fresh output; transient zero-cache behavior; unchanged eviction/clear.

## Deployment and Formal Live

Initial deployment 58454f0a3091a7ff1f90689dd38a908e140679a2 omitted the existing Live wrapper CSP adaptation and stopped readiness before any product operation. Restored the prior accepted wrapper transform at 1fa828a4c79050e6a3c311133cca9066d6dc5806; product source remained unchanged. This was an authority deployment-wrapper error, not a cache product failure.

Successful exact-source runs all report apiReady=true, 23 named tools and source e095ee54a51f8562d03af248dca658cf321e6479:

| Qualification | Request commit | Result commit | Run / artifact |
|---|---|---|---|
| core-perf-cache-formal-live-002 | e03a6ebc4b291940167766dcc63877648f957e20 | 0c11a7993a20a1c7bf27a024b453b33df0db48dd | 37099162758 / 11265647049 |
| core-perf-combined-draw-live-002 | 2744a1185993338ad2aa8e4f3f46756da71bd52d | caf64296f17e35191534ba84cc002e3acf6d0033 | 37099239809 / 11265048752 |
| core-perf-combined-reference-live-002 | 760184e1b95f4fc393c894917a95373feeb704ae | 153d3eadedbc6a542dfd457c91fa524ebbd3c320 | 37099319014 / 11264884329 |
| core-perf-paint-session-live-002 | 1793cd4c94de69c868d0afdd32e17196bbfb3764 | d844e6b4a6f93deabcf483cbc93711515d1818ab | 37099492808 / 11264869568 |

A5: baseline c182394c → Blender d2f80729 → Smudge 9a547b82; two Undo/two Redo restore exact corresponding fingerprints and stable native refs. Four scoped Stroke History entries remain.

B4: warp/distort/perspective native state, stable Path identity, retained baseSubpaths, exact Undo/Redo/reset/reapplication all PASS. Distort differs from Perspective. Preview baseline 7ff52aa2 → warp4c659f50 / distort6c8f8da2 / perspectivefa61bf5a.

Cache Live probe: actual Canvas2D cold27.8ms and five identical warm calls0.2–0.4ms for its bounded 4-Stroke workload; one preparation/five skips. Exact fresh-render bounds/scale/pixels and transient/eviction/clear PASS. These are observations within the accepted candidate, not a before/after browser speedup claim.

Draw: Paper + Brush/DryBrush → Airbrush correction → Preview/History → Undo/Redo → PNG. Preview fnv1a32:71050030 → fnv1a32:347539c1; exact Undo/Redo. Three native Stroke objects/four scoped entries. A4 PNG1191×1684.

Reference: locked Reference + editable image → translation → Revision → brightness/contrast correction → Preview/History → Undo/Redo → PNG/output inspection. Preview fnv1a32:c3bd4f5f → fnv1a32:f279be47; exact Undo/Redo. Two objects/four scoped entries, two linked revisions. Full artifact11264884329 was downloaded, digest verified, and inspected because GitHub's shared result is compacted.

A1: one native Paint Session chat-paint-fnv1a32-5a313234; one scoped History entry; Undo removes it, Redo restores the same id/bounds and Preview fnv1a32:1b8d3443.

## Evidence and limits

Manifest: qa/evidence/ink-core-performance-stability-001/authority-evidence-manifest.json.
Reference full-artifact verification summary is stored separately alongside immutable result copies.

DEV original warm speedup numbers are isolated-harness observations and do not establish a browser baseline speedup for this revision. Preview speedup and heap/memory-leak improvements are not claimed. This closes one bounded optimization, not all Core performance or all CHAT capability coverage.

GitHub concurrency replaced older pending Draw/Reference/A1 requests; those cancelled requests are not counted as executed tests. Successful Formal Live requests were submitted sequentially. The exact-deployment reservation is released. Concurrent B3 ownership remains with its existing owner; no B3 source-dependent operation acceptance is claimed here.

UI_CHANGE = NONE
FORMAT_VERSION = 4 / UNCHANGED
SECOND_AUTHORITY = NONE
CORE_CACHE_OPTIMIZATION = CLOSED
