# RA Programming Technical Spec

版本：v1.7  
用途：定義 Recipe Authoring Workbench（RA）主程式的架構、資料模型、Compiler、Runtime、Evidence、QA，以及如何把 Geometry Brain SKILL 的候選競爭、Hard Gate 與評分制度真正落入程式。

---

## 1. 產品定義

RA 是 **AI 導向的語意幾何 Authoring、編譯、再生與驗證工具**。

RA 不等於：

- 自動向量化器
- 輪廓追蹤器
- PosterLad 專用工具
- 像素相似度優先的重畫系統

RA 的正式責任：

1. 記錄 AI 的觀察、候選、決策與未決問題
2. 保存共享參數、幾何原型與拓撲關係
3. 將 Authoring 編譯為 Recipe／自動繪圖指令
4. 交由 iCAD、SVG 或其他向量 Runtime 精確再生
5. 產生 Overlay、Difference、Residual 等比較證據
6. 執行語意 QA、拓撲 QA、Roundtrip QA 與視覺 QA

正式成果必須來自 **AI 幾何理解 → 語意 Authoring → Compiler 展開**。任何 `findContours`、vector trace 或點陣輪廓資料，只能作為 Evidence，不得直接成為正式 Recipe。

---

## 1.1 RA6.2 實作狀態

RA6.2 Geometry Decision Engine 已將本規格的第一個可執行閉環落入主程式：

- Candidate Ladder
- Hard Gate
- Unified 100-point Scoring
- `selected / rejected / unresolved`
- Relationship Graph
- Formal Compiler Blocking
- Candidate JSON Schema
- Engine validation and regression

目前正式編譯狀態：

- PL-015：`FORMAL`
- PL-036：`DEVELOPMENT_PREVIEW`，曲線分段與低階原型拒絕證據未完成
- PL-055：`DEVELOPMENT_PREVIEW`，crossing node 與 over/under 拓撲未完成

RA6.2 自動化驗證為 74/74 PASS；Chromium headless 在受控容器逾時，未宣稱瀏覽器 smoke test 通過。

## 1.2 RA6.3 實作狀態

RA6.3 PL-036 Segment Candidate Engine 已將曲線原型競爭下沉到**中心路徑分段層**：

- 每個 span 同時量測 LINE、ARC 與 SPLINE 候選
- LINE 以方向角、RMSE 與最大殘差驗證
- ARC 必須保存圓心、半徑、起訖／掃掠角與殘差
- SPLINE 只有在 LINE 與 ARC 的量測 Gate 同時失敗時才可 selected
- 分段結果保存為獨立 `ra-segment-candidate-analysis` 文件
- 高階 `compoundPathField` 引用分段分析，而非只保存一條全域 Spline

PL-036 已解析 16 個 span：

- LINE：7
- ARC：5
- SPLINE：4

中心路徑語意決策已通過；正式編譯仍被以下條件阻擋：

- mixed LINE／ARC／SPLINE Offset join continuity solver 尚未完成
- PL-036 視覺並排與局部切線缺口驗收尚未通過

RA6.3 自動驗證為 76/76 PASS。此結果代表 Segment Candidate Engine 與政策回歸通過，不代表 PL-036 視覺完成。

## 1.3 RA6.4 實作狀態

RA6.4 Authoring Workbench Foundation 將 RA 從 Decision Engine 檢視器推進為 AI 可實際操作的參數工作台：

- Canvas Compare：Side-by-side、Overlay、Wipe、Difference、Reference、Runtime
- 所有視圖共用 Zoom／Pan
- 局部區域框選與 Zoom-to-region
- Authoring Tree：Program、Decision Target、Measured Segment
- PL-036 measured segment 的實際向量隔離與高亮
- Cross-view Object Trace
- measured／corrected／inferred／unresolved Evidence Filter
- Primitive Parameter Inspector 與 Working Draft
- Working Draft 套用後新增 corrected evidence，並強制 `requiresRescore`
- 未重新評分前 Formal Compiler 必須阻擋
- Working Authoring JSON export

RA6.4 只重新實作 REC 的 Compare、Trace、Evidence Filter 與集中狀態概念；沒有吸收 REC 的 contour promotion、eligibility gate 或未驗證 constraint solver。

RA6.4 自動驗證：

- Workbench Contract：70/70 PASS
- Static／Schema／Assets／JavaScript：35/35 PASS
- Inherited RA6.3 regression：45/45 PASS
- Aggregate：150/150 PASS

Chromium Headless 與 Xvfb Chromium 在容器環境逾時；未宣稱瀏覽器 smoke test 通過。

---

## 2. 系統架構

```text
Reference Source
      ↓
Authoring Workbench
  - Compare / Region / Trace
  - Parameter Inspector / Working Draft
      ↓
Observation Workspace
      ↓
Candidate Generation
      ↓
Hard Gate
      ↓
Unified Scoring
      ↓
Decision / Relationship Graph
      ↓
Semantic Authoring Model
      ↓
Recipe Compiler
      ↓
Runtime Adapter
      ↓
Vector Output
      ↓
Evidence / QA / Revision
```

主要模組：

1. Project / Case Registry
2. Reference Manager
3. Authoring Workbench State
4. Compare / Region / Trace Workspace
5. Primitive Parameter Inspector
6. Observation Workspace
7. Candidate Engine
8. Hard Gate Engine
9. Unified Scoring Engine
10. Geometry Authoring Model
11. Topology / Relationship Model
12. Recipe Compiler
13. Runtime Adapter
14. Evidence Renderer
15. QA Engine
16. Version / Replay Manager

---

## 3. Case Registry

每個案例至少保存：

```json
{
  "caseId": "string",
  "title": "string",
  "status": "DRAFT | IN_PROGRESS | IN_PROGRESS_MANUAL_SEMANTIC | SEMANTIC_COMPLETE | VERIFIED | ARCHIVED",
  "source": {
    "type": "file | url | generated",
    "location": "string",
    "accessedAt": "ISO-8601",
    "sha256": "string"
  },
  "canvas": {
    "width": 1000,
    "height": 1400,
    "unit": "normalized | px | mm"
  },
  "authoringVersion": "string",
  "recipeVersion": "string",
  "skillVersion": "string"
}
```

原則：

- corpus 必須可替換
- 不得把特定作者、特定案例名稱寫死在核心 Schema
- 必須保存來源、雜湊、版本與回放所需資訊

### 3.1 Workbench State Contract

RA6.4 新增 `ra_workbench_state_v1.schema.json`。最低狀態包括：

```json
{
  "caseId": "PL-036",
  "compareMode": "side-by-side",
  "viewport": {"zoom": 1, "panX": 0, "panY": 0, "fit": true},
  "selection": {"kind": "segment", "id": "segment-id"},
  "region": null,
  "evidenceFilters": ["measured", "corrected", "inferred", "unresolved"],
  "workingDraft": null
}
```

所有 Compare Canvas 必須共享同一 viewport state。Working Draft 必須與 Formal Authoring 分離。

---

## 4. Authoring 資料模型

Authoring 是正式語意來源；Recipe 是可執行展開結果。

頂層結構：

```json
{
  "meta": {},
  "canvas": {},
  "palette": {},
  "observations": [],
  "hypotheses": [],
  "decisions": [],
  "parameters": {},
  "geometry": [],
  "topology": [],
  "layers": [],
  "compiler": {},
  "qa": {}
}
```

### 4.1 Observation

```json
{
  "id": "obs-001",
  "region": "main",
  "statement": "visible fact",
  "confidence": 0.9,
  "evidence": []
}
```

Observation 只能記錄可見事實，不得直接偷渡未驗證結論。

### 4.2 Hypothesis / Candidate

```json
{
  "id": "hyp-001",
  "target": "shape-001",
  "candidateType": "ARC",
  "parameters": {
    "cx": 0.5,
    "cy": 0.5,
    "radius": 0.2,
    "startAngle": 0,
    "endAngle": 90,
    "clockwise": false
  },
  "metrics": {
    "meanResidual": 0.0,
    "maxResidual": 0.0,
    "coverage": 1.0,
    "radiusDeviation": 0.0,
    "tangentErrorDeg": 0.0,
    "parameterCount": 5,
    "primitiveCount": 1,
    "sharedConstraintCount": 0
  },
  "gate": {
    "passed": true,
    "failReasons": []
  },
  "scores": {
    "fitQuality": 0,
    "geometricStability": 0,
    "structuralConsistency": 0,
    "topologyContinuity": 0,
    "representationComplexity": 0,
    "editabilityReplay": 0,
    "total": 0
  },
  "decisionState": "pending"
}
```

### 4.3 Decision

```json
{
  "target": "shape-001",
  "selected": "hyp-001",
  "rejected": ["hyp-002"],
  "unresolved": [],
  "reason": "single arc explains the visible curve with shared center and low residual"
}
```

`selected / rejected / unresolved` 必須同時保留，不能只保存最後答案。

---

## 4.4 Segment Candidate Analysis

複合中心路徑不得只以單一 `SPLINE` 候選描述。應另存分段分析文件：

```json
{
  "kind": "ra-segment-candidate-analysis",
  "version": "1.0",
  "caseId": "string",
  "thresholds": {},
  "families": [
    {
      "familyId": "string",
      "offsets": [],
      "segments": [
        {
          "id": "segment-01",
          "pointRange": [0, 4],
          "selectedPrimitive": "LINE | ARC | SPLINE",
          "selectedParameters": {},
          "candidates": []
        }
      ],
      "summary": {}
    }
  ]
}
```

最低規則：

1. 每段至少評估 LINE、ARC、SPLINE。
2. ARC selected 時必須有 `center / radius / sweepDeg / rmse / maxResidual`。
3. SPLINE selected 時必須保存 LINE 與 ARC Gate 的失敗證據。
4. 分段全部 resolved 不等於整個案例 formal pass；Offset、Topology、Runtime 與 Visual Gate 仍可阻擋。
5. 手工 fit points 可作量測證據，但不得由點陣 contour 直接轉為正式 segment。

### 4.5 Working Draft Transaction

Parameter Inspector 的修改先寫入 Working Draft：

1. 不直接覆寫 Formal Recipe。
2. 套用後建立 `corrected` evidence。
3. 必須標記 `requiresRescore: true`。
4. Candidate score、Gate 與 Relationship 重新驗證前，Formal Compile 必須阻擋。
5. Revert 必須能回復原始 Authoring 參數。
6. Export 必須清楚標記 dirty object ids 與 formal compile 狀態。

---

## 5. Primitive 與原型升級階梯

曲線與邊界候選的正式測試順序：

```text
LINE
→ ARC / CIRCLE
→ ELLIPSE
→ LINE + ARC COMPOUND
→ SPLINE
→ POLYLINE
```

低階候選未被證據拒絕前，不得升級到更高自由度候選。

最低支援 Primitive：

- POINT
- LINE
- POLYLINE（只限真正折線）
- RECTANGLE
- ROUNDED_RECT
- CIRCLE
- ARC
- ELLIPSE
- CAPSULE
- SECTOR
- RING
- ARC_BAND
- SPLINE
- COMPOUND

每個 Primitive 需具備：

- 穩定 id
- layer
- style
- transform
- geometry parameters
- source decision
- editability metadata

### 5.1 ARC（正式欄位）

```json
{
  "type": "ARC",
  "cx": 0.5,
  "cy": 0.5,
  "radius": 0.2,
  "startAngle": 0,
  "endAngle": 90,
  "clockwise": false
}
```

### 5.2 SPLINE（限制）

必須明確區分：

- Bezier
- Catmull-Rom
- B-spline / NURBS（若 Runtime 支援）

Spline 必須保存控制點與連續性要求，不得只保存密集採樣點；且必須保存「為何 ARC / ELLIPSE / COMPOUND 失敗」的拒絕證據。

---

## 6. Hard Gate

Hard Gate 只負責淘汰，不加分。候選出現以下任一情況即淘汰：

1. 使用非有限數值、負半徑或不合法角度範圍
2. 疑似定曲率曲線未建立 ARC 候選
3. 可由原生幾何完成卻直接退化成 polyline / polygon
4. 由 `findContours` 或 vector trace 直接生成正式候選
5. 缺少最低量測證據
6. 無法穩定回放或參數不可重現
7. 與已確認拓撲嚴重衝突

Compiler 只能接受通過 Hard Gate 的候選。

---

## 7. Unified Scoring

所有通過 Hard Gate 的候選使用單一 100 分模型：

1. **Fit Quality**：30
2. **Geometric Stability**：15
3. **Structural Consistency**：15
4. **Topology & Continuity**：15
5. **Representation Complexity**：15
6. **Editability & Replayability**：10

### 7.1 指標說明

- Fit Quality：平均殘差、最大殘差、覆蓋率
- Geometric Stability：圓心集中度、半徑變異、方向穩定度
- Structural Consistency：共圓、同心、等距、對稱、陣列、共享參數
- Topology & Continuity：接點、切線、遮擋、包含、交織、G0/G1/G2
- Representation Complexity：原型數量、自由參數數量、是否需要冗餘物件
- Editability & Replayability：是否可穩定修改、重播、再編譯

### 7.2 典型門檻

- `ARC score >= 80`：必須使用 ARC
- `65–79`：列為主要候選，要求補量測
- `50–64`：保留競爭，不可直接定案
- `< 50`：拒絕該候選

此門檻可依類型調整，但不得移除 Hard Gate。

---

## 8. 最小生成程式與複雜度預算

Authoring 與 Decision Engine 必須偏好：

- 最少 Primitive
- 最少自由參數
- 最大共享參數
- 最少無結構意義的控制點

可使用 `complexityBudget`：

```json
{
  "region": "main",
  "maximumPrimitives": 6,
  "maximumFreeParameters": 12,
  "maximumSplineControlPoints": 4
}
```

超過預算時，AI 與主程式都應重新搜尋：

- 共享圓心
- radiusSequence
- translationArray
- rotationArray
- mirrorGroup
- offset path
- weaveGraph

---

## 9. Parametric Generator

Authoring 層可使用高階語意生成器：

- `rectilinearGrid`
- `concentricArcField`
- `parallelPathField`
- `translationArray`
- `rotationArray`
- `mirrorGroup`
- `radiusSequence`
- `strokeSequence`
- `weaveGraph`

生成器由 Compiler 展開為 Runtime 可執行 Primitive。

範例：

```json
{
  "type": "concentricArcField",
  "centers": [[0.25, 0.25], [0.75, 0.25]],
  "radius": {
    "start": 0.03,
    "step": 0.015,
    "count": 20
  },
  "strokeWidth": {
    "start": 1,
    "step": 0.2
  }
}
```

---

## 10. Topology / Relationship Graph

正式支援關係：

- contains / inside
- touches / tangentTo
- intersects
- overlaps
- concentricWith
- parallelTo
- equalSpacingWith
- offsetOf
- mirroredFrom
- rotatedFrom
- sharesBoundary
- occludes / occludedBy
- over / under
- clipBy / maskBy
- zBefore / zAfter

Relationship Graph 是全局結構修正的依據。若物件沒有任何關係，Decision Engine 必須檢查它是否真應獨立存在。

---

## 11. Compiler

Compiler 將語意 Authoring 轉為 Runtime Recipe。基本原則：

1. 只接受通過 Hard Gate 的 selected 候選
2. 不接受 `vectorTrace` 作為正式輸出
3. 高階生成器先展開，再輸出原生 Primitive
4. 所有輸出物件必須保存來源 decision id
5. 編譯結果需 deterministic replay
6. Roundtrip 後的語意資訊不得無故流失

### 11.1 Compiler Blocking Rules

以下情況必須阻擋正式編譯：

- ARC 區段被 polyline 取代
- required candidate scores 缺失
- selected 候選未保存量測證據
- unresolved 區域被靜默忽略
- topology graph 與 draw order 衝突

---

## 12. Runtime Adapter

RA 需能輸出至少三種 Runtime：

1. iCAD Recipe / Auto Drawing
2. SVG Runtime
3. HTML Canvas / JS Runtime

Runtime Adapter 的責任：

- 轉換 Primitive
- 實作 draw order
- 轉換 fillStyle / strokeStyle
- 處理 clip / mask / weave
- 回傳渲染結果與 object map

---

## 13. Evidence Renderer

Evidence 層可使用：

- edge map
- contour data
- distance measurement
- local magnifier
- grid overlay
- residual boxes
- diagnostic vector trace

但 Evidence 不能回流成正式 Recipe，只能服務於：

- 量測
- Candidate comparison
- QA
- 人工審查

---

## 14. QA Engine

QA 分成：

1. Geometry QA
2. Topology QA
3. Roundtrip QA
4. Visual QA
5. Regression QA

### 14.1 建議關鍵指標

- Primitive Economy Score
- Arc Authenticity Score
- Constraint Consistency Score
- Topology Score
- Editability Score
- Trace Dependency Score

### 14.2 Semantic Complete 最低條件

- 無 vectorTrace 正式輸出
- 無可替代原生幾何的 polyline 退化
- selected / rejected / unresolved 完整
- 候選評分完整
- Relationship Graph 完整
- Compiler 可 deterministic replay
- Roundtrip 一致
- 視覺可接受

---

## 15. Version / Replay Manager

每次主要改動必須保存：

- case id
- source sha256
- authoring version
- skill version
- compiler version
- recipe version
- runtime version
- QA summary
- accepted / rejected hypotheses

主程式應支援：

- 穩定 object id
- deterministic replay
- case diff
- parameter diff
- regression replay

---

## 16. 與 Geometry Brain SKILL 的同步要求

主程式技術規格必須與 `RA_Geometry_Brain_SKILL.md` 同步。最低同步項目：

- 原型升級階梯
- Hard Gate
- Unified Scoring
- ARC 主動求圓心程序
- 最小生成程式
- Relationship Graph
- selected / rejected / unresolved
- Final Review blocking

若 SKILL 更新而主程式未同步，該版本不得宣稱 Semantic Rebuild 已完全受程式約束。

---

## 17. REC 整合邊界

可吸收並重新實作：

- Compare Workspace
- Cross-view selection／trace
- Evidence State Filter
- 集中狀態與 provenance
- UI／QA 契約

不得吸收進正式 Authoring：

- contour／segmentation → formal Recipe
- REC eligibility gate 中允許 measured contour 升格的規則
- PosterLad 特定座標或案例名稱控制
- 未經真實驗證的 offset／spline／constraint solver

RA 必須保持唯一 Geometry Brain、Decision Engine、Semantic Authoring 與 Compiler。

---

## 18. Raw Boundary Capture Workspace（RA6.5 已實作）

Raw Boundary Capture 是 Geometry Brain 前方的 Evidence Scaffold，不是正式 Recipe 來源。

實作流程：

```text
Reference Image
→ Canny / ordered contour capture
→ stable contour ID / hierarchy / open-closed state
→ isolate / group / trace
→ LINE / ARC / CIRCLE working candidate
→ Geometry Brain re-score
→ Semantic Boundary Resolution
→ Formal Primitive
```

每條 Raw Contour 必須保存：

- `contourId`
- `stableFingerprint`
- ordered points
- bbox / centroid / perimeter / area
- hierarchy / parent contour
- open / closed state
- initial LINE / ARC / CIRCLE fits
- `evidenceState: measured`
- `recipeEligible: false`
- `formalPromotionBlocked: true`

Raw Contour 可以用於：

- 集中視覺注意
- 穩定區域與量測來源
- 建立候選
- 計算殘差與覆蓋率
- 原圖、候選與正式 Primitive 的雙向追蹤

Raw Contour 不得：

- 直接成為 Polygon / Polyline Recipe
- 因初始 fit 通過就自動升格
- 取代 Geometry Brain 的候選競爭與全局結構判斷

由 contour 建立的工作候選固定為：

- `decisionState: unresolved`
- `recipeEligible: false`
- `requiresRescore: true`

只在完成 Geometry Brain 重新評分、拓撲確認與正式 Decision 後，才可另外建立新的 Semantic Primitive。

---

## 19. 不可回退事項

1. 不恢復 `findContours -> 正式 Recipe` 路徑
2. 不以像素相似度作唯一完成條件
3. 不接受大量 polyline 近似真圓弧作為 Semantic Complete
4. 不把特定 corpus 名稱寫死在 Schema
5. 不讓 Evidence 取代 Authoring



---

## RA6.6｜Geometry Measurement Tools

RA6.6 在 RA6.5 Boundary Capture Workspace 上加入可由 AI 直接操作的幾何量測層。

### 實作能力

- 兩點建立 `LINE` 工作候選
- 三點建立 `CIRCLE` 工作候選
- 三點建立 `ARC` 工作候選
- Raw contour 的起點／終點 span 選取
- span 的 shortest／forward／reverse 路徑
- span → `LINE / ARC / CIRCLE` 擬合
- 即時計算 RMSE、最大殘差、normalized RMSE、radius deviation
- 使用 Geometry Brain v1.1 六項權重產生 Working Score
- `parallel / tangent / equal-spacing` 量測
- Parameter Inspector 修改後重新計算 working metrics 與 gate

### 正式隔離

所有量測候選必須固定：

```json
{
  "decisionState": "unresolved",
  "recipeEligible": false,
  "formalPromotionBlocked": true,
  "requiresRescore": true
}
```

量測 Gate 通過只代表數值擬合可用，不代表 Geometry Brain 已選定該 Primitive。Formal Compiler 必須持續阻擋，直到候選競爭、全局結構檢查與正式 Decision 完成。

### 新增技術資產

- `runtime/geometry_measurement_engine.js`
- `schemas/ra_geometry_measurement_v1.schema.json`
- `schemas/ra_workbench_state_v3.schema.json`
- `cases/PL-036/PL-036_geometry_measurement_fixture_ra66.json`
- `qa/run_ra66_measurement_contract.js`
- `qa/run_ra66_static_validation.py`

### 已知限制

- 三點 CIRCLE／ARC 可精確定義圓，但三點本身不足以證明整個可見 span 為定曲率；正式決策仍需更多 contour samples 與全局關係。
- Tangent 檢查目前以無限直線至圓心距離與半徑差為主，尚未完整限制接觸點必須落在線段與 ARC sweep 內。
- Equal-spacing 目前針對近似平行 LINE 候選；曲線 Offset 等距仍待 Parametric Constraint Tools。
- Browser smoke 在容器 Chromium 仍逾時，未宣稱實機 PASS。


---

## 20. AI Review Queue 與 Formal Promotion Gate

### 20.1 全域原則

所有自動或半自動分析結果只能建立 Working Candidate／Working Recipe，不得直接建立 Formal Recipe。每個候選必須保存來源 Evidence、演算法版本、參數、分數、Gate、風險與 AI 審查紀錄。

禁止 Silent Formalization。沒有 `AI_CONFIRMED` 紀錄、Runtime QA 或可追溯 provenance 的物件，Compiler 必須拒絕。

### 20.2 狀態機

```text
AUTO_PROPOSED
  → AI_REVIEWING
  → AI_CONFIRMED | AI_REJECTED | UNRESOLVED
AI_CONFIRMED
  → FORMAL_BLOCKED | FORMAL_READY
FORMAL_READY
  → FORMAL_COMPILED
```

合法狀態：

- `AUTO_PROPOSED`
- `AI_REVIEWING`
- `AI_CONFIRMED`
- `AI_REJECTED`
- `UNRESOLVED`
- `FORMAL_BLOCKED`
- `FORMAL_READY`
- `FORMAL_COMPILED`

### 20.3 Review Record Schema

```json
{
  "reviewId": "review-001",
  "targetId": "candidate-001",
  "state": "AI_CONFIRMED",
  "reviewer": "AI",
  "geometryCheck": {"passed": true, "notes": []},
  "structureCheck": {"passed": true, "notes": []},
  "runtimeCheck": {"passed": true, "notes": []},
  "evidenceIds": ["contour-001", "span-004"],
  "candidateIdsCompared": ["line-001", "arc-001", "spline-001"],
  "decisionReason": "string",
  "reviewedAt": "ISO-8601",
  "authoringVersion": "string"
}
```

### 20.4 Compiler Blocking Rules

以下任一條件成立時必須阻擋 Formal Compile：

1. review state 不是 `FORMAL_READY`。
2. 候選仍為 `AUTO_PROPOSED`、`AI_REVIEWING` 或 `UNRESOLVED`。
3. 缺少幾何、結構或 Runtime 三層確認。
4. Raw contour／trace evidence 被直接引用為正式 Primitive。
5. Working Draft 修改後尚未重新 Gate／Score／Review。
6. provenance、review record 或版本資訊缺失。
7. Runtime QA、Topology QA 或 Roundtrip QA 存在硬性失敗。

### 20.5 自動化邊界

允許自動：Boundary Capture、span proposal、Primitive fitting、relationship mining、Generator proposal、shared parameter extraction、Working Recipe draft、QA 與排序。

必須由 AI 確認：Primitive 最終選擇、Semantic Boundary Resolution、Generator 結構、Topology、Formal Promotion 與案例完成宣告。

## 21. RA6.7 下一階段規格

名稱：`RA6.7 Semantic Boundary Resolution`。

範圍：

- contour split／merge candidate
- outer／hole／island candidate
- contains／inside／touches／intersects／overlaps
- gap／bridge candidate
- crossing／occlusion candidate
- Boundary → Primitive provenance
- Semantic Boundary panel 與 hierarchy tree
- 所有自動結果進入 AI Review Queue

不可：Raw contour 直接升格、unresolved 靜默轉 selected、未經 AI 確認的 Formal Compile。
