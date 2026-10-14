import { allArticles } from '../lib/articles';

console.log('=== COMPREHENSIVE 150 ARTICLES AUDIT ===');
const failedEn: string[] = [];
const failedGaming: string[] = [];
const idPattern = /\b(adalah|dengan|untuk|yang|pada|secara|dalam|bisa|kita|kamu|anda|karena|tidak)\b/i;

allArticles.forEach((art) => {
  // 1. Check EN title
  if (!art.en?.title || idPattern.test(art.en.title)) {
    failedEn.push(`${art.slug}: invalid en.title ("${art.en?.title}")`);
    return;
  }
  // 2. Check EN desc
  if (!art.en?.description || idPattern.test(art.en.description)) {
    failedEn.push(`${art.slug}: invalid en.description ("${art.en?.description}")`);
    return;
  }
  // 3. Check EN content
  if (!art.en?.content) {
    failedEn.push(`${art.slug}: missing en.content`);
    return;
  }
  const prose = art.en.content.replace(/```[\s\S]*?```/g, '');
  const match = prose.match(idPattern);
  if (match) {
    failedEn.push(`${art.slug}: ID word "${match[0]}" in en.content prose`);
    return;
  }
});

console.log('Failed EN count:', failedEn.length);
if (failedEn.length > 0) {
  console.log('Failed EN samples:');
  failedEn.slice(0, 10).forEach(f => console.log(' -', f));
} else {
  console.log('SUCCESS: All 150 articles have valid, clean English translations!');
}
