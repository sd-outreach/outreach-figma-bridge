#!/usr/bin/env node
/**
 * Figma Spec Validator
 * 
 * Validates a spec JSON file before it's sent to Figma via build_from_spec / build_and_verify.
 * 
 * Usage:
 *   node .cursor/specs/validate-spec.js .cursor/specs/my-screen.json
 *   node .cursor/specs/validate-spec.js .cursor/specs/  # validates all specs in directory
 * 
 * Exit codes:
 *   0 = all valid
 *   1 = validation errors found
 *   2 = file not found or invalid JSON
 */

const fs = require('fs');
const path = require('path');

// ─── Allowed values ───────────────────────────────────────────────────────────
const VALID_TYPES = ['frame', 'text', 'rectangle', 'ellipse', 'line', 'component', 'vector', 'instance'];
const VALID_LAYOUT_MODES = ['HORIZONTAL', 'VERTICAL'];
const VALID_SIZING = ['FILL', 'HUG', 'FIXED'];
const VALID_PRIMARY_ALIGN = ['MIN', 'MAX', 'CENTER', 'SPACE_BETWEEN'];
const VALID_COUNTER_ALIGN = ['MIN', 'MAX', 'CENTER'];
const VALID_TEXT_ALIGN_H = ['LEFT', 'CENTER', 'RIGHT', 'JUSTIFIED'];
const VALID_TEXT_ALIGN_V = ['TOP', 'CENTER', 'BOTTOM'];
const VALID_EFFECT_TYPES = ['DROP_SHADOW', 'INNER_SHADOW', 'LAYER_BLUR', 'BACKGROUND_BLUR'];
const VALID_GRID_PATTERNS = ['COLUMNS', 'ROWS', 'GRID'];
const VALID_GRID_ALIGNMENTS = ['MIN', 'MAX', 'CENTER', 'STRETCH'];
const CONTAINER_TYPES = ['frame', 'component'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isColor(obj) {
  return obj && typeof obj === 'object' &&
    typeof obj.r === 'number' && typeof obj.g === 'number' && typeof obj.b === 'number' &&
    obj.r >= 0 && obj.r <= 1 && obj.g >= 0 && obj.g <= 1 && obj.b >= 0 && obj.b <= 1;
}

function isColorWithAlpha(obj) {
  return isColor(obj) && (obj.a === undefined || (typeof obj.a === 'number' && obj.a >= 0 && obj.a <= 1));
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateNode(node, path, errors, warnings, parentHasAutoLayout = false) {
  const loc = path || 'root';

  // Required: name
  if (!node.name || typeof node.name !== 'string') {
    errors.push(`${loc}: "name" is required and must be a non-empty string`);
  } else if (/^(Frame|Rectangle|Ellipse|Group|Text)\s*\d*$/i.test(node.name)) {
    warnings.push(`${loc}: Layer name "${node.name}" looks like a Figma default — use a semantic name`);
  }

  // Required: type
  if (!node.type || typeof node.type !== 'string') {
    errors.push(`${loc}: "type" is required`);
    return; // can't validate further without type
  }
  if (!VALID_TYPES.includes(node.type)) {
    errors.push(`${loc}: Invalid type "${node.type}". Must be one of: ${VALID_TYPES.join(', ')}`);
    return;
  }

  // ── Instance-specific ───────────────────────────────────────────────────
  if (node.type === 'instance') {
    if (!node.componentKey && !node.componentId) {
      errors.push(`${loc}: Instance nodes require either "componentKey" or "componentId"`);
    }
    if (node.children && node.children.length > 0) {
      errors.push(`${loc}: Instance nodes cannot have "children" — use "instanceOverrides" instead`);
    }
    if (node.instanceOverrides && !Array.isArray(node.instanceOverrides)) {
      errors.push(`${loc}: "instanceOverrides" must be an array`);
    }
    if (node.instanceOverrides) {
      node.instanceOverrides.forEach((ov, i) => {
        if (!ov.childName) {
          errors.push(`${loc}.instanceOverrides[${i}]: "childName" is required`);
        }
      });
    }
  }

  // ── Text-specific ───────────────────────────────────────────────────────
  if (node.type === 'text') {
    if (node.characters === undefined || node.characters === null) {
      errors.push(`${loc}: Text nodes require "characters"`);
    }
    if (!node.fontSize && !node.textStyleKey) {
      warnings.push(`${loc}: Text node has no "fontSize" or "textStyleKey" — will use Figma default`);
    }
    if (!node.fontFamily && !node.textStyleKey) {
      warnings.push(`${loc}: Text node has no "fontFamily" or "textStyleKey" — will default to "Inter"`);
    }
    if (node.textAlignHorizontal && !VALID_TEXT_ALIGN_H.includes(node.textAlignHorizontal)) {
      errors.push(`${loc}: Invalid textAlignHorizontal "${node.textAlignHorizontal}". Must be: ${VALID_TEXT_ALIGN_H.join(', ')}`);
    }
    if (node.textAlignVertical && !VALID_TEXT_ALIGN_V.includes(node.textAlignVertical)) {
      errors.push(`${loc}: Invalid textAlignVertical "${node.textAlignVertical}". Must be: ${VALID_TEXT_ALIGN_V.join(', ')}`);
    }
    if (node.children) {
      errors.push(`${loc}: Text nodes cannot have "children"`);
    }
  }

  // ── Color validation ────────────────────────────────────────────────────
  if (node.fill && !isColor(node.fill)) {
    errors.push(`${loc}: "fill" must be {r, g, b} with values 0–1. Got: ${JSON.stringify(node.fill)}`);
  }

  // ── Stroke validation ───────────────────────────────────────────────────
  if (node.stroke) {
    if (!node.stroke.color || !isColor(node.stroke.color)) {
      errors.push(`${loc}: "stroke.color" must be {r, g, b} with values 0–1`);
    }
    if (node.stroke.weight === undefined || typeof node.stroke.weight !== 'number') {
      errors.push(`${loc}: "stroke.weight" is required and must be a number`);
    }
  }

  // ── Auto layout validation ──────────────────────────────────────────────
  if (node.autoLayout) {
    if (!CONTAINER_TYPES.includes(node.type)) {
      errors.push(`${loc}: "autoLayout" can only be set on frame or component types, not "${node.type}"`);
    }
    if (!node.autoLayout.mode || !VALID_LAYOUT_MODES.includes(node.autoLayout.mode)) {
      errors.push(`${loc}: autoLayout.mode must be "HORIZONTAL" or "VERTICAL"`);
    }
    if (node.autoLayout.primaryAxisAlignItems && !VALID_PRIMARY_ALIGN.includes(node.autoLayout.primaryAxisAlignItems)) {
      errors.push(`${loc}: Invalid autoLayout.primaryAxisAlignItems "${node.autoLayout.primaryAxisAlignItems}"`);
    }
    if (node.autoLayout.counterAxisAlignItems && !VALID_COUNTER_ALIGN.includes(node.autoLayout.counterAxisAlignItems)) {
      errors.push(`${loc}: Invalid autoLayout.counterAxisAlignItems "${node.autoLayout.counterAxisAlignItems}"`);
    }
    if (node.autoLayout.primaryAxisSizingMode && !VALID_SIZING.includes(node.autoLayout.primaryAxisSizingMode)) {
      errors.push(`${loc}: Invalid autoLayout.primaryAxisSizingMode "${node.autoLayout.primaryAxisSizingMode}"`);
    }
    if (node.autoLayout.counterAxisSizingMode && !VALID_SIZING.includes(node.autoLayout.counterAxisSizingMode)) {
      errors.push(`${loc}: Invalid autoLayout.counterAxisSizingMode "${node.autoLayout.counterAxisSizingMode}"`);
    }
  }

  // ── Layout sizing validation ────────────────────────────────────────────
  if (node.layoutSizing) {
    if (!parentHasAutoLayout) {
      warnings.push(`${loc}: "layoutSizing" is set but parent does not have autoLayout — it will be ignored`);
    }
    if (node.layoutSizing.horizontal && !VALID_SIZING.includes(node.layoutSizing.horizontal)) {
      errors.push(`${loc}: Invalid layoutSizing.horizontal "${node.layoutSizing.horizontal}". Must be: ${VALID_SIZING.join(', ')}`);
    }
    if (node.layoutSizing.vertical && !VALID_SIZING.includes(node.layoutSizing.vertical)) {
      errors.push(`${loc}: Invalid layoutSizing.vertical "${node.layoutSizing.vertical}". Must be: ${VALID_SIZING.join(', ')}`);
    }
  }

  // ── Effects validation ──────────────────────────────────────────────────
  if (node.effects) {
    if (!Array.isArray(node.effects)) {
      errors.push(`${loc}: "effects" must be an array`);
    } else {
      node.effects.forEach((fx, i) => {
        if (!fx.type || !VALID_EFFECT_TYPES.includes(fx.type)) {
          errors.push(`${loc}.effects[${i}]: Invalid effect type "${fx.type}". Must be: ${VALID_EFFECT_TYPES.join(', ')}`);
        }
        if (fx.radius === undefined || typeof fx.radius !== 'number') {
          errors.push(`${loc}.effects[${i}]: "radius" is required and must be a number`);
        }
        if (fx.color && !isColorWithAlpha(fx.color)) {
          errors.push(`${loc}.effects[${i}]: "color" must be {r, g, b, a} with values 0–1`);
        }
        if ((fx.type === 'DROP_SHADOW' || fx.type === 'INNER_SHADOW') && !fx.offset) {
          warnings.push(`${loc}.effects[${i}]: Shadow without "offset" — will default to {x:0, y:0}`);
        }
      });
    }
  }

  // ── Layout grids validation ─────────────────────────────────────────────
  if (node.layoutGrids) {
    if (!Array.isArray(node.layoutGrids)) {
      errors.push(`${loc}: "layoutGrids" must be an array`);
    } else {
      node.layoutGrids.forEach((grid, i) => {
        if (!grid.pattern || !VALID_GRID_PATTERNS.includes(grid.pattern)) {
          errors.push(`${loc}.layoutGrids[${i}]: Invalid pattern "${grid.pattern}". Must be: ${VALID_GRID_PATTERNS.join(', ')}`);
        }
        if (grid.alignment && !VALID_GRID_ALIGNMENTS.includes(grid.alignment)) {
          errors.push(`${loc}.layoutGrids[${i}]: Invalid alignment "${grid.alignment}". Must be: ${VALID_GRID_ALIGNMENTS.join(', ')}`);
        }
      });
    }
  }

  // ── Children validation (recursive) ─────────────────────────────────────
  if (node.children) {
    if (!CONTAINER_TYPES.includes(node.type)) {
      errors.push(`${loc}: Only frame/component types can have "children", not "${node.type}"`);
    } else if (!Array.isArray(node.children)) {
      errors.push(`${loc}: "children" must be an array`);
    } else {
      const childHasAutoLayout = !!node.autoLayout;
      node.children.forEach((child, i) => {
        validateNode(child, `${loc} > ${child.name || `child[${i}]`}`, errors, warnings, childHasAutoLayout);
      });
    }
  }

  // ── Dimension warnings ──────────────────────────────────────────────────
  if (node.type === 'frame' || node.type === 'component') {
    if (!node.width && !node.autoLayout && !node.layoutSizing) {
      warnings.push(`${loc}: Frame has no "width" and no autoLayout sizing — may collapse to 0`);
    }
  }

  // ── Variable binding format ─────────────────────────────────────────────
  ['fillVariable', 'strokeVariable', 'textFillVariable'].forEach(key => {
    if (node[key] && typeof node[key] === 'string' && !node[key].startsWith('VariableID:')) {
      warnings.push(`${loc}: "${key}" value "${node[key]}" doesn't start with "VariableID:" — may not bind correctly`);
    }
  });

  // ── Style key format ────────────────────────────────────────────────────
  ['fillStyleKey', 'strokeStyleKey', 'textStyleKey', 'effectStyleKey'].forEach(key => {
    if (node[key] && typeof node[key] !== 'string') {
      errors.push(`${loc}: "${key}" must be a string`);
    }
  });
}

// ─── Stats collector ──────────────────────────────────────────────────────────
function collectStats(node, stats = { nodes: 0, types: {}, depth: 0 }, currentDepth = 0) {
  stats.nodes++;
  stats.types[node.type] = (stats.types[node.type] || 0) + 1;
  stats.depth = Math.max(stats.depth, currentDepth);
  if (node.children) {
    node.children.forEach(child => collectStats(child, stats, currentDepth + 1));
  }
  return stats;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function validateFile(filePath) {
  const resolvedPath = path.resolve(filePath);
  
  if (!fs.existsSync(resolvedPath)) {
    console.error(`\n  FILE NOT FOUND: ${resolvedPath}`);
    return { file: resolvedPath, status: 'not_found' };
  }

  let raw;
  try {
    raw = fs.readFileSync(resolvedPath, 'utf-8');
  } catch (e) {
    console.error(`\n  READ ERROR: ${e.message}`);
    return { file: resolvedPath, status: 'read_error', error: e.message };
  }

  let spec;
  try {
    spec = JSON.parse(raw);
  } catch (e) {
    console.error(`\n  INVALID JSON: ${e.message}`);
    return { file: resolvedPath, status: 'invalid_json', error: e.message };
  }

  const errors = [];
  const warnings = [];

  validateNode(spec, spec.name || 'root', errors, warnings);
  const stats = collectStats(spec);

  // ── Print report ────────────────────────────────────────────────────────
  const fileName = path.basename(filePath);
  const relPath = path.relative(process.cwd(), resolvedPath);
  
  console.log(`\n┌─ ${fileName} ─────────────────────────────────────────`);
  console.log(`│  Path: ${relPath}`);
  console.log(`│  Nodes: ${stats.nodes} | Depth: ${stats.depth} | Types: ${Object.entries(stats.types).map(([t,c]) => `${t}(${c})`).join(', ')}`);
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log(`│  ✓ VALID — no errors, no warnings`);
  } else {
    if (errors.length > 0) {
      console.log(`│`);
      console.log(`│  ERRORS (${errors.length}):`);
      errors.forEach(e => console.log(`│    ✗ ${e}`));
    }
    if (warnings.length > 0) {
      console.log(`│`);
      console.log(`│  WARNINGS (${warnings.length}):`);
      warnings.forEach(w => console.log(`│    ⚠ ${w}`));
    }
  }
  
  console.log(`└────────────────────────────────────────────────────`);

  return {
    file: resolvedPath,
    status: errors.length > 0 ? 'invalid' : warnings.length > 0 ? 'warnings' : 'valid',
    errors,
    warnings,
    stats
  };
}

// ─── CLI entry ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.length === 0) {
  // Default: validate all .json files in .cursor/specs/
  const specsDir = path.join(process.cwd(), '.cursor', 'specs');
  if (!fs.existsSync(specsDir)) {
    console.log('No .cursor/specs/ directory found.');
    process.exit(0);
  }
  const files = fs.readdirSync(specsDir).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.log('No spec files found in .cursor/specs/');
    process.exit(0);
  }
  console.log(`\nValidating ${files.length} spec file(s)...\n`);
  const results = files.map(f => validateFile(path.join(specsDir, f)));
  const hasErrors = results.some(r => r.status === 'invalid' || r.status === 'invalid_json');
  
  console.log(`\n${results.length} file(s) checked: ${results.filter(r => r.status === 'valid').length} valid, ${results.filter(r => r.status === 'warnings').length} warnings, ${results.filter(r => r.status === 'invalid').length} invalid\n`);
  process.exit(hasErrors ? 1 : 0);
} else {
  const target = args[0];
  const stat = fs.statSync(target, { throwIfNoEntry: false });
  
  if (stat && stat.isDirectory()) {
    const files = fs.readdirSync(target).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
      console.log(`No spec files found in ${target}`);
      process.exit(0);
    }
    console.log(`\nValidating ${files.length} spec file(s)...\n`);
    const results = files.map(f => validateFile(path.join(target, f)));
    const hasErrors = results.some(r => r.status === 'invalid' || r.status === 'invalid_json');
    console.log(`\n${results.length} file(s) checked: ${results.filter(r => r.status === 'valid').length} valid, ${results.filter(r => r.status === 'warnings').length} warnings, ${results.filter(r => r.status === 'invalid').length} invalid\n`);
    process.exit(hasErrors ? 1 : 0);
  } else {
    const result = validateFile(target);
    process.exit(result.status === 'invalid' || result.status === 'invalid_json' ? 1 : 0);
  }
}
