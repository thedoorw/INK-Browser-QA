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

## Full original import register

The full import preserves the following candidate boundary without deciding it:

### CORE CANDIDATE

- Drawing / Stylus
- Vector
- Raster / Image
- Natural Media
- Document / History
- Render / Export
- Material
- Recompute
- basic Program Import

### BOUNDARY_PENDING

| Group | Inventory rule | Files |
|---|---|---:|
| PWA shell | `manifest.webmanifest`, `service-worker.js`, `src/pwa/**` | 4 |
| Runtime assets | `ASSET_MANIFEST.json`, `assets/**`, `src/assets/**` | 15 |
| Schemas | `schemas/**` | 23 |
| FLORA | `src/flora/**` | 37 |
| AI | `src/ai/**` | 10 |
| Recipe | `src/recipe/**` | 5 |
| **Total** | status `BOUNDARY_PENDING` in inventory | **94** |

No icon files are present in the authoritative ZIP, although `manifest.webmanifest` and `service-worker.js` reference `icons/ink-192.png` and `icons/ink-512.png`. This is recorded as a source-package dependency gap, not repaired during preservation.

The exhaustive file-level register is `INK_FILE_INVENTORY_v0.1.csv`; filter its `status` column for `BOUNDARY_PENDING`. Files remain in dependency-preserving source positions and are not accepted into or removed from a certified product baseline by this document.

## 初步依賴結論

- FLORA 目前由主 Runtime 直接接入，但邊界相對集中，適合優先評估 optional capability 化。
- AI 目前已進 browser dependency graph，但是否屬 INK Core 仍待產品定位決定。
- Recipe 已帶入 material / recompute / program-import 等能力，不能只用「刪除 Recipe 模組」方式處理；需先辨識哪些能力其實應屬 Core。
- 現有 `index-standalone.html` 仍透過 `dist/ink.compat.js` 再 import `src/ink.js`，不是最終真正單檔產品。

## 主程式包封裝規則

- 正式 `INK-main-package.zip` 必須由 GitHub Actions workflow 直接從 `product/source/` 產生。
- 不以人工在檔案總管中逐一挑選檔案、複製資料夾或手動壓縮，作為正式主程式包的建立方式。
- 正常流程不要求使用者手動打包，也不要求每次手動按 Run workflow。
- `product/source/**` 的正式變更進入 `main` 時，Package workflow 應自動執行並產生新的 Artifact。
- `workflow_dispatch` 僅保留作為備用／重建入口；即使由人工觸發，實際封裝、完整性檢查與 ZIP 建立仍由 GitHub 執行。
- workflow 必須在上傳 Artifact 前檢查必要檔案與目錄、建立 `INK-main-package.zip`、計算 SHA256、重新解壓 ZIP，並確認解壓內容與 `product/source/` 一致。
- GitHub Actions 暫時不可用時，可以使用固定、可重現的備援打包腳本；不得以人工隨意挑檔壓縮取代正式封裝規則。
- 封裝 workflow 不得藉機修改 Runtime、版本號、AI、Recipe、FLORA 或其他產品功能；它只負責驗證封裝邊界與產生 ZIP。

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
