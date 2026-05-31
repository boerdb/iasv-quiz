import { readFileSync } from "fs";
import sharp from "sharp";

for (const size of [192, 512]) {
  const svg = readFileSync(`public/icons/icon-${size}.svg`);
  await sharp(svg).resize(size, size).png().toFile(`public/icons/icon-${size}.png`);
  console.log(`Created icon-${size}.png`);
}

const svg512 = readFileSync("public/icons/icon-512.svg");
await sharp(svg512)
  .resize(410, 410)
  .png()
  .extend({
    top: 51,
    bottom: 51,
    left: 51,
    right: 51,
    background: { r: 20, g: 184, b: 166, alpha: 1 },
  })
  .toFile("public/icons/icon-512-maskable.png");
console.log("Created icon-512-maskable.png");
