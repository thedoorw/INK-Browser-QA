# INK P0 Restore All — MR Pre-Runtime Review v1.0

STATUS: `MR_PASS_PRE_RUNTIME`

TASK: `INK-P0-RESTORE-ALL-001`

REVIEWED_BRANCH: `work/ink-p0-restore-all-001`

REVIEWED_HEAD: `f911f777f770cbe290e290c4b0cbc3692b36641e`

BASELINE: `b68a0a9fe1e0e65e30f6f2a691e8b60b15186c46`

DATE: 2026-09-27

## MR decision

```text
SECTION_4_CAPABILITY_FAMILIES = 61
LEDGER_COVERAGE = 61 / 61
NATIVE_SOURCE_AUTHORITY_PATHS_MISSING = 0
LEDGER_QA_POINTERS_MISSING = 0
ORIGINAL_PRODUCT_FILES_REMOVED = 0 / 198
UNRESOLVED_EXISTING_CAPABILITY_LOSS = 0 identified
P1_P2_SCOPE_INTRUSION = 0 identified
RUNTIME_PREVIOUSLY_EXECUTED = NO
FIRST_REBASELINE_RUNTIME_AUTHORIZED = YES
```

This authorizes the first integrated rebaseline Runtime. It does **not** certify Runtime PASS and does not authorize promotion of the product branch.

## Review basis

MR independently checked:

- exact branch HEAD matches the DEV handoff;
- Section 4 ledger contains 61/61 rows in the authoritative order;
- every ledger source-authority path resolves to an existing source file at the reviewed HEAD;
- every ledger QA pointer resolves to an existing repository test file;
- original imported product source comparison still shows 0 original product files deleted;
- branch diff against baseline changes only the expected P0 restoration source/test/evidence files;
- source changes restore/reconcile existing authorities rather than introduce a second renderer/document/history/brush authority;
- Filter/Adjustment/Mask/Blend/Brush-package/History/save-load wiring uses existing product authorities;
- Layer Effects remains explicitly at its historical partial scope; no P1/P2 completion is falsely claimed;
- Program Import historical fixture failure is a repository test-path/fixture-location debt, not loss of importer source or external benchmark assets. The 42 external benchmark assets remain present under `research/source/external-assets/library/`.

## Reviewed product changes

Product-source diff is bounded to:

- `product/source/src/image/image-core.js`
- `product/source/src/ink.js`
- `product/source/src/studio-core.js`
- `product/source/src/semantic/semantic-region-grounding.js`

Observed remediation classes:

- image/raster mask and existing layer-stack rendering;
- declared blend-mode execution;
- image/layer render-cache invalidation;
- History participation for existing mask/adjustment/filter/replay/import/report flows;
- persisted/reloaded existing Brush Package support;
- positive-overlap semantic `intersects` evidence.

No Photoshop P1/P2 feature family was introduced in this reviewed diff.

## Non-runtime QA accepted for gate

Accepted DEV evidence:

- new P0 focused test: 4/4 pass;
- selected historical source-adjacent unit tests: 61/61 pass;
- semantic region focused test: pass;
- retained CHAT/reference/library/memory tests: 8 units pass;
- changed-source parse and diff checks: pass;
- focused save/load: pass;
- focused History undo/redo: pass.

Historical `program-import-v110.test.mjs` and old-format `document.test.mjs` limitations remain QA debt and must not be represented as PASS.

## Runtime requirement

The central Runtime batch must be extended before execution so it includes the new P0 focused regression and relevant retained grounding/reference coverage. Running the old batch unchanged is not sufficient evidence for this rebaseline.

Runtime target remains the exact reviewed product candidate:

`f911f777f770cbe290e290c4b0cbc3692b36641e`

If Runtime fails:

`RETURN_TO_RESTORATION / NO PROMOTION / NO CAPABILITY MAY BE SKIPPED`
