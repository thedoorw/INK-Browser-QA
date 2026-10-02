# INK Live Test / Deployment Handoff

This is a durable cross-window handoff for the INK live-test lane. It intentionally does not encode current progress, current version, or a fixed source SHA.

## Repositories

- Development / product SSOT: `thedoorw/INK-Browser-QA`
- Live-test deployment mirror: `thedoorw/INK`
- Live test URL: `https://thedoorw.github.io/INK/`

The live-test mirror is a separate repository, not a development branch. Treat it as the deployed test surface only.

## New-window short instruction

```text
你是 INK Live Test / Deployment。

GitHub 是唯一 SSOT。

Source / development repo:
thedoorw/INK-Browser-QA

Live-test repo:
thedoorw/INK

Live URL:
https://thedoorw.github.io/INK/

先讀：
- INK-Browser-QA/README.md
- INK-Browser-QA/INK_LIVE_TEST_HANDOFF.md
- INK-Browser-QA/ACTIVE/INK_CURRENT_WORK_ORDER.md
- INK/BUILD_INFO.json
- INK/TEST_PLAN.md
- INK/CASE_SWEEP.md
- INK/TEST_FINDINGS.md

任務：
INK 是設計給 CHAT 操作。Live 網頁是 Runtime / Preview surface，不是要求 CHAT 用滑鼠模仿人類操作。主要測試路徑必須走 INK Public Creative API / named tools（runtime: `window.INK_APP.inkPublicApi`）。

持續執行 INK Live 測試、記錄問題、重現與分類。先做 breadth-first case sweep：每個成熟作品案例只快速測它最有辨識度的功能，不先完成整件作品；掃完一輪後集中修缺陷，再做第二輪組合測試，最後才做完整作品。需要產品修正時，只在 INK-Browser-QA 依目前治理規則做 bounded 修正與驗證；通過後選定 exact source SHA 發布到 thedoorw/INK，更新 BUILD_INFO.json，再對 Live URL 重測。

規則：
- 不直接在 thedoorw/INK 修主程式。
- 不把「最新 main」自動視為可發布版本。
- 每次發布都必須可追溯到 exact source SHA。
- Live 發現與重測結果記在 thedoorw/INK/TEST_FINDINGS.md。
- 產品修正、evidence、review 與 source authority 留在 INK-Browser-QA。
- 遇到 Core / FORMAT_VERSION / 大型 UI 或架構邊界，遵守當下 ACTIVE Work Order / Supervisor gate，不自行越權。
- 不依賴本指令中的任何進度、版本或舊 SHA；每次都從 GitHub 重新讀取目前狀態。
```

## Durable loop

```text
Live test
→ record exact deployed identity + finding
→ reproduce / classify
→ repair in INK-Browser-QA only
→ focused QA / required review
→ select exact accepted source SHA
→ publish to thedoorw/INK
→ update BUILD_INFO.json
→ rerun Live test
→ close or continue finding
```

## Repository boundary

`thedoorw/INK` may contain deployment wrapper files, deployment identity, test plan, and findings. It must not become a second product-development source of truth.

All product-source changes originate in `thedoorw/INK-Browser-QA`.
