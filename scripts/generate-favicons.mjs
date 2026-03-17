import sharp from 'sharp';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
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
console.log('✓ favicon.png');

// Generate proper favicon.ico (multi-size ICO with embedded PNGs: 16x16 + 32x32)
const png16 = await sharp(iconSvg).resize(16, 16).png().toBuffer();
const png32 = await sharp(iconSvg).resize(32, 32).png().toBuffer();

function buildIco(images) {
  const count = images.length;
  const headerSize = 6;
  const entrySize = 16;
  const dataOffset = headerSize + entrySize * count;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);     // reserved
  header.writeUInt16LE(1, 2);     // type: 1 = ICO
  header.writeUInt16LE(count, 4); // image count

  let currentOffset = dataOffset;
  const entries = [];
  for (const { buf, size } of images) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(size === 256 ? 0 : size, 0);  // width (0 = 256)
    entry.writeUInt8(size === 256 ? 0 : size, 1);  // height
    entry.writeUInt8(0, 2);        // colorCount
    entry.writeUInt8(0, 3);        // reserved
    entry.writeUInt16LE(1, 4);     // planes
    entry.writeUInt16LE(32, 6);    // bitCount
    entry.writeUInt32LE(buf.length, 8);     // imageSize
    entry.writeUInt32LE(currentOffset, 12); // imageOffset
    entries.push(entry);
    currentOffset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...images.map(i => i.buf)]);
}

const icoBuffer = buildIco([
  { buf: png16, size: 16 },
  { buf: png32, size: 32 },
]);

// Overwrite the Next.js default favicon.ico in src/app/
writeFileSync(resolve(root, 'src/app/favicon.ico'), icoBuffer);
console.log('✓ src/app/favicon.ico (16x16 + 32x32)');

console.log('\n✅ All favicon assets generated in public/');

