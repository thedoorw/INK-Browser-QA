# INK Agent Contract

AI / Agent 進入本 repository 時，依下列順序讀取：

1. `README.md`
2. `我說.md`（只理解使用者原文，不把原文自動視為實作授權）
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. `working/WORKING_STATUS.md`
6. role-specific active status / handoff documents
7. 本次任務需要的 `governance/` 文件
8. 只讀任務真正需要的 product / qa / research / engineering 內容

## Current-work authority

`ACTIVE/INK_CURRENT_WORK_ORDER.md` is the single authoritative current task.

`working/WORKING_STATUS.md` is the cross-window checkpoint and branch fingerprint record.

For cross-window continuation, read:
`governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`.

Legacy files such as `ACTIVE/INK_MAIN_REVIEW_BOARD.md` and `ACTIVE/INK_DEV_PROGRESS.md` may preserve detailed task history or branch-local DEV evidence, but they do not override the Current Work Order.

## 固定安全規則

- 未經 Current Work Order 明確授權，不修改正式產品行為。
- DEV 必須使用 Work Order 指定的 branch，持續 commit，並在 MR gate STOP。
- DEV 不得自行 merge 到 `main`、更新 `package/ink-current`、發版、certify 或開始下一張任務。
- 原始 INK v1.6.5 RC 工程包的身份以 SHA256 固定，不得在整理時改寫後仍宣稱為 original baseline。
- 研究價值、QA 證據價值或歷史追溯價值不明的資料，不直接刪除；優先保留或移入 `ARCHIVE/`。
- Product、QA、R&D、Engineering、Governance 必須分線，不把大型 Validation / research evidence 當成正式產品 payload。
- `manifest.webmanifest` / `service-worker.js`、圖示/素材/schema、FLORA/AI/Recipe 目前是 `BOUNDARY_PENDING`；不得未經判定就硬塞入或移出正式主程式。
- 正式三件式 package 目標為 `INK.html` + `WORKING_STATUS.md` + `SHA256SUMS.txt`，但在單檔 build 與功能驗證完成前不得宣稱 certified。
- 主程式 packaging 必須讀 `governance/INK_GitHub_Fast_Packaging_Standard.md`；預設採 exact Git blob/tree reuse → package branch → GitHub ZIP，不把 packaging 擴張成 PR merge、Actions、runner、Artifact 或 Runtime 工作。
- 現階段 modular package 可直接重用 `product/source/` 產品樹；其 validation status 必須清楚標示，不得冒充 certified baseline。
- 任何刪除必須有明確依據：無 Runtime 依賴、無 QA 證據價值、無研究價值、無治理/追溯價值。


## Self-hosted runtime baseline

Browser/runtime QA involving the user's Windows machine must first read:

`governance/INK_SELF_HOSTED_WINDOWS_RUNTIME_STANDARD.md`

Do not equate GitHub-hosted Actions quota exhaustion with self-hosted runtime unavailability. Reuse the existing `C:\actions-runner-ink` / `[self-hosted, Windows, X64]` path before inventing a new runtime route.
