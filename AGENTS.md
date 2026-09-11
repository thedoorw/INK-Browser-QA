# INK Agent Contract

AI / Agent 進入本 repository 時，依下列順序讀取：

1. `README.md`
2. `我說.md`（只理解使用者原文，不把原文自動視為實作授權）
3. `ACTIVE/README.md`
4. 本次任務需要的 `governance/` 文件
5. 只讀任務真正需要的 product / qa / research / engineering 內容

## 固定安全規則

- 未經明確授權，不修改正式產品行為。
- 原始 INK v1.6.5 RC 工程包的身份以 SHA256 固定，不得在整理時改寫後仍宣稱為 original baseline。
- 研究價值、QA 證據價值或歷史追溯價值不明的資料，不直接刪除；優先保留或移入 `ARCHIVE/`。
- Product、QA、R&D、Engineering、Governance 必須分線，不把大型 Validation / research evidence 當成正式產品 payload。
- `manifest.webmanifest` / `service-worker.js`、圖示/素材/schema、FLORA/AI/Recipe 目前是 `BOUNDARY_PENDING`；不得未經判定就硬塞入或移出正式主程式。
- 正式三件式 package 目標為 `INK.html` + `WORKING_STATUS.md` + `SHA256SUMS.txt`，但在單檔 build 與功能驗證完成前不得宣稱 certified。
- 任何刪除必須有明確依據：無 Runtime 依賴、無 QA 證據價值、無研究價值、無治理/追溯價值。
