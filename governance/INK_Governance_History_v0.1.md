# INK Governance History v0.1

## Purpose

本文件只做一件事：把 INK 從歷史研發混合 ZIP 整理成可維護、可驗證、可交付工程倉庫的治理脈絡串起來。

它不是另一份詳細規格，也不複製各階段 evidence。細節仍以原始治理文件、Current Work Order、register 與 Runtime evidence 為準。

## 1. Original source frozen

原始來源固定為：

- `INK_v1.6.5_RC_MAIN.zip`
- SHA256: `59d43a9650f4de20863e21723344b0fbf4307d5cbdb4a1a402929008d2f9e97d`
- 1,471 files
- 215,908,955 bytes uncompressed

治理決策：先固定原始工程現場，再做分類、重構與產品化；後續整理結果不得反過來稱為 original baseline。

詳細來源：`INK_Original_Import_Baseline.md`、`INK_Original_Import_Verification.md`、`INK_FILE_INVENTORY_v0.1.csv`。

## 2. Mixed archive separated by responsibility

原始 ZIP 不是單純的產品包，內容同時包含 Runtime、QA/Validation、研究、工程工具、規格與歷史資料。

因此先依責任拆線為：

- PRODUCT — 使用者產品與 browser Runtime
- QA — tests、fixtures、Validation、reports
- RESEARCH — intelligence、external reference、design research
- ENGINEERING — scripts、headless、compare、build/validation utilities
- GOVERNANCE — 產品邊界、身份、健康門檻與工程規範
- BOUNDARY_PENDING — 尚需判定是否進正式產品的 PWA/schema/assets 等
- ARCHIVE_CANDIDATE — 移出 active surface、但不因陳舊直接刪除

治理決策：不是 Runtime 的資料不等於可以刪除；只有同時確認無產品、QA、研究、治理與歷史價值時，才可進入 delete candidate。

詳細來源：`INK_File_Classification_v0.1.md`、`INK_Product_Boundary_v0.1.md`。

## 3. Product identity and application health normalized

整理後將「產品版本」、「component/protocol version」、「file/schema/format version」與「historical evidence version」分開治理。

目前使用者可見產品身份固定為 `INK v0.1`；`FORMAT_VERSION = 4` 維持文件格式身份，不因產品版本而改寫。歷史 `1.5.1 / 1.6.0 / 1.6.5-RC` 等資料保留其原始語境，不做全域改寫。

同時建立 Application Health Gate，清理 live PWA/runtime 身份與失效依賴，並建立 Windows / Chrome / Node-free Runtime baseline。

詳細來源：`INK_Product_Identity_v0.1.md`、`INK_Version_Identity_Register_v0.1.md`、`INK_Application_Health_Gate_v0.1.md`、`../ACTIVE/INK_APPLICATION_HEALTH_REVIEW_v0.1.md`。

## 4. Runtime structure made healthier

在 `working/INK-v0.1-structure-optionalization` 完成第一輪 dependency-driven 結構整理：

- mandatory Runtime graph: 133 → 97 modules
- FLORA eager graph: 37 → 0 modules
- Core 可在不載入 `src/flora/**` 的情況下啟動
- FLORA 保留完整來源，改由單一 optional capability seam 載入
- Drawing、Undo/Redo、Layer、Selection/Transform、Serialization、SVG Export、Persistence 等 bounded regression smoke 通過
- Windows / Chrome / Node-free Runtime 最終 Run `34677879593`: PASS

治理決策：FLORA 是 optionalization，不是 deletion；瘦身以 dependency 與責任邊界為依據，不以檔案數或大小為目的。

詳細來源：`../working/DEPENDENCY_MAP.md`、`../working/SLIMMING_REGISTER.md`、`../working/IDENTITY_REGISTER.md`、`../working/WORKING_STATUS.md`。

## 5. Governance model formed

INK 現在採用以下工作模型：

1. authoritative baseline
2. Current Work Order
3. bounded DEV branch
4. dependency / identity / slimming evidence as needed
5. Windows Runtime regression gate
6. `READY_FOR_REVIEW`
7. STOP before promotion / certification / next milestone

DEV 不直接修改 main；工作完成不等於 certified；promotion 與正式 package 必須另經 Review / authorization。

## 6. Delivery direction

正式交付方向與 iCAD 相同：產品與工程倉庫分離，最終使用者 package 目標為：

- `INK.html`
- `WORKING_STATUS.md`
- `SHA256SUMS.txt`

目前尚未執行 single-file `INK.html` promotion / certification；現階段完成的是讓模組化 Runtime 先達到可 Review、可驗證、可再封裝的健康狀態。

## 7. Document minimization rule

為避免治理文件持續膨脹，後續固定採以下原則：

- 本文件是唯一治理歷史總索引；只追加重要階段結論與來源連結。
- 只有承擔新的長期約束責任時，才新增獨立 governance 文件。
- Current Work Order / Working Status 屬工作控制文件，不再為同一輪另做 summary 文件。
- dependency / slimming / identity register 只在工作單確實需要時建立；完成後保留作證據，不再複製成第二份摘要。
- 若新文件只是重述既有結論，改更新本文件或既有權威文件，不另開新檔。
- 歷史文件可移出 active surface，但不得因「文件較多」而刪除具有治理或證據價值的原始紀錄。

## Current state

目前結構瘦身 / FLORA optionalization 工作已到 `READY_FOR_REVIEW`。本文件只整理治理歷史，不改變該 DEV work order 的 Runtime 結論，也不代表 main promotion 或 certification。
