# INK Active

## Authoritative Current Control

Read in order:

1. `ACTIVE/INK_CURRENT_WORK_ORDER.md` — single current task / gate.
2. `working/WORKING_STATUS.md` — cross-window status + DEV branch fingerprint.
3. `ACTIVE/INK_REVIEW_STATUS.md` — MR review state.
4. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md` — durable MR/DEV gate rules.
5. `governance/INK_DEVELOPMENT_CHAT_HANDOFF.md` — cross-window recovery protocol.

DEV new-window instruction:
`ACTIVE/INK_DEV_NEW_WINDOW_START.md`

Current state:

`INK-CLOUD-003 → DEV_AUTHORIZED → work/ink-cloud-003`

Accepted previous baseline:
`INK-CLOUD-002 → SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED → promoted to main at 7c03793ce7d289d0a1ecf1fafe3602aa9eedff13`

Current structural-core target:
`Container / Ownership / Structural Semantics Foundation v0.1`

Cloud Start Gate remains blocked.

Legacy/detail files are retained:
- `ACTIVE/INK_MAIN_REVIEW_BOARD.md`
- `ACTIVE/INK_DEV_PROGRESS.md`

They preserve task detail and DEV evidence but do not override `ACTIVE/INK_CURRENT_WORK_ORDER.md`.

以下為早期匯入／分類的**歷史基線**，用於追溯，不代表目前 active engineering stage。\n\n目前 active engineering stage 以本文件最上方的 `Authoritative Current Control`、`ACTIVE/INK_CURRENT_WORK_ORDER.md` 與 `working/WORKING_STATUS.md` 為準。

## 現在已確認

- 原始來源：`INK_v1.6.5_RC_MAIN.zip`
- SHA256：`59d43a9650f4de20863e21723344b0fbf4307d5cbdb4a1a402929008d2f9e97d`
- ZIP bytes：`60406367`
- 檔案 entries（不含目錄）：`1471`
- 解壓總 bytes：`215908955`
- 真正 browser Runtime 為 MB 級，原始包的大多數容量來自 Validation / research / fixtures / development evidence。

## Full File Classification v0.1

完整 1,471 檔已完成第一輪分類：

| 分類 | 檔案數 | bytes |
|---|---:|---:|
| PRODUCT | 169 | 1,903,762 |
| QA | 1,076 | 201,599,510 |
| RESEARCH | 89 | 11,148,870 |
| ENGINEERING | 75 | 734,461 |
| GOVERNANCE | 32 | 101,227 |
| BOUNDARY_PENDING | 25 | 24,609 |
| ARCHIVE_CANDIDATE | 5 | 396,516 |

分類規則與判定：`governance/INK_File_Classification_v0.1.md`

目前沒有任何檔案被直接判定為可安全刪除。研究、deterministic rerun、rollback、benchmark、版本追溯證據一律先保留。

## 目前產品邊界

### Core candidate
- Drawing / Stylus
- Vector
- Raster / Image
- Natural Media
- Document / History
- Render / Export
- Material / Recompute / 基礎 Program Import

### BOUNDARY_PENDING
1. `manifest.webmanifest` / `service-worker.js`
2. 圖示、素材、schemas
3. FLORA / AI / Recipe

目前不刪除上述 pending 區塊；先以依賴與功能驗證決定是否納入正式 `INK.html`。

## 分批匯入順序

原始 ZIP 已在本地分析環境拆成下列批次，GitHub 依序接收：

1. `PRODUCT` — runtime source / shell / required assets
2. `ENGINEERING` — scripts / headless / compare / build utilities
3. `QA Core` — tests / fixtures / reports
4. `RESEARCH` — Intelligence / external references
5. `QA Validation` — 約 186 MB 解壓 evidence，另定大型證據長期儲存策略
6. `BOUNDARY_PENDING` — 在產品邊界 review 後決定去向
7. `ARCHIVE_CANDIDATE` — 保留追溯，不進 active product surface

## 下一個工程目標

建立乾淨 source / QA / research / engineering 分線，保留 original evidence，之後做第一個三件式 Candidate：

```text
INK.html
WORKING_STATUS.md
SHA256SUMS.txt
```

在功能驗證完成前，Candidate 不等於 certified baseline。
