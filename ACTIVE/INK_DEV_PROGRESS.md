# INK DEV PROGRESS

STATUS: `INK-CLOUD-007 / DEV_IN_PROGRESS / ENGINE_FIRST`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-007` |
| TITLE | `Extraction Engine + Reference-to-Path Technical Prototype + Rose Window Benchmark v0.1` |
| BRANCH | `work/ink-cloud-007` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING` |
| DEVELOPMENT_ORDER | `ENGINE_FIRST / BENCHMARK_AFTER` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED` |

## Authorized sequence

1. Phase A — Extraction core and adapter contracts
2. Phase B — Direct extraction implementations
3. Phase C — Reference → editable INK Path vertical slice
4. Phase D — Reusable structure-aware extraction layer
5. Phase E — Hard rose-window benchmark
6. Phase F — Selection report + DEV handoff

## Critical correction

The rose-window fixture is **not** a prerequisite for engine construction.

Do not wait on fixture intake, binary upload, external model download, or remote runtime when other bounded engineering work can continue.

Use deterministic/simple engineering fixtures first.

The user rose-window remains:

`CASE_A_PRIMARY / STRUCTURE_AWARE_HARD_REFERENCE`

but is consumed only after the generic extraction engine and Reference→Path slice are functional.

## Rules

- GitHub is SSOT.
- Re-read Current Work Order before implementation.
- Commit every meaningful checkpoint.
- Update this file continuously.
- Run feasible source/static/unit/serialization/engine checks.
- Never claim unexecuted tests as PASS.
- No main merge.
- No package update.
- No generic Cloud platform expansion.
- Missing hard benchmark binary is not a STOP.
- STOP only for FORMAT_VERSION change, accepted structural break, second core engine, or scope expansion.

## Start state

`READY_FOR_DEV_WORK / BEGIN_PHASE_A_ENGINE_CORE`

## Phase A — extraction core

Parent: `cddb59d541bbe2e2872cda570101727d0322a11d`.
Implemented request/result, RGBA/mask identity boundaries, contour hierarchy conversion, deterministic native Path IDs/provenance and cancellation/failure handling.
Engineering checks: `node --test qa/core/tests/unit/extraction-core-v0.1.test.mjs` (3 tests).
No benchmark-specific data in core. Canonical reference available locally for Phase E.
Runtime QA DEFERRED. Next: executable direct adapters.
