import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KaKa Patches | Custom Patch Manufacturer for B2B Buyers",
  description:
    "KaKa Patches manufactures custom embroidered, woven, PVC, and chenille patches for apparel brands, sports teams, uniforms, events, clubs, and promotional buyers.",
  openGraph: {
    title: "KaKa Patches | Custom Patch Manufacturer for B2B Buyers",
    description:
      "KaKa Patches manufactures custom embroidered, woven, PVC, and chenille patches for apparel brands, sports teams, uniforms, events, clubs, and promotional buyers.",
    url: "https://www.kakapatches.com",
    siteName: "KaKa Patches",
    type: "website",
  },
  robots: { index: true, follow: true },
};

/* ───────────────────────────────────────────
   Product Image Placeholder
   ─────────────────────────────────────────── */
function ProductPlaceholder({ type }: { type: "embroidered" | "woven" | "pvc" | "chenille" }) {
  const bg = type === "embroidered" ? "bg-blue-50" : type === "woven" ? "bg-indigo-50" : type === "pvc" ? "bg-cyan-50" : "bg-violet-50";
  const border = type === "embroidered" ? "border-blue-200" : type === "woven" ? "border-indigo-200" : type === "pvc" ? "border-cyan-200" : "border-violet-200";
  const text = type === "embroidered" ? "text-blue-400" : type === "woven" ? "text-indigo-400" : type === "pvc" ? "text-cyan-400" : "text-violet-400";
  const shape = type === "embroidered" ? "rounded-full" : type === "chenille" ? "rounded-2xl" : "rounded-xl";
  return (
    <div className={`flex aspect-square items-center justify-center ${shape} border-2 border-dashed ${border} ${bg}`}>
      <div className="text-center">
        <svg className={`mx-auto h-10 w-10 ${text}`} fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
        <p className={`mt-3 text-xs font-semibold ${text}`}>Product image</p>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   Hero Silhouette
   ─────────────────────────────────────────── */
function HeroSilhouette() {
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-[480px]">
      <div className="absolute inset-0 rounded-3xl border border-white/[0.05] bg-white/[0.01]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56">
        <div className="flex aspect-square items-center justify-center rounded-full border-2 border-dashed border-blue-400/20 bg-blue-50/[0.05]">
          <div className="text-center">
            <svg className="mx-auto h-14 w-14 text-blue-400/30" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <p className="mt-4 text-sm font-medium text-blue-300/30">Product photos coming soon</p>
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full border border-white/[0.03]" />
    </div>
  );
}

/* ───────────────────────────────────────────
   DATA
   ─────────────────────────────────────────── */

const products = [
  { t: "Custom Embroidered Patches", d: "Classic stitched texture — the standard for uniforms, jackets, caps and brand merchandise.", h: "/products/custom-embroidered-patches", bestFor: "Uniforms, clubs, merchandise", kind: "embroidered" as const },
  { t: "Custom Woven Patches", d: "Smooth fine-detail finish for small text, intricate logos and premium apparel labels.", h: "/products/custom-woven-patches", bestFor: "Labels, fine logos, apparel", kind: "woven" as const },
  { t: "Custom PVC Patches", d: "Durable waterproof rubber with 3D relief — built for outdoor, tactical and sports use.", h: "/products/custom-pvc-patches", bestFor: "Outdoor, tactical, sports", kind: "pvc" as const },
  { t: "Custom Chenille Patches", d: "Soft fuzzy texture with iconic varsity look — letterman jackets, teams and fashion.", h: "/products/custom-chenille-patches", bestFor: "Varsity, fashion, letters", kind: "chenille" as const },
];

const applications = [
  { t: "Clothing Brands", d: "Add signature patch branding to jackets, denim, caps and accessories. Woven patches for fine detail, embroidered for classic brand texture.", r: "Woven or Embroidered" },
  { t: "Sports Teams", d: "Team identity patches, championship badges and fan merchandise. Chenille for varsity jackets, embroidered for team logos.", r: "Chenille or Embroidered" },
  { t: "Uniform Suppliers", d: "Durable consistent patches for corporate, hospitality, security and school uniform programs. Embroidered for durability, woven for detailed badges.", r: "Embroidered or Woven" },
];

const trustBlocks = [
  { t: "Artwork Review", d: "Upload your logo, sketch or reference image. Our team reviews it for patch production and provides feedback." },
  { t: "Flexible Customization", d: "Custom size, shape, thread colors, border style, backing type and packaging — tailored to your product." },
  { t: "Bulk Order Support", d: "Scalable production from 100 to 100,000+ pieces with consistent quality, color accuracy and on-time delivery." },
  { t: "Quality Check", d: "Inspection at every stage — material, stitching, color, backing and finishing — before packaging and shipment." },
];

const metrics = [
  { v: "4", l: "Patch types" },
  { v: "100+", l: "Pcs sample orders" },
  { v: "2–3", l: "Weeks production" },
  { v: "Custom", l: "Size, shape & backing" },
];

const faqs = [
  { q: "What patch types do you make?", a: "Four main types: Embroidered (classic stitched texture), Woven (smooth fine-detail), PVC (durable waterproof rubber), and Chenille (soft fuzzy varsity). Each suited for different applications and design needs." },
  { q: "Can you help if my artwork is not ready?", a: "Yes. Upload sketches, reference images or a rough idea — our design team prepares it for patch production at no extra cost for qualifying bulk orders." },
  { q: "What backing options are available?", a: "Sew-on (permanent), iron-on (heat-seal), Velcro (removable), adhesive (temporary), and magnetic. We help you choose based on your product and end-user needs." },
  { q: "What file formats can I upload?", a: "AI, PSD, EPS, PDF, PNG, JPG. Vector files produce the best results for production. Raster images work for initial quoting and review." },
  { q: "How do I get a quote?", a: "Upload your artwork via our Request a Quote page — tell us patch type, size, backing, quantity and deadline. Factory-direct quote typically within 1 business day." },
];

export default function Home() {
  return (
    <main className="bg-[#FDFBF7] text-slate-900">
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#030a1c] to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_-10%,rgba(37,99,235,0.06),transparent)]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-16 px-8 py-28 md:grid-cols-2 md:items-center md:py-36">
          <div className="max-w-xl">
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Custom Patches for{" "}
              <span className="text-blue-400">Brands, Teams &amp; Uniforms</span>
            </h1>
            <p className="mt-6 text-base leading-7 text-slate-300/80 md:text-lg md:leading-8 max-w-lg">
              KaKa Patches manufactures embroidered, woven, PVC and chenille patches for apparel brands, sports teams, uniform suppliers, events and promotional buyers. Factory-direct with artwork support.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-400">
              <span className="flex items-center gap-2"><svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Factory-direct production</span>
              <span className="flex items-center gap-2"><svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Free artwork review</span>
              <span className="flex items-center gap-2"><svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>B2B bulk order support</span>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/request-a-quote" className="inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-9 py-4 text-[15px] font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500">Request a Quote<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></Link>
              <Link href="/products" className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/20 px-9 py-4 text-[15px] font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.04]">View Products</Link>
            </div>
          </div>
          <HeroSilhouette />
        </div>
      </section>

      {/* ═══════════════════════ TRUST STRIP ═══════════════════════ */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-16 gap-y-2 px-8 py-5 text-sm text-slate-500">
          {["100+ pcs sample-friendly","Multiple backing options","Free artwork support","2–3 weeks production"].map(l => (<span key={l} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400"/>{l}</span>))}
        </div>
      </div>

      {/* ═══════════════════════ PRODUCTS ═══════════════════════ */}
      <section className="py-32">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Products</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl">Custom Patch Products</h2>
            <p className="mt-5 text-base leading-7 text-slate-600 md:text-lg md:leading-8">Choose the right patch type based on logo detail, texture, durability, application and backing requirement.</p>
          </div>
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {products.map(p => (
              <Link key={p.h} href={p.h} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="p-6 pb-0"><ProductPlaceholder type={p.kind} /></div>
                <div className="p-6">
                  <h3 className="text-lg font-bold">{p.t}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{p.d}</p>
                  <p className="mt-3 text-xs text-slate-400">Best for: <span className="font-semibold text-slate-700">{p.bestFor}</span></p>
                  <div className="mt-5 flex items-center justify-between"><span className="text-sm font-semibold text-blue-600">Learn More →</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 transition group-hover:bg-blue-50 group-hover:text-blue-600">Quote</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ APPLICATIONS ═══════════════════════ */}
      <section className="bg-gradient-to-b from-[#F7F4EF] to-[#FDFBF7] py-32">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Applications</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl">Built for Real B2B Applications</h2>
          </div>
          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {applications.map(a => (
              <div key={a.t} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <h3 className="text-xl font-bold">{a.t}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{a.d}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{a.r}</div>
                <div className="mt-5"><Link href="/applications" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View Details →</Link></div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">Also supporting events, clubs, outdoor gear brands and promotional projects.{" "}<Link href="/applications" className="font-semibold text-blue-600 hover:text-blue-700">View all applications →</Link></p>
        </div>
      </section>

      {/* ═══════════════════════ PROCESS ═══════════════════════ */}
      <section className="py-32">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">How It Works</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl">From Artwork to Production in 4 Steps</h2>
          </div>
          <div className="mt-20 grid gap-8 md:grid-cols-4">
            {[{ s:1, t:"Upload Artwork", d:"Send your logo or design in any format. We review and provide production feedback." },{ s:2, t:"Choose Patch Options", d:"Select type, size, backing, border and quantity with our team's guidance." },{ s:3, t:"Confirm Digital Proof", d:"Review a detailed mockup of your patch. Approve before production begins." },{ s:4, t:"Start Production", d:"Quality-checked bulk production, packaging and delivery to your destination." }].map(step => (
              <div key={step.s} className="text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-bold text-slate-400">{step.s}</div><h3 className="mt-6 text-lg font-bold">{step.t}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{step.d}</p></div>
            ))}
          </div>
          <div className="mt-12 text-center"><Link href="/custom-process" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Learn more about our process →</Link></div>
        </div>
      </section>

      {/* ═══════════════════════ WHY CHOOSE ═══════════════════════ */}
      <section className="bg-slate-950 py-32 text-white">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Why KaKa Patches</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl">Why B2B Buyers Choose Us</h2>
          </div>
          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trustBlocks.map(b => (<div key={b.t} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-sm"><h3 className="text-lg font-bold">{b.t}</h3><p className="mt-3 text-sm leading-7 text-slate-300">{b.d}</p></div>))}
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map(m => (<div key={m.l} className="rounded-2xl border border-white/[0.06] bg-white/[0.01] py-8 text-center"><p className="text-5xl font-extrabold text-blue-400">{m.v}</p><p className="mt-3 text-sm text-slate-400 uppercase tracking-wider">{m.l}</p></div>))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FAQ ═══════════════════════ */}
      <section className="py-32">
        <div className="mx-auto max-w-3xl px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">FAQ</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl">Frequently Asked Questions</h2>
          </div>
          <div className="mt-20 divide-y divide-slate-200">
            {faqs.map(item => (
              <details key={item.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-bold text-slate-900 hover:text-blue-600 transition">{item.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 text-slate-400 transition group-open:rotate-45 group-open:border-blue-300 group-open:text-blue-600"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg></span>
                </summary>
                <p className="mt-4 pr-16 text-base leading-7 text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FINAL CTA ═══════════════════════ */}
      <section className="bg-gradient-to-br from-slate-950 to-slate-900 py-32 text-white">
        <div className="mx-auto max-w-4xl px-8 text-center">
          <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl">Ready to Start Your Custom Patch Project?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg md:leading-8">Upload your artwork, choose your patch options, and tell us your quantity. Our team will review your requirements and prepare a factory quote — typically within 1 business day.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-10 py-4.5 text-[15px] font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-500">Request a Quote<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></Link>
            <Link href="/products" className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/20 px-10 py-4.5 text-[15px] font-bold text-white transition hover:border-white/35 hover:bg-white/[0.04]">View Products</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
