# RA0.9｜AI Review Mode 與 Machine-readable Task State UI 改造

請接續 Recipe Authoring Workbench（RA）開發。

本輪名稱：

**RA0.9 AI Review Mode and Machine-readable Task State**

本輪不是 Geometry Brain 演算法開發，不是 Standard 10 幾何修正，也不是 RA1.0 開發。

本輪唯一目的：

> 在不修改 RA 凍結核心的前提下，改善 RA 介面，使 AI 能更清楚、低干擾、可追蹤地進行候選審查、Runtime 比較、確認、拒絕與 unresolved 判定。

---

## 一、唯一父基線

唯一程式父基線：

`RA0_9_Frozen_Toolkit_Baseline_v1.1.zip`

實際附件名稱可能帶有下載序號，以實際檔名為準。

不得以舊 RA 包、Standard 10 Evidence 包、歷史 Archive 或其他版本作為父基線。

開發前必須：

1. 解壓父基線。
2. 確認 ZIP CRC。
3. 執行父基線內自足驗證器。
4. 記錄原始主程式 SHA-256。
5. 確認父基線狀態為 `RA_BASIC_FUNCTION_FROZEN`。

若父基線驗證失敗，停止開發並回報，不得自行改用其他版本。

---

## 二、凍結邊界

以下項目不得修改：

- RA Authoring Schema
- Compiler 語意
- Runtime 幾何行為
- Save／Open 格式
- JSON Roundtrip
- Deterministic Replay
- Review Authority 規則
- Formal Compiler 阻擋規則
- iCAD Recipe contract
- Primitive 定義
- Geometry Brain 判斷規則
- Standard 10 案例內容
- 已通過的 Freeze Gate

本輪只允許修改：

- UI 版面
- 面板顯示與摺疊
- AI Review Mode
- Review Queue 呈現
- Machine-readable Task State
- Blocking Reason Summary
- DOM id／data attributes
- 無副作用的 UI Action hooks
- 鍵盤導覽
- 可存取性標籤
- UI 狀態同步
- UI 專用測試與文件

若發現必須修改 Schema、Compiler、Runtime 或 Review Authority 才能完成，必須標記為：

`POTENTIAL_RA_TOOL_GAP`

並停止該項修改，不得自行解凍核心。

---

## 三、目前介面問題

現有 RA UI 適合人工審查，但對 AI 純視覺操作仍有以下問題：

1. 同時顯示過多面板，資訊密度過高。
2. AI 不容易判斷目前唯一應處理的 Decision Target。
3. `PASS_SEMA`、`FORMAL ALLOWED`、`Formal eligible 0` 等狀態缺少集中解釋。
4. Raw Boundary Capture 過度突出，容易被誤認為正式 Authoring 資料。
5. Observation、Candidates、Hard Gate、Score、Relationships、Runtime 與 Decision 分散。
6. 缺少明確的下一步指示。
7. 缺少穩定、可被 AI 或自動化定位的 DOM 與 Action 介面。

---

## 四、核心新增功能：AI Review Mode

新增可切換的：

`AI Review Mode`

不得刪除或取代原本完整工作介面。

AI Review Mode 每次只聚焦一個 `Decision Target`，畫面至少包含：

### 1. Current Target Header

顯示：

- Case ID
- Target ID
- Target type
- Current review state
- Current formal state
- Evidence state
- Candidate count
- Selected candidate
- Blocking reason count
- Previous／Next target

### 2. Reference Context

顯示：

- Reference 全圖縮圖
- Target 區域裁切
- 可切換局部放大
- Target 邊界標示

### 3. Runtime Context

顯示：

- Runtime 全圖縮圖
- Target 區域裁切
- Overlay
- Difference
- Wipe
- Reference／Runtime 同步縮放與平移

### 4. Observation

顯示該 Target 的可見事實，不得混入未驗證結論。

### 5. Candidate Review

每個候選顯示：

- Primitive type
- Parameters
- Evidence
- Fit metrics
- Structural relationships
- Topology
- Complexity
- Editability
- Replay status
- Hard Gate result
- Unified score
- Selected／Rejected／Unresolved 狀態
- Decision rationale

候選不得只顯示分數，必須顯示分數來源與 Gate 狀態。

### 6. Relationship Summary

顯示：

- concentricWith
- equalRadiusTo
- parallelTo
- perpendicularTo
- tangentTo
- offsetOf
- mirroredFrom
- arrayMemberOf
- sharesBoundaryWith
- inside
- contains
- occludes
- occludedBy

僅顯示現有資料，不得由 UI 擅自推導新關係。

### 7. Review Actions

提供明確按鈕：

- `CONFIRM`
- `REJECT`
- `MARK UNRESOLVED`
- `REQUEST MEASUREMENT`
- `VIEW EVIDENCE`
- `VIEW RAW BOUNDARY`
- `PREVIOUS TARGET`
- `NEXT TARGET`

所有按鈕必須遵守現有 Review Authority。

不得因 UI 按鈕而繞過原有 Formal Compiler Gate。

---

## 五、Machine-readable Task State

新增單一集中式狀態物件，供 UI、AI 與測試讀取。

建議名稱：

```javascript
window.RA_AI_TASK_STATE
```

或等效但更合適的命名。

至少包含：

```json
{
  "caseId": "",
  "targetId": "",
  "mode": "AI_REVIEW",
  "reviewState": "",
  "formalState": "",
  "selectedCandidateId": "",
  "candidateCount": 0,
  "formalEligibleCount": 0,
  "rawBoundaryCount": 0,
  "blockingReasons": [],
  "warnings": [],
  "requiredActions": [],
  "nextRecommendedAction": "",
  "canConfirm": false,
  "canReject": false,
  "canMarkUnresolved": false,
  "canCompile": false
}
```

要求：

- 狀態必須由現有資料推導。
- 不得建立第二套語意狀態。
- 不得與現有 Review Authority 衝突。
- 狀態改變時發出穩定事件，例如：

```javascript
document.dispatchEvent(
  new CustomEvent("ra:ai-task-state-changed", {
    detail: window.RA_AI_TASK_STATE
  })
);
```

- 所有欄位必須可序列化。
- 禁止把 DOM 元件、函式或循環物件放入狀態物件。

---

## 六、Blocking Reason Summary

介面固定顯示：

```text
Current case
Current target
Review state
Formal state
Blocking reasons
Required actions
Next recommended action
```

例如：

```text
Case: PL-015
Target: PL-015-grid-squares
Review state: AI_REVIEWING
Formal state: BLOCKED

Blocking reasons:
- Candidate not AI confirmed
- 72 raw contours remain evidence-only
- 0 formal eligible objects

Required actions:
- Review rectilinearGrid candidate
- Confirm or reject inferred generator

Next recommended action:
- Open Candidate Review
```

注意：

- Raw contour 數量本身不能被誤寫為正式錯誤。
- Blocking reason 必須來自現有規則。
- 若沒有阻擋理由，明確顯示 `No blocking reasons`。
- 不得用模糊的 `Unknown error` 取代可取得的具體原因。

---

## 七、Raw Boundary 降階

Raw Boundary Capture 必須保留，但不得在 AI Review Mode 中常駐為主要面板。

調整為：

- 預設收合
- 移入 Evidence 區
- 顯示 `Evidence only`
- 顯示 `Not formal geometry`
- 只有使用者或 AI 主動選擇 `VIEW RAW BOUNDARY` 時展開

不得刪除 Raw Boundary 功能或資料。

---

## 八、DOM 與 Action Hooks

所有主要區域與操作必須有穩定識別：

```html
data-ra-region="..."
data-ra-target-id="..."
data-ra-candidate-id="..."
data-ra-action="..."
data-ra-state="..."
```

至少提供穩定 Action hooks：

```javascript
window.RA_AI_ACTIONS = {
  enterReviewMode(),
  exitReviewMode(),
  selectTarget(targetId),
  selectCandidate(candidateId),
  confirmCandidate(candidateId),
  rejectCandidate(candidateId, reason),
  markUnresolved(targetId, reason),
  requestMeasurement(targetId, request),
  showEvidence(targetId),
  showRawBoundary(targetId),
  previousTarget(),
  nextTarget(),
  getTaskState()
};
```

要求：

- Action hooks 必須呼叫現有 RA 行為。
- 不得複製或繞過 Review Authority。
- 無效操作必須回傳明確錯誤。
- 所有操作結果需 deterministic。
- 不得只靠滑鼠座標定位。

---

## 九、介面原則

保留現有 RA 深色專業介面風格。

AI Review Mode 應：

- 降低同時可見資訊量
- 強化單一任務焦點
- 保持 Reference／Runtime 對照為中心
- 減少裝飾
- 不使用大型動畫
- 不使用自動輪播
- 不隱藏關鍵狀態
- 不以顏色作為唯一狀態提示
- 中文與英文狀態不得混亂
- 按鈕名稱應明確，不使用模糊圖示取代文字
- 仍允許後續繼續調整介面

---

## 十、不得進行的工作

本輪禁止：

- 重做 Standard 10
- 修改任何案例幾何
- 修改 Geometry Brain SKILL
- 新增 Primitive
- 修改候選評分模型
- 修改 Hard Gate
- 修改 Compiler
- 修改 Runtime
- 修改 iCAD
- 自動升級 RA1.0
- 宣告新的 Freeze
- 刪除原介面
- 以新 UI 取代原完整模式
- 因畫面好看而改變工程語意

---

## 十一、測試要求

新增 UI 專用測試，至少包括：

### A. 父版回歸

- 父基線原驗證器全部通過
- Authoring／Compile／Replay／Roundtrip 不變
- 主程式核心行為無退化

### B. AI Review Mode

- 可進入／退出
- 不改變案例資料
- Target 切換正確
- Candidate 顯示正確
- Reference／Runtime 同步
- Overlay／Difference／Wipe 可用
- Raw Boundary 預設收合
- 原完整模式仍可使用

### C. Task State

- 所有必要欄位存在
- 可 JSON serialize
- 狀態切換會更新
- 事件會發送
- Blocking reasons 與現有狀態一致
- 無 candidate 時不崩潰
- unresolved 狀態正確
- formal ready 狀態正確

### D. Action Hooks

- 所有公開函式存在
- 無效 Target／Candidate 回傳錯誤
- Confirm／Reject／Unresolved 遵守 Review Authority
- 不得繞過 Formal Gate
- previous／next 在邊界行為正確

### E. Browser

至少在 Chrome 或 Edge 實際執行：

- 啟動主程式
- 載入案例
- 進入 AI Review Mode
- 切換 Target
- 查看候選
- 執行不改資料的導覽操作
- 截圖保存

若瀏覽器測試受環境限制，必須明確標記 `UNVERIFIED`，不得假裝通過。

---

## 十二、交付內容

產出一個完整 ZIP，不得只提供差異檔：

`RA0_9_AI_Review_Mode_Candidate.zip`

ZIP 內至少包含：

```text
RA 主程式
必要執行依賴
AI Review Mode
Machine-readable Task State
Action Hooks
UI 測試
父版回歸測試
README
CHANGELOG
KNOWN_LIMITATIONS
SHA256_MANIFEST
VERIFICATION_REPORT
```

HTML 必須只放在 ZIP 中，不單獨提供或預覽。

另產出：

- 主程式 SHA-256
- ZIP SHA-256
- 檔案清單
- 測試結果
- 已知限制
- 是否觸及 Freeze Boundary 的明確聲明

---

## 十三、驗收條件

只有以下條件全部成立，才可標示 Candidate：

- 父版所有 Freeze 驗證仍通過
- AI Review Mode 可進入與退出
- 原完整 UI 未被刪除
- Machine-readable Task State 可用
- Blocking Reason Summary 正確
- Action hooks 可重複執行
- Raw Boundary 已降為 Evidence
- Review Authority 未被繞過
- Compiler／Runtime／Schema 未修改
- Browser 基本操作已驗證或明確標示未驗證
- ZIP 可乾淨解壓
- CRC PASS
- 無巢狀 ZIP
- 無 `__pycache__`
- 無 `.pyc`
- SHA-256 已記錄

本輪完成後只可命名為：

`RA0.9 AI Review Mode Candidate`

不得命名為 RA1.0，不得宣告 RA 核心重新凍結。
