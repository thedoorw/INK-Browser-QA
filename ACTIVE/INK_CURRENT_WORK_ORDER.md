# INK CURRENT WORK ORDER

STATUS: `INK-RUNTIME-AUTOMATION-001 / MR_PASS / PROMOTED / RUNTIME_PASS / CLOSED`

```text
TASK_ID = INK-RUNTIME-AUTOMATION-001
TITLE = Central Runtime Queue & Auto Dispatch v0.1
DEV_BRANCH = work/ink-runtime-automation-001
DEV_HANDOFF = c69f96e5a5a3ce310acab96af946675c96f96397
PROMOTION_PR = #39 / MERGED
PROMOTED_MAIN = d698df7c26b0365cb3e240a8fea685a454176c2c
QUEUE_TRIGGER_COMMIT = df67e6156b89885711363cfd491adbbaf1307488
WINDOWS_RUNTIME = PASS / 35748328916
RUNTIME_TESTED_SHA = d698df7c26b0365cb3e240a8fea685a454176c2c
DISPATCH_SOURCE = queue
MANUAL_SHA_ENTRY_REQUIRED = 0
DEFAULT_BATCH_TARGET = 3
ALLOWED_BATCH_RANGE = 2-4
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS
FINAL_GATE = INK_RUNTIME_AUTOMATION_001_RUNTIME_PASS
FORMAT_VERSION = 4
```

The central Runtime path is now authoritative:

```text
MR promotion
→ MR updates central Runtime Queue
→ queue controller decides WAIT / READY
→ READY automatically launches self-hosted Windows Runtime
→ exact SHA remains pinned
→ artifact/evidence
→ MR clears covered Runtime debt
```

Manual fallback remains available with blank target input; copying a SHA is no longer required.

No subsequent implementation Work Order is authorized by this closure alone.
