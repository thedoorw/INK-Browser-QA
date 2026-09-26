# INK UI REBUILD 001 — G4 Typography Authority Evidence

STATUS: `G4_TYPOGRAPHY_AUTHORITY / SOURCE_PASS`

Checkpoint SHA:

`dcbc8c086a7da4ae202cc2c78eca424befba347f`

## Authority

Normal workstation typography now has one stack:

`--ui-font`

Diagnostic / code-like output has one explicitly separate stack:

`--ui-font-mono`

Semantic scale:

```text
UI-XS      9px
UI-SM      9.5px
UI-MD      10px
UI-LG      11px
UI-XL      12px
DISPLAY    14px
BRAND      alias → UI-MD
```

## Debt removed

```text
hard-coded font-size declarations:
  before G4 = 285
  after G4  = 0

direct workstation font-family stacks:
  after G4 = 0

Georgia workstation usage:
  before = 1
  after  = 0

legacy --font authority:
  before = 1
  after  = 0

typography-only UI-XS !important:
  removed
```

Allowed final `font-family` values are only:

```text
var(--ui-font)
inherit
```

Monospace shorthands use `var(--ui-font-mono)` only on existing code/diagnostic-like surfaces.

## Static proof

```text
hard-coded font-size scan = 0
numeric font shorthand scan = 0
direct stack scan = 0
Georgia scan = 0
legacy --font scan = 0
ui-maint typography contract syntax = PASS
browser harness syntax = PASS
forbidden Core mutation = 0
```

The change rewrites existing declarations to semantic tokens; it does not append a late typography override block.

## Gate result

`G4_TYPOGRAPHY_AUTHORITY = SOURCE_PASS`

Next:

`G5_CSS_SHELL_AUTHORITY`
