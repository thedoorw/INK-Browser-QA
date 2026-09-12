# INK Agent Contract

AI / Agent 進入本 repository 時，依下列順序讀取：

1. `README.md`
2. `AGENTS.md`
3. `governance/INK_EVOLUTION_AND_HEALTH_GOVERNANCE_v0.1.md`
4. `ACTIVE/README.md`
5. 若存在 `ACTIVE/INK_REVIEW_WORK_ORDER.md`，REVIEW 角色先讀並以它作為本輪審查範圍與 STOP RULE
6. 若存在 `ACTIVE/INK_CURRENT_WORK_ORDER.md`，DEV 角色先讀並以它作為本輪開發範圍與 STOP RULE
7. `working/WORKING_STATUS.md`
8. 只讀 current work order 明確要求的其他 governance / product / qa / research / engineering 內容

`我說.md` 用於理解使用者原文與長期意圖，但使用者原文不自動等於當前實作授權；實作與審查範圍仍以 current ACTIVE work order 為準。

## Authority order

`使用者明確指令 > current ACTIVE work order > INK_EVOLUTION_AND_HEALTH_GOVERNANCE_v0.1.md > AGENTS.md > working status / registers > 舊文件`

## 固定安全規則

- 未經明確授權，不修改正式產品行為。
- 原始 INK v1.6.5 RC 工程包的身份以 SHA256 固定，不得在整理時改寫後仍宣稱為 original baseline。
- 研究價值、QA 證據價值或歷史追溯價值不明的資料，不直接刪除；優先保留或移入 `ARCHIVE/`。
- Product、QA、R&D、Engineering、Governance 必須分線，不把大型 Validation / research evidence 當成正式產品 payload。
- 產品身份固定為 `INK v0.1`，除非使用者明確改變；不得用產品版號代替 stage / commit / run identity。
- 歷史版本、protocol/schema/component identity 不得全域改寫；`FORMAT_VERSION = 4` 與產品版號分離。
- FLORA 已屬 optional capability，不得因整理而刪除；AI / Recipe 不得因類比 FLORA 而自行 optionalize。
- 正式三件式 package 目標為 `INK.html` + `WORKING_STATUS.md` + `SHA256SUMS.txt`，但在單檔 build 與功能驗證完成前不得宣稱 Certified。
- 任何刪除必須有明確依據：無 Runtime 依賴、無 QA 證據價值、無研究價值、無治理/追溯價值。
- Health 優先於功能擴張；重大結構變更後必須有與風險相符的 regression evidence。
- Windows self-hosted Chrome/Edge Node-free Runtime 為目前 authoritative startup compatibility gate，除非 governance 另有明確更新。
- REVIEW 不得只採信 DEV 文字回報；code / graph / Runtime evidence / Git diff 優先。
- REVIEW 不得默默修 DEV code；若需修正，先形成 bounded finding 並等待授權。
- Current work order 的 STOP RULE 優先於自行延伸工作；到達工作單終態後停止，不得自行進入下一 milestone、package、certification 或 main promotion。
