# INK — UI Remediation Master Checklist v0.1

STATUS: AUDIT_BASELINE / NOT_IMPLEMENTATION_AUTHORIZATION
OWNER: INK UR
BRANCH: `work/ink-ui-remediation-audit-001`
BASELINE_MAIN: `d56c8a824247dd52f91a3dac75503eeee0b8cba7`
PURPOSE: Rebuild one authoritative acceptance matrix for the deployed UI before any further remediation.

## 0. Hard acceptance rule

No UI item is closed because a phase document, DOM structure, static test, or Runtime suite passes.

Every visible UI item must pass all applicable columns:

`INTENT → SOURCE → FUNCTION → VISUAL → DEPLOYED SCREENSHOT → STATUS`

Allowed final states:

- `KEEP` = complete and verified on deployed main
- `FIX` = exists but is incomplete, wrong, stale, or visually inconsistent
- `MISSING` = required but not implemented
- `REMOVE` = redundant / misleading / obsolete
- `HOLD` = blocked by missing product authority or user decision
- `PASS` = only after deployed-main evidence closes the item

Visible controls rule:

> Any visible control that has no functional behavior, no explicit disabled state, and no intentional placeholder treatment is an automatic FAIL.

Visual gate rule:

> No deployed-main screenshot = no visual PASS.

Brand rule:

> Logo / favicon / app mark cannot pass from route existence alone. The exact user-approved asset must be visible in deployed main.

Startup rule:

> Any dark/black/legacy flash before the intended initial workspace is rendered is a FAIL.

## 1. Evidence columns

For every row record:

| Column | Meaning |
|---|---|
| ID | Stable checklist item |
| Surface | UI region/function |
| Intended result | User-approved target |
| Current main | Observed/source-verified state |
| Source check | PASS/FAIL/NA |
| Functional check | PASS/FAIL/NA |
| Visual check | PASS/FAIL/NA |
| Deployed screenshot | PASS/FAIL/NOT_CHECKED |
| Action | KEEP/FIX/MISSING/REMOVE/HOLD |
| Closure evidence | commit + screenshot + runtime/assertion if applicable |

## 2. Branding / identity

| ID | Surface | Intended result | Current main | Source | Function | Visual | Screenshot | Action |
|---|---|---|---|---|---|---|---|---|
| BR-01 | Top-left INK mark | User-approved current INK mark, proportional, crisp | Active route/assets require re-verification; prior integration handoff identified stale branding | FAIL | NA | FAIL | FAIL | FIX |
| BR-02 | Favicon | User-approved current favicon | Prior integration handoff identified stale favicon path/state | FAIL | NA | FAIL | FAIL | FIX |
| BR-03 | App title | `INK v0.1 · Web` coherent with visible identity | Present | PASS | NA | PASS | PASS | KEEP |
| BR-04 | Version badge | Compact, subordinate, accurate | Present | PASS | NA | PASS | PASS | KEEP |
| BR-05 | Brand spacing | Mark + name visually aligned with menu strip | Requires deployed comparison | NOT_CHECKED | NA | NOT_CHECKED | NOT_CHECKED | FIX |

## 3. Startup / loading / first paint

| ID | Surface | Intended result | Current main | Source | Function | Visual | Screenshot | Action |
|---|---|---|---|---|---|---|---|---|
| ST-01 | First paint | Intended startup workspace appears without dark/black flash | Dark workstation background can paint before creation-space state; user reproduced flash | FAIL | PASS | FAIL | FAIL | FIX |
| ST-02 | Runtime-ready transition | No visible legacy intermediate state | Runtime-ready exists technically; visual transition not gated | PASS | PASS | FAIL | FAIL | FIX |
| ST-03 | Initial workspace | Default startup state must match agreed Creation workspace | User screenshots show inconsistent light/dark startup behavior | FAIL | PASS | FAIL | FAIL | FIX |
| ST-04 | Initial canvas message | Empty-state copy readable/subordinate | Present; requires final visual check | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |

## 4. Main menu completeness

Current source finding: only File has a real command menu. Other menu labels are plain buttons.

| ID | Surface | Intended result | Current main | Source | Function | Visual | Screenshot | Action |
|---|---|---|---|---|---|---|---|---|
| MN-01 | File | New/Open/Save/Export complete | Real menu exists | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| MN-02 | Edit | Real menu with valid existing edit commands | Plain button only | FAIL | FAIL | FAIL | FAIL | MISSING |
| MN-03 | View | Real menu with viewport/fullscreen/panel-relevant routes | Plain button only | FAIL | FAIL | FAIL | FAIL | MISSING |
| MN-04 | Select | Real menu only if supported commands exist; otherwise remove/disable | Plain button only | FAIL | FAIL | FAIL | FAIL | MISSING |
| MN-05 | Object | Real menu mapped to existing object commands | Plain button only | FAIL | FAIL | FAIL | FAIL | MISSING |
| MN-06 | Layer | Real menu mapped to existing layer commands | Plain button only | FAIL | FAIL | FAIL | FAIL | MISSING |
| MN-07 | Brush | Real menu only for legitimate brush-family functions | Plain button only | FAIL | FAIL | FAIL | FAIL | MISSING |
| MN-08 | Window | Secondary route to panel visibility/navigation | Plain button despite accepted Panel Dock secondary-route requirement | FAIL | FAIL | FAIL | FAIL | MISSING |
| MN-09 | Help | Useful content or remove until content exists | Plain button only | FAIL | FAIL | FAIL | FAIL | MISSING |
| MN-10 | Menu keyboard behavior | Open/close/Escape/focus consistent | Only File currently bound | FAIL | FAIL | NOT_CHECKED | NOT_CHECKED | FIX |
| MN-11 | No fake affordances | No visible menu label that does nothing | Violated | FAIL | FAIL | FAIL | FAIL | FIX |

## 5. Top application / contextual options

| ID | Surface | Intended result | Current main | Source | Function | Visual | Screenshot | Action |
|---|---|---|---|---|---|---|---|---|---|
| TP-01 | Menu row height | Mature editor grammar, ~24px reference | Implemented | PASS | NA | NOT_CHECKED | NOT_CHECKED | FIX |
| TP-02 | Options row height | ~35–36px reference | Implemented | PASS | NA | NOT_CHECKED | NOT_CHECKED | FIX |
| TP-03 | Document title | Readable, not visually dominant | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| TP-04 | Contextual controls | Tool-dependent, one immediate-control home | Implemented structurally | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| TP-05 | Undo/Redo placement | Compact and coherent, no duplicate high-weight homes | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| TP-06 | Advanced / Creative entry | INK-specific, clear hierarchy | Present | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| TP-07 | Top clutter | File-management buttons not permanently duplicated | Largely cleaned | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| TP-08 | Top-right dead/duplicate icons | No unexplained duplicate utility buttons | Must inspect deployed screenshot | NOT_CHECKED | NOT_CHECKED | NOT_CHECKED | NOT_CHECKED | FIX |

## 6. Left toolbar

| ID | Surface | Intended result | Current main | Source | Function | Visual | Screenshot | Action |
|---|---|---|---|---|---|---|---|---|---|
| LT-01 | Single-column default | Photoshop-like compact rail | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| LT-02 | Dual-column option | Same order/groups, no taxonomy change | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| LT-03 | Toggle | Fixed compact control | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| LT-04 | Tool order | Stable across layouts | Runtime-covered | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| LT-05 | Tool icons | Optical alignment / consistent scale | Requires screenshot audit | NOT_CHECKED | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| LT-06 | Active state | Clear without excess visual weight | Present | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| LT-07 | Duplicate tool entrances | No equal-status duplicate tools | Structurally reduced | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| LT-08 | Tooltip/shortcut | Existing shortcuts accurately shown | Partial; needs inventory | NOT_CHECKED | NOT_CHECKED | NOT_CHECKED | NOT_CHECKED | FIX |

## 7. Right Panel Dock / panels

| ID | Surface | Intended result | Current main | Source | Function | Visual | Screenshot | Action |
|---|---|---|---|---|---|---|---|---|---|
| RD-01 | Dock width | ~39–40px reference | 40px authority | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-02 | Panel width | ~250px default, resizable | 252px default | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-03 | Collapse arrow | Small, clear, restores last panel | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-04 | Properties | Primary panel route | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-05 | Layers | Primary panel route | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-06 | History | Primary panel route | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-07 | Reference | Creative panel route | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-08 | Compose | Creative panel route | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-09 | CHAT | Creative panel route | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-10 | Revision | Creative panel route | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-11 | Specialist | Advanced diagnostics isolated | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-12 | One active panel | Single panel authority | Runtime-covered | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-13 | Canvas/panel boundary | No gap/overlap | Corrected and Runtime-covered | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RD-14 | Panel visual density | Photoshop grammar, INK-specific content | Needs real visual audit | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |

## 8. Properties / Layers / History details

| ID | Surface | Intended result | Current main | Source | Function | Visual | Screenshot | Action |
|---|---|---|---|---|---|---|---|---|---|
| PL-01 | Properties Tool/Object/Geometry | Clear hierarchy | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| PL-02 | Layer reorder | Drag to reorder | Existing product feature; verify deployed | PASS | NOT_CHECKED | NOT_CHECKED | NOT_CHECKED | FIX |
| PL-03 | Layer add/duplicate/delete | Bottom toolbar | Present | PASS | NOT_CHECKED | NOT_CHECKED | NOT_CHECKED | FIX |
| PL-04 | Layer lock | Required from prior user request; verify presence/function | Needs explicit check | NOT_CHECKED | NOT_CHECKED | NOT_CHECKED | NOT_CHECKED | FIX |
| PL-05 | History depth | Useful step history; no excessive count requirement | Existing; needs deployed check | PASS | NOT_CHECKED | NOT_CHECKED | NOT_CHECKED | FIX |
| PL-06 | Selection actions | Immediate vs deep commands correctly separated | Structurally implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| PL-07 | Hidden handler proxies | Compatibility-only, not visible duplicates | Implemented | PASS | PASS | PASS | NOT_CHECKED | KEEP |

## 9. Canvas / workspace

| ID | Surface | Intended result | Current main | Source | Function | Visual | Screenshot | Action |
|---|---|---|---|---|---|---|---|---|---|
| CV-01 | Creation workspace | Full working space, visually dominant | Exists | PASS | PASS | FAIL/INCONSISTENT | FAIL | FIX |
| CV-02 | Layout workspace | A4-oriented workspace, subordinate mode | Exists | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| CV-03 | Workspace switch | Clear creation/layout distinction | Present | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| CV-04 | Canvas dominance | Panels do not consume unnecessary space | Runtime-covered | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| CV-05 | Fit / zoom | Persistent usable viewport controls | Present | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| CV-06 | Rotation | Visible compact control | Present | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| CV-07 | Fullscreen | Works and restores state | Runtime-covered structurally | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| CV-08 | A4 output setting | Correctly separated from infinite workspace | Existing | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| CV-09 | Canvas background hierarchy | Creation should not unexpectedly read as dark legacy workspace | Current startup/desktop authority conflicts visually | FAIL | PASS | FAIL | FAIL | FIX |

## 10. Typography / density / contrast

| ID | Surface | Intended result | Current main | Source | Function | Visual | Screenshot | Action |
|---|---|---|---|---|---|---|---|---|---|
| TY-01 | Font stack | Inter → Noto Sans TC → PingFang TC → Microsoft JhengHei → system | Implemented | PASS | NA | NOT_CHECKED | NOT_CHECKED | FIX |
| TY-02 | Normal controls | ~10px minimum accepted UI-MD | Implemented | PASS | NA | NOT_CHECKED | NOT_CHECKED | FIX |
| TY-03 | Metadata | >=9px only for secondary info | Implemented structurally | PASS | NA | NOT_CHECKED | NOT_CHECKED | FIX |
| TY-04 | CJK readability | No microtext/gray loss | Needs screenshot audit | PASS | NA | NOT_CHECKED | NOT_CHECKED | FIX |
| TY-05 | Contrast | Text/icons legible in actual deployed theme | Current dark overrides need visual recheck | PASS | NA | NOT_CHECKED | NOT_CHECKED | FIX |
| TY-06 | PS comfort reference | Comparable comfort/density, not merely exact pixel sizes | Not yet visually established | FAIL | NA | FAIL | FAIL | FIX |

## 11. Color / chrome / visual direction

| ID | Surface | Intended result | Current main | Source | Function | Visual | Screenshot | Action |
|---|---|---|---|---|---|---|---|---|---|
| CL-01 | Overall chrome | Lighter Figma-like visual weight + Photoshop workstation grammar | Current desktop override is heavily dark Photoshop-like | FAIL | NA | FAIL | FAIL | FIX |
| CL-02 | Canvas/chrome separation | Canvas clearly dominant | Inconsistent due dark startup / creation state | FAIL | NA | FAIL | FAIL | FIX |
| CL-03 | Accent color | Consistent teal/green, restrained | Present | PASS | NA | NOT_CHECKED | NOT_CHECKED | FIX |
| CL-04 | Panel surfaces | Enough contrast without visual heaviness | Needs visual rework/audit | PASS | NA | FAIL/NOT_CHECKED | FAIL | FIX |
| CL-05 | Desktop/mobile consistency | Same visual system adapted responsively | Structural rules exist; deployed comparison required | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |

## 12. Duplicate / Primary Home audit

| ID | Family | Primary Home target | Current state | Action |
|---|---|---|---|---|
| PH-01 | File | File menu | Implemented | KEEP after screenshot |
| PH-02 | Tool selection | Left Toolbar | Implemented | KEEP after screenshot |
| PH-03 | Immediate tool controls | Contextual Options | Implemented | KEEP after screenshot |
| PH-04 | Deep properties | Properties | Implemented | KEEP after screenshot |
| PH-05 | Panel navigation | Right Panel Dock | Implemented | KEEP after screenshot |
| PH-06 | Secondary panel route | Window menu | Missing functional menu | MISSING |
| PH-07 | Object quick actions | Contextual selection surface | Implemented; verify no visible duplicate strip | FIX |
| PH-08 | Layer actions | Layer bottom toolbar | Implemented; verify no duplicate visible controls | FIX |
| PH-09 | Undo/Redo | Compact top + shortcuts | Implemented; verify no other equal-status home | FIX |
| PH-10 | Workspace switching | Workspace switch | Implemented; menu route may be shortcut only | FIX |

## 13. Responsive / narrow desktop / mobile

| ID | Surface | Intended result | Current main | Source | Function | Visual | Screenshot | Action |
|---|---|---|---|---|---|---|---|---|
| RS-01 | 1280 desktop | Primary certification viewport | Structure passes Runtime; actual screenshot visually fails checklist | PASS | PASS | FAIL | FAIL | FIX |
| RS-02 | 960 narrow desktop | Meaningful canvas remains | Runtime-covered | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RS-03 | Mobile toolbar | Responsive alternative, not second taxonomy | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RS-04 | Mobile Inspector | Overlay, not permanent canvas shrink | Runtime-covered | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RS-05 | Mobile Export | Reachable | Runtime-covered | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| RS-06 | Text floor | No microtext under mobile constraints | Structurally asserted | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |

## 14. Fullscreen / status / system chrome

| ID | Surface | Intended result | Current main | Source | Function | Visual | Screenshot | Action |
|---|---|---|---|---|---|---|---|---|
| FS-01 | Fullscreen control | Clear entry/exit | Exists | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| FS-02 | Fullscreen layout | No overlap; panel/canvas retained | Runtime-covered | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| STB-01 | Status bar | Compact, viewport controls prioritized | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| STB-02 | Narrow status | Secondary info hides first | Implemented | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |
| STB-03 | Diagnostic leakage | Engineering diagnostics remain Specialist-only | Structural intent present | PASS | PASS | NOT_CHECKED | NOT_CHECKED | FIX |

## 15. Interaction integrity

| ID | Surface | Intended result | Action |
|---|---|---|---|
| IX-01 | Every visible button responds or is explicitly disabled | Mandatory | FIX |
| IX-02 | Menus close on Escape/outside click | Mandatory | FIX |
| IX-03 | Focus state visible | Mandatory | FIX |
| IX-04 | No duplicate DOM IDs | Existing QA PASS; retain | KEEP |
| IX-05 | No horizontal shell overflow | Existing QA PASS; retain | KEEP |
| IX-06 | Panel resize cursor/affordance | Verify deployed | FIX |
| IX-07 | Tooltips accurate | Audit | FIX |
| IX-08 | Keyboard shortcuts match labels | Audit | FIX |
| IX-09 | Disabled states truthful | Audit | FIX |
| IX-10 | No dead placeholder control in production UI | Mandatory | FIX |

## 16. Asset / delivery integrity

| ID | Surface | Intended result | Action |
|---|---|---|---|
| AS-01 | shell.template.html | Sole editable shell authority | KEEP |
| AS-02 | index.html | Generated from template | KEEP |
| AS-03 | index-standalone.html | Generated from template | KEEP |
| AS-04 | styles.css | One consolidated current presentation authority; remove stale conflicting legacy rules when touched | FIX |
| AS-05 | web-shell.js | Single shell/panel/menu authority | KEEP, extend only if required |
| AS-06 | service-worker first paint/cache | No stale shell causing visual flash; build identity updated for UI remediation | FIX |
| AS-07 | Web/Portable parity | Must remain exact by generator | KEEP |
| AS-08 | GitHub Pages deployed main | Must equal reviewed source | Mandatory gate |

## 17. Photoshop / Figma comparison checklist

This is not a style-copy checklist. It is the final visual grammar comparison.

| ID | Dimension | Target |
|---|---|---|
| PF-01 | Menu row | Photoshop-like editor hierarchy |
| PF-02 | Contextual options | Photoshop-like immediate tool options |
| PF-03 | Left rail | Photoshop-like compact tool rail |
| PF-04 | Right panels | Photoshop-like dock grammar |
| PF-05 | Canvas dominance | Photoshop-like central work area |
| PF-06 | Chrome weight | Lighter than Photoshop; closer to Figma restraint |
| PF-07 | Typography | Figma restraint + PS workstation readability |
| PF-08 | Spacing/grid | Consistent editor rhythm, no ad-hoc gaps |
| PF-09 | Menu completeness | Mature application menu behavior; no dead labels |
| PF-10 | INK-specific identity | Creative Loop / CHAT / Revision visible without overwhelming core editor |

## 18. Mandatory deployed screenshot set

No final visual closeout without all of these:

1. 1280×1024 default startup state immediately after load
2. 1280×1024 settled Creation workspace
3. 1280×1024 Properties open
4. 1280×1024 Layers open
5. 1280×1024 one Creative Loop panel open
6. 960px narrow desktop
7. Fullscreen
8. Mobile/compact representative viewport
9. Browser tab showing final favicon
10. Top-left brand mark at native deployed scale

Startup flash must additionally be checked by reload observation/video/rapid capture, not a settled screenshot only.

## 19. Closure protocol

An item may move to PASS only when all applicable evidence is present:

```text
SOURCE = PASS
FUNCTION = PASS
VISUAL = PASS
DEPLOYED_MAIN = PASS
SCREENSHOT = PASS
```

Runtime alone cannot supply VISUAL or SCREENSHOT PASS.

Overall remediation can close only when:

```text
OPEN MISSING = 0
OPEN FIX = 0
DEAD_VISIBLE_CONTROLS = 0
BRANDING = PASS
STARTUP_FIRST_PAINT = PASS
MENU_COMPLETENESS = PASS
DEPLOYED_SCREENSHOT_SET = PASS
PS/FIGMA/INK COMPARISON = PASS
```

## 20. Current known blockers from deployed main

Confirmed blockers at checklist creation:

- `BR-01` top-left mark not accepted/current;
- `BR-02` favicon not accepted/current;
- `ST-01` startup dark/black flash;
- `ST-03` initial workspace appearance inconsistent;
- `MN-02..09` visible menu labels without functional menus;
- `MN-11` fake affordance violation;
- `CL-01` desktop chrome visually too dark relative to agreed lighter direction;
- final deployed visual comparison was previously declared from non-raster Runtime evidence and is therefore invalid.

## 21. Next step

This checklist is audit authority only.

Do not implement fixes until UR completes the current-main audit and MR separately authorizes a remediation DEV work order.

Expected next transition:

`AUDIT_BASELINE → CURRENT_MAIN_AUDIT → REMEDIATION_SCOPE → MR AUTHORIZATION → DEV`
