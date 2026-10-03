# A3 Paper exposure — Live MR source / candidate review

Candidate: `1afb52a9c6fc77f5f121f5b7e8d9be2c626006be`; PR #128. Classification: EXPOSURE_GAP.

Reviewed product delta is limited to the bounded edit operation and capability descriptor. `page.paper.set.v1` validates one scalar field, captures active page + paper state, and calls the existing `InkApp.changePaper()`. Native page.paper, History pushScoped, cache invalidation, Renderer, Preview and document format are reused. No duplicate native authority or pointer simulation. No UI/Core/FORMAT_VERSION change.

Exact candidate browser `clusterA-A3-paper-candidate-002` PASS; run 37084799981, artifact 11260442131. Two adjacent native Brush/DryBrush strokes reach the existing WebGL2 multichannel run. Roughness .42→.95 and absorbency .58→.05 are stored; transparent Preview `a108acca→cb5efcee`; Undo/Redo restore exact native paper and Preview. Stroke data unchanged; two scoped native `調整畫布` entries. Five invalid cases, no-op, stale paper and pending interactive preview rejected. Candidate screenshot inspected: both strokes visible.

Local existing bounded-edit core suite: 8/8 PASS. A3 descriptor normalization: PASS. Historical Connector-003 suite: six failures on candidate and identical six failures on base (outdated tool count / path-create example / incomplete mock Document); these are existing QA debt, not A3 regression, and are not represented as PASS.

Explicit limitations / next separate issues:
- First single-stroke candidate probe failed with NATURAL_PAPER_RENDER_NO_DELTA. Existing drawLayerObjects requires 2+ adjacent Brush/DryBrush entries before renderStrokeRun consumes page.paper; single strokes use renderStroke, which takes no page paper. Preserve as PRODUCT_RENDER_INTEGRATION_GAP. A3 exposure does not repair it.
- In this WebGL case roughness-only Preview is unchanged. Absorbency proves the paper-coupled render delta. Source WebGL simulation does not consume roughness as a dedicated uniform, while Canvas2D paper-field resistance does. No all-fields / backend-parity PASS claimed.
- A4 Eraser and A5 Blender/Smudge remain separate.

Disposition: accept A3 bounded Paper exposure only after exact-candidate A2, A1 and B2 representative regressions pass; then merge exact head, verify complete product-source tree identity, pin the merged SHA to Live and qualify A3 there. No overall NaturalMedia/Paper completeness claim.

## Accepted checkpoint

A2 four-mode, A1 Paint Session and B2 brightnessContrast exact-candidate regressions: PASS. B2 Canvas `7883b22→9cd23fe`; Undo/Redo restore exact hashes. Complete tested product/source tree: `30d55495650acd365acc2b1e92c7669fa01f1870`.

MR disposition: ACCEPTED FOR EXACT MERGE / LIVE QUALIFICATION. Live qualification remains pending.
