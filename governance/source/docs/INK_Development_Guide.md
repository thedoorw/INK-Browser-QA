# INK 開發技術指南

## 環境

- 現代 Chromium 瀏覽器。
- Node.js 用於 build、typecheck 與 tests。
- 主程式仍可使用 `index-standalone.html` 直接開啟。

## 常用指令

```bash
npm run build
npm run typecheck
npm run test:ready
npm test
npm run start:local
```

## 修改流程

1. 先確認唯一父基線與 `VERSION.json`。
2. 只修改本工作包指定模組。
3. 新操作必須接入 Undo／Redo 與保存模型。
4. 使用者可見參數必須有 UI，不可只存在於 Recipe。
5. 新增 Action 時，同步更新 schema、validator、dispatcher 與測試。
6. 新增繪畫能力時，分別驗證手動 UI 操作與 AI Action 操作。
7. 生成前後需執行 build、typecheck、focused tests、package checksum。

## 禁止事項

- 不以文件宣稱代替 Runtime 證據。
- 不以 metadata 存在代替實際接線。
- 不因 FLORA Recipe 支援某參數，就判定人工手繪 UI 已支援。
- 不把視覺 FAIL 工作包升為主程式視覺基線。

## 下一階段建議分線

- Track A：INK 手繪＋筆刷＋濾鏡完整度。
- Track B：AI Action／Recipe 繪畫操作能力。

兩線使用同一核心，但分開驗收。
