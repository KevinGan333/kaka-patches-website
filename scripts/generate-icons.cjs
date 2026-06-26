const sharp = require("sharp");
const path = require("path");

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="64" fill="#0f172a"/>
  <circle cx="256" cy="180" r="130" fill="none" stroke="#3b82f6" stroke-width="18" stroke-dasharray="22 16"/>
  <circle cx="256" cy="180" r="90" fill="none" stroke="#60a5fa" stroke-width="6" stroke-dasharray="10 12"/>
  <text x="256" y="210" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="140" fill="#ffffff" letter-spacing="-4">KP</text>
  <text x="256" y="340" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="26" fill="#93c5fd" letter-spacing="6">PATCHES</text>
  <circle cx="256" cy="180" r="155" fill="none" stroke="#f59e0b" stroke-width="5" stroke-dasharray="8 14" opacity="0.5"/>
</svg>`;

const sizes = [
  { name: "favicon-48x48.png", size: 48, pub: true },
  { name: "icon-96x96.png", size: 96, pub: true },
  { name: "icon-192x192.png", size: 192, pub: true },
  { name: "icon-512x512.png", size: 512, pub: true },
  { name: "apple-touch-icon.png", size: 180, pub: true },
  { name: "icon.png", size: 512, pub: false },
];

async function main() {
  for (const s of sizes) {
    const dir = s.pub ? "public" : "app";
    const outPath = path.join(__dirname, "..", dir, s.name);
    await sharp(Buffer.from(svgContent)).resize(s.size, s.size).png().toFile(outPath);
    console.log(`Created: ${dir}/${s.name} (${s.size}x${s.size})`);
  }
  // Create favicon.ico (48x48 PNG inside ICO is fine for modern use)
  const icoPath = path.join(__dirname, "..", "public", "favicon.ico");
  await sharp(Buffer.from(svgContent)).resize(48, 48).png().toFile(icoPath);
  console.log("Created: public/favicon.ico (48x48)");
  console.log("Done!");
}

main().catch(err => { console.error(err); process.exit(1); });
