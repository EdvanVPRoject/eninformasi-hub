import { allArticles } from '../lib/articles';

const withSteps = allArticles.filter(a => a.steps && a.steps.length > 0);
console.log('Total articles with steps:', withSteps.length);

const missingEnSteps = withSteps.filter(a => !a.en?.steps || a.en.steps.length === 0);
console.log('Articles with steps but missing en.steps:', missingEnSteps.length);

if (missingEnSteps.length > 0) {
  console.log('First 5 missing en.steps:');
  missingEnSteps.slice(0, 5).forEach(a => console.log(`- ${a.slug} (${a.steps?.length} steps)`));
}
