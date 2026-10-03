# C019 Text Warp / Curved Text Render Integration — Authority closure — 2026-10-03

STATUS = CLOSED / ACCEPTED / MERGED / DEPLOYED / FORMAL LIVE QUALIFIED

## Identity

- PR #152
- DEV exact browser-qualified candidate: `35872e4f498950c58d47aac64f8e515967b081e9`
- DEV candidate run: `37113470082`
- DEV artifact: `11270487286`
- DEV digest: `sha256:26953eb734742959d361cd849e210290f399a77d2f987e5e554cb865054bb245`
- Integrated/deployed source: `ff6e329e372a0b3c8b756cd74cc881b28fa404f9`
- Live deploy commit: `b94d5fb3bb6202ca1e833b28511fbe0fd7628fe2`
- Pages run: `37114135019`
- Formal Live request: `c019-text-path-formal-live-001`
- Formal Live request commit: `205bb40fd5156cc1528a10286eb45dd9b07b8044`
- Formal Live run: `37114248495`
- Formal Live artifact: `11270837984`
- Formal Live digest: `sha256:1560ade23bd38e5bcf06d14609488c1d2be4fa0647bb0f13b5a4c6f0577f7392`
- Live closure commit: `f43da5c039e4924f19752410d7a22f88b7c75cee`

## Accepted capability

C019 closes one truthful native editable curved/path Text route.

- native Text remains `type:'text'`;
- native Path remains independently editable with stable identity;
- existing `pathText` descriptor is consumed by the formal Renderer through existing `layoutTextOnPath()`;
- bounded CHAT mutation is `text.path.set.v1`;
- proposal → approval → execute, target/path stale guards and scoped History remain authoritative;
- no Text-to-Path conversion, raster completion shortcut, pointer emulation or second Text/Path/Renderer/History authority.

## Candidate evidence

Exact candidate browser QA passed 30/30 focused tests plus B4 Path deformation, A2 Stroke and B2 raster-stack regressions. It proved visible straight→curved Renderer delta, native Text editability after attachment, Path-warp follow-through, exact Undo/Redo, persistence at FORMAT_VERSION 4 and negative guards.

## Formal Live evidence

Runtime loaded exact integrated source `ff6e329e372a0b3c8b756cd74cc881b28fa404f9`, `apiReady=true`, 23 named tools, document `formatVersion=4`.

Observed Preview render fingerprints:

- straight: `fnv1a32:3fe352d9`;
- curved: `fnv1a32:bb44ec56`;
- Undo relation: exact straight `fnv1a32:3fe352d9`;
- Redo relation: exact curved `fnv1a32:bb44ec56`;
- post-curve text edit: `fnv1a32:b3bc290e`;
- after native Path warp: `fnv1a32:365fc482`.

History recorded `CHAT set Text Path`, `CHAT edit Text` and `CHAT warp Path`. Final inspection retained editable native Text plus native Path. The same integrated Live source also passed a C4 `page.artboard.set.v1` regression with `調整畫板` History and Undo.

## Boundary

Broad Text envelope deformation / general `text.warp.v1` is not claimed. Cluster D remains independently owned until its final exact candidate + evidence return. UI PR #109, PWA, C06 and New Document remain separate. B3 and advanced mutable raster ingest remain closed.

```text
C019_CURVED_PATH_TEXT = CLOSED / FORMAL LIVE QUALIFIED
TEXT_REMAINS_NATIVE_EDITABLE = TRUE
PATH_ID_STABLE = TRUE
BROAD_TEXT_WARP_ENVELOPE = NOT_CLAIMED
C4_REGRESSION = PASS
FORMAT_VERSION = 4 / UNCHANGED
NEXT = REVIEW CLUSTER D DEV RETURN WHEN PRESENT
```
