#!/usr/bin/env node
// ============================================================
// Outreach Figma MCP Bridge — Setup Script
//
// Smart, version-aware, editor-detecting setup CLI.
// Registers the MCP server globally (Cursor + VS Code) and
// copies rules per-project.
//
// Usage:
//   node ~/outreach-figma-bridge/setup.js                              (from a project dir, or prompted)
//   node ~/outreach-figma-bridge/setup.js --workspace /path/to/project (explicit workspace)
//   node ~/outreach-figma-bridge/setup.js /path/to/project             (positional shorthand)
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
const LIBRARIES_SRC = path.join(DIST_ROOT, "libraries");

const HOME = os.homedir();
const CURSOR_DIR = path.join(HOME, ".cursor");

// VS Code stores user-level mcp.json in the standard user data directory,
// NOT in ~/.vscode/ (which is for CLI/extensions metadata).
//   macOS:   ~/Library/Application Support/Code/User/
//   Linux:   ~/.config/Code/User/
//   Windows: %APPDATA%/Code/User/
function getVSCodeUserDir() {
  switch (process.platform) {
    case "darwin":
      return path.join(HOME, "Library", "Application Support", "Code", "User");
    case "linux":
      return path.join(HOME, ".config", "Code", "User");
    case "win32":
      return path.join(process.env.APPDATA || path.join(HOME, "AppData", "Roaming"), "Code", "User");
    default:
      // Fallback for unknown platforms
      return path.join(HOME, ".config", "Code", "User");
  }
}
const VSCODE_USER_DIR = getVSCodeUserDir();

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

// ── Interactive Prompt ─────────────────────────────────────────

function createPrompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return {
    ask(question) {
      return new Promise((resolve) => rl.question(question, resolve));
    },
    close() {
      rl.close();
    },
  };
}

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

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return 0;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  let count = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
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
  if (fs.existsSync(VSCODE_USER_DIR)) {
    editors.push({
      name: "VS Code",
      configDir: VSCODE_USER_DIR,
      mcpConfigPath: path.join(VSCODE_USER_DIR, "mcp.json"),
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
  // Managed files that should be read-only for users (integrity-checked)
  const MANAGED_RULES = ["figma-tool-usage-rules.mdc", "interactive-specs.mdc"];

  if (editorNames.includes("Cursor")) {
    const cursorRulesDest = path.join(projectDir, ".cursor", "rules");
    if (fs.existsSync(CURSOR_RULES_SRC)) {
      // Copy .mdc rule files
      const copied = copyDir(CURSOR_RULES_SRC, cursorRulesDest, (f) =>
        f.endsWith(".mdc")
      );

      // Copy .integrity.json if it exists
      const integritySrc = path.join(CURSOR_RULES_SRC, ".integrity.json");
      if (fs.existsSync(integritySrc)) {
        fs.copyFileSync(
          integritySrc,
          path.join(cursorRulesDest, ".integrity.json")
        );
      }

      // Set managed files to read-only (chmod 444)
      for (const file of MANAGED_RULES) {
        const filePath = path.join(cursorRulesDest, file);
        if (fs.existsSync(filePath)) {
          try {
            fs.chmodSync(filePath, 0o444);
          } catch {
            // Ignore chmod errors on platforms that don't support it
          }
        }
      }

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

  // ── Library packages ──
  const librariesDest = path.join(projectDir, ".cursor", "libraries");
  if (fs.existsSync(LIBRARIES_SRC)) {
    const entries = fs.readdirSync(LIBRARIES_SRC, { withFileTypes: true });
    const libDirs = entries.filter(
      (e) => e.isDirectory() && !e.name.startsWith(".")
    );

    if (libDirs.length > 0) {
      let totalFiles = 0;
      const libNames = [];
      for (const libDir of libDirs) {
        const srcLib = path.join(LIBRARIES_SRC, libDir.name);
        const destLib = path.join(librariesDest, libDir.name);
        const fileCount = copyDirRecursive(srcLib, destLib);
        totalFiles += fileCount;
        libNames.push(libDir.name);
      }
      // Also copy the README if present
      const readmeSrc = path.join(LIBRARIES_SRC, "README.md");
      if (fs.existsSync(readmeSrc)) {
        ensureDir(librariesDest);
        fs.copyFileSync(readmeSrc, path.join(librariesDest, "README.md"));
        totalFiles++;
      }
      if (totalFiles > 0) {
        logStatus(
          ".cursor/libraries/",
          "copied",
          `${libNames.length} library package(s): ${libNames.join(", ")}`
        );
        copiedAnything = true;
      }
    } else {
      // No library subdirectories yet — just ensure the directory exists
      if (ensureDir(librariesDest)) {
        logStatus(".cursor/libraries/", "installed", "created (no packages yet)");
        copiedAnything = true;
      } else {
        logStatus(".cursor/libraries/", "current", "exists");
      }
    }
  } else {
    // No libraries directory in distribution — ensure the directory exists for future use
    if (ensureDir(librariesDest)) {
      logStatus(".cursor/libraries/", "installed", "created");
      copiedAnything = true;
    }
  }

  // ── Cache directory (runtime variable resolution only) ──
  const cacheDir = path.join(projectDir, ".cursor", "cache");
  if (ensureDir(cacheDir)) {
    logStatus(".cursor/cache/", "installed", "created (runtime resolution)");
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

// ── Workspace Resolution ───────────────────────────────────────

function parseWorkspaceArg(args) {
  // Check for --workspace <path> or -w <path>
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--workspace" || args[i] === "-w") && args[i + 1]) {
      return args[i + 1];
    }
  }

  // Check for positional argument (a path that isn't a flag)
  for (const arg of args) {
    if (!arg.startsWith("-") && (arg.startsWith("/") || arg.startsWith("~") || arg.startsWith("."))) {
      return arg;
    }
  }

  return null;
}

function resolveWorkspacePath(input) {
  // Expand ~ to home directory
  if (input.startsWith("~")) {
    input = path.join(HOME, input.slice(1));
  }
  return path.resolve(input);
}

function validateWorkspacePath(wsPath) {
  if (!fs.existsSync(wsPath)) {
    return { ok: false, reason: `Directory does not exist: ${wsPath}` };
  }
  const stat = fs.statSync(wsPath);
  if (!stat.isDirectory()) {
    return { ok: false, reason: `Not a directory: ${wsPath}` };
  }
  if (isDistRepo(wsPath)) {
    return {
      ok: false,
      reason: `That is the bridge distribution directory, not a project workspace.`,
    };
  }
  return { ok: true };
}

async function promptForWorkspace(prompt) {
  log("");
  log(
    `${c.yellow}You are running setup from inside the bridge distribution directory.${c.reset}`
  );
  log(
    `${c.dim}The rules need to be installed in your actual project workspace (the folder you open in Cursor / VS Code).${c.reset}`
  );
  log("");

  while (true) {
    const answer = await prompt.ask(
      `${c.bold}Enter your workspace/project path${c.reset} (or "q" to quit): `
    );

    const trimmed = answer.trim();
    if (!trimmed || trimmed.toLowerCase() === "q") {
      log("");
      log(
        `${c.dim}Setup cancelled. You can re-run with a workspace path:${c.reset}`
      );
      log(`  node ${process.argv[1]} --workspace /path/to/your/project`);
      log("");
      return null;
    }

    const resolved = resolveWorkspacePath(trimmed);
    const validation = validateWorkspacePath(resolved);

    if (!validation.ok) {
      log(`  ${c.red}${validation.reason}${c.reset}`);
      log(`  ${c.dim}Please try again.${c.reset}`);
      log("");
      continue;
    }

    return resolved;
  }
}

// ── Main ───────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log(`
${c.bold}Outreach Figma MCP Bridge — Setup${c.reset}

${c.bold}Usage:${c.reset}
  node ~/outreach-figma-bridge/setup.js                                 Set up current project
  node ~/outreach-figma-bridge/setup.js --workspace /path/to/project    Set up a specific project
  node ~/outreach-figma-bridge/setup.js /path/to/project                Same (positional shorthand)
  node ~/outreach-figma-bridge/setup.js --help                          Show this help

${c.bold}What it does:${c.reset}
  1. Detects installed editors (Cursor, VS Code)
  2. Registers the MCP server globally (one-time)
  3. Copies rules to the target project workspace

${c.bold}Workspace resolution:${c.reset}
  - If --workspace (or -w) is provided, uses that path
  - If a positional path argument is provided, uses that
  - If run from a regular project directory, uses the current directory
  - If run from inside the bridge repo, prompts you for the workspace path

${c.bold}Version management:${c.reset}
  - Same version → skips (no-op)
  - Newer version → updates server config and rules
  - Run again after 'git pull' to pick up updates
`);
    process.exit(0);
  }

  const version = readVersion();

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

  // ── Resolve workspace/project directory ──
  let projectDir = null;
  const explicitPath = parseWorkspaceArg(args);

  if (explicitPath) {
    // User provided a path via --workspace or positional arg
    const resolved = resolveWorkspacePath(explicitPath);
    const validation = validateWorkspacePath(resolved);
    if (!validation.ok) {
      log(`${c.red}Error: ${validation.reason}${c.reset}`);
      process.exit(1);
    }
    projectDir = resolved;
  } else if (isDistRepo(process.cwd())) {
    // Running from inside the dist repo — prompt interactively
    const prompt = createPrompt();
    try {
      projectDir = await promptForWorkspace(prompt);
    } finally {
      prompt.close();
    }

    if (!projectDir) {
      // User cancelled the prompt
      process.exit(0);
    }
  } else {
    // Running from a project directory — use CWD
    projectDir = process.cwd();
  }

  // ── Phase 2: Per-project rules ──
  log(`${c.bold}[Project Rules]${c.reset} ${projectDir}`);
  const didCopy = copyProjectRules(projectDir, editors, version);
  log("");

  // ── Summary ──
  log(`${c.bold}Done!${c.reset}`);
  log("");

  if (anyServerChange) {
    log(`${c.bold}Next steps:${c.reset}`);
    log(`  1. ${c.cyan}Restart Cursor / VS Code${c.reset} to pick up the MCP server`);
    log(`  2. Open ${c.cyan}${projectDir}${c.reset} in your editor`);
    log(`  3. Open Figma → Plugins → ${c.cyan}Outreach Figma MCP Bridge${c.reset}`);
    log(`  4. Start designing with AI`);
  } else {
    log("Everything is up to date. Happy designing!");
  }
  log("");
}

main();
