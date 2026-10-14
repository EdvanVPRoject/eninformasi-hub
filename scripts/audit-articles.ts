import { allArticles } from '../lib/articles';

let missingEn = 0;
allArticles.forEach((a, i) => {
  if (!a.en || !a.en.title || !a.en.content) {
    missingEn++;
    console.log('Missing:', a.slug);
  }
});

console.log('Total articles:', allArticles.length);
console.log('Total missing en:', missingEn);
console.log('Coverage:', Math.round(((allArticles.length - missingEn) / allArticles.length) * 100) + '%');
