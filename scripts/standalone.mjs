import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Keep the showcase directly openable without a server, including its Three.js runtime.
const root = resolve(import.meta.dirname, '..');
let html = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
html = html.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, (_, path) => `<script type="module">${readFileSync(resolve(root, `dist${path}`), 'utf8').replaceAll('</script', '<\\/script')}</script>`);
html = html.replace(/<link rel="stylesheet" crossorigin href="([^"]+)">/, (_, path) => {
  const logo = readFileSync(resolve(root, 'public/ntl-logo.png')).toString('base64');
  const css = readFileSync(resolve(root, `dist${path}`), 'utf8').replaceAll('url(/ntl-logo.png)', `url("data:image/png;base64,${logo}")`);
  return `<style>${css}</style>`;
});
html = html.replace('href="/favicon.svg"', `href="data:image/svg+xml,${encodeURIComponent(readFileSync(resolve(root, 'public/favicon.svg'), 'utf8'))}"`);
writeFileSync(resolve(root, 'poap.html'), html);
console.log('Created poap.html — open directly in a browser.');
