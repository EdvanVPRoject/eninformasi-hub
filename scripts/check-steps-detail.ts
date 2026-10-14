import { allArticles } from '../lib/articles';

const missing = allArticles.filter(a => a.steps && a.steps.length > 0 && (!a.en?.steps || a.en.steps.length === 0));
const fileMap: Record<string, number> = {};

console.log(`Total missing en.steps: ${missing.length}`);
missing.forEach(a => {
  console.log(`- [${a.category}] ${a.slug}: "${a.steps?.[0]?.label}"`);
});
