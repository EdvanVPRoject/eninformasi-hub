const fs = require('fs');

const content = fs.readFileSync('./lib/data/translations-en.ts', 'utf8');
console.log('translations-en.ts length:', content.length);
const keys = content.match(/['"][a-zA-Z0-9-]+['"]:\s*\{/g);
console.log('Total keys in translations-en.ts:', keys ? keys.length : 0);
if (keys) {
  console.log('First 5 keys:', keys.slice(0, 5));
}
