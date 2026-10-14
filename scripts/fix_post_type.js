const fs = require('fs');
const path = require('path');

const files = ['gaming-2.ts', 'upcoming-trends.ts', 'future-tech.ts'];
for (const f of files) {
  const p = path.join(__dirname, '..', 'lib', 'data', f);
  let c = fs.readFileSync(p, 'utf8');
  c = c.replaceAll('"postType": "article"', '"postType": "artikel"');
  fs.writeFileSync(p, c);
  console.log(`Updated postType to 'artikel' in ${f}`);
}
