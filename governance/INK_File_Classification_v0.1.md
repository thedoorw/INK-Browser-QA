# INK File Classification v0.1

來源：`INK_v1.6.5_RC_MAIN.zip`

本分類只處理「工程資訊架構」，不修改 INK 產品行為，也不把任何有研究或證據價值的內容直接刪除。

## 分類結果

| 分類 | 檔案數 | bytes | 判定 |
|---|---:|---:|---|
| PRODUCT | 169 | 1,903,762 | 主程式與 browser runtime 直接相關內容 |
| QA | 1,076 | 201,599,510 | tests、fixtures、Validation、reports |
| RESEARCH | 89 | 11,148,870 | Intelligence / external reference / design research |
| ENGINEERING | 75 | 734,461 | scripts、headless、compare、types、build/validation utilities |
| GOVERNANCE | 32 | 101,227 | 仍需人工判讀的規格與工程說明 |
| BOUNDARY_PENDING | 25 | 24,609 | manifest/service worker、schemas 等產品邊界待決定內容 |
| ARCHIVE_CANDIDATE | 5 | 396,516 | 舊 checksum / replacement instructions / 舊版本交接資訊 |

總計：1,471 files，215,908,955 bytes。

## 固定原則

1. `PRODUCT` 不代表已經 certified；只代表目前最接近產品 runtime 邊界。
2. `QA` 中大量重複輸出可能是 deterministic / rerun / rollback 證據，不因重複就刪除。
3. `RESEARCH` 有方法學與外部工具研究價值，先保留。
4. `ENGINEERING` 不進正式三件式產品包，但可留在工程 repository。
5. `BOUNDARY_PENDING` 必須逐項決定是否納入未來單檔 `INK.html`。
6. `ARCHIVE_CANDIDATE` 先移出 active surface，不直接刪除。
7. 真正 DELETE 需要同時滿足：無產品依賴、無 QA 證據價值、無研究價值、無治理追溯價值。

## 第一輪邊界觀察

- Browser runtime 核心約 1.5 MB 級，而不是 57.6 MB。
- `Validation/` 是工程包最大宗，應屬 QA evidence store，不屬正式產品 delivery。
- FLORA 現況是 runtime 硬依賴，但具有明顯 specialization 性質；應在後續 product boundary review 決定是否 optional 化。
- AI / Recipe 已進入產品能力鏈，不能在未驗證前直接移除。
- `manifest.webmanifest` / `service-worker.js`、圖示/素材/schema 仍維持 `BOUNDARY_PENDING`。

## 下一步

依此 inventory 分批寫回 GitHub：

1. Product runtime source
2. Engineering utilities
3. QA core（tests / fixtures / reports）
4. Research
5. Large Validation evidence（獨立長期儲存策略）

完整逐檔 SHA256 inventory 保存在本輪分析產物，待後續決定以 CSV 或 manifest 方式進 GitHub。
