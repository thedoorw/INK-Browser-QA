# INK GitHub Fast Packaging Standard

STATUS: DURABLE_GOVERNANCE
PURPOSE: 以 Git object reuse 將已存在於 GitHub 的 INK 產品樹快速封裝成可直接下載的 branch ZIP；不把打包工作擴張成 build、Runtime、PR merge、Actions 或 Artifact 工作。

## 1. 核心原則

對已存在 GitHub、產品邊界已明確的 INK source/package，正式封裝優先採：

```text
source commit / source tree
→ resolve exact Git blobs / trees
→ create package tree by exact SHA reuse
→ create package commit
→ create/update package branch
→ GitHub branch ZIP
→ STOP
```

打包只改變「交付樹與下載入口」，不得因此修改產品內容、Runtime、版本、AI、Recipe、FLORA、QA、schema 或其他產品行為。

## 2. 現階段：Modular Package

在 INK 尚未完成真正單檔 `INK.html` 前，正式可下載主程式包可以直接由 `product/source/` 的完整產品樹組成。

目前 canonical source root：

```text
product/source/
```

封裝時將此目錄下已納入目前產品 source tree 的檔案與子樹，以 exact blob/tree SHA 原樣放到 package branch 根目錄。

這表示目前 ZIP 可以是多檔／多資料夾產品包；不為了符合三件式目標而提前把模組硬塞進 HTML。

## 3. 未來：Three-piece Package

當真正單檔產品完成且通過功能驗證後，package 形式切換為：

```text
INK.html
WORKING_STATUS.md
SHA256SUMS.txt
```

此時仍沿用同一 Git-object fast path：exact blobs → package tree → package commit → package branch → GitHub ZIP。

因此從 modular package 過渡到 three-piece package，不改變使用者下載模式，只改變 package branch 內部內容。

## 4. Package Branch

### 固定最新下載入口

```text
package/ink-current
```

使用者正常只需使用：

```text
https://github.com/thedoorw/INK-Browser-QA/archive/refs/heads/package/ink-current.zip
```

`package/ink-current` 永遠指向目前被接受為可下載的 INK package commit。

### 歷史／里程碑 package

需要永久追溯時另建不可變 package branch，例如：

```text
package/ink-<version-or-milestone>
```

固定歷史 branch 不應被後續版本覆寫；`package/ink-current` 則可在新 package 通過封裝條件後移到新的 package commit。

## 5. Preconditions

建立／更新 package 前至少確認：

```text
A. source commit/tree identity 已知
B. package source path 已知
C. source tree 是本次要交付的產品邊界
D. 本次只做 packaging，不修改 source bytes
E. 若是 certified / validated 宣稱，必須已有對應驗證證據
```

若尚未 certified，可以建立「current modular package」，但文件與回報不得把它誤稱為 certified baseline。

## 6. Mandatory Fast Path

### Step 1 — Resolve exact source identity

記錄：

```text
SOURCE_COMMIT=<source commit>
SOURCE_TREE=<product tree SHA>
SOURCE_PATH=product/source
```

### Step 2 — Reuse exact Git objects

直接取得 source tree 內所有 top-level blobs/trees 的 SHA。

不得為打包而：

- 下載後重新上傳
- 重新 build
- newline normalization
- 重新產生資產
- 人工挑檔複製
- 用 ZIP 解壓／重壓來重建產品內容

### Step 3 — Create package tree

Package tree 只引用上述 exact Git objects。

現階段 modular package 的 package tree 應與接受的 `product/source/` tree 在內容上等價。

### Step 4 — Create package commit

建立 package-only commit；建議訊息：

```text
Package: <scope> INK product
```

Package commit 不修改 main 或 source branch。

### Step 5 — Create or update package branch

一般最新入口：

```text
package/ink-current
```

需要永久記錄時另外建立 versioned branch。

### Step 6 — Verify package identity

至少確認：

```text
PACKAGE_TREE_CONTENT == ACCEPTED_SOURCE_TREE_CONTENT
EXACT_BLOB_TREE_REUSE = PASS
PRODUCT_SOURCE_MUTATION = 0
```

三件式階段另確認：

```text
TREE_FILE_COUNT=3
SHA256SUMS matches INK.html
```

### Step 7 — Deliver ZIP

直接提供 GitHub branch ZIP URL，然後 STOP。

## 7. 不需要 PR Merge

Packaging 本身不需要：

```text
Pull Request
→ Merge pull request
→ GitHub Actions
→ Artifact upload
```

PR 可用於治理／source change review，但不是取得 package ZIP 的必要步驟。

## 8. 不需要 Actions / Runner

若 source bytes 已存在 GitHub，packaging 預設不得為了「做 ZIP」而啟動：

- GitHub-hosted Actions
- Windows self-hosted Runtime
- packaging workflow
- Artifact upload/download
- full Runtime rerun

GitHub branch ZIP 已足以提供確定的下載入口。

## 9. Runtime 與 Packaging 分離

Runtime 驗證的是產品；Packaging 只是把已接受的產品樹形成交付入口。

所以：

```text
新產品 bytes → 依規範驗證 Runtime / QA
相同已驗證 bytes 再打包 → 不重跑 Runtime
```

目前 modular source 尚未宣稱 certified 時，也可以建立可下載 package，但必須清楚標示其 validation status。

## 10. Required Completion Report

```text
PACKAGE_STATUS: PASS
SOURCE_COMMIT: <sha>
SOURCE_TREE: <sha>
PACKAGE_BRANCH: <branch>
PACKAGE_COMMIT: <sha>
EXACT_OBJECT_REUSE: PASS
ACTIONS_RUNS: 0
RUNNERS_USED: 0
DOWNLOAD: <GitHub branch ZIP URL>
VALIDATION_STATUS: <CURRENT_MODULAR / VALIDATED / CERTIFIED>
STOP
```

## 11. Agent Decision Rule

未來 Agent 遇到「把目前 INK 主程式包起來給我下載」時，預設理解為：

```text
THIS IS A GIT OBJECT ASSEMBLY TASK, NOT A BUILD TASK.
```

只有 source 尚未進 GitHub、產品樹不完整、身份不明或使用者明確要求新 build 時，才另行處理 build／Runtime 問題。
