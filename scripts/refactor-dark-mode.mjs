#!/usr/bin/env node
/**
 * Replaces three-tier dark-mode patterns with @include mix.dark-mode { ... }
 * and adds @use 'mixins' as mix; at the top of SCSS files.
 *
 * Usage: node scripts/refactor-dark-mode.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Find all SCSS files still using old dark-mode pattern
const files = execSync(
  `grep -rl ':host-context(html.dark-theme)' packages/ui-kit/src packages/ui-forms/src packages/ui-blocks/src 2>/dev/null | grep '\\.scss$'`,
  { encoding: 'utf-8' }
).trim().split('\n').filter(Boolean);

console.log(`Found ${files.length} files to process\n`);

for (const file of files) {
  let content = readFileSync(file, 'utf-8');
  const original = content;

  // Add @use 'mixins' as mix; if not already present
  if (!content.includes("@use 'mixins'")) {
    // Add @use 'animation' as anim; if the file uses transition/animation timing values
    const needsAnim = /\b\d+ms\s+ease\b/.test(content);
    let imports = "@use 'mixins' as mix;\n";
    if (needsAnim) {
      imports += "@use 'animation' as anim;\n";
    }
    content = imports + '\n' + content;
  }

  // Pattern 1: Simple three-tier on :host (tokens only, no nested selectors)
  // :host-context(html.dark-theme) { ... }
  // @media (prefers-color-scheme: dark) { :host-context(html:not(.light-theme):not(.dark-theme)) { ... } }
  //
  // We replace these pairs with @include mix.dark-mode { ... }

  // Match the explicit dark class block
  const hostContextRegex = /(?:\/\/[^\n]*\n|\/\*[^*]*\*\/\n)*:host-context\(html\.dark-theme\)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\s*\n*(?:\/\/[^\n]*\n|\/\*[^*]*\*\/\n)*@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:host-context\(html:not\(\.light-theme\):not\(\.dark-theme\)\)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\s*\}/g;

  content = content.replace(hostContextRegex, (match, darkContent) => {
    // Use the first block's content (they're identical)
    return `@include mix.dark-mode {${darkContent}}`;
  });

  // Also handle cases where there are selector-specific dark mode blocks
  // :host-context(html.dark-theme) .selector { ... }
  // @media (...) { :host-context(...) .selector { ... } }
  const selectorDarkRegex = /(?:\/\/[^\n]*\n|\/\*[^*]*\*\/\n)*:host-context\(html\.dark-theme\)\s+(\.[a-zA-Z][\w-]*(?::[\w()-]+)?)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\s*\n*(?:\/\/[^\n]*\n|\/\*[^*]*\*\/\n)*@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:host-context\(html:not\(\.light-theme\):not\(\.dark-theme\)\)\s+\1\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}\s*\}/g;

  content = content.replace(selectorDarkRegex, (match, selector, darkContent) => {
    return `@include mix.dark-mode('${selector}') {${darkContent}}`;
  });

  if (content !== original) {
    writeFileSync(file, content, 'utf-8');
    console.log(`✓ ${file}`);
  } else {
    console.log(`⊘ ${file} (no changes or complex pattern)`);
  }
}

console.log('\nDone!');
