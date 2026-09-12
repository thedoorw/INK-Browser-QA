# INK CURRENT WORK ORDER — Structure Slimming / FLORA Optionalization v0.1

STATUS: `AUTHORIZED FOR DEV`

Product identity: `INK v0.1`

DEV branch: `working/INK-v0.1-structure-optionalization`

Authoritative starting point: commit `b1f65193b63fa3e2403752a197e19c998fd88ce6`

Verified Runtime baseline: GitHub Actions Run `34661788686` — `INK v0.1 Runtime Baseline` — Windows / Chrome — PASS.

## 0. Purpose

This is a bounded but substantial engineering workpack. The objective is to reduce structural coupling and Runtime payload while preserving validated general INK behavior.

Primary goal:

`preserve general INK → isolate optional capabilities → remove FLORA from mandatory startup/runtime path → keep FLORA source preserved and re-attachable → reduce Runtime graph → prove no regression`

This is NOT a feature expansion task. This is NOT a visual redesign task. This is NOT a deletion sweep. This is NOT a certification task.

## 1. Mandatory read order

Before modifying code, DEV must read:

1. `README.md`
2. `我說.md`
3. `AGENTS.md`
4. `ACTIVE/README.md`
5. `ACTIVE/INK_APPLICATION_HEALTH_REVIEW_v0.1.md`
6. `governance/INK_Product_Identity_v0.1.md`
7. `governance/INK_Application_Health_Gate_v0.1.md`
8. `governance/INK_Product_Boundary_v0.1.md`
9. this file

Historical Validation / research evidence is read-only unless explicitly needed for dependency analysis.

## 2. Frozen baseline / non-negotiable invariants

The following must remain true throughout this work:

- Product identity remains `INK v0.1`; do not introduce `v0.2`, `v1.x`, or release-style product sequencing.
- `FORMAT_VERSION = 4` remains unchanged unless separately authorized.
- Original imported evidence remains preserved and traceable.
- No bulk deletion of QA / Validation / research / historical material.
- General INK drawing, vector, image, natural-media, document/history, render/export, material/recompute, selection/transform, and basic program-import behavior must not be intentionally reduced.
- The existing Windows Runtime baseline is the compatibility reference.
- `main` is not modified by DEV.
- Do not label any result `Certified`.
- Do not produce final package promotion unless separately authorized.

## 3. Scope hierarchy

### P0 — Dependency map before surgery

DEV must first produce an explicit live dependency map for the browser Runtime, starting from `product/source/index.html` and `product/source/src/ink.js`.

At minimum classify live modules into:

- CORE_RUNTIME
- CORE_UI
- FLORA_CAPABILITY
- AI_CAPABILITY
- RECIPE_AUTOMATION
- PWA_SHELL
- RUNTIME_ASSET
- SCHEMA
- ENGINEERING_ONLY
- HISTORICAL_ONLY

Required output:

`working/DEPENDENCY_MAP.md`

The map must identify import edges that force FLORA, AI, or Recipe into startup.

Do not refactor until the dependency map is committed.

### P1 — FLORA optionalization

Current problem: FLORA is hard-wired into the general Runtime path.

Required target architecture:

```text
INK CORE
  └─ capability registry / optional loader boundary
       ├─ FLORA (optional)
       ├─ AI (kept as-is unless needed for boundary)
       └─ Recipe (kept as-is unless needed for boundary)
```

DEV shall:

1. remove mandatory static FLORA import(s) from general startup where practical;
2. introduce a small explicit capability boundary rather than scattered conditionals;
3. make FLORA installable/attachable only when requested or enabled;
4. preserve all FLORA source files and tests/evidence;
5. ensure general INK can initialize with FLORA absent from the loaded module graph;
6. ensure FLORA failure cannot prevent core Runtime startup;
7. avoid fabricating a new plugin framework larger than the problem requires.

Preferred design properties:

- one clear capability registration/install seam;
- deterministic capability state;
- no global monkey-patching unless already unavoidable;
- no silent fallback that hides startup errors;
- optional capability can report `available / unavailable / failed / installed`;
- core must not know FLORA domain-specific internals.

### P2 — Structural slimming

After FLORA is optional, reduce mandatory Runtime structure without sacrificing general INK behavior.

Candidates to inspect:

- modules reachable only through FLORA;
- duplicate compatibility wrappers;
- dead startup imports;
- Runtime modules used only by engineering/headless tooling;
- stale browser-release wiring not needed by current `INK v0.1` Runtime;
- duplicated identity/version literals;
- compatibility launcher code that can remain outside the future single-file Candidate.

Rules:

- slimming is dependency-driven, not file-count-driven;
- do not remove code merely because it is large;
- do not delete evidence because it is not Runtime;
- if uncertain, move it outside mandatory Runtime or leave it preserved;
- every removal from mandatory Runtime must have a documented reason.

Required output:

`working/SLIMMING_REGISTER.md`

Each entry must state:

`item → previous dependency → action → reason → preserved location → regression risk → verification`

### P3 — Identity normalization in live Runtime only

Normalize remaining live Runtime identity surfaces that still present stale `1.6.0 / 1.6.5-RC` product identities where those strings represent current product identity rather than historical protocol/schema/component identity.

Do NOT globally replace version strings.

For each changed literal, DEV must decide one of:

- CURRENT_PRODUCT_IDENTITY → normalize to `INK v0.1` / `0.1`
- COMPONENT_PROTOCOL_VERSION → preserve
- FILE/SCHEMA_VERSION → preserve
- HISTORICAL_EVIDENCE → preserve

Record decisions in `working/IDENTITY_REGISTER.md`.

### P4 — Optional capability behavior

FLORA optionalization must support at least these two modes:

**Core mode**
- INK starts without FLORA loaded.
- general Runtime does not throw because FLORA is absent.
- FLORA-specific UI/action entry must be absent, disabled, or explicitly report unavailable; no broken control.

**FLORA-enabled mode**
- FLORA can be installed/loaded through the new boundary.
- existing FLORA functions remain reachable to the extent they were before refactor.
- failure to load FLORA is surfaced as capability failure, not core crash.

No new end-user plugin marketplace/UI is required.

## 4. Regression gates

### Gate A — Static integrity

DEV must verify:

- no syntax errors in changed JS;
- no broken import paths;
- no missing Runtime assets introduced;
- no circular startup dependency newly introduced;
- current product identity remains `INK v0.1`.

### Gate B — Node-free Windows Runtime baseline

The existing GitHub workflow is authoritative for startup compatibility:

`.github/workflows/ink-v0.1-runtime-baseline.yml`

It must run on the self-hosted Windows runner and PASS after meaningful Runtime changes.

At minimum the baseline must continue proving:

- browser process exits successfully;
- HTML returns;
- `#stage` exists;
- `INK v0.1` identity is visible;
- no Chrome error page.

DEV must extend this workflow only when necessary and must keep it Node-free.

### Gate C — Core interaction smoke

DEV must add or execute bounded interaction verification for at least:

- document initialization;
- basic drawing/stroke creation;
- undo / redo;
- layer create / reorder / delete where supported;
- selection / transform;
- save/open or equivalent document serialization round-trip;
- export path initialization;
- reload/persistence path where available.

Automation may use browser scripting available on Windows, but do not make local Node/npm installation a requirement for the Runtime gate.

### Gate D — FLORA detached core

Must prove:

- Core starts when FLORA is not loaded;
- no core import requires `src/flora/**`;
- no FLORA-specific symbol is required to construct the main app;
- core interaction smoke still passes.

### Gate E — FLORA re-attach

Must prove:

- FLORA capability can be attached/loaded;
- capability state is observable;
- representative existing FLORA action can initialize without breaking core;
- detach/unavailable case is handled intentionally.

### Gate F — Size / graph evidence

Report before/after mandatory browser Runtime graph measurements.

Required metrics:

- reachable JS module count;
- reachable JS bytes;
- FLORA JS modules/bytes outside mandatory graph;
- mandatory startup entry modules;
- optional capability modules/bytes;
- total product/source bytes are informative only and are NOT the optimization target.

Historical analysis estimated roughly:

- Full runtime JS ≈ 1.46 MB
- Core + AI/Recipe without FLORA ≈ 1.04 MB

These are directional references, not pass/fail thresholds. DEV must measure actual branch state rather than force the code to match estimates.

## 5. Architecture requirements

Keep the solution small.

Acceptable pattern example:

```js
registerCapability({
  id: 'flora',
  load: () => import('./flora/index.js'),
  install: module => module.installFloraActionLayer(app)
})
```

This is illustrative, not mandatory.

Avoid:

- a generalized plugin ecosystem with manifests, permissions, package resolution, remote loading, or marketplace semantics;
- duplicating the INK app object;
- forking core into `ink-core.js` and `ink-full.js` with divergent behavior;
- copy-pasting FLORA integration into multiple startup locations;
- hiding exceptions with broad empty `catch {}` blocks.

## 6. Files DEV may change

Primary authorized surface:

- `product/source/src/ink.js`
- `product/source/src/flora/**`
- `product/source/src/ai/**` only where current product identity or boundary coupling requires it
- `product/source/src/recipe/**` only where boundary coupling requires it
- `product/source/src/studio-core.js` only for capability boundary / live identity cleanup
- `product/source/index.html` only for correct capability/runtime wiring and visible identity
- `product/source/service-worker.js` / `manifest.webmanifest` only if dependency changes require it
- relevant tests under `qa/core/**`
- Runtime workflow under `.github/workflows/**`
- new focused engineering helpers under `engineering/**`
- `working/**` status/evidence registers

Anything outside this surface requires written justification in `working/WORKING_STATUS.md` before modification.

## 7. Forbidden actions

DEV must NOT:

- modify `main`;
- delete or rewrite the original import baseline;
- delete Validation or research because it is “unused by Runtime”;
- rename the product to a new version;
- change `FORMAT_VERSION = 4`;
- change document schema/migration behavior merely to simplify optionalization;
- redesign UI;
- add new drawing features;
- rewrite AI/Recipe architecture unless required for FLORA separation;
- certify or package a final release;
- bypass failing tests by weakening assertions without cause.

## 8. Milestones

### M1 — Analysis freeze
Deliver:
- `working/DEPENDENCY_MAP.md`
- baseline module/byte measurements
- exact FLORA coupling list
- planned change list

Then commit.

### M2 — Capability seam
Deliver:
- minimal optional capability mechanism
- core startup independent of FLORA
- no FLORA deletion
- static checks
- Node-free Windows Runtime PASS

Then commit.

### M3 — FLORA re-attach
Deliver:
- FLORA load/install path
- capability state/reporting
- representative FLORA initialization check
- failure isolation
- Runtime PASS

Then commit.

### M4 — Structural slimming
Deliver:
- remove mandatory dead/capability-only imports
- preserve engineering/evidence material
- `working/SLIMMING_REGISTER.md`
- before/after graph metrics
- Runtime PASS

Then commit.

### M5 — Live identity cleanup
Deliver:
- `working/IDENTITY_REGISTER.md`
- current product surfaces normalized to `INK v0.1`
- historical/protocol/schema identities preserved
- Runtime PASS

Then commit.

### M6 — Regression closure
Deliver:
- core interaction smoke results
- FLORA detached proof
- FLORA enabled proof
- persistence/serialization smoke
- final graph metrics
- `working/WORKING_STATUS.md` marked READY_FOR_REVIEW

Then STOP.

## 9. Required WORKING_STATUS format

`working/WORKING_STATUS.md` must always contain:

- STATUS
- current milestone
- branch
- baseline commit
- latest commit
- files changed
- decisions made
- unresolved risks
- latest Runtime Run ID + result
- core interaction result
- FLORA detached result
- FLORA enabled result
- before/after Runtime graph measurements
- next authorized step

Update it at each milestone.

## 10. Acceptance criteria

DEV work is READY_FOR_REVIEW only if all are true:

1. general INK starts without FLORA in mandatory module graph;
2. FLORA source remains preserved and can be re-attached through one explicit boundary;
3. Node-free Windows Runtime baseline PASSes on the DEV head;
4. core interaction smoke has no known regression attributable to this work;
5. document persistence/serialization path has no known regression attributable to this work;
6. no historical/QA/research evidence was silently deleted;
7. live current product identity remains `INK v0.1`;
8. graph/size evidence is reported before and after;
9. registers and WORKING_STATUS are complete;
10. DEV stops and requests review rather than promoting/certifying.

## 11. STOP RULE

After M6 and `READY_FOR_REVIEW`:

**STOP.**

Do not continue into:

- AI optionalization,
- Recipe optionalization,
- single-file `INK.html` build,
- final package,
- certification,
- promotion to `main`,

unless a new work order explicitly authorizes it.
