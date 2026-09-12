# INK Browser QA

這個 repository 用來把 INK 從歷史研發混合包整理成可維護、可驗證、可交付的正式產品與工程倉庫。

目前階段：`INK v0.1 — Structure Optionalization READY_FOR_REVIEW`

原則：
- 先固定原始工程現場，再做分類與重構。
- 不因整理而刪除仍具有研究或證據價值的資料。
- 產品 Runtime、QA、R&D、開發工具、治理文件分線管理。
- 正式交付目標為可驗證的三件式 package：`INK.html`、`WORKING_STATUS.md`、`SHA256SUMS.txt`。
- 治理文件採最少必要原則：歷史脈絡集中於單一總索引，只有承擔新的長期約束責任才新增獨立 governance 文件。

## 目前原始基線

來源檔：`INK_v1.6.5_RC_MAIN.zip`

- ZIP bytes: `60406367`
- SHA256: `59d43a9650f4de20863e21723344b0fbf4307d5cbdb4a1a402929008d2f9e97d`
- ZIP file entries（不含目錄）: `1471`
- 解壓總 bytes: `215908955`

原始 ZIP 身份以 SHA256 與 inventory 固定；後續分類、重構與產品化結果不得反稱為 original baseline。

## 第一眼入口

- `governance/INK_Governance_History_v0.1.md` — 從原始 ZIP 到目前產品治理狀態的唯一總歷史索引。
- `ACTIVE/README.md` — 現階段工作入口。
- `ACTIVE/INK_CURRENT_WORK_ORDER.md` — 目前正式工作單。
- `working/WORKING_STATUS.md` — DEV 最新正式狀態與 Runtime evidence。
- `governance/INK_Original_Import_Baseline.md` — 原始匯入基線。
- `governance/INK_Product_Boundary_v0.1.md` — 產品邊界。
- `governance/INK_Product_Identity_v0.1.md` — 現行產品身份規則。
- `governance/INK_Application_Health_Gate_v0.1.md` — 應用健康門檻。
- `AGENTS.md` — AI / agent 執行契約。
- `我說.md` — 使用者原文；未經另外交代不改寫。

目前不代表 certified product baseline；`READY_FOR_REVIEW` 完成後仍需獨立 Review / promotion authorization，才可進入正式 package 或 certification。
