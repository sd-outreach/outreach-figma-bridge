#!/usr/bin/env node
// ============================================================
// Outreach Figma MCP Bridge — Setup Script
//
// Smart, version-aware, editor-detecting setup CLI.
// Registers the MCP server globally (Cursor + VS Code) and
// copies rules per-project.
//
// Usage:
//   node ~/outreach-figma-bridge/setup.js          (from a project dir)
//   node ~/outreach-figma-bridge/setup.js --help
// ============================================================

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

// ── Constants ──────────────────────────────────────────────────

const DIST_ROOT = path.dirname(__filename || process.argv[1]);
const VERSION_FILE = path.join(DIST_ROOT, "VERSION");
const SERVER_BIN = path.join(DIST_ROOT, "bin", "server.js");
const CURSOR_RULES_SRC = path.join(DIST_ROOT, "rules", "cursor");
const VSCODE_RULES_SRC = path.join(DIST_ROOT, "rules", "vscode");
const SPECS_SRC = path.join(DIST_ROOT, "specs");

const HOME = os.homedir();
const CURSOR_DIR = path.join(HOME, ".cursor");
const VSCODE_DIR = path.join(HOME, ".vscode");

const MCP_SERVER_NAME = "outreach-figma-bridge";
const BRIDGE_PORT = "3055";
const BRIDGE_VERSION_MARKER = ".bridge-version";

// ANSI color helpers
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

// ── Helpers ────────────────────────────────────────────────────

function log(msg) {
  console.log(msg);
}

function logStatus(label, status, detail) {
  const padded = label.padEnd(40);
  let color;
  switch (status) {
    case "installed":
    case "updated":
    case "copied":
      color = c.green;
      break;
    case "skipped":
    case "current":
      color = c.gray;
      break;
    case "not found":
    case "missing":
      color = c.yellow;
      break;
    case "error":
      color = c.red;
      break;
    default:
      color = c.reset;
  }
  const statusStr = `${color}${status}${c.reset}`;
  const detailStr = detail ? ` ${c.dim}(${detail})${c.reset}` : "";
  log(`  ${padded} ${statusStr}${detailStr}`);
}

function readVersion() {
  try {
    return fs.readFileSync(VERSION_FILE, "utf-8").trim();
  } catch {
    return "0.0.0";
  }
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function writeJsonFile(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const backup = filePath + ".backup";
    if (!fs.existsSync(backup)) {
      fs.copyFileSync(filePath, backup);
      return true;
    }
  }
  return false;
}

function copyDir(src, dest, fileFilter) {
  if (!fs.existsSync(src)) return [];
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const files = fs.readdirSync(src);
  const copied = [];
  for (const file of files) {
    if (fileFilter && !fileFilter(file)) continue;
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
    copied.push(file);
  }
  return copied;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return true;
  }
  return false;
}

function isDistRepo(dir) {
  // If the CWD is the dist repo itself, don't copy rules into it
  try {
    return fs.realpathSync(dir) === fs.realpathSync(DIST_ROOT);
  } catch {
    return dir === DIST_ROOT;
  }
}

// ── Editor Detection ───────────────────────────────────────────

function detectEditors() {
  const editors = [];
  if (fs.existsSync(CURSOR_DIR)) {
    editors.push({
      name: "Cursor",
      configDir: CURSOR_DIR,
      mcpConfigPath: path.join(CURSOR_DIR, "mcp.json"),
      mcpConfigKey: "mcpServers",
    });
  }
  if (fs.existsSync(VSCODE_DIR)) {
    editors.push({
      name: "VS Code",
      configDir: VSCODE_DIR,
      mcpConfigPath: path.join(VSCODE_DIR, "mcp.json"),
      mcpConfigKey: "servers",
    });
  }
  return editors;
}

// ── Global MCP Server Registration ─────────────────────────────

function registerMCPServer(editor, version) {
  const { name, mcpConfigPath, mcpConfigKey } = editor;

  // Read or create the config file
  let config = readJsonFile(mcpConfigPath);
  const isNew = config === null;
  if (isNew) {
    config = {};
  }

  // Ensure the servers key exists
  if (!config[mcpConfigKey]) {
    config[mcpConfigKey] = {};
  }

  const existing = config[mcpConfigKey][MCP_SERVER_NAME];
  const existingVersion = existing ? existing._version : null;

  if (existingVersion === version) {
    logStatus(
      `${name}  (${path.relative(HOME, mcpConfigPath)})`,
      "current",
      `v${version}`
    );
    return "current";
  }

  // Backup before first modification
  if (!isNew) {
    backupFile(mcpConfigPath);
  }

  // Build the server entry
  const serverEntry = {
    command: "node",
    args: [SERVER_BIN],
    env: { FIGMA_BRIDGE_PORT: BRIDGE_PORT },
    _version: version,
    _installedFrom: DIST_ROOT,
  };

  // VS Code uses "type": "stdio"
  if (name === "VS Code") {
    serverEntry.type = "stdio";
  }

  config[mcpConfigKey][MCP_SERVER_NAME] = serverEntry;
  writeJsonFile(mcpConfigPath, config);

  if (existingVersion) {
    logStatus(
      `${name}  (~/${path.relative(HOME, mcpConfigPath)})`,
      "updated",
      `v${existingVersion} → v${version}`
    );
    return "updated";
  } else {
    logStatus(
      `${name}  (~/${path.relative(HOME, mcpConfigPath)})`,
      "installed",
      `v${version}`
    );
    return "installed";
  }
}

// ── Per-Project Rules Copy ─────────────────────────────────────

function copyProjectRules(projectDir, editors, version) {
  const markerPath = path.join(projectDir, BRIDGE_VERSION_MARKER);
  let existingVersion = null;
  try {
    existingVersion = fs.readFileSync(markerPath, "utf-8").trim();
  } catch {
    // No marker file
  }

  if (existingVersion === version) {
    logStatus("Project rules", "current", `v${version}`);
    return false;
  }

  const editorNames = editors.map((e) => e.name);
  let copiedAnything = false;

  // ── Cursor rules ──
  if (editorNames.includes("Cursor")) {
    const cursorRulesDest = path.join(projectDir, ".cursor", "rules");
    if (fs.existsSync(CURSOR_RULES_SRC)) {
      const copied = copyDir(CURSOR_RULES_SRC, cursorRulesDest, (f) =>
        f.endsWith(".mdc")
      );
      if (copied.length > 0) {
        const detail = existingVersion
          ? `v${existingVersion} → v${version}, ${copied.length} files`
          : `v${version}, ${copied.length} files`;
        logStatus(".cursor/rules/  (Cursor)", "copied", detail);
        copiedAnything = true;
      }
    }
  }

  // ── Specs ──
  const specsDest = path.join(projectDir, ".cursor", "specs");
  if (fs.existsSync(SPECS_SRC)) {
    const existingSpecs = fs.existsSync(specsDest);
    const copied = copyDir(SPECS_SRC, specsDest);
    if (copied.length > 0) {
      logStatus(
        ".cursor/specs/",
        existingSpecs && existingVersion === version ? "current" : "copied",
        `${copied.length} files`
      );
      copiedAnything = true;
    }
  }

  // ── Cache directory ──
  const cacheDir = path.join(projectDir, ".cursor", "cache");
  if (ensureDir(cacheDir)) {
    logStatus(".cursor/cache/", "installed", "created");
    copiedAnything = true;
  } else {
    logStatus(".cursor/cache/", "current", "exists");
  }

  // ── VS Code instruction files ──
  if (editorNames.includes("VS Code")) {
    if (fs.existsSync(VSCODE_RULES_SRC)) {
      const instructionsDest = path.join(projectDir, ".github", "instructions");
      const copied = copyDir(VSCODE_RULES_SRC, instructionsDest, (f) =>
        f.endsWith(".instructions.md")
      );
      if (copied.length > 0) {
        const detail = existingVersion
          ? `v${existingVersion} → v${version}, ${copied.length} files`
          : `v${version}, ${copied.length} files`;
        logStatus(".github/instructions/  (VS Code)", "copied", detail);
        copiedAnything = true;
      }

      // Migration: clean up old consolidated copilot-instructions.md
      const oldCopilotPath = path.join(projectDir, ".github", "copilot-instructions.md");
      if (fs.existsSync(oldCopilotPath)) {
        const oldContent = fs.readFileSync(oldCopilotPath, "utf-8");

        if (oldContent.includes("BRIDGE_INSTRUCTIONS_START")) {
          // Find the outermost bridge block (including surrounding HTML comment boilerplate)
          // The generated file looks like:
          //   <!-- ==... -->
          //   <!-- Outreach Figma MCP Bridge ... -->
          //   <!-- Version: ... -->
          //   <!-- BRIDGE_INSTRUCTIONS_START ... -->
          //   <!-- ==... -->
          //   ... content ...
          //   <!-- ==... -->
          //   <!-- BRIDGE_INSTRUCTIONS_END ... -->
          //   <!-- ==... -->

          // Strip everything between the first "<!-- ====" bridge header and the last "<!-- ====" bridge footer
          // Use a regex that matches the entire bridge block generously
          let remaining = oldContent
            .replace(/<!--\s*=+\s*-->[\s\S]*?BRIDGE_INSTRUCTIONS_END[\s\S]*?<!--\s*=+\s*-->/g, "")
            // Also strip the separator comment if the bridge was appended to existing content
            .replace(/\n*---\n*<!-- Outreach Figma MCP Bridge instructions appended by setup\.js -->\n*/g, "")
            .trim();

          if (remaining.length === 0) {
            // File only had bridge content — delete it
            fs.unlinkSync(oldCopilotPath);
            logStatus(".github/copilot-instructions.md", "removed", "migrated to .github/instructions/");
          } else {
            // File had user content too — keep only that
            fs.writeFileSync(oldCopilotPath, remaining + "\n");
            logStatus(".github/copilot-instructions.md", "updated", "bridge section removed, user content kept");
          }
        }
      }
    }
  }

  // ── Write version marker ──
  fs.writeFileSync(markerPath, version + "\n");

  // ── Update .gitignore ──
  updateGitignore(projectDir);

  return copiedAnything;
}

function updateGitignore(projectDir) {
  const gitignorePath = path.join(projectDir, ".gitignore");
  if (!fs.existsSync(gitignorePath)) return;

  let content = fs.readFileSync(gitignorePath, "utf-8");
  const entries = [".cursor/cache/", ".bridge-version"];
  let modified = false;

  for (const entry of entries) {
    if (!content.includes(entry)) {
      if (!content.endsWith("\n")) content += "\n";
      content += `${entry}\n`;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(gitignorePath, content);
    logStatus(".gitignore", "updated", "added cache + version marker");
  }
}

// ── Main ───────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log(`
${c.bold}Outreach Figma MCP Bridge — Setup${c.reset}

${c.bold}Usage:${c.reset}
  node ~/outreach-figma-bridge/setup.js          Set up current project
  node ~/outreach-figma-bridge/setup.js --help    Show this help

${c.bold}What it does:${c.reset}
  1. Detects installed editors (Cursor, VS Code)
  2. Registers the MCP server globally (one-time)
  3. Copies rules to the current project (if run from a project dir)

${c.bold}Version management:${c.reset}
  - Same version → skips (no-op)
  - Newer version → updates server config and rules
  - Run again after 'git pull' to pick up updates
`);
    process.exit(0);
  }

  const version = readVersion();
  const projectDir = process.cwd();

  log("");
  log(
    `${c.bold}Outreach Figma MCP Bridge Setup${c.reset} ${c.cyan}v${version}${c.reset}`
  );
  log(`${"─".repeat(50)}`);
  log("");

  // ── Validate distribution ──
  if (!fs.existsSync(SERVER_BIN)) {
    log(
      `${c.red}Error: bin/server.js not found at ${SERVER_BIN}${c.reset}`
    );
    log("The distribution package may be incomplete. Try re-cloning the repo.");
    process.exit(1);
  }

  // ── Detect editors ──
  const editors = detectEditors();
  if (editors.length === 0) {
    log(
      `${c.red}Error: No supported editor detected.${c.reset}`
    );
    log(
      "Expected ~/.cursor/ (Cursor) or ~/.vscode/ (VS Code) to exist."
    );
    log("Install Cursor or VS Code, launch it once, then re-run this script.");
    process.exit(1);
  }

  const editorNames = editors.map((e) => e.name).join(", ");
  log(`${c.dim}Detected editors:${c.reset} ${editorNames}`);
  log("");

  // ── Phase 1: Global MCP server registration ──
  log(`${c.bold}[Global MCP Server]${c.reset}`);
  let anyServerChange = false;
  for (const editor of editors) {
    const result = registerMCPServer(editor, version);
    if (result !== "current") anyServerChange = true;
  }

  // Show skipped editors
  if (!editors.find((e) => e.name === "Cursor")) {
    logStatus("Cursor", "not found", "~/.cursor/ does not exist");
  }
  if (!editors.find((e) => e.name === "VS Code")) {
    logStatus("VS Code", "not found", "~/.vscode/ does not exist");
  }
  log("");

  // ── Phase 2: Per-project rules ──
  if (isDistRepo(projectDir)) {
    log(
      `${c.dim}[Project Rules] Skipped — you are inside the distribution repo.${c.reset}`
    );
    log(
      `${c.dim}Run this script from your project directory to install rules:${c.reset}`
    );
    log(`  cd your-project`);
    log(`  node ${process.argv[1]}`);
    log("");
  } else {
    log(`${c.bold}[Project Rules]${c.reset} ${projectDir}`);
    const didCopy = copyProjectRules(projectDir, editors, version);
    log("");
  }

  // ── Summary ──
  log(`${c.bold}Done!${c.reset}`);
  log("");

  if (anyServerChange) {
    log(`${c.bold}Next steps:${c.reset}`);
    log(`  1. ${c.cyan}Restart Cursor / VS Code${c.reset} to pick up the MCP server`);
    log(`  2. Open Figma → Plugins → ${c.cyan}Outreach Figma MCP Bridge${c.reset}`);
    log(`  3. Start designing with AI`);
  } else if (!isDistRepo(projectDir)) {
    log("Everything is up to date. Happy designing!");
  }
  log("");
}

main();
