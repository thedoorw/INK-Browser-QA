# CHAT ↔ Tool Visual / Asset Interchange Standard v0.1

STATUS: USER_DIRECTION_RECORDED / CROSS_TOOL_FOUNDATION
SCOPE: INK + FUTURE USER-CREATED TOOLS
AUTHORITY: USER PRODUCT DIRECTION
IMPLEMENTATION: NOT AUTHORIZED BY THIS DOCUMENT

## 1. Goal

所有使用者自製工具與 CHAT 之間，應具備一致的「畫面、圖像資產、可編輯向量與結構資料」往返方式。

目標不是只讓 CHAT 看見一張圖，而是建立可跨工具重用的 Visual / Asset round-trip contract：

```text
Tool
→ capture / export / asset handle
→ CHAT inspection / reasoning / modification
→ structured result / asset handle
→ same tool or another tool
→ editable continuation
→ provenance / revision linkage where applicable
```

此原則適用於：
- INK
- FLORA
- DRAW
- MIND
- 未來其他使用者自製工具
- 可接入 CHAT 的成熟外部工具

CHAT 應逐步成為 Visual / Asset Router，而不是每一套工具各自重新發明一套傳圖方式。

## 2. Required round-trip classes

### A. Main application UI → CHAT

CHAT 應能取得：
- 整個應用程式畫面；
- 目前 viewport；
- 指定 panel；
- canvas-only；
- fullscreen；
- desktop / narrow / mobile 固定尺寸 QA evidence。

主要用途：
- UI Review
- regression review
- visual comparison
- bug report
- version evidence

Preferred path:

```text
Tool
→ screenshot / get_preview
→ output / asset handle
→ CHAT
```

Runtime screenshot evidence 應作為沒有互動式瀏覽器時的正式 fallback。

### B. Tool artwork / imported asset → CHAT

適用：
- JPG / JPEG
- PNG
- Canvas render
- SVG
- reference image
- mask
- selection / crop
- intermediate render
- exported artwork

CHAT 不應只收到縮圖。

最小交換資訊應包含：
- preview
- asset / output handle
- MIME type
- width
- height
- source tool
- source project
- revision / provenance identity where available
- asset role
- temporary / persistent state

### C. CHAT → Tool

CHAT 回傳工具時，應優先使用可重用結構：

- PNG / JPG
- SVG
- JSON
- Recipe
- geometry / path data
- palette / style parameters
- reference asset
- replacement asset

Preferred contract concept:

```text
import_asset(handle, operation/options)
```

而不是讓每套工具建立不同的 CHAT upload/import grammar。

### D. Tool A → CHAT → Tool B

長期要求：

```text
Tool A
→ CHAT
→ inspect / transform / route
→ Tool B
```

Examples:

```text
INK → CHAT → external design tool
FLORA → CHAT → INK
3D tool → CHAT → INK
Browser capture → CHAT → DRAW
```

工具之間不必彼此直接理解；只需共同理解 Visual / Asset contract。

## 3. Standard asset classes

最少統一四類：

| Asset class | Preferred format | Main purpose |
|---|---|---|
| Screenshot / Preview | PNG | UI / visual inspection |
| Raster Asset | PNG / JPG | image material |
| Editable Vector | SVG | continued editable graphics |
| Structured Data | JSON | Recipe / Geometry / Document / parameters |

工具可增加其他格式，但不得破壞這四類共通基線。

## 4. Shared metadata

每個可交換 asset / output 應盡量提供：

```text
asset_id / handle
source_tool
source_project
mime_type
width
height
created_revision
role
temporary / persistent
parent_asset
provenance
```

若某欄位不適用，可明確為 null / unavailable；不要偽造資訊。

目標是讓 CHAT 知道：
- 這是什麼；
- 從哪裡來；
- 哪個版本；
- 是否可繼續編輯；
- 是否只是暫存；
- 與哪個來源／revision 有關。

## 5. Standard capture profiles

固定至少五種 capture profile：

### APP_FULL
完整主程式介面。

### VIEWPORT
目前使用者實際看到的工作視窗。

### CANVAS_ONLY
只包含作品／canvas，不包含 editor chrome。

### PANEL
指定 panel 或功能區。

### EVIDENCE_SET
UI QA 固定證據組。

建議 baseline：

```text
Desktop    1280×800
Narrow      960×800
Mobile      390×844
Fullscreen  current full viewport
Selected panels / states as required
```

具體尺寸可由各工具補充，但 capture profile 名稱與語義應保持一致。

## 6. Natural CHAT intent mapping

未來 CHAT 應可把自然語句映射到標準 capture：

```text
「把目前 INK 給我看」
→ VIEWPORT

「只看作品」
→ CANVAS_ONLY

「幫我做 UI Review」
→ EVIDENCE_SET

「看 CHAT 面板」
→ PANEL(CHAT)
```

這些 mapping 應由 capability discovery / descriptor 描述，而不是寫死在單一 CHAT 記憶中。

## 7. Handle-first rule

大圖、輸出結果與跨工具交換優先採：

```text
preview
+
stable / ephemeral handle
+
metadata
```

避免：
- 每次都把完整 binary 嵌入 command payload；
- CHAT 只能看預覽卻無法取得原 asset；
- 產生結果後沒有 inspect / release lifecycle；
- 同一 asset 在工具間失去 identity。

INK 已建立的 `INK_OUTPUT_HANDLE v1` 可作為第一個實作參考，但跨工具標準不應永久綁死於 INK 命名。

## 8. Editable-return rule

當目標工具需要繼續編輯時，結果不應只回傳 flat raster。

優先級：

```text
editable native structure
→ SVG / path / structured data
→ high-quality raster fallback
```

若只能回傳 raster，metadata 應明確標示不可結構化編輯。

## 9. Provenance / revision rule

跨工具往返不得讓來源關係消失。

當工具本身已有 History / Revision / provenance authority 時：

```text
incoming asset
→ source identity
→ import / operation record
→ resulting asset identity
→ revision / provenance linkage
```

CHAT 不應透過旁路直接覆寫 document state。

## 10. Runtime evidence rule

對 UI 工具，正式 Runtime 應逐步能產生 screenshot artifact。

最低建議：
- APP_FULL / VIEWPORT
- Desktop
- Narrow
- Mobile
- Fullscreen
- critical panel states

這些 screenshot evidence 與 DOM / geometry / structured Runtime evidence互補；不能用其中一種完全取代另一種。

## 11. Relationship to current INK Connector work

現有 INK 已具備部分基礎：

```text
get_ink_preview
INK_OUTPUT_HANDLE v1
inspect_ink_output
release_ink_output
ephemeral output registry
```

後續 Capability Discovery 應能描述：
- capture profiles;
- output formats;
- metadata;
- handle lifecycle;
- whether result is editable;
- whether preview is recommended / required;
- import compatibility.

此文件不自動擴大目前 Connector Work Order scope。

## 12. Governance boundary

本文件是產品／跨工具方向記錄，不是新的 DEV Work Order。

任何實作仍必須經各專案現有治理流程授權。

尤其不得因本文件自行開始：
- external transport;
- MCP transport;
- arbitrary file upload/download;
- new persistence engine;
- new document schema;
- automatic cross-tool execution;
- automatic approval.

需要實作時，必須拆成 bounded Work Order。

## 13. Long-term target

最終希望達成：

```text
Every user tool
↔ CHAT
↔ every other compatible tool

screens
assets
editable vectors
structured data
preview evidence
provenance
revision-aware round trips
```

CHAT 應成為所有自製工具共用的視覺與資產交換層，使主程式介面、匯入圖、匯出圖、編輯結果與 QA evidence 都能在不同工具與 CHAT 視窗之間可檢查、可追蹤、可繼續工作。
