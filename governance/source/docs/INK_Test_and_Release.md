# INK 測試與發行

## 最低驗證

```bash
npm run build
npm run typecheck
npm run test:ready
```

## 完整驗證

```bash
npm test
```

完整測試若超過環境時限，報告必須列明完成數、最後完成項目與未完成項目，不得宣稱全通過。

## 手動測試

- 直接開啟 `index-standalone.html`。
- 新增筆畫、切換工具、Undo／Redo。
- 保存並重開文件。
- 輸出 PNG。
- 在手機與 MPP 筆電實機測試 Pointer／pressure／tilt。

## 發行封裝

- 更新 `VERSION.json`。
- 重建 `CHECKSUMS_SHA256.txt`。
- 產生 ZIP 外部 SHA-256。
- 不包含未確認的候選圖或過時 Runtime Evidence。
