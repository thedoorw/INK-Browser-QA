# INK Photoshop 精確對齊檢查清單與修改計畫 v1.0

DATE: 2026-09-30（Asia/Taipei）
ROLE: INK UI Standards Supervisor MR
STATUS: CURRENT_RENDERED_DELTA_REGISTER / MODIFICATION_PLAN / NO_PRODUCT_MUTATION
SOURCE_CONTEXT_SHA: 315d60f4df4c66afe967ae81f0ff58e084bf6268

## 本輪判準

USER 本輪要求「絕對相似，而非大約」。共享的結構、位置、尺寸、密度、圖示輪廓與互動，以精確符合所選參考狀態為目標。未量測項目不可寫成大約符合；未取證項目不驗收。既有 USER-locked light palette、確實不存在的 PS 能力及 USER 明示差異仍是具名例外；Light 選擇不允許任意混用深色 popup。

幾何目標為 delta=0。原 dispatch 的 ≤1 CSS px 不再是自行放行可見差異的許可；如量測或 raster rounding 有不確定性，記錄來源與誤差，保留待驗證。文字 antialiasing 分開記錄，不要求把平台 raster noise 當結構；但不能用它免除字型、基線、字距或圖示形狀。

本輪只制定清單、檢查與修改計畫，沒有修改正式產品或向他人送出執行指令。

## 參考與實際檢查環境

- `reference/ui/photoshop/PvsI-1.png` / `PvsI-2.png` / `PvsI-3.png`：逐圖視覺檢查，皆1920×1080。
- `reference/ui/photoshop/ps-1.png` / `PS-2.png` / `PS-3.png`：逐圖視覺檢查，皆1280×1024；應用程式區域1280×994。
- USER 上傳 `image(20260930-075500).png`：包含灰綠虛線、尺規及深色視窗選單。
- 實際開啟 `https://thedoorw.github.io/INK-Browser-QA/product/source/`，cloud Chromium viewport1363×936、DPR1、visualViewport.scale1。瀏覽器／OS 與 USER Windows 並不相同，因此不可拿未正規化整張 screenshot 直接算像素差。
- 檢查時段為本轮工具執行期間；不以檔案日期推導部署版本。
- 比對順序：rendered delta→同類選單／控制→數值→狀態取證→來源成因。此視窗先前已讀過舊 review，不能宣稱獨立 reviewer 完全 blind；本輪 delta discovery 未採用那些 PASS 作結論。

### 身份證據界線

來源 main SHA 如上；來源 CSS Git blob `65b717a8aa6898bbf70ef9becf246efdb61444af`，web-shell Git blob `4bbd69b8143bc41d3e57ce052c5923d47df799a9`。
公開 deployed HTTP 的 CSS 與 web-shell bytes 分別和此 SHA 的來源逐位相同；hash見 `evidence/ink-ui-ps-exact-alignment-20260930/http-identity.json`。
DOM 的 stylesheet/script URLs 已記錄。這只證明 SOURCE→HTTP 與 DOM resource URL，並未讀取瀏覽器快取實際執行 bytes 的 hash，也未覆蓋所有 module；因此不宣稱完整 browser-loaded identity chain 已關閉。可見缺陷成立於本次實際頁面，不能自動歸因全部 current-main bytes。

### 重要審查漏洞

舊 `INK_UI_PVSI_PIXEL_ALIGNMENT_EVIDENCE_v1.0.md` 的0.00184px是 flex-ratio 公式計算，不是 rendered screenshot residual；不可用于整體視覺驗收。
Photoshop document zoom66.67%只縮放文件內容，不縮放選單、Tools、ruler厚度與panel chrome。PvsI內嵌 INK 截圖在 Photoshop 文件內會再次被文件zoom縮放；外側 Photoshop chrome 必須獨立量測。不能將整張 PvsI 以66.67%一律正規化。
未知 scaling 必須以外層 chrome多個獨立 anchor、原圖尺寸／裁切以及一致比例交叉核對。外側工具列與內嵌文件图是不同座標系。
舊證據以 PLATFORM_RENDERING / REFERENCE_SCALE_LIMIT / VALID_USER_STATE 處置剩餘差異，超出既有四類差異處置。它們應記在證據限制欄；既有可見差異仍保持 FIX_NOW，除非具名有效例外。

## 已確認的優先差異

1. 「視窗」popup仍深色，與其他十個白底選單不同；行高／padding框架也不同。
2. 尺規厚度已具17px證據，但標字、刻度、基線與單位行为不能由厚度推出；canvas字型目前固定9px。
3. 參考線落下後灰綠虛線，尚未按 PS placed/drag狀態分別建立精確樣式。
4. 工具列是 SVG與文字符號混合，代表圖示、排序与flyout分組未按能力逐项對位。
5. Navigator zoom row順序／glyph与PS不同，且slider和其他同類控件不一致。
6. Layers opacity在底部，fx/mask等在上方大按鈕，visibility/lock使用字形占位，缺對應縮圖欄。
7. Preferences仍有兩行深色titlebar、不同分類列節奏與模糊backdrop；Reference保留Web form密度及native English file picker。

## 逐項清單

「待驗證」是證據狀態，並非新的差異豁免。未觀察到的項目不預判為缺陷或合格。表內數值是本輪DOM實測或具名參考值，不是自創容差。

| ID | 區域／項目 | 精確判準 | 本輪觀察 | 證據狀態／處置 |
|---|---|---|---|---|
| A01 | 頂端／Logo 旁文字 | 依 USER 保留 Logo；移除旁邊 INK／0.1 字樣 | 目前仍顯示 INK 0.1 | 差異已觀察／FIX_NOW |
| A02 | 頂端／Menu／Options／分隔線 | PS 原圖鎖定 24+1+35+1；逐條邊界量測 | 實測 Menu 含邊界 25；Options 35；工作區起點 y=61 | 數值已記錄；未整體驗收 |
| A03 | 頂端／選單標籤間距、基線 | 逐個標籤對應 PS；記 glyph envelope、基線、字距與點擊框 | 不能由 font-size:12px 推導字形一致 | 待驗證 |
| A04 | 頂端／Options 工具上下文 | 選取／鋼筆／筆刷／橡皮擦／形狀／文字各自對照；高度固定 | 本輪只觀察鋼筆，不代表其他工具對齊 | 待驗證 |
| A05 | 頂端／Options 控制幾何 | 逐個圖示框、數值框、分隔線與間距對照 | 目前 quickColor 24×24；外層 23×23，需檢查是否偏心 | 數值已記錄；待參考量測 |
| A06 | 頂端／文件標題／狀態入口 | 遵守真實文件能力；不做無法切換的假分頁 | PS 文件 tab 為已記錄能力例外；不以新增空白列湊高度 | 待驗證 |
| M01 | 選單／全部應用程式 popup 顏色 | 同一 Light 語意色票；normal／hover／checked／disabled 同類一致 | 10 個白底；視窗 rgb(56,57,59)，仍有深色／綠色選中列 | 差異已觀察／FIX_NOW |
| M02 | 選單／popup 行高、padding、邊界 | 相同選單項目類別共用逐項量測值；寬度按內容 | 一般項目 22px、padding 4px；視窗使用另一組框架／密度 | 差異已觀察／FIX_NOW |
| M03 | 選單／勾選／捷徑／子選單欄 | 按 PS 的 check、label、shortcut、arrow 四欄對齊 | 視窗以面板 icon／分類組方式呈現；需逐项對照能力與位置 | 待驗證 |
| M04 | 選單／面板選單、工作區 popup、工具 flyout | 各類有完整名冊；同類一致，跨類依 PS 對照 | 只開啟外觀群組選項；其餘未逐一驗證 | 部分已觀察 |
| M05 | 選單／hover／focus／disabled／checked | 每種狀態獨立截圖；不可用 normal 代替 | 11 個應用程式選單已開啟；未驗證全部狀態 | 待驗證 |
| M06 | 選單／鍵盤與關閉行为 | Escape、外點、左右切換、上下移動、Enter、子選單，逐條黑箱 | 已用 Escape 關閉；其餘保留待驗證 | 待驗證 |
| T01 | 工具列／單／雙欄外框 | PS 原圖 72+1／39+1；共用能力與重排規則 | 雙欄 73px；兩種狀態已操作 | 數值／切換已記錄；未整體驗收 |
| T02 | 工具列／collapse strip／箭頭 | PS 11px strip+1px divider；箭頭 envelope、位置、hitbox 分開 | 不可只驗證 strip 高度 | 待驗證 |
| T03 | 工具列／row／column pitch、累計佔高 | 逐列對照；末列誤差也量測；參考 row pitch 26px、column 33px | 局部 SVG 中心 y=86／112，重複間距 26；工具名冊尚未對齊 | 数值已記錄；未整體驗收 |
| T04 | 工具列／工具代表／排序／flyout | 先按能力對應 PS 工具組，再固定位置與代表圖示 | 鋼筆、橡皮擦先出現；取樣／仿製／修復等以符號替代，整體節奏不同 | 差異已觀察／FIX_NOW |
| T05 | 工具列／圖示輪廓與光學重量 | 對應工具使用與 PS 相同視覺語法；逐個輪廓、線寬、重心量測 | ◫／◩／⌖／♧／✚／◐／◌ 等文字字形與其他 SVG 混用 | 差異已觀察／FIX_NOW |
| T06 | 工具列／active／hover／disabled／focus | 各類型同狀態對照；fill bounds 與 hitbox 分開 | 有 active 填色，不足以證明精確相似 | 待驗證 |
| T07 | 工具列／前／背景色塊 | PS2 鎖定 18×18，overlap 10×10；utility 位置另量 | 實測色塊 18×18，重疊 10×10；不表示整個色塊區已對齊 | 數值已記錄；未整體驗收 |
| T08 | 工具列／swap／reset 與下方 utilities | 依 PS 定位與圖示；支持功能歸位，無能力才例外 | swap／reset 用文字字形；下方 Quick Mask／screen mode 未完成能力對位 | 差異已觀察／FIX_NOW |
| R01 | 尺規／橫／直 ruler 與 corner | 17px／17px／17×17；不含假文件 tab 補白 | 實測 17px；corner x73 y61；stage x90 y78 | 數值已記錄；未整體驗收 |
| R02 | 尺規／標字大小、方向、基線、留白 | PS 原圖逐字形 envelope／baseline；不可只測 ruler 厚度 | 目前直尺整串文字旋轉90°，PS 原圖為直排讀法；標字細小且 source 固定9px，需分別量測字形／基線 | 差異已觀察／FIX_NOW |
| R03 | 尺規／長／中／短 tick 與線寬 | 逐種刻度量測長度、間隔、貼邊；1 raster px 與 CSS px 分開 | source 使用 7／10／13 到 canvas 底部；尚無同尺度 raster delta | 待驗證 |
| R04 | 尺規／單位／原點／正負值 | px／mm 狀態与标字結果一致；與指南讀值同一座標來源 | Preferences 顯示 mm；ruler renderer 使用 world x/y，單位換算需黑箱確認 | 待驗證 |
| R05 | 尺規／zoom／pan／rotate 同步 | 不同縮放與平移逐狀態檢查，單位与密度不能漂移 | 本輪只在畫布 zoom100% 檢查；USER 圖 zoom3% 不可直接比數字 | 待驗證 |
| G01 | 參考線／落下的線樣式 | 以 PS placed 與 drag capture 分別鎖定色彩、實／虛線、厚度 | 目前落下的水平／垂直線是灰綠色虛線；USER 已拒絕其讀法 | 差異已觀察／FIX_NOW |
| G02 | 參考線／drag preview／座標提示 | 依 PS horizontal／vertical drag 參考逐狀態量測；不能把 preview 當 placed | 已拖出兩方向；截圖看到 X:-380.5 提示與 preview；中途 held-pointer 状态未完整取證 | 部分已觀察 |
| G03 | 參考線／create／move／delete／lock／show-hide | 每項以實際 UI 操作與結果證明；線外觀不替代互動 | 本輪只操作 create；其餘未驗證 | 待驗證 |
| G04 | 參考線／persistent guide／smart guide／snap 區分 | 三者外觀与生命週期依 PS 類別區分；不得共用一種虛線代替 | 尚未取證 smart snap／equal spacing 狀態 | 待驗證 |
| G05 | 參考線／live readout 座標／單位 | 與 ruler、camera、guide 同一座標 authority；文字格式精確對照 | 不能用已存在 handler 作證明 | 待驗證 |
| P01 | 右側面板／expanded／collapsed 邊界 | 252px 參考狀態／40px collapsed 含 divider；resize 不覆蓋畫布 | expanded 外框 252；已收合與展開 | 數值／切換已記錄；未整體驗收 |
| P02 | 右側面板／A/B/C 比例与 splitter | 只在 1280×994 匹配環境檢查 269／261／384；splitter3px；其他尺寸另外記錄 | 本輪 viewport1363×936；tabs y73／327.921875／575.375，不可宣稱等於指定 viewport | 數值已記錄；待匹配環境 |
| P03 | 右側面板／tabs／active 裝飾／字距 | 28px band、逐 tab baseline、padding、分界與 active state 對照 | band28px；當前蓝色頂線／粗體仍需 raster 對照 | 待驗證 |
| P04 | 右側面板／options 圖示／collapse 圖示 | 按 PS glyph envelope，不能使用不同字體的替代符號 | options 是 ☰ 文字字形；collapse 是單角括號字形 | 差異已觀察／FIX_NOW |
| P05 | 右側面板／body padding／footer／scrollbar | 逐個 panel 測 top/right/bottom/left；同類捲軸一致 | Navigator footer33px但內部控制排列不同；不能推導 panel 已對齊 | 待驗證 |
| P06 | 右側面板／width／splitter resize 与保存 | 拖曳中、after、reload 狀態分别量測；保留原 authority | 本輪未完成 resize／reload，保留待驗證 | 待驗證 |
| N01 | Navigator／zoom row 控制順序 | 按 PS：比例欄位→小縮放圖示→slider→大縮放圖示；既有其他命令另歸位 | 目前為符合／−／slider／100%／＋，其結構与 PS 不同 | 差異已觀察／FIX_NOW |
| N02 | Navigator／slider thumb／icon／數值欄 | 按 PS 對應輪廓、尺寸與基線；同類 slider theme 一致 | Navigator 藍色圓 knob；其他 sliders 綠色，PS 是另一種輪廓 | 差異已觀察／FIX_NOW |
| N03 | Navigator／preview／proxy／空狀態 | 以同內容、同zoom對照；thumbnail比例與 margins 分開量測 | 空白畫布下 preview219×149.3125；不能以無內容證明 populated proxy | 待驗證 |
| N04 | Navigator／pan／proxy drag／高zoom | 真實內容的相同視圖狀態，對照 main viewport 與 proxy | 本輪未創作／匯入測試內容，保留待驗證 | 待驗證 |
| L01 | Layers／header controls 拓撲 | filter/type→blend+opacity→lock/其餘支持屬性；逐項能力核對 | opacity 在面板底部；上方是 blend+三個大按鈕，與 PS 不同 | 差異已觀察／FIX_NOW |
| L02 | Layers／filter、lock、fill 主入口 | 先查現有能力；支持者移回 PS 對應位置，無能力有據例外 | 不可從 UI 沒顯示就判 CAPABILITY_ABSENT | 待驗證 |
| L03 | Layers／layer row 的眼睛／縮圖／名稱／鎖 | PS 對應列欄位与35px pitch 分開核驗 | 目前用 ◉／○ 表示 visibility／lock，缺 PS 型態的縮圖欄；物件數文字擠在第二行 | 差異已觀察／FIX_NOW |
| L04 | Layers／selected／hidden／locked／long name | 每個狀態獨立取證，不用單列空文件覆蓋全部 | 本輪只有選中空白 layer1 | 待驗證 |
| L05 | Layers／footer actions 主位置 | PS 中對應 action 按鈕在 footer；固定 icon envelope／pitch | 目前 footer只有新增、複製、刪除；fx／mask 等在上方占大按鈕 | 差異已觀察／FIX_NOW |
| L06 | Layers／drag ghost／insertion／drop | 分別驗證拖曳中與落下後；接回既有 History | 本輪未做 reorder，不引用舊 PASS | 待驗證 |
| C01 | 創作面板／共用工作站控件密度 | INK 專有功能採 PS 同類面板 form grammar；逐 row height／gap／label欄位 | 參考面板仍像 Web form；大型輸入、大按鈕與工程式標題占位 | 差異已觀察／FIX_NOW |
| C02 | 創作面板／file picker 語言与封裝 | 顯示文字／按鈕形態由 INK 語意控件控制；不同 OS 不變形 | Linux 顯示 Choose File／N...en，與繁中 shell 不一致 | 差異已觀察／FIX_NOW |
| C03 | 創作面板／Libraries／Compose／CHAT／Revision | 逐 panel 擷取，labels、inputs、buttons、sliders 同類整套比對 | 本輪未切遍四 panel，不以 Reference 外觀代證 | 待驗證 |
| H01 | 其他面板／Properties／Color／Adjustments | 同類 header/body/footer；支持控件按 PS 主位置 | 本輪未逐 panel檢查 | 待驗證 |
| H02 | 其他面板／History／Channels／Pages | 逐 panel與空／有內容状态；History／Revision 語意分開 | 本輪未逐 panel檢查 | 待驗證 |
| D01 | Preferences／titlebar／dialog／navigation grammar | 參考 PS-3；单行title、分類列節奏、內容區、動作區；light 例外限色票 | 現在深色兩行 INK+偏好設定、32px類型分類列、大型模糊 backdrop；結構與 PS 不同 | 差異已觀察／FIX_NOW |
| D02 | Preferences／各類內容／按鈕／關閉與焦點 | 逐類別 normal/focus/keyboard/close；不憑外框判斷 | 一般／尺規分類已開啟；其餘分類未逐項操作 | 待驗證 |
| D03 | Preferences／Branding preview／persist／reset | 保持既有能力；不因移除主選單文字刪除設定能力 | 本輪未更改 Branding 或產品預設 | 待驗證 |
| S01 | 底部／status segmentation／zoom／info | PS zoom/info 主位置与17px strip；按現有能力對位 | 現在 zoom 在右，PS 左；需對照主入口与既有狀態資訊 | 差異已觀察／FIX_NOW |
| S02 | 底部／document scrollbars | 對應 state與16px reference；thumb為狀態派生，不固定長度 | 本輪未以有內容高zoom驗證 | 待驗證 |
| X01 | 全域／字體／圖示／表面 token 名冊 | 完整列出實際元件；每類 baseline、line-height、stroke与狀態共用 | 目前存在 canvas9px label、SVG与字形混搭；需完整 cross-class audit | 待驗證 |
| X02 | 全域／first paint／reload／持久化狀態 | 首屏、穩定屏、reload分別取證；不同快取不得冒用 SHA | 本輪看到部分操作後 AX 與 screenshot 有過渡差，證據須以穩定畫面為準 | 待驗證 |
| X03 | 全域／能力與例外逐項帳本 | 只允许 FIX_NOW/THEME_OR_COLOR_OVERRIDE/CAPABILITY_ABSENT/USER_OVERRIDE | 未知 scale、platform rendering、valid user state 屬證據條件，不是第五類例外 | 待驗證 |

## 修改計畫（供下一輪具體發包；本文件不自行啟動執行）

| 修改包 | 清單範圍 | 先做什麼 | 必須交回的證據 |
|---|---|---|---|
| 共用 chrome／popup／圖示 | A01–A06、M01–M06、X01 | 移除Logo旁字樣；統一menu surface與item grammar；建立icon/class名冊。依PS逐項量測，不只改背景 | 十一個popup同狀態截圖＋逐列geometry/color表；toolbar/icon別表；剩餘差異 |
| ruler／guide／snap | R01–R05、G01–G05 | 先分開ruler label/tick、placed guide、drag preview、smart snap；恢復已有interaction原圖或原始附件；量測後訂精確值 | 橫／直尺規特寫；兩方向drag與placed；各unit/zoom/pan；create/move/delete/lock/show-hide結果 |
| Tools／global color | T01–T08 | capability→PS tool group→代表→flyout→順序→幾何；以真實SVG取代字形占位；不能新增不存在能力 | 單／雙欄、全列與flyout截图；逐工具映射；icon envelope／hitbox／末列累計誤差 |
| panels／Navigator／Layers | P01–P06、N01–N04、L01–L06、S01–S02 | 先重建控制拓撲，再調密度；Navigator欄位順序、Layers控制與footer歸位；預設比例和保存狀態分開 | 匹配viewport與reset state的截圖；有內容proxy；多layer状态／reorder；resize前中後 |
| 全面控件一致性／Preferences | C01–C03、H01–H02、D01–D03、X02–X03 | 專有INK功能共用PS同類控件語法；分類dialog對PS-3；封裝native OS-dependent控件 | 每個panel／category；normal/hover/focus/disabled；first-paint/reload；剩餘證據缺口 |

產品改動保持既有Document/History/Renderer/camera/guide authority、FORMAT_VERSION4和已安裝能力；UI-only改動落在既有shell/CSS與對應UI模組。若尺規單位或guide state需要Core變更，獨立回報整合需求，不以改外觀偷換authority。沒有新增Runtime門檻。

## 固定驗證記錄格式

每項使用：ID、reference path/blob/hash、reference crop/座標系、viewport/DPR/zoom/OS scale、UIstate、source/artifact/deployed/browser identity、before/after screenshot、reference/current數值與delta、量測不確定性、interaction結果、例外authority、review結論。

只准四種已觀察差異處置：FIX_NOW / THEME_OR_COLOR_OVERRIDE / CAPABILITY_ABSENT / USER_OVERRIDE。能力例外須指出capability authority條目；USER例外須指出原指令。幾何已記錄≠整體對齊；一張empty panel≠populated state；source-computed≠rendered measurement。

### 本輪 state coverage

| 狀態 | 本輪實際檢查 | 仍缺 |
|---|---|---|
| 應用程式選單 | 十一個逐一開啟，量測visible popup與children | 各hover/focus/checked/disabled/submenu與完整keyboard |
| Tools | single/dual切換；dual數值与外觀 | flyout全組；各工具context与狀態 |
| Dock | collapsed/expanded切換 | resize、保存reload與其他floating狀態 |
| ruler/guide | rulerOFF/ON；水平／垂直create；placed與部分drag feedback | held-pointer中途capture、move/delete/lock/snap、unit/zoom/pan |
| panel menu | 外觀group選項 | 創作／文件group及各panel-local內容 |
| Navigator/Layers/Reference | default空白document與空layer | 有內容、高zoom、proxy drag、多layer與reorder |
| Preferences | 一般、尺規分類開啟與關閉 | 其餘分類、Branding persist/reset、keyboard/focus |

## 證據文件

Repository evidence folder: `working/evidence/ink-ui-ps-exact-alignment-20260930/`。
保留current-overview、file-menu、window-menu、rulers-on、rulers-guides、guides-placed、tools-single、dock-collapsed、panel-options、preferences、preferences-rulers截圖，以及geometry/menu-metrics/http-identity/dom-resource-links JSON。
CSV鏡像：`working/INK_UI_PS_EXACT_ALIGNMENT_CHECKLIST_v1.0.csv`。

補充參考：`working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md`具名列出PS guide/drag原附件，但其原始圖目前未在本輪Git tree的reference/ui/photoshop目錄中，故精確guide色值／dash／live readout尺寸仍需還原原圖后量測，不能以文字描述冒充pixel measurement。

不宣稱UI對齊或完成。後續只按新清單的實際證據逐項驗收，最後由USER判定。
