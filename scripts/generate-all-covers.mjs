import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCoverSvg } from './svg-cover-generator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

async function main() {
  const coversDir = path.join(ROOT_DIR, 'public', 'covers');
  if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
  }

  const entryPath = path.join(ROOT_DIR, 'lib', 'articles.ts');
  const tempPath = path.join(ROOT_DIR, 'scripts', '_temp_covers_bundle.mjs');

  await esbuild.build({
    entryPoints: [entryPath],
    bundle: true,
    format: 'esm',
    outfile: tempPath,
    target: 'node20',
    platform: 'node',
  });

  const tempUrl = `file:///${tempPath.replace(/\\/g, '/')}`;
  const { allArticles } = await import(tempUrl);

  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }

  console.log(`Generating text-free architectural SVG covers for ${allArticles.length} articles...`);

  for (const article of allArticles) {
    const svg = generateCoverSvg({
      title: article.title,
      category: article.category,
      author: 'EdvanVPRoject',
      tags: article.tags || [],
    });

    const filePath = path.join(coversDir, `${article.slug}.svg`);
    fs.writeFileSync(filePath, svg, 'utf8');
  }

  console.log(`✅ Successfully regenerated ${allArticles.length} text-free SVG covers in public/covers/!`);
}

main().catch((err) => {
  console.error('❌ Failed to generate covers:', err);
  process.exit(1);
});
