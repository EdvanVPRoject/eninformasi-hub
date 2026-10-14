const fs = require('fs');
const path = require('path');

const dataFiles = [
  'tutorials-1.ts', 'tutorials-2.ts', 'tutorials-3.ts',
  'gaming-1.ts', 'articles-1.ts', 'articles-2.ts',
  'articles-3.ts', 'gaming-2.ts', 'upcoming-trends.ts', 'future-tech.ts'
];

// Let's read translations-en.ts as an object:
// Note: translations-en is a JS/TS export. Let's see if we can parse or load it.
// We can extract keys from translations-en
const enContent = fs.readFileSync('./lib/data/translations-en.ts', 'utf8');
const enKeys = new Set();
const keyRegex = /"([a-zA-Z0-9-]+)":\s*\{/g;
let m;
while ((m = keyRegex.exec(enContent)) !== null) {
  enKeys.add(m[1]);
}
console.log('Total keys in translations-en.ts:', enKeys.size);

let missingEn = [];
let totalCount = 0;

for (const f of dataFiles) {
  const fileContent = fs.readFileSync(path.join('./lib/data', f), 'utf8');
  // split articles
  const blocks = fileContent.split(/\{\s*["']?slug["']?:/);
  for (let i = 1; i < blocks.length; i++) {
    totalCount++;
    const b = blocks[i];
    const slug = b.match(/^\s*['"]([^'"]+)['"]/)?.[1];
    const title = b.match(/["']?title["']?:\s*['"]([^'"]+)['"]/)?.[1];
    const hasInlineEn = /["']?en["']?:\s*\{/.test(b);
    const hasTranslationEn = enKeys.has(slug);

    if (!hasInlineEn && !hasTranslationEn) {
      missingEn.push({ file: f, slug, title });
    }
  }
}

console.log('Total checked:', totalCount);
console.log('Missing English completely:', missingEn.length);
if (missingEn.length > 0) {
  console.log('Missing list:', missingEn);
}
