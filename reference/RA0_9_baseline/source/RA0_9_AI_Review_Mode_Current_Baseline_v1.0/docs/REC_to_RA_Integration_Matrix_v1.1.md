# REC → RA Integration Matrix

版本：v1.1  
REC 審計基線：`REC_v0.8.x_主程式_真實操作閉環整合候選版.zip`  
RA 當前基線：`RA6.6 Geometry Measurement Tools`

---

## 1. 最終結論

REC 不再作獨立開發主線。RA 是唯一 Geometry Brain、Candidate／Gate／Scoring、Semantic Authoring、Compiler 與 Runtime QA 核心。

REC 的成熟工作台概念已於 RA6.4–6.6 重新實作或吸收；REC 主程式可以從日常專案知識庫刪除，本矩陣保留為歷史整合證據。

## 2. 已吸收／重新實作

| REC 能力 | RA 落點 | 狀態 |
|---|---|---|
| Side-by-side／Overlay／Wipe／Difference | RA6.4 Compare Workspace | 已完成 |
| 同步 Zoom／Pan | RA6.4 shared viewport | 已完成 |
| Object Isolation／Cross-view Trace | RA6.4 Authoring Tree／Trace | 已完成 |
| Evidence State Filter | RA6.4 Evidence Filter | 已完成 |
| 集中狀態與 provenance | RA6.4 Workbench State | 已完成 |
| Raw Boundary Evidence | RA6.5 Boundary Capture Workspace | 重新實作完成 |
| stable contour ID／fingerprint | RA6.5 | 已完成 |
| contour isolation／group／trace | RA6.5 | 已完成 |
| LINE／ARC／CIRCLE measurement seed | RA6.5–6.6 | 已完成 |
| contour span／parallel／tangent／spacing | RA6.6 | 已完成 |
| Canonical／Variant／deterministic QA 概念 | RA regression contracts | 已吸收 |

所有 Raw Contour 仍固定為 Evidence-only，不可 Formal Promote。

## 3. 刻意不吸收

- `findContours / segmentation / contour polygon → Formal Recipe`
- measured contour 直接通過舊 Recipe eligibility
- PosterLad 特定名稱、色彩、座標或案例 ID 控制通用核心
- 未驗證的 Offset Stroke Engine
- 只有 G0 的 Spline continuity 骨架
- 未驗證的 Constraint Solver、Z-order Solver、Clip／Mask 骨架
- 模組存在或像素 IoU 高即宣稱完成

## 4. 尚待在 RA 原生完成

| 領域 | 正確 RA 路線 | 預定階段 |
|---|---|---|
| Semantic Boundary | split／merge、outer／hole／island、gap／occlusion | RA6.7 |
| AI Review Queue | 所有自動／半自動結果必須經 AI 確認 | RA6.7 |
| Shared Parameters | concentric、equal radius、pitch、axis | 後續 |
| Generator | Offset／Array／Mirror／Radius Sequence | 後續 |
| Dependency／Local Recompute | transaction、invalidation、recompile | 後續 |
| Compound Offset | mixed LINE／ARC／SPLINE G0/G1/G2 continuity | PL-036 階段 |
| Weave Topology | crossing、over／under、mask、draw order | PL-055 階段 |

這些不得從 REC 未驗證骨架直接宣稱完成。

## 5. 知識庫處置

可從日常知識庫移除：

- REC 主程式 ZIP
- REC 舊規格、舊 QA、中間交接包
- REC 重複 corpus manifest 與歷史 recipe 包

保留：

- 本文件 `REC_to_RA_Integration_Matrix_v1.1.md`

可在本機另行封存 REC ZIP，以備歷史追溯，但不得再作 RA 開發基線。
