import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import QuoteForm from "@/components/QuoteForm";

const faqs = [
  ["Do you make the hats too, or just the patches?", "We produce both. Your caps and patches are made and attached in one order — no coordinating two suppliers."],
  ["What is the minimum order for hats and patches together?", "1,000 pcs for a combined hat and patch order. Patch-only orders start at 200 pcs per design."],
  ["What type of patch is best for baseball caps?", "Embroidered patches are the classic choice for baseball caps. PVC works well for outdoor and trucker caps."],
  ["Can PVC patches be used on hats?", "Yes. PVC patches are durable, weatherproof, and stand out well on trucker and outdoor caps."],
  ["What backing is most durable for hat patches?", "Sew-on backing is the most permanent. Choose velcro (hook and loop) if you want patches that can be swapped."],
  ["How large should a patch be on a baseball cap?", "2.5 to 3 inches wide across the front is the sweet spot for most baseball caps."],
  ["Can I order custom hat patches without artwork?", "Yes. Send a rough idea or a reference image and our design team will draft the artwork for you at no charge."],
] as const;

const patchStyles = [
  ["embroidered-patch-hat.jpg", "embroidered custom patch hat", "Embroidered Patches", "Classic stitched thread — the go-to choice for baseball caps, uniforms, and corporate merch."],
  ["pvc-patch-hat.jpg", "pvc custom patch hat", "PVC Rubber Patches", "Durable and weatherproof — built for trucker caps, outdoor gear, and tactical use."],
  ["chenille-patch-hat.jpg", "chenille patch hat custom", "Chenille Patches", "Fuzzy dimensional lettering — ideal for beanies, varsity styles, and retro branding."],
  ["woven-patch-hat.jpg", "woven patch hat", "Woven Patches", "Fine thread detail for complex logos and small text that embroidery cannot hold."],
  ["velcro-patch-hat.jpg", "velcro patch hat custom", "Velcro / Hook & Loop", "Swappable patches for tactical caps and workwear — change the patch, keep the cap."],
] as const;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([name, text]) => ({
    "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.kakapatches.com/" },
    { "@type": "ListItem", position: 2, name: "Products", item: "https://www.kakapatches.com/products" },
    { "@type": "ListItem", position: 3, name: "Custom Patch Hats", item: "https://www.kakapatches.com/products/custom-patch-hats" },
  ],
};

export const metadata: Metadata = {
  title: "Custom Patch Hats | Custom Patches for Hats, Made to Order | KaKa Patches",
  description: "Custom patch hats from a factory that does it all — caps, patches, and attachment in one order. MOQ 1,000 pcs. Embroidered, PVC, chenille, and velcro.",
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
  alternates: { canonical: "/products/custom-patch-hats" },
  openGraph: {
    type: "website",
    siteName: "KaKa Patches",
    title: "Custom Patch Hats — Caps and Patches, Made Together",
    description: "One factory, one order: hats and custom patches produced together. Embroidered, PVC, chenille, or velcro. MOQ 1,000 pcs.",
    url: "/products/custom-patch-hats",
    images: [{ url: "/images/custom-patch-hats-embroidered-baseball-cap.jpg" }],
  },
  twitter: { card: "summary_large_image" },
};

const sectionClass = "mx-auto max-w-7xl px-6 py-14 md:py-20";
const headingClass = "text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl";

export default function CustomPatchHatsPage() {
  return (
    <main className="bg-white text-slate-700">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="bg-slate-950 px-6 py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
            <Link href="/" className="hover:text-white">Home</Link><span className="mx-2">/</span>
            <Link href="/products" className="hover:text-white">Products</Link><span className="mx-2">/</span>
            <span>Custom Patch Hats</span>
          </nav>
          <p className="font-bold uppercase tracking-[0.22em] text-amber-400">Custom Patch Hats</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl">Custom Patch Hats — Caps and Patches, Made Together</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">One factory, one order: your hats and custom patches produced together — embroidered, PVC, chenille, or velcro, attached and ready to ship.</p>
          <ul className="mt-8 grid max-w-5xl gap-3 text-slate-300 md:grid-cols-3">
            <li><strong className="text-white">Caps + Patches in One Order.</strong> Skip the two-supplier headache: we make the hat and the patch, and attach them for you.</li>
            <li><strong className="text-white">MOQ 1,000 pcs.</strong> Built for teams, uniforms, merch lines, and corporate programs.</li>
            <li><strong className="text-white">Factory-Direct Pricing.</strong> Cut out the middleman; talk to the people who stitch your patches.</li>
          </ul>
          <Link href="#quote" className="mt-9 inline-flex rounded-full bg-blue-600 px-7 py-3 font-bold text-white transition hover:bg-blue-500">Request a Quote →</Link>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["custom-patch-hats-embroidered-baseball-cap.jpg", "custom patch hats embroidered baseball cap"],
              ["custom-pvc-patch-hats-trucker-cap.jpg", "custom pvc patch hats trucker cap"],
              ["chenille-patch-hat-beanie.jpg", "chenille patch hat beanie"],
              ["velcro-patch-hat-tactical-cap.jpg", "velcro patch hat tactical cap"],
            ].map(([src, alt], index) => <Image key={src} src={`/images/${src}`} alt={alt} width={600} height={600} priority={index === 0} className="aspect-square rounded-xl object-cover" />)}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Which Hat + Patch Combinations Work — and What We Make</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm"><thead className="bg-slate-100 text-slate-950"><tr><th className="p-4">Hat Style</th><th className="p-4">Best Patch Type</th><th className="p-4">Recommended Size</th></tr></thead><tbody className="divide-y divide-slate-200">{[["Baseball Cap / Snapback", "Embroidered or PVC", "2.5–3″ wide"], ["Trucker Cap", "PVC or Woven", "2.5–3″ wide"], ["Beanie / Knit", "Chenille or Embroidered", "2–2.5″ wide"], ["Tactical / 5-Panel Cap", "Velcro (hook & loop)", "2–3″ wide"], ["Flat Brim / Fitted", "Embroidered", "2.5–3.5″ wide"]].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="p-4">{cell}</td>)}</tr>)}</tbody></table>
        </div>
        <p className="mt-5 max-w-3xl leading-7">Not sure which combination works for your design? Send us your logo and we&apos;ll recommend the hat and patch pairing before you commit.</p>
      </section>

      <section className="bg-slate-50"><div className={sectionClass}><h2 className={headingClass}>Patch Styles We Produce for Hats</h2><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{patchStyles.map(([src, alt, title, text]) => <article key={src} className="rounded-2xl bg-white p-4 shadow-sm"><Image src={`/images/${src}`} alt={alt} width={600} height={450} className="aspect-[4/3] rounded-xl object-cover" /><h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6">{text}</p></article>)}</div></div></section>

      <section className={sectionClass}><h2 className={headingClass}>Backing Options for Hat Patches</h2><div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200"><table className="min-w-full text-left text-sm"><thead className="bg-slate-100 text-slate-950"><tr><th className="p-4">Backing</th><th className="p-4">Best For</th><th className="p-4">Notes</th></tr></thead><tbody className="divide-y divide-slate-200">{[["Sew-On", "Permanent, most secure", "Recommended for everyday caps"], ["Iron-On", "Quick attachment", "Not for leather or plastic caps"], ["Velcro / Hook & Loop", "Swappable patches", "Tactical and workwear"], ["Adhesive", "Temporary use", "Events and promotions"]].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="p-4">{cell}</td>)}</tr>)}</tbody></table></div></section>

      <section className="bg-blue-50"><div className={sectionClass}><h2 className={headingClass}>How It Works — From Logo to Boxed Caps</h2><ol className="mt-8 grid gap-5 md:grid-cols-4">{[["1", "Send your design or idea.", "No artwork yet? Describe it and our team will draft it free."], ["2", "Get a quote and approve a sample.", "We confirm hat style, patch type, size, and placement."], ["3", "Production.", "Hats and patches made together, attached, and quality-checked."], ["4", "Bulk shipping.", "Packed and shipped to your door with tracking."]].map(([step, title, copy]) => <li key={step} className="rounded-2xl bg-white p-6"><span className="text-2xl font-extrabold text-blue-600">{step}</span><h3 className="mt-3 font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6">{copy}</p></li>)}</ol></div></section>

      <section className={sectionClass}><h2 className={headingClass}>Pricing &amp; MOQ</h2><ul className="mt-7 max-w-3xl list-disc space-y-3 pl-5 leading-7"><li><strong>Combined order (caps + patches made and attached together): MOQ 1,000 pcs.</strong></li><li>Already have hats? Order <strong>patches only from 200 pcs per design</strong> and attach them yourself.</li><li>Volume discounts are available at <strong>2,000+ and 5,000+ pcs</strong> — ask for a tiered quote.</li></ul><p className="mt-5">Every quote includes material, sizing, and attachment recommendations — no obligation, no pressure.</p></section>

      <section className="bg-slate-950 text-white"><div className={sectionClass}><h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Why KaKa Patches</h2><div className="mt-8 grid gap-6 md:grid-cols-2"><Image src="/images/patch-factory-production-line.jpg" alt="custom patch factory production line" width={800} height={600} className="aspect-[4/3] rounded-2xl object-cover" /><Image src="/images/custom-patch-hats-quality-check.jpg" alt="custom patch hats quality check" width={800} height={600} className="aspect-[4/3] rounded-2xl object-cover" /></div><p className="mt-7 max-w-4xl leading-7 text-slate-300">We&apos;ve produced custom patches and caps for sports teams, law enforcement units, corporate programs, and brands worldwide.</p></div></section>

      <section className={sectionClass}><h2 className={headingClass}>Frequently Asked Questions</h2><div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200">{faqs.map(([question, answer], index) => <details key={question} open={index === 0} className="p-5"><summary className="cursor-pointer font-bold text-slate-950">{question}</summary><p className="mt-3 leading-7">{answer}</p></details>)}</div></section>

      <section id="quote" className="bg-blue-50"><div className={sectionClass}><h2 className={headingClass}>Get a Quote for Your Custom Patch Hats</h2><p className="mt-4 max-w-2xl leading-7">Tell us what you need — we reply within one business day. UTM and referrer details are captured with your request to help us measure the cost of each inquiry.</p><div className="mt-8"><QuoteForm /></div></div></section>

      <section className={sectionClass}><h2 className={headingClass}>Related Custom Patch Products</h2><ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 font-semibold text-blue-700">{[["/products/custom-velcro-patches", "Custom Velcro Patches"], ["/products/custom-pvc-patches", "Custom PVC Patches"], ["/products/custom-embroidered-patches", "Custom Embroidered Patches"], ["/products/custom-woven-patches", "Custom Woven Patches"]].map(([href, text]) => <li key={href}><Link href={href} className="hover:underline">{text} →</Link></li>)}</ul></section>
    </main>
  );
}
