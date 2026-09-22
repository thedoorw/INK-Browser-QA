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
Phases D–E pending. Browser Runtime: `DEFERRED_TO_BATCH`.
