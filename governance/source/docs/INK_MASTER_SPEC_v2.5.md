# INK Master Spec v2.5｜主規格書

文件狀態：v0.8.3-p3 視覺歷史記錄面板基線  
適用產品：INK  
適用產品版本：INK v0.8.3  
內部工程來源：INK v3.3.0-rc.2  
專案格式：INK Format Version 4  
日期：2026-07-26

---

## 1. 文件權限與使用規則

本文件是 INK 產品、介面、互動、技術架構與驗收標準的主要依據。後續版本若與零散討論、舊版說明或臨時提案衝突，以本文件及其正式修訂版為準。

規格詞義：

- **必須**：產品不可省略的規則。
- **應該**：一般情況必須遵守，只有具體技術理由才能偏離。
- **可以**：可依版本範圍選擇實作。
- **目前已完成**：已在指定程式基線中落地並通過本版測試。
- **目標規格**：尚未全部完成，不得描述為既有能力。

每次主程式改版必須同步更新：版本資料、README、測試報告、主規格決策紀錄與校驗碼。

### 1.1 版本命名政策

- 現行產品版本沿用自 `INK v0.8.2` 建立的發表前版本線，目前基線為 `INK v0.8.3`。
- 此變更只調整產品版本名稱與發布語意，不回退、刪除或降級任何既有技術。
- `INK v3.3.0-rc.2` 保留為內部工程來源代號，用於追溯技術與測試證據，不再作為現行產品版本。
- `INK Format Version 4` 維持不變；產品版本降為 v0.x 不得造成文件格式降版。
- 後續技術只能維持或改善；若功能退化，必須視為回歸錯誤。


---

## 2. 產品定義

INK 是一套以**可編輯筆畫、無限創作空間、版面空間、自然媒材與低干擾操作**為核心的瀏覽器創作工具。

INK 不是：

- 一般白板或便條工具；
- 以大量永久面板構成的桌面影像編輯器；
- 以尺寸標註和工程指令為中心的 CAD；
- 只輸出不可再編輯像素的單純塗鴉程式。

INK 的產品核心是：

> 使用者能像使用紙筆一樣直接創作，同時保留每一筆、每一個圖形和每一個物件的後續編輯能力。

產品能力方向可概括為：

- Concepts 類型的可編輯筆畫與無限畫布骨架；
- Fresco 類型的向量／點陣與自然媒材延伸能力；
- Procreate 類型的畫布專注、低干擾與直接手勢體驗；
- 最終形成 INK 自己的水墨、紙張與物件編輯語言。

此比較只作定位，不代表模仿任何單一產品。

---

## 3. 不可妥協的體驗原則

### 3.1 畫布優先

- 畫布必須是畫面中最大的視覺區域。
- 非必要面板不得永久壓縮畫布。
- 精細設定採抽屜、浮層、Bottom Sheet 或情境工具列。
- 使用者開始下筆後，介面應盡量退居次要位置。

### 3.2 單一主工具入口

- 同一組主工具不得同時以固定工具列與固定工具環重複呈現。
- 桌面版左側工具列是主工具的唯一固定入口。
- 固定左下工具環取消，不再作為平行工具系統。
- 子工具以堆疊按鈕、再次點擊、長按或快捷鍵開啟。

### 3.3 情境式介面

- 介面只顯示當下物件、工具或工作流程需要的控制項。
- 一般 Inspector 每一情境應以 4–8 個主要控制項為上限；進階項目才進入工作室模式。
- 未選取物件時不得顯示大量無效物件控制。

### 3.4 直接操作優先

- 移動、縮放、旋轉、框選和套索應優先在畫布直接完成。
- 數值欄位用於精確修正，不取代畫布操作。
- 常用操作應在三個明確步驟內完成。

### 3.5 跨裝置重新編排

- 桌面、平板、手機共享文件模型、創作／版面空間語意與視覺 Token。
- 三者不得只用比例縮小的相同版面。
- 手機採底部 Dock 與 Bottom Sheet；桌面採工具列、浮層與右側抽屜。
- 手機可放大觸控命中區，但不得另建一套配色、字型、圖示性格或狀態語言。
- 創作空間與版面空間在所有裝置上都必須可切換。

---

## 4. 介面資訊架構

### 4.1 頂端列 Top Bar

用途：文件層級與全域操作。

包含：

- 頁面入口；
- INK 品牌與版本；
- 文件名稱；
- 創作空間／版面空間切換；
- 復原／重做；
- 新增、開啟、儲存；
- 匯出；
- Inspector 入口；
- 畫布設定。

頂端列不得放入大量工具模式或筆刷預設。

### 4.2 左側主工具列

桌面版固定工具入口如下：

1. 繪圖工具堆疊；
2. 橡皮擦；
3. 選取；
4. 套索；
5. 幾何；
6. 文字；
7. 圖片；
8. 移動畫布。

繪圖工具堆疊包含：

- 鋼筆；
- 鉛筆；
- 麥克筆；
- 毛筆；
- 噴筆。

互動規則：

- 點擊非作用中的繪圖堆疊：切回最近使用的繪圖工具。
- 再次點擊作用中的繪圖堆疊：開啟筆種選單。
- 長按或右鍵：開啟筆種選單。
- `W`：開啟或關閉筆種選單。
- 個別快捷鍵可直接切換筆種。

### 4.3 快速筆刷控制

左側畫布內可保留少量垂直快速控制：

- 顏色；
- 寬度；
- 透明度。

此區不是第二套工具列，不得加入選取、幾何、文字等主工具。

### 4.4 選取情境工具列

選取一個或多個物件時，畫布上方可出現精簡情境工具列，提供：

- 複製；
- 群組；
- 層級；
- 常用對齊；
- 刪除；
- 框選模式提示。

完整尺寸、旋轉、透明度和多種對齊控制放入 Object Inspector。

### 4.5 Smart Inspector

Smart Inspector 是右側抽屜，不是永久側欄。

桌面狀態：

- **0 px**：完全收起；
- **34 px 邊緣把手**：收起時的入口，不佔用主要畫布；
- **280 px 一般模式**：工具、圖層或物件的常用設定；
- **420 px 工作室模式**：需要較完整設定時使用；
- **248–420 px 可拖曳寬度**：一般模式寬度可調整並在可用環境中記憶。

行為規則：

- 程式啟動時桌面 Inspector 預設收起。
- 抽屜以覆蓋方式進入，不得縮小畫布寬度。
- 選取物件時，自動切換至 Object Inspector 並在桌面展開。
- 若該抽屜是由選取情境自動開啟，清除選取後應自動收起。
- 使用者手動開啟、切換頁籤或調整寬度後，系統不得擅自改變其工作狀態。
- 手機版使用 Bottom Sheet，不顯示右側邊緣把手與拖曳寬度控制。

Inspector 三個一級情境：

- Tool：目前工具與筆刷屬性；
- Layers：圖層管理；
- Object：目前選取物件。

### 4.6 頁面、設定與匯出

- 頁面管理採左側浮動面板或手機全寬 Sheet。
- 畫布設定採臨時浮動面板。
- 匯出採明確對話框。
- 這些面板不得長期常駐並包圍畫布。

---

## 5. 響應式版面

### 5.1 桌面

條件：寬度大於 1120 px。

- 左側工具列顯示圖示與名稱。
- Smart Inspector 預設 280 px，覆蓋畫布。
- 頂端列顯示完整文件操作。
- 快速筆刷控制顯示於工具列旁。
- 創作／版面空間切換以緊湊分段控制顯示。

### 5.2 緊湊桌面／平板橫向

條件：約 761–1120 px。

- 左側工具列可隱藏文字，只保留圖示。
- 文件操作可縮減為圖示或更多選單。
- Inspector 保持抽屜模式，不永久佔用版面。

### 5.3 手機與窄直式平板

條件：寬度不大於 760 px。

- 左側工具列隱藏。
- 底部 Dock 顯示最常用工具。
- 其他工具進入「更多工具」Sheet。
- Inspector 使用 Bottom Sheet。
- 頁面與設定使用適合觸控的全寬浮層。
- 安全區必須考慮瀏海、Home Indicator 與虛擬鍵盤。
- 創作／版面空間切換保留於頂端列，並使用與桌面相同的深灰與青綠狀態語言。

---

## 6. 輸入與手勢規格

### 6.1 統一輸入

主輸入採 Pointer Events，必須統一處理：

- 滑鼠；
- 觸控筆；
- 手指；
- 多指手勢。

### 6.2 預設角色

- 滑鼠左鍵：目前工具。
- 觸控筆：繪圖或目前工具。
- 手指：預設導航；可由設定切換為單指使用目前工具。
- 雙指：平移、縮放與旋轉。
- 空白鍵：暫時移動畫布。

### 6.3 筆資料

筆畫資料模型應保留：

- 座標；
- 時間；
- 壓力；
- 傾斜；
- 速度推導所需資料。

v3.2 已建立裝置校準管線：

- 可調 pressure minimum／maximum／gamma／smoothing；
- tilt sensitivity／deadzone 與 azimuth offset；
- coalesced events 批次取樣；
- predicted events 可選預覽，預測點不得寫入正式文件；
- 大接觸面與筆後保護時間的掌壓排除；
- 輸入點統一輸出 altitude、azimuth、twist 與 latency 診斷。

上述為跨裝置校準基礎。Apple Pencil、S Pen 與 Windows Pen 的實際壓力曲線、掌壓與延遲仍必須在對應硬體驗證，不得以合成事件取代實機結論。

---

## 7. 選取與變形規格

### 7.1 選取語意

- 點選：選取最上層命中物件。
- `Shift`：累加或切換選取。
- 左向右框選：完整包含才選取。
- 右向左框選：與框相交即選取。
- 套索：依物件幾何與套索區域判定。
- 全選：選取目前頁面可見且未鎖定物件。

### 7.2 直接變形

必須支援：

- 移動；
- 八方向縮放；
- 等比例與非等比例縮放；
- 旋轉；
- 方向鍵微移；
- `Shift + 方向鍵` 快速微移；
- 智慧參考線；
- 物件邊界與中心吸附；
- 網格吸附；
- `Alt` 暫時略過智慧吸附。

### 7.3 精確控制

Object Inspector 必須提供：

- X；
- Y；
- W；
- H；
- Rotation；
- 長寬比鎖定；
- 透明度；
- 層級；
- 群組／解散；
- 對齊／分布。

### 7.4 精密筆畫節點與區段編輯

Stroke Edit 是物件選取後的情境，不得新增為另一個永久主工具。

目前必須支援：

- 雙擊 Stroke 或由 Object Inspector 進入；
- 節點選取與 `Shift` 累加選取；
- 直接拖曳選取節點；
- 節點插入、刪除與過密節點簡化；
- Corner、Smooth、Symmetric 三種節點模式；
- Bézier 進／出切線控制柄；
- Smooth／Symmetric 節點移動控制柄時維持其切線規則；
- 區段選取與 De Casteljau 曲線切割；
- 指定區段切割為兩個獨立可編輯 Stroke；
- 區段級顏色、寬度與透明度覆寫；
- 區段樣式可清除並恢復整筆樣式；
- `Esc` 優先離開 Stroke Edit；
- 操作納入 Transaction History，可 Undo／Redo。

Bézier 新節點插入不得以單純線性補點破壞原曲線；應維持插入前後曲線形狀在合理容差內。

---

## 8. 文件與物件模型

### 8.1 物件類型

正式物件模型至少包含：

- Stroke；
- Shape；
- Text；
- Image；
- Group；
- Layer；
- Page。

每個可編輯物件必須具備：

- 唯一 ID；
- Transform Matrix；
- Bounding Box；
- Opacity；
- Layer 與 Z-order；
- Serialize／Deserialize；
- Clone；
- Hit Test；
- Render。

### 8.2 文件格式

目前基線：INK Format Version 4。

文件至少保存：

- 文件標題與時間；
- 頁面；
- 每頁創作／版面工作空間狀態與獨立 Camera；
- 圖層；
- 物件；
- 相機；
- 紙張；
- 最近顏色；
- 格式版本。

INK v0.8.3 必須承接 v0.8.2 與內部工程來源 v3.3 rc.2，並維持 v2.0–v3.2 的 Format Version 4 專案相容性；Bézier 控制柄、節點模式、區段樣式、`mediaModel` 與紙張媒材參數均採可選欄位，本版不變更 Format Version。紙張新增欄位包含 `absorbency`、`roughness`、`fiberStrength`、`fiberAngle`、`sizing`、`granulation`、`seed` 與 `textureVisible`；舊文件缺少欄位時由 Migration 補入安全預設值。

### 8.3 儲存

- IndexedDB 為主要自動儲存來源。
- LocalStorage 只用於小型介面偏好或備援，不得存放完整大型文件。
- 無法使用 LocalStorage 時，程式不得因偏好讀取失敗而停止啟動。
- 自動儲存必須保留上一代有效快照；目前快照損壞時應嘗試復原上一代。
- 儲存資料採 `INK_STORAGE_V3` envelope，保存 fingerprint、byte length、current、previous 與最多三代 checkpoint；讀取時逐代驗證並依序復原。舊 `INK_STORAGE_V2` 記錄仍可讀取並在後續儲存時升級。
- `.ink` 檔目前為 JSON 專案；未來可遷移為 ZIP 容器，但必須提供版本遷移。

---

## 9. 筆畫與媒材規格

### 9.1 目前 Canvas 2D 專業編輯基礎

目前已完成並必須維持：

- 原始點、壓力、時間與傾斜資料；
- 平滑、壓力變寬、速度與起收筆；
- 鋼筆、鉛筆、麥克筆、毛筆、噴筆；
- 基礎墨量、含水、筆毫與紙面顆粒參數；
- Brush Live Preview 與畫布作用範圍游標；
- 幾何感知局部擦除；
- Bézier 曲線取樣、命中、輪廓、Bounds 與 SVG 輸出；
- 節點插入、切線控制與三種節點模式；
- 區段切割與區段級樣式；
- 筆畫、節點及區段操作均可 Undo／Redo。

局部擦除與命中不得只檢查原始節點；曲線區段必須經適當取樣或解析判定，避免視覺相交但操作失效。

### 9.2 v3.0 GPU 自然媒材基礎

v3.0 已完成並由 v3.1 保留：

- `NaturalMediaController` 統一 `auto`、`gpu` 與 `canvas2d` 三種模式；
- WebGL2 程序化 stamp pipeline，支援毛筆、乾筆與噴筆；
- GPU shader 第一版處理筆觸密度、邊緣柔化、含水、顆粒與筆毫條紋；
- 壓力、傾斜、筆寬、taper、flow、wetness、grain、bristle 與 softness 參數進入 stamp 資料；
- 每筆媒材 raster 依筆畫指紋快取，採 LRU 上限避免無限制佔用；
- GPU 輸出以透明 raster 合成回既有 Canvas 2D 編輯畫布；
- WebGL context lost／restore 事件入口與自動降級；
- 文件保存可編輯 Stroke 幾何與媒材參數，不保存不可編輯 GPU raster。

### 9.3 v3.1 多通道水墨與紙張

目前已完成並由主程式實際使用：

- `MultiChannelInkSurface` 建立 pigment amount、pigment RGB、water 與 deposition 通道；
- 程序化 Paper Profile 建立吸收率、阻力、顆粒與纖維場；
- Paper Profile 支援吸收率、粗糙度、纖維強度、纖維角度、施膠、顆粒、seed 與材質顯示；
- stamp deposition 依壓力、flow、wetness、granulation、bristle 與紙面場寫入顏料及水分；
- 模擬步驟包含方向性水分擴散、紙張吸收、顏料移動、沉積及蒸發；
- composite 階段將可移動顏料、沉積顏料與水分邊緣轉為透明 RGBA raster；
- 相鄰且連續的毛筆／乾筆 Stroke 可進入同一 multi-channel run，產生跨筆畫濕墨互動；
- Canvas 2D multi-channel reference backend 已在桌面與手機回歸實際執行，並提供 deterministic cache 與診斷；
- WebGL2 MRT backend 已建立雙 color attachment、ping-pong simulation 與 composite pipeline；
- `NaturalMediaController` 統一單筆 renderer 與 multi-channel run 的 GPU／Canvas fallback；
- 紙張參數變更會清除媒材 cache，避免舊 raster 與新紙張設定不一致；
- PNG export 可要求較高 transient raster scale，現行像素上限為 6,000,000、單邊上限為 8,192；
- Format Version 維持 4，舊文件透過 Migration 補入紙張預設值。

本測試容器的 Chromium 不提供 WebGL／WebGL2，因此 WebGL2 MRT shader、雙 framebuffer、GPU draw、GPU cache 與 context restore 尚未在此環境實際執行。現有自動化證據驗證的是完整 CPU multi-channel reference、GPU 能力偵測及不中止主程式的自動降級；不得將 MRT 程式碼存在描述為 GPU 執行已驗證。

### 9.4 v3.2 裝置校準與 GPU 硬化

目前已完成：

- `PenInputCalibrator` 壓力曲線、平滑、傾斜／方位角、coalesced／predicted events 與掌壓排除基礎；
- 觸控筆校準控制、local preference 保存與 latency／取樣診斷；
- WebGL2 單筆及 MRT renderer 的 capability snapshot、自我檢查與錯誤閉鎖；
- GPU resource budget、LRU raster cache accounting、pinned MRT target 與資源診斷；
- context lost 時清理 target／cache／budget，restore 時重新初始化；
- dirty-region aggregation 與大型畫布 tile plan；
- 最高 36,000,000 像素、單邊 16,384 的 bounded Canvas 分塊合成 export；
- GPU／Canvas pixel comparison 工具基礎；
- Canvas fallback、Format Version 4 與可編輯 Stroke 真實資料維持不變。

本版容器仍未提供 WebGL2，也沒有實體觸控筆；因此 capability/self-test harness、錯誤降級與合成輸入已驗證，但不可宣稱 GPU shader 或特定裝置實機校準通過。

### 9.5 v3.3 rc.2 內部硬化

目前已完成並由主程式實際使用：

- History Transaction 支援明確 target path，主程式的繪圖、物件、圖層、頁面、筆畫節點、文字、畫布與擦除操作均採 target-scoped capture；
- History 項目保留 ID-aware 差分 Patch，Undo／Redo 改為就地套用 Patch，再執行輕量文件刷新；
- History diagnostics 回報 scoped／full entry、captured bytes、stored bytes 與 in-place apply 次數；
- `PersistentTileAtlas` 建立持續 tile record、dirty tile 標記、資源配置、LRU budget、取消與診斷核心；
- tile atlas core 可由 Canvas 或 WebGL resource adapter 驅動，但尚未接入即時 WebGL 畫布 renderer，不得描述為 live GPU atlas 已完成；
- `TiledExportJob` 與 `INK_TILED_EXPORT_CHECKPOINT_V1` 支援分塊匯出的進度、取消、checkpoint 與同一輸出 Canvas 的續作；
- 超過單次 transient raster 門檻的 PNG 內容匯出已使用 `TiledExportJob`，匯出對話框提供取消操作；
- `INK_EXTERNAL_DIAGNOSTIC_BUNDLE_V1` 收集 origin、secure context、瀏覽器、畫面、Pointer API、Storage API、WebGL capability、Renderer、History、Runtime、更新服務與有限量觸控筆樣本；
- Smart Inspector 新增「下載外部測試診斷包」，供外部 GPU、觸控筆、正常 origin 與跨瀏覽器測試交接；
- `INK_MASTER_SPEC_v2.5` 是唯一正式技術文件；測試報告、發布門檻與機器可讀結果只作證據，不與主規格並列。

HistoryManager 仍保留未指定 targets 時的 full-document fallback，以支援未遷移的外部或未來呼叫端；目前正式主程式呼叫點已全部指定 scope。

### 9.6 後續自然媒材目標

尚未完成、不得宣稱既有的能力：

- 正常 WebGL2 裝置上的 MRT shader compile／link／draw、畫質與效能實測；
- 可跨時間持續演化的完整濕墨乾燥狀態，而非目前每次 raster 建立時的有限步數模擬；
- 大型畫布 GPU tile／atlas、dirty region、紋理預算與分塊更新；
- 完整 GPU 專用高解析度離屏匯出與超過現行 6M 像素上限的分塊合成；
- 更高階的路徑級飛白、筆毫分岔、回滲與多層紙張材質；
- 不同 GPU／瀏覽器下的精度、色彩與資源生命週期一致性。

Canvas 2D multi-channel reference 必須保留為相容 fallback。
---

## 10. 軟體架構

### 10.1 現況

INK v3.3 rc.2 延續 ES Module 漸進式架構，正式模組原始碼是唯一主程式來源；直接開啟版由同一來源自動產生 Compatibility Bundle。

已抽離並由主程式實際使用：

- Core：矩陣、幾何、Bounds 與共用工具；
- Document／Migration：文件正規化、格式遷移與未來版本拒絕；
- Workspace：創作／版面空間、獨立 Camera、切換與診斷；
- Storage：IndexedDB、LocalStorage／Memory fallback、兩代自動儲存與復原；
- History：Transaction、ID-aware 差分 Patch、Undo／Redo；
- Input：滑鼠、觸控筆、手指與多指手勢角色仲裁；
- Stroke：Bézier 節點、控制柄、區段樣式、切割、簡化與局部擦除；
- Spatial：Quadtree、物件 ID map、增量 insert／remove／update；
- Selection：框選與套索候選集合；
- Transform：初始矩陣快照與矩陣套用；
- Render Contract：自然媒材類型、stamp 建立、raster bounds、fingerprint 與 backend 選擇；
- Paper Profile：程序化紙張取樣、吸收率／阻力／顆粒／纖維場與 fingerprint；
- Multi-Channel Ink Core：pigment、RGB、water、deposition、diffusion、absorption 與 composite；
- WebGL Natural Media：單筆 shader、buffer、透明 raster、cache 與 context lifecycle；
- WebGL Multi-Channel Ink：MRT attachments、stamp deposition、ping-pong simulation 與 composite；
- Canvas 2D Natural Media：毛筆、乾筆與噴筆單筆相容 renderer；
- Canvas 2D Multi-Channel Ink：跨筆畫 deterministic reference renderer 與 cache；
- Natural Media Controller：單筆與 run 的能力偵測、模式切換、自動降級與診斷資訊；
- Persistent Tile Atlas Core：持續 tile record、dirty mapping、資源生命週期、LRU budget 與分批更新；
- Resumable Tiled Export：checkpoint、取消、續作、進度與有限畫布合成；
- External Diagnostics：外部環境 capability、觸控筆樣本、發布 gate 與診斷 bundle。

v3.3 rc.2 的 History 項目維持 ID-aware 差分 Patch，並新增 target-scoped capture。正式主程式的 History 入口均指定頁面、圖層、物件或屬性路徑；Undo／Redo 直接在文件上套用 Patch，再由主程式執行刷新。HistoryManager API 仍保留未指定 targets 時的完整文件 fallback，因此不得宣稱所有第三方或未來呼叫端都已自動 scope 化。

主 Canvas Renderer、完整 Editor 狀態機與 UI 仍由 `src/ink.js` 整合；自然媒材 renderer 已抽離，但一般物件 renderer 尚待後續模組化。`PersistentTileAtlas` 已完成資料、dirty tile、budget 與排程核心，但尚未接入即時 WebGL renderer。大型 PNG 內容匯出已整合可取消、可 checkpoint、可續作的 `TiledExportJob`；它目前仍以 bounded Canvas composition 為正式可執行路徑，不代表 GPU 專用 tile export 已完成。

### 10.2 目標結構

```text
INK/
├─ app/
│  ├─ shell/
│  ├─ ui/
│  ├─ panels/
│  └─ commands/
├─ engine/
│  ├─ core/
│  ├─ input/
│  ├─ stroke/
│  ├─ brush/
│  ├─ selection/
│  ├─ transform/
│  └─ history/
├─ document/
│  ├─ model/
│  ├─ storage/
│  └─ migration/
├─ render/
│  ├─ canvas2d/
│  ├─ webgl/
│  └─ export/
├─ platform/
│  ├─ desktop/
│  ├─ tablet/
│  └─ mobile/
└─ tests/
```

目標技術棧：TypeScript、Vite、Canvas 2D、WebGL2、IndexedDB、Vitest、Playwright。

模組化必須採逐步替換，不得用一次性重寫造成既有繪圖、選取、儲存與匯出退化。

---

## 11. 視覺與互動 Token

### 11.1 專業精密介面基線

INK v0.8.3 的介面對齊 Photoshop／Illustrator 的是**視覺密度、資訊層級、控制精度與專業感**，不是複製其功能、配置或品牌外觀。

- 桌面介面採緊湊、規則化、低裝飾的控制密度。
- 文字、圖示、按鈕、輸入欄、分隔線與面板必須共用一致的尺寸階層。
- 圓角與陰影只用於辨識層級，不得形成行動 App 或消費型網頁卡片感。
- Hover、Active、Focus、Disabled、Selected 與 Warning 狀態必須可清楚區分。
- 精密感不得以縮小可讀性或破壞觸控操作為代價；手機仍保留較大的觸控命中區。

### 11.2 桌面視覺 Token

- Paper：`#fffef9`，文件內容色彩不因 UI 深色化而改變
- Desktop Chrome：`#232426`／`#2d2e30`／`#38393b`／`#434447`
- Chrome Text：`#dedfe1`；Muted：`#a5a7aa`
- Accent：INK 青綠系，只用於作用中、選取、主要操作與智慧導引
- UI 字型：`Segoe UI`、`Inter`、`Noto Sans TC`、`Microsoft JhengHei`、system sans-serif
- 基本文字：9–11 px；輔助文字：7–9 px；面板標題：9–10 px／600–700 weight
- 應用程式選單列：28 px；文件／情境工具列：38 px；頂端框架總高：66 px
- Status Bar：22 px
- 左側工具列：38 px；工具按鈕：34 px；圖示 18–19 px
- 屬性列：約 30 px；輸入欄：22–24 px
- Inspector：316 px 一般模式，260–430 px 可調範圍
- 主要間距：1／2／4／6／8 px
- 小控制圓角：0–2 px；桌面停駐面板圓角：0 px
- 分隔線：1 px、低對比、完整對齊像素格
- 陰影：只用於浮層或停駐邊界，採短距離低模糊，不作裝飾
- 手機維持較大觸控尺寸，不直接套用桌面高密度 Token
- 手機與桌面共用 Desktop Chrome 色階、Chrome Text、Muted 與 Accent；只允許尺寸、排列與命中區差異

### 11.3 動態與狀態

- 快速狀態：90–130 ms
- 面板進出：150–190 ms
- Focus 必須有清楚但不膨脹版面的 1 px ring 或 inset outline
- Active 工具以背景、邊界或側邊標記表達，不依賴單一顏色
- Disabled 仍須保留輪廓辨識，不得只以極低透明度消失
- 必須支援 `prefers-reduced-motion`

## 12. 效能與可靠性目標

以下為效能與可靠性規格：

- 一般桌面繪圖互動以接近 60 FPS 為目標；
- 主要操作不應長時間阻塞主執行緒；
- 自動儲存必須節流，且保留上一代有效快照；
- 圖片與縮圖應懶載入；
- 物件 Bounds 應快取；
- 大型文件詳細命中前必須先做空間候選查詢；
- 幾何變更應優先對空間索引執行增量更新，不得無條件重建整頁；
- v3.2 保留 10,000／50,000 物件 Node 空間索引回歸；
- v3.2 保留 100、1,000 與 10,000 原始點自然媒材 stamp preparation／fingerprint 回歸；
- v3.2 保留 256×128、512×256 與 768×384 CPU multi-channel pigment／water／paper／deposition 回歸；
- v3.2 新增 100,000 點校準數學、10k×6k／8,192² tile plan、64 MiB GPU resource budget 與 20,000 dirty-region 輸入回歸；
- v3.3 新增 20,000 物件／100,000 點大型文件完整性、Migration、Spatial Index 與 1,000 次查詢回歸；
- v3.3 新增 120,000 幀、5,000 操作、50,000 GPU resource churn、80,000 dirty-region、120 代 autosave 與 500 次 History endurance 回歸；
- v3.3 rc.2 新增 20,000 物件文件的 target-scoped History capture 回歸，確認主動 scope 時 captured bytes 低於文件大小 1%；
- v3.3 rc.2 新增 12,000×8,000 persistent tile atlas core、dirty tile 更新、96 MiB budget 與 resumable export 取消／續作回歸；
- 分塊 export 必須限制輸出像素、單邊尺寸、tile 數量與 peak tile allocation，避免以單一中間 raster 無限制配置；
- 壓力測試時間與記憶體數字只作本次環境回歸證據，不是跨裝置效能保證；
- 50,000 測試仍只驗證空間索引，不等於 50,000 筆畫完整畫面渲染已達標；
- 本次容器不提供 WebGL2，GPU shader 效能與畫質不得由 CPU stamp preparation 或 CPU multi-channel 結果推論；
- 任何單一偏好、縮圖、索引、離線或目前自動儲存失敗不得使主程式無法啟動。

---

## 13. 測試與發布門檻

每次主版本封裝至少必須通過：

- JavaScript／TypeScript 語法與 strict 型別檢查；
- 應用啟動與 Runtime 錯誤為 0；
- 建立、選取、移動、縮放、旋轉與復原；
- 群組、解散、圖層、儲存、開啟與格式遷移；
- PNG／SVG 匯出；
- 桌面、窄桌面與手機版面；
- Inspector 開關、寬度、情境切換與畫布不縮窄；
- 主工具入口不得重複；
- 舊格式文件相容性；
- Bézier 節點插入、控制柄與節點模式；
- 區段切割、區段級樣式與 Undo／Redo；
- 局部擦除不得漏掉跨越作用範圍的直線或曲線；
- 空間索引全量建立與增量更新；
- 10,000 與 50,000 級空間索引壓力回歸；
- 自然媒材 stamp、raster bounds、fingerprint、模式切換與不可用 GPU 的安全降級；
- Paper Profile 正規化、程序化場一致性與舊文件預設值；
- pigment／water／deposition 模擬、跨筆畫 run、Canvas multi-channel cache 與診斷；
- 高解析度 PNG export 必須在像素上限內完成，且不得破壞原始 Stroke；
- 壓力曲線、傾斜方位、掌壓排除、coalesced/predicted event 路徑與 calibration diagnostics；
- GPU resource budget、cache eviction、capability snapshot 與 self-test 結果結構；
- tile plan 必須完整覆蓋輸出核心區且不得重複或漏失像素；
- 可用 WebGL2 環境中必須另驗證單筆及 MRT shader compile/link、GPU draw、cache hit、context lost／restore；
- 文件不得因抽屜或 Bottom Sheet 產生頁面水平／垂直溢位；
- 文件完整性檢查必須拒絕重複 ID、無效矩陣與非有限筆畫座標；
- 自動儲存記錄必須驗證 fingerprint 與 byte length，並能從 previous／checkpoint 復原；
- Runtime Health Monitor 必須限制錯誤與操作樣本保留量，避免診斷本身無界成長；
- Service Worker 更新不得無提示覆蓋正在使用的工作階段，waiting worker 必須由明確啟用動作接管；
- 大型文件與 endurance 回歸必須附機器可讀報告，不得只以人工觀察宣稱通過。
- 主程式 History 入口必須提供 target scope；若使用 full snapshot fallback，測試報告必須明確列出來源與理由；
- persistent tile atlas core 必須通過 dirty tile、budget、eviction、取消與錯誤診斷測試；live GPU renderer integration 需另列外部 GPU gate；
- 分塊匯出取消時必須保留有效 checkpoint，續作不得重畫已完成 core tile；
- 外部測試必須可輸出 `INK_EXTERNAL_DIAGNOSTIC_BUNDLE_V1`，且樣本與事件數量必須有上限。

每版必須附：

- 機器可讀測試結果；
- 桌面關鍵畫面；
- 手機關鍵畫面；
- 已知限制；
- SHA-256 校驗碼。

---

## 14. 版本路線

### INK v0.8.3-p3｜Visual History Panel Repair P3

在 P2 基線上新增右側「歷史」頁籤，將既有 target-scoped Patch History 視覺化；使用者可直接點擊任一步返回對應狀態。歷史記錄預設保留 30 步，可調整為 20／30／50 步，設定保存於本機偏好。本版不把歷史完整寫入 `.ink` 文件，避免專案檔無限制增長。產品版本仍為 0.8.3，套件修訂為 P3，Format Version 維持 4。

### INK v0.8.3-p2｜Fullscreen & Layer Workflow Repair P2

在 P1 基線上完成第二輪介面與工作流修復：新增瀏覽器全螢幕切換、修正 Inspector 標題列控制重疊、圖層面板改為拖曳排序與底部專屬操作列，並將 Inspector、圖層名稱、頁籤與欄位文字調整至接近 Photoshop 的專業面板可讀尺度。產品版本仍為 0.8.3，套件修訂為 P2，Format Version 維持 4。

### INK v0.8.3-p1｜Field Test Repair P1

在 Test-Ready TR1 基線上完成首輪人工實測修復：新文件預設滿版創作空間、移除創作空間 A4 框、建立 A4 模型視埠、修正工作區清單、Inspector 邊緣與關閉控制、快速選色定位、畫布設定圖示與文字可讀性，以及橡皮游標／命中半徑一致性。產品版本仍為 0.8.3，套件修訂為 P1，Format Version 維持 4。

### INK v0.8.3｜Dual Space & Unified Studio UI

延續 v0.8.2 的 A4 畫板與輸出能力，完成：

1. 同一 Page 具有「創作空間」與「版面空間」兩種顯示／工作狀態；
2. 兩種空間共享同一組 Layer 與 Object，不複製 Stroke 或建立第二份內容；
3. 創作空間維持無限座標世界，版面空間使用 A4 畫板作排版、裁切、列印與輸出；
4. 兩種空間分別保存 Camera 的 x、y、scale、rotation 與造訪狀態；
5. 舊 v0.8.2 fixed artboard 頁面遷移為版面空間，舊 infinite 頁面遷移為創作空間；
6. 桌面與手機共用深灰 Studio Chrome、文字、Accent、控制狀態與面板語言；手機只保留較大的觸控命中區與重新編排；
7. 桌面與手機均提供可見的創作／版面切換，快捷鍵為 `Ctrl+1`／`Ctrl+2`；
8. Node unit 63／63、Chromium desktop/mobile 61／61，Runtime errors 0；
9. Format Version 維持 4。

### INK v0.8.2｜A4 Artboard & Output Foundation

延續 v0.8.1 的專業精密介面與全部內部技術，新增 A4 固定畫板、直式／橫式、150／300／600 PPI、出血、安全邊界、中心線、畫板裁切、PNG／SVG／PDF／瀏覽器列印，以及 300 PPI A4 的可取消、可 checkpoint 分塊輸出。Format Version 4 不變；舊文件缺少畫板欄位時遷移為無限畫布，避免改變既有構圖。

> 下列 v2.x／v3.x 名稱是內部工程沿革，並非現行產品公開版本。

### INK v2.1｜介面基線

已完成並由後續版本保留：覆蓋式 Smart Inspector、單一桌面主工具入口、取消固定工具環、手機 Bottom Dock／Bottom Sheet，以及 Inspector 不縮窄畫布。

### INK v2.2｜架構基線

已完成：Core、Document、Storage、Migration、History 與 Input 的 ES Module 抽離，Transaction／差分 Patch，以及 TypeScript 與自動化測試入口。

### INK v2.3｜筆畫編輯基線

已完成：節點／區段情境編輯、區段切割、局部擦除、Brush Preview、Quadtree 第一版及 Selection／Transform 模組邊界。

### INK v2.5｜專業編輯基線

已完成：Bézier／切線、區段樣式、增量空間索引、ID-aware History、兩代自動儲存、10,000／50,000 索引回歸與跨裝置介面穩定化。

### INK v3.0｜GPU 自然媒材基礎

已完成：

1. WebGL2 程序化 stamp renderer 與 shader 第一版；
2. 毛筆、乾筆與噴筆的 GPU 媒材路徑；
3. 壓力、傾斜、墨量、含水、顆粒、筆毫與 softness 資料管線；
4. stroke fingerprint、透明 raster cache 與 LRU 資源限制；
5. Canvas 2D 相容自然媒材 renderer；
6. auto／GPU／Canvas 模式、能力偵測與 Inspector 診斷；
7. context lost／restore 事件入口與自動降級；
8. Format Version 維持 4。

### INK v3.1｜多通道水墨基線

已完成 pigment／water／deposition、多通道 Canvas reference、WebGL2 MRT 程式管線、Paper Profile 與跨筆畫濕墨互動。

### INK v3.2｜裝置校準與 GPU 硬化基線

已完成：觸控筆校準資料管線、coalesced／predicted events、掌壓排除、GPU capability/self-test、資源預算、context-loss 清理、dirty-region、tile plan 與 bounded Canvas tiled export。

### 內部工程來源：INK v3.3 rc.2

rc.1 的文件完整性、Storage V3、Runtime Health、Service Worker 更新、大型文件與 Endurance 基線全部保留。rc.2 進一步完成：

1. History target-scoped capture，正式主程式 History 入口全部指定 scope；
2. Undo／Redo in-place Patch apply 與 capture／storage diagnostics；
3. Persistent Tile Atlas core：tile record、dirty mapping、resource budget、LRU、分批更新、取消與診斷；
4. Resumable Tiled Export：checkpoint、取消、續作與 UI 取消入口；
5. 外部測試診斷包：平台、origin、Pointer、Storage、WebGL、Renderer、Runtime、History、更新與觸控筆樣本；
6. Master Spec、版本資料與機器可讀測試證據同步；
7. 62 項 Node 單元測試、54 項 Chromium 桌面／手機 Runtime 回歸與新增 Internal Hardening performance report；
8. Format Version 維持 4，保留 v2.0–v3.2 文件相容與 Canvas fallback。

仍未完成的外部發布門檻：

- 正常 HTTP／HTTPS origin 的 Service Worker、CacheStorage 與 IndexedDB 主路徑；
- 可用 WebGL2 的 shader compile／link／draw、MRT、cache hit、context restore，以及 live renderer 與 tile atlas adapter 整合；
- Apple Pencil、S Pen、Windows Pen 實機校準；
- Edge、Firefox、Safari 與多 GPU 畫面一致性；
- 實機長時間繪圖、休眠／喚醒與記憶體洩漏測試。

在以上外部門檻完成前，現行產品版本維持 **INK v0.8.x 發表前版本**，不得描述為已完成最終公開發布或進入 v1.0。
---

## 15. 正式決策紀錄

| 編號 | 決策 | 狀態 |
|---|---|---|
| UI-001 | 畫布優先，面板不得永久包圍畫布 | 定案 |
| UI-002 | 右側採 Smart Inspector 抽屜，預設收起並覆蓋畫布 | v2.1 已落地 |
| UI-003 | 左下固定工具環取消，左側是桌面唯一固定主工具入口 | v2.1 已落地 |
| UI-004 | 手機使用 Bottom Dock 與 Bottom Sheet | v2.1 已落地 |
| UI-005 | 抽屜與 Sheet 不得造成文件 viewport overflow | v2.5 已落地 |
| UI-006 | v0.8 桌面介面採專業精密密度：緊湊字級、低圓角、規則化控制列與細緻狀態 | v0.8 已落地 |
| UI-007 | 桌面與手機共用同一套深灰 Studio Chrome、字型、圖示與狀態 Token；手機只調整觸控尺寸與排列 | v0.8.3 已落地 |
| WS-001 | 同一 Page 同時具有創作空間與版面空間，兩者共享同一組物件 | v0.8.3 已落地 |
| WS-002 | 創作與版面空間分別保存 Camera，切換不得改變或複製內容 | v0.8.3 已落地 |
| WS-003 | 版面空間負責畫板、裁切、列印與輸出；創作空間保持無限座標世界 | v0.8.3 已落地 |
| WS-004 | v0.8.2 fixed／infinite artboard 語意遷移為 workspace activeSpace，Artboard 本身維持固定排版框 | v0.8.3 已落地 |
| VER-001 | 產品版本名稱重設為 v0.x，只改命名與發布語意，技術不得回退 | v0.8 已落地 |
| DOC-006 | INK Format Version 4 不因產品版本重設而降版 | v0.8 已落地 |
| ED-001 | 保留 CAD 式雙向框選語意 | v2.0 已落地 |
| ED-002 | 畫布直接變形與精確數值並存 | v2.0 已落地 |
| ED-003 | Stroke Edit 是物件情境，不新增永久主工具 | v2.3 已落地 |
| ED-004 | Bézier 插入必須維持原曲線形狀 | v2.5 已落地 |
| ED-005 | 節點模式採 Corner／Smooth／Symmetric | v2.5 已落地 |
| ED-006 | 區段樣式是 Stroke 的可選覆寫，不破壞整筆樣式 | v2.5 已落地 |
| DOC-001 | v3.2 沿用 Format Version 4，維持 v2.0–v3.1 相容 | v3.2 已落地 |
| DOC-002 | 自動儲存保留上一代有效快照並支援復原 | v2.5 已落地 |
| DOC-003 | 自動儲存採 INK_STORAGE_V3，驗證 fingerprint／byte length，並保留 previous 與三代 checkpoint | v3.3 rc.1 已落地 |
| DOC-004 | 文件在儲存、開啟與發布健康檢查前必須通過完整性檢核 | v3.3 rc.1 已落地 |
| ARC-001 | 採 ES Module 漸進抽離，不一次性重寫 | 執行中 |
| ARC-002 | Compatibility Bundle 必須由正式模組原始碼產生 | v2.2 已落地 |
| ARC-003 | History 項目採 ID-aware 差分 Patch | v2.5 已落地 |
| ARC-004 | 正式主程式 History 入口採 target-scoped capture；未指定 targets 的通用 API 仍保留 full snapshot fallback | v3.3 rc.2 已落地／受限 fallback |
| ARC-005 | WebGL 新引擎不得移除 Canvas 2D fallback | v3.0 已落地 |
| ARC-006 | 自然媒材以 Controller 統一 GPU 與 Canvas backend | v3.0 已落地 |
| ARC-007 | GPU raster 是可重建 cache，不取代可編輯 Stroke 資料 | v3.0 已落地 |
| ARC-008 | WebGL context 不可用或中斷時必須不中止主程式並自動降級 | v3.0 已落地 |
| ARC-009 | pigment／water／deposition 是可重建媒材 raster 狀態，不取代 Stroke 文件真實資料 | v3.1 已落地 |
| ARC-010 | 紙張媒材欄位必須有 Migration 預設值且變更時使媒材 cache 失效 | v3.1 已落地 |
| ARC-011 | Canvas multi-channel reference 永久保留，不以 WebGL2 MRT 取代 fallback | v3.1 已落地 |
| PERF-001 | 詳細命中前必須先做空間候選查詢 | v2.3 已落地 |
| PERF-002 | 幾何變更優先增量更新空間索引 | v2.5 已落地 |
| PERF-003 | 50,000 壓力測試目前只證明索引，不等於完整渲染達標 | 定案 |
| QA-001 | IndexedDB 主路徑與 Service Worker 必須在正常 HTTP origin 再驗證 | 待實機／外部環境 |
| QA-002 | 本次容器未提供 WebGL2，單筆及 MRT GPU shader 執行不得宣稱已在此環境通過 | 現況限制 |
| QA-003 | Runtime Health Monitor 必須有有界錯誤、操作與長幀診斷，不得無界累積 | v3.3 rc.1 已落地 |
| QA-004 | 20,000 物件大型文件與 endurance 報告是 RC 的自動化證據，但不取代真實使用者文件與實機長時測試 | 定案 |
| PWA-001 | 更新採 waiting worker 明確啟用，shell／runtime cache 分離，navigation 以 network-first 避免長期停留舊版 | v3.3 rc.1 已落地 |
| PERF-004 | 高解析度內容匯出採 bounded tile composition，上限 36M pixels／16,384 單邊；自然媒材單次 transient raster 仍有 6M／8,192 限制 | v3.2 已落地／現況限制 |
| INPUT-001 | predicted events 只作即時預覽，不得寫入正式 Stroke | v3.2 已落地 |
| INPUT-002 | 合成 PointerEvent 回歸不能取代 Apple Pencil、S Pen 或 Windows Pen 實機校準 | 定案 |
| ARC-012 | GPU 資源必須受 budget 管理；context lost 時清理 cache／target，restore 後重建 | v3.2 已落地 |
| ARC-013 | GPU self-test 失敗必須回傳結構化診斷並保留 Canvas fallback | v3.2 已落地 |
| PERF-005 | PersistentTileAtlas core 與 live Canvas adapter 已完成，但 live WebGL renderer adapter 尚未完成，不得宣稱完整 GPU atlas 上線 | v3.3 rc.2 核心已落地／整合待驗證 |
| PERF-006 | 大型 PNG 匯出採可取消、可 checkpoint、可續作的 bounded tiled composition；GPU 專用匯出另列外部門檻 | v3.3 rc.2 已落地 |
| QA-005 | 外部 GPU、觸控筆、origin 與瀏覽器測試必須可輸出有界 `INK_EXTERNAL_DIAGNOSTIC_BUNDLE_V1` | v3.3 rc.2 已落地 |
| UI-009 | INK 提供應用程式層級全螢幕切換；退出後必須恢復畫布尺寸與渲染 | v0.8.3-p2 已落地 |
| UI-010 | Inspector 寬度與關閉控制必須同列且不可重疊；專業面板主要文字不得低於可讀尺度 | v0.8.3-p2 已落地 |
| LAYER-001 | 圖層次序以直接拖曳圖層列調整，不以永久上移／下移文字按鈕作主流程 | v0.8.3-p2 已落地 |
| LAYER-002 | 新增、複製、刪除圖層集中於圖層面板底部專屬工具列 | v0.8.3-p2 已落地 |
| DOC-005 | 每次重大內部硬化必須同步更新唯一 Master Spec、版本資料與測試證據 | v0.8.3 更新定案 |

---

## 16. 變更管理

任何新增功能在進入主程式前必須回答：

1. 是否與既有入口重複？
2. 是否能以情境顯示取代永久顯示？
3. 是否遮蔽或縮小畫布？
4. 是否可在三個步驟內完成？
5. 桌面與手機是否需要不同入口？
6. 是否破壞專案格式或舊檔相容性？
7. 是否具備回歸測試？
8. 是否需要更新本主規格書？
9. GPU 功能失敗時是否具有不破壞文件的 Canvas fallback？
10. 新增媒材通道是否仍可由可編輯 Stroke 與 Paper Profile 重建？
11. 裝置校準是否區分合成測試與實機證據？
12. GPU 資源是否受預算管理並可在 context loss 後安全重建？
13. 大型匯出是否有明確 tile、像素、尺寸與記憶體上限？
14. 文件變更是否可被完整性檢查與 fingerprint 驗證？
15. 自動儲存、Runtime 診斷與更新流程是否有有界資源與安全復原路徑？
16. RC 新能力是否區分容器自動化證據與外部實機／正常 origin 證據？
17. History 是否指定最小必要 target scope，並在 diagnostics 中可辨識 fallback？
18. tile atlas 或分塊匯出是否具備取消、資源預算、checkpoint、錯誤與續作路徑？
19. 唯一 Master Spec、VERSION、README 與機器可讀測試證據是否同步？

未通過以上檢核的功能不得直接加入主程式。


---

## 17. v0.8.2 固定畫板與輸出規格

### 17.1 畫板模型

每一 Page 保存固定排版框 `artboard`，並另外保存 `workspace`；Artboard 不再與無限創作空間互斥：

- `mode`: 正規化後固定為 `fixed`；舊值只供 Migration 判斷初始工作空間；
- `preset`: 目前正式支援 `A4`；
- `orientation`: `portrait` 或 `landscape`；
- `widthMm`／`heightMm`: A4 為 210 × 297 mm 或 297 × 210 mm；
- `ppi`: 72／96／150／300／600，介面正式提供 150／300／600；
- `bleedMm`、`safeMarginMm`、`unit`；
- `showBleed`、`showSafeArea`、`showCenter`、`clipContent`。

新文件仍保存 A4 直式、300 PPI、0 mm 出血與 10 mm 安全邊界作為版面設定，但桌面與手機均以滿版創作空間啟動。舊 Format Version 4 文件缺少 `artboard` 或曾使用 `infinite` 時，Migration 必須建立固定 A4 排版框但以創作空間啟動，不得用新 A4 邊界裁掉既有內容。

### 17.2 座標與實體尺寸

- 文件世界座標以 96 CSS PPI 換算毫米；A4 直式世界尺寸約為 793.701 × 1122.520。
- 300 PPI A4 直式輸出必須為 2480 × 3508 px；橫式為 3508 × 2480 px。
- 畫板、Paper Profile 與 Camera 必須分離：畫板決定裁切與實體尺寸，Paper Profile 決定媒材，Camera 只決定觀看。

### 17.3 畫板顯示

- 固定畫板外為深灰工作區。
- 畫板顯示紙張、陰影、裁切邊界、安全邊界與中心線。
- 物件資料可以存在畫板外；`clipContent` 只影響畫面與輸出裁切，不刪除物件。
- 「符合畫板」必須以畫板加出血範圍計算相機。

### 17.4 輸出

- PNG：固定 A4 像素尺寸，可含出血與裁切線。
- SVG：固定實體 `width`／`height`（mm）與對應 ViewBox，向量物件保持可縮放。
- PDF：單頁 PDF 1.4，MediaBox 使用精確毫米換算點數；目前以高品質 JPEG 嵌入單頁，尚不是完整向量 PDF。
- 瀏覽器列印：使用 `@page size` 與 0 margin，固定 A4 實體尺寸。
- `.ink`：保存畫板設定；Format Version 維持 4。

### 17.5 分塊與即時畫板渲染

- A4 300 PPI 為 8,699,840 pixels，超過 6M transient 門檻時必須使用 `TiledExportJob`。
- 分塊輸出保留取消、checkpoint、同一 Canvas 續作與 36M／16,384 限制。
- `LiveCanvasTileRenderer` 以 `PersistentTileAtlas` 為固定畫板建立 Canvas tile cache；互動或草稿期間回退直接渲染，穩定後更新 dirty tiles。
- 此整合是 live Canvas adapter，不得描述為 live WebGL atlas 已完成。

### 17.6 v0.8.2 自動化證據

- Node unit：62／62 PASS。
- Chromium desktop/mobile runtime：54／54 PASS，Runtime errors 0。
- A4 300 PPI 分塊輸出：2480 × 3508，4 tiles，checkpoint 完成。
- PDF：`application/pdf`，有效 `%PDF-1.4` header 與 A4 MediaBox。
- HTTP／HTTPS origin 仍被容器以 `ERR_BLOCKED_BY_ADMINISTRATOR` 阻擋；Service Worker、CacheStorage、IndexedDB 主路徑需外部環境驗證。

### 17.7 決策補充

| 編號 | 決策 | 狀態 |
|---|---|---|
| ART-001 | 新文件保有 A4 固定排版框；舊文件缺欄位時以創作空間啟動，不裁掉既有內容 | v0.8.3 更新落地 |
| ART-002 | 畫板、Paper Profile 與 Camera 分離 | v0.8.2 已落地 |
| ART-003 | A4 300 PPI 精確為 2480 × 3508 px | v0.8.2 已落地 |
| EXP-001 | PNG／SVG／PDF／瀏覽器列印均可使用固定畫板範圍 | v0.8.2 已落地 |
| EXP-002 | PDF 目前為單頁 raster PDF，不宣稱完整向量 PDF | 現況限制 |
| PERF-007 | Live Canvas tile adapter 已接入；live WebGL adapter 仍為外部技術門檻 | 部分完成 |

---

## 18. v0.8.3 創作／版面雙空間與跨裝置統一規格

### 18.1 空間模型

每一 Page 必須保存 `workspace`：

- `activeSpace`: `creation` 或 `layout`；
- `showLayoutFrameInCreation`: Format Version 4 相容欄位，正規化後固定為 `false`；創作空間不得顯示 A4 框；
- `layoutViewport`: 版面空間將無限創作內容映射至 A4 的模型視埠，保存模型中心、比例與旋轉；
- `cameras.creation`／`cameras.layout`: 各自的 x、y、scale、rotation；
- `visited.creation`／`visited.layout`: 是否已進入該空間。

`page.layers` 與其中所有 Object 是唯一內容真實資料。切換空間不得複製、轉換、刪除或重新建立任何 Stroke、Shape、Text、Image 或 Group。

### 18.2 創作空間

- 內容世界維持無限座標。
- 可自由放置草稿、素材、替代構圖與畫板外內容。
- 不依 A4 邊界裁切即時視圖。
- 不顯示 A4 紙張、綠色虛線框、出血線或安全邊界；創作空間只呈現滿版無限畫布。
- 「符合內容」依全部可見物件 Bounds 計算。

### 18.3 版面空間

- 顯示 A4 紙張、出血、安全邊界、中心線與畫板外深灰工作區。
- 物件仍可存在畫板外；裁切只影響版面顯示與輸出，不刪除資料。
- PNG、SVG、PDF、瀏覽器列印及後續多頁輸出依版面空間的 Artboard 與 `layoutViewport` 結果。
- `LiveCanvasTileRenderer` 與 `PersistentTileAtlas` 主要服務穩定版面視圖與高解析度輸出。

### 18.4 切換與 Camera

- 切換前必須保存目前空間 Camera，再恢復目標空間 Camera。
- 新文件第一次進入創作空間以滿版無限畫布啟動；第一次進入版面空間先將模型內容符合版面視埠，再符合 A4 紙張。
- 桌面與手機均提供「創作／版面」分段切換。
- 桌面快捷鍵：`Ctrl+1` 進入創作空間，`Ctrl+2` 進入版面空間。
- 切換納入文件 dirty／autosave，但不得產生物件 History 項目。

### 18.5 Migration 與相容性

- v0.8.2 `artboard.mode = fixed`：遷移後初始 `activeSpace = layout`。
- 舊版或 v0.8.2 `artboard.mode = infinite`：遷移後初始 `activeSpace = creation`。
- 原 `page.camera` 必須保存到對應初始空間 Camera。
- Artboard 正規化為固定排版框，Format Version 維持 4。
- Migration 不得移動物件、改變 Transform、縮放內容或裁掉既有構圖。

### 18.6 桌面／手機視覺統一

- 桌面與手機共用 `#232426`、`#2d2e30`、`#38393b`、`#434447` Chrome 色階。
- 主要文字、次要文字與 Accent 必須共用同一 Token。
- Top Bar、Bottom Dock、Bottom Sheet、Inspector、Pages、Export、Canvas Settings、輸入欄與選取狀態使用同一視覺語言。
- 手機允許更大的按鈕高度、間距與安全區，但不得改用淺色卡片、另一組 Accent 或另一套字體性格。
- 紙張內容色保持獨立，不因 UI 深色化而改變。

### 18.7 v0.8.3 自動化證據

- Node unit：63／63 PASS。
- Chromium desktop/mobile runtime：61／61 PASS，Runtime errors 0。
- Internal release validation：76／76 PASS。
- 已驗證雙空間初始狀態、共享物件、獨立 Camera 恢復、手機切換與桌面／手機深灰 Chrome 一致性。
- 已產生桌面版面空間、桌面創作空間與手機版面空間關鍵畫面。
- 本機 HTTP origin 在測試容器仍被 `ERR_BLOCKED_BY_ADMINISTRATOR` 阻擋；IndexedDB、CacheStorage、Service Worker 主路徑仍不得宣稱外部驗證完成。
- WebGL2、實體觸控筆、Edge／Firefox／Safari、長時間實機與 GPU 專用 tiled export 仍為外部門檻。

## 19. v0.8.3 Test-Ready TR1 實測封裝規格

### 19.1 基線與凍結

- 產品版本維持 `INK v0.8.3`；`TR1` 是實測套件修訂，不改變 INK Format Version 4。
- 實測期間功能凍結，只允許修復可重現缺陷、測試腳本錯誤與封裝問題。
- 每次修正必須建立新的 package revision 或產品版本，不得覆寫既有 TR1 套件。
- ZIP、Master Spec、VERSION、測試證據與 SHA-256 必須相互對應。

### 19.2 正常 Origin 啟動

- 套件必須提供無外部依賴的 Node HTTP server，入口為 `npm start`。
- 預設監聽 `0.0.0.0:4173`，同時顯示電腦 localhost 與同區域網路手機網址。
- Server 必須正確提供 HTML、JavaScript、CSS、JSON、Web Manifest、圖片與 `.ink` MIME type。
- `service-worker.js` 必須使用 `no-store` 並維持根目錄 scope。
- 直接開啟 `index-standalone.html` 只作相容備援，不得取代正常 origin 實測。

### 19.3 標準測試資料

Test-Ready 套件必須包含確定性 fixtures：

1. 空白 A4；
2. 創作空間與畫板外物件；
3. 多圖層海報；
4. 18,000 點以上自然媒材壓力文件；
5. v0.8.2 fixed Migration；
6. v0.8.2 infinite Migration；
7. 重複 ID 無效文件；
8. Storage V3 current 損壞、previous 有效的復原情境。

Fixtures 必須可重建、可由 Migration 讀取、通過或按預期拒絕文件完整性檢核。

### 19.4 測試交接

- `TEST_EXECUTION_CHECKLIST.md` 定義 Smoke、GPU、觸控筆、長時間與完成條件。
- `TEST_MATRIX.csv` 保存裝置、瀏覽器、GPU／筆、案例、預期、實際與結果。
- `BUG_REPORT_TEMPLATE.md` 統一版本、環境、重現步驟、嚴重度與附件。
- 缺陷回報必須附 `INK_EXTERNAL_DIAGNOSTIC_BUNDLE_V1`；無法附加時需說明原因。
- 測試支援文件與機器可讀報告不是第二份正式技術文件。

### 19.5 Test-Ready 自動檢核

- `npm run test:ready` 必須驗證必要檔案、有效 fixtures、Migration、負向完整性案例、Storage recovery scenario 與本機 HTTP 服務。
- `npm run check` 必須包含 build、TypeScript strict、63 項單元測試及 Test-Ready 自動檢核。
- TR1 原始凍結證據：Test-Ready `15／15 PASS`；完整內部 Release Validation `76／76 PASS`；Chromium desktop/mobile `61／61 PASS`，Runtime errors `0`。
- Test-Ready 通過只表示套件已可交付實測，不代表正常 origin 瀏覽器 API、WebGL2、實體觸控筆、跨瀏覽器或長時間硬體門檻已關閉。

### 19.6 決策補充

| 編號 | 決策 | 狀態 |
|---|---|---|
| QA-006 | 提供無外部依賴的正常 Origin 啟動器與同 LAN 手機入口 | TR1 已落地 |
| QA-007 | 實測使用確定性 fixtures、統一矩陣、缺陷模板與診斷包 | TR1 已落地 |
| QA-008 | Test-Ready 只證明可開始實測，不取代外部裝置與瀏覽器證據 | 定案 |
| DOC-007 | INK Master Spec v2.5 是唯一正式技術文件 | TR1 已落地 |



## 20. v0.8.3-p1 首輪實測修復規格

### 20.1 預設工作空間

- 桌面與手機新文件一律以 `creation` 啟動。
- 創作空間不得繪製 A4 紙張、綠色虛線框、出血線、安全邊界或中心線。
- 既有文件重新開啟時仍恢復文件保存的 `activeSpace` 與各自 Camera。
- A4 設定仍保存在文件中，但只在版面空間顯示與輸出。

### 20.2 CAD 式版面視埠

每一 Page 的 `workspace.layoutViewport` 保存：

- `x`／`y`：創作模型的觀看中心；
- `scale`：模型內容放入 A4 的比例；
- `rotation`：版面觀看旋轉。

規則：

- 視埠只改變版面呈現，不得修改任何原始 Object Matrix、Stroke 點、圖層或 Z-order。
- 版面即時顯示、PNG、SVG、PDF 與列印必須使用同一視埠矩陣。
- 「將全部內容符合 A4 視埠」必須依全部可見物件 Bounds 計算中心與比例。
- 「視埠 1:1 置中」恢復中心 0、0、比例 1、旋轉 0。
- 版面 Camera 只控制 A4 紙張在螢幕上的觀看；不得與模型視埠混用。

### 20.3 介面缺陷修復

- 右上角工作區清單按鈕必須可開啟選單，提供創作／版面切換、符合目前空間、重設目前視圖與內容符合 A4 視埠。
- Inspector 收合標籤 Hover 不得產生白色縫隙、位移或不同背景層。
- Inspector 與畫布設定面板各使用一個明確 `×` 關閉控制，圖示、位置與語意不得混亂。
- 快速選色 input 必須錨定在左側顏色控制內，不得由右側 Inspector 的離屏 color input 觸發而造成色版裁切。
- 畫布設定按鈕採 24 px 同心幾何圖示；中心點位於 12、12。
- 畫布設定面板主標題至少 12 px，分組與主要欄位至少 11 px，主要控制列高度至少 28 px。

### 20.4 橡皮游標與命中半徑

- 橡皮游標與實際擦除必須共用單一 `eraserRadiusWorld`。
- 世界半徑由橡皮尺寸決定，不得再除以 Camera scale。
- 螢幕游標半徑為 `eraserRadiusWorld × Camera scale × LayoutViewport scale`；創作空間的 LayoutViewport scale 視為 1。
- Device Pixel Ratio 只影響 Canvas backing store，不得再次改變 CSS 游標半徑。
- 縮放、旋轉、創作／版面切換後，游標與命中範圍仍須一致。

### 20.5 P1 自動化證據

- Node Unit：64／64 PASS。
- Chromium desktop/mobile Runtime：72／72 PASS，Runtime errors 0。
- P1 Release Validation：83／83 PASS。
- Test-Ready 自動檢核：15／15 PASS。
- 已建立桌面滿版創作空間、桌面 A4 模型視埠與手機滿版創作空間關鍵畫面。
- 正常 HTTP／HTTPS、WebGL2 實機、實體觸控筆、Edge／Firefox／Safari、多 GPU 與長時間硬體測試仍是外部門檻，不得由 P1 容器回歸推論為完成。

### 20.6 決策補充

| 編號 | 決策 | 狀態 |
|---|---|---|
| WS-005 | 桌面與手機新文件預設滿版創作空間，創作空間不顯示 A4 框 | v0.8.3-p1 已落地 |
| WS-006 | 版面空間以獨立模型視埠決定無限創作內容放入 A4 的中心、比例與旋轉 | v0.8.3-p1 已落地 |
| UI-008 | 工作區選單、Inspector 邊緣與關閉控制、快速選色及畫布設定可讀性完成首輪修復 | v0.8.3-p1 已落地 |
| INPUT-003 | 橡皮游標與擦除命中共用單一世界半徑 | v0.8.3-p1 已落地 |
| DOC-008 | INK Master Spec v2.5 是目前唯一正式技術文件 | v0.8.3-p1 已落地 |


## 21. v0.8.3-p2 全螢幕與圖層工作流規格

### 21.1 全螢幕模式

- 桌面頂端列必須提供明確的「進入全螢幕／退出全螢幕」按鈕。
- 全螢幕使用瀏覽器 Fullscreen API，優先作用於 INK 應用程式根節點，不對文件內容建立第二份狀態。
- `Ctrl+Shift+F` 可切換全螢幕；`Esc` 依瀏覽器標準退出。
- 全螢幕狀態必須更新按鈕圖示、title、aria-label 與 aria-pressed。
- 進入或退出後必須重新量測 Canvas CSS 尺寸、Device Pixel Ratio 與 backing store，並立即重繪。
- Fullscreen API 不可用或拒絕時，程式不得中止，必須顯示可理解提示。

### 21.2 Inspector 標題列控制

- 檢查器寬度切換與關閉按鈕必須採同一水平列，不得因共用容器樣式而轉為垂直堆疊或重疊。
- 兩個控制各自保有 24 px 桌面命中區、獨立圖示與 tooltip。
- 檢查器寬度控制使用面板寬度語意圖示；關閉使用單一 `×`。
- Header actions 必須 `flex-direction: row`、不換行、不可壓縮至互相覆蓋。

### 21.3 圖層面板

- 圖層清單仍以視覺由上至下表示前景至背景。
- 每個圖層列必須可拖曳；拖曳時顯示來源狀態與插入位置線。
- 拖曳排序只改變 `page.layers` 次序，不得複製、刪除或修改圖層內物件、Transform、Stroke 點與 ID。
- 排序必須納入 target-scoped History，可 Undo／Redo。
- 移除永久「上移／下移」文字按鈕，避免與直接拖曳形成重複入口。
- 新增、複製、刪除圖層集中至圖層面板底部專屬工具列；刪除按鈕保有危險狀態。
- 圖層面板底部工具列在清單捲動時保持可見；手機使用較大命中區，但沿用同一圖示與順序。

### 21.4 面板文字尺度

- 桌面 Inspector 主標題與主要欄位以約 10.5–11 px 為基線。
- 頁籤文字不得低於 10 px；圖層名稱不得低於 10.5 px；次要物件數可使用約 8.5–9 px。
- 此調整參考 Photoshop 的專業面板可讀性與密度，不複製其品牌外觀或功能配置。
- 放大文字後不得造成欄位截斷、按鈕重疊、文件 viewport overflow 或手機版面破壞。

### 21.5 P2 自動化證據

- Node Unit：64／64 PASS。
- Chromium desktop/mobile Runtime：82／82 PASS，Runtime errors 0。
- P2 Release Validation：94／94 PASS。
- 已驗證 Fullscreen API 進入／退出、圖示與 aria 狀態。
- 已驗證圖層底部工具列、移除上移／下移入口、可拖曳圖層列與排序後 ID 唯一性。
- 已驗證 Inspector 兩個標題列按鈕水平排列且矩形不相交。
- 已驗證圖層與 Inspector 文字尺度、桌面／手機無文件 overflow。
- 正常 HTTP／HTTPS、WebGL2 實機、實體觸控筆、Edge／Firefox／Safari、多 GPU 與長時間硬體測試仍為外部門檻。

### 21.6 決策補充

| 編號 | 決策 | 狀態 |
|---|---|---|
| UI-009 | 全螢幕是應用程式顯示狀態，不改變文件或畫布內容 | v0.8.3-p2 已落地 |
| UI-010 | Inspector 標題列控制同列、不重疊，文字尺度對齊專業桌面面板 | v0.8.3-p2 已落地 |
| LAYER-001 | 圖層以拖曳直接排序並納入 History | v0.8.3-p2 已落地 |
| LAYER-002 | 圖層新增、複製、刪除集中在底部專屬工具列 | v0.8.3-p2 已落地 |
| DOC-009 | INK Master Spec v2.5 是目前唯一正式技術文件 | v0.8.3-p2 已落地 |

## 22. v0.8.3-p3 視覺歷史記錄面板規格

### 22.1 面板位置與用途

- Smart Inspector 一級頁籤為「工具｜圖層｜歷史｜物件」。
- 歷史記錄面板不得塞入圖層底部工具列；它與圖層共用右側 Inspector 空間。
- Undo／Redo 按鈕保留作快速單步操作；歷史面板負責查看並跳轉到指定步驟。
- 操作仍以 Transaction 為單位，例如完成一筆、完成一次拖曳、完成一次圖層排序；不得把每個 Pointer 取樣點列成一步。

### 22.2 歷史步驟與跳轉

- 面板顯示「歷史起點」、已套用步驟與可重做步驟。
- 目前狀態必須有明確選取標記；可重做步驟以較低對比顯示。
- 點擊任一步必須批次套用既有 forward／inverse Patch，將文件移至該狀態。
- 歷史跳轉不得建立新的 History 項目，也不得改變物件 ID、圖層結構或 Format Version。
- 在較早步驟後執行新操作時，原有 Redo 分支依一般線性 History 規則清除。

### 22.3 保留步數

- 預設保留 30 步。
- 使用者可選擇 20／30／50 步，不提供 100 步預設。
- 設定保存於 `localStorage` 的 `ink-history-limit`，只屬介面／工作階段偏好。
- 降低上限時先移除最早的 Undo 記錄，再限制較遠的 Redo 記錄。
- HistoryManager 必須回報 `limit`、undo、redo、patch count 與 stored bytes 診斷。

### 22.4 文件與記憶體政策

- 歷史記錄預設只保存本次工作階段，不寫入 `.ink` 文件。
- `.ink` 仍只保存目前文件狀態，Format Version 維持 4。
- History 仍採 target-scoped、ID-aware Patch；未指定 targets 的 full-document fallback 僅保留相容用途。
- 歷史面板不得使 Runtime 診斷或 DOM 節點無界增長；列表最多顯示目前設定的保留步數加一個歷史起點。

### 22.5 P3 自動化證據

- Node Unit：65／65 PASS。
- Chromium desktop/mobile Runtime：86／86 PASS，Runtime errors 0。
- P3 Release Validation：101／101 PASS。
- 已驗證歷史頁籤、20／30／50 設定、預設 30 步、目前／未來狀態顯示與點擊跳轉。
- 已驗證跳轉後 Undo／Redo stack 重建、文件內容正確恢復與 Format Version 4 不變。
- 正常 HTTP／HTTPS、WebGL2 實機、實體觸控筆、Edge／Firefox／Safari、多 GPU 與長時間硬體測試仍為外部門檻。

### 22.6 決策補充

| 編號 | 決策 | 狀態 |
|---|---|---|
| HIST-001 | 歷史記錄作為 Inspector 獨立頁籤，不與圖層工具列混合 | v0.8.3-p3 已落地 |
| HIST-002 | 預設保留 30 步，可調整 20／30／50 | v0.8.3-p3 已落地 |
| HIST-003 | 點擊步驟以既有 Patch 跳轉，不建立新歷史項目 | v0.8.3-p3 已落地 |
| HIST-004 | 歷史只保存本次工作階段，不寫入 `.ink` | v0.8.3-p3 已落地 |
| DOC-010 | INK Master Spec v2.5 是 P3 唯一正式技術文件 | v0.8.3-p3 已落地 |

