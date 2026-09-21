# RA Project Baseline and Evolution Guide

版本：v1.7  
更新日期：2026-07-29  
用途：定義 RA 的唯一有效基線、當前狀態、不可回退決議、知識庫結構與下一階段。

---

## 1. 專案定義

Recipe Authoring Workbench（RA）是供 AI 操作的語意幾何工作台。AI 負責理解構圖、Primitive、參數、生成器與拓撲；RA 負責 Evidence、量測、候選、參數控制、即時編譯、Runtime 比較、QA 與可追溯確認。

正式目標：

> AI 閱讀任意具幾何結構的圖像，使用 RA 建立可編輯語意幾何，經 AI 明確確認後編譯為 Recipe，由 iCAD 或其他向量 Runtime 精確再生。

RA 不是自動描圖器，亦不是 PosterLad 專用工具。

## 2. 唯一有效基線

主程式：`Recipe_Authoring_Workbench_RA6_6_Geometry_Measurement_Tools_Full_Package.zip`  
SHA-256：`841a582256c9b6c7af667bbb17af09c84f952a3620ecdc0640eaf57403cf15eb`

核心文件：

1. `RA_Geometry_Brain_SKILL_v1.2.md`
2. `RA_Programming_Technical_Spec_v1.7.md`
3. `RA_Project_Baseline_and_Evolution_Guide_v1.7.md`
4. `REC_to_RA_Integration_Matrix_v1.1.md`

舊 RA、REC 與文件版本均為歷史資料，不得作開發基線。

## 3. RA6.6 已完成

- RA6.3：Geometry Decision Engine 與 PL-036 Segment Candidate Engine
- RA6.4：Compare、同步 Zoom／Pan、Object Trace、Evidence Filter、Parameter Inspector
- RA6.5：Raw Boundary Capture、穩定 contour ID、隔離／群組、Evidence-only Gate
- RA6.6：兩點 LINE、三點 CIRCLE／ARC、contour span、平行／相切／等距量測
- Raw contour 固定 `recipeEligible:false`
- boundary-derived candidate 固定 `unresolved`、`requiresRescore:true`、Formal blocked

已知限制：

- 真實 open-chain／junction corpus 尚未充分驗證
- Semantic Boundary Resolution 尚未完成
- Compound Offset Continuity 尚未完成
- PL-055 weave topology 尚未完成
- Chromium 容器測試逾時，不宣稱真實瀏覽器 PASS

## 4. 全域 AI 確認規則

不論自動或半自動，所有結果必須經 AI 明確審查與確認，才能進入正式 Recipe。

流程：

```text
Auto Analysis
→ Working Candidates
→ AI Review Queue
→ AI Geometry / Structure / Runtime Review
→ AI_CONFIRMED
→ Runtime & QA Gate
→ FORMAL_READY
→ FORMAL_COMPILED
```

禁止 Silent Formalization。`AUTO_PROPOSED`、`AI_REVIEWING`、`UNRESOLVED`、`AI_REJECTED` 均不得正式編譯。

## 5. REC 整合結論

REC 的成熟工作台能力已在 RA6.4–6.6 重新實作或吸收：Compare、Trace、Evidence Filter、狀態 provenance、Boundary Evidence 與量測閉環。

刻意不吸收：contour→Formal Recipe、舊 eligibility gate、案例硬編碼、未驗證 Offset／Spline／Constraint Solver。

REC 主程式可從日常知識庫移除；只保留 `REC_to_RA_Integration_Matrix_v1.1.md` 作歷史整合證據。

## 6. 當前案例狀態

- P-1：封存，不納入日常回歸。
- PL-015：原生 RECTANGLE／CIRCLE／ARC；高階 Grid／ConcentricArcField 尚待收斂。
- PL-036：16 span 已分為 7 LINE、5 ARC、4 SPLINE；狀態 `SEMANTIC_SEGMENT_PASS_VISUAL_PENDING`。
- PL-055：尚待 center path、parallelPathField、weaveGraph、crossing、over／under 與 mask。

PL 系列只是訓練／驗證 corpus，不是產品範圍。

## 7. 下一階段

### RA6.7｜Semantic Boundary Resolution

- contour split／merge candidate
- outer／hole／island hierarchy
- contains／inside／touches／intersects／overlaps
- gap／bridge candidate
- crossing／occlusion candidate
- Boundary → Primitive provenance
- AI Review Queue 與 Formal Promotion Gate

### 後續

1. Constraint／Shared Parameter Inspector
2. Offset／Array／Mirror／Radius Sequence Generator
3. Dependency Graph 與 Local Recompute
4. PL-036 Compound Offset Continuity
5. PL-055 Weave／Topology
6. iCAD Runtime Roundtrip
7. Standard 10 後引入跨來源新 corpus

## 8. 不可回退決議

1. Raw contour／trace 只能作 Evidence。
2. ARC 可表達時不得用大量 LINE／POLYLINE。
3. Spline 必須有低階候選拒絕證據。
4. 候選必須通過 Hard Gate 與單一 100 分模型。
5. selected／rejected／unresolved 必須保留。
6. 自動與半自動結果必須經 AI 明確確認。
7. Working Draft 修改後必須重新 Gate／Score／Review。
8. 沒有 Runtime／Topology／Roundtrip QA 不得宣稱 Formal Complete。
9. 測試逾時或未執行必須標示未驗證。
10. CAD 專案不使用圖像生成模型。

## 9. 知識庫維護規則

日常知識庫只保留本指南第 2 節列出的五份資料。新版升格後，舊主程式與舊文件應移出日常知識庫並在本機封存。HTML 版本只能以 ZIP 交付，避免直接預覽造成記憶體負擔。
