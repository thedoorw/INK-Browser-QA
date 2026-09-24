# INK-WEB-UI-006 — Phase C + D DEV HANDOFF

STATUS: DEV_IN_PROGRESS / UI_ONLY / PHASE_C_D
OWNER: UI DEV
REVIEWER: INK UR
BRANCH: `work/ink-web-ui-006-cd`
BASELINE_MAIN: `c2e0b91cd1cbf96240e212a290877e7b82bd690e`

## Baseline prerequisite

This package starts **after** `INK-TECH-DEBT-001` was clean-promoted and closed.

Authoritative technical-debt closure:
- `ACTIVE/INK_CURRENT_WORK_ORDER.md` on baseline main
- `ACTIVE/INK_REVIEW_STATUS.md`
- `ACTIVE/INK_REVIEW_FINDINGS.md`
- `working/WORKING_STATUS.md`

Accepted cleanup constraints that Phase C + D must preserve:

1. Web / Portable shell has **one editable HTML authority**:
   - edit `product/source/shell.template.html`
   - regenerate with `node product/source/generate-shell.mjs`
   - use `node product/source/generate-shell.mjs --check` to verify parity
   - do not manually maintain divergent `index.html` / `index-standalone.html`
2. Accepted light-shell CSS is consolidated into the existing desktop shell authority.
   - do not append another late task-specific override layer as the new authority
3. Runtime bootstrap uses the explicit runtime-ready contract.
   - do not restore polling / retry bootstrap behavior
4. Service Worker / cache/build identity cleanup is closed.
   - do not change Service Worker, cache identity, bootstrap or build identity in this UI package
5. Production QA bridge is opt-in.
   - do not move test-only surfaces back into normal production bootstrap
6. Preserve:
   - `FORMAT_VERSION = 4`
   - product visible version `v0.1`
   - current Document / History / Revision / Renderer semantics
   - accepted Phase A/B UI behavior and original Y-mark

## Goal

Implement only:
- **Phase C — top-area cleanup**
- **Phase D — left-toolbar single / dual column**

This package is intended to reduce permanent chrome, clarify command hierarchy, and increase canvas space without changing command meaning.

---

## Phase C — Top area cleanup

### C1 — File commands: one Primary Home

Primary Home:
`檔案` application menu.

Move normal desktop use of:
- 新增
- 開啟
- 儲存
- 匯出

into the File menu.

Implementation rule:
- reuse the existing authoritative command endpoints / handlers;
- menu items may proxy the existing commands;
- do not create a second file-command implementation;
- do not change file/document semantics.

The permanent top copies of New / Open / Save / Export should no longer occupy equal-status toolbar space.

Responsive/mobile alternatives may remain if required by the existing mobile UI.

### C2 — Contextual Options remains the main top work surface

Preserve the current contextual model:
- Draw → immediate tool essentials
- Selection → immediate object actions / properties entry
- Text → text essentials
- Shape → shape essentials

Do not turn the top area into a general settings bar.

`進階 / 物件` continues to open the authoritative Properties panel.

### C3 — Undo / Redo

Primary semantic homes remain:
- Edit menu
- keyboard shortcuts

Top Undo / Redo may remain as compact icon shortcuts if they fit the reduced bar without crowding.

Do not change History semantics or stack behavior.

### C4 — Workspace switch

Keep a single clear primary workspace control in the top area.

Avoid equal-status duplicate permanent controls for:
- 創作空間
- 版面空間

The application/workspace menu may remain a secondary route.

No workspace semantics change.

### C5 — Top geometry / density

Target:
- lighter visual weight
- fewer permanent text buttons
- more horizontal room for contextual controls and document title
- preserve current menu row + contextual/options row hierarchy

Do not blindly copy Photoshop pixel values.
Use mature editor density as reference while preserving INK's current light shell.

### C6 — Fullscreen / Canvas settings

Keep compact utility access where it does not compete with primary commands.

No settings semantics change.

---

## Phase D — Left Toolbar single / dual column

### D1 — Tool identity and order are frozen

Preserve current tool family/order:
1. Draw family
2. Eraser
3. Select
4. Lasso
5. Shape
6. Text
7. Image
8. Pan

Draw family remains one stack/flyout:
- Pen
- Pencil
- Marker
- Brush
- Airbrush

No tool command, shortcut, icon identity or selection semantics may change.

### D2 — Default single-column mode

Desktop default:
`single-column`

Reason:
- maximize canvas width
- align with current compact workstation direction

### D3 — Optional dual-column mode

Add a compact density/layout toggle for desktop toolbar only.

Dual-column rules:
- same tools
- same ordering
- same grouping
- same shortcuts
- no additional tools revealed
- vertical footprint becomes shorter
- toolbar width expands only enough for two tool cells
- stage/canvas geometry must update correctly

This is layout only, not a second toolbar architecture.

### D4 — Persistence

Toolbar layout preference may be stored as a UI-only local preference.

Allowed:
- localStorage UI preference

Prohibited:
- document serialization
- project/document schema
- History entry
- Revision entry

### D5 — Responsive boundary

At narrow/mobile sizes:
- existing responsive toolbar behavior remains authoritative
- do not force desktop dual-column mode into mobile UI
- no second command architecture

### D6 — Discoverability

The single/dual-column toggle must:
- be compact
- have tooltip / accessible label
- not look like a drawing tool
- be visually separated from tool identity

---

## Implementation constraints

Allowed files should be limited to UI shell/presentation and task-specific QA, normally:
- `product/source/shell.template.html`
- generated `product/source/index.html`
- generated `product/source/index-standalone.html`
- `product/source/styles.css`
- `product/source/web-shell.js`
- task-specific UI QA / runtime harness assertions only when needed

Do not modify:
- Document authority/schema
- History semantics
- Revision semantics
- Renderer/WebGL/Canvas engine
- Geometry/Recipe/Core contracts
- Service Worker
- build/cache identity
- runtime bootstrap contract
- package branch
- `FORMAT_VERSION`

If any requested UI behavior requires those:
`INTEGRATION_REQUIRED → UR → MR`

## Technical-debt regression guard

Before handoff DEV must verify:
- shell generator `--check` passes
- Web / Portable shell parity remains intentional
- no second full HTML authority was introduced
- no new late CSS override authority was introduced
- Service Worker / bootstrap / build identity are untouched
- runtime-ready event contract remains untouched

## Runtime evidence required

At minimum capture/verify:
- normal desktop, single-column toolbar
- dual-column toolbar
- switching single ↔ dual without canvas breakage
- File menu open with New/Open/Save/Export
- reduced top chrome
- contextual options for Draw
- contextual options for Selection
- right panel collapsed and expanded
- normal desktop width
- narrow desktop
- fullscreen
- Web and Portable smoke parity

## DEV handoff format

Return:
- exact HEAD
- changed files
- command-routing note for File menu
- shell generator check result
- static/unit test result
- runtime screenshots/evidence
- explicit confirmation:
  - Core semantics unchanged
  - Service Worker/bootstrap/build identity unchanged
  - FORMAT_VERSION unchanged

Completion state:
`DEV_HANDOFF → UR_REVIEW → STOP`

Do not begin Phase E or later phases automatically.
