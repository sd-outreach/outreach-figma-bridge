# Library Packages

This directory contains **pre-built, tested, versioned design system library packages**. Each subdirectory represents one Figma design system library.

## Why Packages Instead of Caching?

Previously, library data (variables, styles, component keys) was cached at runtime by the AI after scanning the Figma library. This had several problems:
- **Cache refresh destroyed usage notes** — hand-crafted component intelligence was wiped on rebuild.
- **No testing** — cached data was never verified before use.
- **No versioning** — no way to know if the cache matched the library version.
- **Inconsistency** — every consumer generated slightly different cache data.

Library packages solve all of this. The data is **authored, tested, and published** as a versioned artifact.

## Directory Structure

```
.cursor/libraries/
├── README.md                        # This file
├── <library-name>/
│   ├── library.json                 # The library package (see schema below)
│   └── README.md                    # Optional: notes about this library
└── <another-library>/
    └── library.json
```

## Library Package Schema (`library.json`)

```jsonc
{
  // ---- Package Metadata ----
  "name": "My Design System",                  // Library display name
  "version": "1.0.0",                          // Semantic version of this package
  "figmaLibraryKey": "abc123...",              // Figma library file key (for integrity)
  "generatedAt": "2026-02-12T10:30:00Z",      // When this package was built
  "bridgeVersion": "1.8.2",                    // Bridge version used to generate

  // ---- Component Keys (stable across files) ----
  "componentKeys": {
    "Button": {
      "componentSetKey": "abc123...",
      "variants": {
        "Style=Primary, Size=Medium, State=Default": "componentKeyHere",
        "Style=Secondary, Size=Medium, State=Default": "componentKeyHere"
      }
    },
    "Input": {
      "componentSetKey": "def456...",
      "variants": {
        "Type=Default": "componentKeyHere"
      }
    }
  },

  // ---- Style Keys (stable across files) ----
  "styleKeys": {
    "textStyles": {
      "Heading/H1": "styleKeyHere",
      "Body/Body 1": "styleKeyHere"
    },
    "paintStyles": {},
    "effectStyles": {}
  },

  // ---- Variable Names & Keys (stable — IDs resolved at runtime) ----
  "variables": {
    "primary/main":      { "key": "variableKeyHere", "collection": "Colors", "type": "COLOR" },
    "text/primary":      { "key": "variableKeyHere", "collection": "Colors", "type": "COLOR" },
    "background/default": { "key": "variableKeyHere", "collection": "Colors", "type": "COLOR" }
  },

  // ---- Usage Notes (human-authored component intelligence) ----
  "usageNotes": {
    "_description": "Contextual guidance for intelligent component usage.",
    "Input": {
      "variants": {
        "Type=Default": {
          "description": "Full-featured input with all optional decorations",
          "when_to_use": "Complex input scenarios",
          "children": {},
          "context_rules": {
            "simple_text_field": {
              "description": "Name, email, generic text input",
              "hide": ["flag", "badge", "dropdown-arrow", "⌘K"],
              "show": ["Label", "Supporting text"]
            }
          },
          "default_recommendation": "For standard form fields, use simple_text_field context"
        }
      }
    }
  },

  // ---- Global Rules (anti-patterns, override gotchas) ----
  "globalRules": {
    "principle": "Always configure components for their specific UI context.",
    "decision_flow": [],
    "anti_patterns": [],
    "override_gotchas": {}
  },

  // ---- Fonts ----
  "fonts": ["Inter", "Roboto"]
}
```

## Workflow

### Creating a Library Package

1. Open the Figma library file in Figma
2. Connect the MCP bridge
3. Scan components: `get_local_components` with `allPages: true`
4. Scan styles: `get_local_styles`
5. Scan variables: `get_local_variables`
6. Author usage notes (test components, document context rules)
7. Save as `.cursor/libraries/<library-name>/library.json`
8. Test: build sample screens to verify keys and overrides work

### Consuming a Library Package

When the bridge is set up in a project:
1. `setup.js` copies `.cursor/libraries/` to the consumer project's `.cursor/libraries/`
2. The AI reads `.cursor/libraries/<name>/library.json` for all design decisions
3. Variable IDs are resolved once at runtime and cached in `.cursor/cache/resolved-variables.json`

### Updating

When the Figma library changes:
1. Re-scan the library to update component/style/variable keys
2. Verify usage notes still apply (check for renamed children, new variants)
3. Bump the package version
4. Redistribute via `setup.js`

## Runtime Variable Resolution

Variable keys in the package are **publish keys** (stable across files). But to bind variables in specs, the AI needs **file-local variable IDs** (e.g., `VariableID:abc/123:456`).

At the start of **every session**, the `resolve_library_variables` tool resolves variable keys to local IDs:
1. Reads the library package to get all variable names and keys
2. Calls `get_local_variables` with `includeLibrary: true` to import all library variables
3. Maps every variable name from the package → imported variable ID (by key first, then by name)
4. Writes the mapping to `.cursor/cache/resolved-variables.json`

Resolution always runs fresh — it never reuses a previous session's file. Variable IDs are file-local and can change when the user switches Figma files or the library is republished.
