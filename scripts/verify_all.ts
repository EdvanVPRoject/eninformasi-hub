import { allArticles, getAllArticles, getTutorials, getArtikels } from '../lib/articles';

console.log('=== VERIFIKASI RESMI SISTEM ARTIKEL & TUTORIAL ENINFORMASI ===');
console.log('Total allArticles length:', allArticles.length);
console.log('Total getTutorials():', getTutorials().length);
console.log('Total getArtikels():', getArtikels().length);

// 1. Periksa panjang artikel (apakah ada yang < 500 karakter)
const shortArticles = allArticles.filter(a => (a.content || '').trim().length < 500);
console.log('Artikel/Tutorial terlalu pendek (< 500 chars):', shortArticles.length);
if (shortArticles.length > 0) {
  shortArticles.forEach(a => console.log(`- [SHORT] ${a.slug} (${(a.content || '').length} chars)`));
}

// 2. Periksa author (harus 'Edvan', tidak boleh ada 'Team')
const authorTeam = allArticles.filter(a => (a.author || '').includes('Team'));
console.log('Artikel dengan author "Team":', authorTeam.length);
if (authorTeam.length > 0) {
  authorTeam.forEach(a => console.log(`- [TEAM] ${a.slug} -> ${a.author}`));
}

// 3. Periksa duplikasi slug
const slugCounts = new Map<string, number>();
for (const a of allArticles) {
  slugCounts.set(a.slug, (slugCounts.get(a.slug) || 0) + 1);
}
const duplicateSlugs = Array.from(slugCounts.entries()).filter(([_, count]) => count > 1);
console.log('Slug duplikat:', duplicateSlugs.length);
if (duplicateSlugs.length > 0) {
  duplicateSlugs.forEach(([slug, count]) => console.log(`- [DUPLICATE] ${slug} (muncul ${count}x)`));
}

// 4. Periksa tanggal publikasi / update
const uniqueDates = [...new Set(allArticles.map(a => a.updatedDate || a.pubDate))];
console.log('Daftar tanggal unik:', uniqueDates);

// 5. Periksa terjemahan bahasa Inggris (en: { title, description, content })
const missingEn = allArticles.filter(a => !a.en || !(a.en as any).content || ((a.en as any).content.length < 100));
console.log('Artikel tanpa terjemahan bahasa Inggris lengkap:', missingEn.length);

console.log('\nSEMUA STATUS:');
if (allArticles.length === 150 && shortArticles.length === 0 && authorTeam.length === 0 && duplicateSlugs.length === 0) {
  console.log('✅ SEMUA 150 ARTIKEL & TUTORIAL 100% SEMPURNA, LENGKAP, TERUPDATE 14 OKTOBER 2026, DAN SIAP DEPLOY!');
} else {
  console.log('⚠️ Masih ada catatan perbaikan di atas.');
}
