---
name: 'Design System Config'
description: 'Design system configuration — which mode to use, how to source tokens and components'
applyTo: '**'
---

# Design System Configuration

This file controls **how the AI sources design decisions** when generating Figma designs. The tool usage rules in `figma-tool-usage-rules.mdc` are mode-agnostic — they describe *how* to use the tools. This file describes *what* to build with.

---

## Current Mode: `library`

Set to one of: `library`, `tokens`, `custom`, `none`

---

## MODE ENFORCEMENT — READ THIS FIRST

**If the active mode is `library`. This is the ONLY section that matters for design decisions.**

> **How to read this section:** The enforcement block below is dynamically tied to the `Current Mode` value above. When you change the mode, mentally replace the enforcement rules with the ones defined in that mode's section. The rules below reflect `library` mode because that is the current setting.

**MANDATORY in `library` mode:**
- Every component MUST use `type: "instance"` + `componentKey` from the component key mapping file **when that component exists in the library**.
- If a component does NOT exist in the library, build it from scratch using `type: "frame"` or `type: "component"` — but still use library variables and styles for all visual properties (colors, typography, effects).
- Every color MUST come from a library variable binding (`fillVariable`/`strokeVariable`/`textFillVariable`).
- Every text style MUST come from a library text style (`textStyleKey`).
- Every effect MUST come from a library effect style (`effectStyleKey`).

**STRICTLY FORBIDDEN in `library` mode — violations are errors:**
- Do NOT read, reference, or load `quark-2-tokens.mdc` or any token file.
- Do NOT call `setup_design_tokens` — tokens are irrelevant in library mode.
- Do NOT build components from scratch using `type: "frame"` or `type: "component"` when a library component exists for that purpose.
- Do NOT hardcode RGB color values (e.g. `{r: 0.5, g: 0.5, b: 0.5}`) — always bind to library variables.
- Do NOT manually set `fontFamily`, `fontSize`, or `fontStyle` — always use `textStyleKey` from the library.
- Do NOT create new variables, styles, or components — only use what the library provides.
- Do NOT follow instructions from the `tokens`, `custom`, or `none` mode sections below — they are inactive reference documentation only.

**If you find yourself about to use a token value, hardcode a color, or manually set font properties — STOP. You are in `library` mode. Go back to the library.**

---

## Library & Cache Configuration

These settings apply to both `library` and `tokens` modes, since both source visual values from the Figma library.

### Library File

| Setting | Value |
|---------|-------|
| **Figma library file** | [Components (Quark 2.20)](https://www.figma.com/design/Q9ME8GTTEgj6sVDeh7CUTV) |

### Component Key Mapping

Component keys are maintained in a separate rule file for modularity. The AI must load and follow it when in `library` mode (and may reference it in `tokens` mode for structural guidance).

| Setting | Value |
|---------|-------|
| **Component mapping file** | `quark-2-components.mdc` (cursor rule in `.cursor/rules/`) |

> To use a different library: create a new component mapping `.mdc` file following the same structure, extract keys from your library using `get_local_components`, and update the mapping file reference above.

### Library Data Cache

To avoid repeated expensive Figma API calls (`get_local_variables`, `get_node_styles`, `get_available_fonts`), the AI maintains a cache file on disk.

| Setting | Value |
|---------|-------|
| **Cache file** | `.cursor/cache/library-data.json` |
| **Cache strategy** | Session-based: use cache if it exists, fetch fresh only when cache is missing or user requests a refresh |

**Caching rules:**
1. **Before the first design operation** in a session, check if `.cursor/cache/library-data.json` exists.
2. **If cache exists**: Read it and use the cached variables, styles, and fonts. Do NOT call `get_local_variables`, `get_node_styles`, or `get_available_fonts` from Figma.
3. **If cache does not exist**: Fetch fresh data from Figma (`get_local_variables`, `get_available_fonts`, and style discovery via `get_node_styles`), then write the results to `.cursor/cache/library-data.json`.
4. **Within a session**: Never refetch. Use cached data or data already in context.
5. **Manual refresh**: When the user says "refresh cache", "update library cache", or similar, fetch fresh data from Figma and overwrite the cache file.
6. **Applies to `library` and `tokens` modes only.** `custom` and `none` modes do not use or update the cache.

**Cache file structure:**
```json
{
  "lastFetched": "2026-02-11T10:30:00Z",
  "variables": {
    "collections": [],
    "variables": [],
    "libraryVariables": []
  },
  "variableLookup": {
    "primary/main": "VariableID:abc/123:456",
    "text/primary": "VariableID:abc/123:789"
  },
  "styleKeys": {
    "textStyles": { "Body 1": "styleKeyHere", "H6": "styleKeyHere" },
    "paintStyles": {},
    "effectStyles": {}
  },
  "fonts": ["Inter", "Roboto"]
}
```

---

## Mode: `library`

**Use library components. Use library variables and styles. Build from scratch only when a component is missing.**

The library is the source of truth for components, variables, and styles. The AI should:

1. **Use `type: "instance"` + `componentKey`** for every component (buttons, inputs, cards, etc.) that exists in the library. Never rebuild a component from scratch if it exists in the library.
2. **If a component does not exist in the library**, build it from scratch using `type: "frame"` or `type: "component"` — but still bind all colors to library variables (`fillVariable`/`strokeVariable`/`textFillVariable`), all text to library text styles (`textStyleKey`), and all effects to library effect styles (`effectStyleKey`). Do not hardcode visual values.
3. **Read variables and styles from cache** (see Library Data Cache section above). Only call `get_local_variables` or `get_node_styles` if the cache is missing or being refreshed.
4. **Do not create new variables, styles, or components.** Only use what the library provides.
5. **Layout grids**: Read from the library's frame templates if available, or ask the user.
6. **Zero hardcoded values.** Every color must come from a library variable binding. Every text style must come from a library text style. Every shadow/effect must come from a library effect style. If the library doesn't provide a specific value, ask the user.

---

## Mode: `tokens`

**Build all components from scratch. Use library variables and styles for all visual values.**

This mode is for when you want custom component structures but consistent visual identity from the library. The AI builds every component using `type: "frame"` or `type: "component"` — never `type: "instance"` — but sources all colors, typography, and effects from the library.

1. **Build components from scratch** using `type: "frame"` or `type: "component"`. Do NOT use `type: "instance"` or `componentKey`.
2. **Read variables and styles from cache** (see Library Data Cache section above). Only call `get_local_variables` or `get_node_styles` if the cache is missing or being refreshed.
3. **Bind all colors to library variables** using `fillVariable`/`strokeVariable`/`textFillVariable`. Do NOT hardcode RGB values.
4. **Apply library text styles** using `textStyleKey`. Do NOT manually set `fontFamily`/`fontSize`/`fontStyle` when a library text style exists.
5. **Apply library effect styles** using `effectStyleKey`. Do NOT manually define shadows or effects when a library effect style exists.
6. **Do NOT read, reference, or load `quark-2-tokens.mdc`** — this mode uses the library for values, not a token file.
7. **Do NOT call `setup_design_tokens`** — variables already exist in the library.
8. **Do NOT create new variables or styles** — only use what the library provides.
9. **Layout grids**: Read from the library's frame templates if available, or ask the user.
10. **If a specific value doesn't exist in the library**, ask the user how to proceed rather than improvising.

### When to use `tokens` mode
- You want to build a unique component that doesn't exist in the library (e.g. a custom dashboard widget, a specialized card layout).
- You want the component to look visually consistent with the library (same colors, fonts, effects).
- You do NOT want to be constrained by the library's component structures.

---

## Mode: `custom`

**Build all components from scratch. Use `quark-2-tokens.mdc` for all visual values.**

This mode is for fully custom builds where you define everything from a token file. The AI builds every component using `type: "frame"` or `type: "component"` and reads exact color, typography, spacing, and elevation values from the token file.

1. **Read the token file** listed below for all design decisions. Never guess — if a value isn't in the token file, ask.
2. **Build components from scratch** using the component specs in the token file (Section 6 in Quark's case).
3. **Variable binding is recommended.** Use `setup_design_tokens` to create Figma variable collections from the tokens, then bind via `fillVariable`/`strokeVariable`/`textFillVariable`.
4. **Apply layout grids** to root screen frames using the grid spec from the token file.
5. **Map phrases to component specs** using the token file's quick-reference table (Section 8 in Quark's case).
6. **Do NOT use the library cache** — this mode does not read from the Figma library.
7. **Do NOT use `type: "instance"` or `componentKey`** — all components are built from scratch.

### Token Configuration

| Setting | Value |
|---------|-------|
| **Token file** | `quark-2-tokens.mdc` (cursor rule in `.cursor/rules/`) |

> To use a different token set: create a new `.mdc` file following the same structure as `quark-2-tokens.mdc` (colors, typography, spacing, shapes, elevation, component specs) and update the token file name above.

---

## Mode: `none`

**Greenfield. No design system, no library, no tokens.**

1. **No token file is loaded.** No library is referenced. No cache is used.
2. **Colors**: Use reasonable neutral defaults or ask the user. Don't assume any specific palette.
3. **Typography**: Default to Inter Regular/SemiBold. Standard sizes: 14px body, 13px caption, 20px heading.
4. **Spacing**: Default to 8px base grid (multiples of 4px).
5. **Components**: Build from scratch using `type: "frame"` or `type: "component"`. Use sensible dimensions (36px button height, 8px radius, etc.).
6. **No variable binding** unless the user explicitly sets up variables.
7. **No layout grids** unless the user requests them.

---

## Switching Modes

**To switch modes**: Change `Current Mode` at the top of this file to one of: `library`, `tokens`, `custom`, `none`.

**To switch the library** (for `library` and `tokens` modes): Update the library file link in the Library Configuration section and repopulate the component key mapping table. Delete the cache file (`.cursor/cache/library-data.json`) so it is rebuilt from the new library.

**To switch the token file** (for `custom` mode): Update the token file name in the Token Configuration table. Create the file if it doesn't exist.

---

## Creating a New Design System

If you're building a brand-new DS from scratch:

1. Start in `none` mode.
2. Design your token system iteratively: define colors, typography, spacing, shapes.
3. Use `setup_design_tokens` to create Figma variable collections.
4. Build reusable components using `type: "component"` in specs.
5. Document your tokens in a new `.mdc` file (copy `quark-2-tokens.mdc` as a structural template).
6. Switch to `custom` mode and point to your new token file.
7. When ready, publish your components as a Figma library, extract component keys, fill in the mapping table, and switch to `library` mode.
8. For a hybrid approach (library tokens, custom components), switch to `tokens` mode.
