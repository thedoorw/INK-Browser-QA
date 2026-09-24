# INK-WEB-UI-006 — Phase G Evidence

STATUS: `DEV_HANDOFF / STATIC_PASS / RUNTIME_DISPATCH_PENDING / UI_ONLY / PHASE_G / STOP`
OWNER: UI DEV
REVIEWER: INK UR
BRANCH: `work/ink-web-ui-006-g`
BASELINE_PHASE_F_ACCEPTED_BRANCH_HEAD: `ed06a4562017c1ea78bcd2c39ced5c0b81d1ad71`
BASELINE_PHASE_F_TESTED_PRODUCT_SHA: `1ccfa450d8fe3248e402d26315c386a50e4f4a1b`
PHASE_F_RUNTIME: `35945848484 / PASS`
PHASE_G_PRODUCT_QA_CHECKPOINT: `718eff8c31a82a8ffd82bbf3d2b83f38b2aa993b`

## Scope

Implemented only:

`INK-WEB-UI-006 — Phase G Typography System`

No Phase H work was started.

This phase changes application UI typography presentation only. It does not change artwork Text objects, document font serialization, text layout semantics, command endpoints, panel routing, History, Revision, CHAT, Geometry/Core, Service Worker, runtime bootstrap or build identity.

## Accepted font stack

Preserved:

`Inter → Noto Sans TC → PingFang TC → Microsoft JhengHei → system-ui`

No downloadable font dependency or font file was added.

## Baseline scattered size inventory

Literal `font-size` declarations in the accepted Phase F stylesheet included the following values:

| Size | Declaration count |
|---|---:|
| 6px | 1 |
| 7px | 10 |
| 8px | 46 |
| 8.5px | 5 |
| 9px | 71 |
| 9.5px | 9 |
| 10px | 67 |
| 10.5px | 8 |
| 11px | 45 |
| 12px | 12 |
| 13px | 5 |
| 14px | 6 |
| 16px | 1 |
| 17px | 1 |

Most of this spread was inherited from successive UI phases. Phase G does not rewrite historical phase blocks wholesale; it adds the final presentation authority at the end of `styles.css`, so accepted geometry and older fallback rules remain intact while effective workstation text is normalized.

## Typography token map

| Token family | CSS authority | Frozen value | Use |
|---|---|---:|---|
| UI-XS | `--ui-type-xs` | 9px | noncritical metadata / compact badges |
| UI-SM | `--ui-type-sm` | 9.5px | secondary labels / compact state |
| UI-MD | `--ui-type-md` | 10px | normal workstation controls |
| UI-LG | `--ui-type-lg` | 11px | panel/application headings |
| BRAND | `--ui-type-brand` | 10px | INK brand text only |

Weight / line-height authority:

- `--ui-weight-regular: 400`
- `--ui-weight-control: 500`
- `--ui-weight-heading: 650`
- `--ui-weight-meta: 700`
- `--ui-line-control: 1.2`
- `--ui-line-copy: 1.45`

All values were selected from the already accepted shell/runtime typography range; no new fractional scale outside the accepted values was invented.

## Normalized result

Phase G now gives one final CSS authority to:

- application menus and document title;
- contextual/options controls;
- workspace controls;
- left-toolbar labels;
- right Panel Dock related labels;
- Properties / Layers / History / Reference / Compose / Revision / Specialist panel headings, tabs, property labels and metadata;
- CHAT / Creative Workspace headings, tabs, fields, actions, messages and state labels;
- input/select/textarea UI text;
- status / shortcut / diagnostic metadata;
- narrow/mobile UI labels.

Normal interactive text is kept at `UI-MD` or above.

The smallest token, `UI-XS = 9px`, is limited to metadata/compact labels. Interactive controls that previously used 8–9px presentation are normalized upward to `UI-MD` where applicable.

## Intentional exceptions

- Application menu commands and the document-title field retain `UI-LG = 11px` prominence from the accepted shell.
- Narrow/mobile contextual tool identity may use `UI-XS` because it is low-priority identity text, not the command itself.
- Decorative/icon glyph sizing such as icon symbols remains outside the typography token scale where the size represents an icon rather than readable UI copy.
- Artwork Text tool document typography is explicitly outside this stylesheet authority and is unchanged.

## CJK / Latin / numeric consistency

Phase G preserves the single inherited cross-platform font stack on application controls and adds Runtime evidence that CJK, Latin and numeric probe text share the same computed font family and font size.

No language-specific smaller type rule was added.

## Changed product / QA files

Product presentation:

- `product/source/styles.css`

QA:

- `qa/runtime/ink-web-ui-001-harness.html`

No shell template or generated shell output was changed.

## Runtime harness assertions

The authoritative UI browser harness now verifies:

1. named typography token authority exists with exact frozen values;
2. representative interactive/control text is not below `UI-MD`;
3. metadata-only text is not below `UI-XS`;
4. Inspector and Creative Workspace panel titles/tabs share the common hierarchy;
5. CJK / Latin / numeric UI probe text shares font-stack and size authority;
6. narrow desktop persistent chrome does not overflow after typography normalization.

Existing Phase C/D/E/F, fullscreen, responsive, panel-routing, UI, Creative and Geometry checks remain in the same harness.

## Static verification

Connector-side exact-source checks against the Phase G product/QA checkpoint:

```text
CSS_BRACE_BALANCE = PASS / 1559 : 1559
TYPOGRAPHY_TOKEN_AUTHORITY = PASS
UI_XS = 9px
UI_SM = 9.5px
UI_MD = 10px
UI_LG = 11px
BRAND = 10px
PHASE_G_LITERAL_FONT_SIZE_BELOW_9PX = 0
INTERACTIVE_METADATA_SCALE_LEAK_CHECK = PASS
UI_RUNTIME_HARNESS_INLINE_SCRIPT_PARSE = PASS
PHASE_G_RUNTIME_ASSERTIONS = 6
BASELINE_COMPARE = AHEAD_ONLY
PRODUCT_QA_DELTA = styles.css + UI runtime harness only
```

At the product/QA checkpoint, compare against accepted Phase F branch head `ed06a4562017c1ea78bcd2c39ced5c0b81d1ad71` showed no `product/source/src/**` change.

## Web / Portable parity

`styles.css` is shared by the generated Web and Portable shell outputs.

Because `shell.template.html`, `index.html`, and `index-standalone.html` were not changed, shell regeneration is not required for Phase G.

`node product/source/generate-shell.mjs --check` is therefore `N/A / SHELL_UNTOUCHED` for this phase.

## Runtime status

```text
WINDOWS_SELF_HOSTED_RUNTIME_EXECUTED_BY_DEV = 0
GITHUB_HOSTED_ACTIONS_USED = 0
AUTHORITATIVE_RUNTIME_HARNESS_UPDATED = PASS
UR_EXACT_SHA_RUNTIME = REQUIRED
DEV_RUNTIME_PASS_CLAIM = 0
```

This DEV connector does not expose workflow-dispatch. No Runtime PASS is claimed.

UR should execute the existing authoritative Windows self-hosted Runtime against the final DEV exact HEAD/product checkpoint before promotion.

## Boundary confirmation

```text
ARTWORK_TEXT_SEMANTICS = UNCHANGED
DOCUMENT = UNCHANGED
HISTORY = UNCHANGED
REVISION = UNCHANGED
GEOMETRY_CORE = UNCHANGED
CHAT_SEMANTICS = UNCHANGED
SERVICE_WORKER = UNCHANGED
RUNTIME_BOOTSTRAP = UNCHANGED
BUILD_CACHE_IDENTITY = UNCHANGED
PRODUCT_VERSION = v0.1 / UNCHANGED
FORMAT_VERSION = 4 / UNCHANGED
PHASE_H = NOT_STARTED
```

## DEV state

```text
TASK = INK-WEB-UI-006 / PHASE_G
STATIC = PASS
RUNTIME = UR_EXACT_SHA_REQUIRED
COMPLETION = DEV_HANDOFF
NEXT = UR_REVIEW
STOP
```
