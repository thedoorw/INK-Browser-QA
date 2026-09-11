# INK Browser QA

這個 repository 用來把 INK 從歷史研發混合包整理成可維護、可驗證、可交付的正式產品與工程倉庫。

目前階段：Original Import Baseline / Product Boundary 建立。

原則：
- 先固定原始工程現場，再做分類與重構。
- 不因整理而刪除仍具有研究或證據價值的資料。
- 產品 Runtime、QA、R&D、開發工具、治理文件分線管理。
- 正式交付目標為可驗證的三件式 package：`INK.html`、`WORKING_STATUS.md`、`SHA256SUMS.txt`。
- `manifest.webmanifest` / `service-worker.js`、圖示/素材/schema、FLORA/AI/Recipe 目前均屬產品邊界待確認項目。

## 目前原始基線

來源檔：`INK_v1.6.5_RC_MAIN.zip`

- ZIP bytes: `60406367`
- SHA256: `59d43a9650f4de20863e21723344b0fbf4307d5cbdb4a1a402929008d2f9e97d`
- ZIP file entries（不含目錄）: `1471`
- 解壓總 bytes: `215908955`

原始 ZIP 本身暫不直接塞進一般 main commit；先以不可歧義的 SHA256 固定來源身份，再決定大型 Validation / research evidence 的長期 Git 儲存方式。

## 第一眼入口

- `ACTIVE/README.md` — 現階段工作與產品邊界。
- `governance/INK_Original_Import_Baseline.md` — 原始匯入基線。
- `governance/INK_Product_Boundary_v0.1.md` — 初版產品邊界。
- `AGENTS.md` — AI / agent 執行契約。
- `我說.md` — 使用者原文；未經另外交代不改寫。

目前不建立新的 certified product baseline；現階段只建立可追溯的工程基線與整理規則。
