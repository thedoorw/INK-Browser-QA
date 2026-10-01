# Mature Tool Benchmark — Figma Batch 01 Review

PROGRAM: INK-MATURE-TOOL-AUTONOMY-BENCHMARK-001  
TASK: MTB-FIGMA-BATCH-01  
REVIEW_ROLE: CHAT BENCHMARK REVIEW  
BRANCH: work/mature-tool-benchmark-figma-batch-01  
DEV_HANDOFF_HEAD: ae526b6d49b75128fb68fdb7d5ad8fc37cb1fdc6

## Reviewer verdict

```text
REVIEW_VERDICT = ACCEPTED_AS_VALID_BLOCKED_BATCH
MASTER_QUALIFICATION_PROMOTION = NONE
BATCH_02_AUTHORIZATION = NO
MERGE_AUTHORIZATION = NO
RERUN_REQUIRED = F01 / F08 / F09 / F10
F14 = CONFIRMED_CURRENT_SURFACE_TOOL_GAP
```

The DEV handoff is internally consistent with the workpack and correctly avoids treating successful tool calls as PASS.

The five BLOCKED results must **not** be interpreted as evidence that CHAT cannot use the corresponding Figma capabilities. Four cases were prevented from completing by provider/environment constraints before the benchmark loop could finish.

## Independent review checks

1. GitHub evidence is complete:
   - five required case records exist;
   - `BATCH_REPORT.md` exists;
   - branch-local progress is at `BENCHMARK_REVIEW_REQUIRED`;
   - no INK/UI mutation is present in the branch diff;
   - no Batch 02 evidence is present.

2. Reviewer independently attempted Figma read/visual inspection of the benchmark file and received the same provider response:
   `You've reached the Figma MCP tool call limit on the Starter plan.`

3. Current installed Figma API guidance explicitly states:
   `Undo, notifications, external URLs, version-history saves, and closePluginWithFailure are not available through use_figma.`

Therefore the F14 undo/version-history limitation is independently confirmed as a current CHAT↔Figma surface gap.

## Case review

| Case | DEV result | Reviewer disposition | Capability conclusion |
| --- | --- | --- | --- |
| F01 | BLOCKED / TOOL_GAP | ACCEPT | Initial artifact exists by recorded node evidence, but required visual delta → self-correction → final inspection did not complete. No PASS/FAIL capability conclusion. |
| F08 | BLOCKED / TOOL_GAP | ACCEPT | Execution never began after quota exhaustion. No Boolean capability conclusion. |
| F09 | BLOCKED / TOOL_GAP | ACCEPT | Execution never began after quota exhaustion. No Auto Layout capability conclusion. |
| F10 | BLOCKED / TOOL_GAP | ACCEPT WITH FIXTURE NOTE | Five-page workpack topology exceeded Starter-plan 3-page limit; quota then prevented fallback. No component capability conclusion. |
| F14 | BLOCKED / TOOL_GAP | ACCEPT | Undo and version-history save are not exposed by the current `use_figma` surface. This is a genuine current surface gap independent of quota. |

## Reviewer classification

The batch exposes two different failure types and they must remain separate:

```text
PROVIDER_ENVIRONMENT_BLOCK
- Starter plan: 3-page file limit
- Starter MCP call quota exhausted
- affected: F01 / F08 / F09 / F10
- does not prove CHAT capability failure

CURRENT_SURFACE_TOOL_GAP
- callable undo unavailable
- callable version-history save unavailable
- affected: F14
- independently confirmed
```

The five DEV records may retain `AUTONOMY_CLASS = TOOL_GAP` because that is the closest class allowed by the workpack, but downstream analysis must use the reviewer distinction above.

## Workpack defect found

The requirement for five dedicated pages assumed a file topology that is incompatible with the available Starter plan.

For a rerun, isolate cases with Sections or another topology that fits the authenticated plan, while preserving case separation and evidence traceability. This is a future fixture correction, not a retroactive PASS-criteria change.

## Accepted conclusions

```text
F01 = UNRESOLVED / RERUN
F08 = UNRESOLVED / RERUN
F09 = UNRESOLVED / RERUN
F10 = UNRESOLVED / RERUN
F14 = BLOCKED / CURRENT_FIGMA_CHAT_SURFACE_TOOL_GAP
```

No mature-tool autonomy PASS is established by Batch 01.

No CHAT_GAP is established by Batch 01.

No master qualification result should be promoted from these five records.

## Next gate

```text
MTB-FIGMA-BATCH-01 REVIEW COMPLETE
→ hold Batch 02
→ prepare bounded Figma Batch 01 rerun fixture for F01/F08/F09/F10
→ preserve F14 as confirmed surface-gap evidence unless the Figma tool surface changes
```
