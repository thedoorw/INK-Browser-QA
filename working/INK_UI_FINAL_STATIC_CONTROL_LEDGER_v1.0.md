# INK Final UI — Static Control Ledger v1.0

STATUS: `SOURCE_INVENTORY / FINAL_UI_AUDIT_AID`

SOURCE_MAIN: `b1374ecec242b8206aa3000a784c7498e0044030`

SOURCE: `product/source/shell.template.html`

Purpose: enumerate every current static button and select so the final UI rebuild cannot silently lose a control or leave an unclassified duplicate. Semantic placement authority remains `working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md`.

## A. Buttons — 212/212

| # | ID / route | Current label | Final disposition |
|---:|---|---|---|
| 1 | `fileMenuToggle` | 檔案 | Application/menu controller route |
| 2 | `new` | 新增 Ctrl+N | File MENU_PRIMARY |
| 3 | `open` | 開啟 Ctrl+O | File MENU_PRIMARY |
| 4 | `save` | 儲存 Ctrl+S | File MENU_PRIMARY |
| 5 | `export` | 匯出 | File MENU_PRIMARY |
| 6 | `windowMenuToggle` | 視窗 | Application/menu controller route |
| 7 | `workspaceMenuToggle` | ▾ | Application/menu controller route |
| 8 | `creation` | 創作空間 Ctrl+1 | View/Workspace route |
| 9 | `layout` | 版面空間 Ctrl+2 | View/Workspace route |
| 10 | `fit-current` | 符合目前空間 | View/Workspace route |
| 11 | `reset-current` | 重設目前視圖 | View/Workspace route |
| 12 | `fit-viewport` | 將內容符合 A4 視埠 | View/Workspace route |
| 13 | `pagesToggle` | 頁面（P） | SHORTCUT/RETIRE after Pages panel normalization |
| 14 | `contextualAdvancedBtn` | 進階 | SHORTCUT → Properties |
| 15 | `—` | 創作 | Application/topbar — see final menu/topbar mapping |
| 16 | `—` | 版面 | Application/topbar — see final menu/topbar mapping |
| 17 | `undoBtn` | 復原 Ctrl+Z | RETIRE desktop duplicate; Edit/History/keyboard authoritative |
| 18 | `redoBtn` | 重做 Ctrl+Shift+Z | RETIRE desktop duplicate; Edit/History/keyboard authoritative |
| 19 | `newBtn` | 新增 | RETIRE desktop duplicate |
| 20 | `openBtn` | 開啟 | RETIRE desktop duplicate |
| 21 | `saveBtn` | 儲存 | RETIRE desktop duplicate |
| 22 | `exportBtn` | 匯出 | File > Export secondary/responsive |
| 23 | `fullscreenToggle` | 進入全螢幕 Ctrl+Shift+F | View > Fullscreen |
| 24 | `inspectorToggle` | 開啟檢查器 | RETIRE duplicate panel opener |
| 25 | `settingsToggle` | 畫布設定 | SHORTCUT → Properties/View settings |
| 26 | `addPageBtn` | 新增頁面 | Pages PANEL_LOCAL |
| 27 | `closePagesBtn` | 關閉 | Pages PANEL_LOCAL |
| 28 | `drawToolButton` | 鋼筆 | TOOL_PRIMARY |
| 29 | `eraser` | 橡皮擦 | TOOL_PRIMARY |
| 30 | `select` | 選取 | TOOL_PRIMARY |
| 31 | `lasso` | 套索 | TOOL_PRIMARY |
| 32 | `shape` | 幾何 | TOOL_PRIMARY |
| 33 | `text` | 文字 | TOOL_PRIMARY |
| 34 | `image` | 圖片 | TOOL_PRIMARY |
| 35 | `pan` | 移動 | TOOL_PRIMARY |
| 36 | `toolbarLayoutToggle` | 切換為雙欄工具列 | Tools PANEL_LOCAL layout control |
| 37 | `pen` | 鋼筆 B | Draw flyout / TOOL_PRIMARY |
| 38 | `pencil` | 鉛筆 N | Draw flyout / TOOL_PRIMARY |
| 39 | `marker` | 麥克筆 M | Draw flyout / TOOL_PRIMARY |
| 40 | `brush` | 毛筆 I | Draw flyout / TOOL_PRIMARY |
| 41 | `airbrush` | 噴筆 A | Draw flyout / TOOL_PRIMARY |
| 42 | `quickColor` | 目前顏色 | Options PRIMARY color control |
| 43 | `—` | 複製 | OPTIONS_PRIMARY / contextual |
| 44 | `—` | 群組 | OPTIONS_PRIMARY / contextual |
| 45 | `—` | 最上 | OPTIONS_PRIMARY / contextual |
| 46 | `—` | 置中 | OPTIONS_PRIMARY / contextual |
| 47 | `—` | 刪除 | OPTIONS_PRIMARY / contextual |
| 48 | `textCancel` | 取消 | Text OPTIONS_PRIMARY |
| 49 | `textCommit` | 完成 | Text OPTIONS_PRIMARY |
| 50 | `inspectorSizeToggle` | 切換檢查器寬度 | Panel-local resize/collapse |
| 51 | `closeInspector` | 關閉檢查器 | Panel-local resize/collapse |
| 52 | `—` | 工具 | Properties/Layers/Shape panel-local navigation/control |
| 53 | `—` | 物件 | Properties/Layers/Shape panel-local navigation/control |
| 54 | `—` | 幾何 | Properties/Layers/Shape panel-local navigation/control |
| 55 | `—` | AI | Properties/Layers/Shape panel-local navigation/control |
| 56 | `—` | 進階 | Properties/Layers/Shape panel-local navigation/control |
| 57 | `—` | 局部 | Properties/Layers/Shape panel-local navigation/control |
| 58 | `—` | 物件 | Properties/Layers/Shape panel-local navigation/control |
| 59 | `—` | 線 | Properties/Layers/Shape panel-local navigation/control |
| 60 | `—` | 箭頭 | Properties/Layers/Shape panel-local navigation/control |
| 61 | `—` | 矩形 | Properties/Layers/Shape panel-local navigation/control |
| 62 | `—` | 橢圓 | Properties/Layers/Shape panel-local navigation/control |
| 63 | `—` | 三角 | Properties/Layers/Shape panel-local navigation/control |
| 64 | `addLayerBtn` | 新增圖層 | Layers PANEL_LOCAL |
| 65 | `duplicateLayerBtn` | 複製圖層 | Layers PANEL_LOCAL |
| 66 | `deleteLayerBtn` | 刪除圖層 | Layers PANEL_LOCAL |
| 67 | `duplicateSelectionBtn` | 複製 | Object/Edit MENU_PRIMARY + contextual shortcut |
| 68 | `groupSelectionBtn` | 群組 | Object/Edit MENU_PRIMARY + contextual shortcut |
| 69 | `frontSelectionBtn` | 移至最上 | Object/Edit MENU_PRIMARY + contextual shortcut |
| 70 | `deleteSelectionBtn` | 刪除 | Object/Edit MENU_PRIMARY + contextual shortcut |
| 71 | `ungroupSelectionBtn` | 解散 | Object/Edit MENU_PRIMARY + contextual shortcut |
| 72 | `backSelectionBtn` | 移至最下 | Object/Edit MENU_PRIMARY + contextual shortcut |
| 73 | `enterStrokeEditBtn` | 編輯筆畫 | Object > Path/Stroke + Options/Properties |
| 74 | `exitStrokeEditBtn` | 完成編輯 | Object > Path/Stroke + Options/Properties |
| 75 | `selectAllStrokeNodesBtn` | 全選節點 | Object > Path/Stroke + Options/Properties |
| 76 | `simplifyStrokeBtn` | 簡化節點 | Object > Path/Stroke + Options/Properties |
| 77 | `insertStrokeNodeBtn` | 插入節點 | Object > Path/Stroke + Options/Properties |
| 78 | `splitStrokeSegmentBtn` | 切割區段 | Object > Path/Stroke + Options/Properties |
| 79 | `nodeCornerBtn` | 角點 | Object > Path/Stroke + Options/Properties |
| 80 | `nodeSmoothBtn` | 平滑 | Object > Path/Stroke + Options/Properties |
| 81 | `nodeSymmetricBtn` | 對稱 | Object > Path/Stroke + Options/Properties |
| 82 | `deleteStrokeNodesBtn` | 刪除節點 | Object > Path/Stroke + Options/Properties |
| 83 | `resetSegmentStyleBtn` | 恢復整筆樣式 | Object > Path/Stroke + Options/Properties |
| 84 | `enterPathEditBtn` | 編輯 Path | Object > Path/Stroke + Options/Properties |
| 85 | `exitPathEditBtn` | 完成編輯 | Object > Path/Stroke + Options/Properties |
| 86 | `selectAllPathAnchorsBtn` | 全選節點 | Object > Path/Stroke + Options/Properties |
| 87 | `simplifyPathBtn` | 簡化 | Object > Path/Stroke + Options/Properties |
| 88 | `insertPathAnchorBtn` | 插入節點 | Object > Path/Stroke + Options/Properties |
| 89 | `refinePathBtn` | Refine | Object > Path/Stroke + Options/Properties |
| 90 | `pathCornerBtn` | 角點 | Object > Path/Stroke + Options/Properties |
| 91 | `pathSmoothBtn` | 平滑 | Object > Path/Stroke + Options/Properties |
| 92 | `pathSymmetricBtn` | 對稱 | Object > Path/Stroke + Options/Properties |
| 93 | `togglePathClosedBtn` | 閉合路徑 | Object > Path/Stroke + Options/Properties |
| 94 | `deletePathAnchorsBtn` | 刪除節點 | Object > Path/Stroke + Options/Properties |
| 95 | `applyPathStrokeBtn` | 套用／更新 | Object > Path/Stroke + Options/Properties |
| 96 | `removePathStrokeBtn` | 移除表現 | Object > Path/Stroke + Options/Properties |
| 97 | `aspectLockBtn` | 鎖定比例 | Object > Transform/Align + Properties |
| 98 | `—` | 靠左 | Object > Transform/Align + Properties |
| 99 | `—` | 水平置中 | Object > Transform/Align + Properties |
| 100 | `—` | 靠右 | Object > Transform/Align + Properties |
| 101 | `—` | 靠上 | Object > Transform/Align + Properties |
| 102 | `—` | 垂直置中 | Object > Transform/Align + Properties |
| 103 | `—` | 靠下 | Object > Transform/Align + Properties |
| 104 | `—` | 水平等距 | Object > Transform/Align + Properties |
| 105 | `—` | 垂直等距 | Object > Transform/Align + Properties |
| 106 | `pathEditToggle` | Path／Node 編輯 | Object > Path/Boolean/Repeat |
| 107 | `pathNodeApply` | 更新所選 Node | Object > Path/Boolean/Repeat |
| 108 | `booleanUnion` | Union | Object > Path/Boolean/Repeat |
| 109 | `booleanDifference` | Difference | Object > Path/Boolean/Repeat |
| 110 | `booleanIntersection` | Intersection | Object > Path/Boolean/Repeat |
| 111 | `booleanXor` | XOR | Object > Path/Boolean/Repeat |
| 112 | `booleanDivide` | Divide | Object > Path/Boolean/Repeat |
| 113 | `repeatRadial` | Radial | Object > Path/Boolean/Repeat |
| 114 | `repeatMirror` | Mirror | Object > Path/Boolean/Repeat |
| 115 | `repeatGrid` | Grid | Object > Path/Boolean/Repeat |
| 116 | `repeatExpand` | 展開 Path | Object > Path/Boolean/Repeat |
| 117 | `aiSaveCredential` | 暫存本次憑證 | CHAT primary or SPECIALIST per Function Placement Map |
| 118 | `aiConnect` | 套用連線設定 | CHAT primary or SPECIALIST per Function Placement Map |
| 119 | `aiDisconnect` | 中斷並清除憑證 | CHAT primary or SPECIALIST per Function Placement Map |
| 120 | `aiGeneratePlan` | 建立可編輯 Plan | CHAT primary or SPECIALIST per Function Placement Map |
| 121 | `aiImagePick` | 圖片 → Plan | CHAT primary or SPECIALIST per Function Placement Map |
| 122 | `aiDocumentPlan` | 文件 → Plan | CHAT primary or SPECIALIST per Function Placement Map |
| 123 | `aiInspectBtn` | 讀取文件 | CHAT primary or SPECIALIST per Function Placement Map |
| 124 | `aiCapabilitiesBtn` | 能力清單 | CHAT primary or SPECIALIST per Function Placement Map |
| 125 | `aiAuditBtn` | 稽核紀錄 | CHAT primary or SPECIALIST per Function Placement Map |
| 126 | `aiRunJSON` | 執行 JSON Command | CHAT primary or SPECIALIST per Function Placement Map |
| 127 | `aiPreviewBtn` | Preview | CHAT primary or SPECIALIST per Function Placement Map |
| 128 | `aiApproveBtn` | 核准所選步驟 | CHAT primary or SPECIALIST per Function Placement Map |
| 129 | `aiRejectBtn` | 拒絕 | CHAT primary or SPECIALIST per Function Placement Map |
| 130 | `aiCancelBtn` | 取消執行 | CHAT primary or SPECIALIST per Function Placement Map |
| 131 | `—` | Before／After | CHAT primary or SPECIALIST per Function Placement Map |
| 132 | `—` | Split | CHAT primary or SPECIALIST per Function Placement Map |
| 133 | `—` | Overlay | CHAT primary or SPECIALIST per Function Placement Map |
| 134 | `—` | Difference | CHAT primary or SPECIALIST per Function Placement Map |
| 135 | `aiRollbackBtn` | Rollback | CHAT primary or SPECIALIST per Function Placement Map |
| 136 | `—` | 取消 | CHAT primary or SPECIALIST per Function Placement Map |
| 137 | `aiTransmissionApprove` | 核准本次傳輸 | CHAT primary or SPECIALIST per Function Placement Map |
| 138 | `runGPUValidationBtn` | 執行 GPU 自我檢查 | SPECIALIST |
| 139 | `programAssetPick` | 匯入外部資產 | SPECIALIST / reference-evidence engineering |
| 140 | `programTranslate` | 編譯 Recipe | SPECIALIST / reference-evidence engineering |
| 141 | `programTrialRun` | 試跑 | SPECIALIST / reference-evidence engineering |
| 142 | `programStepRun` | 單步執行 | SPECIALIST / reference-evidence engineering |
| 143 | `programBreakpoint` | Breakpoint | SPECIALIST / reference-evidence engineering |
| 144 | `programBeforeAfter` | Before／After | SPECIALIST / reference-evidence engineering |
| 145 | `programAttachDocument` | 保存於 .ink | SPECIALIST / reference-evidence engineering |
| 146 | `programSaveRecipe` | 保存 Recipe | SPECIALIST / reference-evidence engineering |
| 147 | `programSaveReport` | 保存報告 | SPECIALIST / reference-evidence engineering |
| 148 | `referenceManualKit` | 建立人工基準包 | SPECIALIST / reference-evidence engineering |
| 149 | `referenceEvidencePick` | 匯入原軟體證據 | SPECIALIST / reference-evidence engineering |
| 150 | `referenceAttach` | 保存 Reference Package | SPECIALIST / reference-evidence engineering |
| 151 | `referenceSave` | 匯出 Reference Package | SPECIALIST / reference-evidence engineering |
| 152 | `studioLoadSkeleton` | 載入結構 | Compose/Recipe advanced or SPECIALIST |
| 153 | `recipeLoadFile` | 載入 Recipe JSON | Compose/Recipe advanced or SPECIALIST |
| 154 | `svgImportFile` | 匯入 SVG Path | File > Import > SVG |
| 155 | `studioRunRecipe` | 執行全部 | Compose/Recipe advanced or SPECIALIST |
| 156 | `studioReplayStep` | 局部重播 | Compose/Recipe advanced or SPECIALIST |
| 157 | `studioRollback` | 回滾 | Compose/Recipe advanced or SPECIALIST |
| 158 | `studioQA` | 執行 QA | Compose/Recipe advanced or SPECIALIST |
| 159 | `maskAdd` | 建立 Mask | LEGACY Specialist; not final normal UI |
| 160 | `adjustmentAdd` | 加入 Adjustment | LEGACY Specialist; not final normal UI |
| 161 | `filterAdd` | 加入 Filter | LEGACY Specialist; not final normal UI |
| 162 | `filterMoveUp` | 上移 Filter | LEGACY Specialist; not final normal UI |
| 163 | `strokeRecordStart` | 開始錄製 | SPECIALIST / advanced workflow |
| 164 | `strokeRecordPause` | 暫停／繼續 | SPECIALIST / advanced workflow |
| 165 | `strokeRecordFinish` | 結束保存 | SPECIALIST / advanced workflow |
| 166 | `drawingWorkflowPick` | 匯入手繪流程 | SPECIALIST / advanced workflow |
| 167 | `paintSessionCreate` | 建立完整筆畫 | SPECIALIST / advanced workflow |
| 168 | `paintReplay` | 替換並重播 | SPECIALIST / advanced workflow |
| 169 | `strokeSessionExport` | 匯出 Session | SPECIALIST / advanced workflow |
| 170 | `brushPackageExport` | 匯出 Brush Package | SPECIALIST / advanced workflow |
| 171 | `stylusTestStart` | 開始量測 | SPECIALIST / advanced workflow |
| 172 | `stylusTestFinish` | 儲存 Device Report | SPECIALIST / advanced workflow |
| 173 | `calibrationProfileSave` | 保存校準 | SPECIALIST / advanced workflow |
| 174 | `calibrationProfileExport` | 匯出 Profile | SPECIALIST / advanced workflow |
| 175 | `calibrationProfileImport` | 匯入 Profile | SPECIALIST / advanced workflow |
| 176 | `calibrationProfileReset` | 恢復預設 | SPECIALIST / advanced workflow |
| 177 | `interactiveBenchmarkRun` | 執行 1K／10K／100K 實際渲染 | SPECIALIST / advanced workflow |
| 178 | `artworkQaExport` | 匯出未核准人工驗收表 | SPECIALIST / advanced workflow |
| 179 | `layerManifestExport` | 匯出分層 Manifest | SPECIALIST / advanced workflow |
| 180 | `pen` | 鋼筆 | RESPONSIVE tool route |
| 181 | `brush` | 毛筆 | RESPONSIVE tool route |
| 182 | `eraser` | 橡皮 | RESPONSIVE tool route |
| 183 | `select` | 選取 | RESPONSIVE tool route |
| 184 | `mobileToolsToggle` | 更多 | RESPONSIVE route |
| 185 | `closeMobileTools` | — | RESPONSIVE route |
| 186 | `pencil` | 鉛筆 | RESPONSIVE tool route |
| 187 | `marker` | 麥克筆 | RESPONSIVE tool route |
| 188 | `airbrush` | 噴筆 | RESPONSIVE tool route |
| 189 | `lasso` | 套索 | RESPONSIVE tool route |
| 190 | `shape` | 幾何 | RESPONSIVE tool route |
| 191 | `text` | 文字 | RESPONSIVE tool route |
| 192 | `image` | 圖片 | RESPONSIVE tool route |
| 193 | `pan` | 移動畫布 | RESPONSIVE tool route |
| 194 | `closeSettings` | 關閉畫布設定 | SEE_FUNCTION_PLACEMENT_MAP |
| 195 | `fitViewportContentBtn` | 將全部內容符合 A4 視埠 | View / Properties document-layout |
| 196 | `resetViewportBtn` | 視埠 1:1 置中 | View / Properties document-layout |
| 197 | `fitArtboardBtn` | 切換至版面並符合畫板 | View / Properties document-layout |
| 198 | `penCalibrationCheckBtn` | 檢查輸入 | SPECIALIST / Help diagnostics |
| 199 | `penCalibrationResetBtn` | 重設 | SPECIALIST / Help diagnostics |
| 200 | `resetViewBtn` | 重設視圖 | View / Properties document-layout |
| 201 | `storageHealthBtn` | 檢查儲存與離線狀態 | SPECIALIST / Help diagnostics |
| 202 | `releaseHealthBtn` | 執行發布健康檢查 | SPECIALIST / Help diagnostics |
| 203 | `downloadDiagnosticsBtn` | 下載外部測試診斷包 | SPECIALIST / Help diagnostics |
| 204 | `checkUpdateBtn` | 檢查更新 | SPECIALIST / Help diagnostics |
| 205 | `activateUpdateBtn` | 啟用更新 | SPECIALIST / Help diagnostics |
| 206 | `closeExport` | — | Export dialog PANEL_LOCAL |
| 207 | `runExportBtn` | 建立檔案 | Export dialog PANEL_LOCAL |
| 208 | `cancelExportBtn` | 取消匯出 | Export dialog PANEL_LOCAL |
| 209 | `rotateResetBtn` | 旋轉 0° | View/status/Navigator shared viewport authority |
| 210 | `fitBtn` | 符合內容 | View/status/Navigator shared viewport authority |
| 211 | `zoomOutBtn` | − | View/status/Navigator shared viewport authority |
| 212 | `zoomInBtn` | ＋ | View/status/Navigator shared viewport authority |

## B. Select controls — 29/29

| # | ID | Current options | Final home |
|---:|---|---|---|
| 1 | `renderEngineMode` | 自動選擇 / WebGL2 GPU / Canvas 相容 | SPECIALIST |
| 2 | `fontFamily` | 系統字型 / 明體 / 黑體 / 等寬 | Text Options/Properties |
| 3 | `historyLimit` | 20 / 30 / 50 | History panel options |
| 4 | `pathStrokePreset` | Ink / Pencil / Marker / Opaque / Soft / Watercolor / Oil-like / Dry Brush / Texture | Draw/Path Options/Properties |
| 5 | `aiStartupMode` | Standard / AI-assisted / Local-only / Safe / Validation | SPECIALIST |
| 6 | `aiProvider` | Manual JSON / Deterministic Test / OpenAI-compatible / HTTP Model / Custom Endpoint | SPECIALIST |
| 7 | `aiAuthMethod` | None / Bearer / API key header | SPECIALIST |
| 8 | `aiDataPolicy` | 文字摘要 / 指定圖層 / 指定區域 / Local-only | CHAT advanced/privacy |
| 9 | `aiImagePolicy` | 不傳圖片 / 只傳選區 / 低解析 Preview / 完整圖片 | CHAT advanced/privacy |
| 10 | `aiLoggingPolicy` | Metadata only / Request no provider log | CHAT advanced/privacy |
| 11 | `aiPreviewQuality` | BALANCED / FAST / HIGH | CHAT advanced/Specialist |
| 12 | `programSafetyMode` | STATIC_PARSE / SANDBOX_ANALYSIS / TRANSLATE_ONLY / TRUSTED_EXTERNAL_RUN | SPECIALIST |
| 13 | `referenceRunner` | Photoshop / Illustrator / Inkscape / GIMP／Krita / Paint Session | SPECIALIST evidence tooling |
| 14 | `studioSkeleton` | 放射單層花 / 多層重疊花 / 側視花 / 喇叭形花 / 不對稱花序 | Compose/Recipe advanced |
| 15 | `adjustmentType` | Brightness／Contrast / Levels / Curves / Hue／Saturation / Color Balance / Gradient Map | LEGACY Specialist; not final normal UI |
| 16 | `filterType` | Gaussian Blur / Sharpen / High Pass / Edge Detection / Noise／Grain / Texture Overlay | LEGACY Specialist; not final normal UI |
| 17 | `paintBrush` | Pencil / Ink / Marker / Opaque Paint / Soft Paint / Watercolor / Oil-like / Dry Brush / Texture Brush / Blender / Smudge / Eraser | advanced Stroke Session/brush route |
| 18 | `stylusTestPattern` | 壓力曲線 / 低壓起筆 / 高壓飽和 / Tilt X／Y / 方位角 / 高度角 / 快速筆畫 / 慢速筆畫 / 長筆畫 / 短筆畫 / 直線 / 曲線 / 螺旋 / 交叉線 / 點按 / 重複筆畫 / 手掌誤觸 / Pen Up／Down | SPECIALIST |
| 19 | `calibrationProfileSelect` | INK Default | SPECIALIST |
| 20 | `artworkQaBenchmark` | 線稿花卉 / 水彩花卉 / 油畫／厚塗花卉 | SPECIALIST |
| 21 | `artboardPreset` | A4 · 210 × 297 mm | Properties > Document/Layout |
| 22 | `artboardOrientation` | 直式 / 橫式 | Properties > Document/Layout |
| 23 | `artboardPpi` | 150 PPI / 300 PPI / 600 PPI | Properties > Document/Layout |
| 24 | `artboardUnit` | 毫米 mm / 像素 px | Properties > Document/Layout |
| 25 | `paperType` | 空白 / 點陣 / 方格 / 橫線 | Properties > Document/Layout |
| 26 | `exportFormat` | PNG / SVG / PDF（固定實體尺寸） / 瀏覽器列印 | Export dialog |
| 27 | `exportScope` | 固定畫板 / 全部內容 / 目前畫面 | Export dialog |
| 28 | `exportScale` | 1× / 2× / 4× / 8×（自動分塊） | Export dialog |
| 29 | `exportPpi` | 150 PPI / 300 PPI / 600 PPI | Export dialog |

## C. Audit result

```text
STATIC_BUTTONS_ENUMERATED = 212/212
SELECT_CONTROLS_ENUMERATED = 29/29
UNENUMERATED_STATIC_CONTROLS = 0
```
