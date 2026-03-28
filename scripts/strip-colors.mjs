#!/usr/bin/env node
/**
 * Strip all color-related CSS declarations from component SCSS files.
 *
 * Targets:
 *  - CSS custom property definitions for color tokens (--ui-*, --theredhead-*)
 *  - Pure color properties: color, background-color, border-color, outline-color,
 *    fill, stroke, caret-color, accent-color, text-decoration-color, etc.
 *  - Mixed shorthands containing color: background, border, outline, box-shadow,
 *    text-shadow — UNLESS the value is purely structural (none, 0, inherit, unset)
 *
 * Preserves:
 *  - Structural resets: border: none, outline: none, background: none
 *  - Non-color properties: border-radius, border-width, border-style, etc.
 *  - All layout, sizing, typography (non-color) declarations
 */

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import postcss from "postcss";
import postcssScss from "postcss-scss";

// ── Properties that are ALWAYS about color ──────────────────────────
const PURE_COLOR_PROPS = new Set([
  "color",
  "background-color",
  "border-color",
  "border-top-color",
  "border-bottom-color",
  "border-left-color",
  "border-right-color",
  "border-block-color",
  "border-block-start-color",
  "border-block-end-color",
  "border-inline-color",
  "border-inline-start-color",
  "border-inline-end-color",
  "outline-color",
  "text-decoration-color",
  "caret-color",
  "accent-color",
  "fill",
  "stroke",
  "column-rule-color",
  "scrollbar-color",
  "flood-color",
  "lighting-color",
  "stop-color",
]);

// ── Shorthand properties that MAY contain color ─────────────────────
const MIXED_COLOR_PROPS = new Set([
  "background",
  "border",
  "border-top",
  "border-bottom",
  "border-left",
  "border-right",
  "border-block",
  "border-block-start",
  "border-block-end",
  "border-inline",
  "border-inline-start",
  "border-inline-end",
  "outline",
  "box-shadow",
  "text-shadow",
  "column-rule",
]);

// Values that are purely structural (no color involved)
const STRUCTURAL_VALUES = /^(none|0|inherit|unset|initial|revert|revert-layer)$/i;

// Detect color in a value string
function valueContainsColor(value) {
  const v = value.trim();
  // structural reset — no color
  if (STRUCTURAL_VALUES.test(v)) return false;
  // hex color
  if (/#[0-9a-fA-F]{3,8}\b/.test(v)) return true;
  // rgb/rgba/hsl/hsla/hwb/lab/lch/oklch/oklab/color-mix/color()
  if (/\b(rgba?|hsla?|hwb|lab|lch|oklch|oklab|color-mix|color)\s*\(/.test(v)) return true;
  // CSS named colors (common ones + transparent)
  if (/\b(transparent|currentcolor|currentColor)\b/.test(v)) return true;
  // var() referencing a color token
  if (/var\(\s*--(ui-|theredhead-)/.test(v)) return true;
  // Any var() in a context that's typically color
  // For shorthands like border: 1px solid var(--something), the var is likely color
  if (/var\(/.test(v)) return true;
  return false;
}

// Check if a CSS custom property name looks like a color token
function isColorCustomProp(prop, value) {
  if (!prop.startsWith("--")) return false;
  // If the value itself looks like a color, remove it
  if (valueContainsColor(value)) return true;
  return false;
}

function shouldRemoveDecl(decl) {
  const prop = decl.prop;
  const value = decl.value;

  // CSS custom property definition (--cv-bg: #ffffff, --ui-text: #1d232b, etc.)
  if (prop.startsWith("--")) {
    return isColorCustomProp(prop, value);
  }

  // Pure color property — always remove
  if (PURE_COLOR_PROPS.has(prop)) return true;

  // Mixed shorthand — remove only if value contains color
  if (MIXED_COLOR_PROPS.has(prop)) {
    return valueContainsColor(value);
  }

  return false;
}

// Remove a node and clean up: if parent rule becomes empty, remove it too
function removeAndClean(node) {
  const parent = node.parent;
  node.remove();
  if (parent && parent.type === "rule" && parent.nodes && parent.nodes.length === 0) {
    removeAndClean(parent);
  }
  if (parent && parent.type === "atrule" && parent.nodes && parent.nodes.length === 0) {
    removeAndClean(parent);
  }
}

// Process a single file
function processFile(filePath) {
  const src = readFileSync(filePath, "utf8");
  const root = postcssScss.parse(src, { from: filePath });
  let removedCount = 0;

  // Collect nodes to remove first (avoid mutation during walk)
  const toRemove = [];

  root.walkDecls((decl) => {
    if (shouldRemoveDecl(decl)) {
      toRemove.push(decl);
    }
  });

  // Also remove @include calls that pass color arguments (e.g. focus-ring with color var)
  root.walkAtRules("include", (atRule) => {
    const params = atRule.params || "";
    if (valueContainsColor(params)) {
      toRemove.push(atRule);
    }
  });

  for (const decl of toRemove) {
    removeAndClean(decl);
    removedCount++;
  }

  if (removedCount > 0) {
    const out = root.toString(postcssScss);
    writeFileSync(filePath, out, "utf8");
  }

  return removedCount;
}

// ── Main ────────────────────────────────────────────────────────────
const files = execSync(
  'find packages -name "*.component.scss" -type f',
  { encoding: "utf8" },
)
  .trim()
  .split("\n")
  .filter(Boolean);

let totalRemoved = 0;
let filesChanged = 0;

for (const f of files) {
  const removed = processFile(f);
  if (removed > 0) {
    console.log(`  ${f} — removed ${removed} declaration(s)`);
    totalRemoved += removed;
    filesChanged++;
  }
}

console.log(`\nDone: removed ${totalRemoved} color declarations from ${filesChanged} / ${files.length} files`);
