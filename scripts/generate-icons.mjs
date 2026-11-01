import sharp from "sharp";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Regenerate every icon from the approved artwork, preserving the brand.
const source = path.join(root, "public/images/brand/kaka-patches-site-icon.webp");

async function png(size) {
  return sharp(source)
    .resize(size, size, { fit: "contain", background: "#ffffff" })
    .flatten({ background: "#ffffff" }).png().toBuffer();
}

async function main() {
  for (const [file, size] of [
    ["public/favicon-48x48.png", 48],
    ["public/icon-96x96.png", 96],
    ["public/icon-192x192.png", 192],
    ["public/icon-512x512.png", 512],
    ["public/apple-touch-icon.png", 180],
    ["app/icon.png", 512],
  ]) {
    await writeFile(path.join(root, file), await png(size));
    console.log(`Created: ${file} (${size}x${size})`);
  }

  // Real ICO container with PNG frames for modern browser support.
  const sizes = [16, 32, 48];
  const frames = await Promise.all(sizes.map(png));
  const directory = Buffer.alloc(6 + 16 * sizes.length);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(sizes.length, 4);
  let offset = directory.length;
  for (let i = 0; i < sizes.length; i++) {
    const entry = 6 + 16 * i;
    directory[entry] = sizes[i];
    directory[entry + 1] = sizes[i];
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(frames[i].length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += frames[i].length;
  }
  await writeFile(path.join(root, "public/favicon.ico"), Buffer.concat([directory, ...frames]));

  // Keep existing SVG URLs, embedding the approved artwork without redrawing it.
  const image = (await png(512)).toString("base64");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>KaKa Patches</title><image width="512" height="512" href="data:image/png;base64,${image}"/></svg>\n`;
  for (const file of ["public/icon.svg", "app/icon.svg"]) {
    await writeFile(path.join(root, file), svg);
  }
  console.log("Created: public/favicon.ico, public/icon.svg, app/icon.svg");
}

main().catch((error) => { console.error(error); process.exit(1); });
