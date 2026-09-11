# INK Product Boundary v0.1

STATUS: `PROVISIONAL / ANALYSIS BASELINE`

## 目的

把歷史研發混合包中的「產品 Runtime」與 QA、研究、開發工具、歷史證據分開，作為後續單檔 `INK.html` 與三件式 package 的邊界基線。

## 目前已確認的產品核心候選

- Drawing / Stylus
- Vector
- Raster / Image
- Natural Media
- Document / History
- Render / Export
- Material
- Recompute
- 基礎 Program Import
- UI shell

## BOUNDARY_PENDING

以下三類不得先入為主地併入或移出正式主程式：

1. PWA
   - `manifest.webmanifest`
   - `service-worker.js`

2. Assets / Schema
   - icons
   - runtime assets
   - JSON schemas

3. Automation / Specialization
   - FLORA
   - AI
   - Recipe

## 初步依賴結論

- FLORA 目前由主 Runtime 直接接入，但邊界相對集中，適合優先評估 optional capability 化。
- AI 目前已進 browser dependency graph，但是否屬 INK Core 仍待產品定位決定。
- Recipe 已帶入 material / recompute / program-import 等能力，不能只用「刪除 Recipe 模組」方式處理；需先辨識哪些能力其實應屬 Core。
- 現有 `index-standalone.html` 仍透過 `dist/ink.compat.js` 再 import `src/ink.js`，不是最終真正單檔產品。

## 三件式目標

```text
INK.html
WORKING_STATUS.md
SHA256SUMS.txt
```

建立 Candidate 前必須確認：
- 單檔啟動成功
- 手繪 / stylus
- vector
- raster / image
- history
- export
- 需要保留的 automation capability
- 無未處理的外部 runtime dependency

在上述驗證完成前，不得標示為 certified product。
