# INK Final UI — AI Completion Checklist v1.0

STATUS: `FINAL_RUNTIME_PASS / UR_FULL_AUDIT_RECORDED / FINDINGS_OPEN / UI_COMPLETE_HOLD`

DATE: 2026-09-28

ACTIVE_AUDIT_DIRECTIVE:
`ACTIVE/INK_UI_FINAL_CHECKLIST_AUDIT_DIRECTIVE_v1.0.md`

## UI-C DEV source checkpoint — 2026-09-28

This checklist is the mandatory final UI audit gate. UI-C was reviewed and promoted by UR and MR final exact-SHA Runtime passed, but that does not substitute for a complete item-by-item checklist disposition. Every required item below must be explicitly classified PASS / FAIL / N/A with evidence or reason before UI_COMPLETE may be declared.

```text
SOURCE_CLOSURE_HEAD = d5fccb906bce3201f0f9e829f71fb92d5dc786ef
SOURCE_STATIC_QA = 50 / 50 PASS
FAMILY_PLACEMENT = 64 / 64 PRESERVED
NORMALIZED_ATOMICS = 501 / 501 PRESERVED
PUI = 74 / 74 PRESERVED
GAPS = 34 / 34 PRESERVED
PREDECESSOR_STATIC_BUTTON_FAMILIES = 212 ACCOUNTED
SELECT_CONTROLS = 29 / 29 ACCOUNTED
NAMED_TOOLS = 22 / 22 PRESERVED
BOUNDED_EDIT_OPERATIONS = 34 / 34 PRESERVED
FORMAT_VERSION = 4 / UNCHANGED
CENTRAL_RUNTIME = PASS / RUN_36445204976 / HISTORICAL_TESTED_SHA_24d3b3f607a17b3cb9331ec3635b34d804ee445b
RUNTIME_DEBT = OPEN / DEFERRED_TO_FINAL_CHECKLIST_BATCH / CURRENT_PRODUCT_PROMOTION_c66b1eba2376f01cfba14f71b6f29d7e2fa022e4
FINAL_RUNTIME_TESTED_SHA = 24d3b3f607a17b3cb9331ec3635b34d804ee445b
LAST_FINAL_RUNTIME_COVERS_CURRENT_PRODUCT = NO
UI_BROWSER = 110 / 110 PASS
CLOSURE_BROWSER = PASS
GEOMETRY_BROWSER = PASS
CREATIVE_BROWSER = PASS
UR_VISUAL_RUNTIME_REVIEW = PARTIAL / UI_C_PROMOTED
UR_FULL_CHECKLIST_AUDIT = RECORDED / FINDINGS_OPEN
UNREVIEWED_CHECKLIST_ITEMS = 0
UI_COMPLETE = HOLD
```



> **FINAL AUDIT HOLD**
>
> The final Runtime is PASS, but this checklist still contains undispositioned items. Any `[ ]` required item is OPEN until UR explicitly records PASS / FAIL / N/A with evidence or reason. Runtime PASS and summary closure evidence do not waive this gate.


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
UI_COMPLETE = ONLY_AFTER_FULL_CHECKLIST_AUDIT + USER_VISUAL_ACCEPTANCE + REQUIRED_RUNTIME_EVIDENCE
```

## Mandatory machine-enforceable closure rule

```text
RUNTIME_PASS != UI_COMPLETE

FOR_EACH_REQUIRED_CHECKLIST_ITEM:
  disposition MUST BE one of PASS / FAIL / N_A
  evidence_or_reason MUST NOT BE EMPTY

UNREVIEWED_CHECKLIST_ITEMS = 0
OPEN_CHECKLIST_ITEMS = 0
FAIL_ITEMS = 0
USER_VISUAL_ACCEPTANCE = COMPLETE
ONLY_THEN UI_COMPLETE = YES
```

Any automation, MR, UR or assistant must block completion if the checklist still contains required items without disposition.

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

- [ ] D01 final top menus are File/Edit/Image/Layer/Type/Select/Filter/Object/View/Window/Help. [SRC][INT]
- [ ] D02 no dead top-level menu label exists. [INT]
- [ ] D03 obsolete top-level Brush menu is absent. [SRC][PIX]
- [ ] D04 no fake 3D menu exists. [SRC]
- [ ] D05 promoted Filter menu is present and routes only accepted C25/P1-F filter authority; no unbacked filter chrome exists. [SRC][INT]
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
- [ ] V15 Adjustments normal UI is provided by the promoted Adjustments panel/Image route; legacy adjustmentType must not create a second authority.
- [ ] V16 Filter normal UI is provided by the promoted Filter menu/dialog/gallery routes; legacy filterType must not create a second authority.
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
- [ ] W13 legacy Mask/Adjustment/Filter controls do not create a second authority beside the promoted normal UI routes.

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

# AG. Photoshop coverage-disposition audit

This section verifies that every major Photoshop workstation concept was either implemented, adapted, or explicitly excluded/deferred rather than forgotten.

- [ ] AG01 Application/menu bar disposition satisfied.
- [ ] AG02 Options bar disposition satisfied.
- [ ] AG03 Tools panel disposition satisfied.
- [ ] AG04 single/double toolbar disposition satisfied.
- [ ] AG05 tool flyout/group disposition satisfied.
- [ ] AG06 toolbar customization/Extra Tools remains explicitly deferred unless separately authorized.
- [ ] AG07 color-swatch behavior uses existing color authority; no unsupported second color model.
- [ ] AG08 document/canvas workspace disposition satisfied.
- [ ] AG09 multi-document tabs are not invented without baseline authority.
- [ ] AG10 Photoshop Contextual Task Bar is not duplicated; INK uses Options/Properties/CHAT.
- [ ] AG11 right Dock disposition satisfied.
- [ ] AG12 panel resize disposition satisfied.
- [ ] AG13 panel grouping/stacking disposition satisfied.
- [ ] AG14 primary floating panels remain deferred unless separately authorized.
- [ ] AG15 Window menu convergence satisfied.
- [ ] AG16 collapsed icon Dock satisfied.
- [ ] AG17 Tab hide/show-all-panels remains explicitly optional/later unless authorized.
- [ ] AG18 full workspace-layout manager remains deferred.
- [ ] AG19 Properties disposition satisfied.
- [ ] AG20 Layers disposition satisfied.
- [ ] AG21 History disposition satisfied.
- [ ] AG22 Navigator disposition satisfied.
- [ ] AG23 Libraries adaptation satisfied without creating full Library Manager.
- [ ] AG24 Pages INK-specific panel disposition satisfied.
- [ ] AG25 Reference panel disposition satisfied.
- [ ] AG26 Compose panel disposition satisfied.
- [ ] AG27 CHAT panel disposition satisfied.
- [ ] AG28 Revision panel disposition satisfied.
- [ ] AG29 fullscreen/screen-mode disposition satisfied.
- [ ] AG30 zoom/status disposition satisfied.
- [ ] AG31 ruler / guide / snapping workstation surface satisfies the dedicated mandatory audit below and uses existing P1-C/C08 authorities. [SRC][INT][PIX]
- [ ] AG32 no Photoshop notification/account bell UI was copied.
- [ ] AG33 no Discover/tutorial panel was copied as a required editor feature.
- [ ] AG34 no Photoshop Generative Contextual UI was duplicated over CHAT.
- [ ] AG35 promoted Filter menu is reconciled to Photoshop grammar and exposes only accepted C25/P1-F capability.
- [ ] AG36 no historical 3D menu was created.
- [ ] AG37 no Adobe proprietary logo/icon asset was copied.

# AI. Ruler / guide / snapping mandatory audit

This is a high-priority workstation requirement. P1-C Core existence is necessary but not sufficient for UI closure.

- [ ] AI01 top ruler is present, aligned to the active canvas/workspace coordinate system, and updates correctly with pan/zoom. [DOM][INT][PIX]
- [ ] AI02 left ruler is present, aligned to the same coordinate authority, and updates correctly with pan/zoom. [DOM][INT][PIX]
- [ ] AI03 horizontal guides can be created by dragging directly from the ruler. [INT][PIX]
- [ ] AI04 vertical guides can be created by dragging directly from the ruler. [INT][PIX]
- [ ] AI05 guides can be moved, deleted, locked, shown and hidden through one guide authority. [SRC][INT]
- [ ] AI06 object edges and centers snap to guides with visible snap feedback. [INT][PIX]
- [ ] AI07 object edges and centers snap to other objects using the accepted smart-snap authority. [INT][PIX]
- [ ] AI08 grid snapping works and converges with the same global snap state. [INT]
- [ ] AI09 angle snapping works and does not conflict with positional snapping. [INT]
- [ ] AI10 equal-distance / equal-spacing snapping works on X/Y and displays actionable visual spacing feedback. [INT][PIX]
- [ ] AI11 movement displays useful live distance / position information without becoming persistent UI noise. [INT][PIX][USER]
- [ ] AI12 global Snap on/off control exists and immediately governs the accepted snap authority. [INT]
- [ ] AI13 Snap To category controls exist for the supported targets rather than requiring all snap classes at once. [INT]
- [ ] AI14 temporary snap bypass works during direct manipulation without changing the saved global setting. [INT]
- [ ] AI15 one documented snap tolerance / hysteresis policy is used across guide/object/grid/equal-distance snapping. [SRC][INT]
- [ ] AI16 snapping does not visibly jitter, oscillate between competing candidates, or trap the pointer near threshold boundaries. [INT][USER]
- [ ] AI17 persistent guides survive accepted save/load/reopen flow after P1 Integration wiring. [INT]
- [ ] AI18 guide mutations that are document mutations converge with existing History/Undo/Redo semantics. [SRC][INT]
- [ ] AI19 snapping changes object transforms through existing transform/direct-manipulation authority; no second transform state owner exists. [SRC]
- [ ] AI20 no second guide/snap/layout engine was introduced for UI convenience. [SRC][HEALTH]

Required closure:

```text
RULER_GUIDE_SNAP_12_REQUIRED_BEHAVIORS = PASS
GUIDE_PERSISTENCE = PASS
GUIDE_HISTORY_CONVERGENCE = PASS
SNAP_AUTHORITY_COUNT = 1
SNAP_JITTER_REGRESSION = 0
```

# AH. Panel tabs / panel menu / status-strip audit

- [ ] AH01 every grouped panel has a clearly defined active/inactive tab state.
- [ ] AH02 panel tab hover/focus behavior is defined and verified.
- [ ] AH03 panel header/tab density is measured against the Photoshop reference.
- [ ] AH04 panel options menu trigger has one consistent visual location.
- [ ] AH05 every visible panel-menu trigger opens real commands; dead triggers = 0.
- [ ] AH06 panel-local menus do not duplicate application-wide command authority.
- [ ] AH07 frequent panel actions remain body/footer actions rather than being hidden unnecessarily.
- [ ] AH08 Layers panel-menu disposition is explicit.
- [ ] AH09 History panel-menu disposition is explicit.
- [ ] AH10 Navigator panel-menu disposition is explicit.
- [ ] AH11 Pages/Libraries/Reference/Compose/CHAT/Revision/Specialist panel-menu disposition is explicit.
- [ ] AH12 panel body scrolling and footer boundaries are verified.
- [ ] AH13 group splitter geometry/interaction is verified.
- [ ] AH14 full-width generic status bar is not added without an explicit information case.
- [ ] AH15 bottom status surface, if present, is documented as DOCUMENT STATUS STRIP / view cluster.
- [ ] AH16 persistent status content is limited to useful document/view telemetry.
- [ ] AH17 GPU/QA/storage/update/provider diagnostics are absent from persistent status UI.
- [ ] AH18 status surface does not duplicate Properties or Navigator state ownership.
- [ ] AH19 P1-G color mode/bit depth/profile placement is reconsidered after refreshed baseline.
- [ ] AH20 if only zoom/view telemetry remains useful, compact view controls are used instead of an unnecessary full-width bar.
- [ ] AH21 with no document open, the document status strip is completely hidden. [INT][PIX]
- [ ] AH22 empty workspace does not reserve dead bottom height for a hidden status strip. [DOM][PIX]
- [ ] AH23 opening a document makes the document-status surface eligible and binds it to that document/view context. [INT]
- [ ] AH24 closing the last document hides the document-status surface again. [INT][PIX]
- [ ] AH25 document-specific status telemetry follows the active document if multi-document behavior is later supported. [SRC][INT]
- [ ] AH26 document status state has one authority and is not implemented as global always-on application chrome. [SRC][HEALTH]

# AJ. Photoshop Fine Detail Standard audit

Authority:
`working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md`

- [ ] AJ01 every applicable Menu fine-detail field has Target/Actual/Evidence/Result.
- [ ] AJ02 every applicable Options Bar fine-detail field has Target/Actual/Evidence/Result.
- [ ] AJ03 every applicable Tools fine-detail field has Target/Actual/Evidence/Result.
- [ ] AJ04 every applicable right Dock/general Panel fine-detail field is closed.
- [ ] AJ05 Layers row/thumbnail/indent/icon/drag/footer details are closed.
- [ ] AJ06 History row/state/current/future/scroll details are closed.
- [ ] AJ07 Navigator thumbnail/proxy/zoom-control details are closed.
- [ ] AJ08 typography semantic tokens are explicitly defined and verified.
- [ ] AJ09 light-gray semantic palette roles are explicitly defined and verified.
- [ ] AJ10 scrollbar detail is defined and verified.
- [ ] AJ11 tooltip detail is defined and verified.
- [ ] AJ12 cursor classes are defined and verified.
- [ ] AJ13 keyboard focus visuals are defined and verified.
- [ ] AJ14 special-state evidence matrix has no silently omitted required state.
- [ ] AJ15 Panel Tab geometry/states are defined and verified.
- [ ] AJ16 Panel Options Menu geometry/states/command inventories are defined and verified.
- [ ] AJ17 Document Status Strip obeys active-document-only visibility and final content rule.
- [ ] AJ18 shared Button/Input/Select control tokens are defined and verified.
- [ ] AJ19 icon grid/stroke/optical alignment is coherent across workstation.
- [ ] AJ20 spacing rhythm uses shared tokens with justified exceptions only.
- [ ] AJ21 border/radius/shadow grammar remains Photoshop-like and non-card-heavy.
- [ ] AJ22 transitions are minimal and reduced-motion safe.
- [ ] AJ23 responsive behavior is specified for every affected fine-detail component.
- [ ] AJ24 accessibility semantics match visible states.
- [ ] AJ25 no DEV-invented Photoshop numeric value remains undocumented.
- [ ] AJ26 every unresolved `REFERENCE_MISSING` is either resolved, explicitly waived by UR, or blocks pixel-fidelity closure.
- [ ] AJ27 final audit table includes Component / Field / Target / Actual / Evidence / Result.
- [ ] AJ28 `SILENTLY_UNSPECIFIED_DETAIL_CLASSES = 0`.

# AK. Photoshop reference-environment / measurement audit

- [ ] AK01 Photoshop reference version is recorded.
- [ ] AK02 OS and screen resolution are recorded.
- [ ] AK03 application window size is recorded.
- [ ] AK04 Windows display scaling is recorded or explicitly UNKNOWN for legacy evidence.
- [ ] AK05 Photoshop UI scaling is recorded or explicitly UNKNOWN for legacy evidence.
- [ ] AK06 UI Font Size is recorded.
- [ ] AK07 Scale UI To Font on/off is recorded.
- [ ] AK08 language/theme are recorded.
- [ ] AK09 numeric evidence from different scaling environments is not mixed silently.
- [ ] AK10 visible glyph envelope is not misreported as CSS font size.
- [ ] AK11 visible icon envelope is not misreported as pointer hitbox.
- [ ] AK12 active-document reference exists before document-tab/ruler/status dimensions are locked.
- [ ] AK13 `working/INK_UI_PS_REFERENCE_CAPTURE_AND_MEASUREMENT_PLAN_v0.1.md` P0 set is closed before pixel-fidelity closure.
- [ ] AK14 every internet/official screenshot with unknown scaling is treated as visual evidence only unless its environment is known.

# AL. Active-document Photoshop measurement audit

Authority:
`working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md`

- [ ] AL01 active-document tab band matches the 28 px reference.
- [ ] AL02 tab/workspace divider matches 1 px.
- [ ] AL03 Rulers OFF document/workspace content origin matches y=90 reference geometry.
- [ ] AL04 horizontal ruler matches 17 px reference thickness.
- [ ] AL05 vertical ruler matches 17 px reference thickness.
- [ ] AL06 ruler-origin corner matches 17×17 px reference.
- [ ] AL07 active-document status content band matches 16 px reference.
- [ ] AL08 active-document status bottom boundary matches 1 px reference.
- [ ] AL09 status surface remains document-context-only and hidden in empty workspace.
- [ ] AL10 Navigator header matches 28 px reference density.
- [ ] AL11 Navigator body/footer values are treated as elastic reference states, not hard global locks.
- [ ] AL12 History repeated row pitch is visually comparable to the ≈23 px reference.
- [ ] AL13 Panel Options popup uses 1 px border/separator grammar with compact 2 px separator inset where the adopted platform grammar matches.
- [ ] AL14 Application menu popup uses measured border/separator grammar without hard-locking content-dependent width/height.
- [ ] AL15 menu visible text pitch is not mistaken for an exact pointer hitbox.
- [ ] AL16 active-document reference hashes/roles remain recorded.

# AM. Photoshop interaction-detail measurement audit

Authority:
`working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md`

- [ ] AM01 Tooltip placement and compact geometry follow the measured reference while allowing text-dependent sizing.
- [ ] AM02 Tool flyout uses compact grouped-tool rows comparable to the ≈20 px reference pitch.
- [ ] AM03 horizontal guide drag shows transient live Y-position feedback.
- [ ] AM04 vertical guide drag shows transient live X-position feedback.
- [ ] AM05 ruler-origin drag is not treated as a UI-closure blocker.
- [ ] AM06 Status information menu, if implemented, remains document-local and uses compact popup grammar.
- [ ] AM07 empty workspace has no Document tab/rulers/Status Strip or dead reserved bottom space.
- [ ] AM08 document scrollbar thickness is visually comparable to the 16 px reference where native INK scrollbar presentation applies.
- [ ] AM09 Navigator proxy remains synchronized and state-derived at high zoom.
- [ ] AM10 Layers drag reorder shows a clear insertion target before drop.
- [ ] AM11 Layers drag ghost/insertion feedback is visually distinct from ordinary selection.
- [ ] AM12 Layers reorder converges with hierarchy authority and History semantics.
- [ ] AM13 no remaining generic Photoshop screenshot is required for closure; any remaining targeted reference is explicitly classified optional or blocking.

# AN. Official-source behavior closure audit

- [ ] AN01 Navigator proxy drag behavior is verified against Adobe Photoshop documentation and INK Runtime.
- [ ] AN02 Panel edge resize behavior is verified; no Photoshop cursor-raster copy is required.
- [ ] AN03 Smart Guides show edge/center/boundary alignment opportunities.
- [ ] AN04 Smart Guides provide useful pixel-distance feedback during movement.
- [ ] AN05 equal-spacing feedback is supported by the accepted snap/measurement authority.
- [ ] AN06 Photoshop's documented ~8 screen px guide-snap proximity is treated as reference behavior, not an unreviewed hard Core constant.
- [ ] AN07 ruler-origin drag remains optional/non-blocking; if implemented it shows appropriate crosshair/reset semantics.
- [ ] AN08 keyboard focus uses visible web-accessible focus semantics; Photoshop pixel-copy is not required.
- [ ] AN09 disabled controls are visually distinct and semantically disabled.
- [ ] AN10 scrollbar geometry is verified; hover/drag styling does not require Adobe raster imitation.
- [ ] AN11 no additional dark-theme Photoshop screenshots remain required.
- [ ] AN12 light-gray palette is either based on a controlled desktop Photoshop light-theme reference or explicitly approved as an INK adaptation.

# AO. Photoshop light-theme web-reference audit

Authority:
`working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md`

- [ ] AO01 final INK light-gray palette uses one semantic token authority.
- [ ] AO02 application chrome and canvas/workbench use distinct palette roles.
- [ ] AO03 no component-local random gray values bypass the token authority.
- [ ] AO04 primary/secondary/disabled text contrast is verified.
- [ ] AO05 icon normal/hover/active/disabled contrast is verified.
- [ ] AO06 control borders and states are visibly distinct.
- [ ] AO07 palette hierarchy is visually consistent with Photoshop Light/Lightest public references.
- [ ] AO08 Adobe Spectrum numeric values are treated as Adobe-native reference, not falsely claimed as exact Photoshop 21.2.12 chrome values.
- [ ] AO09 exact Photoshop 21.2.12 Light-theme RGB is not a closure prerequisite unless USER explicitly requests binary color replication.
- [ ] AO10 USER visual review approves the final light-gray token set.

# AP. Current Photoshop-on-the-web Light reference audit

Authority:
`working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md`

- [ ] AP01 INK light workspace uses a structural-gray role comparable to the measured current Photoshop web `#E9E9E9` anchor.
- [ ] AP02 elevated/light tool and panel surfaces use a near-white/white role comparable to the measured `#FFFFFF` anchor.
- [ ] AP03 active accent uses a restrained Adobe-like blue role; `#3B63FB` is the current measured Adobe web reference.
- [ ] AP04 browser/OS anti-aliasing grays are not promoted into arbitrary standalone design tokens.
- [ ] AP05 current Photoshop web color hierarchy informs palette only; it does not replace desktop Photoshop geometry/layout authority.
- [ ] AP06 central user artwork/content inside the reference screenshot is excluded from UI color measurement.
- [ ] AP07 final token values are Runtime-reviewed in the denser desktop INK workstation before closure.

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
UI_COMPLETE = HOLD_PENDING_UR_FULL_CHECKLIST_AUDIT_ON_CURRENT_MAIN
```


---

## Runtime closure evidence — 2026-09-28

Authoritative MR review:
`working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md`

```text
UI_A = PROMOTED
UI_B = UR_PASS / PROMOTED
UI_C = UR_PASS / PROMOTED

UI_C_PROMOTION_SHA = 77ee44c94a848588aceeb7797fa8aa737c69b248
RUNTIME_HARNESS_RECONCILE_PR = 88
FINAL_RUNTIME_TESTED_SHA = 24d3b3f607a17b3cb9331ec3635b34d804ee445b
PRODUCT_SOURCE_EQUIVALENCE = PASS

FINAL_RUNTIME_RUN = 36445204976
FINAL_RUNTIME_ARTIFACT = 10979718534
FINAL_RUNTIME_ARTIFACT_SHA256 = e4d822f19aea910db3a19a583d95843c57b012bb8062a47ba20609dfa4d91aad

UI_BROWSER = 110 / 110 PASS
CLOSURE_BROWSER = PASS
GEOMETRY_BROWSER = PASS
CREATIVE_BROWSER = PASS
P1_EXACT_TARGET = PASS
CLOSURE_FOCUSED = PASS

FORMAT_VERSION = 4
OPEN_FINAL_BLOCKERS = 0
UI_COMPLETE = VERIFIED
```

The initial final Runtime run `36443008810` failed only because the legacy UI Runtime harness still encoded superseded pre-UI-A geometry/inventory assumptions. MR reconciled that QA harness through PR #88 without product/source mutation, then reran the exact product-equivalent revision successfully.

This checklist is NOT closed. UR must now perform the full item-by-item audit on current main. It closes only after all required items have explicit disposition and open/unreviewed counts are zero.

---

## UR final full-item audit — current main 3608962c17ecbea864be18049462badfc7021a38

TASK: `INK-UI-FINAL-FULL-CHECKLIST-AUDIT-001`

`TOTAL=592 / PASS=469 / FAIL=122 / N_A=1 / UNREVIEWED=0 / OPEN=122`

A FAIL records an unmet requirement or missing direct audit evidence; it does not by itself assert a product defect. Findings separate known product mismatch, QA evidence gaps, and USER acceptance. The prior central Runtime run 36445204976 remains historical evidence for tested SHA 24d3b3f607a17b3cb9331ec3635b34d804ee445b; PR #93 promoted new product CSS at c66b1eba2376f01cfba14f71b6f29d7e2fa022e4, so current-product Runtime debt is DEFERRED_TO_FINAL_CHECKLIST_BATCH and no central Runtime was run in this closure batch.

The USER acceptance list is F22, G01, H12, Y07, Z01, Z07, AI11, AI16, AO10 and AF10; eight are explicitly `[USER]`, two additional items demand USER approval/completion in their text. All remain FAIL until USER evidence is recorded.

| ID | Disposition | Evidence / reason | Finding |
|---|---|---|---|
| A01 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md §2; working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md §5 (FORMAT_VERSION=4). | — |
| A02 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md §2; working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md §5 (FORMAT_VERSION=4). | — |
| A03 | FAIL | Placement/summary alone does not prove this exact item on current main (A03: No UI command claims capability outside the frozen baseline. [SRC]); source or targeted QA evidence needed. | UI-AUD-06 |
| A04 | PASS | working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md §§2,4: UI-C source equivalent, QA-only PR #88; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md changed-files section. | — |
| A05 | PASS | working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md §§2,4: UI-C source equivalent, QA-only PR #88; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md changed-files section. | — |
| A06 | PASS | working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md §§2,5: integrated tested SHA 24d3b3f607a17b3cb9331ec3635b34d804ee445b and run 36445204976. | — |
| B01 | PASS | working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md REFERENCE_PACK; attached 1280×1024 PNG SHA-256 9bb8f329df55f6e6617e32e60a138c6cd21451509465073d4821802482815f76 / df316d46821c2840acf1dad277dca6442b4b093034b9dd809d6cb4aa917860e2. | — |
| B02 | PASS | working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md REFERENCE_PACK; attached 1280×1024 PNG SHA-256 9bb8f329df55f6e6617e32e60a138c6cd21451509465073d4821802482815f76 / df316d46821c2840acf1dad277dca6442b4b093034b9dd809d6cb4aa917860e2. | — |
| B03 | PASS | working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§0–2, normalized 1280×994 app crop; reference-state classification. | — |
| B04 | PASS | working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§0–2, normalized 1280×994 app crop; reference-state classification. | — |
| B05 | PASS | Adobe official Photoshop documentation: viewing-images.html (Navigator), positioning-elements-snapping.html (Snap/Snap To), desktop/get-started/learn-the-basics/dock-undock-panels.html (panel behavior); original URLs recorded in closure UR evidence R1. | — |
| B06 | PASS | working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§0–2, normalized 1280×994 app crop; reference-state classification. | — |
| C01 | PASS | artifact 10979718534 / ui.json checks #3–10, #22–24; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§2–4; ui-1280x1024.png. | — |
| C02 | PASS | artifact 10979718534 / ui.json checks #3–10, #22–24; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§2–4; ui-1280x1024.png. | — |
| C03 | PASS | artifact 10979718534 / ui.json checks #3–10, #22–24; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§2–4; ui-1280x1024.png. | — |
| C04 | PASS | artifact 10979718534 / ui.json checks #3–10, #22–24; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§2–4; ui-1280x1024.png. | — |
| C05 | PASS | artifact 10979718534 / ui.json checks #3–10, #22–24; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§2–4; ui-1280x1024.png. | — |
| C06 | PASS | artifact 10979718534 / ui.json checks #3–10, #22–24; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§2–4; ui-1280x1024.png. | — |
| C07 | PASS | artifact 10979718534 ui.json checks #3–10 plus qa/evidence/ink-ui-final-checklist-closure-001/ink-top-61px.png and ps-ink-major-edge-overlay.png show 24+1+35+1 shell without gap/double divider. | — |
| D01 | PASS | product/source/web-shell.js application menu registry; artifact 10979718534 / ui.json checks #51–59; ui-1280x1024.png (11 menus; Brush/3D absent). | — |
| D02 | PASS | artifact 10979718534 ui.json checks #51–56 verifies live menu controller; qa/ink-ui-a-photoshop-shell-panels.test.mjs asserts all 11 top-level triggers; qa/ink-ui-b-full-capability-controls.test.mjs verifies every visible UI-B menu command has a dispatch path. | — |
| D03 | PASS | product/source/web-shell.js application menu registry; artifact 10979718534 / ui.json checks #51–59; ui-1280x1024.png (11 menus; Brush/3D absent). | — |
| D04 | PASS | product/source/web-shell.js application menu registry; artifact 10979718534 / ui.json checks #51–59; ui-1280x1024.png (11 menus; Brush/3D absent). | — |
| D05 | PASS | qa/ink-ui-b-full-capability-controls.test.mjs asserts Filter > filter-gallery and all visible contributions route; working/INK_UI_B_FULL_CAPABILITY_CONTROLS_UR_REVIEW_v1.0.md §2 confirms accepted P1-F authority and no unhandled visible commands. | — |
| D06 | PASS | artifact 10979718534 / ui.json checks #51, #56, #58–59; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md local interaction/source smoke. | — |
| D07 | PASS | artifact 10979718534 / ui.json checks #51, #56, #58–59; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md local interaction/source smoke. | — |
| D08 | PASS | artifact 10979718534 / ui.json checks #51, #56, #58–59; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md local interaction/source smoke. | — |
| D09 | PASS | qa/evidence/ink-ui-final-checklist-issue92-ui-suite-306ff4e5364e/ui.json check #55: Escape closes the active application menu through the DOM keyboard path and records activeElement=fileMenuToggle, directly proving focus restoration to the trigger. | — |
| D10 | PASS | Promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: menu trigger ArrowDown opened the real Edit menu, focus moved first→next item, Escape closed it and returned focus. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-workstation-c636354c29f0/workstation-interactions.json` (D10=PASS). The focused suite overall was 10/12 because K02/N02 remained under defect/diagnostic review; only this item-specific PASS is used here. | — |
| D11 | FAIL | Final screenshots do not show the required state/comparison for D11: separators/check/disabled states are visually coherent. [PIX][INT] | UI-AUD-02 |
| D12 | FAIL | Final screenshots do not show the required state/comparison for D12: keyboard shortcut labels align/read correctly. [PIX] | UI-AUD-02 |
| D13 | PASS | artifact 10979718534 / ui.json checks #51, #56, #58–59; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md local interaction/source smoke. | — |
| E01 | PASS | artifact 10979718534 / ui.json checks #67–77; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md contextual Options evidence. | — |
| E02 | PASS | artifact 10979718534 / ui.json checks #67–77; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md contextual Options evidence. | — |
| E03 | PASS | Promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: quick color changed the existing pen color authority and synchronized the main color input. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-workstation-c636354c29f0/workstation-interactions.json` (E03=PASS). The focused suite overall was 10/12 because K02/N02 remained under defect/diagnostic review; only this item-specific PASS is used here. | — |
| E04 | PASS | Promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: quick size changed the existing pen size authority and synchronized the main size input. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-workstation-c636354c29f0/workstation-interactions.json` (E04=PASS). The focused suite overall was 10/12 because K02/N02 remained under defect/diagnostic review; only this item-specific PASS is used here. | — |
| E05 | PASS | Promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: draw/eraser/shape/text contextual controls were state-gated and opacity routed to the existing pen setting. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-workstation-c636354c29f0/workstation-interactions.json` (E05=PASS). The focused suite overall was 10/12 because K02/N02 remained under defect/diagnostic review; only this item-specific PASS is used here. | — |
| E06 | PASS | artifact 10979718534 / ui.json checks #67–77; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md contextual Options evidence. | — |
| E07 | PASS | artifact 10979718534 / ui.json checks #67–77; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md contextual Options evidence. | — |
| E08 | PASS | artifact 10979718534 / ui.json checks #67–77; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md contextual Options evidence. | — |
| E09 | PASS | artifact 10979718534 / ui.json checks #67–77; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md contextual Options evidence. | — |
| E10 | PASS | Promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: Path/Node edit actions were hidden before edit, visible only during active Path edit, then hidden after selection clear. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-workstation-c636354c29f0/workstation-interactions.json` (E10=PASS). The focused suite overall was 10/12 because K02/N02 remained under defect/diagnostic review; only this item-specific PASS is used here. | — |
| E11 | PASS | artifact 10979718534 / ui.json checks #67–77; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md contextual Options evidence. | — |
| E12 | FAIL | Final screenshots do not show the required state/comparison for E12: switching context produces no broken layout/overflow. [PIX][INT] | UI-AUD-02 |
| F01 | PASS | artifact 10979718534 / ui.json checks #3–10, #22–24; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§2–4; ui-1280x1024.png. | — |
| F02 | PASS | artifact 10979718534 / ui.json checks #3–10, #22–24; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§2–4; ui-1280x1024.png. | — |
| F03 | PASS | artifact 10979718534 / ui.json checks #3–10, #22–24; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§2–4; ui-1280x1024.png. | — |
| F04 | PASS | artifact 10979718534 / ui.json checks #3–10, #22–24; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§2–4; ui-1280x1024.png. | — |
| F05 | PASS | artifact 10979718534 / ui.json checks #20–24, #67–74; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md selected tool fill; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md tool disposition. | — |
| F06 | PASS | artifact 10979718534 / ui.json checks #20–24, #67–74; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md selected tool fill; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md tool disposition. | — |
| F07 | PASS | artifact 10979718534 / ui.json checks #20–24, #67–74; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md selected tool fill; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md tool disposition. | — |
| F08 | PASS | artifact 10979718534 / ui.json checks #20–24, #67–74; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md selected tool fill; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md tool disposition. | — |
| F09 | PASS | artifact 10979718534 / ui.json checks #20–24, #67–74; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md selected tool fill; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md tool disposition. | — |
| F10 | PASS | artifact 10979718534 / ui.json checks #20–24, #67–74; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md selected tool fill; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md tool disposition. | — |
| F11 | PASS | artifact 10979718534 / ui.json checks #20–24, #67–74; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md selected tool fill; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md tool disposition. | — |
| F12 | PASS | artifact 10979718534 ui.json check #20 records Select in frozen visible tool order; product/source/web-shell.js CONTEXT_TOOL_META select. | — |
| F13 | PASS | artifact 10979718534 ui.json check #20 records Lasso in frozen visible tool order; product/source/web-shell.js CONTEXT_TOOL_META lasso. | — |
| F14 | PASS | artifact 10979718534 / ui.json checks #20–24, #67–74; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md selected tool fill; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md tool disposition. | — |
| F15 | PASS | artifact 10979718534 / ui.json checks #20–24, #67–74; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md selected tool fill; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md tool disposition. | — |
| F16 | PASS | artifact 10979718534 ui.json check #20 records Image in frozen visible tool order; product/source/web-shell.js CONTEXT_TOOL_META image. | — |
| F17 | PASS | artifact 10979718534 ui.json check #20 records Pan in frozen visible tool order; product/source/web-shell.js CONTEXT_TOOL_META pan. | — |
| F18 | PASS | artifact 10979718534 ui.json checks #20 and #67–71 exercise one Draw stack and pen/pencil/marker/brush/airbrush contextual routes; qa/ink-ui-b-full-capability-controls.test.mjs validates the draw group registry. | — |
| F19 | FAIL | Final screenshots do not show the required state/comparison for F19: grouped tool shows a flyout indicator. [PIX] | UI-AUD-02 |
| F20 | PASS | artifact 10979718534 / ui.json checks #20–24, #67–74; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md selected tool fill; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md tool disposition. | — |
| F21 | PASS | qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json: panel-menu-hover-state, panel-menu-focus-state and panel-tab-hover-focus interaction checks PASS at both required viewports. | — |
| F22 | FAIL | USER visual/ergonomic acceptance has not been recorded; AI cannot mark PASS. tool density is comparable to Photoshop reference. [PIX][USER] | USER-ACCEPT |
| F23 | PASS | artifact 10979718534 / ui.json checks #20–24, #67–74; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md selected tool fill; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md tool disposition. | — |
| F24 | PASS | product/source/index.html separates mobile-dock/mobileToolSheet from the desktop Primary Home; desktop duplicate file buttons are explicitly data-ui-route=RESPONSIVE_ALTERNATIVE. working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md classifies mobile copies as RESPONSIVE only. | — |
| G01 | FAIL | USER visual/ergonomic acceptance has not been recorded; AI cannot mark PASS. canvas is visually dominant. [PIX][USER] | USER-ACCEPT |
| G02 | PASS | artifact 10979718534 / ui.json checks #8, #10, #30–31, #65, #90–91; ui-1280x1024.png. | — |
| G03 | PASS | artifact 10979718534 / ui.json checks #8, #10, #30–31, #65, #90–91; ui-1280x1024.png. | — |
| G04 | PASS | artifact 10979718534 / ui.json checks #8, #10, #30–31, #65, #90–91; ui-1280x1024.png. | — |
| G05 | PASS | artifact 10979718534 / ui.json checks #8, #10, #30–31, #65, #90–91; ui-1280x1024.png. | — |
| G06 | PASS | Promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: creation workspace retained large camera offsets and zoom while the UI identified the space as 創作空間（無框）. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-workstation-c636354c29f0/workstation-interactions.json` (G06=PASS). The focused suite overall was 10/12 because K02/N02 remained under defect/diagnostic review; only this item-specific PASS is used here. | — |
| G07 | PASS | artifact 10979718534 / ui.json checks #8, #10, #30–31, #65, #90–91; ui-1280x1024.png. | — |
| H01 | PASS | artifact 10979718534 / ui.json checks #3–10, #22–24; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§2–4; ui-1280x1024.png. | — |
| H02 | PASS | artifact 10979718534 / ui.json checks #3–10, #22–24; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §§2–4; ui-1280x1024.png. | — |
| H03 | PASS | artifact 10979718534 / ui.json checks #27–32, #47, #50, #86–91; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §6; UI-A-R1 UR review. | — |
| H04 | PASS | artifact 10979718534 / ui.json checks #27–32, #47, #50, #86–91; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §6; UI-A-R1 UR review. | — |
| H05 | PASS | artifact 10979718534 / ui.json checks #27–32, #47, #50, #86–91; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §6; UI-A-R1 UR review. | — |
| H06 | PASS | artifact 10979718534 / ui.json checks #27–32, #47, #50, #86–91; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §6; UI-A-R1 UR review. | — |
| H07 | PASS | artifact 10979718534 / ui.json checks #27–32, #47, #50, #86–91; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §6; UI-A-R1 UR review. | — |
| H08 | PASS | artifact 10979718534 / ui.json checks #27–32, #47, #50, #86–91; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §6; UI-A-R1 UR review. | — |
| H09 | FAIL | Final screenshots do not show the required state/comparison for H09: active panel state is visible. [PIX] | UI-AUD-02 |
| H10 | PASS | artifact 10979718534 / ui.json checks #27–32, #47, #50, #86–91; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §6; UI-A-R1 UR review. | — |
| H11 | PASS | artifact 10979718534 / ui.json checks #27–32, #47, #50, #86–91; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §6; UI-A-R1 UR review. | — |
| H12 | FAIL | USER visual/ergonomic acceptance has not been recorded; AI cannot mark PASS. panel header/tab density aligns with Photoshop grammar. [PIX][USER] | USER-ACCEPT |
| H13 | PASS | artifact 10979718534 / ui.json checks #27–32, #47, #50, #86–91; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §6; UI-A-R1 UR review. | — |
| H14 | PASS | artifact 10979718534 / ui.json checks #27–32, #47, #50, #86–91; working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §6; UI-A-R1 UR review. | — |
| I01 | PASS | artifact 10979718534 / ui.json checks #27, #36, #41–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md panel homes; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Window/Dock routing. | — |
| I02 | PASS | artifact 10979718534 / ui.json checks #27, #36, #41–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md panel homes; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Window/Dock routing. | — |
| I03 | PASS | artifact 10979718534 / ui.json checks #27, #36, #41–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md panel homes; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Window/Dock routing. | — |
| I04 | PASS | artifact 10979718534 / ui.json checks #27, #36, #41–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md panel homes; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Window/Dock routing. | — |
| I05 | PASS | artifact 10979718534 / ui.json checks #27, #36, #41–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md panel homes; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Window/Dock routing. | — |
| I06 | PASS | artifact 10979718534 / ui.json checks #27, #36, #41–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md panel homes; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Window/Dock routing. | — |
| I07 | PASS | artifact 10979718534 / ui.json checks #27, #36, #41–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md panel homes; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Window/Dock routing. | — |
| I08 | PASS | artifact 10979718534 / ui.json checks #27, #36, #41–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md panel homes; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Window/Dock routing. | — |
| I09 | PASS | artifact 10979718534 / ui.json checks #27, #36, #41–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md panel homes; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Window/Dock routing. | — |
| I10 | PASS | artifact 10979718534 / ui.json checks #27, #36, #41–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md panel homes; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Window/Dock routing. | — |
| I11 | PASS | artifact 10979718534 / ui.json checks #27, #36, #41–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md panel homes; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Window/Dock routing. | — |
| I12 | PASS | artifact 10979718534 / ui.json checks #27, #36, #41–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md panel homes; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Window/Dock routing. | — |
| J01 | PASS | Promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: one selected object opened the canonical Properties panel and exposed the selected-object state. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-workstation-c636354c29f0/workstation-interactions.json` (J01=PASS). The focused suite overall was 10/12 because K02/N02 remained under defect/diagnostic review; only this item-specific PASS is used here. | — |
| J02 | PASS | Promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: Transform X changed the actual object transform by +25 and created exactly one History entry. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-workstation-c636354c29f0/workstation-interactions.json` (J02=PASS). The focused suite overall was 10/12 because K02/N02 remained under defect/diagnostic review; only this item-specific PASS is used here. | — |
| J03 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Path Fill/Stroke/Opacity controls mutate the selected Path through existing `repaintSelectedPaths`; exact browser evidence verifies `#112233 / #445566 / 0.55` and History increments. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-properties-layers-d2e3aad0bab1/properties-layers.json` (8/8 PASS on candidate `d2e3aad0bab179d1318cf28796ed317be7fe97f9`, including J09/K13 regression PASS). Central Runtime not run. | — |
| J04 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Material Apply/Remove controls route through existing Path material authority; apply and remove both succeed with History and no parallel material state. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-properties-layers-d2e3aad0bab1/properties-layers.json` (8/8 PASS on candidate `d2e3aad0bab179d1318cf28796ed317be7fe97f9`, including J09/K13 regression PASS). Central Runtime not run. | — |
| J05 | PASS | Promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: Path state appeared for a selected Path and node actions appeared only during Path edit. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-workstation-c636354c29f0/workstation-interactions.json` (J05=PASS). The focused suite overall was 10/12 because K02/N02 remained under defect/diagnostic review; only this item-specific PASS is used here. | — |
| J06 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Frame/Layout controls write valid `INK-LAYOUT-1` state under existing History; mode/gap/padding mutation is verified. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-properties-layers-d2e3aad0bab1/properties-layers.json` (8/8 PASS on candidate `d2e3aad0bab179d1318cf28796ed317be7fe97f9`, including J09/K13 regression PASS). Central Runtime not run. | — |
| J07 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: LayoutItem controls write valid `INK-LAYOUT-ITEM-1` state under existing History; participation and sizing mutation is verified. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-properties-layers-d2e3aad0bab1/properties-layers.json` (8/8 PASS on candidate `d2e3aad0bab179d1318cf28796ed317be7fe97f9`, including J09/K13 regression PASS). Central Runtime not run. | — |
| J08 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Component instance state and node-opacity override controls route through existing `overrideInstance`; apply and reset both succeed. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-properties-layers-d2e3aad0bab1/properties-layers.json` (8/8 PASS on candidate `d2e3aad0bab179d1318cf28796ed317be7fe97f9`, including J09/K13 regression PASS). Central Runtime not run. | — |
| J09 | PASS | Promoted product `182e73e071e20404c8394f6e883304b5c102b831`: Browser evidence verifies the existing Canvas Settings home exposes artboard and layout-viewport controls together, so document/layout properties have a clear usable home. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-properties-layers-182e73e071e2/properties-layers.json`. Central Runtime not run. | — |
| J10 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| K01 | PASS | qa/evidence/ink-ui-final-checklist-issue92-layers-history-306ff4e5364e/layers-history.json: current browser check verifies rendered layer-row count equals current document layer count after live mutations. | — |
| K02 | PASS | Reproduced on `c636354c29f0dfc5e379088de169d083e3df4ce5`: canonical selection changed to a child object while the corresponding Layers row stayed visually inactive. Candidate `45e6e3519fb6f0222f67354cc2cc9494e8dbd9e9` mirrors existing `app.selection` into rendered Layers-row active state only; exact-candidate `K02` browser evidence is 1/1 PASS. PR #99 promoted as `bd18d7e38ae0c81d50b325d76c189678be31fec6`. Central Runtime not run. | — |
| K03 | PASS | qa/evidence/ink-ui-final-checklist-issue92-layers-history-306ff4e5364e/layers-history.json: clicking the rendered visibility control changes the authoritative layer.visible state true → false. | — |
| K04 | PASS | qa/evidence/ink-ui-final-checklist-issue92-layers-history-306ff4e5364e/layers-history.json: clicking the rendered lock control changes the authoritative layer.locked state false → true. | — |
| K05 | PASS | qa/evidence/ink-ui-final-checklist-issue92-layers-history-306ff4e5364e/layers-history.json: rendered layer opacity control commits 55% to authoritative layer.opacity = 0.55. | — |
| K06 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| K07 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| K08 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| K09 | PASS | qa/evidence/ink-ui-final-checklist-issue92-layers-history-306ff4e5364e/layers-history.json: synthetic browser drag/drop changes authoritative layer order and preserves the authoritative hierarchy array. | — |
| K10 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Layers child-row reparent action routes through existing `reparentObjectToFrame`; the child moves to layer root and History records the mutation. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-properties-layers-d2e3aad0bab1/properties-layers.json` (8/8 PASS on candidate `d2e3aad0bab179d1318cf28796ed317be7fe97f9`, including J09/K13 regression PASS). Central Runtime not run. | — |
| K11 | FAIL | Final screenshots do not show the required state/comparison for K11: compact panel-local footer/actions follow Photoshop grammar. [PIX] | UI-AUD-02 |
| K12 | PASS | qa/evidence/ink-ui-final-checklist-issue92-layers-history-306ff4e5364e/layers-history.json: 28-layer browser state yields #layersList scrollHeight 1010 / clientHeight 460 and scrollTop reaches 550. | — |
| K13 | PASS | Promoted product `182e73e071e20404c8394f6e883304b5c102b831`: Browser evidence clicks the actual Layer menu `layer-new` command; canonical document layers increase 1→2 and the Layers panel renders the same 2-layer state. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-properties-layers-182e73e071e2/properties-layers.json`. Central Runtime not run. | — |
| L01 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| L02 | FAIL | Final screenshots do not show the required state/comparison for L02: older states are above newer states. [INT][PIX] | UI-AUD-02 |
| L03 | FAIL | Final screenshots do not show the required state/comparison for L03: current state is visibly selected. [PIX] | UI-AUD-02 |
| L04 | PASS | qa/evidence/ink-ui-final-checklist-issue92-layers-history-306ff4e5364e/layers-history.json: clicking History position 1 restores the earlier document state; layer count returns to base+1 and two later entries move to redo. | — |
| L05 | FAIL | Final screenshots do not show the required state/comparison for L05: later states visually communicate their future/discard status. [PIX][INT] | UI-AUD-02 |
| L06 | PASS | qa/evidence/ink-ui-final-checklist-issue92-layers-history-306ff4e5364e/layers-history.json: editing after jumping to an earlier state clears redo and continues as one linear History timeline. | — |
| L07 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| L08 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| L09 | PASS | qa/evidence/ink-ui-final-checklist-issue92-layers-history-306ff4e5364e/layers-history.json: History limit control is rendered inside the History panel and changing it commits history.limit = 20. | — |
| L10 | FAIL | Final screenshots do not show the required state/comparison for L10: History is not conflated with Revision. [SRC][PIX] | UI-AUD-02 |
| L11 | PASS | product/source/src/history/history.js exposes one linear undoStack/redoStack timeline with jumpTo implemented by redistributing the same entries; current History panel is listbox step navigation. Raster 'Snapshot' in UI-B is image comparison, not History semantics. No History branch/snapshot authority is exposed. | — |
| M01 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| M02 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| M03 | FAIL | Final screenshots do not show the required state/comparison for M03: thumbnail/overview renders meaningful current content extent. [INT][PIX] | UI-AUD-02 |
| M04 | FAIL | Final screenshots do not show the required state/comparison for M04: viewport proxy rectangle is visible. [PIX] | UI-AUD-02 |
| M05 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: rendered Navigator proxy is present, finite, and derived from the current viewport at 100% camera state. | — |
| M06 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: real stage wheel-pan changes camera x 0→-120 and the Navigator proxy left position 3.73%→14.97%. | — |
| M07 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: real stage wheel-zoom changes camera scale 1→1.4333 and proxy width 92.53%→64.56%, with readout 143%. | — |
| M08 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: Navigator proxy pointer drag changes camera position and updates proxy geometry through the Runtime handler. | — |
| M09 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: pointerdown on Navigator thumbnail changes camera center from (-270.23,-19.00) to (-489.73,-260.87). | — |
| M10 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: Navigator zoom percentage output is rendered and reports 143%. | — |
| M11 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: Navigator Zoom Out button changes scale 1.4333→1.1944 and readout to 119%. | — |
| M12 | PASS | Reproduced defect UI-DEFECT-NAV-001 corrected by PR #97 exact candidate 3ca17e54239b30641de724e38ceb449125ced3d5. Focused Navigator browser evidence qa/evidence/ink-ui-final-checklist-issue92-navigator-view-3ca17e54239b/navigator-view.json = 16/16 PASS; M12 slider exists and changes the existing camera scale from 1.1944× to 1.55× through app.zoomBy(). Promoted merge = 7a86ef6124fb18c6d05c0c520020663f65882c5a. | — |
| M13 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: Navigator Zoom In button changes scale 1.1944→1.4333 and readout to 143%. | — |
| M14 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| M15 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| M16 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: infinite-canvas Navigator overview resolves to finite proxy percentages and finite rendered geometry using content/fallback extent. | — |
| N01 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| N02 | PASS | Reproduced on `c636354c29f0dfc5e379088de169d083e3df4ce5`: Pages shell Add was visible and bound but both shell Add and direct `app.addPage()` failed with `ReferenceError: defaultPage is not defined`. Candidate `0428bfaf46260574d3399f96324232eccb4a6182` restores the existing exported `defaultPage` import; exact-candidate Pages evidence is 2/2 PASS. PR #100 promoted as `182e73e071e20404c8394f6e883304b5c102b831`. | — |
| N03 | PASS | Exact-candidate Pages browser evidence on `0428bfaf46260574d3399f96324232eccb4a6182` creates two distinct pages and verifies selecting each row updates canonical `activePageId` and `aria-selected` correctly. Promoted by PR #100 as `182e73e071e20404c8394f6e883304b5c102b831`. Central Runtime not run. | — |
| N04 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| N05 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| N06 | PASS | artifact 10979718534 / ui.json checks #33–40, #47, #52–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source authority review. | — |
| O01 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| O02 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| O03 | PASS | Promoted product `5d11c1536df5a06864f85124f0c42f992a6d189f`: search input filters results by query and restores all families. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-libraries-e73d2fa2cfc7/libraries.json` (10/10 PASS on candidate `e73d2fa2cfc71487e04d4ad813dc357dfc7ee7c3`). Central Runtime not run. | — |
| O04 | PASS | Promoted product `5d11c1536df5a06864f85124f0c42f992a6d189f`: five family filters are visible and toggling Component removes/restores only that family. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-libraries-e73d2fa2cfc7/libraries.json` (10/10 PASS on candidate `e73d2fa2cfc71487e04d4ad813dc357dfc7ee7c3`). Central Runtime not run. | — |
| O05 | PASS | Promoted product `5d11c1536df5a06864f85124f0c42f992a6d189f`: Component result is searchable and visible. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-libraries-e73d2fa2cfc7/libraries.json` (10/10 PASS on candidate `e73d2fa2cfc71487e04d4ad813dc357dfc7ee7c3`). Central Runtime not run. | — |
| O06 | PASS | Promoted product `5d11c1536df5a06864f85124f0c42f992a6d189f`: Material result is searchable and visible. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-libraries-e73d2fa2cfc7/libraries.json` (10/10 PASS on candidate `e73d2fa2cfc71487e04d4ad813dc357dfc7ee7c3`). Central Runtime not run. | — |
| O07 | PASS | Promoted product `5d11c1536df5a06864f85124f0c42f992a6d189f`: Recipe result is searchable and visible. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-libraries-e73d2fa2cfc7/libraries.json` (10/10 PASS on candidate `e73d2fa2cfc71487e04d4ad813dc357dfc7ee7c3`). Central Runtime not run. | — |
| O08 | PASS | Promoted product `5d11c1536df5a06864f85124f0c42f992a6d189f`: Parametric-structure result is searchable and visible. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-libraries-e73d2fa2cfc7/libraries.json` (10/10 PASS on candidate `e73d2fa2cfc71487e04d4ad813dc357dfc7ee7c3`). Central Runtime not run. | — |
| O09 | PASS | Promoted product `5d11c1536df5a06864f85124f0c42f992a6d189f`: Reference-derived-structure result is searchable and visible. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-libraries-e73d2fa2cfc7/libraries.json` (10/10 PASS on candidate `e73d2fa2cfc71487e04d4ad813dc357dfc7ee7c3`). Central Runtime not run. | — |
| O10 | PASS | Promoted product `5d11c1536df5a06864f85124f0c42f992a6d189f`: Inspect is explicit read-only and leaves the document unchanged. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-libraries-e73d2fa2cfc7/libraries.json` (10/10 PASS on candidate `e73d2fa2cfc71487e04d4ad813dc357dfc7ee7c3`). Central Runtime not run. | — |
| O11 | PASS | Promoted product `5d11c1536df5a06864f85124f0c42f992a6d189f`: Component reuse routes to existing `component.instance.create.v1` proposal with current page/layer context; proposal is created but not executed and document bytes remain unchanged. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-libraries-e73d2fa2cfc7/libraries.json` (10/10 PASS on candidate `e73d2fa2cfc71487e04d4ad813dc357dfc7ee7c3`). Central Runtime not run. | — |
| O12 | PASS | Promoted product `5d11c1536df5a06864f85124f0c42f992a6d189f`: Material reuse routes to existing `path.material.apply.v1` proposal; proposal is created but not executed and document bytes remain unchanged. Exact-candidate evidence: `qa/evidence/ink-ui-final-checklist-issue92-libraries-e73d2fa2cfc7/libraries.json` (10/10 PASS on candidate `e73d2fa2cfc71487e04d4ad813dc357dfc7ee7c3`). Central Runtime not run. | — |
| O13 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| O14 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| O15 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| O16 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| P01 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: REFERENCE_IMPORT_VISIBLE + SMART_LOOP_REFERENCE_IMPORTED verify local reference import through the accepted Reference/CHAT authority. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| P02 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: CHAT_REFERENCE_DECOMPOSITION_COMPLETED plus editable color/boundary checks verify accepted decomposition/vectorization authority. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| P03 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: WORKSTATION_REFERENCE_RESEARCH_READOUT + WORKSTATION_REFERENCE_RESEARCH_READ_ONLY verify advisory research remains read-only. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| P04 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| Q01 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: WORKSTATION_PANEL_COMPOSE_AUTHORITY + STRUCTURE_AWARE_EXECUTED verify Compose exposes structural/composition state through one authority. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| Q02 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: WORKSTATION_REPEAT_RESULT_AVAILABLE + WORKSTATION_COMPOSE_PARAMETRIC_STATUS verify Repeat/parametric state is visible when relevant. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| Q03 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| Q04 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| R01 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| R02 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: BOUNDED_EDIT_PROPOSED verifies the CHAT proposal route. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| R03 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: BOUNDED_EDIT_APPROVED and USE_INK_APPROVAL_TOKEN_ISSUED verify approval routes. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| R04 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: MUTATION_BLOCKED_BEFORE_APPROVAL + BOUNDED_EDIT_EXECUTED verify governed execution. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| R05 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: USE_INK_PROPOSE_MUTATION_NEUTRAL + USE_INK_EXECUTE_BLOCKED_BEFORE_APPROVAL + USE_INK_TWO_STEP_EXECUTION_ORDERED verify accepted use_ink scope. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| R06 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: SMART_LOOP_HISTORY_RECORDED + USE_INK_HISTORY_RECORDED verify CHAT/use_ink writes converge on the existing History authority. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| R07 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: SMART_CAPABILITY_revision.list + USE_INK_FINAL_REVISION_CAPTURED verify CHAT/use_ink converges on existing Revision authority. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| R08 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: SMART_CAPABILITY_library.search + CONNECTOR_005_LIBRARY_SEARCH_BROWSER_READ_ONLY + mutation-neutral check verify CHAT uses library search without a second library. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| R09 | FAIL | Final screenshots do not show the required state/comparison for R09: provider/credential engineering settings are not ordinary CHAT clutter. [PIX] | UI-AUD-02 |
| R10 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| S01 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: get_ink_revisions is executed in-browser and returns COMPLETED with the newly captured revision present (enforced by SMART_LOOP_FINAL_REVISION_CAPTURED). Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| S02 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: REVISION_BASELINE_CAPTURED + REVISION_STRUCTURE_CAPTURED verify capture. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| S03 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: REVISION_RESTORE_EXECUTED + DOCUMENT_INTEGRITY_AFTER_RESTORE verify restore. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| S04 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: WORKSTATION_REVISION_PROVENANCE_VISIBLE verifies provenance/readout remains available and read-only. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| S05 | PASS | Current promoted product `c636354c29f0dfc5e379088de169d083e3df4ce5`: WORKSTATION_REVISION_COMPARE_ENTRY_ENABLED + WORKSTATION_REVISION_STRUCTURAL_COMPARE verify accepted structural compare. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/creative.json`; focused creative report is 154/154 PASS with `centralRuntimeExecuted=false`. | — |
| S06 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| S07 | PASS | ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md; working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md capability boundaries; artifact 10979718534 / ui.json checks #43–49. | — |
| T01 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact path.repaint.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T02 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact path.material.apply.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T03 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact path.material.remove.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T04 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact object.translate.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T05 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact path.simplify.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T06 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact path.refine.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T07 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact path.create.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T08 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact path.edit.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T09 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact object.rotate.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T10 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact object.clone.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T11 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact repeat.radial.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T12 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact boolean.apply.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T13 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact group.create.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T14 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact object.reparent.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T15 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact frame.create.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T16 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact text.create.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T17 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact text.edit.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T18 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact svg.import.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T19 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact object.resize.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T20 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact object.scale.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T21 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact object.order.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T22 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact repeat.mirror.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T23 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact repeat.grid.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T24 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact layout.frame.set.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T25 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact layout.frame.remove.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T26 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact layout.item.set.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T27 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact layout.item.remove.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T28 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact component.register.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T29 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact component.instance.create.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T30 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact component.override.set.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T31 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact component.override.reset.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T32 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact component.instance.detach.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T33 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact component.definition.duplicate.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| T34 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact component.reference.repair.v1 disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U01 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact get_ink_capabilities disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U02 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact get_ink_context disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U03 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact get_ink_selection disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U04 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact inspect_ink_objects disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U05 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact decompose_ink_reference disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U06 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact propose_ink_edit disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U07 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact approve_ink_edit disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U08 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact execute_ink_edit disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U09 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact get_ink_history disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U10 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact undo_ink disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U11 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact redo_ink disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U12 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact get_ink_revisions disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U13 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact capture_ink_revision disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U14 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact restore_ink_revision disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U15 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact get_ink_preview disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U16 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact inspect_ink_output disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U17 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact release_ink_output disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U18 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact describe_ink_capability disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U19 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact use_ink disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U20 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact import_ink_reference disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U21 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact export_ink_asset disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| U22 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact search_ink_library disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V01 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact renderEngineMode disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V02 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact fontFamily disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V03 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact historyLimit disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V04 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact pathStrokePreset disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V05 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact aiStartupMode disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V06 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact aiProvider disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V07 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact aiAuthMethod disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V08 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact aiDataPolicy disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V09 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact aiImagePolicy disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V10 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact aiLoggingPolicy disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V11 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact aiPreviewQuality disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V12 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact programSafetyMode disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V13 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact referenceRunner disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V14 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact studioSkeleton disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V15 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact adjustmentType disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V16 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact filterType disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V17 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact paintBrush disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V18 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact stylusTestPattern disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V19 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact calibrationProfileSelect disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V20 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact artworkQaBenchmark disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V21 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact artboardPreset disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V22 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact artboardOrientation disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V23 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact artboardPpi disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V24 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact artboardUnit disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V25 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact paperType disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V26 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact exportFormat disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V27 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact exportScope disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V28 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact exportScale disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| V29 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md exact exportPpi disposition; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md frozen list; UI-B UR review §4, per-ID source placement verified. | — |
| W01 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| W02 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| W03 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| W04 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| W05 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| W06 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| W07 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| W08 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| W09 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| W10 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| W11 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| W12 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| W13 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30 Specialist routing; UI-B UR review §2; artifact 10979718534 / ui.json checks #41–42. | — |
| X01 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X02 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X03 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X04 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X05 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X06 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X07 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X08 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X09 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X10 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X11 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X12 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X13 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| X14 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md excluded/deferred inventory around lines 790–810; ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md capability boundary. Negative UI claims checked against placement. | — |
| Y01 | PASS | artifact 10979718534 / ui.json checks #63, #84–85, #92, #96; ui-1280x1024.png. USER acceptance remains separately pending where marked. | — |
| Y02 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: visible Fit Content control returns a non-default camera to x=0,y=0,scale=1,rotation=0 in the empty-content fixture. | — |
| Y03 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: visible workspace Reset Current View route resets x/y/scale/rotation to 0/0/1/0. | — |
| Y04 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: bottom view Zoom In changes scale 1→1.2. | — |
| Y05 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: bottom view Zoom Out changes scale 1.2→1. | — |
| Y06 | PASS | qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: Reset Rotation changes camera rotation 0.7→0 and label becomes 旋轉 0°. | — |
| Y07 | FAIL | USER visual/ergonomic acceptance has not been recorded; AI cannot mark PASS. status/readout is low-noise. [PIX][USER] | USER-ACCEPT |
| Y08 | PASS | artifact 10979718534 / ui.json checks #63, #84–85, #92, #96; ui-1280x1024.png. USER acceptance remains separately pending where marked. | — |
| Y09 | PASS | artifact 10979718534 / ui.json checks #63, #84–85, #92, #96; ui-1280x1024.png. USER acceptance remains separately pending where marked. | — |
| Y10 | PASS | artifact 10979718534 / ui.json checks #63, #84–85, #92, #96; ui-1280x1024.png. USER acceptance remains separately pending where marked. | — |
| Z01 | FAIL | USER visual/ergonomic acceptance has not been recorded; AI cannot mark PASS. target is a light-gray Photoshop-style workstation. [PIX][USER] | USER-ACCEPT |
| Z02 | PASS | artifact 10979718534 / ui.json checks #79–83, #103–104 and ui-first-paint.png; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/brand/first-paint review. | — |
| Z03 | PASS | artifact 10979718534 / ui.json checks #79–83, #103–104 and ui-first-paint.png; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/brand/first-paint review. | — |
| Z04 | PASS | artifact 10979718534 / ui.json checks #79–83, #103–104 and ui-first-paint.png; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/brand/first-paint review. | — |
| Z05 | PASS | artifact 10979718534 / ui.json checks #79–83, #103–104 and ui-first-paint.png; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/brand/first-paint review. | — |
| Z06 | PASS | artifact 10979718534 / ui.json checks #79–83, #103–104 and ui-first-paint.png; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/brand/first-paint review. | — |
| Z07 | FAIL | USER visual/ergonomic acceptance has not been recorded; AI cannot mark PASS. normal command text is not too small/dim. [PIX][USER] | USER-ACCEPT |
| Z08 | PASS | artifact 10979718534 / ui.json checks #79–83, #103–104 and ui-first-paint.png; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/brand/first-paint review. | — |
| Z09 | PASS | artifact 10979718534 / ui.json checks #79–83, #103–104 and ui-first-paint.png; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/brand/first-paint review. | — |
| Z10 | FAIL | Final screenshots do not show the required state/comparison for Z10: icons have consistent box/stroke grammar. [PIX] | UI-AUD-02 |
| Z11 | FAIL | Final screenshots do not show the required state/comparison for Z11: active/hover/focus/disabled states are coherent. [INT][PIX] | UI-AUD-02 |
| Z12 | PASS | artifact 10979718534 / ui.json checks #79–83, #103–104 and ui-first-paint.png; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/brand/first-paint review. | — |
| Z13 | PASS | artifact 10979718534 / ui.json checks #79–83, #103–104 and ui-first-paint.png; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/brand/first-paint review. | — |
| Z14 | PASS | artifact 10979718534 / ui.json checks #79–83, #103–104 and ui-first-paint.png; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/brand/first-paint review. | — |
| Z15 | PASS | artifact 10979718534 / ui.json checks #79–83, #103–104 and ui-first-paint.png; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/brand/first-paint review. | — |
| AA01 | PASS | artifact 10979718534 / ui.json checks #93–102; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs responsive taxonomy assertion. | — |
| AA02 | PASS | artifact 10979718534 / ui.json checks #93–102; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs responsive taxonomy assertion. | — |
| AA03 | PASS | artifact 10979718534 / ui.json checks #93–102; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs responsive taxonomy assertion. | — |
| AA04 | PASS | artifact 10979718534 / ui.json checks #93–102; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs responsive taxonomy assertion. | — |
| AA05 | PASS | artifact 10979718534 / ui.json checks #93–102; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs responsive taxonomy assertion. | — |
| AA06 | PASS | artifact 10979718534 / ui.json checks #93–102; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs responsive taxonomy assertion. | — |
| AA07 | PASS | artifact 10979718534 / ui.json checks #93–102; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs responsive taxonomy assertion. | — |
| AA08 | PASS | artifact 10979718534 / ui.json checks #93–102; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs responsive taxonomy assertion. | — |
| AA09 | PASS | artifact 10979718534 / ui.json checks #93–102; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs responsive taxonomy assertion. | — |
| AA10 | FAIL | Placement/summary alone does not prove this exact item on current main (AA10: touch targets remain usable. [RESP]); source or targeted QA evidence needed. | UI-AUD-06 |
| AB01 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md engineering health delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #1, #78, #105–110. | — |
| AB02 | PASS | working/INK_UI_FINAL_CHECKLIST_CSS_UR_BROWSER_RECHECK_v1.0.md; exact PR #93 head b7dc5971768893c2d690eed22bf2801fc0aec4ae; focused source QA 26/26 PASS; targeted browser cascade checks PASS at 1280×1024 and 960×800; presentation !important finding closed after promotion c66b1eba2376f01cfba14f71b6f29d7e2fa022e4. | — |
| AB03 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md engineering health delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #1, #78, #105–110. | — |
| AB04 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md engineering health delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #1, #78, #105–110. | — |
| AB05 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md engineering health delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #1, #78, #105–110. | — |
| AB06 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md engineering health delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #1, #78, #105–110. | — |
| AB07 | PASS | Exact-candidate browser evidence on `8ae252f195d1ea539873dffb52ec6c1e36c0c9fc` verifies one visible `immediate-context` PRIMARY_HOME (`#contextualOptions`) with no duplicates in default, Layers-open, and Reference-open states. The nested `#quickControls` remains re-hosted contextual content but no longer claims PRIMARY_HOME authority. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-health-detail-8ae252f195d1/health-detail.json`; promoted by PR #98 as `c636354c29f0dfc5e379088de169d083e3df4ce5`. | — |
| AB08 | FAIL | No exhaustive current-main click-through inventory in final artifact; 110 Runtime tests cover a subset. | UI-AUD-06 |
| AB09 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md engineering health delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #1, #78, #105–110. | — |
| AB10 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md engineering health delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #1, #78, #105–110. | — |
| AB11 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md engineering health delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #1, #78, #105–110. | — |
| AB12 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md engineering health delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #1, #78, #105–110. | — |
| AB13 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md engineering health delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #1, #78, #105–110. | — |
| AB14 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md engineering health delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #1, #78, #105–110. | — |
| AB15 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md engineering health delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #1, #78, #105–110. | — |
| AC01 | PASS | artifact 10979718534: ui-1280x1024.png, ui-960x800.png, ui.json geometry and viewport/DPR. | — |
| AC02 | PASS | artifact 10979718534: ui-1280x1024.png, ui-960x800.png, ui.json geometry and viewport/DPR. | — |
| AC03 | FAIL | Final artifact contains only 1280×1024 and 960×800 UI screenshots; no compact/mobile screenshot. | UI-AUD-02 |
| AC04 | PASS | qa/evidence/ink-ui-final-checklist-closure-001/ink-top-61px.png, derived from final Runtime ui-1280x1024.png (artifact 10979718534); manifest.json SHA. | — |
| AC05 | PASS | qa/evidence/ink-ui-final-checklist-closure-001/ink-left-single-tools.png; final Runtime x=[0,40), y=[61,994), manifest.json SHA. | — |
| AC06 | FAIL | No separately labeled double-toolbar crop in final artifact. | UI-AUD-02 |
| AC07 | PASS | qa/evidence/ink-ui-final-checklist-closure-001/ink-right-collapsed-dock.png; final Runtime x=[1240,1280), y=[61,994), manifest.json SHA. | — |
| AC08 | PASS | qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/expanded-layers-1280x1024.png and expanded-layers-960x800.png are separately labeled expanded-panel browser captures for exact candidate b7dc5971768893c2d690eed22bf2801fc0aec4ae. | — |
| AC09 | FAIL | No History multi-state screenshot in final artifact. | UI-AUD-02 |
| AC10 | FAIL | No Navigator normal screenshot in final artifact. | UI-AUD-02 |
| AC11 | FAIL | No Navigator after pan/zoom screenshot in final artifact. | UI-AUD-02 |
| AC12 | FAIL | No Libraries search/result screenshot in final artifact. | UI-AUD-02 |
| AC13 | PASS | qa/evidence/ink-ui-final-checklist-closure-001/ps-ink-major-edge-overlay.png; PS ps-2 geometry plus final Runtime DOM/screenshot major edges; manifest.json states state difference. | — |
| AC14 | PASS | qa/evidence/ink-ui-final-checklist-closure-001/ps-ink-edge-difference.png; structural edge comparison only, excluding Dark/Light color difference; manifest.json. | — |
| AC15 | PASS | artifact 10979718534: ui-1280x1024.png, ui-960x800.png, ui.json geometry and viewport/DPR. | — |
| AC16 | PASS | artifact 10979718534: ui-1280x1024.png, ui-960x800.png, ui.json geometry and viewport/DPR. | — |
| AD01 | PASS | artifact 10979718534 / ui.json checks #1, #18, #25–31, #50, #84–85, #93–104; ui-first-paint.png / desktop captures. | — |
| AD02 | PASS | artifact 10979718534 / ui.json checks #1, #18, #25–31, #50, #84–85, #93–104; ui-first-paint.png / desktop captures. | — |
| AD03 | PASS | artifact 10979718534 / ui.json checks #1, #18, #25–31, #50, #84–85, #93–104; ui-first-paint.png / desktop captures. | — |
| AD04 | PASS | qa/evidence/ink-ui-final-checklist-issue92-ui-suite-306ff4e5364e/ui.json checks #26 and #79–83: normal interactive text is >=10px, panel titles 11px, metadata >=9px; measured contrast includes 6.91 contextual text, 14.47 panel title, 4.81 tab and 5.55 context label. | — |
| AD05 | PASS | artifact 10979718534 / ui.json checks #1, #18, #25–31, #50, #84–85, #93–104; ui-first-paint.png / desktop captures. | — |
| AD06 | PASS | artifact 10979718534 / ui.json checks #1, #18, #25–31, #50, #84–85, #93–104; ui-first-paint.png / desktop captures. | — |
| AD07 | PASS | artifact 10979718534 / ui.json checks #1, #18, #25–31, #50, #84–85, #93–104; ui-first-paint.png / desktop captures. | — |
| AD08 | PASS | artifact 10979718534 / ui.json checks #1, #18, #25–31, #50, #84–85, #93–104; ui-first-paint.png / desktop captures. | — |
| AD09 | PASS | artifact 10979718534 / ui.json checks #1, #18, #25–31, #50, #84–85, #93–104; ui-first-paint.png / desktop captures. | — |
| AD10 | PASS | artifact 10979718534 / ui.json checks #1, #18, #25–31, #50, #84–85, #93–104; ui-first-paint.png / desktop captures. | — |
| AD11 | FAIL | Placement/summary alone does not prove this exact item on current main (AD11: tool icons/control density visually match the Photoshop target.); source or targeted QA evidence needed. | UI-AUD-06 |
| AD12 | PASS | artifact 10979718534 / ui.json checks #1, #18, #25–31, #50, #84–85, #93–104; ui-first-paint.png / desktop captures. | — |
| AE01 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md reconciliation totals; UI-B UR review §4. | — |
| AE02 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md reconciliation totals; UI-B UR review §4. | — |
| AE03 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md reconciliation totals; UI-B UR review §4. | — |
| AE04 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md reconciliation totals; UI-B UR review §4. | — |
| AE05 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md reconciliation totals; UI-B UR review §4. | — |
| AE06 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md reconciliation totals; UI-B UR review §4. | — |
| AE07 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md §§29–30; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md reconciliation totals; UI-B UR review §4. | — |
| AE08 | FAIL | No exhaustive current-main visible-control click-through; earlier UI-B disposition cannot prove all current-main controls. | UI-AUD-06 |
| AE09 | PASS | Exact-candidate exhaustive Primary Home inventory on `8ae252f195d1ea539873dffb52ec6c1e36c0c9fc` reports zero duplicate Primary Homes across default, Layers-open, and Reference-open states; `immediate-context` resolves only to `#contextualOptions`. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-health-detail-8ae252f195d1/health-detail.json`; promoted by PR #98 as `c636354c29f0dfc5e379088de169d083e3df4ce5`. | — |
| AE10 | FAIL | No exhaustive current-main fake-visible-feature inventory. | UI-AUD-06 |
| AG01 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG02 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG03 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG04 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG05 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG06 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG07 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG08 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG09 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG10 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG11 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG12 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG13 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG14 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG15 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG16 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG17 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG18 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG19 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG20 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG21 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG22 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG23 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG24 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG25 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG26 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG27 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG28 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG29 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG30 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG31 | FAIL | Final screenshots do not show the required state/comparison for AG31: ruler / guide / snapping workstation surface satisfies the dedicated mandatory audit below and uses existing P1-C/C08 authorities. [SRC][INT][PIX] | UI-AUD-02 |
| AG32 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG33 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG34 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG35 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG36 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AG37 | PASS | working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md Photoshop adaptation/exclusion matrix; artifact 10979718534 / ui.json checks shell/panel checks #3–54; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md UI-C closure notes. | — |
| AI01 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md dynamic ruler and guide source paths; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md local source smoke; product/source shell and renderer. | — |
| AI02 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md dynamic ruler and guide source paths; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md local source smoke; product/source shell and renderer. | — |
| AI03 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md dynamic ruler and guide source paths; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md local source smoke; product/source shell and renderer. | — |
| AI04 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md dynamic ruler and guide source paths; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md local source smoke; product/source shell and renderer. | — |
| AI05 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Browser evidence verifies add/move/lock/show-hide/remove all mutate the same `page.guides` authority; visibility menu exists; four mutations entered History. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-7818b2321a48/guide-snap.json` (focused gate 12/15 PASS; AI10/AN04/AN05 isolated as one readout defect). Central Runtime not run. | — |
| AI06 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Guide snapping returns guide evidence and its line is sent through the actual renderer guide-drawing path. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-7818b2321a48/guide-snap.json` (focused gate 12/15 PASS; AI10/AN04/AN05 isolated as one readout defect). Central Runtime not run. | — |
| AI07 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Object edge and center snapping both resolve through the accepted smart-snap authority and render snap guide lines. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-7818b2321a48/guide-snap.json` (focused gate 12/15 PASS; AI10/AN04/AN05 isolated as one readout defect). Central Runtime not run. | — |
| AI08 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Grid snapping resolves X/Y through the same normalized snap settings authority. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-7818b2321a48/guide-snap.json` (focused gate 12/15 PASS; AI10/AN04/AN05 isolated as one readout defect). Central Runtime not run. | — |
| AI09 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: 15° angle snap works while positional guide snap remains independently active. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-7818b2321a48/guide-snap.json` (focused gate 12/15 PASS; AI10/AN04/AN05 isolated as one readout defect). Central Runtime not run. | — |
| AI10 | PASS | Promoted product `1c5006c66c1d840cca1d629488c40e5be85f72fd`: Equal-distance snapping remains X/Y active and now displays transient `X gap 20 px · Y gap 20 px` feedback derived only from existing snap evidence. Exact-candidate Guide/Snap evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-8ec9cdf4b450/guide-snap.json` = 15/15 PASS on `8ec9cdf4b450ba2e2be01534a23d0cec898c9ab9`. Central Runtime not run. | — |
| AI11 | FAIL | USER visual/ergonomic acceptance has not been recorded; AI cannot mark PASS. movement displays useful live distance / position information without becoming persistent UI noise. [INT][PIX][USER] | USER-ACCEPT |
| AI12 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Visible global Snap control toggles `page.snap.enabled` immediately and disables snapping when off. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-7818b2321a48/guide-snap.json` (focused gate 12/15 PASS; AI10/AN04/AN05 isolated as one readout defect). Central Runtime not run. | — |
| AI13 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: All six supported Snap To category controls are visible and a Guides toggle changes only that category. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-7818b2321a48/guide-snap.json` (focused gate 12/15 PASS; AI10/AN04/AN05 isolated as one readout defect). Central Runtime not run. | — |
| AI14 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Temporary bypass returns unsnapped movement while leaving saved/global snap settings unchanged. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-7818b2321a48/guide-snap.json` (focused gate 12/15 PASS; AI10/AN04/AN05 isolated as one readout defect). Central Runtime not run. | — |
| AI15 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: One normalized tolerance/hysteresis policy (`tolerance=9`, `hysteresis=3` in the focused probe) governs all snap classes. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-7818b2321a48/guide-snap.json` (focused gate 12/15 PASS; AI10/AN04/AN05 isolated as one readout defect). Central Runtime not run. | — |
| AI16 | FAIL | USER visual/ergonomic acceptance has not been recorded; AI cannot mark PASS. snapping does not visibly jitter, oscillate between competing candidates, or trap the pointer near threshold boundaries. [INT][USER] | USER-ACCEPT |
| AI17 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Persistent guide plus grid-snap state survives `InkStore` save/load through IndexedDB. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-7818b2321a48/guide-snap.json` (focused gate 12/15 PASS; AI10/AN04/AN05 isolated as one readout defect). Central Runtime not run. | — |
| AI18 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Guide mutations enter History; Undo/Redo correctly restores guide visibility state. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-7818b2321a48/guide-snap.json` (focused gate 12/15 PASS; AI10/AN04/AN05 isolated as one readout defect). Central Runtime not run. | — |
| AI19 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md dynamic ruler and guide source paths; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md local source smoke; product/source shell and renderer. | — |
| AI20 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md dynamic ruler and guide source paths; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md local source smoke; product/source shell and renderer. | — |
| AH01 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH02 | PASS | qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json: panel-tab-hover-focus PASS at 1280×1024 and 960×800. | — |
| AH03 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH04 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH05 | PASS | Focused current-product browser inventory on 7a86ef6124fb18c6d05c0c520020663f65882c5a exercised all 14 visible panel-menu routes (Properties/Layers/History/Navigator/Pages/Color/Channels/Adjustments/Libraries/Reference/Compose/CHAT/Revision/Specialist). Every trigger opened reset-width + close commands and close executed successfully. Evidence: qa/evidence/ink-ui-final-checklist-issue92-health-detail-7a86ef6124fb/health-detail.json. | — |
| AH06 | PASS | working/INK_UI_FINAL_CHECKLIST_EVIDENCE_ONLY_UR_R3_SOURCE_CLOSURE_v1.0.md: product/source/web-shell.js panel options menu exposes only reset panel width and close panel, dispatched to panel-local authorities; no application-wide command proxy is present in that menu. | — |
| AH07 | PASS | product/source/web-shell.js keeps frequent Navigator actions (Fit/−/+) and Pages actions (Add/Duplicate/Delete) in persistent shell-panel-footer surfaces; product/source/styles.css keeps shell-panel-body/footer visible and separate from panel-options-menu. | — |
| AH08 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH09 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH10 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH11 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH12 | PASS | qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json: expanded-panel-visible, panel-body-scrolling, splitter-drag-interaction and chrome-fit PASS at both viewports; labeled expanded/scrolled screenshots retained in the same evidence directory. | — |
| AH13 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH14 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH15 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH16 | PASS | working/INK_UI_FINAL_CHECKLIST_EVIDENCE_ONLY_UR_R3_SOURCE_CLOSURE_v1.0.md: product/source/index.html documentStatusStrip exposes document space/artboard plus view controls; secondary tool/object/autosave telemetry is aria-hidden and CSS .status-hidden-telemetry is display:none!important. | — |
| AH17 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH18 | PASS | working/INK_UI_FINAL_CHECKLIST_EVIDENCE_ONLY_UR_R3_SOURCE_CLOSURE_v1.0.md: documentStatusStrip markup contains document/view telemetry only and no Properties/Navigator state owner or control; panel state remains owned by shell panel authorities. | — |
| AH19 | PASS | working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md has explicit P1-G Color / Bit Depth / Channels rebaseline. Current product/source/ui/full-capability-controls.js routes Color Profile through raster Properties/dialog, Color Mode and Bit Depth through supported image commands, and Channels through the normal Channels panel. | — |
| AH20 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH21 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH22 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH23 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH24 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AH25 | N_A | Multi-document behavior is conditional “if later supported”; current baseline has one active-document state. Recheck if multi-document authority is introduced. | — |
| AH26 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md 28px panel headers, 3px splitter, status geometry; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md source smoke; artifact 10979718534 / ui.json checks #11, #31, #86–91. | — |
| AJ01 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ01. | UI-AUD-03 |
| AJ02 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ02. | UI-AUD-03 |
| AJ03 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ03. | UI-AUD-03 |
| AJ04 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ04. | UI-AUD-03 |
| AJ05 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ05. | UI-AUD-03 |
| AJ06 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ06. | UI-AUD-03 |
| AJ07 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ07. | UI-AUD-03 |
| AJ08 | PASS | working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md specified fields; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/geometry delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs for token and responsive fields. | — |
| AJ09 | PASS | working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md specified fields; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/geometry delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs for token and responsive fields. | — |
| AJ10 | PASS | working/INK_UI_FINAL_CHECKLIST_FINE_DETAIL_ACTUAL_AUDIT_v1.0.md §AJ10: Photoshop scrollbar target = 16 px; current-product browser evidence measures 16×16 px and exercises real scrolling at both required desktop viewports. | — |
| AJ11 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ11. | UI-AUD-03 |
| AJ12 | PASS | working/INK_UI_FINAL_CHECKLIST_FINE_DETAIL_ACTUAL_AUDIT_v1.0.md §AJ12: semantic cursor classes are explicitly mapped in current CSS (Navigator grab/grabbing, panel width ew-resize, stacked splitter ns-resize); splitter cursor is also browser-verified. | — |
| AJ13 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ13. | UI-AUD-03 |
| AJ14 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ14. | UI-AUD-03 |
| AJ15 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ15. | UI-AUD-03 |
| AJ16 | PASS | working/INK_UI_FINAL_CHECKLIST_FINE_DETAIL_ACTUAL_AUDIT_v1.0.md §AJ16: panel-options menu has one consistent trigger, exactly two panel-local commands, 20 px item height, compact popup geometry, and browser-verified hover/focus states. | — |
| AJ17 | PASS | working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md specified fields; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/geometry delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs for token and responsive fields. | — |
| AJ18 | PASS | working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md specified fields; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/geometry delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs for token and responsive fields. | — |
| AJ19 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ19. | UI-AUD-03 |
| AJ20 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ20. | UI-AUD-03 |
| AJ21 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ21. | UI-AUD-03 |
| AJ22 | PASS | working/INK_UI_FINAL_CHECKLIST_FINE_DETAIL_ACTUAL_AUDIT_v1.0.md §AJ22: workstation transitions are short presentation transitions and current CSS contains the mandatory prefers-reduced-motion override disabling animation/transition; focused CSS QA asserts that rule. | — |
| AJ23 | PASS | working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md specified fields; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/geometry delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs for token and responsive fields. | — |
| AJ24 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ24. | UI-AUD-03 |
| AJ25 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ25. | UI-AUD-03 |
| AJ26 | FAIL | Fine Detail Standard specifies the field, but no item-specific final Target/Actual/Evidence/Result record establishes AJ26. | UI-AUD-03 |
| AJ27 | FAIL | Fine Detail Standard §25 requires Component/Field/Target/Actual/Evidence/Result implementation table; no complete final actual/evidence table located. | UI-AUD-03 |
| AJ28 | PASS | working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md specified fields; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md token/geometry delta; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs for token and responsive fields. | — |
| AK01 | PASS | working/INK_UI_PS_REFERENCE_CAPTURE_AND_MEASUREMENT_PLAN_v0.1.md §A records Photoshop 21.2.12. | — |
| AK02 | PASS | working/INK_UI_PS_REFERENCE_CAPTURE_AND_MEASUREMENT_PLAN_v0.1.md §J: reference OS is explicitly UNKNOWN; source capture resolution is recorded as 1280×1024. No OS value is inferred from pixels. | — |
| AK03 | PASS | working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md §1 records 1280×994 application crop from 1280×1024 capture. | — |
| AK04 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md §1 explicitly says Windows display scale UNKNOWN for legacy evidence. | — |
| AK05 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md §1 explicitly says Photoshop UI scaling UNKNOWN for legacy evidence. | — |
| AK06 | PASS | working/INK_UI_PS_REFERENCE_CAPTURE_AND_MEASUREMENT_PLAN_v0.1.md §J records Photoshop UI Font Size = UNKNOWN for the legacy matched reference environment; no glyph-to-font-size inference is used. | — |
| AK07 | PASS | working/INK_UI_PS_REFERENCE_CAPTURE_AND_MEASUREMENT_PLAN_v0.1.md §J records Scale UI To Font = UNKNOWN for the legacy matched reference environment. | — |
| AK08 | PASS | working/INK_UI_PS_REFERENCE_CAPTURE_AND_MEASUREMENT_PLAN_v0.1.md §A records Traditional Chinese and dark theme. | — |
| AK09 | PASS | working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md measurement policy, observed density versus hitbox; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md environment caution. | — |
| AK10 | PASS | working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md measurement policy, observed density versus hitbox; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md environment caution. | — |
| AK11 | PASS | working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md measurement policy, observed density versus hitbox; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md environment caution. | — |
| AK12 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md §1 identifies five active-document captures and hashes, including rulers ON/OFF. | — |
| AK13 | PASS | working/INK_UI_PS_REFERENCE_CAPTURE_AND_MEASUREMENT_PLAN_v0.1.md §§F–J: P0 reference set is explicitly DISPOSITION_COMPLETE; captured items, official-source closures and optional/non-blocking items are individually classified, with additional dark-theme screenshots required = 0. | — |
| AK14 | PASS | working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md measurement policy, observed density versus hitbox; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md environment caution. | — |
| AL01 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL02 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL03 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL04 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL05 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL06 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL07 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL08 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL09 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL10 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL11 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL12 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL13 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL14 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL15 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AL16 | PASS | working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md static gate; artifact 10979718534 / ui.json checks #3–11 where geometry exercised. | — |
| AM01 | PASS | Focused browser evidence on 7a86ef6124fb18c6d05c0c520020663f65882c5a verifies tooltip fixed-placement to the right of the originating tool (target right=35 px, tooltip left=43 px), compact 26.14 px height, max-width 220 px, with text-dependent width 197.42 px. Evidence: qa/evidence/ink-ui-final-checklist-issue92-health-detail-7a86ef6124fb/health-detail.json. | — |
| AM02 | PASS | product/source/styles.css final workstation rule sets .subtool-button height/min-height=20px; qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json confirms the grouped brush flyout is rendered and visible at both required desktop viewports. | — |
| AM03 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md ruler live X/Y and Navigator source closure; artifact 10979718534 / ui.json checks #11; working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md optional classifications. | — |
| AM04 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md ruler live X/Y and Navigator source closure; artifact 10979718534 / ui.json checks #11; working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md optional classifications. | — |
| AM05 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md ruler live X/Y and Navigator source closure; artifact 10979718534 / ui.json checks #11; working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md optional classifications. | — |
| AM06 | PASS | Current main implements documentStatusStrip as document-local telemetry/view controls and exposes no status-information menu/popup in index.html, web-shell.js or src/ink.js. The conditional 'if implemented' popup requirement is therefore not activated; no application/global status menu has been invented. | — |
| AM07 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md ruler live X/Y and Navigator source closure; artifact 10979718534 / ui.json checks #11; working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md optional classifications. | — |
| AM08 | PASS | qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json: native INK scrollbar computed width/height = 16px at both 1280×1024 and 960×800; tokenized track/thumb also recorded. | — |
| AM09 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md ruler live X/Y and Navigator source closure; artifact 10979718534 / ui.json checks #11; working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md optional classifications. | — |
| AM10 | PASS | qa/evidence/ink-ui-final-checklist-issue92-layers-history-306ff4e5364e/layers-history.json: real dragover before drop produces layer-row.drop-before with a rendered 2 px insertion marker using the semantic accent. | — |
| AM11 | PASS | qa/evidence/ink-ui-final-checklist-issue92-layers-history-306ff4e5364e/layers-history.json: dragstart produces class=dragging, aria-grabbed=true and opacity 0.48, visibly distinct from ordinary selection. | — |
| AM12 | PASS | qa/evidence/ink-ui-final-checklist-issue92-layers-history-306ff4e5364e/layers-history.json: reorder commits through History label '拖曳移動圖層'; Undo restores the exact prior layer order and Redo restores the reordered state. | — |
| AM13 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_CLOSURE_v1.0.md ruler live X/Y and Navigator source closure; artifact 10979718534 / ui.json checks #11; working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md optional classifications. | — |
| AN01 | PASS | working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md behavior authority + qa/evidence/ink-ui-final-checklist-issue92-navigator-view-306ff4e5364e/navigator-view.json: proxy drag uses grab→grabbing semantics and pans the Runtime camera. | — |
| AN02 | PASS | Adobe Photoshop dock/resize behavior: https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/stack-floating-panels.html describes dragging a panel edge; final artifact 10979718534 ui.json checks #31 and #91 verify INK shared right-panel resize and canvas reflow. | — |
| AN03 | PASS | Promoted product `7818b2321a488371491bdc7cd936def382052fb7`: Edge and center alignment opportunities are both resolved and surfaced as visible snap guide lines. Evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-7818b2321a48/guide-snap.json` (focused gate 12/15 PASS; AI10/AN04/AN05 isolated as one readout defect). Central Runtime not run. | — |
| AN04 | PASS | Promoted product `1c5006c66c1d840cca1d629488c40e5be85f72fd`: Object-movement snap feedback now exposes a transient pixel readout and clears immediately when the interaction ends. Exact-candidate Guide/Snap evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-8ec9cdf4b450/guide-snap.json` = 15/15 PASS on `8ec9cdf4b450ba2e2be01534a23d0cec898c9ab9`. Central Runtime not run. | — |
| AN05 | PASS | Promoted product `1c5006c66c1d840cca1d629488c40e5be85f72fd`: Equal-spacing authority now surfaces its computed gap as visible transient feedback without creating a second snap state. Exact-candidate Guide/Snap evidence: `qa/evidence/ink-ui-final-checklist-issue92-guide-snap-8ec9cdf4b450/guide-snap.json` = 15/15 PASS on `8ec9cdf4b450ba2e2be01534a23d0cec898c9ab9`. Central Runtime not run. | — |
| AN06 | PASS | working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md; working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md reference/adaptation policy; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md light tokens. | — |
| AN07 | PASS | working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md; working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md reference/adaptation policy; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md light tokens. | — |
| AN08 | PASS | working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md; working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md reference/adaptation policy; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md light tokens. | — |
| AN09 | PASS | qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json: disabled-state-distinct PASS at both viewports; #undoBtn disabled=true with opacity 0.42 versus enabled control opacity 1. | — |
| AN10 | PASS | qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json: scrollbar geometry = 16×16 px and actual panel scroll range exercised at both required viewports; no Adobe-raster imitation requirement added. | — |
| AN11 | PASS | working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md; working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md reference/adaptation policy; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md light tokens. | — |
| AN12 | PASS | working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md; working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md reference/adaptation policy; working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md light tokens. | — |
| AO01 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md semantic token table; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs. | — |
| AO02 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md semantic token table; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs. | — |
| AO03 | PASS | working/INK_UI_FINAL_CHECKLIST_CSS_UR_BROWSER_RECHECK_v1.0.md; qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json: semantic Light token authority rendered PASS at both required viewports; panel heading/dock/footer roles resolve to named tokens; scrollbar uses --ink-ui-scrollbar-thumb; promoted by PR #93 c66b1eba2376f01cfba14f71b6f29d7e2fa022e4. | — |
| AO04 | PASS | Focused browser evidence on 7a86ef6124fb18c6d05c0c520020663f65882c5a resolves Light surface #F4F4F4 with primary #222222 = 14.47:1 and secondary #666666 = 5.22:1. Disabled text token #919191 plus disabled-state opacity/style is visibly distinct from enabled controls and materially stronger than the Adobe Spectrum disabled-content reference on the same surface. Evidence: qa/evidence/ink-ui-final-checklist-issue92-health-detail-7a86ef6124fb/health-detail.json. | — |
| AO05 | PASS | qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json: dock icon normal/hover/active states PASS at both viewports (normal muted, hover dark/light-gray, active blue/light-blue); disabled-state-distinct also PASS. | — |
| AO06 | PASS | qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json: panel menu normal/hover/focus, dock normal/hover/active, semantic border token rendering and expanded-panel state checks PASS at both required viewports. | — |
| AO07 | PASS | working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md measures current Photoshop-web Light anchors #E9E9E9 workspace / #FFFFFF primary surface / #3B63FB accent. qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json resolves current-product semantic tokens to the same #E9E9E9 / #FFFFFF / #3B63FB hierarchy at 1280×1024 and 960×800. | — |
| AO08 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md semantic token table; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs. | — |
| AO09 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md semantic token table; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs. | — |
| AO10 | FAIL | USER visual/ergonomic acceptance has not been recorded; AI cannot mark PASS. USER visual review approves the final light-gray token set. | USER-ACCEPT |
| AP01 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md semantic token table; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs. | — |
| AP02 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md semantic token table; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs. | — |
| AP03 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md semantic token table; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs. | — |
| AP04 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md semantic token table; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs. | — |
| AP05 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md semantic token table; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs. | — |
| AP06 | PASS | working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_HANDOFF_v1.0.md semantic token table; working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md; qa/ink-ui-c-photoshop-fidelity-closure.test.mjs. | — |
| AP07 | PASS | working/INK_UI_FINAL_CHECKLIST_CSS_UR_BROWSER_RECHECK_v1.0.md and targeted browser run 36511504388 review the final Light token set in expanded dense desktop workstation states at 1280×1024 and 960×800; MR verified this evidence covers current product source. | — |
| AF01 | PASS | UI-A/B/C UR reviews; working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md §§5–7; captured desktop screenshot inspection. | — |
| AF02 | PASS | UI-A/B/C UR reviews; working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md §§5–7; captured desktop screenshot inspection. | — |
| AF03 | PASS | UI-A/B/C UR reviews; working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md §§5–7; captured desktop screenshot inspection. | — |
| AF04 | PASS | working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md §§2,5: integrated tested SHA 24d3b3f607a17b3cb9331ec3635b34d804ee445b and run 36445204976. | — |
| AF05 | PASS | working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md §§2,5: integrated tested SHA 24d3b3f607a17b3cb9331ec3635b34d804ee445b and run 36445204976. | — |
| AF06 | PASS | working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md §§2,5: integrated tested SHA 24d3b3f607a17b3cb9331ec3635b34d804ee445b and run 36445204976. | — |
| AF07 | PASS | UI-A/B/C UR reviews; working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md §§5–7; captured desktop screenshot inspection. | — |
| AF08 | PASS | Current-main UI-A static assertion corrected on closure branch to renderer.viewportWorldBounds() + existing page camera; focused UI-A/B/C suite 25/25 PASS. No product source edit. | — |
| AF09 | FAIL | Placement/summary alone does not prove this exact item on current main (AF09: Photoshop alignment review = PASS.); source or targeted QA evidence needed. | UI-AUD-06 |
| AF10 | FAIL | USER visual/ergonomic acceptance has not been recorded; AI cannot mark PASS. USER visual acceptance/revision completed. | USER-ACCEPT |
| AF11 | FAIL | Other required checklist items have FAIL dispositions; closure predicate false. | UI-AUD-04 |
