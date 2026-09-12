# INK Evolution and Health Governance v0.1

STATUS: `ACTIVE`

Product identity: `INK v0.1`

Purpose: define the durable management method for INK evolution, health cleanup, review, promotion, and release preparation. This file is not a one-round checklist. It is the standing governance method that future INK REVIEW roles must use to decide what is healthy, what may evolve, what must stop, and what may become the next validated engineering baseline.

---

## 1. Role of INK REVIEW

INK REVIEW is not only a tester and not a second DEV.

Its durable responsibilities are:

1. protect the last verified working baseline;
2. independently verify DEV claims against code, graph, Runtime evidence, and Git history;
3. maintain product health before allowing further expansion;
4. keep Core, optional capabilities, QA, research, engineering, governance, and archive boundaries legible;
5. decide whether a completed work package is safe to promote as the next validated engineering baseline;
6. identify health debt and classify it as blocking or nonblocking;
7. design the next bounded work order only after the current round is closed and only within user authorization;
8. prevent version drift, hidden dependency growth, accidental product-surface expansion, and evidence loss;
9. stop development when evidence is insufficient rather than inventing a PASS.

REVIEW must remain independent from DEV. It may inspect, reproduce, compare, and document. It must not silently repair DEV code unless the user explicitly authorizes a bounded correction.

---

## 2. Core governance principles

### 2.1 Preservation first

Every change begins from a known verified baseline.

Before changing architecture or reducing Runtime:
- identify the exact baseline commit;
- identify the exact behaviors already verified;
- identify the evidence proving those behaviors;
- freeze them as non-regression requirements.

Do not trade known-good behavior for architectural cleanliness without explicit user authorization.

### 2.2 Health before expansion

When product health is uncertain, health work takes priority over adding features.

Health includes:
- Runtime startup;
- dependency integrity;
- product identity correctness;
- document/schema/protocol identity separation;
- persistence and reload;
- browser compatibility;
- PWA/runtime dependency completeness where applicable;
- regression evidence;
- product/QA/research separation;
- reproducible build or Runtime assembly;
- current work-order and status truthfulness.

### 2.3 Bounded improvement

Prefer one architectural cut at a time.

Examples:
- remove one mandatory dependency boundary;
- optionalize one capability;
- repair one identity surface;
- isolate one PWA dependency;
- consolidate one packaging path.

After each significant cut, re-run the authoritative Runtime/regression gate before making the next cut.

### 2.4 Evidence over narrative

Evidence priority is:

1. actual repository bytes / code;
2. dependency graph and reproducible measurements;
3. authoritative Windows browser Runtime evidence;
4. automated regression output and artifacts;
5. Git diff / commit history;
6. governance/register files;
7. DEV narrative or chat report.

If narrative conflicts with higher-level evidence, higher-level evidence wins.

### 2.5 Maintainability over arbitrary shrinking

A smaller file is not automatically a healthier product.

A valid slimming change must improve or preserve at least one of:
- dependency clarity;
- startup payload;
- capability boundaries;
- maintainability;
- testability;
- packaging clarity;
- failure isolation.

Do not remove useful structure merely to report a smaller byte count.

### 2.6 Preserve research and evidence value

Do not delete material solely because it is not Runtime.

Classify instead:
- PRODUCT;
- QA;
- RESEARCH;
- ENGINEERING;
- GOVERNANCE;
- OPTIONAL CAPABILITY;
- ARCHIVE / historical evidence.

Deletion requires positive evidence that the material has no Runtime dependency, no QA/evidence value, no research value, and no governance/traceability value.

---

## 3. Product identity governance

The user-facing product identity remains:

`INK v0.1`

until the user explicitly decides INK is complete enough to adopt another product version.

Development progress is expressed by stage labels, commit SHA, run ID, date, or package identity, not by incrementing the product version.

Examples:
- `INK v0.1 — Health`
- `INK v0.1 — Runtime`
- `INK v0.1 — Review`
- `INK v0.1 — Candidate`
- `INK v0.1 — Certified`

Engineering package version may use `0.1.0` when a SemVer field is technically required.

Never globally rewrite historical version strings.

Classify each version-like string before changing it:
- current product identity;
- component identity;
- protocol identity;
- schema/document format identity;
- migration input;
- historical evidence;
- benchmark/release-history label.

`FORMAT_VERSION = 4` is document-format identity and must not be changed merely because current product identity is `INK v0.1`.

Cache/build invalidation must not rely solely on the fixed product version. Use a separate build/cache identity when needed.

---

## 4. Product boundary governance

INK Core should contain only capabilities that are truly general and required for the base product.

Current general Core direction includes:
- Drawing / Stylus;
- Vector;
- Raster / Image;
- Natural Media;
- Document / History;
- Selection / Transform;
- Render / Export;
- Material;
- Recompute;
- basic Program Import.

Optional capabilities must connect through explicit, bounded seams and must not become hidden mandatory dependencies.

For every optional capability, REVIEW must verify:
- Core starts without it;
- no static/eager mandatory import remains unless explicitly authorized;
- capability source remains preserved;
- installation/attachment path is explicit;
- failure in the optional capability does not collapse Core startup;
- lifecycle/render hooks are domain-neutral enough that Core does not merely hide the coupling under renamed FLORA-specific calls.

FLORA is currently optionalized and must remain preserved unless a future work order changes that decision.

AI and Recipe must not be optionalized automatically just because FLORA was. Each requires its own dependency study, work order, and regression closure.

---

## 5. Health lifecycle

Every substantial INK evolution should follow this sequence:

`Health check -> verified baseline -> bounded work order -> DEV implementation -> regression -> independent REVIEW -> validated engineering baseline -> next authorized work order`

Do not skip directly from DEV completion to main/certification.

### Gate A — Baseline identity

Before work starts, record:
- baseline commit;
- current product identity;
- current branch;
- authoritative Runtime run/evidence;
- known limitations;
- protected behaviors.

### Gate B — Dependency and scope map

Before structural changes, identify:
- mandatory Runtime graph;
- optional/dynamic edges;
- capability ownership;
- PWA/runtime dependency surface;
- files authorized to change;
- files explicitly out of scope.

### Gate C — Bounded implementation

DEV may only modify the authorized surface needed to satisfy the current work order.

Large refactors must be decomposed where possible so regressions can be attributed to a specific cut.

### Gate D — Regression closure

After each major structural cut and at final DEV completion, re-run the authoritative Runtime gate.

Current authoritative startup compatibility gate is the Windows self-hosted Chrome/Edge Node-free Runtime baseline unless superseded by governance.

Where a work order changes user behavior, startup-only evidence is not sufficient. Add bounded interaction tests relevant to the changed behavior.

### Gate E — Independent REVIEW

REVIEW must reproduce or independently confirm:
- scope integrity;
- dependency claims;
- Runtime result;
- interaction/regression claims;
- identity correctness;
- registers/evidence consistency;
- no unauthorized milestone expansion.

### Gate F — Promotion decision

A work package may become the next validated engineering baseline only when:
- blocking findings = 0;
- authoritative Runtime/regression evidence is PASS;
- claims are reproducible;
- scope is clean;
- known limitations are explicitly documented;
- user authorizes promotion when promotion is required.

A REVIEW PASS is not the same as Certified.

---

## 6. Review decision policy

Every formal review ends in exactly one state:

- `REVIEW_PASS`
- `REVIEW_PASS_WITH_NONBLOCKING_NOTES`
- `REVIEW_RETURN_TO_DEV`

### REVIEW_PASS

Use only when:
- no blocking findings;
- no material unsupported claims;
- verified behavior matches work order;
- no unrecorded health debt introduced.

### REVIEW_PASS_WITH_NONBLOCKING_NOTES

Use when the work order is safely complete but there are bounded limitations that do not invalidate the current baseline.

Each note must state:
- affected surface;
- why it is nonblocking;
- evidence;
- recommended future treatment.

### REVIEW_RETURN_TO_DEV

Use when any of the following occurs:
- Runtime/regression FAIL;
- mandatory dependency still violates the work order;
- product identity is materially wrong;
- evidence is missing or cannot support a key PASS claim;
- unauthorized scope expansion occurred;
- persistence/document compatibility is broken;
- a previously verified capability regressed;
- a health debt introduced by the change blocks safe continuation.

Return findings must be bounded and actionable: exact file/surface, evidence, severity, expected correction, and required re-test.

---

## 7. Regression philosophy

Do not rely on one universal test forever.

Regression scope must match change risk.

Minimum preserved behavior set currently includes, where relevant:
- startup;
- drawing/stroke creation;
- undo/redo;
- layers;
- selection/transform;
- document serialization;
- SVG/export initialization;
- persistence save/load/reload;
- current-product identity;
- detached optional-capability startup;
- enabled optional-capability representative behavior.

When a new subsystem is changed, add a bounded regression check for that subsystem before declaring closure.

A test-harness failure and a product failure must be distinguished. If harness timing or environment is the cause, document the evidence and repair the harness before using the result as product evidence.

Never convert `BLOCKED_BY_ENVIRONMENT` into PASS.

---

## 8. Windows Runtime governance

The Windows self-hosted Runtime is used because it validates INK in a real user-class Windows browser environment.

Node/npm are not inherently required for the Runtime baseline. Engineering tests may use Node separately, but lack of Node on the user machine must not block a browser Runtime baseline when the product itself does not require Node.

For every authoritative Runtime run, preserve:
- run ID;
- commit SHA;
- runner identity;
- OS;
- browser path/version when available;
- PASS/FAIL;
- evidence artifact;
- checks performed.

A PASS on one commit does not automatically certify later commits. If product-bearing bytes change after the run, re-run unless REVIEW can prove the later commit is documentation-only and does not affect product or test semantics.

---

## 9. Dependency-graph governance

Dependency counts are measurements, not goals by themselves.

For each structural round record:
- before module count / bytes / static edges;
- after module count / bytes / static edges;
- optional dynamic edges;
- detached capability module count;
- reason for any size increase.

REVIEW must verify graph measurements are reproducible from repository state.

A small byte increase is acceptable if it is explained by an authorized seam, instrumentation, or maintainability layer and the mandatory dependency burden is reduced or clarified.

Do not hide optional dependencies by string-building imports or indirection solely to make graph counts look better.

---

## 10. PWA and runtime-shell governance

PWA shell is a separate architecture concern from general browser Runtime.

When Runtime adds a new mandatory file, verify service-worker/precache completeness where the PWA shell is still active.

Do not force optional capability source into mandatory PWA precache unless the product explicitly requires it offline.

Do not redesign PWA architecture incidentally during unrelated work.

Because `INK v0.1` remains fixed, future cache invalidation should use a separate build/cache identity rather than product version alone.

---

## 11. Data compatibility governance

Document compatibility is more important than cosmetic version cleanup.

Before changing document, import, export, migration, or persistence code:
- identify current format version;
- preserve migration fixtures;
- preserve historical appVersion inputs where they are migration evidence;
- verify new documents report current product identity;
- verify old documents still migrate as intended;
- verify persistence/reload where relevant.

Never conflate appVersion with FORMAT_VERSION.

---

## 12. Health debt register

Every unresolved issue should be classified:

### Blocking health debt

Blocks promotion or next milestone because it threatens correctness, reproducibility, compatibility, or product integrity.

Examples:
- Runtime FAIL;
- broken persistence;
- missing mandatory dependency;
- unreproducible graph claim;
- current-product identity conflict on live user surface;
- unknown regression in an already verified Core capability.

### Nonblocking health debt

May remain when explicitly recorded and bounded.

Examples:
- missing historical fixture not caused by current work;
- legacy evidence naming that is correctly historical;
- tooling improvement that does not affect Runtime correctness;
- optional cleanup with no current dependency impact.

Nonblocking does not mean forgotten. Record owner/surface and recommended future milestone.

---

## 13. Next-work-order design method

REVIEW may recommend the next work order only after current review closure.

Choose the next task by this priority:

1. blocking health debt;
2. structural risk that limits future safe change;
3. missing regression coverage around active architecture;
4. packaging/runtime reproducibility;
5. bounded product capability improvement;
6. optional optimization.

A good next work order must define:
- one primary objective;
- exact baseline commit;
- authorized files/surfaces;
- protected behaviors;
- explicit out-of-scope items;
- measurable gates;
- Runtime/regression requirements;
- required registers/evidence;
- STOP RULE.

Do not bundle unrelated milestones merely because DEV is available.

---

## 14. Candidate, package, and certification separation

These are distinct states:

### Validated engineering baseline

Code has passed its work order and independent review. It may still be modular and not be a user delivery package.

### Candidate

A specific deliverable form is assembled for final verification. Candidate is not automatically Certified.

### Package

The target formal package is expected to become:

`INK.html` + `WORKING_STATUS.md` + `SHA256SUMS.txt`

but package creation requires separate authorization and must preserve verified behavior.

### Certified

Certified means the exact packaged bytes have passed the required final gates and have explicit user-authorized promotion/certification.

Never call a DEV branch or REVIEW PASS "Certified" merely because tests passed.

---

## 15. Git and branch governance

Use branches to separate roles and authority:
- baseline/main: protected validated line;
- `working/...`: DEV implementation;
- `review/...`: independent review;
- `package/...`: exact package/candidate when authorized.

Before review, confirm merge base and ahead/behind state.

Do not rewrite or force-move validated history unless explicitly authorized.

Do not promote to main from REVIEW without explicit user authorization.

A documentation-only final status commit may follow the last Runtime-bearing commit. Record both SHAs so the evidence relationship stays explicit.

---

## 16. Required durable records

For structural work, preserve at minimum:
- current work order;
- `working/WORKING_STATUS.md`;
- dependency map;
- slimming/change register where relevant;
- identity register where relevant;
- Runtime evidence/run ID;
- review status;
- review findings;
- review evidence.

These records exist to allow a future REVIEW to recover project truth without relying on chat memory.

---

## 17. Fast onboarding rule for future REVIEW

A future INK REVIEW should not need to read the whole repository.

Read these first, in this order:

1. `README.md`
2. `AGENTS.md`
3. `governance/INK_EVOLUTION_AND_HEALTH_GOVERNANCE_v0.1.md`
4. current `ACTIVE/INK_REVIEW_WORK_ORDER.md` (or current review/current work order named by `ACTIVE/README.md`)
5. current `working/WORKING_STATUS.md`

Then read only the additional files explicitly named by the current work order.

If those five sources conflict, use this authority order:

`user explicit instruction > current ACTIVE work order > this governance > AGENTS.md > working status / registers > older repository documents`

Historical evidence never overrides a current authorized work order, but it must not be destroyed merely because it is old.

---

## 18. Permanent STOP principles

REVIEW must stop and ask for authority before:
- merging/promoting to main;
- declaring Certified;
- creating a final package;
- changing product version policy;
- deleting research/QA/history material of uncertain value;
- widening a work order into a new architecture milestone;
- optionalizing another major subsystem not authorized by the current work order;
- silently fixing DEV code during independent review.

The purpose of STOP is not bureaucracy. It preserves causality, evidence quality, and user control over product evolution.
