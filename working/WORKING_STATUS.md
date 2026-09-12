# INK WORKING STATUS

STATUS: `IN_PROGRESS`

Product: `INK v0.1`

Branch: `working/INK-v0.1-structure-optionalization`

Authoritative work order: `ACTIVE/INK_CURRENT_WORK_ORDER.md`

Baseline commit: `b1f65193b63fa3e2403752a197e19c998fd88ce6`

Latest verified Runtime baseline:
- Workflow: `INK v0.1 Runtime Baseline`
- Run ID: `34661788686`
- Result: `PASS`
- Runner: `DESKTOP-NSOQH69`
- OS: Windows
- Browser: Chrome
- Node required: No

## Current milestone

`M1 — Analysis freeze: COMPLETE`

## Files changed

- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `engineering/runtime-dependency-graph.mjs`
- `working/DEPENDENCY_MAP.md`
- `working/WORKING_STATUS.md`

## Authorized-surface justification

- `engineering/runtime-dependency-graph.mjs` will be added as a focused, read-only graph measurement helper required by Current Work Order Gate F. It lives outside Runtime, introduces no product dependency, and makes before/after module and byte counts reproducible.
- `.github/workflows/ink-v0.1-runtime-baseline.yml` will later be adjusted within the explicitly authorized workflow surface so this DEV branch actually runs the authoritative Windows gate and can report detached/enabled evidence.
- `product/source/src/capabilities/optional-capability-registry.js` will be added as the one small, domain-neutral install/lifecycle/render boundary required by P1/P4. Keeping it separate from the 170 KB entry avoids new scattered conditionals and does not create a generalized plugin ecosystem.

## Decisions already fixed

- Product identity remains `INK v0.1` throughout development.
- FLORA is to become optional, not deleted.
- General INK Runtime must survive without FLORA loaded.
- Evidence / Validation / research remain preserved.
- Node-free Windows Runtime baseline remains authoritative for startup compatibility.
- This work ends at READY_FOR_REVIEW; no single-file Candidate or certification is authorized.

## Required DEV outputs

Completed:
- `working/DEPENDENCY_MAP.md`
- baseline mandatory graph: 133 modules / 1,458,009 bytes
- exact FLORA coupling list and frozen planned change list

Pending:
- `working/SLIMMING_REGISTER.md`
- `working/IDENTITY_REGISTER.md`
- after Runtime graph measurements
- core interaction smoke evidence
- FLORA detached evidence
- FLORA enabled evidence

## Unresolved risks

- FLORA currently participates in general Runtime startup and may have hidden side effects beyond direct imports.
- Studio Core also couples Recipe / AI; do not widen scope unless required for a clean FLORA seam.
- Historical version literals may represent protocol/schema/component identity rather than current product identity; classify before changing.
- Browser startup PASS does not by itself prove interaction or persistence behavior.

## Latest results

- Runtime startup: `PASS` at baseline commit.
- Core interaction: `PENDING`
- Persistence: `PENDING`
- FLORA detached: `PENDING`
- FLORA enabled: `PENDING`
- Runtime graph before: `133 modules / 1,458,009 bytes` (FLORA: 37 modules / 420,473 bytes)
- Runtime graph after: `PENDING`

## Next authorized step

Commit M1 analysis freeze. Then implement the minimal capability seam and detached Core without widening AI/Recipe scope.
