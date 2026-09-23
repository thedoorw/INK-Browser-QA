# INK REVIEW STATUS

STATUS: `INK-CORE-INTEGRATION-006 / MR_REVISE / RUNTIME_HARNESS_REQUIRED`

```text
TASK_ID = INK-CORE-INTEGRATION-006
TITLE = Workstation Capability Exposure & UI-Function Mapping v0.1
DEV_BRANCH = work/ink-core-integration-006
DEV_HANDOFF_HEAD = 08a719c0f8bfe903944eba95f43265a247d3e3ec
VALIDATED_PRODUCT_QA_CHECKPOINT = c5c979104ce42df866f7a14f9a5b8ae646efd14e
SOURCE_DIFF_REVIEW = PASS
SOURCE_STATIC_QA_REVIEW = PASS
PRODUCT_SCOPE = BOUNDED / ACCEPTED
GITHUB_ACTIONS_USED_BY_DEV = 0
TINYFISH_USED = 0
FORMAT_VERSION = 4
RUNTIME_GATE = NOT_MET
DECISION = MR_REVISE
```

## Accepted source findings

- capability matrix is present and distinguishes exposed / partial / out-of-scope states;
- no second panel/router/history/revision/document/geometry authority was introduced;
- product changes are limited to `install-ai.js` and `creative-workspace.js`;
- Creative Memory and Research → Creation providers are attached read-only;
- workstation readouts converge on existing grounded tools;
- Revision compare is correctly bounded to structural evidence only;
- no memory write, remote research fetch/scrape, auto-approval or extra execution authority was added;
- Web / Portable boot contract remains shared;
- no task-local GitHub Actions workflow exists.

## Blocking finding

The Work Order requires:

`WORKSTATION_CAPABILITY_RUNTIME_PASS`

The added focused QA is a Node/source/static contract test. It does not execute the new workstation routes in Chrome.

Therefore the following remain unverified at runtime:

- selection → Properties grounded Document/Semantic readout;
- Reference → Research advisory readout;
- Compose → Parametric/Repeat status;
- CHAT → grounded / Creative Memory / Research advisory readouts;
- Revision → provenance + structural compare;
- read-only/unavailable state rendering;
- preservation of single-panel behavior while these routes are active.

## Required bounded revision

Do not change product behavior unless runtime evidence exposes a real bug.

Add the smallest browser-runtime assertion set to the existing central Runtime harness path.

Preferred approach:
- extend the existing authoritative browser harness already consumed by `qa/runtime/run-ink-runtime-batch.mjs`;
- do not add a GitHub-hosted task workflow;
- do not add a second Runtime infrastructure path;
- preserve self-hosted Windows Chrome as the authoritative Runtime.

The revised browser evidence must explicitly verify the new Integration-006 workstation routes above.

Existing UI / Creative / Geometry regression suites must remain PASS.

After the harness is ready:
- DEV returns a new DEV_HANDOFF and STOP;
- MR performs exact-SHA review;
- MR owns promotion and the self-hosted Windows Runtime execution.

```text
PRODUCT_REWRITE = 0 EXPECTED
RUNTIME_HARNESS_DELTA_ONLY = PREFERRED
GITHUB_HOSTED_ACTIONS = PROHIBITED_FOR_THIS_REVISION
SELF_HOSTED_WINDOWS_RUNTIME = MR_OWNED_AFTER_PROMOTION
UI_LANE = REMAINS_PAUSED
```
