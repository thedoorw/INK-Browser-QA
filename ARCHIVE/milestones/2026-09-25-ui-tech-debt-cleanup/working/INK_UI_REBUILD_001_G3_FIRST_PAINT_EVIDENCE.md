# INK UI REBUILD 001 — G3 First Paint Authority Evidence

STATUS: `G3_FIRST_PAINT_AUTHORITY / SOURCE_PASS`

Checkpoint SHA:

`63a660c856a1d0019beafb184899671f704752cd`

Full browser reload capture remains required at G8.

## Delivered first-paint contract

The generated shell now declares the intended workstation before Runtime boot:

```text
theme-color = #e7e7e7
body[data-ink-first-paint] = workstation

#app:
  class includes web-shell-v0-1
  data-space = creation
  data-shell-panel = collapsed
  data-toolbar-layout = single
  data-first-paint = ready
  --active-panel-w = 0px
```

Critical first-paint CSS is delivered in `<head>` before the main stylesheet:

```css
html,body { background:#e7e7e7; color:#262626; }
#app      { background:#e7e7e7; color:#262626; }
```

No black/dark legacy paint token is present in that critical block.

## Delivery / cache contract

Service-worker build identity was advanced with the shell paint contract:

`20260925-ui-rebuild-001-g3-first-paint-r1`

This prevents the first-paint shell change from sharing the previous UI-006 cache identity.

## Source proof

```text
Web / Portable normalized parity = PASS
first-paint style count = 1 per delivery
theme-color = PASS
body marker = PASS
server app state = PASS
critical paint is light = PASS
critical paint dark token scan = PASS / 0
service-worker BUILD_ID = PASS
web-shell syntax = PASS
browser harness syntax = PASS
unit contract syntax = PASS
forbidden Core source changes = 0
```

Browser harness contains explicit evidence marker:

`G3 delivered first-paint contract is present before Runtime-state assertions`

This source gate does not claim the deployed visual flash is eliminated until G8 captures a fresh reload.

## Gate result

`G3_FIRST_PAINT_AUTHORITY = SOURCE_PASS`

Next:

`G4_TYPOGRAPHY_AUTHORITY`
