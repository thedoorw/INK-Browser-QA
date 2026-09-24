# INK-WEB-UI-006 — Phase F DEV HANDOFF

STATUS: AUTHORIZED / UI_ONLY / PHASE_F / DEV_START
OWNER: UI DEV
REVIEWER: INK UR
BRANCH: `work/ink-web-ui-006-f`
BASELINE_PHASE_E_ACCEPTED_BRANCH_HEAD: `1f1151b958a66a44314f0c712942c29c824d5628`
BASELINE_PHASE_E_TESTED_PRODUCT_SHA: `6ee7ef4343a0bc8d70c3340ba7bd12be4b430931`
PHASE_E_RUNTIME: `35943860711 / PASS`

## Goal

Implement only:

**Phase F — Duplication Cleanup / Primary Home Enforcement**

Do not start Phase G or later phases.

Phase F removes equal-status duplicate UI entrances and clarifies where commands belong without changing command semantics, Core authority, panel authority, or responsive behavior.

Core rule:

> Each function has one Primary Home. Any additional route must be explicitly classified as Shortcut, Contextual Action, Keyboard Shortcut, or Responsive Alternative.

---

## F1 — Duplicate inventory

Use the existing Phase A command map and current Phase E product shell as the authority.

Re-scan the current UI and identify duplicated visible commands/control families.

At minimum review known overlap classes:

- selection actions duplicated between contextual Selection controls and object/property surfaces;
- color / size / opacity duplicated between contextual Options and Properties;
- file/workspace commands duplicated between application menus and permanent chrome;
- panel entry routes duplicated between Window menu, dock, edge affordance, or legacy toggles;
- creation/layout controls duplicated between top/workspace menus;
- responsive/mobile copies that are intentional alternatives;
- specialist/diagnostic entry routes that must remain separated from everyday editor controls.

Do not remove duplicates merely because labels match. Classify each by role first.

---

## F2 — Primary Home enforcement

Apply the following placement authority:

### File
Primary Home:
- File menu

Commands:
- New
- Open
- Save
- Export

Secondary UI may remain only when it is a genuine responsive alternative or bounded shortcut.

### Edit / History
Primary semantic homes:
- Edit menu
- keyboard shortcuts
- History panel for step inspection

Compact top Undo / Redo may remain only as shortcuts.

No History semantics change.

### Tool selection
Primary Home:
- left Toolbar

Contextual Options may expose immediate settings/actions but must not become a second tool selector.

### Immediate contextual controls
Primary Home:
- top contextual Options

Use for high-frequency, current-tool/current-selection actions only.

### Deep properties
Primary Home:
- Properties panel

Use for object/tool appearance, transform, and accepted Geometry controls.

Do not leave equal-status copies in both contextual and Properties surfaces unless one is explicitly a shortcut and visually subordinate.

### Panels
Primary Home:
- right Panel Dock

Secondary route:
- Window menu

Edge affordance:
- collapse / restore only

Legacy panel toggles must not compete as another equal-status navigation system.

### Specialist / Diagnostic
Primary Home:
- Specialist panel

Do not expose engineering/diagnostic controls inside normal Properties.

---

## F3 — Selection action cleanup

Review actions such as:
- Duplicate
- Group
- Bring to Front
- Align Center
- Delete

Rules:
- keep the fastest contextual route where it is useful for active selection;
- avoid a second equal-weight permanent row elsewhere;
- Properties may retain deeper object settings but should not duplicate an entire action strip;
- keyboard shortcuts remain valid secondary routes.

Do not change command IDs/handlers or selection semantics.

---

## F4 — Contextual vs Properties cleanup

For controls such as:
- color
- width / size
- opacity
- transform-related quick actions

Rules:
- contextual Options = immediate high-frequency subset;
- Properties = complete/deeper configuration;
- when both exist, hierarchy must be obvious and not look like two competing Primary Homes;
- preserve existing command endpoints and values.

No drawing engine semantics change.

---

## F5 — Workspace / top-chrome cleanup

Preserve the accepted Phase C reduced chrome.

Review any remaining equal-status duplicates for:
- workspace switching;
- canvas/settings access;
- fullscreen;
- panel entry;
- creation/layout actions.

Do not add new permanent top buttons.

---

## F6 — Responsive alternatives

Responsive/mobile controls may intentionally duplicate desktop functions.

These must be classified as:
`RESPONSIVE_ALTERNATIVE`

Do not remove required mobile access merely to reduce duplicate counts.

Desktop cleanup must not create mobile regressions.

---

## F7 — QA expectations

Update the existing UI runtime harness only where required to verify:

- File commands remain single Primary Home on normal desktop;
- toolbar remains the tool Primary Home;
- contextual Options remains bounded to immediate controls;
- Properties retains deeper settings without competing action strips;
- right Panel Dock remains the primary panel navigation;
- Window menu remains a secondary route;
- Specialist remains isolated from normal Properties;
- intentional responsive alternatives remain available;
- duplicate command IDs are not introduced;
- removed visual duplicates do not remove underlying command reachability;
- Phase C/D/E behavior remains intact;
- Web / Portable parity;
- narrow desktop;
- fullscreen;
- UI / Creative / Geometry regression.

---

## Authority / implementation constraints

Preserve the accepted Phase E single panel controller and shell authority.

Editable shell authority:
1. `product/source/shell.template.html`
2. regenerate `index.html` / `index-standalone.html`
3. verify with `node product/source/generate-shell.mjs --check`

Normally allowed:
- `product/source/shell.template.html`
- generated `product/source/index.html`
- generated `product/source/index-standalone.html`
- `product/source/styles.css`
- `product/source/web-shell.js`
- task-specific UI runtime assertions

Do not modify:
- Document authority/schema
- History semantics
- Revision semantics
- Renderer/WebGL/Canvas engine
- Geometry execution contracts
- Recipe/Core contracts
- CHAT grounding/reasoning semantics
- approval/execution authority
- Service Worker
- runtime bootstrap
- cache/build identity
- product version `v0.1`
- `FORMAT_VERSION = 4`

If cleanup requires semantic/Core changes:

`INTEGRATION_REQUIRED → UR → MR`

---

## DEV return

Return:
- exact HEAD;
- changed files;
- duplicate inventory before/after;
- Primary Home classification changes;
- preserved secondary routes and their classification;
- shell generator check;
- static/unit checks;
- runtime-harness assertions added/updated;
- explicit confirmation:
  - Document unchanged
  - History unchanged
  - Revision unchanged
  - Geometry/Core unchanged
  - CHAT semantics unchanged
  - Service Worker/bootstrap/build identity unchanged
  - FORMAT_VERSION unchanged
  - Phase G not started

Completion state:

`DEV_HANDOFF → UR_REVIEW → STOP`

Do not begin Phase G automatically.
