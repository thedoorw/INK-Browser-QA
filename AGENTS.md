# INK Agent Contract

AI / Agent 進入本 repository 時，依下列順序讀取：

1. `README.md`
2. `我說.md`（只理解使用者原文，不把原文自動視為實作授權）
3. `ACTIVE/README.md`
4. 若存在 `ACTIVE/INK_CURRENT_WORK_ORDER.md`，本輪先讀並以它作為目前工作範圍與 STOP RULE
5. 本次任務需要的 `governance/` 文件
6. 只讀任務真正需要的 product / qa / research / engineering 內容

## 固定安全規則

- 未經明確授權，不修改正式產品行為。
- 原始 INK v1.6.5 RC 工程包的身份以 SHA256 固定，不得在整理時改寫後仍宣稱為 original baseline。
- 研究價值、QA 證據價值或歷史追溯價值不明的資料，不直接刪除；優先保留或移入 `ARCHIVE/`。
- Product、QA、R&D、Engineering、Governance 必須分線，不把大型 Validation / research evidence 當成正式產品 payload。
- `manifest.webmanifest` / `service-worker.js`、圖示/素材/schema、FLORA/AI/Recipe 原為 `BOUNDARY_PENDING`；只有 current work order 明確授權的部分才可調整產品邊界。
- 正式三件式 package 目標為 `INK.html` + `WORKING_STATUS.md` + `SHA256SUMS.txt`，但在單檔 build 與功能驗證完成前不得宣稱 certified。
- 任何刪除必須有明確依據：無 Runtime 依賴、無 QA 證據價值、無研究價值、無治理/追溯價值。
- Current work order 的 STOP RULE 優先於自行延伸工作；到達 `READY_FOR_REVIEW` 後停止，不得自行進入下一 milestone、package、certification 或 main promotion。
