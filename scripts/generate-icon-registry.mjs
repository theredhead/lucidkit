#!/usr/bin/env node

/**
 * Generates the Lucide icon registry TypeScript file from the raw SVGs
 * and JSON metadata in resources/icons/lucide/.
 *
 * Usage:
 *   node scripts/generate-icon-registry.mjs
 *
 * Output:
 *   packages/ui-kit/src/lib/icon/lucide-icons.generated.ts
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const ICONS_DIR = join(ROOT, "resources/icons/lucide");
const OUT_DIR = join(ROOT, "packages/ui-kit/src/lib/icon");
const OUT_FILE = join(OUT_DIR, "lucide-icons.generated.ts");

// ── helpers ──────────────────────────────────────────────────────────

/** Convert kebab-case to PascalCase: "arrow-up-right" → "ArrowUpRight" */
function toPascal(kebab) {
  return kebab.replace(/(^|-)([a-z0-9])/g, (_, _sep, ch) => ch.toUpperCase());
}

/** Extract inner SVG content (everything between <svg ...> and </svg>) */
function extractInner(svg) {
  // Remove the outer <svg> wrapper, keep only children
  const inner = svg
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim()
    // Collapse multi-line to single line
    .replace(/\n\s*/g, "");
  return inner;
}

// ── scan icons ───────────────────────────────────────────────────────

const svgFiles = readdirSync(ICONS_DIR).filter((f) => f.endsWith(".svg"));
console.log(`Found ${svgFiles.length} SVG icons`);

/**
 * Map of category → { PascalName: svgInnerContent }
 * Icons can appear in multiple categories; we place them in ALL of them.
 */
const categories = {};

/** Flat map for the "All" namespace: PascalName → svgInnerContent */
const allIcons = {};

for (const file of svgFiles) {
  const name = basename(file, ".svg");
  const pascal = toPascal(name);
  const svgRaw = readFileSync(join(ICONS_DIR, file), "utf8");
  const inner = extractInner(svgRaw);

  allIcons[pascal] = inner;

  // Try to read companion JSON for category info
  const jsonPath = join(ICONS_DIR, `${name}.json`);
  let cats = ["uncategorized"];
  try {
    const meta = JSON.parse(readFileSync(jsonPath, "utf8"));
    if (meta.categories && meta.categories.length > 0) {
      cats = meta.categories;
    }
  } catch {
    // no JSON metadata — put in uncategorized
  }

  for (const cat of cats) {
    const catPascal = toPascal(cat);
    if (!categories[catPascal]) {
      categories[catPascal] = {};
    }
    categories[catPascal][pascal] = inner;
  }
}

// ── generate TypeScript ──────────────────────────────────────────────

const catNames = Object.keys(categories).sort();
console.log(`Categories (${catNames.length}): ${catNames.join(", ")}`);

let ts = `// ──────────────────────────────────────────────────────────────────────
// AUTO-GENERATED — do not edit manually.
// Re-generate with: node scripts/generate-icon-registry.mjs
// Source: resources/icons/lucide/ (Lucide v0.577.0, ISC licence)
// ──────────────────────────────────────────────────────────────────────

/**
 * SVG inner-content strings for every Lucide icon, grouped by category.
 *
 * Each value is the markup **inside** the \`<svg>\` element (paths, circles,
 * etc.) — the \`<ui-icon>\` component wraps it in the outer \`<svg>\` tag.
 *
 * Icons may appear in more than one category.
 *
 * @example
 * \`\`\`html
 * <ui-icon [svg]="UIIcons.Lucide.Text.Bold" />
 * <ui-icon [svg]="UIIcons.Lucide.Arrows.ArrowUp" [size]="20" />
 * \`\`\`
 */
export const UIIcons = {
  Lucide: {
`;

for (const cat of catNames) {
  const icons = categories[cat];
  const iconNames = Object.keys(icons).sort();
  ts += `    /** ${iconNames.length} icons */\n`;
  ts += `    ${cat}: {\n`;
  for (const icon of iconNames) {
    // Escape backticks in SVG content (unlikely but safe)
    const escaped = icons[icon].replace(/`/g, "\\`").replace(/\$/g, "\\$");
    ts += `      ${icon}: \`${escaped}\`,\n`;
  }
  ts += `    },\n`;
}

ts += `  },
} as const;

/** Union type of all category names in the Lucide icon set. */
export type LucideCategory = keyof typeof UIIcons.Lucide;

/** Union type of icon names within a given Lucide category. */
export type LucideIconName<C extends LucideCategory> =
  keyof (typeof UIIcons.Lucide)[C];
`;

// ── write ────────────────────────────────────────────────────────────

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, ts, "utf8");
console.log(`\nWrote ${OUT_FILE}`);
console.log(
  `  ${svgFiles.length} icons total, ${catNames.length} categories`,
);
console.log(`  File size: ${(Buffer.byteLength(ts) / 1024).toFixed(0)} KB`);
