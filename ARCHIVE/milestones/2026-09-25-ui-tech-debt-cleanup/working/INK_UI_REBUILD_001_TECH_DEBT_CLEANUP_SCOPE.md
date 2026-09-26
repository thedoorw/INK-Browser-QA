# INK UI REBUILD 001 — Technical Debt Cleanup Scope for MR

STATUS: UR_PREPARED / MR_AUTHORIZATION_REQUIRED
OWNER: MR for global authorization / DEV for implementation / UR for review
BASELINE: `d56c8a824247dd52f91a3dac75503eeee0b8cba7`

## Purpose

Prepare a clean UI foundation so the Photoshop-aligned rebuild does not add another layer of technical debt.

No Core work is authorized by this document.

## Frozen product authorities

Do not change:

- Renderer / WebGL / Canvas engine;
- Document model / schema / migration;
- History semantics;
- Revision semantics;
- Recipe / Geometry contracts;
- CHAT proposal / approval / execution semantics;
- persistence semantics;
- FORMAT_VERSION;
- product base version.

## Allowed UI foundation scope

### 1. Regression baseline cleanup

Replace obsolete assertions that currently protect rejected UI behavior.

Must remove/replace acceptance of:
- old JPG favicon contract;
- old JPG visible brand contract;
- floating `inspectorEdgeToggle` as required presentation;
- legacy Inspector opener as required visible/mobile route where new unified authority replaces it;
- mobile-bottom-dock-only grammar if it prevents unified responsive behavior.

Do not weaken tests to unconditional PASS.
Replace every retired assertion with the new accepted contract.

### 2. Menu state authority

Create one reusable application-menu controller/registry for:
- File
- Edit
- View
- Select
- Object
- Layer
- Brush
- Window
- Help

The controller owns:
- open/close;
- one menu open at a time;
- Escape;
- outside click;
- focus state;
- keyboard navigation where implemented;
- command route binding.

A menu with no legitimate commands must not appear as a live menu.

### 3. Right-panel state authority

Keep `web-shell.js` as the shell owner, but normalize behavior:

```text
Dock item click:
  closed/different panel → open selected panel
  same active panel      → close selected panel
```

Retire visible competing panel-open controls:
- floating edge tab;
- legacy Inspector opener;
- any duplicated Properties opener that does not serve a distinct contextual-navigation purpose.

Contextual Advanced may remain only as navigation to a Properties subsection, not a second whole-panel authority.

Window menu is a secondary route to the same Dock state.

### 4. First-paint authority

The server-delivered/generated shell must know its default visual workspace before Runtime boot.

Required:
- intended default workspace represented in initial markup/state;
- no dark/black intermediate application background;
- Runtime-ready must not restyle the whole workstation from a legacy state;
- service-worker build identity updated whenever this contract changes.

Add a deterministic first-paint regression check plus deployed reload visual check.

### 5. Typography foundation

Define one UI font stack and one token scale for workstation text.

Allowed separate font:
- monospace only for code/diagnostic output with explicit semantic class.

Remove:
- decorative Georgia workstation usage;
- direct system-ui font shorthands where normal UI token should apply;
- historical hard-coded sizes that compete with token authority;
- typography-only `!important` overrides used to win cascade conflicts.

### 6. CSS authority rule

Do not append a new “final override” block.

For each shell surface touched:
- identify current accepted selector authority;
- remove obsolete predecessor rules;
- keep one active desktop authority;
- keep one responsive authority;
- use named tokens for shell dimensions/type/spacing.

Required tracked metrics after cleanup:
- repeated core shell selector definitions materially reduced;
- `!important` count reduced;
- no new duplicate breakpoint for an existing threshold purpose.

### 7. Responsive contract

Define named layout modes before styling:

```text
DESKTOP_WIDE
DESKTOP_NARROW
COMPACT
```

Width changes may:
- reflow;
- collapse;
- move a secondary route.

Width changes may not:
- create a second command taxonomy;
- create a second panel state owner;
- replace the workstation with an unrelated navigation grammar.

### 8. Brand asset contract

One visible logo authority.
One favicon authority.

Do not guess the final asset. If exact approved asset cannot be proven, keep this item `HOLD` and ask the user before replacement.

Tests must reference the same accepted contract.

## Required QA before Photoshop feature work

Static/source:
- generator `--check`;
- Web/Portable parity;
- no contradictory favicon assertions;
- no required old edge-tab assertion;
- no visible dead menu label;
- one panel state owner;
- same-panel Dock click toggles closed;
- no duplicate DOM IDs.

Browser:
- File + at least one non-File menu uses shared controller;
- same-panel Dock toggle open/close;
- different Dock panel switch;
- Window secondary route convergence;
- first-paint state stable;
- 1280 and 960 shell containment.

Visual:
- reload/first-paint capture;
- 1280×1024 shell;
- 960px shell.

## Exit state

```text
UI_FOUNDATION_DEBT = PASS
NORMAL_UI_REBUILD = READY
CORE_MUTATION = 0
NEW_TECH_DEBT = 0
```

After this gate, proceed to Photoshop workstation skeleton and the master checklist.
