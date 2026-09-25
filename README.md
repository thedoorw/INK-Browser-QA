# INK Browser QA

INK 是一個以同一套 shared core 為基礎、同時朝 **可攜版** 與 **雲端版** 發展的圖像／設計編輯器專案。

這個 repository 是 INK 的 GitHub SSOT（Single Source of Truth）。

任何新 CHAT／DEV／MR 視窗都不應依賴先前聊天記憶來恢復工作；只要知道自己的角色，從本 README 指定的文件順序即可接續。

---

## 1. 先確認你的角色

INK 目前採兩條協調中的開發線：

```text
                         USER
                           │
             ┌─────────────┴─────────────┐
             │                           │
      MR — Main Review              UR — UI Review
      技術／Core 主線                UI 專責線
             │                           │
            DEV                         UI DEV
             │                           │
       DEV_HANDOFF                 DEV_HANDOFF
             │                           │
         MR REVIEW                   UR REVIEW
             │                           │
     Core / integration        reconcile + integrate main
             │                           │
             └─────────────┬─────────────┘
                           ↓
                       ONE INK MAIN
```

UR 的存在是為了讓 MR 可以持續推進 INK 技術／Core，同時 UI 由專責 Review 從規劃、開發、健康度、整合到 main 上的最終效果負責到底。

### MR — Main Review

MR 是技術／Core 主治理者，負責：

- 產品技術方向與階段規劃；
- Core / Renderer / Document / History / Revision / Geometry / CHAT / persistence 等 authority；
- MR-owned bounded Work Order；
- 技術 DEV branch、scope / gate、review；
- `MR_PASS / MR_REVISE / MR_HOLD`；
- 跨 UI/Core 整合與 UR escalation；
- FORMAT_VERSION、product version、package／certification 等全域 authority；
- 在 Cloud Start Gate 成立時，提醒 USER 並等待明確同意。

MR 不再作為日常 UI 視覺／UI 健康的最後一道隱性 QA。只要工作仍是 UI-only，該責任屬於 UR。

### UR — UI Review

UR 是 USER 授權的 UI end-to-end authority。

只要不需要修改 frozen Core／全域 authority，UR 負責：

- UI workpack、量測、功能歸位與 bounded UI Work Order；
- UI DEV supervision 與 `UI_PASS / UI_REVISE / UI_HOLD`；
- UI technical-debt / health guardrails；
- UI source/static QA、Runtime、截圖與 interaction evidence；
- 將 reviewed UI payload 與最新 `main` reconcile；
- UI-only clean promotion 到 `main`；
- 在整合後的 exact main SHA 上再次驗證 UI；
- 只有 main 上的 UI 實際通過後，才可宣告 UI closure。

`UI_BRANCH_PASS != UI_COMPLETE`

`UI_COMPLETE = VERIFIED_ON_CURRENT_MAIN`

若 UI 工作需要改 Renderer / Document / History / Revision / Geometry / CHAT / persistence / Core contracts / FORMAT_VERSION / product version 等，UR 必須 `STOP → MR / INTEGRATION_REQUIRED`。

UI 健康規範：

`governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`

完整權責：

`governance/INK_MR_DEV_GOVERNANCE_v0.1.md`

### DEV

DEV 負責：

- 先讀 Current Work Order；
- 只在 Work Order 指定 branch 工作；
- 只實作明確授權的 bounded scope；
- 持續 commit meaningful checkpoints；
- 持續更新 branch-local `ACTIVE/INK_DEV_PROGRESS.md`；
- 保留 source / QA / report evidence；
- 完成後 `DEV_HANDOFF` 並 STOP；MR-owned task 等 MR，UI-owned task 等 UR。

DEV 不得自行：

- merge `main`；
- 更新 `package/ink-current`；
- 發版／certify；
- 升 `FORMAT_VERSION`（除非 Work Order 先授權）；
- 擴大 FLORA / AI / Recipe product boundary；
- 未經所屬 Review authority（MR 或 UR）授權開始下一張任務；
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

### UR 再讀

1. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
2. `governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`
3. 當前 UI program / workpack
4. dedicated UI branch 的 branch-local Work Order 與 `ACTIVE/INK_DEV_PROGRESS.md`
5. 最新 `main` 與待整合 UI branch exact HEAD
6. UI evidence / screenshots / health delta

UR 的 UI closure 必須以整合後的 current main 為準，不以 branch-only evidence 代替。

### DEV 再讀

1. `ACTIVE/INK_DEV_NEW_WINDOW_START.md`
2. **Current Work Order 指定 DEV branch 上的**
   `ACTIVE/INK_DEV_PROGRESS.md`
3. `governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`
4. Current Work Order 明確要求的其他文件

重要：

> DEV 活動期間，真正的即時 DEV 進度在 **指定 work branch** 上的 `ACTIVE/INK_DEV_PROGRESS.md`。
> main 上同名檔案可能只是任務初始化／前一 checkpoint，不得用它取代 branch-local progress。

### 任務授權來源

全域／MR-owned 任務的 authority：

`main:ACTIVE/INK_CURRENT_WORK_ORDER.md`

在已獲 USER／MR 授權的 UI program 內，UR 可在 dedicated UI branch 建立 branch-local：

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

它只對該 UI branch 與該 bounded UI task 有效，不得授權 Core／跨 lane 工作。

其他 README、board、progress、research 文件都不能自行擴張任務 authority。

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


## 3A. INK naming and synchronized-delivery rule

User-authoritative product rule:

```text
DEFAULT_PRODUCT_NAME = INK
PORTABLE_WEB_AND_CLOUD = ONE_SHARED_PRODUCT
CORE_CAPABILITIES = SYNCHRONIZED
PRIMARY_WORKSTATION_UI = SYNCHRONIZED
DISCUSSION_DEFAULT = SAY "INK" WITHOUT FORCING DELIVERY QUALIFIERS
```

From this point forward, ordinary product discussion does not need to distinguish between Portable/Web INK and INK Cloud unless the distinction materially affects delivery behavior.

When the user says `INK`, interpret it as the shared product built on the same authoritative editor/document/core capability set.

Default development rule:

```text
shared editor capability changes
→ update shared INK core/editor domain
→ Portable/Web and Cloud consume the same accepted capability
```

The two delivery forms must stay synchronized for:

- document model;
- vector / geometry / path editing;
- selection / transform / composition;
- paint / material behavior;
- History / Revision;
- CHAT collaboration contracts;
- Creative Intelligence capabilities;
- primary workstation interaction model and principal UI structure.

Allowed delivery-specific differences are limited to adapter/service concerns such as:

- local/offline vs remote persistence;
- account/session;
- sync;
- collaboration transport;
- presence;
- optional hosted services;
- packaging/archive concerns.

These differences do not make them separate products and must not create a divergent editor core or a second workstation architecture.

Because the Cloud delivery is expected to be the more frequently used form for convenience and CHAT collaboration, product discussion may naturally focus on Cloud usage without changing the rule that core/editor improvements belong to shared INK and should remain available to both delivery forms.


## 3B. CHAT complete-use and operation-record rule

User-authoritative collaboration rule:

```text
CHAT_COLLABORATION_BASELINE = CHAT_CAN_FULLY_USE_INK
CHAT_OPERATION_PATH = AUTHORITATIVE_INK_COMMANDS_ONLY
CHAT_OPERATION_RECORD = REQUIRED
CHAT_BYPASS_OF_INK_AUTHORITY = PROHIBITED
```

The minimum condition for true USER + CHAT collaboration is not merely that CHAT can inspect, discuss, or propose changes.

CHAT must be able to use the actual INK workstation capabilities through the same authoritative command / engine paths that the human-facing UI uses, and every meaningful CHAT-initiated operation must leave a traceable operation record.

Required collaboration model:

```text
USER / CHAT intent
→ authoritative INK command or tool path
→ validation / proposal where required
→ user approval where required
→ INK execution
→ History / operation record
→ Revision / provenance linkage where applicable
→ inspectable result
```

At minimum, the operation record must make it possible to determine:

- what CHAT attempted to do;
- which document/object/region was targeted;
- which authoritative INK command/tool was used;
- whether the action was read-only, proposed, approved, rejected, executed, failed, rolled back or restored;
- what parameters were used;
- what History entry was created where applicable;
- what Revision/provenance relationship was created where applicable;
- what the resulting document state or result identity was.

CHAT must not achieve an edit by directly rewriting document JSON, bypassing History, bypassing Revision, or using a parallel hidden editor authority.

The next collaboration-validation stage must therefore prove not only that CHAT can read INK, but that CHAT can complete an end-to-end INK workflow while producing an auditable operation trail.

Target validation flow:

```text
CHAT
→ Reference
→ Extract
→ Path
→ Edit
→ Compose
→ Repaint
→ Compare / Review
→ Revision
→ further bounded correction
→ final inspectable artwork state
+
complete operation record
```

This is the minimum product condition for calling INK a real human-AI collaborative drawing workstation.

## 3C. CHAT-first tool development principle

### Why this principle exists

This direction came from the first serious creative-loop validation after the INK core/creative foundations were believed ready enough to test as a working drawing system. The Reference → Color + Line → CHAT workflow exposed that having engine capabilities was not sufficient: CHAT still needed a mature, discoverable, inspectable and auditable way to operate INK.

The project therefore paused further drawing-validation expansion and compared the same workflow against mature CHAT-operable systems:

```text
existing INK capabilities
→ first end-to-end drawing test exposes CHAT operation gap
→ pause isolated feature-by-feature validation
→ study Figma / Penpot / Adobe operating grammar
→ reuse familiar connector vocabulary and routing patterns
→ build INK connector foundation
→ return to the original creative closed-loop test
```

This causal chain is part of the reason the project prefers mature-workflow reuse over teaching CHAT a bespoke INK interaction model from zero.


User-authoritative development principle:

```text
CHAT_FIRST_TOOL_DEVELOPMENT = REQUIRED
CHAT_OPERABILITY = FIRST_CLASS_PRODUCT_REQUIREMENT
MATURE_WORKFLOW_REUSE = PREFERRED
EXTERNAL_TOOL_ORCHESTRATION = ALLOWED_AND_ENCOURAGED
BESPOKE_RETRAINING_FROM_ZERO = AVOID_WHEN_A_MATURE_PATTERN_EXISTS
INK_RETURN_TO_EDITABLE_STRUCTURE = REQUIRED_WHEN_INK_IS_THE_DESTINATION
```

INK is not designed as a drawing application that later receives a CHAT integration.

INK should be designed from the beginning as a **CHAT-native workstation**.

For every new capability, design work must answer both the human-facing and CHAT-facing path:

```text
How does the human use it?
How does CHAT discover that the capability exists?
How does CHAT identify the correct target?
How does CHAT invoke the capability?
How does CHAT receive structured evidence of the result?
How does CHAT visually verify the result where needed?
How does CHAT make a bounded correction?
How is the operation recorded in History / Revision / provenance?
```

### Mature-tool-first rule

Before inventing a new interaction model or teaching CHAT a bespoke operation path, first ask:

> **CHAT 已經在哪些成熟工具中學會這件事？**

Current reference systems include, but are not limited to:

```text
Figma
= programmable native-object / design-system workflow

Penpot
= plugin-API / execute-code workflow

Adobe
= capability routing
  + specialized creative tools
  + asset/result handles
  + selection/mask targeting
  + preview verification
  + template/library reuse
```

The preferred development sequence is:

```text
1. identify a mature CHAT-operable workflow
2. reuse its vocabulary / API grammar / routing pattern where appropriate
3. connect existing mature external capability instead of rebuilding it unnecessarily
4. build custom capability only where INK needs real differentiation
5. keep INK's own Document / History / Revision / Geometry authorities intact
6. make external results return to an editable INK structure when INK is the destination
```

### External tools are an ability pool, not competitors

Figma, Penpot, Adobe and future mature tools are not only architecture references.

They may also be selected by CHAT as the most suitable working environment for part of a creative task:

```text
USER intent
→ CHAT evaluates available workflows
→ choose INK / Figma / Penpot / Adobe / another mature tool
→ perform the part of the task where that tool is strongest
→ return the result to INK when continued INK editing / composition / provenance is required
```

Therefore INK does not need to reproduce every mature capability found elsewhere.

A high-value INK capability may instead be:

```text
understand external result
→ import it
→ convert it to stable editable INK structure
→ continue operating through CHAT
→ preserve History / Revision / provenance
```

### Development pattern change

Avoid the old pattern:

```text
invent feature
→ build engine
→ build UI
→ later teach CHAT how to use it
```

Prefer:

```text
inspect what CHAT already knows
→ identify mature external workflow
→ reuse known vocabulary / connector grammar
→ design the native INK authority
→ expose CHAT-operable entry points from the start
→ validate through structural evidence + visual feedback
```

This principle applies beyond INK.

For future user-created tools and projects, the default starting question should be:

> **先找 CHAT 已熟悉的成熟工作流，再決定哪些部分值得自己開發。**

This is intended to reduce repeated integration cost, shorten the time needed for CHAT to become fluent in a new tool, and concentrate custom development on capabilities that are genuinely unique or strategically important.


---

## 3D. CHAT ↔ Tool visual / asset round-trip rule

User-authoritative cross-tool direction:

```text
EVERY_USER_TOOL ↔ CHAT ↔ COMPATIBLE_TOOL
VISUAL_CAPTURE = STANDARDIZED
ASSET_HANDLE + METADATA = PREFERRED
EDITABLE_RETURN = PREFERRED
PROVENANCE / REVISION LINKAGE = PRESERVED
```

INK 及未來使用者自製工具，都應共用一致的畫面與資產往返概念，而不是每一套工具重新發明一套傳圖方式。

標準交換範圍至少包含：

```text
APP_FULL
VIEWPORT
CANVAS_ONLY
PANEL
EVIDENCE_SET

PNG / JPG
SVG
JSON / Recipe / Geometry
preview + asset/output handle + metadata
```

長期目標：

```text
Tool A
→ capture / export / handle
→ CHAT inspect / reason / modify / route
→ same tool or Tool B
→ editable continuation
→ History / Revision / provenance where applicable
```

CHAT 應逐步成為 Visual / Asset Router。

正式完整規格：

`research/CHAT_TOOL_VISUAL_ASSET_INTERCHANGE_STANDARD_v0.1.md`

此原則是跨工具產品方向，不會自行授權新的 DEV 工作；任何 external transport、跨工具自動執行、upload/download、schema 或 persistence 實作，仍必須經 bounded Work Order 授權。

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

### Runtime QA 標準流程

Runtime 的既有可執行基線：

`.github/workflows/ink-v0.1-runtime-baseline.yml`

其中正式 Windows runner labels 為：

```yaml
runs-on: [self-hosted, Windows, X64]
```

GitHub-hosted Actions 與 Windows self-hosted runner 是兩個不同資源。

```text
GitHub-hosted Actions quota exhausted
≠
self-hosted Windows runner unavailable
```

因此 Runtime QA 的標準決策順序固定如下：

```text
1. 一般情況
   → 可使用既定 GitHub Actions / Runtime workflow

2. GitHub-hosted Actions 額度用盡
   → 不直接標記 RUNTIME_QA_DEFERRED
   → 改用既有 Windows self-hosted runner

3. Windows self-hosted runner
   C:\actions-runner-ink
   → .\run.cmd
   → 確認 Connected to GitHub
   → 確認 Listening for Jobs
   → workflow 指定 [self-hosted, Windows, X64]
   → 執行 bounded browser/runtime QA
   → 保存實際 runtime evidence

4. 只有 self-hosted runner 也無法執行，
   或 Work Order 明確允許延後時
   → 才可標記 RUNTIME_QA_DEFERRED
```

目前這台 Windows runner 的已驗證基線：

```text
RUNNER_PATH = C:\actions-runner-ink
RUNNER_VERSION = 2.337.0
RUNNER_LABELS = self-hosted / Windows / X64
POWERSHELL = 5.1
CHROME = AVAILABLE
```

對新的 Work Order，應沿用上述 self-hosted runtime 路徑；若產品目標已從舊 reconstructed/original runtime 改為目前 `product/source`，可以建立 task-specific bounded workflow，但不得重新發明另一套 runtime 基礎設施。

只有實際未執行的 browser/runtime 驗證才標記：

`RUNTIME_QA_DEFERRED`

不得把「GitHub-hosted quota exhausted」本身當成 deferred 的充分理由，也不得在沒有 runtime evidence 時宣稱 Runtime-verified、certified 或完成 package promotion。

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
