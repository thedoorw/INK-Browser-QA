# INK REVIEW STATUS

STATUS: `INK-RUNTIME-AUTOMATION-001 / MR_PASS / CLEAN_PROMOTION_REQUIRED`

```text
TASK_ID = INK-RUNTIME-AUTOMATION-001
TITLE = Central Runtime Queue & Auto Dispatch v0.1
DEV_BRANCH = work/ink-runtime-automation-001
DEV_HANDOFF_HEAD = c69f96e5a5a3ce310acab96af946675c96f96397
IMPLEMENTATION_EVIDENCE_HEAD = 1c7eb0c3521de0eb8e6401af49dab0b6945acec2
MERGE_BASE = 7ead914913dd05f4bcfac1a334769cd0c0a441f1
TOPOLOGY = diverged / ahead 6 / behind 9
PRODUCT_SOURCE_CHANGED = 0
MANUAL_SHA_ENTRY_REQUIRED = 0
DEFAULT_BATCH_TARGET = 3
ALLOWED_BATCH_RANGE = 2-4
QUEUE_ONLY_AUTO_TRIGGER = YES
FULL_RUNTIME_ON_EVERY_MAIN_PUSH = NO
EXTERNAL_BROWSER_AUTOMATION_DEPENDENCY = 0
WINDOWS_HIDE = PRESERVED
FORMAT_VERSION = 4
RUNTIME_QA = REQUIRED_AFTER_PROMOTION
```

## MR findings

- queue schema is bounded and governance-only;
- blank manual dispatch resolves main once and pins an exact SHA;
- explicit debug override remains available;
- only a main push changing `ACTIVE/INK_RUNTIME_QUEUE.json` invokes the queue controller;
- non-READY queue state skips the Windows job;
- READY state validates exact target SHA and bounded batch policy before dispatch;
- high-risk one-item immediate Runtime requires an explicit reason;
- existing self-hosted Windows labels, git-free materialization, exact blob verification, artifact evidence, cleanup and `windowsHide: true` remain intact;
- no product/source mutation, TinyFish, external browser-agent, PowerShell policy change, or FORMAT_VERSION change;
- evidence-head → DEV handoff changed only branch-local `ACTIVE/INK_DEV_PROGRESS.md`.

Decision: `MR_PASS / SOURCE_STATIC_REVIEW_PASS / RUNTIME_PENDING`.

Clean promotion must exclude branch-local DEV progress. Final closure requires one real self-hosted Windows run through the promoted central automation path.
