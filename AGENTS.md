# INK Agent Contract

GitHub is the SSOT.

## Read order

1. `README.md`
2. `我說.md` for user intent only — it is not automatic implementation authority
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
6. `working/WORKING_STATUS.md`
7. role/task-specific governance/workpack/evidence explicitly required by the Current Work Order

DEV also reads `ACTIVE/INK_DEV_NEW_WINDOW_START.md` and then the named work branch's branch-local progress file if present.

## Current-work authority

Global technical/Core/cross-lane authority:

`main:ACTIVE/INK_CURRENT_WORK_ORDER.md`

A delegated UI branch may carry a branch-local Current Work Order only inside an already approved UI program and only for UI-bounded work.

Historical status, research reports, archived Workpacks and chat memory cannot independently expand scope.

## Fixed safety rules

- Do not modify product behavior without explicit current authorization.
- DEV works on the named branch and stops at the owning Review gate.
- DEV does not self-merge main, promote, package/certify, or start the next task.
- Do not change FORMAT_VERSION unless explicitly authorized.
- Do not create a second Document, History, Revision, Renderer, Component, Material, Recipe, Repeat or CHAT mutation authority.
- Do not delete product/QA/research evidence merely because a task ID is old.
- Old task-named QA may be permanent regression coverage; dependency decides, not filename age.
- Imported historical documentation under `governance/source/` is not current authority by default.
- Repository cleanup follows `governance/INK_DOCUMENT_LIFECYCLE_STANDARD_v1.0.md`.

## Product / QA / Research separation

```text
product/     product source
qa/          regression/runtime evidence
research/    technical knowledge
engineering/ engineering utilities
governance/  durable rules
ACTIVE/      current authority
working/     current task only
ARCHIVE/     curated historical milestones
```

## Runtime

Windows/browser QA uses:

`governance/INK_SELF_HOSTED_WINDOWS_RUNTIME_STANDARD.md`

Current executable workflow:

`.github/workflows/ink-runtime-batch-windows.yml`

Do not equate GitHub-hosted quota/state with the availability of the user's Windows self-hosted runner.

For self-hosted PowerShell:
- prefer bounded local filesystem/compression/hash work;
- do not change machine/user execution policy;
- do not disable endpoint protection;
- do not download and immediately execute remote PowerShell;
- prefer checked-in logic and standard GitHub actions/API for repository mutation.

## UI

UI-only work follows:

`governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`

UI work may not silently change frozen Core/global authority.

## Packaging

Packaging follows:

`governance/INK_GitHub_Fast_Packaging_Standard.md`

Normal packaging is exact Git-object reuse, not a reason to rebuild or rerun Runtime when accepted source bytes are unchanged.

## Cross-window continuity

Follow:

`governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`

The branch plus GitHub evidence is the durable implementation record. Chat history is supplementary, not authoritative.
