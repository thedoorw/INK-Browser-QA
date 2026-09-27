# INK UI — Photoshop Light Theme Web Reference v0.1

STATUS: `UR_WEB_REFERENCE / UI_HOLD_COMPATIBLE / NO_PRODUCT_MUTATION`

DATE: 2026-09-27

BASE_MAIN: `2ef8b33bda2c506314e282fa3fa45f2990b497fd`

PURPOSE:
Use public Adobe/Photoshop references to close the remaining light-gray visual-system gap without requiring a new USER screenshot pack.

This document does not claim that public screenshots are exact pixel/RGB authority for Photoshop 21.2.12. It separates:
1. Photoshop theme behavior;
2. Adobe semantic color roles;
3. Adobe numeric light-theme token references;
4. uncontrolled screenshot visual hierarchy.

---

# 1. Photoshop theme authority

Adobe Photoshop UXP documentation explicitly defines four Photoshop host themes:

```text
Darkest
Dark
Light
Lightest
```

Photoshop also exposes theme-aware host CSS variables to plugin UI:

```text
--uxp-host-background-color
--uxp-host-text-color
--uxp-host-border-color
--uxp-host-link-text-color
--uxp-host-widget-hover-background-color
--uxp-host-widget-hover-text-color
--uxp-host-widget-hover-border-color
--uxp-host-text-color-secondary
--uxp-host-link-hover-text-color
--uxp-host-label-text-color
```

Adobe source:
https://developer.adobe.com/photoshop/uxp/guides/theme-awareness/

Photoshop UXP design guidance also shows separate `Lightest and Light Themes` for panel UI:
https://developer.adobe.com/photoshop/uxp/design/ux-patterns/Designingforphotoshop/

Conclusion:

```text
PHOTOSHOP_LIGHT_THEME_EXISTENCE = OFFICIAL_CONFIRMED
PHOTOSHOP_LIGHT_THEME_SEMANTIC_ROLES = OFFICIAL_CONFIRMED
```

---

# 2. Historical desktop Photoshop light-theme evidence

Adobe-derived/historical Photoshop documentation confirms four grayscale interface themes:
- Black;
- Dark Gray;
- Medium Gray;
- Light Gray.

Photoshop CS6/CC tutorials also show the far-right / lightest theme applied to the full desktop workstation.

Useful public visual references:

- Photoshop Essentials — full lightest Photoshop CC workstation:
  https://pe-images.s3.amazonaws.com/basics/cc/2017/getting-started/preferences/photoshop-lightest-color-theme.jpg

- CG.com.tw — full Photoshop CS6 light UI:
  https://www.cg.com.tw/Photoshop/pic/CS6/PhotoshopCS6_UI_Light.jpg

- Photoshop Essentials — CS6 interface themes:
  https://www.photoshopessentials.com/basics/interface-cs6/

- Photoshop Essentials — Photoshop CC lightest theme:
  https://www.photoshopessentials.com/basics/essential-photoshop-preferences-beginners/

These are:
`VISUAL_REFERENCE_ONLY`

because compression, resizing, OS chrome, version, UI font size and display scaling are not fully controlled.

---

# 3. Visual hierarchy established from public light-theme references

Across the public Photoshop Light/Lightest examples:

```text
application/menu chrome
→ very light neutral gray

Options / Tools / Panel chrome
→ very light neutral gray / near-white family

panel body
→ light gray to near-white

fields / controls
→ slightly differentiated light surfaces with visible gray border

primary text / icons
→ dark neutral gray

secondary text
→ medium gray

selected rows / active controls
→ neutral gray or restrained accent

canvas pasteboard/workbench
→ materially darker neutral gray than the application chrome
```

Important:
Photoshop's pasteboard/document surround can be configured separately from the overall Color Theme. Therefore INK must not use one single gray token for both:
- application chrome;
- document/workbench background.

```text
CHROME_PALETTE != CANVAS_WORKBENCH_PALETTE
```

---

# 4. Adobe Spectrum numeric reference

Photoshop UXP Spectrum components are designed to support Photoshop themes.

Current Adobe Spectrum light-theme data provides a useful Adobe-native numerical reference. These values are **not claimed to be exact Photoshop desktop chrome values**.

Selected current Spectrum light values:

```text
background layer 2       rgb(255,255,255)
background layer 1       rgb(248,248,248)

neutral subtle bg        rgb(233,233,233)
disabled background      rgb(233,233,233)
disabled border          rgb(218,218,218)
disabled content         rgb(198,198,198)

neutral visual           rgb(143,143,143)
secondary/subdued text   rgb(80,80,80)
primary neutral text     rgb(41,41,41)
strong hover/focus text  rgb(19,19,19)

accent default           rgb(59,99,251)
accent hover/down        rgb(39,77,234)
```

Adobe Spectrum sources:
- https://spectrum.adobe.com/page/color-system/
- https://opensource.adobe.com/spectrum-design-data/tokens/color-palette/
- https://opensource.adobe.com/spectrum-design-data/tokens/color-aliases/

Classification:
`ADOBE_SPECTRUM_REFERENCE / NOT_EXACT_PS_CHROME`

---

# 5. INK semantic light-gray token model

INK should use semantic roles rather than component-local hardcoded grays.

Recommended authority names:

```text
INK_BG_BASE
INK_BG_LAYER_1
INK_BG_LAYER_2
INK_BG_ELEVATED

INK_TEXT_PRIMARY
INK_TEXT_SECONDARY
INK_TEXT_DISABLED

INK_ICON_PRIMARY
INK_ICON_SECONDARY
INK_ICON_DISABLED

INK_BORDER_SUBTLE
INK_BORDER_CONTROL
INK_BORDER_DISABLED

INK_CONTROL_BG
INK_CONTROL_HOVER
INK_CONTROL_ACTIVE
INK_CONTROL_DISABLED

INK_SELECTION_BG
INK_FOCUS_RING
INK_ACCENT

INK_CANVAS_WORKBENCH
INK_DOCUMENT_SURROUND
```

Semantic mapping should be inspired by Photoshop UXP host variables, not by scattered sampled pixels.

---

# 6. Initial Adobe-native candidate range

For UI prototyping only, the following is an acceptable starting range:

```text
very-light chrome        248–255
light structural gray    233–248
border gray              198–218
secondary/icon gray      80–143
primary text/icon        19–41
```

This is intentionally a range, not a final palette.

Final token values must be visually reconciled against:
- the fixed Photoshop geometry references;
- public Photoshop Light/Lightest hierarchy;
- INK readability requirements;
- USER visual review.

---

# 7. What is now closed

```text
LIGHT_THEME_EXISTS = CLOSED
LIGHTEST_THEME_EXISTS = CLOSED
LIGHT_THEME_SEMANTIC_MODEL = CLOSED
ADOBE_NUMERIC_LIGHT_REFERENCE = CLOSED
PUBLIC_FULL_WORKSTATION_LIGHT_REFERENCE = CLOSED
```

The previous statement:

`LIGHT_GRAY_DESKTOP_PS_RGB_TOKENS = REFERENCE_MISSING`

is refined to:

```text
EXACT_PHOTOSHOP_21_2_12_LIGHT_RGB = NOT_REQUIRED
INK_LIGHT_GRAY_TOKENS = UR_ADAPTATION_REQUIRED
```

Reason:
INK's goal is a Photoshop-aligned light-gray workstation, not a claim of binary-identical Adobe internal RGB values.

---

# 8. Remaining task

UR must later define one final INK light-gray token set and visually test it in Runtime.

Acceptance:

```text
LIGHT_GRAY_TOKEN_AUTHORITY_COUNT = 1
COMPONENT_LOCAL_RANDOM_GRAYS = 0
CHROME_AND_WORKBENCH_SEPARATED = YES
TEXT_CONTRAST = PASS
ICON_CONTRAST = PASS
CONTROL_STATE_CONTRAST = PASS
PHOTOSHOP_LIGHT_HIERARCHY = PASS
USER_VISUAL_REVIEW = PASS
```

No additional Photoshop Light screenshot is required unless USER wants exact visual comparison against a specific Photoshop version/theme state.
