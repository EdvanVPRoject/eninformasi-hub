import { allArticles, getCategoriesWithCount } from '../lib/articles';

console.log('=== CATEGORIES WITH COUNT ===');
const categories = getCategoriesWithCount();
categories.forEach(c => console.log(`- [${c.id}] ${c.label}: ${c.count} items`));

console.log('\n=== VERIFYING GAMING ARTICLES IN GAMING-ESPORTS ===');
const gamingArticles = allArticles.filter(a => a.category === 'gaming-esports');
console.log(`Total gaming articles: ${gamingArticles.length} (expected 41)`);

const upcomingTitles = [
  'GTA 6',
  'Nintendo Switch 2',
  'Monster Hunter Wilds',
  'The Witcher 4',
  'Ghost of Yōtei',
  'Crimson Desert',
  'Rumor Half-Life 3',
  'PS5 Pro'
];
upcomingTitles.forEach(t => {
  const found = gamingArticles.find(a => a.title.includes(t));
  console.log(`- ${t}: ${found ? '✅ FOUND in gaming-esports (' + found.slug + ')' : '❌ NOT FOUND'}`);
});

console.log('\n=== VERIFYING ENGLISH TOC & STEPS ===');
let missingEnToc = 0;
let missingEnSteps = 0;

allArticles.forEach(a => {
  if (!a.en?.toc || a.en.toc.length === 0) {
    missingEnToc++;
  }
  if (a.steps && a.steps.length > 0 && (!a.en?.steps || a.en.steps.length === 0)) {
    missingEnSteps++;
  }
});

console.log(`Articles missing English TOC: ${missingEnToc} (expected 0)`);
console.log(`Articles missing English Steps: ${missingEnSteps} (expected 0)`);

// Test CrewAI English TOC
const crewai = allArticles.find(a => a.slug === 'cara-bikin-autonomous-ai-agent-sendiri-crewai');
console.log('\nCrewAI English Title:', crewai?.en?.title);
console.log('CrewAI English TOC:');
crewai?.en?.toc?.forEach(item => console.log(`  - [${item.id}] ${item.title}`));
console.log('CrewAI English Steps:');
crewai?.en?.steps?.forEach(item => console.log(`  - [${item.id}] ${item.label}`));
