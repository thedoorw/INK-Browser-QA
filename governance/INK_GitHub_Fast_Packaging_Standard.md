# INK GitHub Fast Packaging Standard

STATUS: `DURABLE_GOVERNANCE / AUTHORITATIVE_PACKAGING_STANDARD`

## 目的

INK 正式主程式打包統一採用 iCAD 已驗證的 Git-object fast packaging 模式。

正常的「幫我打包 INK／給我最新主程式 ZIP」應解讀為 Git-object assembly task，不是 build task。

## 1. Core Flow

```text
accepted / validated product source
→ reuse exact Git blobs / trees
→ create package tree
→ create package commit
→ create / update package branch
→ GitHub branch ZIP
→ STOP
```

Packaging 只建立交付入口，不修改產品內容。

## 2. Current Modular Product Package

現階段 INK 尚未整合成單一 `INK.html`，因此 package source 為：

```text
product/source/
```

必須直接重用該完整產品樹的 exact Git tree / blob objects，原樣成為 package branch 根目錄。

不得為打包而：

- rebuild
- 重新複製檔案內容
- 重新上傳相同內容
- newline normalization
- 重新產生資產
- 人工挑檔重組
- 重新產生 Runtime 檔案

目前 ZIP 是 **modular product package**，不得宣稱為最終 certified 三件式。

## 3. Fixed Package Branch and Download

固定 current package branch：

```text
package/ink-current
```

固定下載入口：

```text
https://github.com/thedoorw/INK-Browser-QA/archive/refs/heads/package/ink-current.zip
```

`package/ink-current` 只代表目前接受的可下載產品 package，不代表自動取得 certified 狀態。

## 4. Future Certified Three-piece Package

當 INK 完成真正單一 HTML 並通過正式驗證後，`package/ink-current` 的內容再收斂為：

```text
INK.html
WORKING_STATUS.md
SHA256SUMS.txt
```

切換到三件式後仍使用同一 fast path：exact Git objects → package tree → package commit → package branch → GitHub ZIP。

## 5. Preconditions

打包前只確認：

1. source identity 明確。
2. `product/source/` 為目前接受的產品來源樹。
3. package branch 重用 exact blobs / trees。
4. package branch 內容與 source tree 一致。

若 source identity、產品邊界或接受狀態不明，STOP 並先處理來源身分；不得以 build 或 Runtime 重跑代替身分確認。

## 6. Mandatory Git-object Fast Path

### Step 1 — Resolve source identity

記錄：

```text
SOURCE_COMMIT=<accepted source commit>
SOURCE_TREE_SHA=<product/source tree SHA>
SOURCE_PATH=product/source
```

### Step 2 — Reuse exact source tree

若 package 根目錄應與 `product/source/` 完全相同，package commit 應直接使用該 source tree SHA 作為 commit tree。

這是優先方式；不需要重新逐檔建立相同 blob。

### Step 3 — Create package commit

建立 package-only commit，tree 必須是上述 exact source tree。

Package commit 不修改 main、不修改 source branch、不修改產品 bytes。

### Step 4 — Create / update package branch

將：

```text
package/ink-current
```

指向新的 package commit。

若 branch 已存在，正常採可追溯的 fast-forward package commit；不得為打包改寫產品來源歷史。

### Step 5 — Verify exact tree reuse

至少確認：

```text
PACKAGE_COMMIT.tree == SOURCE_TREE_SHA
EXACT_TREE_REUSE = PASS
PRODUCT_SOURCE_MUTATION = 0
```

### Step 6 — Deliver GitHub branch ZIP

提供固定下載 URL，然後 STOP。

## 7. Prohibited Packaging Expansion

單純 packaging 本身不得觸發：

- GitHub Actions packaging workflow
- GitHub-hosted runner
- self-hosted runner
- Runtime 重跑
- Artifact upload
- PR merge
- 產品內容修改

除非 active Work Order 明確另有要求。

Runtime／QA 驗證產品；Packaging 只把已接受的產品 Git objects 組成固定下載入口。兩者不得自動綁在一起。

## 8. PR #2 / Workflow Packaging Status

原先 `Add INK main-package workflow` 的 Actions-based packaging 方案已被本標準取代。

該 PR 不應 merge；若仍 open，應標記 `superseded` 並關閉。

未來不得因單純 packaging 重新引入 Actions ZIP workflow，除非 active Work Order 明確授權。

## 9. Required Completion Report

完成後只回報：

```text
PACKAGE_STATUS
SOURCE_COMMIT
SOURCE_TREE_SHA
PACKAGE_BRANCH
PACKAGE_COMMIT
EXACT_TREE_REUSE
DOWNLOAD
STOP
```

不得把單純打包擴張成 Runtime、CI、release、certification 或產品修改工作。

## 10. Agent Decision Rule

未來遇到「幫我打包 INK／給我最新主程式 ZIP」時，正常情況優先解讀為：

```text
THIS IS A GIT-OBJECT ASSEMBLY TASK, NOT A BUILD TASK.
```

只有 active Work Order 或使用者明確要求 build、Runtime、CI、release 或產品變更時，才進入那些工作。
