import { allArticles } from '../lib/articles';

const missing = allArticles.filter(a => !a.en || !a.en.content);
console.log('Total missing:', missing.length);
missing.forEach((a, i) => {
  console.log(`${i + 1}. [${a.slug}] ${a.title}`);
});
