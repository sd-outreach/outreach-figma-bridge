---
name: 'Figma Tool Usage Rules'
description: '[MANAGED — DO NOT EDIT] Rules for Figma MCP tool usage — velocity & quality (design-system agnostic)'
applyTo: '**'
---

<!-- ============================================================
     THIS FILE IS MANAGED BY THE OUTREACH FIGMA MCP BRIDGE.
     DO NOT EDIT — your changes will be overwritten on next setup.
     To customize design system behavior, edit design-system-config.mdc instead.
     ============================================================ -->

## Figma Tool Usage Rules

These rules govern **how to use the Figma MCP bridge tools**. They are design-system agnostic — for which colors, fonts, spacing, and components to use, see `design-system-config.mdc`.

> **MODE GATE: Before executing ANY design operation, read `design-system-config.mdc` to determine the active mode (`library`, `tokens`, `custom`, `create`, or `none`). The active mode is declared in `## Current Mode:` at the top of that file. Rules in this file that are marked with a mode condition (e.g. "only in `custom` mode") MUST be skipped if that mode is not active. When the active mode is `library` or `tokens`, you MUST NOT use token-file-based workflows (`setup_design_tokens`, hardcoded RGB values). When the active mode is `library`, you MUST use library component instances where they exist. When the active mode is `create`, you are authoring the DS itself — see Section T below for the authoring workflow. See the MODE ENFORCEMENT section in `design-system-config.mdc` for the full list of prohibitions.**
>
> **AUDIT EXCEPTION: The `design_system_audit` prompt is EXEMPT from the MODE GATE. When running a design system audit, do NOT read `design-system-config.mdc`, do NOT check library packages or resolved variables, do NOT reference any component key mapping or token file, and do NOT follow any mode-specific rules from this file. The audit fetches ALL data directly from the connected Figma file via live MCP calls. The only rule from this file that still applies during an audit is RULE ZERO (Connection Gate) — the Figma connection must be verified before making MCP calls.**

### RULE ZERO — Connection Gate (MANDATORY before any Figma tool call)

> **This is a hard gate. NEVER call any Figma tool (build, read, modify, inspect — anything) until BOTH conditions below are confirmed. There are ZERO exceptions.**

#### When the gate applies

The gate applies **only when you are about to call a Figma tool** — i.e., when you are about to execute an action that talks to Figma. This includes **all** MCP tools registered by the Figma bridge (build, read, inspect, modify, scan, etc.).

#### When the gate does NOT apply

- **Plan mode / discussion / brainstorming**: If the user is asking questions, planning a design, discussing approaches, reviewing specs, or working in plan mode — you do NOT need to run the gate. You can freely discuss, plan, and draft specs without a Figma connection.
- **Non-Figma work**: Editing code, reading files, running commands, or any task that doesn't involve calling a Figma MCP tool.
- **Spec drafting**: Writing or editing `.cursor/specs/*.json` files is pure file work — no gate needed. The gate is only needed when you **build** the spec in Figma.

#### Gate procedure

**Before your first Figma tool call in a conversation**, perform these two checks in order:

1. **Call `verify_workspace_setup`** with the absolute path to the workspace root.
   - **SETUP INCOMPLETE** → **FULL STOP.** Tell the user:
     > "Workspace rules are not installed. Please run:
     > ```
     > cd <project-directory>
     > node ~/outreach-figma-bridge/setup.js
     > ```
     > Then restart your editor and try again."
   - **SETUP VERIFIED** → Continue to step 2.

2. **Call `check_health`** to confirm the MCP server is listening AND a Figma plugin is connected.
   - **CONNECTION HEALTHY** → Gate passed. You may now proceed with design operations.
   - **ANY other result** → **FULL STOP.** Do the following:
     1. **Tell the user exactly what is wrong** (quote the check_health output).
     2. **Tell the user what to fix** — be specific:
        - If the server is not running: "Restart your editor."
        - If no Figma plugin is connected: "Open Figma, run Plugins → Outreach Figma MCP Bridge, and wait for the Connected indicator."
        - If ports are all occupied: "Close another editor or restart this one."
     3. **Call `wait_for_connection`** to block until the issue is resolved. This tool polls every 3 seconds (default timeout: 120s) and returns **CONNECTION READY** once both the server and plugin are connected.
     4. **If `wait_for_connection` returns CONNECTION TIMEOUT**: Tell the user the connection is still not ready, repeat the fix instructions, and ask them to say "check again" or "retry" when they've fixed it. **Do NOT proceed.**
     5. **If `wait_for_connection` returns CONNECTION READY**: Gate passed. Proceed with design operations.

#### Enforcement rules

- The gate triggers **once per conversation**, the first time you are about to call a Figma tool. After it passes, you do not need to re-run it for subsequent tool calls in the same conversation.
- If the gate fails, you MUST NOT call **any** Figma tool: no `scan_page`, no `get_node_by_id`, no `build_from_spec`, no `read_my_design`, no `find_nodes_by_name` — nothing. The only Figma-related tools you may call are `verify_workspace_setup`, `check_health`, and `wait_for_connection`.
- You CAN still discuss, plan, draft specs, edit code, or do anything that doesn't require calling a Figma tool.
- If the user says "check again", "retry", "try now", or similar after a gate failure, call `check_health` (or `wait_for_connection`) again. Only proceed if it returns healthy.
- If a Figma tool call fails mid-conversation with a connection error, call `check_health` to re-verify before continuing.

### A. Atomic Building (highest-velocity path)

> **IMPORTANT: All specs must go through the interactive spec workflow defined in `interactive-specs.mdc`.** Every spec is saved to `.cursor/specs/<name>.json`, validated, and communicated to the user before building. See `interactive-specs.mdc` for the full save → validate → build → update cycle.

1. **Prefer `build_and_verify` over individual tool calls.** Construct the entire component tree as a single JSON spec and pass it in one call. This builds the tree, takes a screenshot, and runs structural validation — all atomically.
2. **Use `build_from_spec` when you don't need visual verification** (e.g. building intermediate pieces that will be verified later as part of a larger frame).
3. **Reserve individual tools** (`set_fill`, `set_font`, `set_corner_radius`, `move_node`, etc.) for **post-creation tweaks only** — never for building from scratch.
4. **In the spec, always set `autoLayout` on frames BEFORE listing `children`.** The plugin enforces correct ordering internally, but the spec must declare it.
5. **Use `layoutSizing: {"horizontal": "FILL"}` on children that should stretch** to fill their auto-layout parent.
5b. **Save every spec to disk before building.** This is mandatory — see `interactive-specs.mdc` rules T1–T4.

### B. Color & Token Discipline

6. **NEVER hardcode or guess color values.** In `library` or `tokens` mode, read variables/styles from the Figma library (or cache) — do NOT read or reference any token file. In `custom` mode, use the token file's exact values. In `create` mode, use or create variables/styles directly in the connected Figma file via live MCP calls. In `none` mode, use reasonable defaults or ask the user. **Always check `design-system-config.mdc` for the active mode first.**
7. **(`custom` mode ONLY)** If the active DS token file is loaded as a cursor rule, skip the `design-tokens` resource fetch — all values are already inline. Only fetch the resource if you need tokens not covered by the rule. **In `library` or `tokens` mode, do NOT fetch or reference any token file or design-tokens resource.**

### C. Typography

8. **Check `get_available_fonts` once at the start of a session**, not before every text node. In `library` or `tokens` mode, check the library package's `fonts` list first (see Section R). In `create` mode, call `get_available_fonts` live — do not use the package. Use the fonts specified by the active design system, or fall back to "Inter" if no DS is active.
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

### I. Canvas Placement — NEVER Stack Frames

> **MANDATORY: Every new root-level frame MUST be placed at a clear, non-overlapping position on the canvas. Stacking frames on top of each other is a rule violation.**

32. **Scan the canvas before every build.** Before calling `build_and_verify` or `build_from_spec` for a root-level frame, call `get_current_page` (or `scan_page` with depth 1) to get the positions and dimensions of all existing top-level frames. Use this information to compute a safe placement position.
33. **Always set explicit `x` and `y` on root-level specs.** Never omit `x`/`y` on the outermost frame in a spec — omitting them defaults to `(0, 0)`, which will overlap with existing content. Compute the position from the canvas scan in rule 32.
34. **Place new frames 100px to the right of the rightmost existing frame.** After scanning existing frames, calculate: `x = max(frame.x + frame.width for all existing frames) + 100`. Set `y` to `0` (or match the `y` of existing frames for visual alignment). If the canvas is empty, `(0, 0)` is fine.
35. **When rebuilding a design, delete the old frame FIRST, then build at the same position.** Read the old frame's `x` and `y` before deleting it, then use those coordinates for the replacement. This keeps the design in place and avoids stacking.
36. **Build each screen completely before starting the next** — don't interleave partial builds.
37. **For PRD-to-design flows**, identify all screens first, create a build plan, then execute sequentially with correct horizontal spacing per rule 34.

### J. Component Instances (individual tools)

38. **Use `get_local_components`** to discover available components before creating instances.
39. **Use `create_instance`** to instantiate existing components rather than rebuilding from scratch.
40. **Use `get_instance_overrides` → `set_instance_overrides`** to transfer overrides between instances efficiently.

### J2. Library Components in Specs (Instance Type)

41. **Use `type: "instance"` in specs to instantiate library or local components** directly within the atomic build process. This avoids rebuilding components from scratch when they already exist.
42. **For published library components**, use `componentKey` — the key from the Figma library. Get component keys from the library package's `componentKeys` (see Section R), or via `get_local_components` with `allPages: true` when scanning a library file.
43. **For local components**, use `componentId` — the node ID of a component on the current page or document.
44. **Apply overrides with `instanceOverrides`** — an array of `{childName, characters?, fillColor?, visible?}` objects. The builder searches for children by name within the instance and applies the overrides.
45. **Instance nodes cannot have `children`** — use `instanceOverrides` instead. The component's structure comes from the source component.
46. **Recommended workflow for library adoption**: (1) use `get_local_components` to discover available components, (2) use `type: "instance"` + `componentId` for local components, or `componentKey` for published library components, (3) use `instanceOverrides` to customize.

### K. Component Matching

47. **When a user says a component name** (e.g. "button", "card", "input"), check `design-system-config.mdc` for the current mode. In `library` mode, match the user's term against the component set names in the cache's `componentKeys` for the selected library — use your understanding of common synonyms (e.g. "modal" → Dialog, "toggle" → switch, "dropdown" → select). In `tokens` mode, build the component from scratch using library variables/styles (no component keys needed). In `custom` mode, use the token file's component specs. In `create` mode, discover existing components via `get_local_components` or create new ones per user instructions (see Section T). In `none` mode, use sensible defaults (e.g. a button is a rounded rectangle with text).

### L. Screen & Component Defaults

48. **Always set a background fill on root screen frames.** In `library` or `tokens` mode, bind the fill to a library background variable — do NOT hardcode RGB values or use token values. In `custom` mode, use the active DS background token from the token file. In `create` mode, use or create variables per user instructions. In `none` mode, use a light neutral like `{r:0.96, g:0.96, b:0.97}`.
49. **Use `component` type in specs** for any element that would be reused. Use `frame` only for one-off layout containers. **In `library` mode, prefer `type: "instance"` + `componentKey` over creating new components — only create `frame` for layout containers that have no library equivalent. In `tokens` mode, always use `frame` or `component` — never `type: "instance"`. In `create` mode, always use `type: "component"` — you are authoring the source (see Section T).**

### L2. Frame Hygiene — Fills & Clipping

49b. **Do NOT set `fill` on layout-only frames.** Frames used purely as auto-layout containers (e.g. grouping form fields, wrapping a row of elements, sectioning content) must have **no fill** in the spec. Only set `fill` on: (1) the root screen frame (rule 48), (2) frames that are visually intended as cards, surfaces, or panels with a distinct background, (3) decorative elements that need a visible color. The plugin automatically strips Figma's default white fill from frames that have no `fill` in the spec — no post-build cleanup is needed.
49c. **Do NOT set `clipContent: true` unless explicitly required.** Clipping should only be used when child content is intentionally designed to overflow and must be masked (e.g. image containers, scrollable regions, overflow-hidden cards). General layout frames, content sections, and even root screen frames should **not** clip content by default. The plugin defaults `clipsContent` to `false` — only set `clipContent: true` in the spec when you explicitly need clipping.

### L3. Form Field Labels — No Duplication (`library` mode)

> **Applies to `library` mode only.** In `library` mode, form field components from the library may already include their own label internally. Do NOT add a separate text node as a label above or beside these components if the component already has a built-in label — doing so duplicates the label and looks broken. Check the component's child structure or documentation to determine whether it includes a label.

49d. **Do NOT add an explicit label text node for library form field instances.** The following library components have a built-in label and must NOT be wrapped with an external label:
- **Text Field** (all variants — with label, without label, with helper text, etc.)
- **Select** / Dropdown
- **Autocomplete**
- **Password field**
- **Number field**
- **Date picker** / Date field
- **Textarea** / Multiline input
- Any other input component from the library that visually includes a label

49e. **To set the label text, use `instanceOverrides`** on the label child inside the component instance — do not create a sibling text node. For example:
```json
{
  "name": "Email Input",
  "type": "instance",
  "componentKey": "<from cache componentKeys>",
  "instanceOverrides": [
    {"childName": "Label text", "characters": "Email address"}
  ]
}
```

49f. **If a form section needs a heading** (e.g. "Personal Information" above a group of fields), that is a section title — not a field label. Section titles are separate text nodes and are fine to include. The rule only prohibits duplicating individual field labels.

### M. Design Tokens / Variables

> **MODE GATE: Rules 51–55 apply in `custom`, `create`, or `none` mode. In `library` or `tokens` mode, do NOT create variable collections, batch-create variables, or set up design tokens. Use the library package and resolved variables (Section R) to READ existing library variables only. In `create` mode, all variable CRUD is unrestricted — you are authoring the DS. See also Section I (rules 32–35) for mandatory canvas placement rules.**

50. **Use `get_local_variables`** to explore the file's token system (colors, spacing, etc.) before making assumptions. **In `library` or `tokens` mode, prefer reading from the library package and resolved variables (Section R) first. Only call `get_local_variables` if the resolution file does not exist. Do NOT create new variables in these modes.**
51. **(`custom`/`create`/`none` mode ONLY)** Use `create_variable_collection` to set up token groups (e.g. "Brand Colors" with "Light" and "Dark" modes).
52. **(`custom`/`create`/`none` mode ONLY)** Use `batch_create_variables` when adding 3+ variables — it's 10-50x faster than individual `create_variable` calls.
53. **(`custom`/`create`/`none` mode ONLY)** Use `batch_update_variables` when updating 3+ variable values across modes.
54. **(`custom`/`create`/`none` mode ONLY)** For COLOR variables, accept both hex strings (`"#5E5EAF"`) and RGB objects (`{r: 0.369, g: 0.369, b: 0.686}`). Use `"VariableID:..."` strings to create variable aliases.
55. **Cap batch operations at 100 items** per call. Split larger sets into multiple batches.

### M2. Variable Binding in Specs

> **MODE NOTE:** In `library` or `tokens` mode, variable IDs come from the library data cache or `get_local_variables` (which imports library variables). Do NOT call `setup_design_tokens` — that is for `custom` and `create` modes only.

56. **Bind fills to variables using `fillVariable`** in the spec. **In `library` or `tokens` mode:** get variable IDs from the resolved variables file (Section R), then use `fillVariable: "VariableID:..."`. **In `custom` mode:** workflow is (1) `setup_design_tokens` to create variables, (2) note the returned variable IDs, (3) use `fillVariable: "VariableID:..."` in spec nodes alongside the `fill` RGB value.
57. **Bind strokes to variables using `strokeVariable`**. Same pattern as fills — set `stroke` with the raw color, plus `strokeVariable` to bind.
58. **Bind text colors to variables using `textFillVariable`** on text nodes. Works alongside the `fill` property.
59. **Always provide both the raw color AND the variable ID.** The raw color is the fallback/initial value; the variable binding adds theme awareness. If the variable cannot be resolved at build time, the raw color is preserved.

### M3. Library Variable Import

59b. **In `library` or `tokens` mode, `get_local_variables` auto-imports all library variables.** When `includeLibrary` is true (the default), the tool calls `figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()` and imports every variable via `importVariableByKeyAsync`. The imported variable IDs are returned under `libraryVariables` and can be used directly with `fillVariable`/`strokeVariable`/`textFillVariable`.
59c. **At the start of a `library` or `tokens` mode session, check the library package and resolved variables first** (see Section R). If both exist, use them — do NOT call `get_local_variables`. Only call `get_local_variables` if the resolution file is missing.

### M4. Style Binding in Specs

59d. **Bind library styles using style keys** in the spec. The spec supports `fillStyleKey`, `strokeStyleKey`, `textStyleKey`, and `effectStyleKey`. Each imports a published library style by key and applies it to the node.
59e. **Use `get_node_styles`** to discover style keys from library component instances. Workflow: (1) `create_instance` of a library component, (2) `get_node_styles` on it to extract all paint/text/effect style keys, (3) use those keys in specs, (4) remove the temporary instance (rule 68). **In `library` or `tokens` mode, check the library package first (Section R) — style keys are pre-packaged, avoiding this workflow entirely.**
59f. **Style binding overrides manual properties.** When a `textStyleKey` is applied, it sets font family, size, style, etc. from the style definition — any manually specified font properties on that node are replaced.
59g. **In `library` or `tokens` mode, prefer style keys over manual font/color properties.** Never hardcode `fontFamily`/`fontSize`/`fontStyle` or `fill` RGB values when a library style exists for that purpose.

### N. Console Debugging

60. **Use `get_console_logs`** to retrieve captured console output from the Figma plugin. Supports filtering by `level` (log/info/warn/error/debug) and `since` (timestamp for polling).
61. **Use `clear_console_logs`** before a specific test to isolate relevant output.
62. **Console capture is automatic** — no setup required. All `console.log/info/warn/error/debug` calls in the plugin sandbox are intercepted and buffered (up to 500 entries per file).

### O. Component Sets & Variants

63. **Use `arrange_component_set`** to combine multiple component nodes into a proper Figma variant set (ComponentSetNode). Components must follow the naming convention `Property=Value, Property2=Value2`.
64. **Use `get_component_set_info`** to inspect variant axes, individual variants, and property definitions before creating instances.

### P. Design-Code Parity

65. **Use `check_design_parity`** to compare a Figma node's visual properties against a code spec. The AI should extract code properties into the codeSpec JSON format and pass them to the tool.
66. **Use the `design_code_parity` prompt** for a guided workflow: read the Figma design, extract code properties, run the check, and generate fix recommendations.
67. **Interpret scores**: 90-100 = PASS, 70-89 = NEEDS_REVIEW, below 70 = FAIL. Focus on critical issues first (colors, fonts), then warnings (spacing, radius).

### Q. Canvas Hygiene — Clean Up After Yourself

68. **Always delete temporary nodes after use.** Any node created for system/AI purposes — style discovery instances, test frames, probing components, scratch builds — must be removed from the canvas immediately after extracting the needed information. Use `delete_multiple_nodes` to batch-remove them. The user's canvas must never contain leftover AI artifacts.
69. **Delete superseded builds.** When rebuilding a screen (e.g. fixing fills, correcting layout), delete the old version(s) after confirming the new build is correct. Do not leave duplicate or stale frames on the canvas.
70. **Track node IDs of temporary creations.** When creating temporary nodes (e.g. `build_from_spec` for style discovery), immediately note the returned `rootNodeId` and delete it as soon as the information is extracted — within the same logical operation, not deferred to later.

### R. Library Package Loading

> **Applies to `library` and `tokens` modes only.** `custom`, `create`, and `none` modes do not use library packages. Library packages are **pre-built, tested, versioned artifacts** distributed with the bridge — they are NOT generated at runtime.

71. **Check the library package before calling Figma.** On the first design operation in a session, check if `.cursor/libraries/<library-name>/library.json` exists. If it does, read it and use the package data for all subsequent operations. Do NOT call `discover_libraries`, `get_local_components`, `get_local_styles`, or `get_available_fonts` from Figma when the package is available.
72. **Resolve variable IDs when missing.** If `.cursor/cache/resolved-variables.json` does not exist (or references a different library version):
    1. Call `get_local_variables` with `includeLibrary: true` to import library variables and get their file-local IDs.
    2. Map variable names from the library package to the returned variable IDs.
    3. Write the result to `.cursor/cache/resolved-variables.json`. This is the only runtime step.
73. **If the library package is missing**, inform the user: "Library package not found in `.cursor/libraries/`. Please run `setup.js` to install it, or fall back to runtime discovery." If the user opts for runtime discovery, use the legacy flow: call `discover_libraries`, scan the library, and build a package.
74. **Never refetch within a session.** Once the package has been read and variables resolved, use that data for the remainder of the session. Do not re-read the package or re-resolve variables unless explicitly requested.
75. **Manual re-resolution.** When the user says "refresh variables", "re-resolve", or similar, delete `.cursor/cache/resolved-variables.json` and re-run the resolution flow (rule 72). The library package itself is never modified at runtime — only the resolution file is regenerated.
76. **Use `variables` for variable lookup.** When building specs, look up variable names in the package's `variables` section to find keys, then look up the corresponding file-local IDs in `resolved-variables.json`.
77. **Use `styleKeys` for fast style resolution.** When applying text styles, look up the key by style name in the package's `styleKeys.textStyles`. Same pattern for `paintStyles` and `effectStyles`.

### R2. Component & Usage Notes Lookup

> **Applies to `library` mode only.** Component keys and usage notes are stored in the library package.

78. **Use `componentKeys` for component lookup.** When building specs, look up the component set by name in the package's `componentKeys`, then find the variant key matching the desired property combination.
79. **Use `usageNotes` for intelligent component configuration.** Before instantiating a component, check the package's `usageNotes` for that component. Apply the appropriate `context_rules` — hide unnecessary children, show relevant ones, override text with contextually appropriate values. Never use a component "as-is" with all default decorations visible.
80. **Use `globalRules` for override guidance.** Check `globalRules.override_gotchas` for known issues with specific components (e.g., duplicate child names). Use path syntax (`"Parent > Child"`) in `instanceOverrides` when child names are ambiguous.
81. **Package data is immutable at runtime.** Component keys, style keys, usage notes, and global rules are authored and tested before distribution. They are never modified by the AI during design operations. If a component key is wrong or a usage note is outdated, the fix goes in the source package, not at runtime.

### S. Semantic Token Usage

> **Applies to `library` and `tokens` modes.** Always select the most semantically specific variable for the UI context. Never use a generic/primitive token when a purpose-built semantic token exists. The variable names below are examples — actual names depend on the specific library in use.

84. **Match tokens to UI purpose, not visual appearance.** Even if two tokens resolve to the same color in light mode, they may diverge in dark mode or future themes. Using the semantically correct token ensures designs remain theme-aware.

85. **Semantic token mapping guidelines — use the right variable for each UI element.** Look for variables in the library cache that match these semantic purposes:

| UI Element | Look for variables containing | Avoid |
|---|---|---|
| Page/screen background | `background-default`, `bg-default` | — |
| Card, dialog, elevated surface | `background-paper`, `bg-surface` | generic white variables |
| Alternate surface (sidebar, panel) | `background-paperAlt`, `bg-alt` | primary background |
| Input field background | `background-input`, `bg-input` | surface/paper variables |
| Headings, labels, primary body text | `text-primary`, `text-default` | generic black variables |
| Secondary descriptions, captions | `text-secondary` | `text-primary` |
| Placeholder/hint text in inputs | `text-hint`, `text-placeholder` | `text-secondary` |
| Clickable text links | `text-link`, `link` | primary color variables |
| Disabled text | `text-disabled` | hint/placeholder variables |
| Input/form field border (resting) | `border-default` | divider variables |
| Input border (focused/active) | `border-active`, `border-focus` | primary color variables |
| Primary filled button background | `primary-main`, `primary` | — |
| Text on primary-colored surface | `primary-contrastText`, `on-primary` | generic white variables |
| Divider/separator lines | `divider`, `separator` | border variables |

86. **Key anti-patterns — NEVER do these:**
- Do NOT use primary color variables for text link colors — use a dedicated text-link variable.
- Do NOT use secondary text variables for placeholder text — use a dedicated hint/placeholder variable.
- Do NOT use surface/paper variables for input field fills — use a dedicated input background variable.
- Do NOT use primary color variables for any text fill — they are for interactive surface fills. Text on those surfaces uses a contrast-text variable.
- Do NOT use border variables for divider lines between sections — use a dedicated divider variable.
- Do NOT use action/state tokens for static elements — action tokens are for interactive state feedback.

87. **When in doubt, prefer specificity.** If a semantic token exists that exactly describes the element's purpose, always use it over a broader token, even if both resolve to the same color today.

### T. Design System Authoring (`create` mode)

> **Applies to `create` mode only.** In this mode, the connected Figma file IS the library. You are authoring the design system, not consuming it. There is no cache, no component key mapping, and no token file — all data is live from/to Figma.

88. **Discover before modifying.** Before creating or updating any DS element, call the appropriate read tool to understand what already exists:
    - `get_local_variables` for variables and collections
    - `get_local_styles` for paint, text, and effect styles
    - `get_local_components` for components and component sets
    Avoid creating duplicates. If something already exists, update it rather than creating a new one.

89. **Variable CRUD is fully available.** Use `create_variable_collection`, `create_variable`, `batch_create_variables`, `update_variable`, `rename_variable`, `delete_variable`, `delete_variable_collection`, `add_mode`, `rename_mode`, and `setup_design_tokens` as needed. No restrictions.

90. **Style CRUD is fully available.** Use `create_paint_style`, `create_text_style`, `create_effect_style` to create styles. Use `update_paint_style`, `update_text_style`, `update_effect_style` to modify existing styles. Use `rename_style` and `delete_style` for renaming and removal. Use `apply_style` to apply a style to a node.

91. **Build components with `type: "component"` in specs.** You are authoring the source components, not instantiating them. Never use `type: "instance"` or `componentKey` in `create` mode — those are for consuming a published library.

92. **Use `arrange_component_set`** to combine multiple component nodes into a proper Figma variant set. Components must follow the naming convention `Property=Value, Property2=Value2`.

93. **No cache, no config files.** Do NOT read `.cursor/cache/library-data.json` or any component mapping/token file. All data comes from live Figma MCP calls.

94. **Follow the user's instructions for structure and naming.** The user decides naming conventions, organizational hierarchy, and values. Do not impose defaults or opinionated conventions unless explicitly asked.
