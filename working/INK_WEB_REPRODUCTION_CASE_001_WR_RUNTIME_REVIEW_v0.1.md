# CASE-001 The Minimalists — WR Runtime Review v0.1

## Status

```text
PROGRAM = INK-WEB-REPRODUCTION-PRODUCTION-LINE-001
CASE = CASE-001 / THE-MINIMALISTS
REVIEW_OWNER = WR
INK_PRODUCT_CHANGE_REQUIRED = NO
CURRENT_GATE = REFERENCE_VALIDITY
OVERALL = WR_HOLD_AT_R3
```

## Evidence reviewed

Hosted smoke workflow:

```text
RUN = 36678136249
HEAD = a37045582d20e4e4719305f4ccf8f25d08f2ade2
WORKFLOW_RESULT = SUCCESS
EVIDENCE_COMMIT = 5a6823ae12afde49a53615b26b86628d7c5291d4
```

Committed JSON evidence:

`qa/evidence/web-reproduction/case-001-smoke/a37045582d20e4e4719305f4ccf8f25d08f2ade2/`

## Findings

### R1 — Site Census

Execution result:

```text
ENGINE = PASS
SMOKE_REQUEST_CAP = 12
RECORDED_PAGES = 10
RECORDED_CRAWL_FAILURES = 2
```

The census obtained valid 200 responses for a bounded sample including:

```text
/
/about/
/archives/
/contextual/
/films/
/metastasizes/
/p557/
/podcast/
/resources/
/tour/
```

This proves the census engine runs and records structural evidence.

It does not yet prove whole-site inventory completeness.

### R2 — Page-Family classifier

Execution result:

```text
ENGINE = PASS
SMOKE_FAMILIES = 10
```

The 12-request smoke sample produced one structural family per recorded route.

This is adequate as execution proof only.

It is not yet accepted as a good semantic clustering result because the sample is too small and the current structural signature may over-split templates.

### R3 — Reference capture / measurement

Technical execution:

```text
CAPTURE_ATTEMPTS = 18
SCRIPT_ERRORS = 0
```

Reference validity:

```text
HTTP_STATUS = 403 on all 18 captures
REFERENCE_VALIDITY = FAIL
MEASUREMENTS = REJECTED
```

The captured page was a blocking/interstitial response, not the intended website.

Symptoms in the rejected metrics included:
- no expected header/nav/main/article/footer landmarks;
- generic system-font block-page styling;
- desktop document height equal to viewport;
- mobile horizontal overflow inconsistent with the intended site.

Therefore:

```text
WORKFLOW_SUCCESS
≠ REFERENCE_CAPTURE_SUCCESS
```

No geometry/style values from this hosted capture may enter the blueprint.

## Corrective action

A mandatory Reference Validity Gate has been added to the production line and capture engine.

CASE-001 validity requires:
- 2xx HTTP response;
- title containing `The Minimalists`;
- homepage links containing Podcast / Books / Films / Tour / Resources paths.

Next acquisition path:

```text
SELF_HOSTED_WINDOWS_REFERENCE_PROBE
RUN = 36678529425
RUNNER = [self-hosted, Windows, X64]
STATE AT REVIEW = QUEUED
```

The Windows probe uses only the homepage at desktop/mobile first. Full representative capture is not authorized until that probe proves the reference is valid.

## Gate decision

```text
WRPL-001-A = EXECUTION_PASS / FULL_CENSUS_PENDING
WRPL-001-B = EXECUTION_PASS / CLUSTER_QUALITY_PENDING
WRPL-001-C = HOSTED_REFERENCE_VALIDITY_FAIL
WRPL-001-D = NOT_AUTHORIZED
FINAL_RECONSTRUCTION = NOT_AUTHORIZED
PAGES_DEPLOYMENT = NOT_AUTHORIZED
```

This hold is intentional. It prevents a technically green browser run from generating a structurally wrong website.
