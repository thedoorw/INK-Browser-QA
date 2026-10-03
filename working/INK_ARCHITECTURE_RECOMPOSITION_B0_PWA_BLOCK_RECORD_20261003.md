# INK Architecture Recomposition — B0 PWA Block Record — 2026-10-03

STATUS: **BLOCKED_BY_PWA_CLOSURE / NO BASELINE FREEZE PERFORMED**  
ROLE: INK Architecture Recomposition MR — B0/B1  
REPO: `thedoorw/INK-Browser-QA`  
GITHUB: SOLE SSOT

## 1. Decision

B0 may not freeze a pre-recomposition baseline yet.

Observed authoritative main before this B0/B1 documentation pass:

`bf74f6d08890aab1c2ea77b84aa774d70391a94c`

At that revision, `ACTIVE/INK_CURRENT_WORK_ORDER.md` still declares:

`PWA / Cache Freshness — Integration + Live Gate ACTIVE`

The active PWA integration return on branch
`work/pwa-cache-freshness-integration-live-gate-001`
records:

```text
FOCUSED_REGRESSION = FAIL
INTEGRATION_CANDIDATE = NOT_PROMOTED
MAIN_INTEGRATION = NO
GITHUB_PAGES_POSTINTEGRATION_GATE = NOT_RUN
PWA_CACHE_FRESHNESS_CLOSED = NO
NEXT = SUPERVISOR
```

Evidence:
- integration candidate: `9b26ebc54842489c44ce433d62d17c82c77d924f`
- QA child: `work/pwa-cache-freshness-integration-regression-001`
- QA probe commit: `eaf2132881084d7ad8134c178427c9f6051018de`
- run: `37123474390`
- failure: `timeout waiting for candidate worker identity: false`
- return: `working/INK_PWA_CACHE_FRESHNESS_INTEGRATION_LIVE_GATE_DEV_RETURN_20261003.md`

Therefore the mandatory precondition in
`research/INK_ARCHITECTURE_RECOMPOSITION_EXECUTION_PLAN_v0.1.md`
has not been met.

## 2. B0 actions intentionally NOT performed

The following must not be created against an earlier/intermediate revision:

```text
tag: pre-architecture-recomposition-v1
archive branch: archive/pre-architecture-recomposition
frozen baseline manifest
immutable source snapshot/checksum
```

No substitute baseline was selected.

## 3. Gate required before B0 can resume

The PWA authority must first record all of the following as CLOSED:

1. accepted bounded PWA composition integrated to current `main`;
2. exact integrated main SHA;
3. exact GitHub Pages publication identity;
4. actual deployed normal open;
5. ordinary F5 with normal cache behavior;
6. close/reopen;
7. offline fallback;
8. app / worker / cache identity agreement;
9. no mixed-build state;
10. no reload loop;
11. Supervisor closure.

Only the exact accepted main revision after that closure may become the pre-recomposition baseline.

## 4. B0 resume procedure

After the above gate closes:

```text
pin exact accepted main SHA
→ create tag pre-architecture-recomposition-v1
→ create archive/pre-architecture-recomposition at the same SHA
→ create baseline manifest
→ create immutable repository/source snapshot or equivalent archive
→ compute and record checksum
→ verify tag + archive branch + snapshot recover the same source identity
→ record deployed/browser-loaded identity and PWA closure evidence
```

The frozen manifest must also record:
- `FORMAT_VERSION = 4`;
- source/build identity;
- deployed/Pages identity;
- browser-loaded identity;
- capability baseline pointer;
- Runtime / QA evidence;
- independent open lanes;
- snapshot identity/checksum.

## 5. Current B0 disposition

```text
B0_BASELINE = BLOCKED_BY_PWA_CLOSURE
TAG_CREATED = NO
ARCHIVE_BRANCH_CREATED = NO
FROZEN_MANIFEST_CREATED = NO
SNAPSHOT_CHECKSUM_CREATED = NO
EARLIER_BASELINE_SUBSTITUTED = NO
PRODUCT_SOURCE_MUTATION = NONE
```

B1 contract work may proceed because it is documentation/architecture only.
