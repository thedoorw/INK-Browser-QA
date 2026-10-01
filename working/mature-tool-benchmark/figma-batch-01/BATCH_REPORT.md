# Mature Tool Benchmark — Figma Batch 01

PROGRAM: INK-MATURE-TOOL-AUTONOMY-BENCHMARK-001  
TASK: MTB-FIGMA-BATCH-01  
BRANCH: work/mature-tool-benchmark-figma-batch-01  
FIGMA_FILE_URL: https://www.figma.com/design/xwS3l54GYC863Qtnrwuw8y

| Case | Result | Autonomy | User interventions | Self-corrections | Main gap |
| --- | --- | --- | ---: | ---: | --- |
| F01 | BLOCKED | TOOL_GAP | 0 | 0 | Starter MCP call quota blocked mandatory correction + final verification |
| F08 | BLOCKED | TOOL_GAP | 0 | 0 | Starter MCP call quota blocked execution |
| F09 | BLOCKED | TOOL_GAP | 0 | 0 | Starter MCP call quota blocked execution |
| F10 | BLOCKED | TOOL_GAP | 0 | 0 | 3-page plan limit + MCP call quota |
| F14 | BLOCKED | TOOL_GAP | 0 | 0 | callable undo/version-history save absent; provider limits also active |

BATCH_PASS_COUNT: 0  
BATCH_PARTIAL_COUNT: 0  
BATCH_BLOCKED_COUNT: 5  
FULL_AUTO_COUNT: 0  
AUTO_WITH_CHECKPOINT_COUNT: 0  
GUIDED_COUNT: 0  
TOOL_GAP_COUNT: 5  
CHAT_GAP_COUNT: 0  
VERIFICATION_GAP_COUNT: 0

## Execution summary

- Dedicated Figma Design file created successfully.
- Figma account exposed one Starter plan.
- Attempt to create the workpack's five required pages failed with provider error: Starter plan only comes with 3 pages.
- State inspection confirmed the failed five-page creation call did not leave partial page mutations.
- Three allowed pages were then created: `F01_POSTER` (`0:1`), `F08_VECTOR_BOOLEAN` (`1:4`), `F09_AUTO_LAYOUT` (`1:5`).
- F01 initial artifact was created with editable text/vector nodes and a 1080 × 1350 screenshot request succeeded.
- Before the mandatory F01 correction/re-inspection loop and before F08/F09/F10 execution, Figma rejected further calls with the Starter-plan MCP call-limit paywall.
- F14 additionally has an independent capability gap: required Figma skill/API documentation states undo and version-history saves are not available through `use_figma`, and no separate active tool exposed them.

## Mandatory USER checkpoints encountered

None. Existing Figma authentication was valid. No USER design-direction or operational selection was requested.

## Unresolved gaps

1. Provider plan must permit at least five pages in one file to satisfy the prescribed file topology exactly.
2. Sufficient Figma MCP call quota is required to run five self-verifying cases in one batch.
3. F14 cannot PASS on the current CHAT Figma surface until callable undo is exposed.
4. Callable version-history checkpoint save is also absent from the current `use_figma` surface.
5. F01 must be resumed from node `1:6` and complete visible inspection → concrete delta → self-correction → final inspection before it can be reconsidered.

## Gate

DEV_HANDOFF → BENCHMARK_REVIEW_REQUIRED

No merge performed. Batch 02 not started.
