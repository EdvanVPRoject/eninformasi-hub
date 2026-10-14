const fs = require('fs');
const content = fs.readFileSync('./lib/data/tutorials-2.ts', 'utf8');
const blocks = content.split(/\{\s*["']?slug["']?\s*:\s*["']/);
for (let i = 1; i < blocks.length; i++) {
  const slug = (blocks[i].match(/^([^"']+)/) || [])[1];
  const m = blocks[i].match(/["']?content["']?\s*:\s*"([\s\S]*?)(?<!\\)"/);
  if (m && m[1].length < 500) {
    console.log(`SLUG: ${slug}, LENGTH: ${m[1].length}`);
    console.log('CONTENT:', m[1]);
  }
}
