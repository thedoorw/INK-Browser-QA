# INK UI 現況複查與修正工作單 — 2026-10-01

## Current execution reconciliation — 2026-10-01
USER subsequently authorized actual repair before Photoshop modular-system research. Source published at 08180aa001463ea623a4ad45c9aab5d0dd0be509; results and scoped evidence: [repair result](INK_UI_REPAIR_RESULT_20261001.md). Earlier NONE / NOT_EXECUTED fields below describe the previous planning snapshot only.

UIR-01: previous same-class assumption withdrawn. Footer image-effect filterStack is not PS layer-search/type filter; do not relocate on that false equivalence. UIR-02: layout/contrast/category defects repaired and rendered; new OK/Cancel semantics remain undecided. UIR-03: duplicate removed and popup checked. UIR-04: translated name/source routing retained; full interaction not closed. UIR-05: prose removed; cross-tool color synchronization not revalidated this batch. Added repairs: finite two-state workspace, ruler/Navigator document bounds, continuous top-strip color, shared SVG sizing/stroke, branding action alignment. These have scoped preview evidence, not complete PS PASS.

Official cached session activation was rejected by automatic approval review; independent generated preview verified without activating it. Remaining coverage is explicit in result report.

## Historical planning snapshot
STATUS: USER_AUTHORIZED_DOCUMENT_RECONCILIATION_AND_BOUNDED_REPAIR_PLANNING
OWNER: INK UI Standards Supervisor MR
PRODUCT_MUTATION: NONE
IMPLEMENTATION_EXECUTOR: DIRECT_UI_MR
EXECUTION_STATUS: QUEUED_IN_SSOT / NOT_EXECUTED / NO_AGENT_MESSAGE_SENT

## 依據與證據界線
USER 已要求更新過時文件狀態，並安排確實尚未修正的項目。
本次操作公開 INK product/source 頁面，viewport 1363×936、DPR1；對照 ps-1 / PS-2 / PS-3 與 Master Guide。畫面與 DOM/AX 為本對話即時工具觀察，尚未提交可重播 screenshot package；完整 source→artifact→deployed→browser-loaded identity chain 未建立，不能宣稱觀察適用於任意 main SHA。
先前已讀歷史清單，這是 delta-first 複查，不宣稱獨立 blind review。
工具切換與 tab 切換的立即 AX/DOM 曾落後畫面，穩定觀察才可定案。未穩定逐頁取證者不驗收。

## 舊紀錄狀態校正
| ID | 2026-10-01 實際觀察 | 現行判定 |
|---|---|---|
| A01 | Logo 旁已無可見 INK 0.1 | 舊觀察已過時；此可見子項未重現 |
| M01 | 十一個應用程式 popup 均為 rgb(255,255,255)，含 Window | 深色 Window 子項未重現；hover/checked/disabled 未整套驗證 |
| M02/M03 | Window 已為白底勾選/文字列，寬196px | 舊框架描述過時；行高、各欄與參考仍待完整量測 |
| T04/T05/T08 | 目前工具排序及圖示、swap/reset 已改動 | 舊符號/排序描述不作現存證據；全組輪廓/flyout 待複查 |
| G01 | placed guide 現為細實線 | 舊灰綠虛線描述未重現；PS 精確樣式待原互動圖 |
| G03 | 水平 guide create→move→drag-back delete 成功；History有三筆對應紀錄 | 僅這三種水平操作已觀察；vertical/lock/show-hide 待驗證 |
| N01/N02 | Navigator 比例欄→小縮放圖示→slider→大縮放圖示 | 舊順序已不成立；輪廓、基線與高zoom仍待驗證 |
| L01/L03/L05 | opacity 已在上方；有縮圖/眼睛；效果與mask已在footer | 這些舊缺陷已不成立；整體控制拓撲仍有差異 |
| C02 | Reference 顯示繁中「選擇檔案…／未選擇檔案」 | 舊英文 picker 子項未重現；跨OS未驗證 |
| D01 | Preferences 已單行淺色titlebar | 舊雙行深色titlebar未重現；動作區/內容布局仍不同 |
| S01 | status zoom 已在左；高度17px | 舊 zoom 在右描述未重現；其餘分段未驗收 |

幾何：applicationMenus height24、Options y25 height35、workspace起点y61；stage x90/y78；right stack width252；status height17。此為 DOM_MEASURED，不能代替完整 rendered fidelity。

## 有界修正安排
下列均為已觀察差異，處置 FIX_NOW；未有具名例外前保持開放。
| ID | 問題 | 修正範圍 | 驗證要求 |
|---|---|---|---|
| UIR-01 | Layers filter 位於 footer；上方為 opacity/lock，未呈現 PS filter→blend/opacity→lock 語法 | 先核對已有能力與可用選中內容；將現有filter與支持的appearance控件歸位，不新增Core功能 | 同內容多layer正常/選中/鎖定；top/footer 截圖與幾何；原操作可用 |
| UIR-02 | Preferences 缺 PS-3 右側動作區；一般頁label與select分隔較遠 | 先確認現有設定即時套用/保存語意，再設計右側動作與欄位對齊；不得加無語意的OK/Cancel或虛構復原能力 | USER確認動作語意；分類內容、close/Escape/focus、保存行為 |
| UIR-03 | Edit 同時出現兩個「調整…」 | 查明兩入口命令與primary home；同命令去重、不同命令給明確名稱 | 同一穩定popup截圖；兩原能力仍可到達 |
| UIR-04 | Object 的 Transform：Distort… 混用英文 | 沿用既有繁中命名語法，校正可見名稱，不改command | popup內容及原命令路由 |
| UIR-05 | Color panel 顯示「沿用目前工具顏色；此面板不另建立獨立顏色狀態。」 | 移出正常產品面板，保留真正色彩控件及同一state authority | 面板截图與跨工具色彩同步 |

UIR-02 動作語意需 USER 決定，先列設計待決，不自行製作假控件。其餘可依本工作單由現有 Direct UI MR 執行；Supervisor 此輪只改文件，不改產品、不啟動Actions或Runtime、不建立QA harness。
既有executor工作保留；本工作單為新增有界修正，不取消未完成任務，也不表示已傳送他人。

## 待檢查，不預判缺陷
全圖示輪廓、全部flyout、hover/focus/disabled、vertical guides/lock/show-hide、panel resize/reload、多層reorder、高zoom Navigator、Preferences其餘分類及Branding。
目前window/home按鈕標示功能待定且disabled；先查能力/USER既有決策，不能僅因disabled判缺陷。
毛筆與選取能在穩定狀態切換，不能把過渡AX結果列成工具失效。

## 文件規則
舊2026-09-30清單保留作歷史baseline，當前狀態以本表及同步CSV複查欄為準；子項未重現不等於整列或整體PASS。
共享幾何target delta=0；1 CSS px不是免修容差，測量不確定性另記。歷史NEXT_ACTION、PASS、Runtime授權不作當前執行指令。
