# INK REVIEW FINDINGS

STATUS: `REVIEW_COMPLETE`

Product: `INK v0.1`

Reviewed DEV completion commit: `ceedcb44ff01d48c7f8aecb34c49107fceb4665c`

Latest verified Runtime-bearing commit: `24911ec117211a930d04e8b51cdcd85764651fef`

Original approved baseline: `b1f65193b63fa3e2403752a197e19c998fd88ce6`

Final decision: `REVIEW_PASS_WITH_NONBLOCKING_NOTES`

## Blocking findings

`0`

No blocking Runtime, dependency-boundary, identity, persistence, PWA dependency, or scope defect was found in the reviewed product bytes.

## Nonblocking findings

### NB-01 — WORKING_STATUS changed-file inventory is incomplete

Severity: `NONBLOCKING`

Affected surface:
- `working/WORKING_STATUS.md`

Evidence:
- Git comparison `b1f65193... -> ceedcb44...` shows 18 changed files.
- The comparison includes `ACTIVE/README.md` and `AGENTS.md`.
- The `Files changed` list in `working/WORKING_STATUS.md` does not list those two files.
- The `AGENTS.md` branch history identifies the relevant change as `Route DEV agent through current INK work order`, confirming it is governance/routing work rather than a Runtime product modification.

Why this is nonblocking:
- neither omitted file is part of the browser Runtime product bytes;
- no unauthorized product area was found among the actual product changes;
- DEV history remains a straight descendant of the approved baseline;
- the authoritative Runtime-bearing commit and DEV completion commit differ only by `working/WORKING_STATUS.md`.

Recommended treatment:
- at the next separately authorized governance/status maintenance point, reconcile the changed-file inventory so it exactly matches Git history;
- do not modify reviewed product bytes merely to correct this historical inventory omission.

## R1 — Scope and commit integrity

Verdict: `PASS_WITH_NB-01`

- DEV completion `ceedcb44...` is 16 commits ahead of `b1f65193...`, 0 behind, with the approved baseline as merge base.
- Review branch history descends from `ceedcb44...`; later changes are review/governance documentation, not reviewed product changes.
- `24911ec... -> ceedcb44...` changes only `working/WORKING_STATUS.md`, so the Runtime-tested product bytes are identical to the reviewed completion product bytes.
- No unauthorized product-area modification was identified.

## R2 — FLORA dependency seam

Verdict: `PASS`

- `src/ink.js` no longer has a static/eager FLORA import in the mandatory import surface.
- `OptionalCapabilityRegistry` is domain-neutral and has no FLORA-specific implementation knowledge.
- FLORA source is preserved under `product/source/src/flora/**`.
- FLORA installs through an explicit capability path and owns its FLORA-specific render/lifecycle behavior.
- Core-facing hooks are domain-neutral: `requiresIndividualRender`, `renderObject`, `renderOverlay`, and `documentReplaced`.
- capability hook failure is isolated into capability state `failed` rather than being allowed to collapse Core startup.

## R3 — Runtime graph

Verdict: `PASS`

Verified graph claims:
- baseline mandatory graph: `133 modules / 1,458,009 bytes`;
- final mandatory graph: `97 modules / 1,044,724 bytes`;
- final static edges: `217`;
- optional literal dynamic edges: `1`;
- eager FLORA graph: `0 modules / 0 bytes`;
- preserved optional FLORA source: `37 modules / 423,935 bytes`.

The graph helper is a deterministic local static-ESM traversal from `src/ink.js`: it recursively follows local static imports/exports, counts each reachable module once, sums UTF-8 source bytes, and reports literal dynamic imports separately from mandatory reachability. The final topology is consistent with the code inspection: the 37-module FLORA eager subtree is removed, one Core capability-registry module is added, and FLORA remains behind the one optional edge.

The M4-to-M6 increase from `1,040,023` to `1,044,724` bytes does not restore FLORA. The mandatory module count stays `97`; the increase is attributable to authorized identity observability and bounded regression-smoke code, with static edges moving from `215` to `217`.

## R4 — Runtime behavior regression

Verdict: `PASS`

Authoritative Windows Run `34677879593` is a successful Windows / Chrome / Node-free run against exact commit `24911ec...`.

Actual job logs report PASS for:
- startup;
- document initialization;
- stroke creation;
- undo/redo;
- layer create/reorder/delete;
- selection/transform;
- serialization round-trip;
- SVG/export initialization;
- persistence save/load/reload;
- FLORA detached state;
- FLORA enabled installation;
- representative FLORA Hero action;
- absence of Chrome error page and capability failure.

No Program Import module was structurally changed in this work. The known absence of historical external-asset Program Import fixtures remains a pre-existing evidence limitation; no evidence indicates this work worsened Program Import behavior.

## R5 — Identity correctness

Verdict: `PASS`

- live Runtime identity is `INK v0.1`;
- Runtime evidence independently reports Runtime / Studio / AI identity `0.1 / 0.1 / 0.1`;
- `FORMAT_VERSION = 4` remains unchanged;
- Studio/AI protocol/component identity `1.6.0` remains distinct from current product identity;
- no evidence of global rewriting of historical/schema/protocol identity was found.

## R6 — PWA/runtime dependency completeness

Verdict: `PASS`

- `service-worker.js` precaches `src/capabilities/optional-capability-registry.js`, which is now a mandatory Core dependency;
- no `src/flora/**` file was added to the mandatory PWA shell list;
- no PWA architecture redesign was introduced.

## R7 — Registers and evidence quality

Verdict: `PASS_WITH_NB-01`

`DEPENDENCY_MAP.md`, `SLIMMING_REGISTER.md`, and `IDENTITY_REGISTER.md` are consistent with inspected code, Git history, and Windows Runtime evidence. `WORKING_STATUS.md` is materially accurate about Runtime/graph/result state but has the bounded changed-file inventory omission described in NB-01.

## Next-stage recommendation impact

`ACTIVE/INK_NEXT_STAGE_RECOMMENDATION.md` does **not** require revision from this review.

Reason:
- no blocking health issue was found;
- NB-01 is governance/evidence hygiene and does not change product architecture priority;
- the recommendation remains recommendation only and does not authorize AI optionalization, promotion, packaging, certification, or any next milestone.
