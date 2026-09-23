# INK DEV PROGRESS

STATUS: `INK-TECH-DEBT-001 / DEV_IN_PROGRESS / BASELINE_VERIFIED`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-TECH-DEBT-001` |
| TITLE | `Main Runtime / Bootstrap / Offline / UI Foundation Cleanup v0.1` |
| BRANCH | `work/ink-tech-debt-001` |
| BRANCH_BASE | `aea1570d6013d682460b11c63498ce491caf470a` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_BASE_VERSION | `v0.1 / PRESERVE` |
| RUNTIME_QA | `REQUIRED AFTER DEV_HANDOFF + MR SOURCE REVIEW` |
| NEXT | `DEV_READ → IMPLEMENT BOUNDED CLEANUP → DEV_HANDOFF → STOP` |

## Read first

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. `working/WORKING_STATUS.md`
6. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
7. `research/INK_UI_DEBT_001_SHELL_PANEL_AUTHORITY_REPORT_v0.1.md`
8. relevant product / QA files named by the Work Order

## Confirmed baseline debt

```text
source JS+JSON = 189
service-worker SOURCE_SHELL = 176
missing offline closure entries = 13

web-shell startup = polling for INK_APP / 50 ms / max 40 retries

styles.css = historical layered authority
UI-006 Phase B currently adds a light-shell override layer

src/ink.js = production bootstrap + embedded INK_TEST control surface

Web / Portable HTML = duplicated full shell with only bounded delivery differences
```

DEV must verify these figures against branch HEAD before changing code.

## Work sequence

```text
A offline closure
→ B cache/update identity
→ C bootstrap readiness authority
→ D production QA-hook boundary
→ E shared shell/CSS authority cleanup
→ F stale active metadata
→ source/static/unit/parity evidence
→ DEV_HANDOFF
→ STOP
```

Do not perform Runtime before MR source review unless a local focused browser check is needed for development. Authoritative exact-SHA Runtime belongs to the MR gate.

## Hard boundaries

```text
Document authority = NO CHANGE
History semantics = NO CHANGE
Revision semantics = NO CHANGE
Renderer authority = NO CHANGE
ImageTracer tuning = NO
CHAT Phase A/B reopen = NO
CHAT Phase C = NO
UI-006 Phase C-I = NO
new framework = NO
base-version bump = NO
package mutation = NO
```

## Checkpoint template

At each meaningful checkpoint append:

```text
COMMIT =
MILESTONE =
FILES_CHANGED =
CHECKS =
KNOWN_GAPS =
```

## Handoff contract

Final branch state must record:

- exact HEAD;
- complete changed-file list;
- source/static/unit results;
- source-tree vs Service Worker closure count;
- Web / Portable parity;
- bootstrap authority evidence;
- cache/update identity evidence;
- QA-hook boundary evidence;
- CSS authority before/after;
- stale metadata corrections;
- FORMAT_VERSION 4 preserved;
- product v0.1 preserved;
- Document / History / Revision / Renderer authority preserved.

Then:

```text
TASK_STATUS = DEV_HANDOFF
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## Checkpoint 1 — Baseline verification

```text
COMMIT = be8285927d133cef994c5e8eef11034c0a74a4f7
MILESTONE = READ_COMPLETE / BASELINE_VERIFIED / DEV_IN_PROGRESS
FILES_CHANGED = ACTIVE/INK_DEV_PROGRESS.md only
CHECKS =
  required authority/governance files read
  product/source/src JS+JSON = 189
  service-worker SOURCE_SHELL = 176
  missing offline closure entries = 13
  extra offline closure entries = 0
  web-shell retry polling = confirmed / 50 ms / max 40
  production window.INK_TEST = confirmed embedded in src/ink.js
  CSS accepted desktop authority = INK-UI-DEBT-001 single region confirmed
  FORMAT_VERSION = 4 confirmed
  product display version = v0.1 confirmed
KNOWN_GAPS =
  six authorized cleanup items not yet implemented
  authoritative Runtime intentionally not run before DEV_HANDOFF + MR source review
```
