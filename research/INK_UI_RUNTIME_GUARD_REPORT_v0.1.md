# INK UI Runtime Guard Report v0.1

Task: `INK-WEB-UI-002` · Branch: `work/ink-web-ui-002`
Starting HEAD: `5ad06e68334a2afa1551f595177e7c72ab44a0ec`
Authority: `ACTIVE/INK_CURRENT_WORK_ORDER.md`; no product redesign.

## Phase A — workflow audit

| Workflow | Observed trigger / classification | Process audit | Bounded disposition |
|---|---|---|---|
| `ink-cloud-018-self-hosted-preflight.yml` | `MANUAL_ONLY`, accepted historical preflight | `UNSAFE_PROCESS_LAUNCH`: explicit policy bypass and child PowerShell | Historical source retained; not current batch entry |
| `ink-cloud-018-windows-runtime.yml` | `AUTO_PUSH_ACTIVE` restricted to `work/ink-cloud-018`; `HISTORICAL_CLOSED_BRANCH` | `UNSAFE_PROCESS_LAUNCH`: bypass shell and child PowerShell server | Remove push block only; retain historical execution body |
| `ink-ra-001-windows-runtime.yml` | `AUTO_PUSH_ACTIVE` restricted to `work/ink-ra-001`; `HISTORICAL_CLOSED_BRANCH` | `SAFE_BOUNDED`: cmd/local .NET extraction; no explicit bypass | Remove push block only; retain historical execution body |
| `ink-v0.1-runtime-baseline.yml` | `MANUAL_ONLY`, historical reconstructed source target | Runner-managed PowerShell shells; not approved for new path | Unchanged historical baseline |
| `ra0-9-baseline-import.yml` | main-only push on bounded import paths; manual dispatch | Local extraction/import, not browser Runtime | Unchanged non-runtime import workflow |
| `unpack-staging-zip.yml` | `MANUAL_ONLY` | Historical packaging workflow, not browser Runtime | Unchanged; outside this package |
| UI-001 task workflow | Absent from assigned branch and promoted main | Excluded from UI-001 promotion | Do not copy forward or edit another branch |

The assigned branch already cannot trigger those historical task-specific pushes.
Removing their push blocks prevents inherited definitions from reactivating automatic
Runtime on reused task branches after promotion. Old remote branch revisions remain
historical and are not rewritten by this workpack.

Current shell inventory: `index.html` and `index-standalone.html` differ only in
explicit delivery labels, Web badge, manifest and modular/compat boot script.
Both already load the same stylesheet and `web-shell.js`; dock and Creative
Workspace are mounted dynamically. Product edits are not required.

The older Runtime standard contains a bypass example. It is superseded for this
work by the explicit Work Order / USER prohibition; it must not be copied.

Phase A gate: `RUNTIME_WORKFLOW_AUDIT_COMPLETE`.

## Implementation and evidence

Phase B: removed `on.push` blocks only from CLOUD-018 and RA-001 runtime YAML.
New `ink-runtime-batch-windows.yml` accepts only `workflow_dispatch`, requires
`target_ref`, resolves once to SHA, and verifies each bounded input against its
Git blob SHA. No checkout, Git binary, PowerShell or extraction subprocess.
A four-worker API download is bounded to product source, three reviewed harnesses,
the Rose Window fixture and the checked-in batch helper. Evidence records both
tested SHA and workflow SHA. Execution helper follows in Phase C.

Phase C: the checked-in Node helper owns the loopback HTTP server in the same
process. Chrome/Edge uses shell-free hidden child launch, a fresh profile per suite,
240-second callback deadline, PID-only process-tree cleanup and profile cleanup.
No PowerShell exists in the current workflow/helper. Windows standard's old bypass
recommendation is superseded. Historical workflows are not executed.

The batch runs the existing Web UI, creative-loop and geometry harnesses. QA-only
adapters preserve full UI checks, open the collapsed creative panel explicitly,
and transport geometry JSON. Per-suite logs/raw JSON plus aggregate result and
revision/blob fingerprint go to a 30-day artifact; failures remain failures.
Portable full browser delivery validation is not claimed by these Web harnesses.

Executed: `node --check qa/runtime/run-ink-runtime-batch.mjs`; helper tests 2/2
PASS (real local HTTP routes/MIME, traversal denial, malformed/duplicate callback,
and fail-closed evidence validation). These are non-browser helper tests.
Phase D: strict parity compares the complete HTML after replacing only the exact
application-name/title/menu-brand/brand/status labels, the one Web badge, the two
manifest links and the modular-versus-compat boot tag. Nothing else is removed.
This protects structure, attributes, command IDs, tool hooks, styles and scripts.
Explicit assertions also cover required regions/IDs, duplicate IDs, shared dynamic
dock targets, Layers/History and Reference/Compose/CHAT/Revision, shared CSS,
favicon/mark, Creative Workspace installation and collapsed containment.

Thirteen asymmetric HTML mutation cases are rejected, including changed hooks,
missing shared loading, added Web-only style/script, changed region element and
unauthorized identity. Workflow guard scans all current self-hosted definitions;
only the exact historical main-only RA import trigger is excepted. Active batch
source forbids policy/security/process patterns and requires every spawn to be
shell-free and hidden. Push/PR/schedule/workflow-run and unsafe-launch mutation
cases are rejected. Guard uses a fail-closed explicit trigger-block convention;
full YAML syntax is checked separately at closure.

Guard command: `node --test qa/core/tests/unit/shared-portable-web-shell-parity-v0.1.test.mjs qa/core/tests/unit/runtime-workflow-guard-v0.1.test.mjs`.
Result: 6/6 PASS. These tests need only Node and do not wake a Windows runner.
## Phase E — final source/static evidence

| Check | Result |
|---|---|
| Combined parity + workflow + helper unit tests | 8/8 PASS |
| All seven current workflow YAML files / duplicate keys | PASS (PyYAML BaseLoader) |
| Three inline action JavaScript scripts | PASS (Node async-function compilation) |
| Node helper and three browser harness scripts | PASS (`node --check`) |
| Whitespace/error diff check | PASS (`git diff --check`) |
| Product source tree against starting HEAD | Identical / zero product mutation |
| FORMAT_VERSION | 4 / unchanged |
| Product display labels | INK v0.1 · Web / INK v0.1 · Portable / unchanged |
| Runtime dispatch | Not performed |
| Browser and Windows process observation | DEFERRED_TO_BATCH |

Reproduction (Node v24.19.0 used for local source/helper checks):

```sh
node --test qa/core/tests/unit/shared-portable-web-shell-parity-v0.1.test.mjs qa/core/tests/unit/runtime-workflow-guard-v0.1.test.mjs qa/core/tests/unit/runtime-batch-helper-v0.1.test.mjs
node --check qa/runtime/run-ink-runtime-batch.mjs
git diff --check 5ad06e68334a2afa1551f595177e7c72ab44a0ec
git diff --exit-code 5ad06e68334a2afa1551f595177e7c72ab44a0ec -- product/source
```

The geometry callback is HTTP-only to retain the historical file:// harness path.
No package branch or main write was performed. Observed refs at closure:
main `d50c59ffb1c015b0776ac1864486869098be9181`;
package `efd9b1ededa3e0629ebe58d7462b3a62bac66915`.

## Changed files

- `.github/workflows/ink-cloud-018-windows-runtime.yml` — remove push block only.
- `.github/workflows/ink-ra-001-windows-runtime.yml` — remove push block only.
- `.github/workflows/ink-runtime-batch-windows.yml` — current manual entry.
- `qa/runtime/run-ink-runtime-batch.mjs` — bounded Node execution/evidence helper.
- `qa/runtime/ink-web-ui-001-harness.html` — full callback checks.
- `qa/runtime/ink-cloud-018-browser-harness.html` — explicitly open creative panel.
- `qa/runtime/ink-ra-001-browser-harness.html` — HTTP-only result callback.
- `qa/core/tests/unit/shared-portable-web-shell-parity-v0.1.test.mjs` — parity guard.
- `qa/core/tests/unit/runtime-workflow-guard-v0.1.test.mjs` — trigger/process guard.
- `qa/core/tests/unit/runtime-batch-helper-v0.1.test.mjs` — HTTP/evidence checks.
- `governance/INK_SELF_HOSTED_WINDOWS_RUNTIME_STANDARD.md` — current safe path.
- `ACTIVE/INK_DEV_PROGRESS.md` — checkpoint trail and handoff.
- `working/WORKING_STATUS.md` — handoff and explicit runtime debt.
- This report — the sole task report.

## Retained historical boundaries / remaining batch debt

Preflight, reconstructed baseline, RA import and staging unpack workflow files are
unchanged. CLOUD-018 and RA-001 execution bodies are retained; only their push
blocks change. Historical bypass/child-process code is not endorsed or run.
UI-001's unpromoted branch-local workflow is not copied, and old remote work
branches are not rewritten. This source change governs this branch and its later
MR-approved promotion, not a retroactive change to every historical branch.

MR's future manual batch must verify actual Windows API materialization, bundled
Node helper startup, all three Chrome harnesses, artifact retention/cleanup and
absence of extra consoles. No automatic Runtime verification is promised. Full
Portable file/compat runtime is outside the current Web harness coverage; this
workpack supplies the deterministic shell parity guard only.

Final source gate: **INK_UI_RUNTIME_GUARD_SOURCE_COMPLETE**.
Runtime: **DEFERRED_TO_BATCH**. Next: **MR_REVIEW_REQUIRED → STOP**.
