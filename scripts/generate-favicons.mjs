import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const iconSvg = readFileSync(resolve(root, 'public/logo-icon.svg'));

mkdirSync(resolve(root, 'public'), { recursive: true });

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'og-image-icon.png', size: 1024 },
];

for (const { name, size } of sizes) {
  await sharp(iconSvg)
    .resize(size, size)
    .png()
    .toFile(resolve(root, 'public', name));
  console.log(`✓ ${name} (${size}x${size})`);
}

await sharp(iconSvg)
  .resize(32, 32)
  .png()
  .toFile(resolve(root, 'public', 'favicon.png'));
console.log('✓ favicon.png (use as favicon.ico source)');

console.log('\n✅ All favicon assets generated in public/');
