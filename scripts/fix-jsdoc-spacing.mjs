/**
 * Fixes two JSDoc spacing violations across all TypeScript source files:
 *
 *  1. `/**` not preceded by a blank line → inserts one
 *  2. `* /` (JSDoc close) followed by a blank line → removes the blank line
 *
 * Safe to run repeatedly (idempotent).
 */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const files = execSync('find packages -name "*.ts" -not -path "*/node_modules/*"')
  .toString()
  .trim()
  .split('\n')
  .filter(Boolean);

let totalFixed = 0;

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  const lines = original.split('\n');
  const out = [];
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ── Fix 1: ensure blank line before `/**` ──────────────────────────────
    // Matches lines of the form: <whitespace>/** (opening of a JSDoc block)
    if (/^\s+\/\*\*/.test(line)) {
      const prev = i > 0 ? out[out.length - 1] : null;
      // Previous line must exist and be non-blank and must not itself be part of
      // a comment (starts with *, /**,  //)
      if (prev !== null && prev.trim() !== '' && !/^\s*[\*\/]/.test(prev)) {
        out.push('');
        changed = true;
      }
    }

    out.push(line);

    // ── Fix 2: remove blank line immediately after `*/` ────────────────────
    // If current line is a JSDoc close and the next line is blank, skip it.
    if (/^\s+\*\//.test(line)) {
      const next = lines[i + 1];
      if (next !== undefined && next.trim() === '') {
        // peek further: make sure there's actually content after the blank line
        // (don't collapse trailing newlines at end of block/file)
        const afterBlank = lines[i + 2];
        if (afterBlank !== undefined && afterBlank.trim() !== '') {
          i++; // skip the blank line
          changed = true;
        }
      }
    }
  }

  if (changed) {
    writeFileSync(file, out.join('\n'), 'utf8');
    totalFixed++;
    console.log(`fixed: ${file}`);
  }
}

console.log(`\nDone. Fixed ${totalFixed} file(s).`);
