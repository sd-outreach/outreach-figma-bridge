<!-- ============================================================ -->
<!-- Outreach Figma MCP Bridge — Copilot Instructions             -->
<!-- Version: 1.0.0 | Auto-generated — do not edit manually       -->
<!-- BRIDGE_INSTRUCTIONS_START                                     -->
<!-- ============================================================ -->

# Figma MCP Bridge Rules

## Design System Config

# Design System Configuration

This file controls **how the AI sources design decisions** when generating Figma designs. The tool usage rules in `figma-tool-usage-rules.mdc` are mode-agnostic — they describe *how* to use the tools. This file describes *what* to build with.

---

## Current Mode: `none`

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

---

## Figma Tool Usage Rules

## Figma Tool Usage Rules

These rules govern **how to use the Figma MCP bridge tools**. They are design-system agnostic — for which colors, fonts, spacing, and components to use, see `design-system-config.mdc`.

> **MODE GATE: Before executing ANY design operation, read `design-system-config.mdc` to determine the active mode (`library`, `tokens`, `custom`, or `none`). The active mode is declared in `## Current Mode:` at the top of that file. Rules in this file that are marked with a mode condition (e.g. "only in `custom` mode") MUST be skipped if that mode is not active. When the active mode is `library` or `tokens`, you MUST NOT use token-file-based workflows (`setup_design_tokens`, hardcoded RGB values). When the active mode is `library`, you MUST use library component instances where they exist. See the MODE ENFORCEMENT section in `design-system-config.mdc` for the full list of prohibitions.**

### RULE ZERO — Verify Setup (must run first)

**Before your first design operation in any session**, call `verify_workspace_setup` with the absolute path to the workspace root. This checks that all required rule files and supporting directories are in place.

- If the tool reports **SETUP INCOMPLETE**: **STOP.** Do not proceed with any design operations. Tell the user to run the setup script:
  ```
  cd <project-directory>
  node ~/outreach-figma-bridge/setup.js
  ```
  Then restart their editor.
- If the tool reports **SETUP VERIFIED**: Proceed normally with the rest of the rules.
- You only need to call this **once per session**, not before every operation.

### A. Atomic Building (highest-velocity path)

> **IMPORTANT: All specs must go through the interactive spec workflow defined in `interactive-specs.mdc`.** Every spec is saved to `.cursor/specs/<name>.json`, validated, and communicated to the user before building. See `interactive-specs.mdc` for the full save → validate → build → update cycle.

1. **Prefer `build_and_verify` over individual tool calls.** Construct the entire component tree as a single JSON spec and pass it in one call. This builds the tree, takes a screenshot, and runs structural validation — all atomically.
2. **Use `build_from_spec` when you don't need visual verification** (e.g. building intermediate pieces that will be verified later as part of a larger frame).
3. **Reserve individual tools** (`set_fill`, `set_font`, `set_corner_radius`, `move_node`, etc.) for **post-creation tweaks only** — never for building from scratch.
4. **In the spec, always set `autoLayout` on frames BEFORE listing `children`.** The plugin enforces correct ordering internally, but the spec must declare it.
5. **Use `layoutSizing: {"horizontal": "FILL"}` on children that should stretch** to fill their auto-layout parent.
5b. **Save every spec to disk before building.** This is mandatory — see `interactive-specs.mdc` rules T1–T4.

### B. Color & Token Discipline

6. **NEVER hardcode or guess color values.** In `library` or `tokens` mode, read variables/styles from the Figma library (or cache) — do NOT read or reference any token file. In `custom` mode, use the token file's exact values. In `none` mode, use reasonable defaults or ask the user. **Always check `design-system-config.mdc` for the active mode first.**
7. **(`custom` mode ONLY)** If the active DS token file is loaded as a cursor rule, skip the `design-tokens` resource fetch — all values are already inline. Only fetch the resource if you need tokens not covered by the rule. **In `library` or `tokens` mode, do NOT fetch or reference any token file or design-tokens resource.**

### C. Typography

8. **Check `get_available_fonts` once at the start of a session**, not before every text node. In `library` or `tokens` mode, check the library data cache first (see Section R). Use the fonts specified by the active design system, or fall back to "Inter" if no DS is active.
9. **Always specify `fontFamily`, `fontStyle`, and `fontSize` explicitly** on every text node in the spec — never rely on Figma defaults. **However, in `library` or `tokens` mode, prefer `textStyleKey` over manual font properties. Only set `fontFamily`/`fontStyle`/`fontSize` manually if no library text style exists for the purpose.**

### D. Validation & Verification

10. **After building a complete screen, run `verify_design`** on the root frame to export a screenshot + node tree for visual correctness.
11. **Use `validate_tree`** to structurally diff a built frame against its original spec — catches missing children, dimension drift, and property mismatches.
12. **Check the validation report** returned by `build_and_verify` — if there are mismatches, fix them with individual tools and re-verify.

### E. Reading & Inspection (efficiency)

13. **Start broad, drill narrow.** Use `scan_page` (depth 2–3) → `get_node_by_id` on interesting nodes → `get_children` for deeper detail.
14. **Use `read_my_design`** when the user has something selected — it gives deep info without needing node IDs.
15. **Use `get_nodes_info`** to batch-fetch multiple nodes in a single call instead of multiple `get_node_by_id` calls.
16. **Use `find_nodes_by_name` or `find_nodes_by_type`** for targeted searches instead of scanning the full tree manually.

### F. Batch Operations

17. **Use `set_multiple_text_contents`** when updating 3+ text nodes.
18. **Use `delete_multiple_nodes`** when removing 3+ nodes.
19. **Use `set_instance_overrides`** to apply multiple overrides (text, fill, visibility) to an instance in one call.
20. **Use `scan_text_nodes` with `chunkSize`** for large designs to avoid timeouts — paginate with `chunkIndex`.

### G. Layer Naming & Structure

21. **Name every layer semantically** — "Login Form", "Email Field", "Primary Action Button" — never "Frame 1" or "Rectangle 3".
22. **Use `component` type in specs for reusable elements**, `frame` for one-off layout containers.
23. **Group related elements** in auto-layout frames, not loose absolute-positioned nodes.

### H. Layout & Spacing

24. **Follow the spacing system defined by the active DS.** If no DS is active, default to an 8px base grid (multiples of 4px, ideally 8px).
25. **Build outside-in.** Create root containers first, then nested sections, then leaf elements.
26. **Use uniform padding shorthand** when all sides are equal: `"padding": 16` not `{"top":16,"right":16,"bottom":16,"left":16}`.

### H2. Layout Grids

27. **Apply layout grids to frames using `layoutGrids`** in the spec. Supports `"COLUMNS"`, `"ROWS"`, and `"GRID"` patterns.
28. **For column grids**, use `{"pattern": "COLUMNS", "count": 12, "gutterSize": 24, "alignment": "STRETCH"}` as a sensible default. Adjust to match the active DS grid spec if one is defined.
29. **For pixel grids**, use `{"pattern": "GRID", "sectionSize": 8}` to show the base grid overlay.
30. **Grids are visual guides only** — they don't affect layout behavior. Use `autoLayout` for actual layout control and `layoutGrids` for alignment verification.
31. **Apply grids to root screen frames** to capture the column structure. If the active DS defines a grid, use those values.

### I. Multi-Screen & Complex Designs

32. **Space screens 100px apart horizontally** on the canvas when building multiple frames.
33. **Build each screen completely before starting the next** — don't interleave partial builds.
34. **For PRD-to-design flows**, identify all screens first, create a build plan, then execute sequentially.

### J. Component Instances (individual tools)

35. **Use `get_local_components`** to discover available components before creating instances.
36. **Use `create_instance`** to instantiate existing components rather than rebuilding from scratch.
37. **Use `get_instance_overrides` → `set_instance_overrides`** to transfer overrides between instances efficiently.

### J2. Library Components in Specs (Instance Type)

38. **Use `type: "instance"` in specs to instantiate library or local components** directly within the atomic build process. This avoids rebuilding components from scratch when they already exist.
39. **For published library components**, use `componentKey` — the key from the Figma library. Get component keys via `get_local_components` or from the design system's component key mapping (see `design-system-config.mdc`).
40. **For local components**, use `componentId` — the node ID of a component on the current page or document.
41. **Apply overrides with `instanceOverrides`** — an array of `{childName, characters?, fillColor?, visible?}` objects. The builder searches for children by name within the instance and applies the overrides.
42. **Instance nodes cannot have `children`** — use `instanceOverrides` instead. The component's structure comes from the source component.
43. **Recommended workflow for library adoption**: (1) use `get_local_components` to discover available components, (2) use `type: "instance"` + `componentId` for local components, or `componentKey` for published library components, (3) use `instanceOverrides` to customize.

### K. Component Matching

44. **When a user says a component name** (e.g. "button", "card", "input"), check `design-system-config.mdc` for the current mode. In `library` mode, match the user's term against the Component Name column in the component key mapping file — use your understanding of common synonyms (e.g. "modal" → Dialog, "toggle" → switch, "dropdown" → select). In `tokens` mode, build the component from scratch using library variables/styles (no component key mapping needed). In `custom` mode, use the token file's component specs. In `none` mode, use sensible defaults (e.g. a button is a rounded rectangle with text).

### L. Screen & Component Defaults

45. **Always set a background fill on root screen frames.** In `library` or `tokens` mode, bind the fill to a library background variable — do NOT hardcode RGB values or use token values. In `custom` mode, use the active DS background token from the token file. In `none` mode, use a light neutral like `{r:0.96, g:0.96, b:0.97}`.
46. **Use `component` type in specs** for any element that would be reused. Use `frame` only for one-off layout containers. **In `library` mode, prefer `type: "instance"` + `componentKey` over creating new components — only create `frame` for layout containers that have no library equivalent. In `tokens` mode, always use `frame` or `component` — never `type: "instance"`.**

### L2. Frame Hygiene — Fills & Clipping

46b. **Do NOT set `fill` on layout-only frames.** Frames used purely as auto-layout containers (e.g. grouping form fields, wrapping a row of elements, sectioning content) must have **no fill** in the spec. Only set `fill` on: (1) the root screen frame (rule 45), (2) frames that are visually intended as cards, surfaces, or panels with a distinct background, (3) decorative elements that need a visible color. The plugin automatically strips Figma's default white fill from frames that have no `fill` in the spec — no post-build cleanup is needed.
46c. **Do NOT set `clipContent: true` unless explicitly required.** Clipping should only be used when child content is intentionally designed to overflow and must be masked (e.g. image containers, scrollable regions, overflow-hidden cards). General layout frames, content sections, and even root screen frames should **not** clip content by default. The plugin defaults `clipsContent` to `false` — only set `clipContent: true` in the spec when you explicitly need clipping.

### M. Design Tokens / Variables

> **MODE GATE: Rules 48–52 apply ONLY in `custom` or `none` mode. In `library` or `tokens` mode, do NOT create variable collections, batch-create variables, or set up design tokens. Use `get_local_variables` (rule 47) or the library data cache (Section R) to READ existing library variables only.**

47. **Use `get_local_variables`** to explore the file's token system (colors, spacing, etc.) before making assumptions. **In `library` or `tokens` mode, prefer reading from the library data cache (Section R) first. Only call `get_local_variables` if the cache does not exist or is being refreshed. Do NOT create new variables in these modes.**
48. **(`custom`/`none` mode ONLY)** Use `create_variable_collection` to set up token groups (e.g. "Brand Colors" with "Light" and "Dark" modes).
49. **(`custom`/`none` mode ONLY)** Use `batch_create_variables` when adding 3+ variables — it's 10-50x faster than individual `create_variable` calls.
50. **(`custom`/`none` mode ONLY)** Use `batch_update_variables` when updating 3+ variable values across modes.
51. **(`custom`/`none` mode ONLY)** For COLOR variables, accept both hex strings (`"#5E5EAF"`) and RGB objects (`{r: 0.369, g: 0.369, b: 0.686}`). Use `"VariableID:..."` strings to create variable aliases.
52. **Cap batch operations at 100 items** per call. Split larger sets into multiple batches.

### M2. Variable Binding in Specs

> **MODE NOTE:** In `library` or `tokens` mode, variable IDs come from the library data cache or `get_local_variables` (which imports library variables). Do NOT call `setup_design_tokens` — that is a `custom`-mode-only workflow.

53. **Bind fills to variables using `fillVariable`** in the spec. **In `library` or `tokens` mode:** get variable IDs from the library data cache (Section R) or `get_local_variables` (library import), then use `fillVariable: "VariableID:..."`. **In `custom` mode:** workflow is (1) `setup_design_tokens` to create variables, (2) note the returned variable IDs, (3) use `fillVariable: "VariableID:..."` in spec nodes alongside the `fill` RGB value.
54. **Bind strokes to variables using `strokeVariable`**. Same pattern as fills — set `stroke` with the raw color, plus `strokeVariable` to bind.
55. **Bind text colors to variables using `textFillVariable`** on text nodes. Works alongside the `fill` property.
56. **Always provide both the raw color AND the variable ID.** The raw color is the fallback/initial value; the variable binding adds theme awareness. If the variable cannot be resolved at build time, the raw color is preserved.

### M3. Library Variable Import

56b. **In `library` or `tokens` mode, `get_local_variables` auto-imports all library variables.** When `includeLibrary` is true (the default), the tool calls `figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()` and imports every variable via `importVariableByKeyAsync`. The imported variable IDs are returned under `libraryVariables` and can be used directly with `fillVariable`/`strokeVariable`/`textFillVariable`.
56c. **At the start of a `library` or `tokens` mode session, check the library data cache first** (see Section R). If the cache exists, use it — do NOT call `get_local_variables`. Only call `get_local_variables` if the cache is missing or the user requests a refresh.

### M4. Style Binding in Specs

56d. **Bind library styles using style keys** in the spec. The spec supports `fillStyleKey`, `strokeStyleKey`, `textStyleKey`, and `effectStyleKey`. Each imports a published library style by key and applies it to the node.
56e. **Use `get_node_styles`** to discover style keys from library component instances. Workflow: (1) `create_instance` of a library component, (2) `get_node_styles` on it to extract all paint/text/effect style keys, (3) use those keys in specs, (4) remove the temporary instance (rule 65). **In `library` or `tokens` mode, check the library data cache (Section R) first — style keys may already be cached, avoiding this workflow entirely.**
56f. **Style binding overrides manual properties.** When a `textStyleKey` is applied, it sets font family, size, style, etc. from the style definition — any manually specified font properties on that node are replaced.
56g. **In `library` or `tokens` mode, prefer style keys over manual font/color properties.** Never hardcode `fontFamily`/`fontSize`/`fontStyle` or `fill` RGB values when a library style exists for that purpose.

### N. Console Debugging

57. **Use `get_console_logs`** to retrieve captured console output from the Figma plugin. Supports filtering by `level` (log/info/warn/error/debug) and `since` (timestamp for polling).
58. **Use `clear_console_logs`** before a specific test to isolate relevant output.
59. **Console capture is automatic** — no setup required. All `console.log/info/warn/error/debug` calls in the plugin sandbox are intercepted and buffered (up to 500 entries per file).

### O. Component Sets & Variants

60. **Use `arrange_component_set`** to combine multiple component nodes into a proper Figma variant set (ComponentSetNode). Components must follow the naming convention `Property=Value, Property2=Value2`.
61. **Use `get_component_set_info`** to inspect variant axes, individual variants, and property definitions before creating instances.

### P. Design-Code Parity

62. **Use `check_design_parity`** to compare a Figma node's visual properties against a code spec. The AI should extract code properties into the codeSpec JSON format and pass them to the tool.
63. **Use the `design_code_parity` prompt** for a guided workflow: read the Figma design, extract code properties, run the check, and generate fix recommendations.
64. **Interpret scores**: 90-100 = PASS, 70-89 = NEEDS_REVIEW, below 70 = FAIL. Focus on critical issues first (colors, fonts), then warnings (spacing, radius).

### Q. Canvas Hygiene — Clean Up After Yourself

65. **Always delete temporary nodes after use.** Any node created for system/AI purposes — style discovery instances, test frames, probing components, scratch builds — must be removed from the canvas immediately after extracting the needed information. Use `delete_multiple_nodes` to batch-remove them. The user's canvas must never contain leftover AI artifacts.
66. **Delete superseded builds.** When rebuilding a screen (e.g. fixing fills, correcting layout), delete the old version(s) after confirming the new build is correct. Do not leave duplicate or stale frames on the canvas.
67. **Track node IDs of temporary creations.** When creating temporary nodes (e.g. `build_from_spec` for style discovery), immediately note the returned `rootNodeId` and delete it as soon as the information is extracted — within the same logical operation, not deferred to later.

### R. Library Data Caching

> **Applies to `library` and `tokens` modes only.** `custom` and `none` modes do not use the library cache.

68. **Check the cache before calling Figma.** On the first design operation in a session, check if `.cursor/cache/library-data.json` exists. If it does, read it and use the cached data for all subsequent operations. Do NOT call `get_local_variables`, `get_node_styles`, or `get_available_fonts` from Figma when the cache is available.
69. **Build the cache when it is missing.** If the cache file does not exist, fetch fresh data from Figma: (1) call `get_local_variables` with `includeLibrary: true`, (2) call `get_available_fonts`, (3) discover style keys via `get_node_styles` on key library component instances (then delete the temporary instances per rule 65). Write the combined results to `.cursor/cache/library-data.json`. Create the `.cursor/cache/` directory if it does not exist.
70. **Cache file structure.** The JSON file must include: `lastFetched` (ISO timestamp), `variables` (raw output from `get_local_variables`), `variableLookup` (map of variable name to VariableID string for quick access), `styleKeys` (maps for `textStyles`, `paintStyles`, `effectStyles`), and `fonts` (array of available font family names).
71. **Never refetch within a session.** Once the cache has been read or built, use it for the remainder of the session. Do not call `get_local_variables` or `get_node_styles` again unless the user explicitly requests a cache refresh.
72. **Manual refresh.** When the user says "refresh cache", "update library cache", "rebuild cache", or similar, fetch fresh data from Figma and overwrite `.cursor/cache/library-data.json`. This is the only way to update the cache within a session.
73. **Use `variableLookup` for fast variable resolution.** When building specs, look up variable IDs by name in the `variableLookup` map (e.g. `variableLookup["primary/main"]` returns `"VariableID:abc/123:456"`). This avoids scanning the full variables array.
74. **Use `styleKeys` for fast style resolution.** When applying text styles, look up the key by style name in `styleKeys.textStyles` (e.g. `styleKeys.textStyles["Body 1"]` returns the style key). Same pattern for `paintStyles` and `effectStyles`.

### S. Semantic Token Usage

> **Applies to `library` and `tokens` modes.** Always select the most semantically specific variable for the UI context. Never use a generic/primitive token when a purpose-built semantic token exists.

75. **Match tokens to UI purpose, not visual appearance.** Even if two tokens resolve to the same color in light mode, they may diverge in dark mode or future themes. Using the semantically correct token ensures designs remain theme-aware.

76. **Semantic token mapping — use the right variable for each UI element:**

| UI Element | Correct Variable | Wrong Variable |
|---|---|---|
| Page/screen background | `Background/background-default` | — |
| Card, dialog, elevated surface | `Background/background-paper` | `Common/common-white` |
| Alternate surface (sidebar, panel) | `Background/background-paperAlt` | `Background/background-paper` |
| Input field background | `Background/background-input` | `Background/background-paper` |
| Layer/overlay background | `Background/background-layer` | — |
| Headings, labels, primary body text | `Text/text-primary` | `Common/common-black` |
| Secondary descriptions, captions | `Text/text-secondary` | `Text/text-primary` |
| Tertiary/very muted text | `Text/text-tertiary` | `Text/text-secondary` |
| Placeholder/hint text in inputs | `Text/text-hint` | `Text/text-secondary` |
| Clickable text links | `Text/text-link` | `Primary/primary-main` |
| Active/focused text | `Text/text-active` | `Primary/primary-main` |
| Disabled text | `Text/text-disabled` | `Text/text-hint` |
| Input/form field border (resting) | `Border/border-default` | `Other/other-divider` |
| Input border (focused/active) | `Border/border-active` | `Primary/primary-main` |
| Input border (hover) | `Border/border-hover` | `Border/border-default` |
| Subtle/decorative border | `Border/border-light` | `Border/border-default` |
| Primary filled button background | `Primary/primary-main` | — |
| Text on primary-colored surface | `Primary/primary-contrastText` | `Common/common-white` |
| Divider/separator lines | `Other/other-divider` | `Border/border-default` |

77. **Key anti-patterns — NEVER do these:**
- Do NOT use `Primary/primary-main` for text link colors — use `Text/text-link`.
- Do NOT use `Text/text-secondary` for placeholder text in inputs — use `Text/text-hint`.
- Do NOT use `Background/background-paper` for input field fills — use `Background/background-input`.
- Do NOT use `Primary/primary-contrastText` for general white text not on a primary surface — use `Common/common-white`.
- Do NOT use `Primary/primary-main` for any text fill — it is reserved for interactive surface fills (buttons, toggles, selection indicators). Text on those surfaces uses `Primary/primary-contrastText`.
- Do NOT use `Border/border-default` for divider lines between sections — use `Other/other-divider`.
- Do NOT use `Action/*` tokens for static elements — `Action/` tokens are for interactive state feedback (hover, active, disabled states on clickable elements).

78. **When in doubt, prefer specificity.** If a semantic token exists that exactly describes the element's purpose (e.g. `Background/background-input` for a text field), always use it over a broader token (e.g. `Background/background-paper`), even if both resolve to the same color today.

---

## Interactive Specs

## Interactive Spec Workflow

Every design built in Figma MUST go through the spec file workflow. This makes the process visible, editable, and collaborative.

### Directory

All specs live in `.cursor/specs/`. Each spec is a standalone `.json` file named after the design it represents.

### Naming Convention

Use lowercase kebab-case, descriptive of the screen or component:
- `login-screen.json`
- `user-profile-card.json`
- `settings-page.json`
- `onboarding-step-1.json`
- `nav-sidebar.json`

For multi-screen flows, use a shared prefix:
- `checkout-cart.json`
- `checkout-payment.json`
- `checkout-confirmation.json`

---

### T1. Save Before Build — ALWAYS

**Before calling `build_and_verify` or `build_from_spec`, the spec JSON MUST be written to `.cursor/specs/<name>.json`.**

Workflow:
1. Construct the spec object
2. **Write the spec to `.cursor/specs/<name>.json`** using the Write tool
3. Tell the user: "Saved spec to `.cursor/specs/<name>.json`" (so they know it exists and can review it)
4. Run validation: `node .cursor/specs/validate-spec.js .cursor/specs/<name>.json`
5. If validation has **errors**: fix the spec, re-save, re-validate — do NOT build until clean
6. If validation has only **warnings**: note them to the user, proceed to build
7. Build in Figma using `build_and_verify` (preferred) or `build_from_spec`

**NEVER skip the save step.** Even for small components or quick iterations, the spec must exist on disk.

### T2. Update Spec on Rebuild

When rebuilding a design (e.g. fixing issues, user requested changes):
1. Read the existing spec from disk: `.cursor/specs/<name>.json`
2. Modify the spec in memory
3. **Overwrite** `.cursor/specs/<name>.json` with the updated version
4. Tell the user what changed: "Updated `.cursor/specs/<name>.json` — changed X, Y, Z"
5. Re-validate
6. Delete the old Figma node(s) (per canvas hygiene rules)
7. Build the new version

### T3. User Edits a Spec

When the user says "rebuild <name>", "apply <name>", or similar — or when you detect that a spec file has been modified:
1. Read the spec from `.cursor/specs/<name>.json`
2. Run validation: `node .cursor/specs/validate-spec.js .cursor/specs/<name>.json`
3. **If errors**: Report them clearly to the user with the exact error messages. Do NOT build. Suggest fixes.
4. **If valid/warnings only**: Proceed to build in Figma
5. If there's an existing Figma build from a previous version of this spec, delete it first

### T4. Spec File Metadata

Each spec file should include metadata at the top level alongside the design tree. Add a `_meta` key (the plugin ignores keys starting with `_`):

```json
{
  "_meta": {
    "description": "Login screen with email/password form and social auth options",
    "figmaNodeId": "123:456",
    "lastBuilt": "2026-02-11T10:30:00Z",
    "version": 1
  },
  "name": "Login Screen",
  "type": "frame",
  ...
}
```

Update `_meta` after each successful build:
- Set `figmaNodeId` to the root node ID returned by the builder
- Set `lastBuilt` to the current ISO timestamp
- Increment `version`

### T5. Multi-Screen Tracking

When building multiple screens (e.g. from a PRD), create one spec file per screen. After all screens are built, create a manifest:

`.cursor/specs/_manifest.json`:
```json
{
  "project": "User Onboarding Flow",
  "screens": [
    {"file": "onboarding-welcome.json", "order": 1, "figmaNodeId": "10:20"},
    {"file": "onboarding-profile.json", "order": 2, "figmaNodeId": "10:30"},
    {"file": "onboarding-complete.json", "order": 3, "figmaNodeId": "10:40"}
  ],
  "lastUpdated": "2026-02-11T10:30:00Z"
}
```

### T6. What to Tell the User

At each step, communicate clearly:

| Step | What to say |
|---|---|
| Spec saved | "Saved spec to `.cursor/specs/login-screen.json` — you can review or edit it" |
| Validation passed | "Spec validated successfully (X nodes, depth Y)" |
| Validation warnings | "Spec has N warnings: [list]. Proceeding to build." |
| Validation errors | "Spec has N errors that need fixing: [list]. Here's what I'll fix: ..." |
| Build started | "Building in Figma..." |
| Build complete | "Built successfully. Updated spec with Figma node ID." |
| Rebuild from edit | "Detected changes in `login-screen.json`. Validating... Building..." |

### T7. Cleanup Old Specs

When a design is finalized and no longer needs iteration:
- Keep the spec file — it serves as documentation
- The user can delete old spec files manually

When a spec is explicitly abandoned:
- Delete both the spec file and any Figma nodes built from it

### T8. Validation-Only Mode

When the user says "validate my specs", "check specs", or similar:
1. Run `node .cursor/specs/validate-spec.js .cursor/specs/`
2. Report the results
3. Do NOT build anything

---

### Quick Reference

```
.cursor/specs/
├── README.md              # How this directory works
├── validate-spec.js       # Validation script
├── _manifest.json         # Multi-screen project tracker (optional)
├── login-screen.json      # Individual spec files
├── signup-screen.json
└── dashboard.json
```

---

## Quark 2 Components

# Quark 2.20 — Component Key Mapping

Component keys from the **Components (Quark 2.20)** published Figma library.
Use these with `type: "instance"` + `componentKey` in build specs.

> **IMPORTANT**: Each variant in a component set has its **own unique componentKey**. The component SET key cannot be used to instantiate — you must use the specific variant's key from the lookup tables below. Always use `State=Default` unless specifically prototyping interaction states.
>
> Use `instanceOverrides` to change **component properties** (text content, icon visibility) — do NOT override style properties (fill colors, font styles, effects). Style values come from the library.

---

## Button

**Component Set Key**: `ae9ddac2ce6c6c50f6052bc633926746d689dbdf` (for reference only — cannot be used with `componentKey`)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **Style** | `Primary`, `Secondary`, `Tertiary`, `Destructive` | `Primary` |
| **Size** | `Medium`, `Small`, `X-small`, `XX-small` | `Small` |
| **State** | `Default`, `Hover`, `Focus`, `Active`, `Disabled`, `Loading` | `Default` |
| **Content** | `Text & icon`, `Icon only` | `Text & icon` |

> **Restriction**: XX-small size only supports `Icon only` content (no `Text & icon` variant exists for XX-small).

### Component Properties (overrideable via `instanceOverrides`)

| Property | Type | Default | Override Example |
|----------|------|---------|-----------------|
| **Text** (`Text#29041:790`) | TEXT | `"Button"` | `{"childName": "Text", "characters": "Save"}` |
| **Icon left** (`Icon left#50200:0`) | BOOLEAN | `false` (hidden) | `{"childName": "Icon left", "visible": true}` |
| **Icon right** (`Icon right#50200:277`) | BOOLEAN | `false` (hidden) | `{"childName": "Icon right", "visible": true}` |
| **Icon** (`Icon#29041:0`) | INSTANCE_SWAP | component `50571:91368` | Not supported via MCP bridge `instanceOverrides` — default icon is used |

### Internal Child Structure

```
Button (root instance)
├── Icon left  (FRAME, visible: false by default)
│     └── Icon left  (INSTANCE — icon component)
├── Text padding  (FRAME)
│     └── Text  (TEXT — default: "Button")
└── Icon right  (FRAME, visible: false by default)
      └── Icon right  (INSTANCE — icon component)
```

### Variant Key Lookup (State=Default only)

Use the key matching your desired **Style × Size × Content** combination. All keys below are for `State=Default`.

**Primary**

| Size | Content | Component Key |
|------|---------|--------------|
| Small | Text & icon | `2a3b0b76f00f104431ef867aa93a60a957b85b5b` |
| Small | Icon only | `d93d8cd1f853c2b2a6d2d6064d966fe699c88ded` |
| Medium | Text & icon | `582b7f7d187db0122afeb4a78584d163fdff779b` |
| Medium | Icon only | `52f4cf992fc78c27edaa6b31c1de94c3234f02a5` |
| X-small | Text & icon | `c24e74ba85bdd6e3cbca5acc351652e9c9bb40c8` |
| X-small | Icon only | `7b172da2c6dedaef46a35262c3e3b4f25342052a` |
| XX-small | Icon only | `10cfd719c243c7aff0b3c5787e137f4751087dfe` |

**Secondary**

| Size | Content | Component Key |
|------|---------|--------------|
| Small | Text & icon | `95c32ca5562673f1654fba1b6b2ff35a416c862b` |
| Small | Icon only | `6b9b115c6ce3532f47caf48d6ef986e867b57cb6` |
| Medium | Text & icon | `71db321500569388f9c54d5769d6928419b172e1` |
| Medium | Icon only | `1ef6f42670bff49cb720a34b2e10699ad6ba4221` |
| X-small | Text & icon | `b77452ac5c52631641af3b02c1b13113e9254294` |
| X-small | Icon only | `89cdf095d8e0de0d3413d6496edb3bc253dc9c8e` |
| XX-small | Icon only | `459348a8c73f19ab7b4b4d1304c8ee2494e33ba0` |

**Tertiary**

| Size | Content | Component Key |
|------|---------|--------------|
| Small | Text & icon | `2bffe09153c44d843f354d8a396d71051e9ed8ff` |
| Small | Icon only | `6e66491a7d5d7f3f71332e848314ff5aa9ea759f` |
| Medium | Text & icon | `e646e0178188601bb3ebc55e1fd023b5bf66db99` |
| Medium | Icon only | `25d9a66d8cfce7a495cdf6cfcabfead8455686d3` |
| X-small | Text & icon | `1af5a6c864b8e3e2f5a5366684dea5ae5277d541` |
| X-small | Icon only | `be1b6be25fe1adee3e4569a667d4cbbbaeeb7332` |
| XX-small | Icon only | `19067f22b46306aecadd682030423b8c9fe61bca` |

**Destructive**

| Size | Content | Component Key |
|------|---------|--------------|
| Small | Text & icon | `79d63531a1849ad9c499cb1cf73da022cdef8eee` |
| Small | Icon only | `deca4d4a997bdc5fd146ff649fee7ebf3cecb08b` |
| Medium | Text & icon | `8104fb4a62d1feb6f79484b69dd779ba5c996e1e` |
| Medium | Icon only | `3a2bc2da34bef6ff7864be3e5ad1c3f8e6a3fcbf` |
| X-small | Text & icon | `6aa3df2455b15cace696f29f85b48c56323e9b69` |
| X-small | Icon only | `e2b7f01a7e1e4c77b166ec3dedd175457a5fe7cc` |
| XX-small | Icon only | `46bf08f8def61985fe0255495f6c0b3b1016b561` |

### Quick Reference — How to Match Context to Variant

| When the user says... | Use Style | Use Size | Use Content |
|-----------------------|-----------|----------|-------------|
| "primary button", "main action", "CTA", "submit" | Primary | Small (default) | Text & icon |
| "secondary button", "cancel", "back" | Secondary | Small | Text & icon |
| "tertiary button", "text button", "link-style" | Tertiary | Small | Text & icon |
| "delete button", "remove", "danger" | Destructive | Small | Text & icon |
| "large button", "big button" | (context) | Medium | Text & icon |
| "small button", "compact" | (context) | X-small | Text & icon |
| "icon button", "icon-only" | (context) | (context) | Icon only |
| "tiny icon button", "toolbar icon" | (context) | XX-small | Icon only |

### Spec Example

```json
{
  "name": "Save Button",
  "type": "instance",
  "componentKey": "2a3b0b76f00f104431ef867aa93a60a957b85b5b",
  "instanceOverrides": [
    {"childName": "Text", "characters": "Save changes"}
  ]
}
```

---

## Button Group

**Component Set Key**: `cd4f4c1e9b991ba2585e740d3edb257e1aa40481` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **Count** | `2`, `3`, `4` | `2` |
| **Variant** | `Primary`, `Secondary`, `Tertiary` | `Primary` |
| **Size** | `Small`, `Medium` | `Small` |
| **Icon only** | `True`, `False` | `False` |
| **Horizontal** | `True`, `False` | `True` |

> 72 total variants. No TEXT or BOOLEAN component properties — only VARIANT axes. All overrides are variant-selection based.

### Variant Key Lookup (Horizontal=True, Icon only=False — most common)

**Primary**

| Count | Size | Component Key |
|-------|------|--------------|
| 2 | Small | `01c5fd658ba6b49ab320ccd252613452578ceaf4` |
| 2 | Medium | `14c9cb065e837d0d3f4d73cec1972558ada6113f` |
| 3 | Small | `699d2a13207a82279eb37a2943cc8cbcc0737ca7` |
| 3 | Medium | `19a85b35912a2b24c7d015242e7e7d488a3323be` |
| 4 | Small | `407448adb3e96a7d4c2e8818998b9d55186b3d62` |
| 4 | Medium | `3cf1be2aa40188355d5d730ac6c646a0a85a0058` |

**Secondary**

| Count | Size | Component Key |
|-------|------|--------------|
| 2 | Small | `b28cfe9f08d908dc4fa4e19c6ae9bf83dce4760b` |
| 2 | Medium | `0c2ad3e561076b547687f11cbea8b2450d5e01b0` |
| 3 | Small | `108645ac18736e41b8d93369faf2678ad19e516b` |
| 3 | Medium | `1276aca548d5b9c8c1c4edfc2f8489002a60fac3` |
| 4 | Small | `3bfedb98df394216ba0d99f97fee7bf31b9878fa` |
| 4 | Medium | `a9f8faa2d814d6cfa319cb3fcf665020026ecb32` |

**Tertiary**

| Count | Size | Component Key |
|-------|------|--------------|
| 2 | Small | `c2aca3c4d44e19bc0a87c0fa96f8ed56eb473597` |
| 2 | Medium | `48a8a024a782024a9d967f7d8507d9eeeb750a28` |
| 3 | Small | `da445eab2fa4003908e36d9c276ae328eb5966fc` |
| 3 | Medium | `1abe693b3c24feb7c86ab8b050a31cec09bf1b6f` |
| 4 | Small | `9691091c294d8d4230d68783644354ba58e57b3b` |
| 4 | Medium | `eda0848720fe9ffc4bb739fe2ee1d52f2a4173f5` |

### Quick Reference

| When the user says... | Use Variant | Use Count | Use Size |
|-----------------------|-------------|-----------|----------|
| "button group", "grouped buttons" | Primary | 2 | Small |
| "3-button group", "triple action" | Primary | 3 | Small |
| "secondary button group" | Secondary | 2 | Small |
| "large button group" | (context) | (context) | Medium |

---

## Button Select

**Component Set Key**: `aa19fb4818521a368a93014d2f63c4781f716738` (reference only)

A lightweight control that gives users a menu to choose from. Used when you have multiple select fields in a row that require less visual weight.

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **State** | `default`, `hover`, `focus state`, `active`, `disabled` | `default` |

### Component Properties

| Property | Type | Default | Override Example |
|----------|------|---------|-----------------|
| **show adornment** (`how adornment#58:0`) | BOOLEAN | `false` | `{"childName": "how adornment", "visible": true}` |
| **adornment** (`adornment#126:0`) | INSTANCE_SWAP | component `264:10692` | Not supported via MCP bridge |

### Variant Key Lookup (State=default only)

| State | Component Key |
|-------|--------------|
| default | `50b10e8235935ec2be517ecd3fc1c8121f5d1dd9` |

> Only the `default` state key is needed for static mockups. Other states (hover, focus, active, disabled) are for prototyping.

### Spec Example

```json
{
  "name": "Status Select",
  "type": "instance",
  "componentKey": "50b10e8235935ec2be517ecd3fc1c8121f5d1dd9"
}
```

---

## Toggle Button

**Component Set Key**: `622876f57ab7b8e8e16babb9fb65145d42b1029c` (reference only)

Toggle buttons are used to switch between multiple views or contextual states.

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `off`, `hover`, `focus`, `on`, `disabled` | `off` |
| **color** | `primary`, `default`, `inverse` | `primary` |
| **size** | `standard`, `medium` | `standard` |
| **adornment** | `text only`, `icon`, `icon left` | `text only` |

> 90 total variants.

### Component Properties

| Property | Type | Default | Override Example |
|----------|------|---------|-----------------|
| **text** (`text#29041:1258`) | TEXT | `"Toggle button"` | `{"childName": "text", "characters": "Grid view"}` |
| **icon** (`icon#29041:1185`) | INSTANCE_SWAP | component `50571:91368` | Not supported via MCP bridge |

### Variant Key Lookup (state=off only)

**primary**

| Size | Adornment | Component Key |
|------|-----------|--------------|
| standard | text only | `bc80f393a7f0b6873e531627e439d852b045df00` |
| standard | icon | `7509bf811dab0ee81b11defaa9e6d8a1a3fc09cb` |
| standard | icon left | `e0290cbd8e04ead8f5bd1623667c2a4b892d9011` |
| medium | text only | `2d5e3a2ab5308f1b162ce4ec48791a7842125826` |
| medium | icon | `4c9958acea39c0555f92c4038985a8218eed2c2f` |
| medium | icon left | `3c8a2fa64ed125f72fe46eb41b0646de87249e1a` |

**default**

| Size | Adornment | Component Key |
|------|-----------|--------------|
| standard | text only | `de4ad943c0b4438e4c4784507fa02e8ab7941e14` |
| standard | icon | `580ad66cf5b307c5f3bf64b87376712baecfb960` |
| standard | icon left | `82d2baa2ceeef12cd6d5f62ac1e558e8d89401e5` |
| medium | text only | `c9b8c06da53c5a2501d24e3f5625815ad056e994` |
| medium | icon | `b2d08bb547e0f008e1e094b036c2b72315f7ca65` |
| medium | icon left | `7b21991abafb4812e40a7a01646d4c02d73cb58e` |

**inverse**

| Size | Adornment | Component Key |
|------|-----------|--------------|
| standard | text only | `c613243897777531b362f6f44d7553a7a99f555e` |
| standard | icon | `fdb3677662e997ce48d7237e4cb1cfd3a0cb8fbd` |
| standard | icon left | `132223cd094412f4433f02cbfbd962735f9686ca` |
| medium | text only | `1382e627e109b5ed2cc7de089b5036c6a6baaed4` |
| medium | icon | `620534e41a07ce1392738cd7bbe087e83f1e9297` |
| medium | icon left | `0b40d73e16303a35c8d959d54c84af26b54ad7bf` |

### Quick Reference

| When the user says... | Use color | Use size | Use adornment |
|-----------------------|-----------|----------|---------------|
| "toggle", "toggle button" | primary | standard | text only |
| "view toggle", "grid/list toggle" | default | standard | icon left |
| "icon toggle" | primary | standard | icon |
| "large toggle" | (context) | medium | (context) |
| "toggle on dark background" | inverse | standard | (context) |

### Spec Example

```json
{
  "name": "View Toggle",
  "type": "instance",
  "componentKey": "e0290cbd8e04ead8f5bd1623667c2a4b892d9011",
  "instanceOverrides": [
    {"childName": "text", "characters": "Grid view"}
  ]
}
```

---

## Toggle Button Group

**Component Set Key**: `c69670997a26020b3eb2f0285732ead9bccd9c68` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **color** | `primary`, `secondary` | `primary` |
| **direction** | `horizontal`, `vertical` | `horizontal` |
| **variant** | `outlined`, `ghost` | `ghost` |
| **size** | `small`, `medium (deprecated)` | `medium (deprecated)` |
| **icon** | `no`, `yes` | `no` |

> 32 total variants. The `medium (deprecated)` size is deprecated — prefer `small`. No TEXT or BOOLEAN component properties.

### Variant Key Lookup (size=small only — recommended)

**primary**

| Direction | Variant | Icon | Component Key |
|-----------|---------|------|--------------|
| horizontal | outlined | no | `5e6d1159d036b365fc887ec8a603308551fe2b1c` |
| horizontal | outlined | yes | `8b88ba5e834a67f244f6bbf8c26529f1d7d7dd63` |
| horizontal | ghost | no | `fe19e353d464f94ccc04c87a7c7f3abc5372c6d0` |
| horizontal | ghost | yes | `c266ad0301504fddb71fb6ec435514c5f4a4d9c7` |
| vertical | outlined | no | `0febad82d1fcf4b6aa58cceda8601699cfd4527d` |
| vertical | outlined | yes | `968e092b9e61bae89b2d5c75acb0a68fcc5bc94c` |
| vertical | ghost | no | `df593d92c35d194c470dce380b82269022bf99c9` |
| vertical | ghost | yes | `64a355dd39cc37757d2a4a9b7391910cdaa307d7` |

**secondary**

| Direction | Variant | Icon | Component Key |
|-----------|---------|------|--------------|
| horizontal | outlined | no | `6be00f9ea6d38862cd9b516c971e529b49036fca` |
| horizontal | outlined | yes | `c3d58cb7d55c3703cb830ca1c5003eee48b35d55` |
| horizontal | ghost | no | `1c31ce8b7c7fa22c61508a64397d2d69706e9781` |
| horizontal | ghost | yes | `fac27d99c1bf6bbc95ca9b692a1b8acf094d63dd` |
| vertical | outlined | no | `c9edb19919fc6d1a50e291b34dac5898d1af0489` |
| vertical | outlined | yes | `99e94c8d7dc82f4ca35d0878443f7ac9c44daffd` |
| vertical | ghost | no | `ad3a53a27c85dd9bddd36aa986b93a2a0efdf93a` |
| vertical | ghost | yes | `e415058291cee9f1b07feac16f14625b669c53e2` |

### Quick Reference

| When the user says... | Use color | Use direction | Use variant | Use icon |
|-----------------------|-----------|---------------|-------------|----------|
| "toggle group", "segmented control" | primary | horizontal | ghost | no |
| "outlined toggle group" | primary | horizontal | outlined | no |
| "vertical toggle group" | primary | vertical | ghost | no |
| "icon toggle group" | primary | horizontal | ghost | yes |

### Spec Example

```json
{
  "name": "View Switcher",
  "type": "instance",
  "componentKey": "fe19e353d464f94ccc04c87a7c7f3abc5372c6d0"
}
```

---

## Split Button

**Component Set Key**: `7b2e02157365c2aaf9d81be17bd8a4beb9b7745f` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **Style** | `Primary`, `Secondary`, `Tertiary` | `Primary` |
| **Size** | `Small`, `Medium`, `X-small` | `Small` |

> 9 total variants. No TEXT or BOOLEAN component properties — only VARIANT axes.

### Variant Key Lookup (all variants)

| Style | Size | Component Key |
|-------|------|--------------|
| Primary | Small | `3b272d4c0ff9218ed7b1e9c55fd400b0ec75e92e` |
| Primary | Medium | `17f8f01ba2cf898a00d23a656ce1a594d6cc3016` |
| Primary | X-small | `e4d557e8af07f2e87c265675ba81bcdf9736cf48` |
| Secondary | Small | `09430a58f1ec1a5c389b9b28618f9095129b60aa` |
| Secondary | Medium | `4897d24bd2797dcc39536edfb2eb405ddafb257d` |
| Secondary | X-small | `da612422553abed64a1ac46a0e16833974ef836a` |
| Tertiary | Small | `77f498a56c4201641dacf3ed0e6f38d6ef35b9b1` |
| Tertiary | Medium | `2c291b48912dabe2e6dc85eb09f508fa4f062879` |
| Tertiary | X-small | `82a5d8bff9b77f7f39aa11d4e330ba0140aaa979` |

### Quick Reference

| When the user says... | Use Style | Use Size |
|-----------------------|-----------|----------|
| "split button", "dropdown button" | Primary | Small |
| "secondary split button" | Secondary | Small |
| "large split button" | (context) | Medium |
| "small split button", "compact split" | (context) | X-small |

### Spec Example

```json
{
  "name": "Actions Split",
  "type": "instance",
  "componentKey": "3b272d4c0ff9218ed7b1e9c55fd400b0ec75e92e"
}
```

---

## Checkbox

**Component Set Key**: `a4c41b8ea616cb2f79c79c9b21f2a014066bc9d7` (reference only — do not use for instantiation)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **label** | `yes`, `no` | `yes` |
| **help text** | `no`, `yes` | `no` |
| **size** | `standard`, `medium` | `standard` |
| **checkbox state** | `default`, `inactive`, `hover`, `focused` | `default` |
| **checkbox selection** | `inactive`, `active`, `indeterminate` | `inactive` |
| **edge (negative margin)** | `start`, `false (deprecated)` | `start` |

> All properties are VARIANT type only. No TEXT or BOOLEAN component properties — overrides are variant-selection based. For static mockups, always use `checkbox state=default` and `edge=start`.

### Variant Key Lookup (checkbox state=default, edge=start)

**Standard size**

| Label | Help Text | Selection | Component Key |
|-------|-----------|-----------|--------------|
| yes | no | inactive | `d901d3289708d284a38f95da260ed1e5f8bb2dd1` |
| yes | no | active | `44326672792fb66ea44466f95605dbe13bc85d8f` |
| yes | no | indeterminate | `ced97a30ca2b4fb4ab87444cb09a6c13f7207170` |
| yes | yes | inactive | `30a979ea4a8b3e767396031fbb38152279c7450a` |
| yes | yes | active | `76a54e28b38712fc8c1293707e499b3ddb42dc8b` |
| yes | yes | indeterminate | `d60ac65e4d1703c47fe93fbd002e39e9ffcdf35e` |
| no | no | inactive | `ea1a799cb92c619d433a9cb52bfa3981e10742ef` |
| no | no | active | `55930d7d37cadb2633782652dc8fd500b382c14e` |
| no | no | indeterminate | `80b5b4086a31fa3fc923b2ee17f3e80d11c679e7` |

**Medium size**

| Label | Help Text | Selection | Component Key |
|-------|-----------|-----------|--------------|
| yes | no | inactive | `de5ee28c57a8fe091214305fa07630e4df602135` |
| yes | no | active | `3b9795f915046c0bc82e3ef9836d9bc75fab373f` |
| yes | no | indeterminate | `eb1e20a45f1f86490ebf52cf403a48252c03b2a1` |
| yes | yes | inactive | `f76c86949de60c67875149b938660acc0b172e90` |
| yes | yes | active | `112684bbc3705ce382f9b912942fd8e8899ba09b` |
| yes | yes | indeterminate | `4fc33276600179860d2963b6feb05c21f228f699` |
| no | no | inactive | `dc58bf2f5d109435135f80f49149454b3f00962b` |
| no | no | active | `844324031b8b29b8745c151b7badb18ec6ed5dab` |
| no | no | indeterminate | `2040bca997fbc536d2cb00959284b5afd18b7629` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "checkbox" / "unchecked checkbox" | Standard, label=yes, help text=no, selection=inactive → `d901d3289708d284a38f95da260ed1e5f8bb2dd1` |
| "checked checkbox" | Standard, label=yes, help text=no, selection=active → `44326672792fb66ea44466f95605dbe13bc85d8f` |
| "indeterminate checkbox" | Standard, label=yes, help text=no, selection=indeterminate → `ced97a30ca2b4fb4ab87444cb09a6c13f7207170` |
| "checkbox with help text" | Standard, label=yes, help text=yes, selection=inactive → `30a979ea4a8b3e767396031fbb38152279c7450a` |
| "checkbox no label" / "standalone checkbox" | Standard, label=no, selection=inactive → `ea1a799cb92c619d433a9cb52bfa3981e10742ef` |
| "large checkbox" / "medium checkbox" | Medium, label=yes, help text=no, selection=inactive → `de5ee28c57a8fe091214305fa07630e4df602135` |

### Spec Example

```json
{
  "name": "Accept Terms Checkbox",
  "type": "instance",
  "componentKey": "d901d3289708d284a38f95da260ed1e5f8bb2dd1"
}
```

---

## Radio

**Component Set Key**: `8ec7ffb1e067a7a53e87ac5398ec43382701335a` (reference only — do not use for instantiation)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **label** | `yes`, `no` | `yes` |
| **help text** | `no`, `yes` | `no` |
| **size** | `Standard`, `medium` | `Standard` |
| **radio state** | `default`, `inactive`, `hover`, `focused` | `default` |
| **radio selection** | `inactive`, `active` | `inactive` |
| **edge** | `start`, `false (depricated)` | `start` |

> All properties are VARIANT type only. No TEXT or BOOLEAN component properties. For static mockups, always use `radio state=default` and `edge=start`.

### Variant Key Lookup (radio state=default, edge=start)

**Standard size**

| Label | Help Text | Selection | Component Key |
|-------|-----------|-----------|--------------|
| yes | no | inactive | `5d68dcfb72e14daf49c3cbed1cbdc3ca9061a6b4` |
| yes | no | active | `a3307696d9df5cb38b8a736278782c70e276b3a8` |
| yes | yes | inactive | `4c587c90fb7890cca5ecf235f7c6b5fbdd7f6f07` |
| yes | yes | active | `4305819cb1e5ea4aab00e36f8f78faa0ed2dc142` |
| no | no | inactive | `16691d69575ac1c0809497a2af22aa02b0eef426` |
| no | no | active | `e40aa8cc8bb1958b51d4270efd1dfe84cd891b17` |

**Medium size**

| Label | Help Text | Selection | Component Key |
|-------|-----------|-----------|--------------|
| yes | no | inactive | `a96a786d213418c69927ef1878923f87eb85f868` |
| yes | no | active | `570b36c7ec8c4398fc7444d92241603b70d7618d` |
| yes | yes | inactive | `0457bfc39accc151b36fb0125fcd1a9c99491f79` |
| yes | yes | active | `1ae124871fbffb3135b1c4857db51a551062da1c` |
| no | no | inactive | `349d4f6bcbb00e9658da0983cacaa6f7bd1f4fb2` |
| no | no | active | `280a0869911a4b97fbd76ae53e5d39e69f6eb8a7` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "radio" / "radio button" / "unselected radio" | Standard, label=yes, help text=no, selection=inactive → `5d68dcfb72e14daf49c3cbed1cbdc3ca9061a6b4` |
| "selected radio" / "active radio" | Standard, label=yes, help text=no, selection=active → `a3307696d9df5cb38b8a736278782c70e276b3a8` |
| "radio with help text" | Standard, label=yes, help text=yes, selection=inactive → `4c587c90fb7890cca5ecf235f7c6b5fbdd7f6f07` |
| "radio no label" / "standalone radio" | Standard, label=no, selection=inactive → `16691d69575ac1c0809497a2af22aa02b0eef426` |
| "large radio" / "medium radio" | Medium, label=yes, help text=no, selection=inactive → `a96a786d213418c69927ef1878923f87eb85f868` |

### Spec Example

```json
{
  "name": "Gender Selection Radio",
  "type": "instance",
  "componentKey": "5d68dcfb72e14daf49c3cbed1cbdc3ca9061a6b4"
}
```

---

## Switch

**Component Set Key**: `70b001fe5706d3d9aa8073ae6db48eda5d16ddac` (reference only — do not use for instantiation)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `default`, `hover`, `disabled` | `default` |
| **size** | `medium`, `small` | `small` |
| **active** | `on`, `off` | `on` |
| **Knob-Icon** | `True`, `False` | `True` |

> 24 total variants.

### Component Properties

| Property | Type | Default | `instanceOverrides` |
|----------|------|---------|-------------------|
| **label** (id: `label#38579:0`) | TEXT | `"Label"` | `{"childName": "label", "characters": "Dark Mode"}` |
| **show label** (id: `show label#38579:25`) | BOOLEAN | `true` | `{"childName": "show label", "visible": false}` |

### Variant Key Lookup (state=default)

| Size | Active | Knob-Icon | Component Key |
|------|--------|-----------|--------------|
| medium | on | True | `b8ce7261fb8208fefd0bcd2cd95b4e2307d77347` |
| medium | on | False | `08599804c1cbedf4a29167cc2911986376b651a9` |
| medium | off | True | `112f48ddbbf26b5b612ede4b1db84f99987772f5` |
| medium | off | False | `719326968517c03f2158f03bc612faee39a86270` |
| small | on | True | `a937ec4fded3ea96a8f1f156a88a2567727dd4c2` |
| small | on | False | `e9d24f197ad98c57c1b0722774cb03fb3f642e34` |
| small | off | True | `a9f2a18233641e4e1d551ea080400c30601445a3` |
| small | off | False | `d6a0aaa3afc62ed863ab4a21d38dd50ef491525b` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "switch" / "toggle" / "switch on" | Medium, on, Knob-Icon=True → `b8ce7261fb8208fefd0bcd2cd95b4e2307d77347` |
| "switch off" / "toggle off" | Medium, off, Knob-Icon=True → `112f48ddbbf26b5b612ede4b1db84f99987772f5` |
| "small switch" / "compact toggle" | Small, on, Knob-Icon=True → `a937ec4fded3ea96a8f1f156a88a2567727dd4c2` |
| "switch without icon" / "plain toggle" | Medium, on, Knob-Icon=False → `08599804c1cbedf4a29167cc2911986376b651a9` |

### Spec Example

```json
{
  "name": "Dark Mode Toggle",
  "type": "instance",
  "componentKey": "b8ce7261fb8208fefd0bcd2cd95b4e2307d77347",
  "instanceOverrides": [
    {"childName": "label", "characters": "Dark Mode"}
  ]
}
```

---

## Slider

**Component Set Key**: `5128ffad706863c56f3acdbfd4700042cf1aab89` (reference only — do not use for instantiation)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **style** | `primary`, `secondary` | `primary` |
| **direction** | `horizontal`, `vertical` | `horizontal` |
| **data type** | `discrete`, `continous` | `discrete` |
| **number of values** | `one value`, `two values` | `two values` |

> 16 total variants. All properties are VARIANT type only. No TEXT or BOOLEAN component properties.

### Variant Key Lookup (all variants)

**Horizontal**

| Style | Data Type | Values | Component Key |
|-------|-----------|--------|--------------|
| primary | discrete | one value | `499cd5c35054736fdffed48d633fb5d4310835f4` |
| primary | discrete | two values | `02199bc1e645683d53e6a38ed8ed6f0fc18d0ca6` |
| primary | continous | one value | `08b8c94de90833155032cc1d2eb4a2745dbd489b` |
| primary | continous | two values | `d94140cc539268c4e0fb1acb72c28a73b4f35057` |
| secondary | discrete | one value | `7441bec772f202a85bd61a27e388b5fd5d9afb47` |
| secondary | discrete | two values | `4097b67c9ec229cdd9fe444ebe9c93831d65c706` |
| secondary | continous | one value | `41a0fcf591449fb768d38dbd9656db8609133dc6` |
| secondary | continous | two values | `59bddefcafe85e4adbf42eaa3ea08e58a23a926f` |

**Vertical**

| Style | Data Type | Values | Component Key |
|-------|-----------|--------|--------------|
| primary | discrete | one value | `7c730b1a0feceb0722a514790e41764aedd13082` |
| primary | discrete | two values | `7dba0b0b961e3f7d96e29e9abbbb4a8e7d229e36` |
| primary | continous | one value | `ecf706b874d43623335fdd77974a9ebeeea6893a` |
| primary | continous | two values | `9b4785210ba01cd027439de5ccdcc3ae1aa3d422` |
| secondary | discrete | one value | `43295a4e425c83c3e8dbedb692369021215fd0cd` |
| secondary | discrete | two values | `133d75c5caef6115c723788a1ac6d1ada457c9ec` |
| secondary | continous | one value | `3e07ac48e34f6a5eb2c6384ed24836aea66f7f5e` |
| secondary | continous | two values | `6986dded991d66697f6605e5409277f2f7f42d11` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "slider" / "range slider" | Primary, horizontal, discrete, one value → `499cd5c35054736fdffed48d633fb5d4310835f4` |
| "range slider" / "dual slider" / "two-thumb slider" | Primary, horizontal, discrete, two values → `02199bc1e645683d53e6a38ed8ed6f0fc18d0ca6` |
| "continuous slider" / "smooth slider" | Primary, horizontal, continous, one value → `08b8c94de90833155032cc1d2eb4a2745dbd489b` |
| "vertical slider" | Primary, vertical, discrete, one value → `7c730b1a0feceb0722a514790e41764aedd13082` |
| "secondary slider" | Secondary, horizontal, discrete, one value → `7441bec772f202a85bd61a27e388b5fd5d9afb47` |

### Spec Example

```json
{
  "name": "Volume Slider",
  "type": "instance",
  "componentKey": "499cd5c35054736fdffed48d633fb5d4310835f4"
}
```

---

## Text Fields

**Component Set Key**: `1ab8a4f60a82b8fcb744a8677b2ce6fee9e27498` (reference only — do not use for instantiation)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `empty`, `hover`, `active`, `has value`, `disabled`, `empty error`, `has value error`, `has value disable` | `empty` |
| **style** | `outlined`, `line (deprecated)` | `outlined` |
| **size** | `medium`, `small` | `small` |
| **variation** | `text only`, `icon left` | `text only` |
| **helper text** | `no`, `yes` | `no` |
| **label** | `yes`, `no` | `yes` |

> All properties are VARIANT type only. For static mockups, always use `state=empty`, `style=outlined`. Use `variation=text only` unless an icon is needed.

### Variant Key Lookup (state=empty, style=outlined)

**Medium size**

| Variation | Helper Text | Label | Component Key |
|-----------|-------------|-------|--------------|
| icon left | no | yes | `cc4ce8d289b6b5c9bd5a954b3330d5adcea1bb7c` |
| text only | no | yes | `9609c0c0a1503368b1ff9e0d3c232e9c8251f5af` |
| text only | no | no | `5b3967934f2fc5af59f1794c0f5f19c7ee5957d4` |
| text only | yes | yes | `41e4ec8db9623ad5c9efb2f565ad08815b8f5fa6` |
| text only | yes | no | `bf9cdd2261577c64fbd11b92f056a2b211941bba` |

**Small size**

| Variation | Helper Text | Label | Component Key |
|-----------|-------------|-------|--------------|
| icon left | no | yes | `a6bb898acd1ff45a501cc9b68dbb79cc64789399` |
| text only | no | yes | `56b9138acb43d846b4f8c20994871107b7b3647c` |
| text only | no | no | `05559a8adb0683693bfb8e1dffb090483a852ba8` |
| text only | yes | yes | `39a2f7390bf07a7b4227e1f2c1620364e0231cd8` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "text field" / "input" / "text input" | Medium, text only, no helper, with label → `9609c0c0a1503368b1ff9e0d3c232e9c8251f5af` |
| "small text field" | Small, text only, no helper, with label → `56b9138acb43d846b4f8c20994871107b7b3647c` |
| "text field with icon" | Medium, icon left, no helper, with label → `cc4ce8d289b6b5c9bd5a954b3330d5adcea1bb7c` |
| "text field with helper" | Medium, text only, with helper, with label → `41e4ec8db9623ad5c9efb2f565ad08815b8f5fa6` |

### Spec Example

```json
{
  "name": "Email Input",
  "type": "instance",
  "componentKey": "9609c0c0a1503368b1ff9e0d3c232e9c8251f5af"
}
```

---

## Date Input

**Component Set Key**: `1b6fdc462d84a3ad8648de811610aa47e967479c` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **size** | `medium`, `small` | `small` |
| **style** | `outline`, `line (deprecated)` | `outline` |
| **state** | `empty`, `hover`, `active`, `has value`, `disable`, `error`, `has value disable` | `empty` |

> All VARIANT type only. For static mockups, use `style=outline`.

### Variant Key Lookup (style=outline)

| Size | State | Component Key |
|------|-------|--------------|
| medium | empty | `2d36fcbe463931c31b19207e0e8bc707f1aa1849` |
| medium | has value | `eda80cabb35f56a3246d80b8e3dde56930cf38e0` |
| small | empty | `2eec482df1fb08a564494108ae878e957b959eb3` |
| small | has value | `99cc875507b534fbcc467a9e351ca22aa719fec3` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "date picker" / "date input" / "date field" | Medium, outline, empty → `2d36fcbe463931c31b19207e0e8bc707f1aa1849` |
| "small date picker" | Small, outline, empty → `2eec482df1fb08a564494108ae878e957b959eb3` |

### Spec Example

```json
{
  "name": "Start Date",
  "type": "instance",
  "componentKey": "2d36fcbe463931c31b19207e0e8bc707f1aa1849"
}
```

---

## Time Input

**Component Set Key**: `9dae2a134fd8b331c1a10d8d00738d43866c5105` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `empty`, `hover`, `active`, `has value`, `disable`, `error`, `has value disable` | `empty` |
| **size** | `medium`, `small` | `small` |
| **style** | `outline`, `line (deprecated)` | `outline` |

> All VARIANT type only. For static mockups, use `style=outline`.

### Variant Key Lookup (style=outline)

| Size | State | Component Key |
|------|-------|--------------|
| medium | empty | `7fadbf923c444896ab05db75fd224d40784240aa` |
| medium | has value | `74511a397044d08f4665b21002008e16c598dace` |
| small | empty | `b62295799c7aa3795919cad4d8fe1d400d70c77f` |
| small | has value | `63e849226bc1d07c7ec764f594a43c9fffa68362` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "time input" / "time picker" / "time field" | Medium, outline, empty → `7fadbf923c444896ab05db75fd224d40784240aa` |
| "small time input" | Small, outline, empty → `b62295799c7aa3795919cad4d8fe1d400d70c77f` |

### Spec Example

```json
{
  "name": "Meeting Time",
  "type": "instance",
  "componentKey": "7fadbf923c444896ab05db75fd224d40784240aa"
}
```

---

## Date Time Input

**Component Set Key**: `2d0401244482d6d6d85f3502ca6ae0da0033e532` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `default`, `error` | `default` |
| **type** | `date time input` | `date time input` |

> Simple 2-variant component. Combines a date input + time input side by side.

### Variant Key Lookup

| State | Component Key |
|-------|--------------|
| default | `d5e4f428dc9e09953dc8e1d17bf2d5657f350708` |
| error | `abddb31aac9755dec3381ed3745f3ffcf8d79aba` |

### Spec Example

```json
{
  "name": "Event Date Time",
  "type": "instance",
  "componentKey": "d5e4f428dc9e09953dc8e1d17bf2d5657f350708"
}
```

---

## Currency Input

**Component Set Key**: `b71418b56fa89e2a1700eb2a83c9b861b9973824` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **size** | `medium`, `small` | `small` |
| **style** | `outline`, `line (deprecated)` | `outline` |
| **state** | `empty`, `hover`, `active`, `has value`, `disable`, `error`, `has value disable` | `empty` |

> All VARIANT type only. For static mockups, use `style=outline`.

### Variant Key Lookup (style=outline)

| Size | State | Component Key |
|------|-------|--------------|
| medium | empty | `183dfaab49c1317f8d09af7c6fe243569c84e7fb` |
| medium | has value | `7c2f25a3f922c1514ef609e1753cab37903b72c8` |
| small | empty | `90230f75a81ba306fb55f6881833d68675de164f` |
| small | has value | `7ef35b42782de32b9d0a7835024b5db1a61382a4` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "currency" / "money input" / "amount field" | Medium, outline, empty → `183dfaab49c1317f8d09af7c6fe243569c84e7fb` |
| "small currency" | Small, outline, empty → `90230f75a81ba306fb55f6881833d68675de164f` |

### Spec Example

```json
{
  "name": "Invoice Amount",
  "type": "instance",
  "componentKey": "183dfaab49c1317f8d09af7c6fe243569c84e7fb"
}
```

---

## Number Input

**Component Set Key**: `394f55e3fb1e9fb8e83da0a5f342762138fc69d7` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **size** | `medium`, `small` | `small` |
| **style** | `outline`, `line (deprecated)` | `outline` |
| **state** | `empty`, `hover`, `active`, `has value`, `disable`, `error`, `has value disable` | `empty` |

> All VARIANT type only. For static mockups, use `style=outline`.

### Variant Key Lookup (style=outline)

| Size | State | Component Key |
|------|-------|--------------|
| medium | empty | `bf0d20323d43f892db6232e7b5a5023b600bbc74` |
| medium | has value | `c22d8bf22a2e16faae5a93c583c168062fb3fe9e` |
| small | empty | `9657fc645e8a1e52a8f062cfd81c145eff1b5b0d` |
| small | has value | `6aa433d4d9cb66359aca535f37d733912394c2bf` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "number input" / "numeric field" / "quantity" | Medium, outline, empty → `bf0d20323d43f892db6232e7b5a5023b600bbc74` |
| "small number input" | Small, outline, empty → `9657fc645e8a1e52a8f062cfd81c145eff1b5b0d` |

### Spec Example

```json
{
  "name": "Quantity Field",
  "type": "instance",
  "componentKey": "bf0d20323d43f892db6232e7b5a5023b600bbc74"
}
```

---

## Password Input

**Component Set Key**: `998abb53bec9965de81c016ba22ee8c8310e47f1` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **size** | `medium`, `small` | `small` |
| **style** | `outline`, `underline (deprecated)` | `outline` |
| **state** | `empty`, `hover`, `active`, `has value`, `disable`, `error`, `has value disable` | `empty` |

> All VARIANT type only. For static mockups, use `style=outline`.

### Variant Key Lookup (style=outline)

| Size | State | Component Key |
|------|-------|--------------|
| medium | empty | `1650f33a07899ce2da285c9cfb735da4028f76f0` |
| medium | has value | `45c13d453136737f7084cb220f28dba9c506f6bc` |
| small | empty | `0fcc00835d597ee9a7ad90d575e0e5629af4ee58` |
| small | has value | `81f3d611fd57b8143663839dfbd8be4143de9fcb` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "password" / "password field" / "password input" | Medium, outline, empty → `1650f33a07899ce2da285c9cfb735da4028f76f0` |
| "small password" | Small, outline, empty → `0fcc00835d597ee9a7ad90d575e0e5629af4ee58` |

### Spec Example

```json
{
  "name": "Password Field",
  "type": "instance",
  "componentKey": "1650f33a07899ce2da285c9cfb735da4028f76f0"
}
```

---

## Color Picker (Color Input)

**Component Set Key**: `ec727f01845cd42d2c99b6146b23a06ac9e4e1e3` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **size** | `medium`, `small` | `small` |
| **style** | `outline`, `line (deprecated)` | `outline` |
| **state** | `empty`, `hover`, `active`, `has value`, `disable`, `error`, `has value disable` | `empty` |

> All VARIANT type only. For static mockups, use `style=outline`.

### Variant Key Lookup (style=outline)

| Size | State | Component Key |
|------|-------|--------------|
| medium | empty | `6e1cb258a4b5885fb8da26a0b08549348162a8d2` |
| medium | has value | `577a4196d4a091490c0d81f26c85ed663e380fd3` |
| small | empty | `3baac990776735c0554dc6d1eb534972cfca4a2a` |
| small | has value | `5641cd2eab49f6cf77c9c4bb0252dcb188cafefb` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "color picker" / "color input" / "color field" | Medium, outline, empty → `6e1cb258a4b5885fb8da26a0b08549348162a8d2` |
| "small color picker" | Small, outline, empty → `3baac990776735c0554dc6d1eb534972cfca4a2a` |

### Spec Example

```json
{
  "name": "Brand Color Picker",
  "type": "instance",
  "componentKey": "6e1cb258a4b5885fb8da26a0b08549348162a8d2"
}
```

---

## Range Input

**Component Set Key**: `25093e8d8f566461d33fc68b626025b00dccbe39` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **type** | `date`, `day and time`, `time` | `date` |
| **state** | `default`, `error` | `default` |

> Combines two date/time inputs side-by-side for range selection. Not a slider — see Slider for that.

### Variant Key Lookup

| Type | State | Component Key |
|------|-------|--------------|
| date | default | `85b6f368d579dafad7e42d0a67d98ffa796ddd76` |
| day and time | default | `04b05835cc189c06423fc31695fc0f114b17990c` |
| time | default | `59e105080f8b95d497f595438914c2eee450974a` |
| date | error | `8bab603c3f984be8de372d2af0070da15d547c5b` |
| time | error | `94a955adf7ff0eaeb7730fad0ff85b027c878b4a` |
| day and time | error | `6c145b86ae696b64f4256dfb275fb0d4b385133c` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "date range" / "date range picker" | Date, default → `85b6f368d579dafad7e42d0a67d98ffa796ddd76` |
| "time range" | Time, default → `59e105080f8b95d497f595438914c2eee450974a` |
| "date time range" | Day and time, default → `04b05835cc189c06423fc31695fc0f114b17990c` |

### Spec Example

```json
{
  "name": "Booking Date Range",
  "type": "instance",
  "componentKey": "85b6f368d579dafad7e42d0a67d98ffa796ddd76"
}
```

---

## Phone Number (Select / Phone Number)

**Component Set Key**: `9ea0add1ecca6e08ead6a0df79befb35f7f6a60a` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **selected** | `yes`, `no` | `yes` |
| **state** | `default`, `hover`, `active` | `default` |
| **size** | `medium`, `small` | `medium` |

### Component Properties (non-VARIANT)

| Property | Type | Default |
|----------|------|---------|
| `phone number#44823:0` | TEXT | `(000) 000-0000` |

> Override phone number text: `instanceOverrides: [{ childName: "phone number", characters: "(555) 123-4567" }]`

### Variant Key Lookup (state=default)

| Selected | Size | Component Key |
|----------|------|--------------|
| yes | medium | `5f1d52670598f72e96d6c15a5dd2429e587fefd5` |
| yes | small | `27cae631ed524288064f66c09cb941cf66b1b0ed` |
| no | medium | `eb19723d2562f13e1e00cdce92899f515df69b2f` |
| no | small | `bbf4f41ae417f5b4c2d0f18f4aecb5187866c7bc` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "phone number" / "phone input" / "phone field" | Selected=yes, medium → `5f1d52670598f72e96d6c15a5dd2429e587fefd5` |
| "small phone number" | Selected=yes, small → `27cae631ed524288064f66c09cb941cf66b1b0ed` |

### Spec Example

```json
{
  "name": "Phone Number Field",
  "type": "instance",
  "componentKey": "5f1d52670598f72e96d6c15a5dd2429e587fefd5",
  "instanceOverrides": [
    { "childName": "phone number", "characters": "(555) 123-4567" }
  ]
}
```

---

## Multiline Text Fields

**Component Set Key**: `fa38f64ef9a6749ea0af2ad59376ff0d11a334a9` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `empty`, `hover`, `active`, `has value`, `disabled`, `empty error`, `has value error` | `empty` |
| **style** | `required`, `Required`, `line (deprecated)` | `required` |

> `required` and `Required` are outline-style variants (naming inconsistency in the library). Use lowercase `required` as default. `line (deprecated)` is legacy.

### Variant Key Lookup (style=required)

| State | Component Key |
|-------|--------------|
| empty | `6b45995df0df1e45ceaa5555d5b63ee0fbe1de23` |
| has value | `d448e53b2176b4b9aed08931b682aabb0d9647fd` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "textarea" / "multiline" / "multiline text" / "text area" | Empty → `6b45995df0df1e45ceaa5555d5b63ee0fbe1de23` |

### Spec Example

```json
{
  "name": "Notes Field",
  "type": "instance",
  "componentKey": "6b45995df0df1e45ceaa5555d5b63ee0fbe1de23"
}
```

---

## Select

**Component Set Key**: `b1800e160cef6e411fc6c1e3cf47e028bc19d8b5` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `empty`, `hover`, `active`, `has value`, `disabled`, `empty error`, `has value error`, `has value disabled` | `empty` |
| **size** | `medium`, `small` | `small` |
| **style** | `outlined`, `line (deprecated)` | `outlined` |
| **label** | `yes`, `no` | `yes` |
| **required** | `no`, `yes` | `no` |

> All VARIANT type only. For static mockups, use `style=outlined`, `required=no`.

### Variant Key Lookup (style=outlined, required=no)

**Medium size**

| State | Label | Component Key |
|-------|-------|--------------|
| empty | yes | `3a37212ceafbc372a24b44e6a9c601d7b0038725` |
| empty | no | `850a298e53d788b903a8c5ab43a401bb8f3326ac` |
| has value | yes | `952b4b43c9c50d5b65d8248ab87f75441ebccb79` |
| has value | no | `fd5f3589103204e54d262021988ffa74f0d2a780` |

**Small size**

| State | Label | Component Key |
|-------|-------|--------------|
| empty | yes | `46a417c69f0f8622a59e1e70d25f832e557a7b51` |
| empty | no | `473ae78649be21fead3c255679b7ace62dcfa9e8` |
| has value | yes | `1215afcd3e81bd84b2adb695f2727c9c2eb73101` |
| has value | no | `e8a48bae44a65209ba97359fb799c7cf145948fd` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "select" / "dropdown" / "select field" | Medium, outlined, empty, label=yes → `3a37212ceafbc372a24b44e6a9c601d7b0038725` |
| "small select" | Small, outlined, empty, label=yes → `46a417c69f0f8622a59e1e70d25f832e557a7b51` |
| "select no label" | Medium, outlined, empty, label=no → `850a298e53d788b903a8c5ab43a401bb8f3326ac` |

### Spec Example

```json
{
  "name": "Country Select",
  "type": "instance",
  "componentKey": "3a37212ceafbc372a24b44e6a9c601d7b0038725"
}
```

---

## Autocomplete

**Component Set Key**: `2485e57afb67c00890d60582ce6ba20d2ff1e4c6` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `default`, `hover`, `active`, `error`, `error active`, `disabled` | `default` |
| **has value** | `false`, `true` | `false` |
| **multiple values** | `false`, `true` | `false` |
| **free solo** | `false`, `true` | `false` |
| **size** | `small`, `medium` | `small` |

### Component Properties (non-VARIANT)

| Property | Type | Default |
|----------|------|---------|
| `show start adornment#36838:0` | BOOLEAN | `false` |
| `input value#36898:16` | TEXT | `Input value` |
| `placeholder text#36898:48` | TEXT | `Placeholder text` |
| `start adornment#36898:95` | INSTANCE_SWAP | (icon) |
| `show menu#36943:0` | BOOLEAN | `false` |
| `input label#37114:0` | TEXT | `Label` |

> Override text: `instanceOverrides: [{ childName: "input label", characters: "Search..." }, { childName: "placeholder text", characters: "Type to search" }]`

### Variant Key Lookup (state=default)

**Single value, no free solo**

| Has Value | Size | Component Key |
|-----------|------|--------------|
| false | small | `514b08240e38811104e20e3bc91d43bb235ef7bd` |
| false | medium | `6a525d86a5460479099dde0c2a7b4767ec117d3e` |
| true | small | `1e4cc05a52c86c5c094ef17d5dd26933f52b8422` |
| true | medium | `91f70d74c288df0ed2e59e2255980f36ed372fa9` |

**Single value, free solo**

| Has Value | Size | Component Key |
|-----------|------|--------------|
| false | small | `f24b75a847d6be29245c47e351f34d0671057ced` |
| false | medium | `4b4d91d9ad2aab289a275a3b9f7ff4d611244170` |
| true | small | `41adccef24f34c9d9de8520bb1a4b33286d92d2d` |
| true | medium | `f590055184cb3579b50ca1e24a7736c6d0fc1e63` |

**Multiple values, no free solo**

| Size | Component Key |
|------|--------------|
| small | `cde36f218f6471b1a2de6fdb29734e0bc8d12e9d` |
| medium | `0ca4e730338e375cdf032bf028b265c2521f1abb` |

**Multiple values, free solo**

| Size | Component Key |
|------|--------------|
| small | `dca40b8d02b3ae998a00fe06c74a28e8f0cce3be` |
| medium | `fef1036c59ba8177ad22b40480ad1a5c0034b60b` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "autocomplete" / "combobox" / "search select" | Small, default, no value, single, no free solo → `514b08240e38811104e20e3bc91d43bb235ef7bd` |
| "medium autocomplete" | Medium, default, no value → `6a525d86a5460479099dde0c2a7b4767ec117d3e` |
| "multi autocomplete" / "tag input" | Small, default, multiple values → `cde36f218f6471b1a2de6fdb29734e0bc8d12e9d` |
| "free solo autocomplete" | Small, default, free solo → `f24b75a847d6be29245c47e351f34d0671057ced` |

### Spec Example

```json
{
  "name": "Tag Autocomplete",
  "type": "instance",
  "componentKey": "514b08240e38811104e20e3bc91d43bb235ef7bd",
  "instanceOverrides": [
    { "childName": "input label", "characters": "Tags" },
    { "childName": "placeholder text", "characters": "Search tags..." }
  ]
}
```

---

## Upload

**Component Set Key**: `cc7595fa6460213f4cd536cbda7d6826ba2acaa0` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **type** | `logo upload`, `drag and drop` | `logo upload` |
| **state** | `default`, `error`, `loading`, `has value`, `active` | `default` |

> All VARIANT type only.

### Variant Key Lookup

| Type | State | Component Key |
|------|-------|--------------|
| logo upload | default | `626c7d66123e1489ea494bd509bc413602bbd6e0` |
| logo upload | has value | `25fdd0e7de7657e36817bff79f6181967f9ab751` |
| drag and drop | default | `bfc8726370204ecdf3de4cbbd640ea94623fbbd7` |
| drag and drop | has value | `fe1912a3d8fe20d743f76f90390dcb19f605ce19` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "upload" / "file upload" / "drag and drop" | Drag and drop, default → `bfc8726370204ecdf3de4cbbd640ea94623fbbd7` |
| "logo upload" / "image upload" | Logo upload, default → `626c7d66123e1489ea494bd509bc413602bbd6e0` |

### Spec Example

```json
{
  "name": "File Upload Zone",
  "type": "instance",
  "componentKey": "bfc8726370204ecdf3de4cbbd640ea94623fbbd7"
}
```

---

## Selectable List Cards (List Item)

**Component Set Key**: `e475e984fe23d09b8f4f207b1b3019a4da49781b` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **Card type** | `Outlined`, `Elevated` | `Outlined` |
| **Style** | `one line`, `two line`, `three line` | `one line` |
| **State** | `default`, `selected`, `hover`, `focus` | `default` |
| **Select** | `single`, `multi`, `on/off` | `single` |

> All VARIANT type only. For static mockups, use `State=default`.

### Variant Key Lookup (State=default, Outlined)

| Style | Select | Component Key |
|-------|--------|--------------|
| one line | single | `b9a2bce424a4cd28e4fe827834e2870acf6935a3` |
| two line | single | `2845ecd95a19434a2cdc4f013253813dd5f8c6e6` |
| three line | single | `c2996b37cc9f2f28e80b98892371ef9779b6c1e3` |
| one line | multi | (not available — use two line or elevated) |
| two line | multi | `7678f70350135e00c3d42598739b9ed69d997ffd` |
| three line | multi | `39c5af71d55d947f358fd22d7b1f689947a72bd8` |
| one line | on/off | `f62f51dd5683156bcfe2a4f550890bd0bec8a271` |
| two line | on/off | `fcb6d6050f6fc885de82d5ebd9048380a67f9b52` |
| three line | on/off | `e950b184319c5c95dcbd3bce2df829b0b69fd13c` |

### Variant Key Lookup (State=default, Elevated)

| Style | Select | Component Key |
|-------|--------|--------------|
| one line | single | `5662d2b3e29c7f05d92009aa3f2b8c909e34ae16` |
| two line | single | `92f0d2a4955fa7afac142683bf093a7251dcbe6a` |
| three line | single | `fd056f9efce0ccdef6f19990d395d47d2414e699` |
| one line | multi | `8087fdcf0e4b8cafa78f6a104d3bc4da43ca44cc` |
| two line | multi | `f7b9fcf7d1bc95186c519e6d66b86cfa2d483d73` |
| three line | multi | `b38935e2f1768c11a470379a9797bdbd9103738c` |
| one line | on/off | `da9906d0f3668200860305f6bb578ff5e0a33812` |
| two line | on/off | `8574482e53fae2afdf11a332d42f2d6fda3e31ec` |
| three line | on/off | `3294815b28381422ce015b5c3cfc164df010f0bc` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "list card" / "selectable card" / "list item" | Outlined, one line, single → `b9a2bce424a4cd28e4fe827834e2870acf6935a3` |
| "multi select list" / "checklist card" | Outlined, two line, multi → `7678f70350135e00c3d42598739b9ed69d997ffd` |
| "toggle list" / "on/off list" | Outlined, one line, on/off → `f62f51dd5683156bcfe2a4f550890bd0bec8a271` |
| "elevated card" | Elevated, one line, single → `5662d2b3e29c7f05d92009aa3f2b8c909e34ae16` |

### Spec Example

```json
{
  "name": "Plan Selection Card",
  "type": "instance",
  "componentKey": "b9a2bce424a4cd28e4fe827834e2870acf6935a3"
}
```

---

---

## Quark 2 Tokens

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

<!-- ============================================================ -->
<!-- BRIDGE_INSTRUCTIONS_END                                       -->
<!-- ============================================================ -->
