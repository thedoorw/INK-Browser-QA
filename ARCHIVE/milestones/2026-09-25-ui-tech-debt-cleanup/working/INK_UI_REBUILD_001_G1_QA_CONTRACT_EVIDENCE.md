# INK UI REBUILD 001 — G1 Obsolete UI QA Contract Evidence

STATUS: `G1_OBSOLETE_UI_QA_CONTRACTS / PASS`

QA checkpoint SHA:

`a358a2f9e0071b4633031640c517f024aca0ed80`

Product UI mutation in G1:

`0 files`

## Replaced obsolete contracts

The following rejected presentation assumptions are no longer required by accepted QA:

```text
old JPG favicon assertion = 0
old JPG visible-brand format pin = 0
required inspectorEdgeToggle presenter = 0
required legacy inspectorToggle opener = 0
required mobile bottom-dock grammar = 0
```

Replacement contracts are behavioral rather than presenter-specific:

```text
favicon:
  dedicated assets/favicon.svg
  must resolve in browser

panel authority:
  web-shell owns select / toggle / close state
  tests no longer require a floating edge control to exist

compact mode:
  must fit viewport
  must avoid desktop Dock leakage
  command access remains available
  no test requires a specific bottom-dock taxonomy

brand:
  visible shell mark must resolve from a local declared asset
  exact final logo file format is intentionally deferred to G7
```

## Files changed

```text
qa/core/tests/unit/ui-debt-001-shell-panel-authority-v0.1.test.mjs
qa/core/tests/unit/ui-maint-002-readability-panel-favicon-v0.1.test.mjs
qa/runtime/ink-web-ui-001-harness.html
```

No product/source file changed in G1.

## Static validation

Focused source scan across:

```text
ui-debt-001
ui-maint-002
ink-web-ui-001 browser harness
ink-cloud-018 browser harness
```

Result:

```text
oldJpgFaviconAssertions = 0
oldJpgBrandPin = 0
requiredEdgePresenterPhrases = 0
requiredInspectorToggle = 0
requiredMobileBottomDock = 0
unconditionalPass = 0
```

Browser harness inline script syntax parse:

`PASS`

Unit-module bodies parse after import/module-token normalization:

`PASS`

This is a source/static gate only. Full executable/browser Runtime remains required at G8.

## Gate result

`G1_OBSOLETE_UI_QA_CONTRACTS = PASS`

Next:

`G2_MENU_PANEL_AUTHORITY`
