---
name: 'Design System Config'
description: 'Design system configuration — which mode to use, how to source tokens and components'
applyTo: '**'
---

# Design System Configuration

This file controls **how the AI sources design decisions** when generating Figma designs. The tool usage rules in `figma-tool-usage-rules.mdc` are mode-agnostic — they describe *how* to use the tools. This file describes *what* to build with.

> **This system is library-agnostic.** It works with any Figma design system library, not a specific one. Libraries are auto-discovered from the connected Figma file and the user selects which to use.

---

## Current Mode: `library`

Set to one of: `library`, `tokens`, `custom`, `create`, `none`

---

## MODE ENFORCEMENT — READ THIS FIRST

> **AUDIT EXCEPTION: The `design_system_audit` and `generate_library_package` prompts are COMPLETELY EXEMPT from mode enforcement, library packages, and all design-system-specific rules in this file. When running either prompt, do NOT read this file for mode decisions, do NOT read `.cursor/libraries/` or `.cursor/cache/`, and do NOT reference any token file. Both prompts fetch ALL data directly from the connected Figma file via live MCP calls. Skip the rest of this file entirely during an audit or library package generation.**

**If the active mode is `library`. This is the ONLY section that matters for design decisions.**

> **How to read this section:** The enforcement block below is dynamically tied to the `Current Mode` value above. When you change the mode, mentally replace the enforcement rules with the ones defined in that mode's section. The rules below reflect `library` mode because that is the current setting.

**MANDATORY in `library` mode:**
- Every component MUST use `type: "instance"` + `componentKey` from the library package's `componentKeys` for the selected library **when that component exists in the library**.
- If a component does NOT exist in the library, build it from scratch using `type: "frame"` or `type: "component"` — but still use library variables and styles for all visual properties (colors, typography, effects).
- Every color MUST come from a library variable binding (`fillVariable`/`strokeVariable`/`textFillVariable`).
- Every text style MUST come from a library text style (`textStyleKey`).
- Every effect MUST come from a library effect style (`effectStyleKey`).
- **Follow usage notes** from the library package's `usageNotes` section — configure components for their specific UI context (hide unused decorations, apply correct overrides).

**STRICTLY FORBIDDEN in `library` mode — violations are errors:**
- Do NOT read, reference, or load any token file.
- Do NOT call `setup_design_tokens` — tokens are irrelevant in library mode.
- Do NOT build components from scratch using `type: "frame"` or `type: "component"` when a library component exists for that purpose.
- Do NOT hardcode RGB color values (e.g. `{r: 0.5, g: 0.5, b: 0.5}`) — always bind to library variables.
- Do NOT manually set `fontFamily`, `fontSize`, or `fontStyle` — always use `textStyleKey` from the library.
- Do NOT create new variables, styles, or components — only use what the library provides.
- Do NOT follow instructions from the `tokens`, `custom`, `create`, or `none` mode sections below — they are inactive reference documentation only.

**If you find yourself about to use a token value, hardcode a color, or manually set font properties — STOP. You are in `library` mode. Go back to the library.**

---

## Library Packages

Library data is **distributed as a pre-built, tested, versioned package** — not cached at runtime. This ensures usage notes are never lost, component keys are verified, and every consumer of the library gets identical data.

| Setting | Value |
|---------|-------|
| **Library packages** | `.cursor/libraries/<library-name>/library.json` |
| **Runtime resolution** | `.cursor/cache/resolved-variables.json` (auto-generated, trivially regenerated) |
| **Strategy** | Read the library package on disk. Only the variable ID resolution is done at runtime. |

### How Library Packages Work

1. **Library packages are authored, tested, and distributed** as part of the bridge distribution. They live in `.cursor/libraries/` and are copied by `setup.js`.
2. **Component keys, style keys, and usage notes** are all stored in the package — these are stable publish keys that work across any Figma file using the library.
3. **Variable names and keys** are stored in the package. Variable IDs (which are file-specific) are resolved once at runtime and cached in `.cursor/cache/resolved-variables.json`.
4. **Usage notes** (component intelligence — which children to hide/show, context rules, override patterns) are first-class citizens of the package, never auto-generated.

### Loading Rules

**Loading rules (do NOT apply during `design_system_audit` — the audit always fetches fresh data from Figma):**
1. **Before the first design operation** in a session, check if `.cursor/libraries/` contains a library package for the active library.
2. **If package exists**: Read `library.json` and use it for all design decisions. Do NOT call `discover_libraries`, `get_local_components`, or `get_local_styles` from Figma.
3. **If package does not exist**: **FULL STOP.** Do NOT build any designs, do NOT fall back to runtime discovery, do NOT create any Figma content. Inform the user:
   > "Library package not found in `.cursor/libraries/`. A library package is required in `library` mode. No designs will be built until a library package is installed."
4. **Variable resolution**: At the start of every session, call `resolve_library_variables` to resolve variable names to file-local IDs. Always resolve fresh — do NOT reuse a previous session's `resolved-variables.json`. Variable IDs are file-local and can change when the user switches Figma files or the library is republished.
5. **Within a session**: After the initial resolution, use the package data and resolved variables for the rest of the session. Do not re-resolve unless the user explicitly requests it.
6. **Applies to `library` and `tokens` modes only.** `custom`, `create`, and `none` modes do not use library packages.

### Library Package Schema

See `.cursor/libraries/README.md` for the full schema. Key sections:

```json
{
  "name": "My Design System",
  "version": "1.0.0",
  "componentKeys": {
    "Button": {
      "componentSetKey": "abc123...",
      "variants": {
        "Style=Primary, Size=Medium, State=Default": "componentKey..."
      }
    }
  },
  "styleKeys": {
    "textStyles": { "Body 1": "styleKeyHere" },
    "paintStyles": {},
    "effectStyles": {}
  },
  "variables": {
    "primary/main": { "key": "variableKeyHere", "collection": "Colors", "type": "COLOR" }
  },
  "usageNotes": { ... },
  "globalRules": { ... },
  "fonts": ["Inter"]
}
```

### Runtime Variable Resolution (`resolved-variables.json`)

This file maps variable names from the library package to file-local variable IDs. It is **regenerated fresh at the start of every session** by calling `resolve_library_variables` — it is NOT a persistent cache. Variable IDs are file-local and can change when the user switches Figma files or the library is republished.

```json
{
  "resolvedAt": "2026-02-12T10:30:00Z",
  "libraryName": "My Design System",
  "libraryVersion": "1.0.0",
  "variableIds": {
    "primary/main": "VariableID:abc/123:456",
    "text/primary": "VariableID:abc/123:789"
  }
}
```

This file is regenerated every session — losing it has zero cost.

---

## Mode: `library`

**Use library components. Use library variables and styles. Build from scratch only when a component is missing.**

The library is the source of truth for components, variables, and styles. The AI should:

1. **Use `type: "instance"` + `componentKey`** for every component (buttons, inputs, cards, etc.) that exists in the library. Never rebuild a component from scratch if it exists in the library. Get component keys from the library package's `componentKeys`.
2. **If a component does not exist in the library**, build it from scratch using `type: "frame"` or `type: "component"` — but still bind all colors to library variables (`fillVariable`/`strokeVariable`/`textFillVariable`), all text to library text styles (`textStyleKey`), and all effects to library effect styles (`effectStyleKey`). Do not hardcode visual values.
3. **Read variables, styles, component keys, and usage notes from the library package** (`.cursor/libraries/<name>/library.json`). Use `.cursor/cache/resolved-variables.json` for variable ID resolution. Only call Figma tools if the resolution file is missing.
4. **Follow usage notes.** When instantiating components, check the package's `usageNotes` for the component. Apply the appropriate `context_rules` (hide/show children, override text). Never use a component "as-is" with all default decorations visible.
5. **Do not create new variables, styles, or components.** Only use what the library provides.
6. **Layout grids**: Read from the library's frame templates if available, or ask the user.
7. **Zero hardcoded values.** Every color must come from a library variable binding. Every text style must come from a library text style. Every shadow/effect must come from a library effect style. If the library doesn't provide a specific value, ask the user.

---

## Mode: `tokens`

**Build all components from scratch. Use library variables and styles for all visual values.**

This mode is for when you want custom component structures but consistent visual identity from the library. The AI builds every component using `type: "frame"` or `type: "component"` — never `type: "instance"` — but sources all colors, typography, and effects from the library.

1. **Build components from scratch** using `type: "frame"` or `type: "component"`. Do NOT use `type: "instance"` or `componentKey`.
2. **Read variables and styles from the library package** (`.cursor/libraries/<name>/library.json`). Use `.cursor/cache/resolved-variables.json` for variable ID resolution. Only call Figma tools if the resolution file is missing.
3. **Bind all colors to library variables** using `fillVariable`/`strokeVariable`/`textFillVariable`. Do NOT hardcode RGB values.
4. **Apply library text styles** using `textStyleKey`. Do NOT manually set `fontFamily`/`fontSize`/`fontStyle` when a library text style exists.
5. **Apply library effect styles** using `effectStyleKey`. Do NOT manually define shadows or effects when a library effect style exists.
6. **Do NOT read, reference, or load any token file** — this mode uses the library for values, not a token file.
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

**Build all components from scratch. Use a token file for all visual values.**

This mode is for fully custom builds where you define everything from a token file. The AI builds every component using `type: "frame"` or `type: "component"` and reads exact color, typography, spacing, and elevation values from the token file.

1. **Read the token file** listed below for all design decisions. Never guess — if a value isn't in the token file, ask.
2. **Build components from scratch** using the component specs in the token file.
3. **Variable binding is recommended.** Use `setup_design_tokens` to create Figma variable collections from the tokens, then bind via `fillVariable`/`strokeVariable`/`textFillVariable`.
4. **Apply layout grids** to root screen frames using the grid spec from the token file.
5. **Do NOT use the library cache** — this mode does not read from the Figma library.
6. **Do NOT use `type: "instance"` or `componentKey`** — all components are built from scratch.

### Token Configuration

| Setting | Value |
|---------|-------|
| **Token file** | *(Set the token file name here when using custom mode, e.g. `my-tokens.mdc`)* |

> To use custom mode: create a `.mdc` file with your token definitions (colors, typography, spacing, shapes, elevation, component specs), place it in `.cursor/rules/`, and set the token file name in the table above.

---

## Mode: `create`

**Design system authoring. The connected Figma file IS the library — create, read, update, and delete DS elements directly.**

This mode is for building and maintaining a design system. The user opens the Figma library file where the DS lives, and all operations target that file directly. There is no cache, no component key mapping, and no token file — everything is live from/to Figma.

**What this mode means:**
- **The connected file is the library itself.** You are authoring the source of truth, not consuming it.
- **No library packages or cache.** Do NOT read `.cursor/libraries/` or `.cursor/cache/`. All data comes from live Figma MCP calls (`get_local_variables`, `get_local_styles`, `get_local_components`).
- **No component key mapping or token file.** Discover components directly from the file via `get_local_components`.
- **Full CRUD on variables.** Create, read, update, rename, and delete variables and variable collections using `create_variable_collection`, `create_variable`, `batch_create_variables`, `update_variable`, `rename_variable`, `delete_variable`, `delete_variable_collection`, `setup_design_tokens`, etc.
- **Full CRUD on styles.** Create, read, update, rename, and delete paint styles, text styles, and effect styles using `create_paint_style`, `create_text_style`, `create_effect_style`, `update_paint_style`, `update_text_style`, `update_effect_style`, `rename_style`, `delete_style`, `apply_style`, `get_local_styles`.
- **Component authoring.** Build components with `type: "component"` in specs — never `type: "instance"` (you are authoring the source, not consuming it). Use `arrange_component_set` to create variant sets from components. Use `rename_node` and `remove_node` to manage components.
- **Discover before modifying.** Before creating or updating DS elements, call `get_local_variables`, `get_local_styles`, or `get_local_components` to understand what already exists. Avoid creating duplicates.
- **Follow the user's instructions.** The user decides naming conventions, organization, structure, and values. Do not impose defaults or conventions unless the user specifies them.

---

## Mode: `none`

**Freeform. No design system, no library, no tokens, no constraints.**

This mode disables all design-system rules. Use it when running audits, invoking Figma MCP prompts, or executing any Figma tool operations where design-system constraints should not apply.

**What this mode means:**
- **No MODE ENFORCEMENT.** None of the `library`/`tokens`/`custom`/`create` mode rules above apply. Do NOT read library packages, cache, or token files.
- **No defaults or assumptions.** Do not impose any default colors, typography, spacing, or component conventions unless the user explicitly specifies them.
- **Follow the user's instructions exactly.** Execute what the user asks without adding guardrails, design-system checks, or opinionated defaults.
- **Figma tools and prompts are unconstrained.** All Figma MCP tools and prompts (including `design_system_audit`, `audit_design`, etc.) operate directly against the connected Figma file without filtering through design-system rules. The only pre-requisite is RULE ZERO (Connection Gate) — verify the Figma connection is active before making MCP calls.

---

## Switching Modes

**To switch modes**: Change `Current Mode` at the top of this file to one of: `library`, `tokens`, `custom`, `create`, `none`.

**To switch or add libraries** (for `library` and `tokens` modes): Install the new library package in `.cursor/libraries/` by running `setup.js` with a distribution that includes the package. Delete `.cursor/cache/resolved-variables.json` to force re-resolution of variable IDs.

**To switch the token file** (for `custom` mode): Update the token file name in the Token Configuration table. Create the file if it doesn't exist.

**To author or maintain a design system**: Switch to `create` mode and connect to the Figma library file where the DS lives. All CRUD operations on variables, styles, and components target that file directly.
