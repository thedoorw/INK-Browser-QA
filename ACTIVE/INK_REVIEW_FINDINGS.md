## INK-CHAT-CLOSED-LOOP-001 source findings — 2026-09-24

Accepted at exact HEAD `2b3c2f79147b6122f5ac78ed47d19c9878522386`:

- only two product files changed: capability registry and Public Creative API;
- `reference.import` delegates the existing CHAT Reference Handoff import authority exactly once;
- Named Tool 20 `import_ink_reference` is append-only; the accepted Connector-004 19-tool prefix is preserved;
- import output is normalized through the existing JSON-safe `INK_AGENT_RESULT / 1` envelope;
- Reference import continues to own decode/import/History/provenance/audit behavior; no second importer was introduced;
- capability discovery truthfully advertises browser-local File/Blob input and keeps `external.transport` unavailable;
- the browser proof starts from capability discovery and named-tool routing, then uses `use_ink` for the two-step native repaint plan;
- proposal neutrality, blocked pre-approval execute, explicit approval, ordered execution, History and final Revision are required;
- preview materialization reaches the existing realm-local `INK_OUTPUT_HANDLE` payload only from fixed QA code;
- QA loopback accepts only two fixed PNG slots, has size/dimension bounds, and does not add a product transport API;
- no UI, new drawing engine, Path geometry creation/editing, Boolean/Repeat/Group/Frame/Component/Layout exposure, arbitrary code execution, external transport or FORMAT_VERSION change exists in this candidate.

Known test debt retained rather than hidden:
- four older Connector tests assert exact tool total 19 and therefore fail after the authorized Tool 20 append;
- three other Connector failures reproduce unchanged on the starting source.

Decision: `SOURCE_REVIEW_PASS / RUNTIME_REQUIRED`.

# INK REVIEW FINDINGS

STATUS: `INK-TECH-DEBT-001 / MR_PASS / CLEAN_PROMOTED / CLOSED`

TASK: `INK-CHAT-VALIDATION-001 — Phase B Reference → Line + Color Layers`

REVIEWED_HEAD: `40a7e5e86e7b08c316210240be8527b020c5ecce`

## Accepted findings

- existing Reference is the authoritative source and remains available after decomposition;
- deterministic bounded ImageTracerJS work-raster path is accepted at `64,000 px / 320 px`;
- color quantization uses `colorquantcycles = 1` with bounded palette count;
- editable filled Color Paths and aligned boundary Line Paths are produced from the same accepted region geometry;
- Color and Line results remain on separate named layers;
- post-commit selection is bounded to one representative Line Path rather than every generated Line Path;
- all generated decomposition objects remain intact; selection bounding does not reduce output;
- the bounded selection keeps the existing AI Document Bridge selection below its default 96-object limit;
- CHAT receipt returns `COMPLETED` after the committed operation;
- History, Audit and Provenance remain inspectable through existing authorities;
- Revision identity remains unchanged; no automatic Revision is introduced;
- no UI redesign, semantic labeling, centerline tracing, new extraction engine or Phase C work was introduced;
- `FORMAT_VERSION = 4` is preserved.

## Browser Runtime acceptance

```text
RUN = 35865777424
TESTED_SHA = 40a7e5e86e7b08c316210240be8527b020c5ecce
RUNNER = DESKTOP-NSOQH69
BROWSER = Chrome
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS
PHASE_B_ELAPSED_MS = 2214.1
COLOR_REGIONS = 1471
BOUNDARY_LINES = 1471
POST_COMMIT_SELECTION = 1 / PASS
CHAT_RECEIPT = COMPLETED
HISTORY = PASS
AUDIT = PASS
PROVENANCE = PASS
REVISION = UNCHANGED / PASS
```

The runtime fixture generated more than the AI Document Bridge default selection bound while the post-operation selection remained bounded and the receipt completed normally. The prior `INK_AI_DOCUMENT_BRIDGE_SELECTION_BOUNDS_EXCEEDED` failure is therefore closed.

## Private user reference acceptance

```text
FILE = 1.jpg
MIME = image/jpeg
DIMENSIONS = 564x703
SIZE_BYTES = 28354
FINAL_TRACE_WORK_RASTER = 226x282 / 63732 px
TRACE_BUDGET_COMPATIBILITY = PASS
MULTI_COLOR_DECOMPOSITION_COMPATIBILITY = PASS
USER_IMAGE_PUBLIC_COMMIT = 0
```

This is an input/trace-budget compatibility acceptance; the authoritative browser Runtime proof is the repository fixture at the exact tested SHA above.

## Promotion

```text
PR = #48 / MERGED
PROMOTED_MAIN = cd911dc240452ed2bc74e9be41549116b088374b
PROMOTED_PRODUCT_QA_BLOBS = 8 / 8 EXACT MATCH TO TESTED SHA
PHASE_B = CLOSED
PHASE_C = NOT_STARTED
```

No further ImageTracerJS tuning is required for Phase B.


## INK-TECH-DEBT-001 closure findings

- exact Service Worker/source closure restored;
- worker-owned immutable build identity replaces visible-version cache identity;
- explicit runtime-ready startup contract replaces normal polling;
- test-only runtime control surface moved behind explicit QA opt-in;
- Web/Portable shell has one editable template/generator authority;
- accepted light-shell rules consolidated into the single desktop shell authority;
- active diagnostics/build metadata corrected;
- Runtime run `35887731569` passed UI, Creative and Geometry;
- CHAT Phase B decomposition remains intact at 1471 Color + 1471 Line with bounded single-Line post-commit selection and `COMPLETED` receipt;
- clean promotion main `7d99d2bf093f10ce2d489e6ebf68f28a2740ebe1` matches all 23 tested product/QA blobs.
