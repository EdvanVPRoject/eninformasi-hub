const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('./lib/data/tutorials-1.ts', 'utf8');
const blocks = content.split(/\{\s*["']?slug["']?:/);
for (let i = 1; i < 5; i++) {
  const b = blocks[i];
  const slugMatch = b.match(/^\s*['"]([^'"]+)['"]/);
  const enMatch = b.match(/["']?en["']?:\s*\{([^}]+)\}/s);
  console.log('Slug:', slugMatch ? slugMatch[1] : 'unknown');
  console.log('Has en block in file:', !!enMatch);
  if (enMatch) {
    console.log('en block snippet:', enMatch[1].slice(0, 150));
  }
}
