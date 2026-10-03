# INK PWA / Cache Freshness — Integration + Live Gate DEV Return — 2026-10-03

STATUS: **FOCUSED_REGRESSION_FAIL / STOP → SUPERVISOR**

## Integration composition

Execution-time latest main:
`01aaabac7d2a7a3d006029a616e7eed40fd334f4`

Fresh integration branch:
`work/pwa-cache-freshness-integration-live-gate-001`

Supervisor-accepted source:
`0ccfd4a729f16ff755921f5881fa0090e2745581`

Exact clean integration candidate:
`9b26ebc54842489c44ce433d62d17c82c77d924f`

Candidate tree:
`7d47f0378b3dbeb4e7ed3f57dbc9380f8109156a`

The candidate is a one-commit blob-level overlay from latest main. No historical PWA branch merge was used.

Exact accepted-composition proof:

```text
.github tree = 71b74938dc04304485d9a37f83a487352d7f10e5 = accepted v3
product tree = f38506141209841c770d9acd3caea08eae528e32 = accepted v3
qa tree      = dcdf0ce4c2f5ff10fec87e3e6a3318fb246a71ee = accepted v3
pwa-pages-build-identity.txt blob
             = 52dd7057396607451e898729dab76737302ba378 = accepted v3
```

Therefore the bounded PWA product/workflow/QA composition was reconciled exactly while preserving the newer main ACTIVE/working documents.

## Fresh focused regression

A QA-only child branch was created from the exact integration candidate:

`work/pwa-cache-freshness-integration-regression-001`

QA probe commit:
`eaf2132881084d7ad8134c178427c9f6051018de`

Its only changes from the clean candidate were:
1. point the v3 push trigger at the QA child branch;
2. materialize the execution-time latest main `01aaabac...` as the browser baseline.

Product/source and the accepted PWA implementation remained unchanged.

Run:
`37123474390`

Job:
`111204016494`

Artifact:
`11274172923`

Artifact digest:
`sha256:fa25c4a24d81eae398c348311a484a13f2649af6f9ead145d1957f9709d37f3f`

PASS before failure:
- deterministic fallback identity;
- source and syntax guards;
- Jekyll Pages build;
- publication-bound exact revision;
- post-integration gate wiring;
- latest-main baseline materialization.

FAIL:
`Real Chromium lifecycle A`

Exact error:

```text
Error: timeout waiting for candidate worker identity: false
```

Failure diagnostics show:

```text
previous worker controlled = true
controller = service-worker.js / activated
active     = service-worker.js / activated
waiting    = service-worker.js / installed
INK caches = []
candidate service-worker.js request observed = yes
candidate runtime build id reached = no
```

This fresh run therefore did not deterministically complete the legacy-worker takeover. The observed state is consistent with the waiting-worker race class the v4 migration change was intended to close.

## Contrast with accepted run

Supervisor-accepted qualification:
- run `37119509698`;
- artifact `11272193852`;
- local lifecycle A = PASS;
- local lifecycle B = PASS;
- same `product` tree SHA `f38506141209841c770d9acd3caea08eae528e32`.

The fresh failure is therefore not explained by a changed integration product tree.

Evidence note: `local-a.json` still reports the old hard-coded `baselineSource=a6842e95...`; the Actions log proves this fresh probe actually materialized latest main `01aaabac...`. This is metadata staleness in the harness report, not the browser baseline used by the run.

## Disposition

```text
FOCUSED_REGRESSION = FAIL
INTEGRATION_CANDIDATE = NOT_PROMOTED
MAIN_INTEGRATION = NO
GITHUB_PAGES_POSTINTEGRATION_GATE = NOT_RUN
PWA_CACHE_FRESHNESS_CLOSED = NO
NEXT = SUPERVISOR
```

No C06, C04, New Document/A4, History, unrelated UI, drawing/render capability, FORMAT_VERSION, or `thedoorw/INK` mutation was made.

Per dispatch, STOP here. Do not merge the candidate to main until Supervisor dispositions the reproduced transition failure.
