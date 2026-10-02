# INK C04 圖紙 / 手繪板 Two-State Repair — DEV Dispatch v1.0

STATUS: QUEUED / BLOCKED UNTIL UI RECOVERY CANDIDATE ACCEPTED
DATE: 2026-10-02
REPOSITORY: thedoorw/INK-Browser-QA
SSOT: GitHub

## Purpose

Repair the existing C04 workspace state authority so the visible `圖紙 / 手繪板` switch controls two real states.

This is not a UI-placement task. The UI recovery package restores the already accepted switch placement first.

Terminology:
- 圖紙 = Layout / page-oriented document view
- 手繪板 = Creation / freehand drawing workspace

## Known current defect

Current main contains:
```js
switchWorkspace(next, ...){
  ...
  if(next==='creation') next='layout';
  ...
}
```

Prior evidence also shows document refresh/state normalization forces the active document back to `layout`.

The repair must remove the forced one-state behavior through the existing C04 authority. Do not add a parallel workspace variable or UI-only workaround.

## Entry gate

Start only after Supervisor accepts the fresh UI recovery candidate.

Create a fresh C04 branch from that accepted recovery candidate, not from the old post-SUP11 branch.

Suggested branch:
`work/c04-paper-freehand-two-state-repair-001`

## Required investigation before mutation

Trace one state chain:
```text
workspace switch click
→ InkApp.switchWorkspace()
→ activateWorkspace / ensureWorkspace / workspaceSpace
→ page workspace state
→ app.dataset.space
→ refreshWorkspaceUI()
→ renderer / viewport behavior
→ persistence / save-load
```

Identify every place that coerces Creation to Layout.

Do not assume the single explicit rewrite is the only defect.

## Required behavior

With an active document:
- clicking 圖紙 activates Layout;
- clicking 手繪板 activates Creation;
- visual pressed state follows the same underlying authority;
- switching does not create/destroy document content;
- switching preserves selection unless current existing contract explicitly requires otherwise;
- each state keeps appropriate viewport behavior using the existing workspace model;
- save/reload restores the authoritative per-page workspace state if that is already part of the document schema;
- undo/redo semantics are not silently changed.

With no document:
- the switch must not imply a drawable infinite document exists;
- no fake page/document state is created.

## Boundaries

Do not:
- create a second workspace state owner;
- redesign New Document;
- redefine A4 defaults;
- implement C06 zoom expansion;
- touch spatial-index repair;
- change FORMAT_VERSION unless the authoritative serialized workspace schema truly requires it; if so STOP to Supervisor instead;
- use CSS to fake active state.

## Evidence

Black-box browser evidence must include:
1. document open → Layout;
2. click 手繪板 → Creation;
3. click 圖紙 → Layout;
4. repeated round trip;
5. page switch if multiple pages exist;
6. save/reload or serialize/restore state where existing schema supports workspace persistence;
7. no-document state;
8. UI pressed state matches Core/page state after each transition.

Record state simultaneously from:
- visible switch;
- `app.dataset.space`;
- `InkApp.spaceMode()`;
- authoritative page workspace field;
- renderer/view state relevant to the transition.

## Stop

Do not merge directly to main.

`C04 CANDIDATE → Core/Supervisor review → combined current-main promotion`

The combined promotion must include only:
- accepted UI recovery delta;
- accepted C04 repair delta;
- already integrated Core baseline.

C06 and New Document remain separate.
