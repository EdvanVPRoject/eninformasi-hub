import fs from 'fs';
import path from 'path';
import { allArticles } from '../lib/articles.ts';
import { generateCoverSvg } from './svg-cover-generator.mjs';

const coversDir = path.join(process.cwd(), 'public/covers');
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

console.log(`Generating bespoke SVG covers for ${allArticles.length} articles...`);

allArticles.forEach((article, idx) => {
  const svg = generateCoverSvg({
    title: article.title,
    category: article.category,
    author: 'EdvanVPRoject',
    tags: article.tags || []
  });

  const filePath = path.join(coversDir, `${article.slug}.svg`);
  fs.writeFileSync(filePath, svg, 'utf8');
});

console.log(`Successfully generated ${allArticles.length} bespoke SVG covers in public/covers/!`);
