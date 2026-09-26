# INK Original Import Baseline

BASELINE_ID: `INK-ORIGINAL-IMPORT-1.6.5-RC-001`

SOURCE_ARCHIVE: `INK_v1.6.5_RC_MAIN.zip`

## Immutable source identity

- archive bytes: `60406367`
- SHA256: `59d43a9650f4de20863e21723344b0fbf4307d5cbdb4a1a402929008d2f9e97d`
- ZIP file entries excluding directories: `1471`
- uncompressed bytes: `215908955`
- compressed payload bytes inside ZIP: `59882209`

這些數值用來固定原始工程現場身份。後續任何整理、搬移、刪除、重構都不得把修改後內容再稱為此 original baseline。

## Baseline policy

1. 原始工程現場優先保留可追溯性。
2. 研究與 QA 證據不因不屬於產品 Runtime 就直接刪除。
3. 明確無 Runtime / QA / research / governance / historical value 的資料，才可進入 delete candidate。
4. 大型 Validation / research evidence 的長期 Git 儲存方式另行決定，避免主產品 branch 因反覆提交大型證據而膨脹。
5. Product boundary 與正式三件式 package 由後續 Candidate 驗證建立；本 baseline 不代表 certified product。

## 已知版本語言混雜

原始工程中目前已觀察到多組版本語言，包括 `1.6.5-RC`、`1.6.5-rc.1`、歷史 PWA `1.5.1`，以及既有規格中的產品 / 工程 / format version。後續需把產品版本、工程版本、格式版本、schema version 分開治理。
