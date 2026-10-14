const fs = require('fs');
const path = require('path');

const dataFiles = [
  'tutorials-1.ts', 'tutorials-2.ts', 'tutorials-3.ts',
  'gaming-1.ts', 'articles-1.ts', 'articles-2.ts',
  'articles-3.ts', 'gaming-2.ts', 'upcoming-trends.ts', 'future-tech.ts'
];

let stats = {
  total: 0,
  hasInlineEn: 0,
  missingEnToc: 0,
  missingEnSteps: 0,
  missingEnContent: 0,
};

let missingTocArticles = [];

for (const f of dataFiles) {
  const fileContent = fs.readFileSync(path.join('./lib/data', f), 'utf8');
  const blocks = fileContent.split(/\{\s*["']?slug["']?:/);
  for (let i = 1; i < blocks.length; i++) {
    stats.total++;
    const b = blocks[i];
    const slug = b.match(/^\s*['"]([^'"]+)['"]/)?.[1];
    const title = b.match(/["']?title["']?:\s*['"]([^'"]+)['"]/)?.[1];
    
    // Check if inline en exists
    const enBlockMatch = b.match(/["']?en["']?:\s*\{([\s\S]*?)(?=\n\s*\},?\n|\n\s*\}\s*\])/);
    if (enBlockMatch) {
      stats.hasInlineEn++;
      const enText = enBlockMatch[1];
      const hasContent = /["']?content["']?:/.test(enText);
      const hasToc = /["']?toc["']?:/.test(enText);
      const hasSteps = /["']?steps["']?:/.test(enText);
      
      if (!hasContent) stats.missingEnContent++;
      if (!hasToc) {
        stats.missingEnToc++;
        missingTocArticles.push({ file: f, slug, title });
      }
      if (!hasSteps) stats.missingEnSteps++;
    }
  }
}

console.log('Stats:', stats);
console.log('Sample articles missing en.toc:', missingTocArticles.slice(0, 10));
