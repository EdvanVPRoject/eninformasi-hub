const { execSync } = require('child_process');

if (process.env.BUILDING_OPEN_NEXT === '1') {
  console.log('⚡ [Build Step] OpenNext runner detected: executing next build...');
  execSync('npx next build', { stdio: 'inherit' });
} else {
  console.log('🚀 [Build Step] Starting Cloudflare OpenNext build pipeline...');
  process.env.BUILDING_OPEN_NEXT = '1';
  execSync('npx @opennextjs/cloudflare build', { stdio: 'inherit' });
}
