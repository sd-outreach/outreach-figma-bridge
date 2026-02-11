---
name: 'Quark 2 Tokens'
description: 'Quark 2.0 design system tokens — loaded when design-system-config.mdc references this file as the active token file'
---

# Quark 2.0 – Figma Design System Tokens

This file contains all Quark 2.0 (Outreach) design tokens: colors, typography, spacing, elevation, shapes, and component specifications. It is loaded by `design-system-config.mdc` when Quark is the active design system.

When this file is active, follow it precisely. Never guess colors, sizes, or spacing — use the exact token values below. For tool usage rules (which tools to call, build workflow, validation), see `figma-tool-usage-rules.mdc`.

**Source file:** Components (Quark 2.20) — [Figma](https://www.figma.com/design/Q9ME8GTTEgj6sVDeh7CUTV)

---

## 1. Color System (Quark 2.0 Light Theme)

All color values are in **Figma RGB 0-1 format** (not hex).

### Primary

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| primary.main | #5E5EAF | `{ r: 0.369, g: 0.369, b: 0.686 }` |
| primary.light | #797BBD | `{ r: 0.475, g: 0.482, b: 0.741 }` |
| primary.dark | #3F3B98 | `{ r: 0.247, g: 0.231, b: 0.596 }` |
| primary.contrastText | #FFFFFF | `{ r: 1, g: 1, b: 1 }` |
| primary.hover | #5A5AA8 | `{ r: 0.353, g: 0.353, b: 0.659 }` opacity 0.04 |
| primary.selected | #5E5EAF | `{ r: 0.369, g: 0.369, b: 0.686 }` opacity 0.08 |
| primary.active | #5E5EAF | `{ r: 0.369, g: 0.369, b: 0.686 }` opacity 0.24 |
| primary.border | #5E5EAF | `{ r: 0.369, g: 0.369, b: 0.686 }` opacity 0.24 |
| primary.containedHover | #5A5AA8 | `{ r: 0.353, g: 0.353, b: 0.659 }` |
| primary.containedActive | #8481C9 | `{ r: 0.518, g: 0.506, b: 0.788 }` |

### Secondary

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| secondary.main | #7971FF | `{ r: 0.475, g: 0.443, b: 1 }` |
| secondary.light | #AA9BFD | `{ r: 0.667, g: 0.608, b: 0.992 }` |
| secondary.dark | #504BB2 | `{ r: 0.314, g: 0.294, b: 0.698 }` |
| secondary.contrastText | #FFFFFF | `{ r: 1, g: 1, b: 1 }` |
| secondary.hover | #7971FF | `{ r: 0.475, g: 0.443, b: 1 }` opacity 0.04 |
| secondary.selected | #7971FF | `{ r: 0.475, g: 0.443, b: 1 }` opacity 0.08 |
| secondary.active | #7971FF | `{ r: 0.475, g: 0.443, b: 1 }` opacity 0.24 |
| secondary.border | #7971FF | `{ r: 0.475, g: 0.443, b: 1 }` opacity 0.5 |
| secondary.containedHover | #746CF4 | `{ r: 0.455, g: 0.424, b: 0.957 }` |
| secondary.containedActive | #504BB2 | `{ r: 0.314, g: 0.294, b: 0.698 }` |

### Brand

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| brand.outreach | #5951FF | `{ r: 0.349, g: 0.318, b: 1 }` |
| brand.salesforce | #0D9DDA | `{ r: 0.051, g: 0.616, b: 0.855 }` |
| brand.dynamics | #002050 | `{ r: 0, g: 0.125, b: 0.314 }` |

### Text

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| text.primary | #454262 | `{ r: 0.271, g: 0.259, b: 0.384 }` |
| text.secondary | #686783 | `{ r: 0.408, g: 0.404, b: 0.514 }` |
| text.tertiary | #5D5A70 | `{ r: 0.365, g: 0.353, b: 0.439 }` |
| text.hint | #787491 | `{ r: 0.47, g: 0.456, b: 0.57 }` |
| text.disabled | #A3A2BD | `{ r: 0.639, g: 0.635, b: 0.741 }` |
| text.link | #5951FF | `{ r: 0.349, g: 0.318, b: 1 }` |
| text.active | #5951FF | `{ r: 0.349, g: 0.318, b: 1 }` |
| text.primaryAlt | #4F4C92 | `{ r: 0.31, g: 0.298, b: 0.573 }` |
| text.secondaryAlt | #5E5EAF | `{ r: 0.369, g: 0.369, b: 0.686 }` |

### Error

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| error.main | #C62F4C | `{ r: 0.776, g: 0.184, b: 0.298 }` |
| error.light | #F48E97 | `{ r: 0.957, g: 0.557, b: 0.592 }` |
| error.dark | #871C31 | `{ r: 0.529, g: 0.11, b: 0.192 }` |
| error.contrastText | #FFFFFF | `{ r: 1, g: 1, b: 1 }` |
| error.darkText | #5F1221 | `{ r: 0.373, g: 0.071, b: 0.129 }` |
| error.lightBackground | #FFECED | `{ r: 1, g: 0.925, b: 0.929 }` |

### Warning

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| warning.main | #D7782C | `{ r: 0.843, g: 0.471, b: 0.173 }` |
| warning.light | #F19552 | `{ r: 0.945, g: 0.584, b: 0.322 }` |
| warning.dark | #6C3A12 | `{ r: 0.424, g: 0.227, b: 0.071 }` |
| warning.contrastText | #FFFFFF | `{ r: 1, g: 1, b: 1 }` |
| warning.darkText | #4C2709 | `{ r: 0.298, g: 0.153, b: 0.035 }` |
| warning.lightBg | #FDF2E2 | `{ r: 0.992, g: 0.95, b: 0.886 }` |

### Success

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| success.main | #11A389 | `{ r: 0.067, g: 0.639, b: 0.537 }` |
| success.light | #48BEA3 | `{ r: 0.282, g: 0.745, b: 0.639 }` |
| success.dark | #005143 | `{ r: 0, g: 0.318, b: 0.263 }` |
| success.contrastText | #FFFFFF | `{ r: 1, g: 1, b: 1 }` |
| success.darkText | #02382D | `{ r: 0.008, g: 0.22, b: 0.176 }` |
| success.lightBg | #ECF3F2 | `{ r: 0.925, g: 0.953, b: 0.949 }` |

### Info

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| info.main | #2E97E0 | `{ r: 0.18, g: 0.592, b: 0.878 }` |
| info.light | #42AFFC | `{ r: 0.259, g: 0.686, b: 0.988 }` |
| info.dark | #044A76 | `{ r: 0.016, g: 0.29, b: 0.463 }` |
| info.contrastText | #FFFFFF | `{ r: 1, g: 1, b: 1 }` |
| info.darkText | #003355 | `{ r: 0, g: 0.2, b: 0.333 }` |
| info.lightBackground | #E6EFFF | `{ r: 0.902, g: 0.937, b: 1 }` |

### Action

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| action.hover | #454262 | `{ r: 0.271, g: 0.259, b: 0.384 }` opacity 0.04 |
| action.selected | #454262 | `{ r: 0.271, g: 0.259, b: 0.384 }` opacity 0.08 |
| action.active | #454262 | `{ r: 0.271, g: 0.259, b: 0.384 }` opacity 0.24 |
| action.disabled | #A3A2BD | `{ r: 0.639, g: 0.635, b: 0.741 }` opacity 0.38 |
| action.disabledBackground | #F6F6F7 | `{ r: 0.965, g: 0.965, b: 0.969 }` |
| action.border | #E8EAF1 | `{ r: 0.91, g: 0.918, b: 0.945 }` |
| action.hoverAlt | #63627D | `{ r: 0.388, g: 0.384, b: 0.49 }` |

### Background

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| background.default | #F9F6F6 | gradient, first stop `{ r: 0.976, g: 0.965, b: 0.965 }` |
| background.cool | #F4F4F7 | `{ r: 0.957, g: 0.957, b: 0.969 }` |
| background.warm | #F7F4F1 | `{ r: 0.969, g: 0.957, b: 0.945 }` |
| background.paperalt | #F9F9FB | `{ r: 0.976, g: 0.976, b: 0.984 }` |
| background.input | #FFFFFF | `{ r: 1, g: 1, b: 1 }` |
| background.layer | #E8EAF1 | `{ r: 0.91, g: 0.918, b: 0.945 }` |
| background.layerHover | #DEE0E7 | `{ r: 0.871, g: 0.878, b: 0.906 }` |
| background.coolHover | #EAEAED | `{ r: 0.918, g: 0.918, b: 0.929 }` |
| background.navigationActive | #F2F2FF | `{ r: 0.949, g: 0.949, b: 1 }` |
| background.defaultActive | #F2F2FF | `{ r: 0.949, g: 0.949, b: 1 }` |
| background.tableHover | #F0F0F3 | `{ r: 0.941, g: 0.941, b: 0.953 }` |
| background.tableSelected | #EBEBFF | `{ r: 0.92, g: 0.92, b: 1 }` |

### Border

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| border.default | #CCCEDB | `{ r: 0.8, g: 0.808, b: 0.859 }` |
| border.hover | #5A5AA8 | `{ r: 0.353, g: 0.353, b: 0.659 }` |
| border.active | #7971FF | `{ r: 0.475, g: 0.443, b: 1 }` |

### Other / Common

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| paper | #FEFDFC | `{ r: 0.996, g: 0.992, b: 0.988 }` |
| divider | #E8EAF1 | `{ r: 0.91, g: 0.918, b: 0.945 }` |
| backdrop | #454262 | `{ r: 0.271, g: 0.259, b: 0.384 }` opacity 0.5 |
| snackbar | #454262 | `{ r: 0.271, g: 0.259, b: 0.384 }` |
| black | #010112 | `{ r: 0.004, g: 0.004, b: 0.071 }` |
| white | #FFFFFF | `{ r: 1, g: 1, b: 1 }` |

### Natural Palette (Grays)

| Token | Hex | Figma RGB |
|-------|-----|-----------|
| gray-50 | #FAFAFB | `{ r: 0.98, g: 0.98, b: 0.984 }` |
| gray-100 | #F5F5FA | `{ r: 0.961, g: 0.961, b: 0.98 }` |
| gray-200 | #E8EAF1 | `{ r: 0.91, g: 0.918, b: 0.945 }` |
| gray-300 | #CCCEDB | `{ r: 0.8, g: 0.808, b: 0.859 }` |
| gray-400 | #9293AD | `{ r: 0.573, g: 0.576, b: 0.678 }` |
| gray-500 | #5E5D84 | `{ r: 0.369, g: 0.365, b: 0.518 }` |
| gray-600 | #56557B | `{ r: 0.337, g: 0.333, b: 0.482 }` |
| gray-700 | #4D4B6F | `{ r: 0.302, g: 0.294, b: 0.435 }` |
| gray-800 | #454262 | `{ r: 0.271, g: 0.259, b: 0.384 }` |
| gray-900 | #373249 | `{ r: 0.216, g: 0.196, b: 0.286 }` |

### Accent Colors

Eight accent palettes are available. Each has `extraLight`, `light`, `main`, `dark`, `extraDark`, plus contrast text variants:

| Palette | main (Hex) | main (Figma RGB) |
|---------|-----------|-----------------|
| Passion | #5951FF | `{ r: 0.349, g: 0.318, b: 1 }` |
| Rain | #1A8CFF | `{ r: 0.1, g: 0.55, b: 1 }` |
| Mint | #00807F | `{ r: 0, g: 0.5, b: 0.5 }` |
| Pitaya | #D41162 | `{ r: 0.832, g: 0.067, b: 0.386 }` |
| Coral | #E26C5A | `{ r: 0.886, g: 0.425, b: 0.354 }` |
| Ochre | #C98500 | `{ r: 0.788, g: 0.522, b: 0 }` |
| Sand | #A98C70 | `{ r: 0.663, g: 0.549, b: 0.439 }` |
| Slate | #878A92 | `{ r: 0.529, g: 0.541, b: 0.573 }` |

---

## 2. Typography Scale (Quark 2.0)

Quark uses two typeface families:
- **Headings:** Work Sans (SemiBold / Bold)
- **Body/UI:** Roboto Flex (Regular / SemiBold)

If Roboto Flex is unavailable, fall back to **Roboto** or **Inter**.

| Style | Font Family | Font Style | Size (px) |
|-------|-------------|------------|-----------|
| H1 | Work Sans | SemiBold | 40 |
| H2 | Work Sans | SemiBold | 32 |
| H3 | Work Sans | SemiBold | 28 |
| H4 | Work Sans | SemiBold | 24 |
| H5 | Work Sans | SemiBold | 20 |
| H6 | Work Sans | SemiBold | 16 |
| Subtitle1 | Roboto Flex | SemiBold | 14 |
| Subtitle2 | Roboto Flex | SemiBold | 13 |
| Body | Roboto Flex | Regular | 14 |
| Body (bold) | Roboto Flex | SemiBold | 14 |
| Body 2 | Roboto Flex | Regular | 15 |
| Body 2 (bold) | Roboto Flex | SemiBold | 15 |
| Caption | Roboto Flex | Regular | 13 |
| Caption (bold) | Roboto Flex | SemiBold | 13 |
| Overline | Work Sans | Bold | 13 |
| Button | Roboto Flex | SemiBold | 14 |

Font mapping:
- **Headings (H1–H6, Overline):** fontFamily = "Work Sans", fontStyle = "SemiBold" (or "Bold" for Overline)
- **Body/UI (Body, Caption, Subtitle, Button):** fontFamily = "Roboto Flex", fontStyle = "Regular" or "SemiBold"

---

## 3. Spacing Tokens

Quark uses a **base spacing unit of 8px**. Spacing multipliers:

| Multiplier | Size (px) | Usage |
|-----------|-----------|-------|
| 0.5 | 4px | Tight gaps, icon-to-text |
| 1 | 8px | Small gap between related items |
| 1.5 | 12px | Inner padding small |
| 2 | 16px | Standard padding, section gaps |
| 2.5 | 20px | Medium spacing |
| 3 | 24px | Content section gaps |
| 3.5 | 28px | Large element spacing |
| 4 | 32px | Section separation |
| 4.5 | 36px | Large section padding |
| 5 | 40px | Heading area spacing |
| 6 | 48px | Major section gaps |
| 7 | 56px | Large containers |
| 8 | 64px | Page-level containers |
| 9 | 72px | Extra-large containers |

Screen-level padding: **16px** on mobile, **24px** on desktop.
Content section spacing: **24px** between major sections, **16px** between related items, **8px** between tightly coupled items.

---

## 4. Shape (Corner Radius)

| Shape Token | Radius | Typical Usage |
|-------------|--------|---------------|
| None | 0px | Flat elements, dividers |
| XS | 4px | Small badges, tags |
| Small | 8px | Buttons, text fields, inputs, cards |
| Medium | 12px | Cards, containers |
| Large | 16px | Dialogs, large cards |
| XL | 20px | Bottom sheets |
| Full / Pill | 100px | Pill buttons, chips, avatars |

**Note:** Quark buttons use `8px` corner radius (not pill/full like M3). Dialog uses `8px`. Cards use `8px`.

---

## 5. Elevation (Drop Shadows)

Quark defines named elevation levels (all DROP_SHADOW type):

### Elevation/1 (Cards, subtle lift)
```
Shadow 1: offset {x:0, y:1}, radius: 2, color {r:0.271, g:0.259, b:0.384, a:0.16}
Shadow 2: offset {x:0, y:0}, radius: 1, color {r:0.271, g:0.259, b:0.384, a:0.16}
```

### Elevation/4 (Elevated cards, dropdowns)
```
Shadow 1: offset {x:0, y:1}, radius: 7, color {r:0.271, g:0.259, b:0.384, a:0.08}
Shadow 2: offset {x:0, y:4}, radius: 5, color {r:0.216, g:0.196, b:0.286, a:0.14}
Shadow 3: offset {x:0, y:2}, radius: 1, color {r:0.216, g:0.196, b:0.286, a:0.04}
```

### Elevation/8 (Dialogs, popovers)
```
Shadow 1: offset {x:0, y:3}, radius: 14, color {r:0.216, g:0.196, b:0.286, a:0.1}
Shadow 2: offset {x:0, y:8}, radius: 10, color {r:0.216, g:0.196, b:0.286, a:0.08}
Shadow 3: offset {x:0, y:3}, radius: 3, color {r:0.216, g:0.196, b:0.286, a:0.2}
```

### Elevation/12 (Modals, dialogs)
```
Shadow 1: offset {x:0, y:12}, radius: 17, spread: 2, color {r:0.216, g:0.196, b:0.286, a:0.12}
Shadow 2: offset {x:0, y:12}, radius: 17, spread: 2, color {r:0.216, g:0.196, b:0.286, a:0.12}
Shadow 3: offset {x:0, y:2}, radius: 4, spread: 2, color {r:0.216, g:0.196, b:0.286, a:0.08}
```

### Elevation/16 (Top-level floating)
```
Shadow 1: offset {x:0, y:14}, radius: 24, color {r:0, g:0, b:0, a:0.14}
Shadow 2: offset {x:0, y:6}, radius: 30, color {r:0.271, g:0.259, b:0.384, a:0.12}
Shadow 3: offset {x:0, y:3}, radius: 3, color {r:0.216, g:0.196, b:0.286, a:0.08}
```

---

## 6. Component Specifications

Exact specs for each component type. Refer to `tool-usage-rules.mdc` for build workflow and tool selection.

### Buttons

**Contained Button (Primary)** — default when PM says "button":
- Height: 36px
- Corner radius: 100px (pill)
- Horizontal padding: 12px, Vertical padding: 8px
- Fill: primary.main `{ r: 0.369, g: 0.369, b: 0.686 }`
- Text: primary.contrastText (white), Button style (Roboto Flex SemiBold 14px)
- Icon: 20x20px if present
- Auto layout: HORIZONTAL, center/center, itemSpacing: 4px

**Contained Button (Secondary)**:
- Same dimensions as Primary
- Fill: secondary.main `{ r: 0.475, g: 0.443, b: 1 }`
- Text: secondary.contrastText (white)

**Outlined Button**:
- Same dimensions
- Fill: transparent (no fill)
- Stroke: 1px, border.default `{ r: 0.8, g: 0.808, b: 0.859 }`
- Text: primary.main

**Text Button** (when PM says "link" or "text button"):
- Height: 36px
- No fill, no stroke
- Text: primary.main, Button style
- Padding: 8px horizontal

**Disabled Button**:
- Fill: action.disabledBackground `{ r: 0.965, g: 0.965, b: 0.969 }`
- Text: text.disabled `{ r: 0.639, g: 0.635, b: 0.741 }`

### Text Fields / Inputs

**Default Text Field** (default when PM says "input" or "text field"):
- Width: 220px (default, adjustable), Height: 36px
- Corner radius: 8px
- Stroke: 1px, border.default `{ r: 0.8, g: 0.808, b: 0.859 }`
- Fill: background.input `{ r: 1, g: 1, b: 1 }`
- Label: Caption style (Roboto Flex Regular 13px), text.secondary color, above field
- Placeholder text: Body style (14px Regular), text.hint color
- Input text: Body style (14px Regular), text.primary color
- Auto layout: VERTICAL for label+field group, itemSpacing: 4px
- Focus state: stroke changes to border.active `{ r: 0.475, g: 0.443, b: 1 }`

### Select / Dropdown

**Select**:
- Width: 220px, Height: 36px
- Corner radius: 8px
- Same styling as Text Field
- Chevron icon: 20x20px, right-aligned
- Auto layout: HORIZONTAL with SPACE_BETWEEN

### Checkboxes

**Checkbox**:
- Standard: 36x36px touch target, inner box ~18x18px
- Corner radius: 4px on box
- Unchecked: stroke 1px border.default, no fill
- Checked: fill primary.main, check icon in contrastText
- Label: Body style, text.primary, left of checkbox

### Radio Buttons

**Radio**:
- Outer circle: 20x20px, 1px stroke border.default
- Inner dot when selected: 10px, primary.main fill
- Label: Body style, text.primary

### Switches / Toggles

**Switch**:
- Track: 34x20px, corner radius full
- Thumb: 16x16px circle
- Off: track fill gray-300, thumb fill white
- On: track fill primary.main, thumb fill white

### Chips / Tags

**Chip**:
- Height: 24px
- Corner radius: 100px (pill)
- Horizontal padding: 8px
- Text: Caption style (13px), text.primary
- Variants: filled (background.layer fill), outlined (1px border.default)

**Tag / Status Badge**:
- Height: 20px
- Corner radius: 4px
- Padding: 4px horizontal
- Text: Caption bold (13px SemiBold)
- Semantic colors: use error.lightBackground / success.lightBg / warning.lightBg / info.lightBackground for fill, matching darkText tokens for text color

### Cards

**Outlined Card** (default when PM says "card"):
- Corner radius: 8px
- Stroke: 1px, border.default (gray-300)
- Fill: paper `{ r: 0.996, g: 0.992, b: 0.988 }`
- Padding: 16px
- Auto layout: VERTICAL, itemSpacing: 8px

**Elevated Card**:
- Corner radius: 8px
- No stroke
- Fill: paper
- Elevation: Level 1
- Padding: 16px

### Dialogs / Modals

**Dialog**:
- Min width: 452px, flexible height
- Corner radius: 8px
- Fill: paper
- Elevation: Level 12
- Padding: 24px
- Title: H5 (Work Sans SemiBold 20px), text.primary
- Body: Body (Roboto Flex Regular 14px), text.secondary
- Actions: right-aligned, contained/text buttons, gap 8px
- Backdrop: backdrop token (gray-800 at 50% opacity)

### Navigation

**Top App Bar / Header**:
- Height: 56px
- Width: fill container
- Fill: paper
- Elevation: Level 1
- Title: H6 (Work Sans SemiBold 16px), text.primary
- Padding: 16px horizontal
- Auto layout: HORIZONTAL, CENTER vertical alignment

**Navigation Sidebar**:
- Width: 240px (expanded), 56px (collapsed)
- Fill: paper
- Nav items: height 36px, padding 8px 12px, corner radius 8px
- Active item: background.navigationActive `{ r: 0.949, g: 0.949, b: 1 }`, text.active color
- Inactive item: text.secondary color
- Icon: 20x20px, gap 8px to label
- Section spacing: 24px between groups

**Tabs**:
- Tab height: 36px
- Active tab: text.active, 2px bottom border (secondary.main)
- Inactive tab: text.secondary, no border
- Tab spacing: 0px (tabs are adjacent)
- Padding: 12px horizontal per tab

**Breadcrumbs**:
- Text: Caption style, text.secondary
- Active/current: text.primary, SemiBold
- Separator: "/" in text.hint, spacing 4px

### Tooltips

**Tooltip**:
- Corner radius: 4px
- Fill: snackbar (gray-800) `{ r: 0.271, g: 0.259, b: 0.384 }`
- Text: white, Caption style (13px)
- Padding: 4px 8px

### Alerts / Banners

**Alert**:
- Corner radius: 8px
- Fill: use semantic lightBackground token (error.lightBackground, warning.lightBg, etc.)
- Left border: 4px, semantic main color
- Icon: 20x20px, semantic main color
- Title: Subtitle1 (14px SemiBold), semantic darkText
- Body: Body (14px Regular), semantic darkText
- Padding: 12px 16px
- Auto layout: HORIZONTAL (icon + content), content is VERTICAL

### Toast / Snackbar

**Toast**:
- Corner radius: 8px
- Fill: snackbar (gray-800)
- Text: white, Body style
- Action text: secondary.light
- Padding: 12px 16px
- Elevation: Level 8

### Avatars

**Avatar**:
- Small: 24x24px
- Medium: 32x32px (default)
- Large: 40x40px
- Corner radius: full (circle)
- Fill: accent color (varies), text: contrastText
- Text: initials in Button style, scaled to fit

### Badges

**Badge**:
- Size: 18px height (min)
- Corner radius: full (pill)
- Fill: error.main (notification) or primary.main
- Text: white, 11px SemiBold
- Padding: 2px 6px

### Dividers

**Divider**:
- Height: 1px
- Fill: divider `{ r: 0.91, g: 0.918, b: 0.945 }`
- Width: fill container

### Tables

**Table**:
- Header row height: 36px, fill background.layer
- Body row height: 44px, fill paper
- Hover row: background.tableHover
- Selected row: background.tableSelected
- Cell padding: 8px 12px
- Header text: Caption bold (13px SemiBold), text.secondary
- Body text: Body (14px Regular), text.primary
- Border: 1px bottom, divider color

### Lists

**List item**:
- Height: 44px (single line), 56px (two lines)
- Padding: 8px 16px
- Auto layout: HORIZONTAL
- Primary text: Body, text.primary
- Secondary text: Caption, text.secondary
- Divider: 1px, divider color between items

### Sliders

**Slider**:
- Track height: 4px, fill gray-300 (inactive), primary.main (active)
- Thumb: 16x16px circle, fill primary.main, Elevation/1

### Progress

**Linear Progress**:
- Track height: 4px, corner radius full
- Track background: gray-200
- Fill: primary.main (determinate), animated (indeterminate)

**Circular Progress**:
- Size: 40x40px default
- Stroke: 3px, primary.main

---

## 7. Screen Layout Patterns

When a PM describes a screen, use these structural patterns:

### Desktop Screen (default for Outreach)
- Width: 1920px (or fill), Height: 1080px
- Background: background.default (gradient) or background.cool
- Left: Navigation Sidebar (240px)
- Top: App Bar (56px)
- Content area: auto layout VERTICAL, padding 24px, gap 24px between sections

### Mobile Screen
- Width: 375px, Height: 812px (or auto)
- Background: background.cool
- Top: App Bar (56px)
- Content: padding 16px, gap 16px
- Bottom: optional bottom nav (56px)

### Form Layout
- Auto layout: VERTICAL
- Gap between fields: 16px
- Gap between form and buttons: 24px
- Label-to-field gap: 4px
- Buttons: right-aligned, gap 8px between buttons

### Table/List Layout
- Header: 36px height, sticky
- Row height: 44px
- Padding: 8px 12px per cell
- Divider: 1px between rows

---

## 8. Quick Reference: Common PM Phrases → Quark Components

| PM says... | Create this Quark component |
|-----------|----------------------------|
| "button" | Contained Button (Primary, pill) |
| "submit button" | Contained Button (Primary) |
| "cancel button" | Outlined Button |
| "link" / "text link" | Text Button (text.link color) |
| "input" / "field" | Text Field (36px, 8px radius) |
| "search bar" | Text Field with search icon |
| "card" | Outlined Card (8px radius) |
| "popup" / "modal" | Dialog (Elevation/12, 8px radius) |
| "tab" / "tabs" | Tabs (36px height, 2px active border) |
| "toggle" / "switch" | Switch (34x20 track, 16px thumb) |
| "checkbox" | Checkbox (36x36 touch target) |
| "dropdown" / "select" | Select (36px, chevron icon) |
| "nav bar" / "sidebar" | Navigation Sidebar (240px) |
| "header" / "app bar" | Top App Bar (56px, Elevation/1) |
| "chip" / "pill" | Chip (24px, pill radius) |
| "tag" / "badge" / "status" | Tag (20px, 4px radius, semantic colors) |
| "divider" / "separator" | 1px line, divider color |
| "avatar" | Circle (32px default), accent fill |
| "icon" | 20x20px square placeholder |
| "table" | Table (36px header, 44px rows) |
| "alert" / "banner" | Alert (8px radius, left border, semantic bg) |
| "toast" / "snackbar" | Toast (snackbar fill, Elevation/8) |
| "tooltip" | Tooltip (4px radius, gray-800 fill) |
| "progress" | Linear/Circular progress |
| "slider" | Slider (4px track, 16px thumb) |
