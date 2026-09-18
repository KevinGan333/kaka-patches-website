import assert from "node:assert/strict";
import { spawn } from "node:child_process";

// Run against the built site without submitting any inquiry or sending email.
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3199"]);
const ready = new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error("Server startup timed out")), 20000);
  server.stdout.on("data", (chunk) => {
    if (chunk.toString().includes("Ready")) { clearTimeout(timeout); resolve(); }
  });
  server.on("error", reject);
  server.on("exit", (code) => { clearTimeout(timeout); reject(new Error("Server exited: " + code)); });
});
const clean = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').trim();
try {
  await ready;
  const response = await fetch("http://127.0.0.1:3199/products/custom-velcro-patches");
  assert.equal(response.status, 200);
  const html = await response.text();
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
  assert.equal((main.match(/<h1\b/g) || []).length, 1);
  assert.equal((main.match(/<section\b/g) || []).length, 10);
  assert.equal(clean(html.match(/<title>([\s\S]*?)<\/title>/)[1]), "Custom Velcro Patches Manufacturer | KaKa Patches");
  const schemas = [...main.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((x) => JSON.parse(x[1]));
  const faq = schemas.find((x) => x["@type"] === "FAQPage");
  const visible = [...main.matchAll(/<details[^>]*>[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>\s*<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map((x) => ({ q: clean(x[1]).replace(/\+$/, "").trim(), a: clean(x[2]) }));
  assert.deepEqual(visible, faq.mainEntity.map((x) => ({ q: x.name, a: x.acceptedAnswer.text })));
  assert(!/custom custom/i.test(clean(main)));
  const sitemap = await (await fetch("http://127.0.0.1:3199/sitemap.xml")).text();
  assert.equal(sitemap.split("https://www.kakapatches.com/products/custom-velcro-patches").length - 1, 1);
  const pvc = await (await fetch("http://127.0.0.1:3199/products/custom-pvc-patches")).text();
  assert(pvc.includes("Review Product Details Before Requesting a Quote"));
  assert(pvc.includes("Real Production, Real Quality Control"));
  console.log("PASS: HTTP 200, exact title, single H1, ten sections, eight matching FAQs, one sitemap entry, PVC layout retained.");
  console.log([...main.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((x) => clean(x[1])));
} finally {
  server.kill("SIGTERM");
}
