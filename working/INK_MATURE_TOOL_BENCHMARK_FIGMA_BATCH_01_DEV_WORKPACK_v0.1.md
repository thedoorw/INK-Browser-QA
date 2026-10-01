# INK Mature Tool Benchmark — Figma Batch 01 DEV Workpack v0.1

## Authority

```text
OWNER = CHAT BENCHMARK REVIEW
PROGRAM = INK-MATURE-TOOL-AUTONOMY-BENCHMARK-001
TASK = MTB-FIGMA-BATCH-01
ROLE = MATURE TOOL BENCHMARK DEV
ECOSYSTEM = FIGMA
CASES = F01 / F08 / F09 / F10 / F14
BATCH_SIZE = 5
INK_PRODUCT_MUTATION = FORBIDDEN
INK_UI_MUTATION = FORBIDDEN
MASTER_QUALIFICATION_STATUS_MUTATION = FORBIDDEN UNTIL REVIEW
```

This task evaluates how autonomously CHAT can use a mature external creative tool. It does **not** test or modify INK.

## Goal

Execute five Figma benchmark cases in one bounded batch and determine, with evidence, whether CHAT can:

```text
understand task
→ discover correct Figma capability
→ plan operations
→ execute
→ inspect result
→ detect visible/structural errors
→ correct them without USER instruction
→ record evidence
```

The DEV is responsible for self-verification. USER should not be asked to approve each case.

## Required read order

1. `README.md`
2. `research/INK_CHAT_CAPABILITY_QUALIFICATION_PLAN_v0.1.md`
3. `research/INK_CREATIVE_REPRODUCTION_BENCHMARK_v0.1.md`
4. this Workpack
5. the Figma plugin skill required by each Figma write/read operation

Do not read or modify INK product source for this task.

## Mandatory branch

```text
work/mature-tool-benchmark-figma-batch-01
```

All benchmark evidence and progress commits belong on this branch.

Do not merge to `main`.

## Figma workspace

Create one dedicated Figma Design file:

```text
INK Mature Tool Benchmark — Figma Batch 01
```

Use a separate page for each case:

```text
F01_POSTER
F08_VECTOR_BOOLEAN
F09_AUTO_LAYOUT
F10_COMPONENTS
F14_HISTORY_VALIDATION
```

Do not reuse unrelated user design files.

## Case F01 — Poster / visual asset

Reference case:
`F01 — Modern minimal hackathon posters in ChatGPT`

Task:

Create one portrait poster, 1080 × 1350, containing:

- title: `BUILD / TEST / LEARN`
- subtitle: `INK TOOL BENCHMARK 01`
- date line: `01 OCT 2026`
- one clear CTA: `OPEN LAB`
- at least three editable vector geometric elements;
- at least two text hierarchy levels;
- a coherent limited palette;
- no rasterized text.

Required operations:

```text
create frame
→ create/edit text
→ create editable shapes
→ apply fills/strokes
→ position/resize
→ inspect screenshot
→ identify at least one concrete visual issue
→ correct it
→ inspect again
```

PASS requires:
- all specified content exists;
- text is editable;
- geometric elements are editable;
- final screenshot is inspectable;
- DEV performs at least one self-initiated correction;
- no USER design-direction intervention.

## Case F08 — Vector / shape / Boolean

Reference case:
`F08 — Vector, shapes, grouping and Boolean operations`

Task:

On page `F08_VECTOR_BOOLEAN` create a controlled Boolean specimen sheet with four labelled results:

```text
UNION
SUBTRACT
INTERSECT
EXCLUDE
```

Use the same base rectangle + circle geometry for each result.

Required operations:

- rectangle;
- ellipse;
- duplicate/clone;
- group where useful;
- union;
- subtract;
- intersect;
- exclude/XOR;
- inspect hierarchy and visible result.

PASS requires:
- four labelled Boolean results are visibly distinct;
- source geometry or duplicated inputs are traceable;
- no result is a flattened raster;
- hierarchy inspection supports the claimed operation.

If one named Boolean is not exposed by the Figma CHAT surface, record it as a specific TOOL_GAP rather than silently substituting another operation.

## Case F09 — Auto Layout / styling / clone / hierarchy

Reference case:
`F09 — Auto Layout, styling, clone and hierarchy patterns`

Task:

Create a three-card horizontal information strip.

Each card must contain:
- heading;
- two-line body text;
- small status label.

Required structure:

```text
parent horizontal auto layout
→ 3 cloned child cards
→ each card vertical auto layout
→ padding = 24
→ internal gap = 12
→ parent gap = 16
```

Then change the middle card body text so it becomes longer.

PASS requires:
- layout remains valid after text expansion;
- cards remain editable/nested;
- clone/reuse is visible in operation evidence;
- padding/gap values can be inspected or otherwise verified;
- DEV corrects any overflow/misalignment it discovers.

## Case F10 — Components / instances / overrides

Reference case:
`F10 — Components, variants and instance overrides`

Task:

Create a reusable button component system containing:

```text
PRIMARY
SECONDARY
```

Each style must support:
- editable label;
- visible background/fill distinction;
- at least one instance.

Create three instances:
- `Save`
- `Cancel`
- `Continue`

Perform:
- one text override;
- one visibility/style-compatible override if supported;
- reset one override;
- detach one instance.

PASS requires:
- component/source and instances are structurally identifiable;
- instance edit does not accidentally mutate all peers unless the source itself is edited;
- reset and detach behavior are demonstrated;
- unsupported variant/override behavior is recorded precisely rather than approximated.

## Case F14 — History / version / validation

Reference case:
`F14 — use_figma undo, version history and validation/recovery`

Task:

Use the work produced in this batch to demonstrate:

1. make a visible bounded edit;
2. capture/commit an undo boundary if available;
3. perform another edit;
4. invoke undo;
5. confirm the visible state;
6. save a version-history checkpoint if available;
7. inspect metadata/hierarchy;
8. capture final screenshot evidence.

PASS requires:
- undo visibly restores the intended prior state;
- DEV verifies rather than assumes the undo result;
- available version-history operation is recorded accurately;
- screenshot plus structural inspection support the result.

If Figma exposes undo but not a callable version-history save in the active environment, classify only that sub-capability as TOOL_GAP/PARTIAL.

## Mandatory self-verification loop

For **every case**:

```text
EXECUTE
→ SCREENSHOT / STRUCTURAL INSPECT
→ compare against task
→ list concrete deltas
→ correct every correctable delta
→ SCREENSHOT / STRUCTURAL INSPECT again
→ classify result
```

A successful tool response is not PASS evidence.

## USER intervention rule

Record every USER action.

Classification:

```text
0 = no USER intervention
1 = authentication / explicit provider checkpoint only
2 = USER had to identify/select a target or tell DEV the next operation
3+ = materially guided execution
```

Do not count normal plugin permission/authentication as creative guidance, but record it.

## Autonomy classification

Each case must receive exactly one primary autonomy class:

```text
FULL_AUTO
AUTO_WITH_CHECKPOINT
GUIDED
TOOL_GAP
CHAT_GAP
VERIFICATION_GAP
```

Definitions:

- `FULL_AUTO`: CHAT plans, executes, verifies and corrects without USER intervention.
- `AUTO_WITH_CHECKPOINT`: only provider/auth/mandatory confirmation requires USER.
- `GUIDED`: USER must supply an operational/creative next step.
- `TOOL_GAP`: CHAT knows the operation but active Figma surface cannot perform it.
- `CHAT_GAP`: capability is available but CHAT fails to discover/sequence/use it correctly.
- `VERIFICATION_GAP`: operation completes but CHAT cannot reliably verify correctness.

## Result classification

Each case:

```text
PASS
PARTIAL
BLOCKED
```

PASS requires both execution and verification.

## Required evidence record per case

Create:

```text
working/mature-tool-benchmark/figma-batch-01/F01.md
working/mature-tool-benchmark/figma-batch-01/F08.md
working/mature-tool-benchmark/figma-batch-01/F09.md
working/mature-tool-benchmark/figma-batch-01/F10.md
working/mature-tool-benchmark/figma-batch-01/F14.md
```

Each file must contain:

```text
CASE_ID
FIGMA_FILE_URL
PAGE / NODE IDS
TASK
PLAN
ACTUAL OPERATIONS
DISCOVERY RESULT
EXECUTION RESULT
INITIAL INSPECTION
DELTAS FOUND
SELF-CORRECTIONS
FINAL INSPECTION
USER_INTERVENTION_COUNT
USER_INTERVENTIONS
AUTONOMY_CLASS
RESULT
TOOL_GAPS
CHAT_GAPS
VERIFICATION_GAPS
NOTES
```

Do not paste private credentials or secrets.

## Batch report

Create:

`working/mature-tool-benchmark/figma-batch-01/BATCH_REPORT.md`

Required summary table:

| Case | Result | Autonomy | User interventions | Self-corrections | Main gap |
| --- | --- | --- | ---: | ---: | --- |
| F01 |  |  |  |  |  |
| F08 |  |  |  |  |  |
| F09 |  |  |  |  |  |
| F10 |  |  |  |  |  |
| F14 |  |  |  |  |  |

Also report:

```text
BATCH_PASS_COUNT
BATCH_PARTIAL_COUNT
BATCH_BLOCKED_COUNT
FULL_AUTO_COUNT
AUTO_WITH_CHECKPOINT_COUNT
GUIDED_COUNT
TOOL_GAP_COUNT
CHAT_GAP_COUNT
VERIFICATION_GAP_COUNT
```

## DEV may self-correct, but may not self-promote

DEV may:
- retry failed Figma operations;
- inspect the file;
- correct its own design;
- refine its own sequence;
- commit evidence.

DEV may not:
- change the master Google Sheet accepted-result status;
- rewrite benchmark PASS criteria after seeing the result;
- modify INK;
- modify current UI;
- declare the benchmark program complete;
- merge its branch.

## Stop conditions

STOP and record `BLOCKED` for the affected case when:

- Figma authentication cannot be completed;
- the required capability is absent from the current tool surface;
- required inspection cannot be obtained;
- repeated tool failure prevents deterministic continuation;
- continuing would require INK/product/UI mutation.

A blocked case does not block the other four unless the shared Figma file itself is inaccessible.

## DEV handoff gate

```text
AUTHORIZED
→ DEV_IN_PROGRESS
→ 5 CASE RECORDS COMPLETE
→ BATCH_REPORT COMPLETE
→ DEV_HANDOFF
→ BENCHMARK_REVIEW_REQUIRED
```

At handoff return:

- exact branch HEAD;
- Figma file URL;
- five case-result files;
- batch report;
- any mandatory USER checkpoint encountered;
- unresolved gaps.

Then STOP. Do not start Batch 02.
