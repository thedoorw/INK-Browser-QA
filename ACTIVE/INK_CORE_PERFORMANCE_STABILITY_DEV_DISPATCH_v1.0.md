# Main-program performance / stability optimization dispatch — 2026-10-03

AUTHORITY: ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md
OWNER_ROLE: INK Main-Program Optimization DEV
STATUS: CLOSED / AUTHORITY ACCEPTED / PR #142 / FORMAL LIVE QUALIFIED
BRANCH: work/ink-core-performance-stability-001
SOURCE: thedoorw/INK-Browser-QA
LIVE: thedoorw/INK

## Entry

Start from latest source main. Read README.md, AGENTS.md, ACTIVE/INK_CURRENT_WORK_ORDER.md, ACTIVE/INK_LIVE_TEST_PROGRESS.md, this dispatch, and current Live BUILD_INFO.json / TEST_FINDINGS.md. Check active branches and owners before editing shared files.

A5 is closed: source 20b06020bbb6b6142dc1f6952ebf26e14ed268dd, PR #137, Formal Live run 37094249144. Paper singleton and roughness repairs and B4 are also accepted baselines. Do not reopen those tasks from obsolete chronological OPEN markers. UI PR #109 and other active capability lanes retain their owners.

## Bounded objective

Improve the existing program's measured runtime behavior, not expand capability coverage.

Measure the existing native multi-Stroke drawing route (Brush/DryBrush and accepted Blender/Smudge) and representative editable-raster image-stack route. Include existing Preview, render invalidation and History Undo/Redo. Use bounded representative and larger workloads, record object/raster sizes, backend, warm/cold state and repeated timing observations. Inspect resource retention where the authorized runtime supports it. State measurement limits; do not invent a memory-leak or speed threshold.

Identify one reproducible bottleneck or stability defect with source-level cause. Select the smallest repair with greatest measured impact, under existing mutation/Renderer/History authorities. Repair it and compare identical before/after workloads. This dispatch authorizes a bounded repair of demonstrated unnecessary repeated work or resource-lifecycle defect within existing semantics. If no actionable issue is reproduced, return measurements and a NO_FIX_REQUIRED disposition; do not manufacture an optimization.

## Boundaries

No UI changes, FORMAT_VERSION change, new state/Renderer/History/Stroke/raster authority, broad refactor, capability redesign, GPU mixer parity expansion, Paint Session mixer exposure, New Document/A4 work, or full-program benchmark infrastructure.

Avoid source files owned by an active lane; report concrete overlap to authority before competing edits. User architectural decisions remain binding.

## Verification and delivery

Preserve native stable refs, canonical/reversible state, exact Undo/Redo geometry, renderer-backed Preview and output behavior. Run focused checks for the repaired path and affected A1/A2/A3/A5/B2/B4 regressions; broaden only where the changed source can affect them.

Deliver immutable candidate identity, bounded diff, before/after measurement evidence and risks to authority for review. DEV does not self-accept or self-merge. Authority continues accepted work through PR integration, exact deployed source identity, Formal Live focused/regression verification and findings/progress closure. Unit PASS, candidate readiness and first Live timeout are not terminal closure.

Record reproducible workloads, observed outcomes, source cause, exact candidate and evidence in working/INK_CORE_PERFORMANCE_STABILITY_RETURN_20261003.md and an appropriate qa/evidence directory.


## Closure

Superseded by `working/INK_CORE_PERFORMANCE_STABILITY_AUTHORITY_CLOSURE_20261003.md`. Do not restart this completed dispatch. Original submitted candidate was revised for PERF-01 before acceptance; accepted source is `e095ee54a51f8562d03af248dca658cf321e6479`.
