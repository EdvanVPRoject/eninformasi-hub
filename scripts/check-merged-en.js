const fs = require('fs');
const path = require('path');

// Let's inspect raw articles and translations-en
const enContent = fs.readFileSync('./lib/data/translations-en.ts', 'utf8');

// Function to extract export const englishTranslations = { ... }
// We can evaluate it in a clean sandbox or use node
const vm = require('vm');
const sandbox = { exports: {} };
// Remove 'import { Article } from ...' and 'export const englishTranslations = '
const declIndex = enContent.indexOf('export const englishTranslations');
const codeToRun = 'exports.englishTranslations = ' + enContent.slice(declIndex).replace(/^export\s+const\s+englishTranslations\s*:\s*Record<string,\s*EnglishTranslation>\s*=\s*/, '');

vm.runInNewContext(codeToRun, sandbox);
const englishTranslations = sandbox.exports.englishTranslations;

console.log('Successfully loaded englishTranslations keys:', Object.keys(englishTranslations).length);

// Now load raw articles
const dataFiles = [
  'tutorials-1.ts', 'tutorials-2.ts', 'tutorials-3.ts',
  'gaming-1.ts', 'articles-1.ts', 'articles-2.ts',
  'articles-3.ts', 'gaming-2.ts', 'upcoming-trends.ts', 'future-tech.ts'
];

let rawArticles = [];
for (const f of dataFiles) {
  const fc = fs.readFileSync(path.join('./lib/data', f), 'utf8');
  const code = fc
    .replace(/import\s+[^;]+;/g, '')
    .replace(/export\s+const\s+[a-zA-Z0-9]+\s*:\s*Article\[\]\s*=\s*/, 'exports.articles = ')
    .replace(/export\s+const\s+[a-zA-Z0-9]+\s*=\s*/, 'exports.articles = ');
  const sb = { exports: {} };
  try {
    vm.runInNewContext(code, sb);
    if (Array.isArray(sb.exports.articles)) {
      rawArticles.push(...sb.exports.articles);
    }
  } catch (err) {
    console.error(`Error loading ${f}:`, err.message);
  }
}

console.log('Loaded raw articles:', rawArticles.length);

let missingContentInEn = [];
let missingTitleInEn = [];
let missingTocInEn = [];

for (const a of rawArticles) {
  const extraEn = englishTranslations[a.slug];
  
  // The current logic in lib/articles.ts:
  const mergedEn = a.en && a.en.content 
    ? a.en 
    : extraEn 
      ? { ...extraEn, ...(a.en || {}) } 
      : a.en;

  if (!mergedEn) {
    missingContentInEn.push({ slug: a.slug, reason: 'mergedEn is undefined' });
    continue;
  }
  if (!mergedEn.title) {
    missingTitleInEn.push(a.slug);
  }
  if (!mergedEn.content) {
    missingContentInEn.push({ slug: a.slug, reason: 'no content in mergedEn' });
  }
  if (!mergedEn.toc || mergedEn.toc.length === 0) {
    missingTocInEn.push(a.slug);
  }
}

console.log('Articles with missing en.title:', missingTitleInEn.length);
console.log('Articles with missing en.content:', missingContentInEn.length);
if (missingContentInEn.length > 0) {
  console.log('Missing content samples:', missingContentInEn.slice(0, 5));
}
console.log('Articles with missing en.toc:', missingTocInEn.length);
if (missingTocInEn.length > 0) {
  console.log('Missing TOC samples:', missingTocInEn.slice(0, 5));
}
