# INK REVIEW EVIDENCE

STATUS: `REVIEW_COMPLETE`

Product: `INK v0.1`

Reviewed DEV completion commit: `ceedcb44ff01d48c7f8aecb34c49107fceb4665c`

Runtime-bearing commit: `24911ec117211a930d04e8b51cdcd85764651fef`

Approved baseline: `b1f65193b63fa3e2403752a197e19c998fd88ce6`

Authoritative Runtime evidence: GitHub Actions Run `34677879593`

## 1. Git lineage and scope evidence

Comparison `b1f65193... -> ceedcb44...`:
- status: `ahead`;
- ahead: `16` commits;
- behind: `0`;
- merge base: `b1f65193b63fa3e2403752a197e19c998fd88ce6`.

Changed-file inventory from Git:
1. `.github/workflows/ink-v0.1-runtime-baseline.yml`
2. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
3. `ACTIVE/README.md`
4. `AGENTS.md`
5. `engineering/runtime-dependency-graph.mjs`
6. `product/source/index-standalone.html`
7. `product/source/index.html`
8. `product/source/service-worker.js`
9. `product/source/src/ai/install-ai.js`
10. `product/source/src/capabilities/optional-capability-registry.js`
11. `product/source/src/flora/index.js`
12. `product/source/src/ink.js`
13. `product/source/src/studio-core.js`
14. `qa/core/tests/unit/optional-capability-registry-v01.test.mjs`
15. `working/DEPENDENCY_MAP.md`
16. `working/IDENTITY_REGISTER.md`
17. `working/SLIMMING_REGISTER.md`
18. `working/WORKING_STATUS.md`

Comparison `24911ec... -> ceedcb44...`:
- one commit;
- only `working/WORKING_STATUS.md` changed.

Therefore the product-bearing bytes validated by Run `34677879593` are the same product-bearing bytes at the DEV completion commit.

Review branch ancestry check:
- review branch is descended from `ceedcb44...`;
- later review-branch changes are governance/review documentation and are not treated as changes to reviewed product bytes.

## 2. Dependency graph evidence

Inspected helper: `engineering/runtime-dependency-graph.mjs`.

Method verified from code:
- entry defaults to `product/source/src/ink.js`;
- resolves relative static ESM imports recursively;
- includes `export ... from` edges;
- counts each reachable module once;
- sums UTF-8 source bytes;
- literal dynamic imports are recorded separately and excluded from mandatory reachable totals;
- graph classification explicitly separates FLORA, AI, Recipe, PWA, Runtime assets, Core Runtime, and Core UI.

Recorded graph results cross-checked against the inspected topology:

| Metric | Baseline | Final |
|---|---:|---:|
| Mandatory eager JS modules | 133 | 97 |
| Mandatory eager JS bytes | 1,458,009 | 1,044,724 |
| Static ESM edges | 296 | 217 |
| Eager FLORA modules | 37 | 0 |
| Eager FLORA bytes | 420,473 | 0 |
| Literal optional edges | 0 | 1 |

Preserved optional FLORA source at final state:
- `37 modules / 423,935 bytes`.

The final module arithmetic is structurally consistent with the inspected cut: remove the 37-module eager FLORA subtree and add one mandatory domain-neutral capability registry, producing a net module reduction of 36 (`133 -> 97`).

## 3. FLORA seam code evidence

### Core registry

`product/source/src/capabilities/optional-capability-registry.js`:
- contains no FLORA-specific implementation;
- states are observable as `available`, `unavailable`, `failed`, `installed`;
- installation is explicit and asynchronous;
- installed hooks are stored generically;
- `some()` and `notify()` dispatch generic hook names;
- hook exceptions mark only the capability as failed.

### FLORA-owned integration

`product/source/src/flora/index.js`:
- preserves the FLORA source/import graph;
- exports `installInkCapability({ app })`;
- installs the existing FLORA action layer only when the capability is loaded;
- returns domain-neutral hooks:
  - `requiresIndividualRender`
  - `renderObject`
  - `renderOverlay`
  - `documentReplaced`
- representative Hero smoke executes `flora.hero.createBenchmarkPetal(...)` when explicitly requested by the Runtime test query.

### Core entry

`product/source/src/ink.js`:
- mandatory import surface includes `OptionalCapabilityRegistry`;
- no static `src/flora/**` import remains in the inspected Core import surface;
- architecture reporting derives optional capability identity from installed capability IDs rather than hard-coding FLORA as a Core module.

This supports the registered graph result of one optional Core-to-FLORA dynamic edge and zero eager FLORA modules.

## 4. Authoritative Windows Runtime evidence

Run: `34677879593`

Observed workflow metadata:
- workflow: `INK v0.1 Runtime Baseline`;
- branch: `working/INK-v0.1-structure-optionalization`;
- SHA: `24911ec117211a930d04e8b51cdcd85764651fef`;
- status: `completed`;
- conclusion: `success`.

Observed job metadata/log:
- job: `Windows Runtime Baseline`;
- runner: `DESKTOP-NSOQH69`;
- OS: Windows;
- browser: `C:\Program Files\Google\Chrome\Application\chrome.exe`;
- local Node/npm required by the Runtime baseline: `No`.

### Startup report

Status: `PASS`

All logged checks were true:
- browser exit code zero;
- HTML returned;
- `#stage` present;
- `INK v0.1` visible;
- live Runtime identity `0.1`;
- live Studio identity `0.1`;
- live AI identity `0.1`;
- format version `4`;
- FLORA detached state available;
- Chrome error page absent.

### Core interaction and persistence report

Status: `PASS`

All logged checks were true:
- core interaction smoke;
- document initialization;
- stroke creation;
- undo/redo;
- layer operations;
- selection/transform;
- serialization round-trip;
- export-path initialization;
- persistence/reload;
- FLORA detached;
- Chrome error page absent.

### FLORA-enabled report

Status: `PASS`

All logged checks were true:
- browser exit code zero;
- Core stage present;
- capability installed;
- representative FLORA action passed;
- capability failure absent;
- Chrome error page absent.

### Artifact

- name: `ink-v0.1-node-free-runtime-34677879593`;
- artifact ID: `10292189840`;
- uploaded files: `9`;
- artifact size: `59,272 bytes`;
- uploaded artifact ZIP SHA256: `439dda2215c22f0a12345b0072bd0a10261f2df428dd7bb9b5e573a68393eb4a`.

## 5. Identity evidence

`product/source/src/config.js`:
- `INK_VERSION = '0.1'`;
- `FORMAT_VERSION = 4`;
- user-facing title uses `INK v0.1`.

`product/source/src/studio-core.js`:
- imports current `INK_VERSION`;
- keeps `STUDIO_COMPONENT_PROTOCOL_VERSION = '1.6.0'` as a separate component/protocol identity.

`product/source/src/ai/install-ai.js`:
- imports current `INK_VERSION` while AI protocol-layer identities remain separate.

The Windows Runtime evidence independently confirms live Runtime / Studio / AI identity as `0.1 / 0.1 / 0.1` and document format identity as `4`.

## 6. PWA dependency evidence

`product/source/service-worker.js`:
- `RELEASE_VERSION = '0.1'`;
- mandatory `APP_SHELL` includes `./src/capabilities/optional-capability-registry.js`;
- no `src/flora/**` path is added to the mandatory shell list.

This is dependency-list completion, not a PWA redesign.

## 7. Program Import evidence boundary

No file under `product/source/src/program-import/**` is changed in the baseline-to-completion Git diff. The only related live construction adjustment is current-product identity normalization in the authorized Studio surface. The historical external-asset fixtures remain unavailable as already recorded; no code or Runtime evidence indicates a regression introduced by this work.

## 8. Register cross-check

- `working/DEPENDENCY_MAP.md`: consistent with inspected helper and code topology.
- `working/SLIMMING_REGISTER.md`: cut/retain decisions agree with actual changed product surfaces.
- `working/IDENTITY_REGISTER.md`: consistent with inspected current/product versus protocol/schema separation and Runtime output.
- `working/WORKING_STATUS.md`: Runtime and architecture claims are supported, with one nonblocking changed-file inventory omission recorded in `REVIEW_FINDINGS.md`.
