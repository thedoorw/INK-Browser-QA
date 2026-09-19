# INK Browser QA

INK 是一個以同一套 shared core 為基礎、同時朝 **可攜版** 與 **雲端版** 發展的圖像／設計編輯器專案。

這個 repository 是 INK 的 GitHub SSOT（Single Source of Truth）。

任何新 CHAT／DEV／MR 視窗都不應依賴先前聊天記憶來恢復工作；只要知道自己的角色，從本 README 指定的文件順序即可接續。

---

## 1. 先確認你的角色

INK 目前採：

```text
USER
  ↓
MR — Main Review
  ↓ 發布 Current Work Order
DEV
  ↓ branch implementation + progress checkpoints
DEV_HANDOFF
  ↓
MR REVIEW
  ↓ PASS / REVISE / HOLD
下一張 Work Order
```

### MR — Main Review

MR 負責：

- 產品方向與階段規劃；
- 將大目標拆成 bounded Work Order；
- 維護 `ACTIVE/INK_CURRENT_WORK_ORDER.md`；
- 指定 DEV branch；
- 控制 scope / gate；
- 檢查 DEV branch、diff、tests、reports；
- 作出 `MR_PASS / MR_REVISE / MR_HOLD`；
- 決定何時 promotion 到 `main`；
- 只有 MR 才能授權下一張 DEV 任務；
- 在 Cloud Start Gate 成立時，必須先提醒 USER，再等 USER 明確同意才可開始 Cloud implementation。

MR 不把討論本身視為產品修改授權，也不因 DEV「看起來做完」就自動進下一階段。

### DEV

DEV 負責：

- 先讀 Current Work Order；
- 只在 Work Order 指定 branch 工作；
- 只實作明確授權的 bounded scope；
- 持續 commit meaningful checkpoints；
- 持續更新 branch-local `ACTIVE/INK_DEV_PROGRESS.md`；
- 保留 source / QA / report evidence；
- 完成後 `DEV_HANDOFF` 並 STOP 等 MR。

DEV 不得自行：

- merge `main`；
- 更新 `package/ink-current`；
- 發版／certify；
- 升 `FORMAT_VERSION`（除非 Work Order 先授權）；
- 擴大 FLORA / AI / Recipe product boundary；
- 開始下一張任務；
- 提前開始 Cloud implementation。

完整治理規則：

`governance/INK_MR_DEV_GOVERNANCE_v0.1.md`

---

## 2. 新視窗如何恢復工作

### 所有角色共同先讀

依序：

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. `working/WORKING_STATUS.md`

之後再依角色繼續。

### MR 再讀

1. `ACTIVE/INK_REVIEW_STATUS.md`
2. `ACTIVE/INK_REVIEW_FINDINGS.md`
3. `ACTIVE/INK_REVIEW_EVIDENCE.md`
4. Current Work Order 點名的 governance / research / product / QA 文件
5. DEV handoff branch 與 exact HEAD

MR Review 必須 pin exact DEV branch HEAD；HEAD 若改變，舊 review fingerprint 即失效。

### DEV 再讀

1. `ACTIVE/INK_DEV_NEW_WINDOW_START.md`
2. **Current Work Order 指定 DEV branch 上的**
   `ACTIVE/INK_DEV_PROGRESS.md`
3. `governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`
4. Current Work Order 明確要求的其他文件

重要：

> DEV 活動期間，真正的即時 DEV 進度在 **指定 work branch** 上的 `ACTIVE/INK_DEV_PROGRESS.md`。
> main 上同名檔案可能只是任務初始化／前一 checkpoint，不得用它取代 branch-local progress。

### 唯一任務授權來源

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

其他 README、board、progress、research 文件都不能自行授權新工作。

---

## 3. INK 的產品總目標

權威產品方向：

`governance/INK_Product_Delivery_Model_v0.1.md`

INK 不是兩套不同產品，而是：

```text
                         shared INK Core
                              │
                ┌─────────────┴─────────────┐
                │                           │
        Portable / Web INK          INK Cloud Editor
             INK.html                  Cloud delivery
                │                           │
       local / offline / archive     remote persistence /
       direct browser opening        revision / future collab
```

### A. 可攜版 INK

原始且持續有效的正式目標：

`single INK.html`

用途：

- 一個 HTML 直接在標準瀏覽器開啟；
- local / offline 使用（瀏覽器 API 允許範圍內）；
- 易於下載、封存與攜帶；
- 保留 shared INK document / vector / raster / natural-media / history / editor core。

正式可驗證交付目標仍是三件式：

```text
INK.html
WORKING_STATUS.md
SHA256SUMS.txt
```

目前仍是 modular source 階段，尚未宣稱 single-file certified baseline。

### B. INK Cloud Editor

雲端版的目的，是在 shared INK Core 上增加：

- cloud file / revision persistence；
- browser account / session adapter；
- persistent project access；
- richer editor-domain workflow；
- 未來 collaboration / presence 等 cloud-only capability。

Cloud Editor 必須盡可能重用與可攜版相同的 document / editor / vector / history / render core。

Cloud-only 能力應保持為 adapter / service layer，不應反過來污染 portable core。

Penpot目前只作為成熟 editor architecture / interaction 參考；INK 不是 Penpot fork，也不以 Penpot 作為產品平台。

---

## 4. 現階段：先穩定會影響文件格式與結構的 shared core

目前不是正式 Cloud implementation 階段。

目前工程主線：

```text
document schema / identity
→ Frame + nested hierarchy
→ container / ownership / inherited semantics
→ transform / coordinate contract
→ component schema foundation
→ layout / constraint schema foundation
→ serialization / migration / persistence contract
→ PRE_CLOUD_CORE_READY
→ remind USER
→ USER approval
→ first Cloud implementation Work Order
```

原則：

**不是所有 UI 與功能都要先完成，而是會凍結文件格式、object identity、ownership、hierarchy、serialization 的核心資料模型要先穩。**

---

## 5. 目前進度

### 已接受

`INK-CLOUD-001 — INK/Penpot Architecture Gap Audit v0.1`

結論：

- INK 保持產品／架構核心；
- Penpot 只作 reference；
- 主要缺口在 editor object / interaction layer 與之後的 cloud persistence adapter。

報告：

`research/INK_CLOUD_EDITOR_PENPOT_GAP_AUDIT_v0.1.md`

---

`INK-CLOUD-002 — Frame + Nested Hierarchy Foundation v0.1`

狀態：

```text
SOURCE_REVIEW_PASS
RUNTIME_QA_DEFERRED
PROMOTED_TO_MAIN
```

promotion commit：

`7c03793ce7d289d0a1ecf1fafe3602aa9eedff13`

已建立：

- native Frame/container；
- nested hierarchy；
- stable ownership / IDs；
- local/world transform；
- same-Layer world-preserving reparent；
- nested spatial / selection foundation；
- serialization / migration / structural SVG foundation。

報告：

`research/INK_FRAME_NESTED_HIERARCHY_IMPLEMENTATION_REPORT_v0.1.md`

### 目前進行中

`INK-CLOUD-003 — Container / Ownership / Structural Semantics Foundation v0.1`

DEV branch：

`work/ink-cloud-003`

目前目標：

- Frame / Group / Repeat 結構角色邊界；
- deterministic ownership invariants；
- Group-in-Frame / Frame-in-Group；
- inherited `effectiveVisible / effectiveLocked / effectiveOpacity`；
- structural / render / hit-test z-order contract；
- migration / integrity / serialization consistency。

**即時 DEV 進度必須讀：**

`work/ink-cloud-003:ACTIVE/INK_DEV_PROGRESS.md`

不要以 main 上的 progress 副本判斷目前 DEV 做到哪裡。

### Runtime QA 狀態

目前 GitHub Actions quota 已用盡：

```text
GITHUB_ACTIONS = QUOTA_EXHAUSTED
RUNTIME_QA = DEFERRED
SOURCE_STATIC_QA = REQUIRED
```

因此當前任務以 source/static/unit/serialization evidence 為主。

任何未做的 browser/runtime 驗證必須明確記為：

`RUNTIME_QA_DEFERRED`

不得因此宣稱 Runtime-verified、certified 或完成 package promotion。

---

## 6. Cloud Start Gate

Cloud 不會因前置工作「看起來完成」而自動開始。

固定 gate：

```text
structural-core stabilization
→ MR = PRE_CLOUD_CORE_READY
→ USER_REMINDER_REQUIRED
→ USER_APPROVAL_REQUIRED
→ FIRST_CLOUD_WORK_ORDER
```

權威規則見：

`governance/INK_Product_Delivery_Model_v0.1.md`

在 USER 明確同意以前：

- DEV 不得自行開始 Cloud；
- WORK 不得自行開始 Cloud；
- MR 不得直接跳過提醒 gate。

---

## 7. GitHub SSOT 文件地圖

| 目的 | 權威文件 |
|---|---|
| Repository 起點／角色導航 | `README.md` |
| Agent 固定契約 | `AGENTS.md` |
| Active 文件入口 | `ACTIVE/README.md` |
| 唯一當前任務 | `ACTIVE/INK_CURRENT_WORK_ORDER.md` |
| 跨視窗 checkpoint | `working/WORKING_STATUS.md` |
| DEV 即時進度 | 指定 work branch 的 `ACTIVE/INK_DEV_PROGRESS.md` |
| DEV 新視窗啟動 | `ACTIVE/INK_DEV_NEW_WINDOW_START.md` |
| MR review 狀態 | `ACTIVE/INK_REVIEW_STATUS.md` |
| MR findings | `ACTIVE/INK_REVIEW_FINDINGS.md` |
| MR evidence | `ACTIVE/INK_REVIEW_EVIDENCE.md` |
| MR / DEV 治理 | `governance/INK_MR_DEV_GOVERNANCE_v0.1.md` |
| 跨視窗 handoff | `governance/INK_DEVELOPMENT_CHAT_HANDOFF.md` |
| 兩種 delivery 總方向 | `governance/INK_Product_Delivery_Model_v0.1.md` |
| Packaging 規範 | `governance/INK_GitHub_Fast_Packaging_Standard.md` |

---

## 8. 原始工程基線

原始來源：

`INK_v1.6.5_RC_MAIN.zip`

- ZIP bytes: `60406367`
- SHA256: `59d43a9650f4de20863e21723344b0fbf4307d5cbdb4a1a402929008d2f9e97d`
- ZIP file entries（不含目錄）: `1471`
- 解壓總 bytes: `215908955`

原始 ZIP 身份以 SHA256 固定。

整理、重構或 promotion 後的內容不得再宣稱等同 original baseline。

原始匯入與分類歷史：

- `governance/INK_Original_Import_Baseline.md`
- `governance/INK_Product_Boundary_v0.1.md`
- `governance/INK_File_Classification_v0.1.md`

---

## 9. 目前可下載的 Modular Package

目前固定 package branch：

`package/ink-current`

GitHub branch ZIP：

`https://github.com/thedoorw/INK-Browser-QA/archive/refs/heads/package/ink-current.zip`

Packaging 採 exact Git object reuse，不需要把 packaging 擴張成 PR merge、GitHub Actions、runner 或 Artifact。

目前這個 package：

**是方便下載的 modular package，不是 certified baseline。**

正式 packaging 規則：

`governance/INK_GitHub_Fast_Packaging_Standard.md`

---

## 10. 最短恢復規則

如果新視窗只知道一句話：

### 你是 MR

讀：

```text
README
→ Current Work Order
→ Working Status
→ Review Status
→ DEV branch progress + exact HEAD
→ review / issue next gate
```

### 你是 DEV

讀：

```text
README
→ Current Work Order
→ Working Status
→ assigned branch DEV Progress
→ implement only authorized scope
→ commit checkpoints
→ DEV_HANDOFF
→ STOP
```

只要 GitHub SSOT 還在，就不需要依賴前一個聊天視窗才能繼續 INK。
