# INK Active

目前階段：**Original Import Baseline + Product Boundary v0.1**。

## 現在已確認

- 原始來源：`INK_v1.6.5_RC_MAIN.zip`
- SHA256：`59d43a9650f4de20863e21723344b0fbf4307d5cbdb4a1a402929008d2f9e97d`
- ZIP bytes：`60406367`
- 檔案 entries（不含目錄）：`1471`
- 解壓總 bytes：`215908955`
- 真正 browser Runtime 為 MB 級，原始包的大多數容量來自 Validation / research / fixtures / development evidence。

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

## 下一個工程目標

建立乾淨 source / QA / research / engineering 分線，保留 original evidence，之後做第一個三件式 Candidate：

```text
INK.html
WORKING_STATUS.md
SHA256SUMS.txt
```

在功能驗證完成前，Candidate 不等於 certified baseline。
