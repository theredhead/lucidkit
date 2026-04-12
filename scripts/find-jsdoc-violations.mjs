import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const files = execSync('find packages -name "*.ts" -not -path "*/node_modules/*"')
  .toString().trim().split('\n').filter(Boolean);

let missingBlankBefore = [];
let blankAfterClose = [];

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const prev = lines[i - 1];
    // /** not preceded by blank line, previous line is real code (not blank, not another comment line)
    if (/^\s+\/\*\*/.test(line) && prev.trim() !== '' && !/^\s*[\*\/]/.test(prev)) {
      missingBlankBefore.push(`${file}:${i + 1}  prev=[${prev.trim().substring(0, 70)}]`);
    }
    // */ followed by blank line
    if (/^\s+\*\//.test(line) && i + 1 < lines.length && lines[i + 1].trim() === '') {
      blankAfterClose.push(`${file}:${i + 1}`);
    }
  }
}

console.log(`=== Missing blank line before /**: ${missingBlankBefore.length} ===`);
missingBlankBefore.forEach(l => console.log(l));
console.log('');
console.log(`=== Blank line after */: ${blankAfterClose.length} ===`);
blankAfterClose.forEach(l => console.log(l));
