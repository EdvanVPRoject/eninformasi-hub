import { allArticles } from '../lib/articles';

const gamingKeywords = /\b(game|gaming|esports|steam|ps5|moba|rpg|fps|valorant|pubg|dota|mlbb|gta|nintendo)\b/i;

console.log('=== ARTICLES WITH GAMING KEYWORDS BUT NOT IN GAMING-ESPORTS ===');
allArticles.forEach(a => {
  if (a.category !== 'gaming-esports') {
    const isGaming = gamingKeywords.test(a.title) || gamingKeywords.test(a.slug) || a.tags.some(t => gamingKeywords.test(t));
    if (isGaming) {
      console.log(`- [${a.category}] ${a.slug}: "${a.title}"`);
    }
  }
});
