# INK 程式架構

## 主要入口

- `index.html`：一般入口。
- `index-standalone.html`：直接開啟入口。
- `src/ink.js`：主程式組裝入口。
- `styles.css`：主要介面樣式。

## 模組分層

- `src/core`：核心狀態與共同能力。
- `src/document`：文件與畫布資料。
- `src/editor`：編輯器與使用者操作。
- `src/input`：Pointer、觸控與筆輸入。
- `src/stroke`：筆畫與筆刷資料。
- `src/render`：Canvas／繪製輸出。
- `src/history`：Undo、Redo、History 與交易。
- `src/export`：PNG 等輸出。
- `src/spatial`：空間索引與幾何查詢。
- `src/types`：型別與結構定義。
- `src/flora`：AI Action、Mask、Recipe、植物結構與繪畫研究擴充。

## 執行關係

`index` 載入 `src/ink.js`，由主程式建立文件、輸入、編輯、渲染、歷史與輸出服務。FLORA Action Layer 目前由 `src/ink.js` 直接安裝，因此仍屬執行依賴。

## 設計原則

- Scene／Document 為可保存狀態。
- 操作應可進入 History。
- AI 操作透過 Action／Dispatcher，不直接任意修改畫布。
- 繪畫結果應可重播、局部修改與輸出。
