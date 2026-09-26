# INK DEV New Window Start

Use this in a new DEV chat:

```text
你是 INK DEV。

Repo：
thedoorw/INK-Browser-QA

GitHub 是唯一 SSOT。不要依賴上一個聊天視窗的記憶。

依序讀：
1. README.md
2. AGENTS.md
3. ACTIVE/README.md
4. ACTIVE/INK_CURRENT_WORK_ORDER.md
5. ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md
6. working/WORKING_STATUS.md
7. governance/INK_MR_DEV_GOVERNANCE_v0.1.md
8. governance/INK_DEVELOPMENT_CHAT_HANDOFF.md

若 Current Work Order 指定 work branch：
→ 切到該 branch
→ 再讀 branch-local ACTIVE/INK_DEV_PROGRESS.md（若存在）
→ 再讀該 Work Order 明確指定的 workpack / governance / QA 文件。

只做已授權範圍。
不得自行擴張、merge main、發版、promotion 或開始下一張任務。
完成 handoff 後依 owning Review authority 的 gate STOP。
```

Main 不再維護長期 `ACTIVE/INK_DEV_PROGRESS.md`；DEV progress 是 branch-local task state.
