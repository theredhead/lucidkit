#!/usr/bin/env node
/**
 * Add UISurface hostDirective to all ui-* components.
 *
 * For each component file with selector: 'ui-*':
 *  1. Add `import { UISurface } from '@theredhead/lucid-foundation'` (or adjust relative path for foundation itself)
 *  2. Add `hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }]` to @Component metadata
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { relative, dirname } from 'node:path';

const ROOT = process.cwd();

// Find all component files with ui-* selector
const files = execSync(
  `grep -rlE "selector:\\s*['\\"](ui-)" packages --include="*.component.ts"`,
  { encoding: 'utf8' },
)
  .trim()
  .split('\n')
  .filter(Boolean);

let changed = 0;

for (const file of files) {
  let src = readFileSync(file, 'utf8');

  // Skip if already has hostDirectives
  if (src.includes('hostDirectives')) {
    console.log(`  SKIP (already has hostDirectives): ${file}`);
    continue;
  }

  // Skip if no @Component decorator
  if (!/@Component\s*\(/.test(src)) {
    console.log(`  SKIP (no @Component): ${file}`);
    continue;
  }

  // Determine the correct import path
  let importPath;
  if (file.startsWith('packages/foundation/')) {
    // Inside foundation itself — use relative path
    const dir = dirname(file);
    const targetDir = 'packages/foundation/src/lib/surface';
    let rel = relative(dir, targetDir);
    if (!rel.startsWith('.')) rel = './' + rel;
    importPath = rel + '/surface.directive';
  } else {
    importPath = '@theredhead/lucid-foundation';
  }

  // 1. Add import for UISurface
  if (src.includes('UISurface')) {
    // Already imported somehow
  } else if (src.includes(importPath)) {
    // File already imports from this path — add UISurface to existing import
    const importRegex = new RegExp(
      `(import\\s*\\{)([^}]*)(}\\s*from\\s*['"]${importPath.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')}['"])`,
    );
    const match = src.match(importRegex);
    if (match) {
      const existingImports = match[2].trim();
      src = src.replace(match[0], `${match[1]} ${existingImports}, UISurface ${match[3]}`);
    } else {
      // Fallback: add a new import line
      src = addImportLine(src, importPath);
    }
  } else {
    src = addImportLine(src, importPath);
  }

  // 2. Add hostDirectives to @Component metadata
  // Insert after changeDetection or after the last known metadata property before the closing
  // Strategy: find the @Component({ ... }) block and add hostDirectives
  
  // Find the position right after selector line to insert hostDirectives
  // We'll insert it after changeDetection if present, otherwise after standalone
  const hostDirectiveLine = `  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],`;
  
  // Try inserting after changeDetection line
  let inserted = false;
  
  // Match changeDetection line and insert after it
  const cdMatch = src.match(/([ \t]*changeDetection:\s*ChangeDetectionStrategy\.\w+,?\s*\n)/);
  if (cdMatch) {
    const cdLine = cdMatch[1];
    const indent = cdLine.match(/^([ \t]*)/)[1];
    src = src.replace(cdLine, cdLine + indent + `hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],\n`);
    inserted = true;
  }
  
  if (!inserted) {
    // Try after standalone: true
    const saMatch = src.match(/([ \t]*standalone:\s*true,?\s*\n)/);
    if (saMatch) {
      const saLine = saMatch[1];
      const indent = saLine.match(/^([ \t]*)/)[1];
      src = src.replace(saLine, saLine + indent + `hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],\n`);
      inserted = true;
    }
  }

  if (!inserted) {
    console.log(`  WARN (could not insert hostDirectives): ${file}`);
    continue;
  }

  writeFileSync(file, src, 'utf8');
  changed++;
  console.log(`  OK: ${file}`);
}

console.log(`\nDone: updated ${changed} / ${files.length} component files`);

function addImportLine(src, importPath) {
  // Add import after the last existing import line
  const lines = src.split('\n');
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s/.test(lines[i])) {
      // Find the end of this import (may be multi-line)
      let j = i;
      while (j < lines.length && !lines[j].includes(';')) j++;
      lastImportIndex = j;
    }
  }
  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, `import { UISurface } from '${importPath}';`);
  } else {
    // No imports found, add at top
    lines.unshift(`import { UISurface } from '${importPath}';`);
  }
  return lines.join('\n');
}
