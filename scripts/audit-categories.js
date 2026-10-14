const fs = require('fs');
const path = require('path');

const dataFiles = [
  'tutorials-1.ts', 'tutorials-2.ts', 'tutorials-3.ts',
  'gaming-1.ts', 'articles-1.ts', 'articles-2.ts',
  'articles-3.ts', 'gaming-2.ts', 'upcoming-trends.ts', 'future-tech.ts'
];

let all = [];
for (const f of dataFiles) {
  const content = fs.readFileSync(path.join('./lib/data', f), 'utf8');
  const blocks = content.split(/\{\s*["']?slug["']?:/);
  for (let i = 1; i < blocks.length; i++) {
    const b = blocks[i];
    const slugMatch = b.match(/^\s*['"]([^'"]+)['"]/);
    const titleMatch = b.match(/["']?title["']?:\s*['"]([^'"]+)['"]/);
    const categoryMatch = b.match(/["']?category["']?:\s*['"]([^'"]+)['"]/);
    const postTypeMatch = b.match(/["']?postType["']?:\s*['"]([^'"]+)['"]/);
    all.push({
      file: f,
      slug: slugMatch ? slugMatch[1] : 'unknown',
      title: titleMatch ? titleMatch[1] : 'unknown',
      category: categoryMatch ? categoryMatch[1] : 'unknown',
      postType: postTypeMatch ? postTypeMatch[1] : 'unknown',
    });
  }
}

// Proposed new normalization:
function normalizeCategoryProposed(rawCat) {
  switch (rawCat) {
    // Gaming & Esports
    case 'pubg-mobile':
    case 'mobile-legends':
    case 'honor-of-kings':
    case 'valorant':
    case 'counter-strike-2':
    case 'free-fire':
    case 'delta-force':
    case 'genshin-impact':
    case 'dota-2':
    case 'esports-analysis':
    case 'game-industry':
    case 'esports-lifestyle':
    case 'hardware-gaming':
    case 'game-review':
    case 'game-psychology':
    case 'game-dev':
    case 'gaming':
    case 'gaming-esports':
    case 'upcoming-gaming':
    case 'upcoming-trends':
    case 'upcoming':
    case 'upcoming-booming':
      return 'gaming-esports';

    // Technology & Hardware Gadgets
    case 'future-hardware':
    case 'gadgets':
    case 'tech-gadgets':
      return 'tech-gadgets';

    // Dev Tools, Workflow & Automation
    case 'automation':
    case 'developer-tools':
    case 'devops':
    case 'web-dev':
    case 'database-dev':
    case 'tools-automation':
      return 'tools-automation';

    // AI Agents & Otomasi
    case 'ai-rag':
    case 'ai-infrastructure':
    case 'audio-ai':
    case 'computer-vision':
    case 'iot-smarthome':
    case 'data-science':
    case 'generative-ai':
    case 'ai-agents':
      return 'ai-agents';

    // LLM & Model Cerdas
    case 'llm-models':
      return 'llm-models';

    // Prompt Engineering
    case 'prompting':
      return 'prompting';

    // Rig Local AI & Komputasi
    case 'hardware-setup':
      return 'hardware-setup';

    default:
      return rawCat;
  }
}

const grouped = {};
for (const a of all) {
  const cat = normalizeCategoryProposed(a.category);
  if (!grouped[cat]) grouped[cat] = [];
  grouped[cat].push(a);
}

console.log('=== SUMMARY OF CATEGORIES (PROPOSED) ===');
for (const [cat, items] of Object.entries(grouped)) {
  console.log(`\n### ${cat.toUpperCase()} (${items.length} items):`);
  items.forEach((item, idx) => {
    console.log(`  ${idx + 1}. [${item.postType}] [raw: ${item.category}] ${item.title}`);
  });
}
