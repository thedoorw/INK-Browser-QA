# INK UI-B Contribution Boundary Contract v1.0

STATUS: `UI_B / BOUNDED_EXTENSION_CONTRACT / NO_PLUGIN_SDK`

TASK: `INK-UI-B-FULL-CAPABILITY-CONTROLS-001`

## Purpose

Define one bounded UI contribution boundary for future native/adaptor capabilities without introducing a second Core authority or claiming a third-party Plugin SDK.

Implementation authority:
- `product/source/ui/capability-contributions.js`
- `product/source/ui/full-capability-controls.js`

## Contract

A UI contribution must:
1. have one unique contribution ID;
2. name its existing capability/Core authority;
3. declare a supported UI home: application menu, tool flyout, dialog, or existing panel;
4. route to an existing command/state/mutation authority;
5. fail validation on duplicate contribution IDs;
6. not create a second Document / History / Renderer / Selection / Snap / Color / CHAT authority.

Current contribution metadata:
- `UI_B_MENU_CONTRIBUTIONS`
- `UI_B_TOOL_GROUPS`
- `UI_B_DIALOGS`
- `UI_B_REQUIRED_PANELS`

Validation:
- `validateUiBContributions()`
- duplicate IDs reject with `INK_UI_B_DUPLICATE_CONTRIBUTION_ID`;
- menu contributions require `menu + command + authority`;
- tool groups reject empty membership and duplicate local tool IDs.

## Scope

Allowed:
- built-in/native capability UI registration;
- adaptor-backed routes already accepted by capability governance;
- new menu/tool/dialog/panel contribution metadata that maps to an existing authority.

Not provided:
- third-party package loader;
- marketplace;
- remote plugin code loading;
- sandbox;
- plugin permission system;
- public third-party SDK.

```text
FULL_PLUGIN_SDK = P2 / ABSENT
UI_CONTRIBUTION_BOUNDARY = PRESENT
SECOND_CORE_AUTHORITY = PROHIBITED
```

## Governance

Any contribution that requires a new product capability, new Core semantic, new mutation authority, or capability-placement change remains:
`STOP → MR / INTEGRATION_REQUIRED`.

UI-C must verify this boundary remains centralized and brand-safe.