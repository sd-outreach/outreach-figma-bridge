# Outreach Figma MCP Bridge

AI-powered Figma design through Cursor and VS Code. Build complete designs by describing them to your AI assistant — it handles the Figma work.

---

## Prerequisites

- **Node.js** >= 18 ([download](https://nodejs.org/))
- **Figma Desktop App** (required for the local WebSocket — the browser version won't work)
- **Cursor IDE** and/or **VS Code with GitHub Copilot**

---

## Setup (3 minutes)

### 1. Clone this repo (one-time)

```bash
git clone git@github.com:sd-outreach/outreach-figma-bridge.git ~/outreach-figma-bridge
```

### 2. Set up your project

From your project directory, run:

```bash
cd your-project
node ~/outreach-figma-bridge/setup.js
```

This single command:
- **Detects your editor(s)** (Cursor, VS Code, or both)
- **Registers the MCP server globally** — one entry in your editor config, shared across all projects
- **Copies design rules** into your project (`.cursor/rules/` for Cursor, `.github/instructions/` for VS Code)
- **Creates supporting directories** (`.cursor/specs/`, `.cursor/cache/`)

### 3. Restart your editor

Restart Cursor and/or VS Code so they pick up the new MCP server.

### 4. Install the Figma Plugin

1. Open any Figma file in the **Desktop App**
2. Go to **Plugins > Outreach Figma MCP Bridge** and run it
3. Wait for the "Connected" indicator in the plugin UI

> The plugin is published to the Outreach org. Search for "Outreach Figma MCP Bridge" in the Figma plugin browser, or ask your team lead for the install link.

### 5. Start designing

Ask the AI to create designs. The rules guide it automatically:

> "Design a login screen with email and password fields, a sign-in button, and a 'forgot password' link"

---

## Adding to another project

```bash
cd another-project
node ~/outreach-figma-bridge/setup.js
```

The MCP server is already registered globally — only the project rules get copied.

---

## Updating

When a new version is released:

```bash
cd ~/outreach-figma-bridge
git pull
```

Then in each project:

```bash
cd your-project
node ~/outreach-figma-bridge/setup.js
```

The setup script is version-aware:
- **Same version** — does nothing (fast no-op)
- **Newer version** — updates the MCP server config and project rules automatically

---

## How It Works

```
Your Editor (Cursor / VS Code)
  |  stdio (MCP protocol)
  v
MCP Server + WebSocket Bridge  (Node.js, runs locally)
  |  ws://localhost:3055
  v
Figma Plugin  (one per open file)
  |  Figma Plugin API
  v
Figma Canvas
```

The AI in your editor communicates with the MCP server via the Model Context Protocol. The server (`bin/server.js`) bridges commands over WebSocket to the Figma plugin, which executes them against the Figma API.

---

## What Gets Installed

### Global (shared across all projects)

| Location | What | Created by |
|----------|------|------------|
| `~/.cursor/mcp.json` | MCP server registration for Cursor | `setup.js` |
| `~/.vscode/mcp.json` | MCP server registration for VS Code | `setup.js` |

### Per-project

| Location | What | Created by |
|----------|------|------------|
| `.cursor/rules/*.mdc` | AI behavior rules (Cursor) | `setup.js` |
| `.cursor/specs/` | Spec validator + README | `setup.js` |
| `.cursor/cache/` | Library data cache (gitignored) | `setup.js` |
| `.github/instructions/*.instructions.md` | AI behavior rules (VS Code) | `setup.js` |
| `.bridge-version` | Version marker (gitignored) | `setup.js` |

---

## Design System Modes

The bridge supports four modes, configured in `.cursor/rules/design-system-config.mdc`:

| Mode | Description |
|------|-------------|
| **`library`** | Use components, variables, and styles from a published Figma library |
| **`tokens`** | Build components from scratch but use library variables/styles for visual values |
| **`custom`** | Build components from scratch using a design token file for all visual values |
| **`none`** | Greenfield — no library, sensible defaults |

The default mode after setup depends on your org's configuration.

---

## Troubleshooting

### "The Figma MCP Bridge rules are not installed"

The AI is telling you the workspace rules are missing. Run:

```bash
cd your-project
node ~/outreach-figma-bridge/setup.js
```

Then restart your editor.

### Plugin says "Disconnected"

Make sure:
1. You're using the **Figma Desktop App** (not the browser)
2. The MCP server is running (it starts automatically when your editor starts)
3. The port (3055) isn't being used by another process

### "No supported editor detected"

The setup script couldn't find `~/.cursor/` or `~/.vscode/`. Make sure you've launched your editor at least once before running setup.

### AI isn't following design rules

Check that the rules were copied:
- Cursor: `.cursor/rules/` should have 5 `.mdc` files
- VS Code: `.github/instructions/` should have 5 `.instructions.md` files

Re-run `node ~/outreach-figma-bridge/setup.js` to refresh them.

---

## Version

See the `VERSION` file for the current version.
