# INK CURRENT WORK ORDER — Direct File Launch v0.1

STATUS: `IMPLEMENTED / AWAITING USER TEST + WINDOWS RUNTIME VERIFICATION`

Product identity: `INK v0.1`

DEV branch: `working/INK-v0.1-file-launch`

Authoritative starting point: reviewed DEV completion commit `ceedcb44ff01d48c7f8aecb34c49107fceb4665c`

User requirement:

`unzip → double-click index.html → INK starts with usable drawing/testing functions`

This is the first-stage target. It does **not** require a final single-file `INK.html`.

## Scope

Implement a portable file-launch entry for the existing modular product.

Required behavior:

1. `index.html` remains the only user launch entry.
2. Direct `file://` launch must start the INK Runtime without a local HTTP server.
3. Existing modular source remains authoritative and preserved.
4. Core functions used for drawing/testing must remain connected, including:
   - drawing/stroke input;
   - undo/redo;
   - layers;
   - selection/transform;
   - Creation/Layout workspace switching;
   - Inspector/property panel;
   - persistence/serialization where supported by the browser;
   - export path initialization.
5. Optional FLORA behavior must not become a core startup requirement.
6. Service Worker / PWA is explicitly outside this direct-file requirement. File mode may report it unsupported/unverified.
7. Do not redesign UI or add unrelated product features.
8. Product identity remains `INK v0.1`; `FORMAT_VERSION = 4` remains unchanged.

## Implementation constraint

A generated portable Runtime payload is allowed. The package may remain modular:

```text
index.html
ink.file-runtime.js
styles.css
src/
assets/
schemas/
vendor/
...
```

The generated payload is a delivery/runtime compatibility layer. It must not replace or rewrite the modular source architecture.

## Required verification

At minimum verify direct `file://` launch in Chromium-family browser for:

- Runtime boot;
- `#stage`;
- visible `INK v0.1`;
- Creation/Layout workspace switch;
- Inspector open/close;
- core interaction smoke;
- no missing local module dependency;
- Service Worker absence does not block startup.

HTTP Runtime behavior must not regress.

## Packaging

After the direct-file source is verified, `package/ink-current` may be refreshed by exact Git-object packaging from the verified `product/source/` tree.

Packaging itself must not rewrite product bytes.

## STOP RULE

After verified source + refreshed modular package:

STOP.

Do not enter:
- final single-file `INK.html`;
- PWA redesign;
- cloud/account/sync;
- certification;
- product version change;
- unrelated feature work.
