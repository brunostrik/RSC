const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');
const sharp = require('sharp');

async function main() {
  const root = path.join(__dirname, '..');
  const srcPng = path.join(root, 'renderer', 'rsc.png');
  const outDir = path.join(root, 'build');
  const outIco = path.join(outDir, 'icon.ico');
  const tmpPng = path.join(outDir, 'icon-256.png');

  if (!fs.existsSync(srcPng)) {
    throw new Error(`Arquivo não encontrado: ${srcPng}`);
  }

  fs.mkdirSync(outDir, { recursive: true });

  // png-to-ico requires a square PNG; pad logo into a square.
  await sharp(srcPng)
    .resize(256, 256, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toFile(tmpPng);

  const png = fs.readFileSync(tmpPng);
  const ico = await pngToIco(png);
  fs.writeFileSync(outIco, ico);

  console.log(`OK: ${path.relative(root, outIco)}`);
}

main().catch((e) => {
  console.error(e?.stack || e?.message || e);
  process.exit(1);
});

