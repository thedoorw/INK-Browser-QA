# INK UI 本輪修改與檢查紀錄

Source commit: `0a1682ab12c09f5cf8090e16a1967a582c294403`
Build: `20261001-ui-light3`
實際頁面：https://thedoorw.github.io/INK-Browser-QA/product/source/
實際檢查尺寸：1363 × 936。以下是本輪實作完成紀錄，不代表 USER 已完成整個專案的視覺驗收。

| 項目 | 修改與結果 |
|---|---|
| 1 分隔線 | 共用 Light 邊線改為 #E5E5E5；右側兩個交界實測高度 1px、border 0，不再疊加兩層。 |
| 2 選中分頁 | 移除藍色 inset shadow。實測三個 active tabs 的 box-shadow 均為 none。 |
| 3 開闔區跳色 | 左右開闔橫條實測 #E2E2E2，左右箭頭維持外緣位置。 |
| 4 視窗勾選 | 展開右側的 12 個分頁全數勾選；未叫出的調整與專業工具不勾。用 aria-checked 同步可見勾選。 |
| 5 工具列空白 | 移除固定 PS 空格；20 個真實工具或操作入口排成 10 排 × 2 欄，實測每格 31 × 26px。新增入口只呼叫既有選取／裁切／框架／節點功能。 |
| 6 工具圖示 | 共用 19px 圖示尺寸及描邊；物件選取有獨立虛線框圖示。物件選取啟用時只高亮該入口。 |
| 7 預設選取 | 初次載入工具為選取；Core 構造與工具行為沒有另建權責。 |
| 8 首頁 | 放在工具選項列最前方。依 USER 要求只完成外觀，功能待討論，disabled 並有清楚 accessible label。 |
| 9 PS 視窗控制 | 依原圖重建三個按鈕比例、分隔、#535353 底色及 #A8A8A8 圖示；尺寸 28／27／47px、高 19px。功能待討論。 |
| 10 參考線 | 使用單一裝置像素描邊並對齊像素中心，降低飽和度。實際由尺規拖入並截圖確認；參考線資料與吸附算法未變。 |
| 11 尺規 | 改善主刻度間距、長數字間距、垂直標籤方向與像素對齊；保留文件 px／mm 單位。實際顯示並拖入參考線驗證。 |
| 12 滑桿 | 一般滑桿使用 2px 線／9px 圓形掣點，與導覽器 2px 線／10px 掣點的視覺分量接近。保留較大的操作高度；以實際截圖核對。導覽器與狀態列實測同為 125%，還原後同為 100%。 |
| 13 四面板說明 | 參考、構成、CHAT、修訂的第一行步驟說明直接從 markup 移除，連同占位消失。逐個切換驗證。保留面板內真正的功能分組標題。 |
| 14 文字分類 | 本輪涉及的控制、次要文字、標題尺寸回到既有語意字級 tokens；保留警告與結果文字的意義。並未宣稱全產品中英文文案已全部重寫。 |
| 15 圖層順序 | 透明度實際 DOM 放到鎖定列之前，避免不同父容器下 CSS order 失效。實際画面已確認。 |

## 行為檢查

- 原生毛筆繪製後，選取工具從空白區拖曳框選，顯示「選取 · 1 個物件」。
- 框架入口產生原有 Frame，包含原筆畫；可經原有歷程撤回。
- 節點入口對 Stroke 呼叫既有筆畫編輯，顯示 9 個節點與完成編輯控制；Path 則交給原有 Path 編輯。
- TIFF Raster State 64×64 影像由新增工具列入口裁切，結果為 32×32，屬性與 Raster State 同步。
- 物件選取入口可呼叫原有 Raster 選取控制，active 標記唯一。
- 面板收合／展開可操作；展開後視窗選單與所有已開啟分頁同步。
- 已保留 Logo、Branding、各面板功能、模式選單入口與既有 command mapping。隱藏的進階按鈕和模式列没有重新出現。

## 已知功能範圍

一般「置入圖片」的 image 沒有 Raster State；既有裁切僅支援具有 RGB 8-bit Raster State 的影像。新入口依此停用，沒有以空按鈕或新 Core 補造功能。測試使用既有 TIFF 外部影像匯入。PNG 不屬於該外部格式入口的既有支援格式。

首頁和視窗按鈕功能明確依 USER 指示留待討論；外觀已完成。

## 原始碼整理與檢查

- 重新以 shell.template.html 作為 Web／Portable 唯一 shell 源，兩個輸出由 generate-shell.mjs 產生，--check 通過。
- Service Worker 和 config.js BUILD_ID 同步；實際頁面 CSS／JS query 均載入 light3。
- JavaScript syntax checks 全部通過，CSS brace balance = 0，無重複 HTML IDs。
- 本輪 CSS 由 250636 字元降至 241704；既有 !important 由 136 降至 122，沒有新增 presentation !important。移除工具列 grid-area 空格配置，整理本輪元件的重複 selector。
- 未使用自訂 GitHub Actions 測試或 workflow dispatch。實際使用已部署頁面與瀏覽器互動。
- 未改 FORMAT_VERSION、文件模型、History／Selection／Renderer 的資料權責。Renderer.drawGuides 僅改描邊樣式與像素對齊，沒有另建 Renderer。

## 後續討論建議

1. 屬性／CHAT 仍有技術名詞、權責標籤與唯讀診斷訊息。建議再決定哪些屬一般操作、哪些收進診斷，讓主要畫面更輕巧。
2. 工具列目前忠實呈現既有能力；新增不存在的 PS 功能應另外列功能工作單，避免用裝飾圖示假裝可用。
3. 首頁可以往作品集／文件列表方向設計；右上角視窗控制需要先定義 Web 版合理行為，再啟用。

## 證據

- `ink-ui-light3-overview.jpg`：細線、滑桿、工具列、首頁、PS 控制與參考線實際全畫面。
- `ink-ui-light3-window-menu.jpg`：12 個已開啟面板勾選，popup 尺寸與 Light grammar。
- `ink-ui-light3-metrics.json`：實際 DOM／CSS 量測；滑桿 pseudo-element 在 browser bridge 的結果不可靠，故不把它當像素實測。
