# INK Final UI — AI Completion Checklist v1.0

STATUS: `AUTHORITATIVE_UI_CLOSURE_CHECKLIST / UR_OWNED`

DATE: 2026-09-26

Use this document after implementation as the mandatory AI self-audit. No final UI closure may be declared from visual impression alone.

Authorities:
- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
- `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
- `working/INK_UI_FINAL_PHOTOSHOP_ALIGNMENT_SPEC_v1.0.md`
- `working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md`
- `governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`

Completion rule:

```text
Every REQUIRED item = PASS
Every exception = explicitly documented with authority/reason
No visual-only PASS can override a failed source/runtime/interaction check
UI_COMPLETE = VERIFIED_ON_CURRENT_MAIN
```

Evidence codes:
- `SRC` source/static inspection
- `DOM` Runtime DOM/computed geometry
- `INT` interaction Runtime
- `PIX` screenshot/overlay/difference
- `RESP` responsive Runtime
- `HEALTH` engineering health report
- `USER` user visual/ergonomic review

---

# A. Baseline / authority

- [ ] A01 `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md` is the capability authority. [SRC]
- [ ] A02 Frozen counts remain `FORMAT_VERSION=4 / NAMED_TOOLS=22 / BOUNDED_EDIT_OPERATIONS=34`. [SRC]
- [ ] A03 No UI command claims capability outside the frozen baseline. [SRC]
- [ ] A04 No Core/Document/History/Revision/Geometry/CHAT semantics changed solely for UI. [SRC]
- [ ] A05 final UI branch is based/reconciled to current main before integration. [SRC]
- [ ] A06 exact current-main SHA is recorded before final Runtime. [SRC]

# B. Photoshop reference integrity

- [ ] B01 `ps-1.png` identity/hash matches locked reference. [SRC]
- [ ] B02 `ps-2.png` identity/hash matches locked reference. [SRC]
- [ ] B03 Photoshop taskbar exclusion uses normalized 1280×994 app crop. [PIX]
- [ ] B04 resizable panel values are treated as reference states, not hard global locks. [SRC]
- [ ] B05 Adobe official documentation is used for behavior questions. [SRC]
- [ ] B06 screenshot/measurement is used for captured geometry questions. [SRC]

# C. Top shell geometry

- [ ] C01 application/menu content = 24 px reference. [DOM][PIX]
- [ ] C02 first divider = 1 px. [DOM][PIX]
- [ ] C03 Options content = 35 px reference. [DOM][PIX]
- [ ] C04 second divider = 1 px. [DOM][PIX]
- [ ] C05 workspace origin = y 61 px. [DOM][PIX]
- [ ] C06 Tools, canvas and right Dock share the y=61 origin. [DOM]
- [ ] C07 no vertical shell gap/overlap/double divider. [PIX]

# D. Application menus

- [ ] D01 final top menus are File/Edit/Image/Layer/Type/Select/Object/View/Window/Help. [SRC][INT]
- [ ] D02 no dead top-level menu label exists. [INT]
- [ ] D03 obsolete top-level Brush menu is absent. [SRC][PIX]
- [ ] D04 no fake 3D menu exists. [SRC]
- [ ] D05 no normal Filter menu exists unless technical baseline is separately updated. [SRC]
- [ ] D06 one shared menu state controller owns all application menus. [SRC][HEALTH]
- [ ] D07 only one menu is open at a time. [INT]
- [ ] D08 outside click closes an open menu. [INT]
- [ ] D09 Escape closes and returns focus correctly. [INT]
- [ ] D10 keyboard navigation works for menu items. [INT]
- [ ] D11 separators/check/disabled states are visually coherent. [PIX][INT]
- [ ] D12 keyboard shortcut labels align/read correctly. [PIX]
- [ ] D13 desktop New/Open/Save duplicate top buttons are retired. [SRC][PIX]

# E. Contextual Options row

- [ ] E01 current tool/context controls drive the Options row. [INT]
- [ ] E02 Draw context exposes current tool identity. [INT]
- [ ] E03 Draw color control routes to existing color authority. [INT]
- [ ] E04 Draw size control routes to existing tool setting. [INT]
- [ ] E05 Draw opacity/preset controls appear only where supported. [INT]
- [ ] E06 Eraser context uses eraser-specific options. [INT]
- [ ] E07 Shape context exposes shape creation options. [INT]
- [ ] E08 Text context exposes font/immediate type controls. [INT]
- [ ] E09 selection context exposes only useful contextual operations. [INT]
- [ ] E10 Path/Node quick controls appear only during relevant edit state. [INT]
- [ ] E11 deep settings route to Properties rather than duplicating Inspector logic. [SRC][INT]
- [ ] E12 switching context produces no broken layout/overflow. [PIX][INT]

# F. Left Tools panel

- [ ] F01 Tools panel is edge-attached left. [DOM][PIX]
- [ ] F02 single-column visible reference is ~39 px + boundary. [DOM][PIX]
- [ ] F03 double-column visible reference is ~72 px + boundary. [DOM][PIX]
- [ ] F04 canvas begins directly after Tools divider. [DOM]
- [ ] F05 single/double mode uses the same tool membership. [INT]
- [ ] F06 Pen is present. [INT]
- [ ] F07 Pencil is present. [INT]
- [ ] F08 Marker is present. [INT]
- [ ] F09 Brush is present. [INT]
- [ ] F10 Airbrush is present. [INT]
- [ ] F11 Eraser is present. [INT]
- [ ] F12 Select is present. [INT]
- [ ] F13 Lasso is present. [INT]
- [ ] F14 Shape is present. [INT]
- [ ] F15 Text is present. [INT]
- [ ] F16 Image is present. [INT]
- [ ] F17 Pan is present. [INT]
- [ ] F18 five Draw tools share one flyout/group authority. [INT]
- [ ] F19 grouped tool shows a flyout indicator. [PIX]
- [ ] F20 active tool state is unmistakable. [PIX][INT]
- [ ] F21 hover/focus states work. [INT]
- [ ] F22 tool density is comparable to Photoshop reference. [PIX][USER]
- [ ] F23 no one-shot command is incorrectly occupying a Tools slot. [SRC]
- [ ] F24 mobile tool duplicates are classified only as responsive routes. [SRC][RESP]

# G. Canvas/workbench

- [ ] G01 canvas is visually dominant. [PIX][USER]
- [ ] G02 canvas starts after left Tools boundary. [DOM]
- [ ] G03 canvas ends before right Dock/panel boundary. [DOM]
- [ ] G04 canvas fills remaining width when right panel resizes. [DOM][INT]
- [ ] G05 no primary desktop floating-card shell obstructs canvas. [PIX]
- [ ] G06 infinite creation space behavior remains intact. [INT]
- [ ] G07 layout/A4 viewport behavior remains intact. [INT]

# H. Right Dock / panel authority

- [ ] H01 collapsed Dock is edge-attached right. [DOM][PIX]
- [ ] H02 collapsed reference is ~39 px + divider. [DOM][PIX]
- [ ] H03 panel width is resizable. [INT]
- [ ] H04 valid resize does not count as failure merely for differing from 252 px. [SRC]
- [ ] H05 canvas reflows with panel width. [DOM][INT]
- [ ] H06 no panel/canvas overlap in normal desktop state. [PIX][INT]
- [ ] H07 no external gap exists at right edge. [PIX]
- [ ] H08 one panel state authority owns Dock/Window/expanded state. [SRC][HEALTH]
- [ ] H09 active panel state is visible. [PIX]
- [ ] H10 clicking active panel can collapse according to accepted behavior. [INT]
- [ ] H11 panel body scrolls when content exceeds height. [INT]
- [ ] H12 panel header/tab density aligns with Photoshop grammar. [PIX][USER]
- [ ] H13 multiple grouped/stacked panel presentation, if used, remains under same state authority. [SRC][INT]
- [ ] H14 no duplicate floating edge opener exists. [SRC][PIX]

# I. Panel inventory / Window convergence

- [ ] I01 Properties exists in Dock and Window. [INT]
- [ ] I02 Layers exists in Dock and Window. [INT]
- [ ] I03 History exists in Dock and Window. [INT]
- [ ] I04 Navigator exists in Dock and Window. [INT]
- [ ] I05 Pages exists in Dock and Window. [INT]
- [ ] I06 Libraries exists in Dock and Window. [INT]
- [ ] I07 Reference exists in Dock and Window. [INT]
- [ ] I08 Compose exists in Dock and Window. [INT]
- [ ] I09 CHAT exists in Dock and Window. [INT]
- [ ] I10 Revision exists in Dock and Window. [INT]
- [ ] I11 Specialist exists as advanced/de-emphasized route. [INT][PIX]
- [ ] I12 Dock and Window route each panel to exactly the same state authority. [INT]

# J. Properties

- [ ] J01 selected object state appears in Properties. [INT]
- [ ] J02 transform values appear/refine existing transform state. [INT]
- [ ] J03 fill/stroke/opacity appearance routes correctly. [INT]
- [ ] J04 material apply/remove state routes correctly. [INT]
- [ ] J05 Path/Node state appears when relevant. [INT]
- [ ] J06 Frame/Layout state appears when relevant. [INT]
- [ ] J07 LayoutItem state appears when relevant. [INT]
- [ ] J08 Component instance state/allowed overrides appear when relevant. [INT]
- [ ] J09 document/layout properties have a clear home. [INT]
- [ ] J10 Properties does not duplicate mutation authority. [SRC]

# K. Layers

- [ ] K01 layer hierarchy displays correctly. [INT]
- [ ] K02 canvas selection and Layers selection synchronize. [INT]
- [ ] K03 visibility action works. [INT]
- [ ] K04 lock action works where supported. [INT]
- [ ] K05 opacity route works where supported. [INT]
- [ ] K06 add layer works. [INT]
- [ ] K07 duplicate layer works. [INT]
- [ ] K08 delete layer works. [INT]
- [ ] K09 drag reorder works. [INT]
- [ ] K10 hierarchy/reparent interaction uses existing authority. [INT]
- [ ] K11 compact panel-local footer/actions follow Photoshop grammar. [PIX]
- [ ] K12 long list scroll behavior works. [INT]
- [ ] K13 Layer menu and panel changes converge on one document state. [INT]

# L. History

- [ ] L01 History uses existing History authority. [SRC]
- [ ] L02 older states are above newer states. [INT][PIX]
- [ ] L03 current state is visibly selected. [PIX]
- [ ] L04 clicking an earlier state restores it. [INT]
- [ ] L05 later states visually communicate their future/discard status. [PIX][INT]
- [ ] L06 subsequent editing from earlier state follows existing semantics. [INT]
- [ ] L07 Undo converges with History. [INT]
- [ ] L08 Redo converges with History. [INT]
- [ ] L09 History limit control is panel-local/options. [INT]
- [ ] L10 History is not conflated with Revision. [SRC][PIX]
- [ ] L11 no unsupported Photoshop snapshot/non-linear semantics were invented. [SRC]

# M. Navigator

- [ ] M01 Navigator panel opens via Window. [INT]
- [ ] M02 Navigator panel opens via Dock. [INT]
- [ ] M03 thumbnail/overview renders meaningful current content extent. [INT][PIX]
- [ ] M04 viewport proxy rectangle is visible. [PIX]
- [ ] M05 proxy reflects current main-canvas viewport. [INT]
- [ ] M06 canvas pan updates proxy. [INT]
- [ ] M07 canvas zoom updates proxy. [INT]
- [ ] M08 dragging proxy pans canvas. [INT]
- [ ] M09 clicking thumbnail repositions canvas view. [INT]
- [ ] M10 zoom percentage/readout is present. [INT]
- [ ] M11 Zoom Out works. [INT]
- [ ] M12 zoom slider works. [INT]
- [ ] M13 Zoom In works. [INT]
- [ ] M14 Navigator uses existing viewport/document/render authority. [SRC]
- [ ] M15 Navigator does not create a second camera/renderer/document state. [SRC]
- [ ] M16 infinite-canvas overview uses finite content/artboard extent logically. [INT]

# N. Pages

- [ ] N01 Pages is normalized into Window/Dock grammar. [INT]
- [ ] N02 page list is usable. [INT]
- [ ] N03 page selection works. [INT]
- [ ] N04 Add Page remains panel-local. [INT]
- [ ] N05 old permanent top Pages control is removed or explicitly secondary only. [SRC][PIX]
- [ ] N06 no duplicate Pages state owner exists. [SRC]

# O. Libraries / Connector-005

- [ ] O01 Libraries panel exists. [INT]
- [ ] O02 search_ink_library is the technical search authority. [SRC]
- [ ] O03 search input works. [INT]
- [ ] O04 family filtering works. [INT]
- [ ] O05 Component results can be searched/inspected. [INT]
- [ ] O06 Material results can be searched/inspected. [INT]
- [ ] O07 Recipe results can be searched/inspected. [INT]
- [ ] O08 Parametric-structure results can be searched/inspected. [INT]
- [ ] O09 Reference-derived-structure results can be searched/inspected. [INT]
- [ ] O10 result details/inspect are read-only where required. [INT]
- [ ] O11 component reuse routes to governed component instance creation. [INT]
- [ ] O12 material reuse routes to governed material apply. [INT]
- [ ] O13 recipe search does not invent autonomous mutation. [SRC][INT]
- [ ] O14 no full Library Manager UI is implied. [PIX][SRC]
- [ ] O15 no remote/cloud asset search is exposed. [SRC]
- [ ] O16 no automatic tagging/classification is exposed. [SRC]

# P. Reference

- [ ] P01 Reference panel imports local reference through accepted authority. [INT]
- [ ] P02 reference decomposition/vectorization works through accepted authority. [INT]
- [ ] P03 advisory research/readout stays read-only where required. [INT]
- [ ] P04 engineering evidence package tools are not cluttering normal Reference surface. [PIX]

# Q. Compose

- [ ] Q01 Compose shows structural/composition state clearly. [INT]
- [ ] Q02 Repeat/parametric state is visible where relevant. [INT]
- [ ] Q03 mutation routes remain existing Object/Repeat authorities. [SRC]
- [ ] Q04 Compose does not create a second parametric engine. [SRC]

# R. CHAT

- [ ] R01 CHAT panel open/closed state does not gate CHAT capability. [INT]
- [ ] R02 proposal route works. [INT]
- [ ] R03 approval route works. [INT]
- [ ] R04 execute route remains governed. [INT]
- [ ] R05 Creative Plan/use_ink route works at accepted scope. [INT]
- [ ] R06 History tools remain same authority when called by CHAT. [INT]
- [ ] R07 Revision tools remain same authority when called by CHAT. [INT]
- [ ] R08 Library search can be used from CHAT without creating second library. [INT]
- [ ] R09 provider/credential engineering settings are not ordinary CHAT clutter. [PIX]
- [ ] R10 CHAT does not become a hidden second editor engine. [SRC]

# S. Revision

- [ ] S01 Revision list works. [INT]
- [ ] S02 capture works. [INT]
- [ ] S03 restore works. [INT]
- [ ] S04 provenance/readout remains available. [INT]
- [ ] S05 accepted structural compare works. [INT]
- [ ] S06 UI does not claim rendered overlay/difference if not technically guaranteed. [SRC][PIX]
- [ ] S07 Revision remains distinct from History. [SRC][PIX]

# T. Frozen 34 bounded edit operations

The AI must verify the placement map has not lost any operation.

- [ ] T01 path.repaint.v1 reachable via accepted Appearance route.
- [ ] T02 path.material.apply.v1 reachable.
- [ ] T03 path.material.remove.v1 reachable.
- [ ] T04 object.translate.v1 reachable.
- [ ] T05 path.simplify.v1 reachable.
- [ ] T06 path.refine.v1 reachable.
- [ ] T07 path.create.v1 reachable.
- [ ] T08 path.edit.v1 reachable.
- [ ] T09 object.rotate.v1 reachable.
- [ ] T10 object.clone.v1 reachable.
- [ ] T11 repeat.radial.v1 reachable.
- [ ] T12 boolean.apply.v1 reachable.
- [ ] T13 group.create.v1 reachable.
- [ ] T14 object.reparent.v1 reachable.
- [ ] T15 frame.create.v1 reachable.
- [ ] T16 text.create.v1 reachable.
- [ ] T17 text.edit.v1 reachable.
- [ ] T18 svg.import.v1 reachable.
- [ ] T19 object.resize.v1 reachable.
- [ ] T20 object.scale.v1 reachable.
- [ ] T21 object.order.v1 reachable.
- [ ] T22 repeat.mirror.v1 reachable.
- [ ] T23 repeat.grid.v1 reachable.
- [ ] T24 layout.frame.set.v1 reachable.
- [ ] T25 layout.frame.remove.v1 reachable.
- [ ] T26 layout.item.set.v1 reachable.
- [ ] T27 layout.item.remove.v1 reachable.
- [ ] T28 component.register.v1 reachable.
- [ ] T29 component.instance.create.v1 reachable.
- [ ] T30 component.override.set.v1 reachable at accepted override scope.
- [ ] T31 component.override.reset.v1 reachable.
- [ ] T32 component.instance.detach.v1 reachable.
- [ ] T33 component.definition.duplicate.v1 reachable.
- [ ] T34 component.reference.repair.v1 reachable only in Specialist/diagnostic route.

For T01–T34:
`reachable` may mean direct manipulation, menu, panel or governed CHAT route exactly as specified by Function Placement Map. It does not require a duplicate visible button.

# U. Frozen 22 named tools

- [ ] U01 get_ink_capabilities retained.
- [ ] U02 get_ink_context retained.
- [ ] U03 get_ink_selection retained.
- [ ] U04 inspect_ink_objects retained.
- [ ] U05 decompose_ink_reference retained.
- [ ] U06 propose_ink_edit retained.
- [ ] U07 approve_ink_edit retained.
- [ ] U08 execute_ink_edit retained.
- [ ] U09 get_ink_history retained.
- [ ] U10 undo_ink retained.
- [ ] U11 redo_ink retained.
- [ ] U12 get_ink_revisions retained.
- [ ] U13 capture_ink_revision retained.
- [ ] U14 restore_ink_revision retained.
- [ ] U15 get_ink_preview retained.
- [ ] U16 inspect_ink_output retained.
- [ ] U17 release_ink_output retained.
- [ ] U18 describe_ink_capability retained.
- [ ] U19 use_ink retained.
- [ ] U20 import_ink_reference retained.
- [ ] U21 export_ink_asset retained.
- [ ] U22 search_ink_library retained.

No UI refactor may silently remove or rename these tool authorities.

# V. 29 select-control disposition

- [ ] V01 renderEngineMode remains Specialist.
- [ ] V02 fontFamily is Text Options/Properties.
- [ ] V03 historyLimit is History-local.
- [ ] V04 pathStrokePreset is Draw/Path Options/Properties.
- [ ] V05 aiStartupMode remains Specialist.
- [ ] V06 aiProvider remains Specialist.
- [ ] V07 aiAuthMethod remains Specialist.
- [ ] V08 aiDataPolicy is CHAT advanced/privacy.
- [ ] V09 aiImagePolicy is CHAT advanced/privacy.
- [ ] V10 aiLoggingPolicy is CHAT advanced/privacy.
- [ ] V11 aiPreviewQuality is advanced.
- [ ] V12 programSafetyMode remains Specialist.
- [ ] V13 referenceRunner remains Specialist evidence tooling.
- [ ] V14 studioSkeleton is Compose/Recipe advanced.
- [ ] V15 adjustmentType is not promoted to normal UI under current baseline.
- [ ] V16 filterType is not promoted to normal UI under current baseline.
- [ ] V17 paintBrush stays advanced Stroke Session/appropriate brush route.
- [ ] V18 stylusTestPattern remains Specialist.
- [ ] V19 calibrationProfileSelect remains Specialist.
- [ ] V20 artworkQaBenchmark remains Specialist.
- [ ] V21 artboardPreset is Document/Layout Properties.
- [ ] V22 artboardOrientation is Document/Layout Properties.
- [ ] V23 artboardPpi is Document/Layout Properties.
- [ ] V24 artboardUnit is Document/Layout Properties.
- [ ] V25 paperType is Document/Layout Properties.
- [ ] V26 exportFormat is Export-local.
- [ ] V27 exportScope is Export-local.
- [ ] V28 exportScale is Export-local.
- [ ] V29 exportPpi is Export-local.

# W. Specialist / non-normal UI

- [ ] W01 provider/credential configuration is Specialist.
- [ ] W02 raw JSON command UI is Specialist.
- [ ] W03 GPU validation is Specialist.
- [ ] W04 renderer mode is Specialist.
- [ ] W05 Program/Recipe engineering is Specialist.
- [ ] W06 original-software evidence package tooling is Specialist.
- [ ] W07 Stroke Session engineering is Specialist.
- [ ] W08 stylus calibration/device QA is Specialist.
- [ ] W09 browser benchmark is Specialist.
- [ ] W10 artwork QA export is Specialist.
- [ ] W11 release/storage/update diagnostics are Specialist/Help diagnostics.
- [ ] W12 component reference repair is Specialist.
- [ ] W13 legacy Mask/Adjustment/Filter controls do not create ordinary UI authority.

# X. Explicitly absent features

- [ ] X01 no full Library Manager.
- [ ] X02 no cloud/remote library search.
- [ ] X03 no AI automatic tagging/classification.
- [ ] X04 no general Variables/Tokens system.
- [ ] X05 no general Styles system.
- [ ] X06 no Component Variants system.
- [ ] X07 no general Grid Layout engine.
- [ ] X08 no CRDT/multiplayer library state.
- [ ] X09 no automatic Creative Memory writes.
- [ ] X10 no automatic Research fetch/scrape.
- [ ] X11 no autonomous asset application.
- [ ] X12 no external connector transport UI.
- [ ] X13 no prototype-interaction system.
- [ ] X14 no design-to-code drawing-core UI.

# Y. View / Fullscreen / status

- [ ] Y01 Fullscreen works and reflects state. [INT]
- [ ] Y02 fit content works. [INT]
- [ ] Y03 reset view works. [INT]
- [ ] Y04 zoom in works. [INT]
- [ ] Y05 zoom out works. [INT]
- [ ] Y06 reset rotation works. [INT]
- [ ] Y07 status/readout is low-noise. [PIX][USER]
- [ ] Y08 status controls share viewport authority with Navigator/View. [SRC]
- [ ] Y09 no redundant top-right inspector/properties controls remain. [PIX]
- [ ] Y10 Advanced shortcut visibly reflects Properties state. [INT]

# Z. Typography / visual system / branding

- [ ] Z01 target is a light-gray Photoshop-style workstation. [PIX][USER]
- [ ] Z02 chrome hierarchy is quiet and readable. [PIX]
- [ ] Z03 major desktop workstation surfaces are not floating rounded cards. [PIX]
- [ ] Z04 1px boundaries are consistent. [PIX]
- [ ] Z05 shadows are restrained. [PIX]
- [ ] Z06 active accent is used sparingly. [PIX]
- [ ] Z07 normal command text is not too small/dim. [PIX][USER]
- [ ] Z08 one normal UI font authority remains. [HEALTH]
- [ ] Z09 no hard-coded normal UI px font-size outside tokens. [HEALTH]
- [ ] Z10 icons have consistent box/stroke grammar. [PIX]
- [ ] Z11 active/hover/focus/disabled states are coherent. [INT][PIX]
- [ ] Z12 one visible INK logo authority. [SRC][PIX]
- [ ] Z13 one favicon authority and current favicon displayed. [SRC][PIX]
- [ ] Z14 Adobe logo/proprietary UI artwork is not copied. [SRC]
- [ ] Z15 first visible frame is light/current; black flash = 0. [INT][PIX]

# AA. Responsive

- [ ] AA01 width modes remain exactly 3. [HEALTH]
- [ ] AA02 Desktop Wide >1120 works. [RESP]
- [ ] AA03 Desktop Narrow 761–1120 works. [RESP]
- [ ] AA04 Compact <=760 works. [RESP]
- [ ] AA05 no unauthorized fourth breakpoint family. [HEALTH]
- [ ] AA06 menu/options do not overflow at 960×800. [RESP][PIX]
- [ ] AA07 panel opening leaves usable canvas at narrow desktop. [RESP]
- [ ] AA08 compact/mobile controls preserve core semantics. [RESP]
- [ ] AA09 mobile duplicates are responsive routes, not second authorities. [SRC]
- [ ] AA10 touch targets remain usable. [RESP]

# AB. Engineering health

- [ ] AB01 new presentation `!important` = 0. [HEALTH]
- [ ] AB02 presentation `!important` total remains 0. [HEALTH]
- [ ] AB03 new unauthorized width threshold = 0. [HEALTH]
- [ ] AB04 panel state owners = 1. [HEALTH]
- [ ] AB05 menu state controllers = 1. [HEALTH]
- [ ] AB06 duplicate literal DOM IDs = 0. [HEALTH]
- [ ] AB07 visible duplicate Primary Homes = 0. [HEALTH]
- [ ] AB08 dead visible controls = 0. [HEALTH]
- [ ] AB09 hand-edited generated shell = 0. [HEALTH]
- [ ] AB10 final/hotfix override layer added = 0. [HEALTH]
- [ ] AB11 Web/Portable parity = PASS. [HEALTH]
- [ ] AB12 first paint = PASS. [HEALTH]
- [ ] AB13 Core mutation = 0. [HEALTH]
- [ ] AB14 styles.css before/after characters recorded. [HEALTH]
- [ ] AB15 tracked selector definition counts recorded. [HEALTH]

# AC. Visual comparison package

- [ ] AC01 1280×1024 current-main Runtime screenshot exists.
- [ ] AC02 960×800 current-main Runtime screenshot exists.
- [ ] AC03 compact/mobile evidence exists.
- [ ] AC04 top 61px crop exists.
- [ ] AC05 left single-toolbar crop exists.
- [ ] AC06 left double-toolbar crop exists.
- [ ] AC07 collapsed right Dock crop exists.
- [ ] AC08 expanded right panel crop exists.
- [ ] AC09 History multi-state screenshot exists.
- [ ] AC10 Navigator normal screenshot exists.
- [ ] AC11 Navigator after pan/zoom screenshot exists.
- [ ] AC12 Libraries search/result screenshot exists.
- [ ] AC13 Photoshop/INK major-edge overlay exists.
- [ ] AC14 difference/edge comparison exists.
- [ ] AC15 Runtime computed geometry report exists.
- [ ] AC16 browser viewport/zoom/DPR used for evidence are recorded.

# AD. Known old user issues — regression closure

- [ ] AD01 startup black flash absent.
- [ ] AD02 right panel does not default-open against accepted current initial state unless explicitly intended.
- [ ] AD03 right panel can always be closed/collapsed.
- [ ] AD04 typography is sufficiently bright/large.
- [ ] AD05 left Tools is flush to left edge.
- [ ] AD06 favicon is current.
- [ ] AD07 Advanced control visibly indicates on/off/open state.
- [ ] AD08 narrow browser layout is consistent with full desktop grammar.
- [ ] AD09 right-top control cluster is no longer chaotic/redundant.
- [ ] AD10 Properties/Inspector duplicate openers are gone.
- [ ] AD11 tool icons/control density visually match the Photoshop target.
- [ ] AD12 panel width is resizable without covering/breaking canvas.

# AE. Final authority/count reconciliation

- [ ] AE01 `NAMED_TOOLS_PLACED = 22/22`.
- [ ] AE02 `BOUNDED_EDIT_OPERATIONS_PLACED = 34/34`.
- [ ] AE03 `PERSISTENT_TOOL_MODES_PLACED = 12/12`.
- [ ] AE04 `SELECT_CONTROLS_PLACED = 29/29`.
- [ ] AE05 current 212 static-button families have no unclassified residue.
- [ ] AE06 `C3_PENDING = 0`.
- [ ] AE07 `UNCLASSIFIED_FUNCTIONS = 0`.
- [ ] AE08 `DEAD_VISIBLE_CONTROLS = 0`.
- [ ] AE09 `DUPLICATE_PRIMARY_HOME = 0`.
- [ ] AE10 `FAKE_VISIBLE_FEATURES = 0`.

# AF. Final current-main closure

- [ ] AF01 implementation branch source review = PASS.
- [ ] AF02 UI branch interaction review = PASS.
- [ ] AF03 UI branch health review = PASS.
- [ ] AF04 clean integration to current main completed.
- [ ] AF05 exact integrated-main SHA recorded.
- [ ] AF06 integrated-main Runtime UI suite = PASS.
- [ ] AF07 integrated-main screenshots inspected.
- [ ] AF08 integrated-main health review = PASS.
- [ ] AF09 Photoshop alignment review = PASS.
- [ ] AF10 USER visual acceptance/revision completed.
- [ ] AF11 all checklist items are closed; no silent TODO remains.

Final result may be declared only as:

```text
OPEN_CHECKLIST_ITEMS = 0
NAMED_TOOLS_PLACED = 22 / 22
BOUNDED_EDIT_OPERATIONS_PLACED = 34 / 34
SELECT_CONTROLS_PLACED = 29 / 29
C3_PENDING = 0
UNCLASSIFIED_FUNCTIONS = 0
DEAD_VISIBLE_CONTROLS = 0
DUPLICATE_PRIMARY_HOME = 0
USER_REPORTED_OLD_ISSUES = 0
PHOTOSHOP_ALIGNMENT_REVIEW = PASS
FUNCTIONAL_RUNTIME = PASS
UI_HEALTH = PASS
INTEGRATED_CURRENT_MAIN = PASS
UI_COMPLETE = VERIFIED_ON_CURRENT_MAIN
```
