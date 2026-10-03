# INK Cluster D — Material / Recipe Authority Closure — 2026-10-03

## Authority result

```text
CLUSTER_D = CLOSED / ACCEPTED / MERGED / DEPLOYED / FORMAL LIVE QUALIFIED
PR = #154
DEV_EXACT_CANDIDATE = da40f868ebdb17c6cacb46d74867f75235ba77e5
DEV_RETURN_HEAD = b2011e8eb23ab81956e987b5bb6e491042449ba8
DEV_CANDIDATE_RUN = 37116951905
DEV_CANDIDATE_JOB = 111185489317
DEV_CANDIDATE_ARTIFACT = 11271832120
DEV_CANDIDATE_DIGEST = sha256:909218129dad5d4645eec625c19ab5f8c84ed68d0c79a303e36a3e11e59da027
MERGED_SOURCE = 4188e9cc7673313726abd7986310d758912f63cf
INITIAL_LIVE_DEPLOY_COMMIT = 3cf091b1d84bbb56582f9a546465b5d6341ceaf1
INITIAL_LIVE_PAGES_RUN = 37117550687 / PASS
CORRECTED_LIVE_WRAPPER_COMMIT = 270ee9fa0c1d978d2b6e01e4d14341e5b8b24b10
CORRECTED_LIVE_PAGES_RUN = 37117864191 / PASS
FORMAL_LIVE_REQUEST = cluster-d-material-recipe-formal-live-003
FORMAL_LIVE_REQUEST_COMMIT = d180fddf9b707a61311136fe04b17793ddbce3cb
FORMAL_LIVE_RUN = 37117972309 / PASS
FORMAL_LIVE_ARTIFACT = 11271817574
FORMAL_LIVE_DIGEST = sha256:305ebde6eea7e900557aaf5f05e1089988e2b576e632a7e74a020c6a19777620
LIVE_CLOSURE_COMMIT = 0ee755456882d9c013c7366c9d0f924ea93f1993
LIVE_CLOSURE_PAGES_RUN = 37118110824 / PASS
FORMAT_VERSION = 4 / UNCHANGED
```

## Candidate acceptance

Authority review verified the exact candidate identity against browser QA and artifact evidence. PR #154 reuses the existing Material library, existing Studio RecipeEngine, existing Document/History/Renderer authorities and the bounded CHAT proposal → approval → execute route. It does not create a second Material or Recipe engine and does not use Workflow IR as a substitute.

Accepted D scope:
- D1: native Material template creation, native Material instance creation/reuse, read-only Creative Library rediscovery.
- D2: read-only inventory over the already-installed Studio RecipeEngine plus identity-only page-stored FLORA recipe state.
- D3: governed execution of an already-registered Studio recipe through `recipe.studio.execute.v1`.

Candidate regressions covered C1/C2, B4, A2 and B2. `FORMAT_VERSION` remained 4.

## Deployment identity

The accepted PR merged as exact integrated source:
`4188e9cc7673313726abd7986310d758912f63cf`.

The initial Live deployment at `3cf091b1d84bbb56582f9a546465b5d6341ceaf1` passed GitHub Pages deployment, but Formal Live request 001 correctly failed before API readiness because the deployment wrapper accidentally retained the source-only CSP (`base-uri 'none'` / `script-src 'self'`), which blocked the immutable jsDelivr exact-SHA assets.

This was a Live wrapper composition defect, not a Cluster D product failure. The wrapper was corrected at `270ee9fa0c1d978d2b6e01e4d14341e5b8b24b10` by removing only the source-only CSP, matching the previously qualified Live wrapper contract. The exact product source pin stayed `4188e9cc...`; product bytes were unchanged. Corrected Pages run `37117864191` passed.

Formal Live request 002 then failed only because the authority request fixture used an extra `result` level in one `get_ink_context` reference. No product or Live-source mutation was made for that correction.

## Formal Live evidence

Final qualifying run `37117972309` loaded:
- exact runtime source `4188e9cc7673313726abd7986310d758912f63cf`;
- `apiReady=true`;
- 24 named tools;
- document `formatVersion=4`;
- all 32 requested steps completed successfully.

D1:
- created `material:chat:formal-live-d1@1` through `material.template.create.v1`;
- History: `CHAT create Material template`;
- read-only Creative Library search rediscovered the same native Material template and exposed existing-authority reuse metadata;
- created native instance `live-d1-material-instance` through `material.instance.create.v1`;
- History: `CHAT create Material instance`;
- Undo and Redo both applied successfully;
- final Context retained an editable native Material group and native child Path.

D2:
- `get_ink_recipe_inventory` returned read-only inventory;
- Studio count = 1;
- page-stored FLORA count = 0 in this session;
- existing Studio recipe = `ink.flower.common.v1` / `Adaptive Flower Finish` / version 1;
- governed execution route correctly reported as proposal → approval → execute.

D3:
- created native Path `live-d3-petal`;
- executed existing Studio recipe `ink.flower.common.v1` with explicit `petal` role binding;
- execution receipt completed with checkpoint and replay diff; `rolledBack=false`;
- recipe QA step passed;
- History: `CHAT Recipe · Adaptive Flower Finish`;
- Preview render fingerprint changed from `fnv1a32:fee4827f` to `fnv1a32:5d902de5`;
- Undo restored exact `fnv1a32:fee4827f`;
- Redo restored exact `fnv1a32:5d902de5`.

Regression:
- C4 `page.artboard.set.v1` changed A4 portrait → landscape through the existing native Artboard authority;
- History: `調整畫板`;
- Undo succeeded;
- final Context remained format 4.

## Boundary retained

- D1 qualification is bounded to the native Material template/instance/reuse surfaces exercised here. It does not claim arbitrary rich Material effects.
- D3 applies only to already-registered Studio recipes. Inline Recipe definitions remain prohibited.
- Page-stored FLORA recipe state remains inventory/discovery only; its existing runtime authority is not replaced.
- Workflow IR and External Workflow Translation were not introduced.
- No second Material, Recipe, Document, History or Renderer authority was created.
- B3 and advanced mutable raster ingest remain CLOSED / DO NOT REOPEN.
- Cluster C remains CLOSED.
- C019 curved/path Text remains CLOSED; broad Text envelope/general warp remains unqualified.
- UI PR #109, PWA, C06 and New Document remain separate and untouched by this closure.
- `FORMAT_VERSION=4`.
