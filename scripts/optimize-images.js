const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = path.join(__dirname, '..', 'public', 'assets');

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, ext);

  const avifOut = path.join(dir, `${base}.avif`);
  const webpOut = path.join(dir, `${base}.webp`);

  await sharp(filePath).avif({ quality: 60 }).toFile(avifOut);
  await sharp(filePath).webp({ quality: 70 }).toFile(webpOut);
  console.log('Optimized', filePath);
}

async function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) await walk(p);
    else await processFile(p);
  }
}

(async () => {
  try {
    await walk(SRC_DIR);
    console.log('Image optimization complete');
  } catch (err) {
    console.error('Image optimization failed', err);
    process.exit(1);
  }
})();