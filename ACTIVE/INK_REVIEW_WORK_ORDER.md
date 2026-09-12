# INK v0.1 — Structure Optionalization Review Work Order

STATUS: `ACTIVE`

Product identity: `INK v0.1`

Review branch: `review/INK-v0.1-structure-optionalization`

Reviewed DEV branch: `working/INK-v0.1-structure-optionalization`

Authoritative DEV completion commit: `ceedcb44ff01d48c7f8aecb34c49107fceb4665c`

Latest verified Runtime-bearing commit: `24911ec117211a930d04e8b51cdcd85764651fef`

Original approved baseline: `b1f65193b63fa3e2403752a197e19c998fd88ce6`

Latest authoritative Windows Runtime evidence: Run `34677879593` — PASS.

## Review role

You are INK REVIEW. This is an independent review of the completed DEV work. Do not continue development unless a review finding requires a bounded correction and the user separately authorizes it.

Read in order:
1. `README.md`
2. `我說.md`
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. `ACTIVE/INK_REVIEW_WORK_ORDER.md`
6. `AGENTS.md`
7. `working/WORKING_STATUS.md`
8. `working/DEPENDENCY_MAP.md`
9. `working/SLIMMING_REGISTER.md`
10. `working/IDENTITY_REGISTER.md`
11. relevant governance files

## Review objective

Determine whether the completed DEV branch is safe to promote as the next validated INK v0.1 engineering baseline. This review does NOT authorize main promotion, certification, packaging, final `INK.html`, AI optionalization, Recipe optionalization, or a new milestone.

## Required checks

### R1 — Scope and commit integrity
- Confirm review branch begins exactly from DEV completion commit `ceedcb44...`.
- Compare `b1f65193...` to `ceedcb44...` and inventory all changed files.
- Confirm no unauthorized product areas were modified.
- Confirm DEV remains ahead of baseline without divergent history.

### R2 — FLORA dependency seam
- Independently verify Core has zero static/eager `src/flora/**` imports in the mandatory Runtime graph.
- Verify the only Core→FLORA connection is the intended optional dynamic capability edge.
- Verify FLORA source remains preserved and can be installed explicitly.
- Verify capability lifecycle/render hooks are domain-neutral enough to avoid reintroducing FLORA coupling under another name.

### R3 — Runtime graph reproducibility
- Re-run or independently reproduce dependency-graph measurement.
- Confirm before baseline: approximately 133 modules / 1,458,009 bytes.
- Confirm final mandatory graph: 97 modules and approximately 1,044,724 bytes.
- Confirm eager FLORA graph is 0 modules / 0 bytes.
- Explain the small post-M4 byte increase and verify it is attributable to authorized seam/identity/smoke work, not regression.

### R4 — Runtime behavior regression
- Verify latest Windows / Chrome / Node-free Run `34677879593` is PASS.
- Confirm checks cover startup plus the bounded Core interaction smoke claimed by DEV: initialization, stroke, undo/redo, layer create/reorder/delete, selection/transform, serialization, SVG export initialization, persistence save/load/reload, and FLORA detached state.
- Confirm FLORA-enabled representative Hero action also passes on the same Runtime-bearing commit.
- Treat missing historical external-asset Program Import fixtures as a recorded limitation, not automatically as a DEV failure, but confirm DEV did not worsen Program Import behavior.

### R5 — Identity correctness
- Verify current live Runtime product identity is `INK v0.1`.
- Verify Studio/AI live facade identity surfaces changed only where they incorrectly represented the current product.
- Verify historical evidence, protocol/schema/component identities, and `FORMAT_VERSION = 4` were not globally rewritten.

### R6 — PWA/runtime dependency completeness
- Verify `service-worker.js` includes the mandatory capability registry dependency where required.
- Verify no new FLORA mandatory PWA dependency was introduced.
- Do not redesign PWA architecture in this review.

### R7 — Registers and evidence quality
- Cross-check `WORKING_STATUS.md`, `DEPENDENCY_MAP.md`, `SLIMMING_REGISTER.md`, and `IDENTITY_REGISTER.md` against actual code and workflow evidence.
- Flag any claim that is not reproducible or not supported by code/evidence.

## Decision classes

The review must end in exactly one of these states:
- `REVIEW_PASS`
- `REVIEW_PASS_WITH_NONBLOCKING_NOTES`
- `REVIEW_RETURN_TO_DEV`

If returning to DEV, provide a bounded defect list with exact files, evidence, severity, and required correction. Do not implement the fixes in REVIEW unless explicitly authorized.

## Required output

Create/update:
- `review/REVIEW_STATUS.md`
- `review/REVIEW_FINDINGS.md`
- `review/REVIEW_EVIDENCE.md`

The status document must include:
- reviewed commit SHA
- Runtime evidence Run ID
- graph verification numbers
- FLORA detached/enabled verdicts
- identity verdict
- scope verdict
- blocking findings count
- nonblocking notes count
- final review decision

## STOP RULE

After producing the three review documents and final decision, STOP.

Do not:
- merge or promote to `main`
- mark Certified
- build the final package
- build final `INK.html`
- optionalize AI or Recipe
- start a new milestone
- silently repair DEV code
