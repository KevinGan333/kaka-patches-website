import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KaKa Patches | Custom Patch Manufacturer for B2B Buyers",
  description: "KaKa Patches manufactures custom embroidered, woven, PVC, and chenille patches for apparel brands, sports teams, uniforms, events, clubs, and promotional buyers.",
  openGraph: { title: "KaKa Patches | Custom Patch Manufacturer for B2B Buyers", description: "KaKa Patches manufactures custom embroidered, woven, PVC, and chenille patches for B2B buyers worldwide.", url: "https://www.kakapatches.com", siteName: "KaKa Patches", type: "website" as const },
  robots: { index: true, follow: true } as const,
};

function CheckIcon() { return <svg className="h-5 w-5 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>; }

const patchTypes = [
  { t:"Custom Embroidered Patches", d:"Classic stitched texture — uniforms, jackets, caps, clubs, brand merchandise.", h:"/products/custom-embroidered-patches", img:"/images/products/custom-embroidered-patches.webp", alt:"Custom embroidered patches for uniforms, caps and apparel brands" },
  { t:"Custom Woven Patches", d:"Smooth flat finish — perfect for small text, fine logos, clothing labels and premium apparel.", h:"/products/custom-woven-patches", img:"/images/products/custom-woven-patches.webp", alt:"Custom woven patches with fine detail for clothing labels and premium apparel" },
  { t:"Custom PVC Patches", d:"Waterproof durable rubber — outdoor gear, tactical products, sportswear and bags.", h:"/products/custom-pvc-patches", img:"/images/products/custom-pvc-patches.webp", alt:"Custom PVC patches for outdoor gear, tactical products and bags" },
  { t:"Custom Chenille Patches", d:"Soft fuzzy varsity texture — letterman jackets, school apparel, fashion graphics.", h:"/products/custom-chenille-patches", img:"/images/products/custom-chenille-patches.webp", alt:"Custom chenille patches for varsity jackets, school apparel and fashion graphics" },
  { t:"Printed Patches", d:"Full-color printed designs for detailed artwork and photographic reproduction.", h:"/request-a-quote", img:"/images/products/printed-patches.webp", alt:"Printed custom patches for detailed logos, colorful graphics and promotional products" },
  { t:"Leather Patches", d:"Premium leather patches for hats, bags, jackets and high-end brand labels.", h:"/request-a-quote", img:"/images/products/leather-patches.webp", alt:"Custom leather patches for hats, denim, bags and premium apparel branding" },
  { t:"Velcro Patches", d:"Hook-and-loop removable patches — tactical gear, uniforms and interchangeable badges.", h:"/request-a-quote", img:"/images/products/velcro-patches.webp", alt:"Custom Velcro patches for uniforms, tactical gear and removable patch applications" },
  { t:"Patch Backing Options", d:"Sew-on, iron-on, Velcro, adhesive and magnetic — choose what fits your product.", h:"/request-a-quote", img:"/images/products/patch-backing-options.webp", alt:"Patch backing options including sew-on, iron-on, adhesive and Velcro backing" },
];

const capabilities = [
  { t:"Artwork Review", d:"Our team reviews your logo, sketch or design before production to ensure the best patch results for your project." },
  { t:"Multiple Materials & Backing", d:"Embroidered, woven, PVC, chenille, leather and printed patches with sew-on, iron-on, Velcro or adhesive backing." },
  { t:"Bulk Order & Repeat Orders", d:"Scalable production from 100 to 100,000+ pieces with consistent quality, color matching and on-time delivery." },
  { t:"Quality Inspection", d:"Every patch is inspected for stitching, color, backing and finishing before packaging and shipment to your destination." },
];

const applications = [
  { t:"Apparel Brands", d:"Add signature branding to jackets, denim, caps, t-shirts and accessories." },
  { t:"Sports Teams", d:"Team logos, championship badges, chenille letters and fan merchandise." },
  { t:"Uniform Suppliers", d:"Durable identification patches for workwear, staff, school and security programs." },
  { t:"Clubs & Events", d:"Membership badges, event commemoratives and promotional giveaways." },
  { t:"Tactical & Outdoor Gear", d:"Waterproof PVC and Velcro-backed patches for backpacks, camping and tactical equipment." },
  { t:"Promotional Products", d:"Branded patches for corporate gifts, trade shows and marketing campaigns." },
];

const reviews = [
  { text:"Ordered 500 embroidered patches for our uniform program. Quality was consistent across every piece. The artwork review process caught a detail I missed. Will reorder.", author:"B2B Uniform Supplier" },
  { text:"The woven patches exceeded our expectations — the small text on our brand labels came out perfectly clean. Communication was professional throughout.", author:"Fashion Brand Buyer" },
  { text:"We needed PVC patches for our outdoor gear line. KaKa Patches recommended the right backing and the 3D effect looks great. Production was on schedule.", author:"Outdoor Products Company" },
];

const faqs = [
  { q:"What patch types do you manufacture?", a:"We manufacture embroidered patches (classic stitched), woven patches (smooth fine-detail), PVC patches (durable waterproof), chenille patches (soft fuzzy varsity), printed patches, and leather patches. Each type suits different design and application needs." },
  { q:"Can I request a quote without artwork?", a:"Yes. You can submit your basic requirements now and send artwork later. Our team will still review your request and provide preliminary pricing and recommendations." },
  { q:"What backing options are available?", a:"Sew-on (permanent), iron-on (heat-seal), Velcro (removable), adhesive (temporary), and magnetic. We help you choose the right backing based on your product and how end users will apply the patch." },
  { q:"Do you support bulk orders?", a:"Yes. We support B2B bulk orders from 100 to 100,000+ pieces. Scaled pricing applies to larger quantities. Repeat orders maintain the same quality and color consistency." },
  { q:"How do I choose between embroidered and woven patches?", a:"Embroidered patches have a raised textured look — best for classic logos, uniforms and jackets. Woven patches have a smooth flat surface — best for small text, fine details and clothing labels. Our team can recommend based on your design." },
  { q:"Can you help review my artwork?", a:"Yes. Our team provides free artwork review for B2B orders. We check your design for patch production suitability and suggest adjustments before production begins." },
];

export default function Home() {
  return (
    <main className="bg-white text-slate-900">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_-15%,rgba(37,99,235,0.08),transparent)]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-8 py-24 md:grid-cols-2 md:items-center md:py-32">
          <div className="max-w-xl">
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Custom Patches for <span className="text-blue-400">Brands, Teams &amp; Uniform Suppliers</span>
            </h1>
            <p className="mt-6 text-base leading-7 text-slate-300/80 md:text-lg md:leading-8">
              KaKa Patches manufactures embroidered, woven, PVC and chenille patches for apparel brands, sports teams, uniform suppliers and promotional buyers. Factory-direct support with artwork review and bulk order service.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              {["Factory-direct production","Free artwork review","Bulk order support","Fast sampling"].map(l=>(<span key={l} className="flex items-center gap-2"><CheckIcon/>{l}</span>))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/request-a-quote" className="inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-9 py-4 text-[15px] font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-500 hover:-translate-y-0.5">Request a Quote<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></Link>
              <Link href="/products" className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/20 px-9 py-4 text-[15px] font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.04]">View Patch Types</Link>
            </div>
          </div>
          {/* Visual — patch collage */}
          <div className="relative mx-auto hidden h-[460px] w-full max-w-[500px] md:block">
            <div className="absolute inset-0 rounded-3xl border border-white/[0.05] bg-white/[0.008]" />
            <div className="absolute left-10 top-8 w-36 rotate-[-4deg]"><div className="aspect-square rounded-full bg-gradient-to-br from-blue-800 to-blue-950 border-[5px] border-blue-400/30 shadow-2xl flex items-center justify-center"><span className="text-3xl font-black text-white">KP</span></div></div>
            <div className="absolute right-8 top-16 w-40 rotate-[3deg]"><div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-indigo-800 to-indigo-950 border-3 border-indigo-300/20 shadow-xl flex items-center justify-center"><span className="text-lg font-black text-white">WOVEN</span></div></div>
            <div className="absolute left-14 bottom-18 w-36 rotate-[-2deg]"><div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-900 border-3 border-cyan-300/20 shadow-xl flex items-center justify-center" style={{clipPath:"polygon(50% 0%,95% 10%,95% 80%,50% 100%,5% 80%,5% 10%)"}}><span className="text-xl font-black text-white">PVC</span></div></div>
            <div className="absolute right-10 bottom-8 w-36 rotate-[6deg]"><div className="aspect-square rounded-2xl bg-gradient-to-br from-violet-800 to-violet-950 border-4 border-violet-300/20 shadow-2xl flex items-center justify-center"><span className="text-6xl font-black text-white" style={{textShadow:"4px 4px 0 rgba(0,0,0,0.3)"}}>V</span></div></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-900/90 px-5 py-3 shadow-2xl backdrop-blur-xl">
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Factory Direct</p>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]"><span className="text-slate-400">Types</span><span className="text-right font-bold text-white">8</span><span className="text-slate-400">Backings</span><span className="text-right font-bold text-white">5+</span><span className="text-slate-400">MOQ</span><span className="text-right font-bold text-white">100</span><span className="text-slate-400">Lead</span><span className="text-right font-bold text-white">2-3wk</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT CATEGORIES ═══ */}
      <section className="py-28">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Product Categories</p><h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">Explore Custom Patch Types</h2></div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {patchTypes.map(p=>(<Link key={p.t} href={p.h} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl"><div className="aspect-square bg-slate-50 overflow-hidden">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.img} alt={p.alt} className="h-full w-full object-cover" loading="lazy" /></div><div className="p-6"><h3 className="font-bold">{p.t}</h3><p className="mt-2 text-sm leading-7 text-slate-500">{p.d}</p><span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition group-hover:gap-2">View Details<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></span></div></Link>))}
          </div>
        </div>
      </section>

      {/* ═══ FACTORY CAPABILITY ═══ */}
      <section className="bg-slate-50 py-28">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Factory Capability</p><h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">Factory-Direct Patch Manufacturing for Bulk Orders</h2></div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(c=>(<div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><CheckIcon/></div><h3 className="text-lg font-bold">{c.t}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{c.d}</p></div>))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
      <section className="py-28">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">How It Works</p><h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">How Custom Patch Orders Work</h2></div>
          <div className="mt-16 grid gap-6 md:grid-cols-4">
            {["Upload artwork or send it later","Choose patch type, size and backing","Get quote and confirm details","Start production and delivery"].map((s,i)=>(<div key={s} className="text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-bold text-slate-400">{i+1}</div><h3 className="mt-5 text-base font-bold">{s}</h3></div>))}
          </div>
          <div className="mt-10 text-center"><Link href="/custom-process" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Learn about our process →</Link></div>
        </div>
      </section>

      {/* ═══ APPLICATIONS ═══ */}
      <section className="bg-slate-50 py-28">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Applications</p><h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">Made for Real B2B Applications</h2></div>
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map(a=>(<div key={a.t} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><h3 className="text-lg font-bold">{a.t}</h3><p className="mt-2 text-sm leading-7 text-slate-500">{a.d}</p></div>))}
          </div>
          <p className="mt-8 text-center"><Link href="/applications" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all applications →</Link></p>
        </div>
      </section>

      {/* ═══ CUSTOM OPTIONS ═══ */}
      <section className="py-28">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Full Customization</p><h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">Customize Every Detail</h2></div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Patch size","Thread colors","Border type","Backing type","Material","Packaging"].map(o=>(<div key={o} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-7 py-5 shadow-sm"><CheckIcon/><span className="text-base font-semibold">{o}</span></div>))}
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section className="bg-slate-950 py-28 text-white">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">Testimonials</p><h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">Trusted by Patch Buyers for Bulk Custom Orders</h2></div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {reviews.map(r=>(<div key={r.author} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm"><div className="flex gap-1 text-amber-400 mb-4">{"★★★★★"}</div><p className="text-sm leading-7 text-slate-300">"{r.text}"</p><p className="mt-5 text-sm font-bold text-slate-400">— {r.author}</p></div>))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-28">
        <div className="mx-auto max-w-3xl px-8">
          <div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">FAQ</p><h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">Frequently Asked Questions</h2></div>
          <div className="mt-16 divide-y divide-slate-200">
            {faqs.map(item=>(<details key={item.q} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-slate-900 hover:text-blue-600 transition">{item.q}<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 text-slate-400 transition group-open:rotate-45 group-open:border-blue-300 group-open:text-blue-600"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg></span></summary><p className="mt-4 pr-12 text-sm leading-7 text-slate-600">{item.a}</p></details>))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="bg-gradient-to-br from-slate-950 to-slate-900 py-28 text-white">
        <div className="mx-auto max-w-3xl px-8 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Ready to Create Your Custom Patches?</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300 max-w-xl mx-auto">Send your artwork or basic requirements. Our team will review your request and reply with a quote.</p>
          <div className="mt-10"><Link href="/request-a-quote" className="inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-10 py-4.5 text-[15px] font-bold text-white shadow-2xl shadow-blue-600/20 transition hover:bg-blue-500 hover:-translate-y-0.5">Request a Quote<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></Link></div>
        </div>
      </section>
    </main>
  );
}
