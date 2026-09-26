# INK UI REBUILD 001 — G2 Menu / Panel Authority Evidence

STATUS: `G2_MENU_PANEL_AUTHORITY / SOURCE_PASS`

Checkpoint SHA:

`c229e6ec15355aa6ca99a987105f5a90bce5d7c4`

G8 browser Runtime remains required before final acceptance.

## Panel authority

Implemented:

```text
Panel Dock active item click:
  togglePanel(active)
  → closePrimaryPanels()

Panel Dock different item:
  togglePanel(different)
  → selectPanel(different)

Window menu:
  routes its panel item through the same togglePanel authority

Contextual Advanced:
  selectPanel('properties')
  never closes the panel
  therefore acts as contextual navigation, not a second toggle owner

floating inspectorEdgeToggle:
  markup = removed
  web-shell binder = removed
  Runtime dereference = removed
  CSS selectors = 0

legacy inspectorToggle:
  no longer part of desktop panel authority
  retained only as current compact responsive alternative until G6
```

## Application-menu authority

One registry now declares all application-menu names:

```text
file
edit
view
select
object
layer
brush
window
help
```

Only menus with real commands/routes are live:

```text
file = live
window = live

edit/view/select/object/layer/brush/help =
  inert labels
  not buttons
  not role=menuitem
```

One controller owns:

```text
open / close
one menu at a time
outside click
Escape
ArrowUp / ArrowDown
Home / End
File command proxying
Window panel routing
```

Retired:

```text
bindFileMenu = 0
setFileMenu = 0
setWindowMenu = 0
bindCollapseControl = 0
syncCollapseControl = 0
```

## Static/source proof

```text
APPLICATION_MENU_REGISTRY = present / one
all 9 menu ids = registered
live app-menu triggers = 2 / file + window
dead menu live buttons = 0

Dock → togglePanel = PASS
Advanced → selectPanel only = PASS
edge control code = 0
edge control markup = 0
edge control CSS refs = 0
duplicate literal template ids = 0

Web / Portable normalized parity = PASS
web-shell syntax = PASS
browser harness syntax = PASS
ui-debt-001 module syntax = PASS
ui-maint-002 module syntax = PASS
```

Browser proof markers are present for G8:

```text
same active Dock item closes
different Dock item switches
one application menu open
Window route converges on Dock authority
Escape closes menu
outside click closes menu
```

## Debt movement already visible

```text
!important:
  G0 = 223
  G2 = 221

.inspector-edge-toggle CSS references:
  G0 > 0
  G2 = 0
```

No Renderer / Document / History / Revision / Geometry / CHAT semantic file was changed.

## Gate result

`G2_MENU_PANEL_AUTHORITY = SOURCE_PASS`

Next:

`G3_FIRST_PAINT_AUTHORITY`
