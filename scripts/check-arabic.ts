#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const srcDir = join(__dirname, '..', 'src');
const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

let hasErrors = false;

function scanDir(dir: string) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (entry === 'node_modules' || entry === '.next') continue;
    if (statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(ts|tsx)$/.test(entry) && !fullPath.includes('messages')) {
      const content = readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (arabicRegex.test(line)) {
          const trimmed = line.trim().substring(0, 100);
          console.log(`Arabic text found in ${fullPath}:${i + 1}  \u2192 ${trimmed}`);
          hasErrors = true;
        }
      });
    }
  }
}

scanDir(srcDir);
if (hasErrors) {
  console.log('\n\u274C Hardcoded Arabic text found in source files. Use t() with i18n keys instead.');
  process.exit(1);
} else {
  console.log('\u2705 No hardcoded Arabic text found.');
}
