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

## 主程式打包規範

正式打包規範：`governance/INK_GitHub_Fast_Packaging_Standard.md`

INK 採與 iCAD 同一類 Git-object fast packaging 原則：

```text
accepted source tree
→ exact Git blob/tree reuse
→ package tree
→ package commit
→ package branch
→ GitHub branch ZIP
→ STOP
```

現階段尚未完成真正單檔 `INK.html`，因此可以直接把 `product/source/` 的完整 modular product tree 作為可下載 package；不為了符合未來三件式目標而提前把模組硬塞進 HTML。

固定最新下載 branch：

```text
package/ink-current
```

固定下載入口：

```text
https://github.com/thedoorw/INK-Browser-QA/archive/refs/heads/package/ink-current.zip
```

Packaging 本身不要求 PR merge、GitHub Actions、runner、Artifact 或重新跑 Runtime。若 source bytes 沒有改變，只是建立／更新 package 入口，不應重新驗證產品。

目前 modular package 尚不等於 certified baseline；validation status 必須在交付回報中清楚標示。

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
