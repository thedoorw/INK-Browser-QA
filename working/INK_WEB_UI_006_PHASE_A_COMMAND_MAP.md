# INK-WEB-UI-006 — Phase A Command / Control Inventory

STATUS: DEV_HANDOFF_CANDIDATE
TASK: `INK-WEB-UI-006 — Phase A`
BRANCH: `work/ink-web-ui-standard-001`
AUTHORITATIVE SOURCE:
- `product/source/index.html`
- `product/source/web-shell.js`
- `research/INK_IDEAL_UI_STANDARD_v0.1.md`
- `working/INK_WEB_UI_006_WORK_ORDER.md`

## Inventory lock

Static fixed controls found in current Web source: **349**
- buttons: 214
- inputs: 97
- selects: 29
- textareas: 9

Runtime shell controls created by `web-shell.js`: **14**
- Panel Dock entries: 7
- Window-menu panel entries: 7

Total fixed command/control entries mapped: **363**.

Classification totals:
- Primary Home: 180
- Contextual Shortcut: 32
- Specialist/Diagnostic: 137
- Responsive Alternative: 14

Notes:
- Runtime-generated data rows such as actual layer rows/history steps are not counted as fixed controls; their fixed actions are counted below.
- Hidden file-picker inputs are included because they are command endpoints for visible launch actions.
- Phase A changes no Core/document/history/revision semantics.

## Duplicate-resolution map

| Capability | Primary Home | Other entry classification | Phase A resolution |
|---|---|---|---|
| New / Open / Save / Export | File menu | Current top buttons = Contextual Shortcut | Keep behavior unchanged now; Phase C may remove/reduce permanent top copies. |
| Creation / Layout | Workspace menu | Top workspace switch = Contextual Shortcut; Ctrl+1 / Ctrl+2 = Keyboard Shortcut; mobile controls = Responsive Alternative | One workspace authority; no semantic change in Phase A/B. |
| Color / Size / Opacity | Properties / tool property controls | Canvas/contextual copies = Contextual Shortcut; mobile copies = Responsive Alternative | Contextual values remain immediate shortcuts only. |
| Duplicate / Group / Front / Delete | Object / selection controls in Properties | Selection bar = Contextual Shortcut; mobile equivalents = Responsive Alternative | No equal-status duplicate authority. |
| Inspector / panel open-close | Panel Dock / right-edge collapse control | Legacy top Inspector toggle and close/size affordances = Contextual Shortcut; Window menu = Contextual Shortcut | Structural cleanup deferred to Phase E/F; current behavior retained. |
| Zoom / Fit / Rotation | Status / view bar + View command family | Workspace-menu fit/reset entries = Contextual Shortcut; keyboard/gesture = Keyboard Shortcut | Status/View remains authoritative surface. |

## Keyboard shortcut registry

| Command | Shortcut | Classification |
|---|---|---|
| Creation space | Ctrl+1 | Keyboard Shortcut |
| Layout space | Ctrl+2 | Keyboard Shortcut |
| Undo | Ctrl+Z | Keyboard Shortcut |
| Redo | Ctrl+Shift+Z | Keyboard Shortcut |
| Fullscreen | Ctrl+Shift+F | Keyboard Shortcut |
| Pages | P | Keyboard Shortcut |
| Draw tool family | W | Keyboard Shortcut |
| Pen / Pencil / Marker / Brush / Airbrush | B / N / M / I / A | Keyboard Shortcut |
| Eraser | E | Keyboard Shortcut |
| Select | V | Keyboard Shortcut |
| Lasso | L | Keyboard Shortcut |
| Shape | S | Keyboard Shortcut |
| Text | T | Keyboard Shortcut |
| Pan | H / Space | Keyboard Shortcut |
| Fit content | F | Keyboard Shortcut |

## Full fixed-control map

| # | Surface | Locator | Capability / visible label | Classification |
|---:|---|---|---|---|
| 1 | Application menu | `button:nth(1)` | 檔案 | Primary Home |
| 2 | Application menu | `button:nth(2)` | 編輯 | Primary Home |
| 3 | Application menu | `button:nth(3)` | 檢視 | Primary Home |
| 4 | Application menu | `button:nth(4)` | 選取 | Primary Home |
| 5 | Application menu | `button:nth(5)` | 物件 | Primary Home |
| 6 | Application menu | `button:nth(6)` | 圖層 | Primary Home |
| 7 | Application menu | `button:nth(7)` | 筆刷 | Primary Home |
| 8 | Application menu | `button:nth(8)` | 視窗 | Primary Home |
| 9 | Application menu | `button:nth(9)` | 說明 | Primary Home |
| 10 | App shell / hidden input | `#workspaceMenuToggle` | 工作區清單 | Primary Home |
| 11 | Workspace menu | `button[data-workspace-command="creation"]` | 創作空間 Ctrl+1 | Primary Home |
| 12 | Workspace menu | `button[data-workspace-command="layout"]` | 版面空間 Ctrl+2 | Primary Home |
| 13 | Workspace menu | `button[data-workspace-command="fit-current"]` | 符合目前空間 | Contextual Shortcut |
| 14 | Workspace menu | `button[data-workspace-command="reset-current"]` | 重設目前視圖 | Contextual Shortcut |
| 15 | Workspace menu | `button[data-workspace-command="fit-viewport"]` | 將內容符合 A4 視埠 | Contextual Shortcut |
| 16 | Top / contextual bar | `#pagesToggle` | 頁面 | Primary Home |
| 17 | Top / contextual bar | `#docTitle` | 作品名稱 | Primary Home |
| 18 | Top / contextual bar | `#contextualAdvancedBtn` | 進階 | Contextual Shortcut |
| 19 | Top / contextual bar | `button[data-space="creation"]` | 創作空間 Ctrl+1 | Contextual Shortcut |
| 20 | Top / contextual bar | `button[data-space="layout"]` | 版面空間 Ctrl+2 | Contextual Shortcut |
| 21 | Top / contextual bar | `#undoBtn` | 復原 Ctrl+Z | Contextual Shortcut |
| 22 | Top / contextual bar | `#redoBtn` | 重做 Ctrl+Shift+Z | Contextual Shortcut |
| 23 | Top / contextual bar | `#newBtn` | 新增 | Contextual Shortcut |
| 24 | Top / contextual bar | `#openBtn` | 開啟 | Contextual Shortcut |
| 25 | Top / contextual bar | `#saveBtn` | 儲存 | Contextual Shortcut |
| 26 | Top / contextual bar | `#exportBtn` | 匯出 | Contextual Shortcut |
| 27 | Top / contextual bar | `#fullscreenToggle` | 進入全螢幕 | Contextual Shortcut |
| 28 | Top / contextual bar | `#inspectorToggle` | 開啟檢查器 | Contextual Shortcut |
| 29 | Top / contextual bar | `#settingsToggle` | 畫布設定 | Primary Home |
| 30 | Pages panel | `#addPageBtn` | 新增頁面 | Primary Home |
| 31 | Pages panel | `#closePagesBtn` | 關閉 | Primary Home |
| 32 | Left toolbar | `#drawToolButton` | 繪圖工具；再按一次或長按可切換筆種（W） | Primary Home |
| 33 | Left toolbar | `button[data-tool="eraser"]` | 橡皮擦（E） | Primary Home |
| 34 | Left toolbar | `button[data-tool="select"]` | 選取（V） | Primary Home |
| 35 | Left toolbar | `button[data-tool="lasso"]` | 套索（L） | Primary Home |
| 36 | Left toolbar | `button[data-tool="shape"]` | 幾何（S） | Primary Home |
| 37 | Left toolbar | `button[data-tool="text"]` | 文字（T） | Primary Home |
| 38 | Left toolbar | `button[data-tool="image"]` | 圖片 | Primary Home |
| 39 | Left toolbar | `button[data-tool="pan"]` | 移動畫布（H／空白鍵） | Primary Home |
| 40 | Draw-family flyout | `button.subtool-button.active:nth(39)` | 鋼筆 B | Primary Home |
| 41 | Draw-family flyout | `button.subtool-button:nth(40)` | 鉛筆 N | Primary Home |
| 42 | Draw-family flyout | `button.subtool-button:nth(41)` | 麥克筆 M | Primary Home |
| 43 | Draw-family flyout | `button.subtool-button:nth(42)` | 毛筆 I | Primary Home |
| 44 | Draw-family flyout | `button.subtool-button:nth(43)` | 噴筆 A | Primary Home |
| 45 | Canvas quick controls | `#quickColor` | 目前顏色 | Contextual Shortcut |
| 46 | Canvas quick controls | `#quickColorInput` | 選擇目前顏色 | Contextual Shortcut |
| 47 | Canvas quick controls | `#quickSizeInput` | 4 | Contextual Shortcut |
| 48 | Canvas quick controls | `#quickOpacityInput` | 100 | Contextual Shortcut |
| 49 | Selection contextual bar | `button:nth(45)` | 複製 | Contextual Shortcut |
| 50 | Selection contextual bar | `button:nth(46)` | 群組 | Contextual Shortcut |
| 51 | Selection contextual bar | `button:nth(47)` | 移至最上 | Contextual Shortcut |
| 52 | Selection contextual bar | `button:nth(48)` | 水平置中 | Contextual Shortcut |
| 53 | Selection contextual bar | `button.danger:nth(49)` | 刪除 | Contextual Shortcut |
| 54 | Inline text editor | `#textInput` | textInput | Primary Home |
| 55 | Inline text editor | `#textCancel` | 取消 | Primary Home |
| 56 | Inline text editor | `#textCommit` | 完成 | Primary Home |
| 57 | App shell / hidden input | `#inspectorEdgeToggle` | 展開右側面板 | Primary Home |
| 58 | Properties / Inspector | `#inspectorSizeToggle` | 切換檢查器寬度 | Contextual Shortcut |
| 59 | Properties / Inspector | `#closeInspector` | 關閉檢查器 | Contextual Shortcut |
| 60 | Properties / Inspector | `button.inspector-tab.active:nth(55)` | 工具 | Primary Home |
| 61 | Properties / Inspector | `button.inspector-tab:nth(56)` | 物件 | Primary Home |
| 62 | Properties / Inspector | `button.inspector-tab:nth(57)` | AI | Primary Home |
| 63 | Properties / Inspector | `button.inspector-tab:nth(58)` | 核心 | Primary Home |
| 64 | Properties / Inspector | `#colorInput` | #202020 | Primary Home |
| 65 | Properties / Inspector | `#hexInput` | #202020 | Primary Home |
| 66 | Properties / Inspector | `#sizeInput` | 4 | Primary Home |
| 67 | Properties / Inspector | `#opacityInput` | 100 | Primary Home |
| 68 | Properties / Inspector | `#smoothingInput` | 52 | Primary Home |
| 69 | Properties / Inspector | `#pressureInput` | 82 | Primary Home |
| 70 | Properties / Inspector | `#brushFlowInput` | 78 | Primary Home |
| 71 | Properties / Inspector | `#brushWetnessInput` | 34 | Primary Home |
| 72 | Properties / Inspector | `#brushBristleInput` | 30 | Primary Home |
| 73 | Properties / Inspector | `#renderEngineMode` | 自然媒材渲染引擎 | Primary Home |
| 74 | Properties / Inspector | `#runGPUValidationBtn` | 執行 GPU 自我檢查 | Primary Home |
| 75 | Properties / Inspector | `button.active:nth(60)` | 局部 | Primary Home |
| 76 | Properties / Inspector | `button:nth(61)` | 物件 | Primary Home |
| 77 | Properties / Inspector | `button.active:nth(62)` | 線 | Primary Home |
| 78 | Properties / Inspector | `button:nth(63)` | 箭頭 | Primary Home |
| 79 | Properties / Inspector | `button:nth(64)` | 矩形 | Primary Home |
| 80 | Properties / Inspector | `button:nth(65)` | 橢圓 | Primary Home |
| 81 | Properties / Inspector | `button:nth(66)` | 三角 | Primary Home |
| 82 | Properties / Inspector | `#shapeFill` | shapeFill | Primary Home |
| 83 | Properties / Inspector | `#fontFamily` | fontFamily | Primary Home |
| 84 | Properties / Inspector | `#fontSize` | 32 | Primary Home |
| 85 | Layers panel | `#layerOpacity` | 100 | Primary Home |
| 86 | Layers panel | `#addLayerBtn` | 新增圖層 | Primary Home |
| 87 | Layers panel | `#duplicateLayerBtn` | 複製圖層 | Primary Home |
| 88 | Layers panel | `#deleteLayerBtn` | 刪除圖層 | Primary Home |
| 89 | History panel | `#historyLimit` | 歷史記錄保留步數 | Primary Home |
| 90 | Properties / Inspector | `#duplicateSelectionBtn` | 複製 | Primary Home |
| 91 | Properties / Inspector | `#groupSelectionBtn` | 群組 | Primary Home |
| 92 | Properties / Inspector | `#ungroupSelectionBtn` | 解散 | Primary Home |
| 93 | Properties / Inspector | `#frontSelectionBtn` | 移至最上 | Primary Home |
| 94 | Properties / Inspector | `#backSelectionBtn` | 移至最下 | Primary Home |
| 95 | Properties / Inspector | `#deleteSelectionBtn` | 刪除 | Primary Home |
| 96 | Properties / Inspector | `#enterStrokeEditBtn` | 編輯筆畫 | Primary Home |
| 97 | Properties / Inspector | `#exitStrokeEditBtn` | 完成編輯 | Primary Home |
| 98 | Properties / Inspector | `#selectAllStrokeNodesBtn` | 全選節點 | Primary Home |
| 99 | Properties / Inspector | `#simplifyStrokeBtn` | 簡化節點 | Primary Home |
| 100 | Properties / Inspector | `#insertStrokeNodeBtn` | 插入節點 | Primary Home |
| 101 | Properties / Inspector | `#splitStrokeSegmentBtn` | 切割區段 | Primary Home |
| 102 | Properties / Inspector | `#nodeCornerBtn` | 角點 | Primary Home |
| 103 | Properties / Inspector | `#nodeSmoothBtn` | 平滑 | Primary Home |
| 104 | Properties / Inspector | `#nodeSymmetricBtn` | 對稱 | Primary Home |
| 105 | Properties / Inspector | `#deleteStrokeNodesBtn` | 刪除節點 | Primary Home |
| 106 | Properties / Inspector | `#segmentColor` | #202020 | Primary Home |
| 107 | Properties / Inspector | `#segmentSize` | 8 | Primary Home |
| 108 | Properties / Inspector | `#resetSegmentStyleBtn` | 恢復整筆樣式 | Primary Home |
| 109 | Properties / Inspector | `#enterPathEditBtn` | 編輯 Path | Primary Home |
| 110 | Properties / Inspector | `#exitPathEditBtn` | 完成編輯 | Primary Home |
| 111 | Properties / Inspector | `#selectAllPathAnchorsBtn` | 全選節點 | Primary Home |
| 112 | Properties / Inspector | `#simplifyPathBtn` | 簡化 | Primary Home |
| 113 | Properties / Inspector | `#insertPathAnchorBtn` | 插入節點 | Primary Home |
| 114 | Properties / Inspector | `#refinePathBtn` | Refine | Primary Home |
| 115 | Properties / Inspector | `#pathCornerBtn` | 角點 | Primary Home |
| 116 | Properties / Inspector | `#pathSmoothBtn` | 平滑 | Primary Home |
| 117 | Properties / Inspector | `#pathSymmetricBtn` | 對稱 | Primary Home |
| 118 | Properties / Inspector | `#togglePathClosedBtn` | 閉合路徑 | Primary Home |
| 119 | Properties / Inspector | `#deletePathAnchorsBtn` | 刪除節點 | Primary Home |
| 120 | Properties / Inspector | `#pathStrokePreset` | pathStrokePreset | Primary Home |
| 121 | Properties / Inspector | `#pathStrokeColor` | #202020 | Primary Home |
| 122 | Properties / Inspector | `#pathStrokeWidth` | 6 | Primary Home |
| 123 | Properties / Inspector | `#pathStrokeTaperStart` | 0 | Primary Home |
| 124 | Properties / Inspector | `#pathStrokeTaperEnd` | 0 | Primary Home |
| 125 | Properties / Inspector | `#applyPathStrokeBtn` | 套用／更新 | Primary Home |
| 126 | Properties / Inspector | `#removePathStrokeBtn` | 移除表現 | Primary Home |
| 127 | Properties / Inspector | `#aspectLockBtn` | 鎖定比例 | Primary Home |
| 128 | Properties / Inspector | `#transformX` | transformX | Primary Home |
| 129 | Properties / Inspector | `#transformY` | transformY | Primary Home |
| 130 | Properties / Inspector | `#transformW` | transformW | Primary Home |
| 131 | Properties / Inspector | `#transformH` | transformH | Primary Home |
| 132 | Properties / Inspector | `#transformR` | transformR | Primary Home |
| 133 | Properties / Inspector | `button:nth(101)` | 靠左 | Primary Home |
| 134 | Properties / Inspector | `button:nth(102)` | 水平置中 | Primary Home |
| 135 | Properties / Inspector | `button:nth(103)` | 靠右 | Primary Home |
| 136 | Properties / Inspector | `button:nth(104)` | 靠上 | Primary Home |
| 137 | Properties / Inspector | `button:nth(105)` | 垂直置中 | Primary Home |
| 138 | Properties / Inspector | `button:nth(106)` | 靠下 | Primary Home |
| 139 | Properties / Inspector | `button:nth(107)` | 水平等距 | Primary Home |
| 140 | Properties / Inspector | `button:nth(108)` | 垂直等距 | Primary Home |
| 141 | Properties / Inspector | `#objectOpacity` | 100 | Primary Home |
| 142 | AI specialist panel | `#aiStartupMode` | aiStartupMode | Specialist/Diagnostic |
| 143 | AI specialist panel | `#aiProvider` | aiProvider | Specialist/Diagnostic |
| 144 | AI specialist panel | `#aiEndpoint` | aiEndpoint | Specialist/Diagnostic |
| 145 | AI specialist panel | `#aiModel` | aiModel | Specialist/Diagnostic |
| 146 | AI specialist panel | `#aiApiVersion` | aiApiVersion | Specialist/Diagnostic |
| 147 | AI specialist panel | `#aiAuthMethod` | aiAuthMethod | Specialist/Diagnostic |
| 148 | AI specialist panel | `#aiCredentialAlias` | session-model | Specialist/Diagnostic |
| 149 | AI specialist panel | `#aiCredential` | aiCredential | Specialist/Diagnostic |
| 150 | AI specialist panel | `#aiTimeout` | 30000 | Specialist/Diagnostic |
| 151 | AI specialist panel | `#aiRetry` | 1 | Specialist/Diagnostic |
| 152 | AI specialist panel | `#aiMaxContext` | 16000 | Specialist/Diagnostic |
| 153 | AI specialist panel | `#aiStreaming` | aiStreaming | Specialist/Diagnostic |
| 154 | AI specialist panel | `#aiDataPolicy` | aiDataPolicy | Specialist/Diagnostic |
| 155 | AI specialist panel | `#aiImagePolicy` | aiImagePolicy | Specialist/Diagnostic |
| 156 | AI specialist panel | `#aiLoggingPolicy` | aiLoggingPolicy | Specialist/Diagnostic |
| 157 | AI specialist panel | `#aiLocalOnly` | aiLocalOnly | Specialist/Diagnostic |
| 158 | AI specialist panel | `#aiSaveCredential` | 暫存本次憑證 | Specialist/Diagnostic |
| 159 | AI specialist panel | `#aiConnect` | 套用連線設定 | Specialist/Diagnostic |
| 160 | AI specialist panel | `#aiDisconnect` | 中斷並清除憑證 | Specialist/Diagnostic |
| 161 | AI specialist panel | `#aiPrompt` | aiPrompt | Specialist/Diagnostic |
| 162 | AI specialist panel | `#aiGeneratePlan` | 建立可編輯 Plan | Specialist/Diagnostic |
| 163 | AI specialist panel | `#aiImagePick` | 圖片 → Plan | Specialist/Diagnostic |
| 164 | AI specialist panel | `#aiDocumentPlan` | 文件 → Plan | Specialist/Diagnostic |
| 165 | AI specialist panel | `#aiInspectBtn` | 讀取文件 | Specialist/Diagnostic |
| 166 | AI specialist panel | `#aiCapabilitiesBtn` | 能力清單 | Specialist/Diagnostic |
| 167 | AI specialist panel | `#aiAuditBtn` | 稽核紀錄 | Specialist/Diagnostic |
| 168 | AI specialist panel | `#aiImageInput` | aiImageInput | Specialist/Diagnostic |
| 169 | AI specialist panel | `#aiCommandJSON` | aiCommandJSON | Specialist/Diagnostic |
| 170 | AI specialist panel | `#aiRunJSON` | 執行 JSON Command | Specialist/Diagnostic |
| 171 | AI specialist panel | `#aiPlanSeed` | 1500 | Specialist/Diagnostic |
| 172 | AI specialist panel | `#aiPreviewQuality` | aiPreviewQuality | Specialist/Diagnostic |
| 173 | AI specialist panel | `#aiPreviewBtn` | Preview | Specialist/Diagnostic |
| 174 | AI specialist panel | `#aiApproveBtn` | 核准所選步驟 | Specialist/Diagnostic |
| 175 | AI specialist panel | `#aiRejectBtn` | 拒絕 | Specialist/Diagnostic |
| 176 | AI specialist panel | `#aiCancelBtn` | 取消執行 | Specialist/Diagnostic |
| 177 | AI specialist panel | `button:nth(123)` | Before／After | Specialist/Diagnostic |
| 178 | AI specialist panel | `button:nth(124)` | Split | Specialist/Diagnostic |
| 179 | AI specialist panel | `button:nth(125)` | Overlay | Specialist/Diagnostic |
| 180 | AI specialist panel | `button:nth(126)` | Difference | Specialist/Diagnostic |
| 181 | AI specialist panel | `#aiPreviewSlider` | Before and after split position | Specialist/Diagnostic |
| 182 | AI specialist panel | `#aiRollbackBtn` | Rollback | Specialist/Diagnostic |
| 183 | Properties / Inspector | `button:nth(128)` | 取消 | Primary Home |
| 184 | Properties / Inspector | `#aiTransmissionApprove` | 核准本次傳輸 | Specialist/Diagnostic |
| 185 | Core / production specialist panel | `#programSafetyMode` | programSafetyMode | Specialist/Diagnostic |
| 186 | Core / production specialist panel | `#programLicense` | programLicense | Specialist/Diagnostic |
| 187 | Core / production specialist panel | `#programSourceUrl` | programSourceUrl | Specialist/Diagnostic |
| 188 | Core / production specialist panel | `#programAssetPick` | 匯入外部資產 | Specialist/Diagnostic |
| 189 | Core / production specialist panel | `#programTranslate` | 編譯 Recipe | Specialist/Diagnostic |
| 190 | Core / production specialist panel | `#programTrialRun` | 試跑 | Specialist/Diagnostic |
| 191 | Core / production specialist panel | `#programStepRun` | 單步執行 | Specialist/Diagnostic |
| 192 | Core / production specialist panel | `#programBreakpoint` | Breakpoint | Specialist/Diagnostic |
| 193 | Core / production specialist panel | `#programBeforeAfter` | Before／After | Specialist/Diagnostic |
| 194 | Core / production specialist panel | `#programAttachDocument` | 保存於 .ink | Specialist/Diagnostic |
| 195 | Core / production specialist panel | `#programSaveRecipe` | 保存 Recipe | Specialist/Diagnostic |
| 196 | Core / production specialist panel | `#programSaveReport` | 保存報告 | Specialist/Diagnostic |
| 197 | Core / production specialist panel | `#referenceRunner` | referenceRunner | Specialist/Diagnostic |
| 198 | Core / production specialist panel | `#referenceManualKit` | 建立人工基準包 | Specialist/Diagnostic |
| 199 | Core / production specialist panel | `#referenceEvidencePick` | 匯入原軟體證據 | Specialist/Diagnostic |
| 200 | Core / production specialist panel | `#referenceAttach` | 保存 Reference Package | Specialist/Diagnostic |
| 201 | Core / production specialist panel | `#referenceSave` | 匯出 Reference Package | Specialist/Diagnostic |
| 202 | Core / production specialist panel | `#programOriginalSteps` | programOriginalSteps | Specialist/Diagnostic |
| 203 | Core / production specialist panel | `#programCanonicalSteps` | programCanonicalSteps | Specialist/Diagnostic |
| 204 | Core / production specialist panel | `#programRecipePreview` | programRecipePreview | Specialist/Diagnostic |
| 205 | Core / production specialist panel | `#programIssuesPreview` | programIssuesPreview | Specialist/Diagnostic |
| 206 | Core / production specialist panel | `#studioSkeleton` | studioSkeleton | Specialist/Diagnostic |
| 207 | Core / production specialist panel | `#studioLoadSkeleton` | 載入結構 | Specialist/Diagnostic |
| 208 | Core / production specialist panel | `#recipeLoadFile` | 載入 Recipe JSON | Specialist/Diagnostic |
| 209 | Core / production specialist panel | `#svgImportFile` | 匯入 SVG Path | Specialist/Diagnostic |
| 210 | Core / production specialist panel | `#recipeFill` | #cf6e82 | Specialist/Diagnostic |
| 211 | Core / production specialist panel | `#recipeTexture` | 14 | Specialist/Diagnostic |
| 212 | Core / production specialist panel | `#recipeContrast` | 8 | Specialist/Diagnostic |
| 213 | Core / production specialist panel | `#studioRunRecipe` | 執行全部 | Specialist/Diagnostic |
| 214 | Core / production specialist panel | `#studioReplayStep` | 局部重播 | Specialist/Diagnostic |
| 215 | Core / production specialist panel | `#studioRollback` | 回滾 | Specialist/Diagnostic |
| 216 | Core / production specialist panel | `#studioQA` | 執行 QA | Specialist/Diagnostic |
| 217 | Core / production specialist panel | `#pathEditToggle` | Path／Node 編輯 | Specialist/Diagnostic |
| 218 | Core / production specialist panel | `#pathNodeX` | 0 | Specialist/Diagnostic |
| 219 | Core / production specialist panel | `#pathNodeY` | 0 | Specialist/Diagnostic |
| 220 | Core / production specialist panel | `#pathNodeApply` | 更新所選 Node | Specialist/Diagnostic |
| 221 | Core / production specialist panel | `#booleanUnion` | Union | Specialist/Diagnostic |
| 222 | Core / production specialist panel | `#booleanDifference` | Difference | Specialist/Diagnostic |
| 223 | Core / production specialist panel | `#booleanIntersection` | Intersection | Specialist/Diagnostic |
| 224 | Core / production specialist panel | `#booleanXor` | XOR | Specialist/Diagnostic |
| 225 | Core / production specialist panel | `#booleanDivide` | Divide | Specialist/Diagnostic |
| 226 | Core / production specialist panel | `#repeatCount` | 8 | Specialist/Diagnostic |
| 227 | Core / production specialist panel | `#repeatRadial` | Radial | Specialist/Diagnostic |
| 228 | Core / production specialist panel | `#repeatMirror` | Mirror | Specialist/Diagnostic |
| 229 | Core / production specialist panel | `#repeatGrid` | Grid | Specialist/Diagnostic |
| 230 | Core / production specialist panel | `#repeatExpand` | 展開 Path | Specialist/Diagnostic |
| 231 | Core / production specialist panel | `#maskInvert` | maskInvert | Specialist/Diagnostic |
| 232 | Core / production specialist panel | `#maskFeather` | 0 | Specialist/Diagnostic |
| 233 | Core / production specialist panel | `#maskExpand` | 0 | Specialist/Diagnostic |
| 234 | Core / production specialist panel | `#maskAdd` | 建立 Mask | Specialist/Diagnostic |
| 235 | Core / production specialist panel | `#adjustmentType` | adjustmentType | Specialist/Diagnostic |
| 236 | Core / production specialist panel | `#adjustmentAmount` | 12 | Specialist/Diagnostic |
| 237 | Core / production specialist panel | `#adjustmentAdd` | 加入 Adjustment | Specialist/Diagnostic |
| 238 | Core / production specialist panel | `#filterType` | filterType | Specialist/Diagnostic |
| 239 | Core / production specialist panel | `#filterAmount` | 2 | Specialist/Diagnostic |
| 240 | Core / production specialist panel | `#filterAdd` | 加入 Filter | Specialist/Diagnostic |
| 241 | Core / production specialist panel | `#filterMoveUp` | 上移 Filter | Specialist/Diagnostic |
| 242 | Core / production specialist panel | `#paintBrush` | paintBrush | Specialist/Diagnostic |
| 243 | Core / production specialist panel | `#strokeRecordStart` | 開始錄製 | Specialist/Diagnostic |
| 244 | Core / production specialist panel | `#strokeRecordPause` | 暫停／繼續 | Specialist/Diagnostic |
| 245 | Core / production specialist panel | `#strokeRecordFinish` | 結束保存 | Specialist/Diagnostic |
| 246 | Core / production specialist panel | `#drawingWorkflowPick` | 匯入手繪流程 | Specialist/Diagnostic |
| 247 | Core / production specialist panel | `#paintSessionCreate` | 建立完整筆畫 | Specialist/Diagnostic |
| 248 | Core / production specialist panel | `#paintReplay` | 替換並重播 | Specialist/Diagnostic |
| 249 | Core / production specialist panel | `#strokeSessionExport` | 匯出 Session | Specialist/Diagnostic |
| 250 | Core / production specialist panel | `#brushPackageExport` | 匯出 Brush Package | Specialist/Diagnostic |
| 251 | Core / production specialist panel | `#drawingWorkflowPreview` | drawingWorkflowPreview | Specialist/Diagnostic |
| 252 | Core / production specialist panel | `#stylusTestPattern` | stylusTestPattern | Specialist/Diagnostic |
| 253 | Core / production specialist panel | `#deviceName` | HP x360 + MPP Stylus | Specialist/Diagnostic |
| 254 | Core / production specialist panel | `#calibrationProfileSelect` | calibrationProfileSelect | Specialist/Diagnostic |
| 255 | Core / production specialist panel | `#stylusTestStart` | 開始量測 | Specialist/Diagnostic |
| 256 | Core / production specialist panel | `#stylusTestFinish` | 儲存 Device Report | Specialist/Diagnostic |
| 257 | Core / production specialist panel | `#calibrationProfileSave` | 保存校準 | Specialist/Diagnostic |
| 258 | Core / production specialist panel | `#calibrationProfileExport` | 匯出 Profile | Specialist/Diagnostic |
| 259 | Core / production specialist panel | `#calibrationProfileImport` | 匯入 Profile | Specialist/Diagnostic |
| 260 | Core / production specialist panel | `#calibrationProfileReset` | 恢復預設 | Specialist/Diagnostic |
| 261 | Core / production specialist panel | `#interactiveBenchmarkRun` | 執行 1K／10K／100K 實際渲染 | Specialist/Diagnostic |
| 262 | Core / production specialist panel | `#artworkQaBenchmark` | artworkQaBenchmark | Specialist/Diagnostic |
| 263 | Core / production specialist panel | `#artworkQaScore` | artworkQaScore | Specialist/Diagnostic |
| 264 | Core / production specialist panel | `#artworkQaNotes` | artworkQaNotes | Specialist/Diagnostic |
| 265 | Core / production specialist panel | `#artworkQaExport` | 匯出未核准人工驗收表 | Specialist/Diagnostic |
| 266 | Core / production specialist panel | `#layerManifestExport` | 匯出分層 Manifest | Specialist/Diagnostic |
| 267 | Mobile dock | `button[data-tool="pen"]` | 鋼筆 | Responsive Alternative |
| 268 | Mobile dock | `button[data-tool="brush"]` | 毛筆 | Responsive Alternative |
| 269 | Mobile dock | `button[data-tool="eraser"]` | 橡皮 | Responsive Alternative |
| 270 | Mobile dock | `button[data-tool="select"]` | 選取 | Responsive Alternative |
| 271 | Mobile dock | `#mobileToolsToggle` | 更多 | Responsive Alternative |
| 272 | Mobile tool sheet | `#closeMobileTools` | closeMobileTools | Responsive Alternative |
| 273 | Mobile tool sheet | `button[data-tool="pencil"]` | 鉛筆 | Responsive Alternative |
| 274 | Mobile tool sheet | `button[data-tool="marker"]` | 麥克筆 | Responsive Alternative |
| 275 | Mobile tool sheet | `button[data-tool="airbrush"]` | 噴筆 | Responsive Alternative |
| 276 | Mobile tool sheet | `button[data-tool="lasso"]` | 套索 | Responsive Alternative |
| 277 | Mobile tool sheet | `button[data-tool="shape"]` | 幾何 | Responsive Alternative |
| 278 | Mobile tool sheet | `button[data-tool="text"]` | 文字 | Responsive Alternative |
| 279 | Mobile tool sheet | `button[data-tool="image"]` | 圖片 | Responsive Alternative |
| 280 | Mobile tool sheet | `button[data-tool="pan"]` | 移動畫布 | Responsive Alternative |
| 281 | Canvas settings | `#closeSettings` | 關閉畫布設定 | Primary Home |
| 282 | Canvas settings | `#artboardPreset` | artboardPreset | Primary Home |
| 283 | Canvas settings | `#artboardOrientation` | artboardOrientation | Primary Home |
| 284 | Canvas settings | `#artboardPpi` | artboardPpi | Primary Home |
| 285 | Canvas settings | `#artboardBleed` | 0 | Primary Home |
| 286 | Canvas settings | `#artboardSafeMargin` | 10 | Primary Home |
| 287 | Canvas settings | `#artboardUnit` | artboardUnit | Primary Home |
| 288 | Canvas settings | `#showBleed` | showBleed | Primary Home |
| 289 | Canvas settings | `#showSafeArea` | showSafeArea | Primary Home |
| 290 | Canvas settings | `#showCenterGuides` | showCenterGuides | Primary Home |
| 291 | Canvas settings | `#clipArtboardContent` | clipArtboardContent | Primary Home |
| 292 | Canvas settings | `#layoutViewportScale` | 100 | Primary Home |
| 293 | Canvas settings | `#layoutViewportX` | 0 | Primary Home |
| 294 | Canvas settings | `#layoutViewportY` | 0 | Primary Home |
| 295 | Canvas settings | `#layoutViewportRotation` | 0 | Primary Home |
| 296 | Canvas settings | `#fitViewportContentBtn` | 將全部內容符合 A4 視埠 | Primary Home |
| 297 | Canvas settings | `#resetViewportBtn` | 視埠 1:1 置中 | Primary Home |
| 298 | Canvas settings | `#fitArtboardBtn` | 切換至版面並符合畫板 | Primary Home |
| 299 | Canvas settings | `#paperType` | paperType | Primary Home |
| 300 | Canvas settings | `#paperColor` | #fffef9 | Primary Home |
| 301 | Canvas settings | `#gridSize` | 32 | Primary Home |
| 302 | Canvas settings | `#paperAbsorbency` | 58 | Primary Home |
| 303 | Canvas settings | `#paperRoughness` | 42 | Primary Home |
| 304 | Canvas settings | `#paperFiberStrength` | 36 | Primary Home |
| 305 | Canvas settings | `#paperFiberAngle` | 0 | Primary Home |
| 306 | Canvas settings | `#paperSizing` | 28 | Primary Home |
| 307 | Canvas settings | `#paperGranulation` | 32 | Primary Home |
| 308 | Canvas settings | `#paperTextureVisible` | paperTextureVisible | Primary Home |
| 309 | Canvas settings | `#snapToggle` | snapToggle | Primary Home |
| 310 | Canvas settings | `#smartGuidesToggle` | smartGuidesToggle | Primary Home |
| 311 | Canvas settings | `#gridSnapToggle` | gridSnapToggle | Primary Home |
| 312 | Canvas settings | `#fingerDrawToggle` | fingerDrawToggle | Primary Home |
| 313 | Canvas settings | `#penPressureMin` | 2 | Primary Home |
| 314 | Canvas settings | `#penPressureMax` | 100 | Primary Home |
| 315 | Canvas settings | `#penPressureGamma` | 100 | Primary Home |
| 316 | Canvas settings | `#penPressureSmoothing` | 16 | Primary Home |
| 317 | Canvas settings | `#penTiltSensitivity` | 100 | Primary Home |
| 318 | Canvas settings | `#penUsePredicted` | penUsePredicted | Primary Home |
| 319 | Canvas settings | `#penPalmRejection` | penPalmRejection | Primary Home |
| 320 | Canvas settings | `#penCalibrationCheckBtn` | 檢查輸入 | Specialist/Diagnostic |
| 321 | Canvas settings | `#penCalibrationResetBtn` | 重設 | Specialist/Diagnostic |
| 322 | Canvas settings | `#resetViewBtn` | 重設視圖 | Primary Home |
| 323 | Canvas settings | `#storageHealthBtn` | 檢查儲存與離線狀態 | Specialist/Diagnostic |
| 324 | Canvas settings | `#releaseHealthBtn` | 執行發布健康檢查 | Specialist/Diagnostic |
| 325 | Canvas settings | `#downloadDiagnosticsBtn` | 下載外部測試診斷包 | Specialist/Diagnostic |
| 326 | Canvas settings | `#checkUpdateBtn` | 檢查更新 | Specialist/Diagnostic |
| 327 | Canvas settings | `#activateUpdateBtn` | 啟用更新 | Specialist/Diagnostic |
| 328 | Export dialog | `#closeExport` | closeExport | Primary Home |
| 329 | Export dialog | `#exportFormat` | exportFormat | Primary Home |
| 330 | Export dialog | `#exportScope` | exportScope | Primary Home |
| 331 | Export dialog | `#exportScale` | exportScale | Primary Home |
| 332 | Export dialog | `#exportPpi` | exportPpi | Primary Home |
| 333 | Export dialog | `#exportBleed` | exportBleed | Primary Home |
| 334 | Export dialog | `#exportCropMarks` | exportCropMarks | Primary Home |
| 335 | Export dialog | `#exportBackground` | exportBackground | Primary Home |
| 336 | Export dialog | `#runExportBtn` | 建立檔案 | Primary Home |
| 337 | Export dialog | `#cancelExportBtn` | 取消匯出 | Primary Home |
| 338 | Status / view bar | `#rotateResetBtn` | 重設旋轉 | Primary Home |
| 339 | Status / view bar | `#fitBtn` | 符合內容（F） | Primary Home |
| 340 | Status / view bar | `#zoomOutBtn` | − | Primary Home |
| 341 | Status / view bar | `#zoomInBtn` | ＋ | Primary Home |
| 342 | App shell / hidden input | `#projectInput` | projectInput | Primary Home |
| 343 | App shell / hidden input | `#imageInput` | imageInput | Primary Home |
| 344 | App shell / hidden input | `#svgStudioInput` | svgStudioInput | Specialist/Diagnostic |
| 345 | App shell / hidden input | `#recipeStudioInput` | recipeStudioInput | Specialist/Diagnostic |
| 346 | App shell / hidden input | `#programAssetInput` | programAssetInput | Specialist/Diagnostic |
| 347 | App shell / hidden input | `#drawingWorkflowInput` | drawingWorkflowInput | Specialist/Diagnostic |
| 348 | App shell / hidden input | `#calibrationProfileInput` | calibrationProfileInput | Specialist/Diagnostic |
| 349 | App shell / hidden input | `#referenceEvidenceInput` | referenceEvidenceInput | Specialist/Diagnostic |
| 350 | Editor dock | `[data-shell-panel="properties"]` (Dock) | 屬性 | Primary Home |
| 351 | Window menu | `[data-shell-panel="properties"]` (Window) | 屬性 | Contextual Shortcut |
| 352 | Editor dock | `[data-shell-panel="layers"]` (Dock) | 圖層 | Primary Home |
| 353 | Window menu | `[data-shell-panel="layers"]` (Window) | 圖層 | Contextual Shortcut |
| 354 | Editor dock | `[data-shell-panel="history"]` (Dock) | 歷史 | Primary Home |
| 355 | Window menu | `[data-shell-panel="history"]` (Window) | 歷史 | Contextual Shortcut |
| 356 | Creative Loop dock | `[data-shell-panel="reference"]` (Dock) | Reference | Primary Home |
| 357 | Window menu | `[data-shell-panel="reference"]` (Window) | Reference | Contextual Shortcut |
| 358 | Creative Loop dock | `[data-shell-panel="compose"]` (Dock) | Compose | Primary Home |
| 359 | Window menu | `[data-shell-panel="compose"]` (Window) | Compose | Contextual Shortcut |
| 360 | Creative Loop dock | `[data-shell-panel="chat"]` (Dock) | CHAT | Primary Home |
| 361 | Window menu | `[data-shell-panel="chat"]` (Window) | CHAT | Contextual Shortcut |
| 362 | Creative Loop dock | `[data-shell-panel="revision"]` (Dock) | Revision | Primary Home |
| 363 | Window menu | `[data-shell-panel="revision"]` (Window) | Revision | Contextual Shortcut |

## Boundary result

No Phase A mapping requires a Core semantic change.

`INTEGRATION_REQUIRED`: **none for Phase A/B**.

Phase C–I remain explicitly deferred.
