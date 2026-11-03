import { withPageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./uniforms.module.css";

const pageUrl = "https://www.kakapatches.com/applications/custom-patches-for-uniforms";
const description = "Custom patches for uniforms built for daily wear and industrial laundry — embroidered, woven and PVC badges. MOQ 200 pcs, free artwork review.";

export const metadata: Metadata = withPageMetadata({
  title: "Custom Patches for Uniforms | Workwear & Staff Badges",
  description,
}, "/applications/custom-patches-for-uniforms", "/images/home/uniform.webp");

const patchTypes = [
  { name: "Embroidered patches", href: "/products/custom-embroidered-patches", detail: "Raised thread; bold logos and crests", wash: "Specify cycle target; test thread, edge and stitching", cost: "Low–medium; coverage affects price" },
  { name: "Woven patches", href: "/products/custom-woven-patches", detail: "Flat finish; fine lines and smaller lettering", wash: "Specify cycle target; check color and edge stability", cost: "Low–medium; size and colors matter" },
  { name: "PVC patches", href: "/products/custom-pvc-patches", detail: "Molded relief; simple, dimensional marks", wash: "Confirm heat and chemical limits before laundering", cost: "Medium–high; mold cost applies" },
  { name: "Velcro patches", href: "/products/custom-velcro-patches", detail: "Removable backing for embroidered, woven or PVC faces", wash: "Remove before washing where specified; test loop panel", cost: "Adds backing cost to the chosen face" },
];

const faqs = [
  { q: "Do school uniforms allow patches?", a: "Each school sets its own uniform policy. Ask the school to approve the logo, patch size, placement and attachment before ordering. We can review an approved crest or badge design for production." },
  { q: "How do you attach patches to work uniforms?", a: "Sew-on attachment is a practical starting point for permanent badges. Hook and loop suits removable name or role patches. Iron-on needs compatible fabric and confirmed application settings; test an actual garment before choosing it for a program." },
  { q: "Can uniform patches survive industrial laundry?", a: "Suitability depends on the complete patch, garment and laundry process. Send the wash temperature, chemicals, drying method and required cycle count. Approve samples tested under those conditions before bulk production; there is no universal wash-cycle guarantee for every construction." },
  { q: "Which patch type keeps small uniform lettering clear?", a: "Woven patches are often a useful starting point for fine lines and small lettering; embroidery gives a more raised finish. Send the artwork at its intended size so we can check readability and suggest adjustments before sampling." },
  { q: "What is the minimum order for custom uniform patches?", a: "Our standard minimum is 200 pieces per design. Tell us the quantities for each logo, size and backing so we can confirm the order breakdown and quote. Free artwork review is available before you proceed." },
  { q: "Can I approve a sample before placing a bulk order?", a: "Yes. Use a sample to check the colors, lettering, border and attachment on your uniform fabric. Sample charges, timing and any bulk-order credit are confirmed for your project before sampling starts." },
];

const sections = [
  ["patch-types", "Patch types"], ["wash-durability", "Wash & durability"],
  ["backing", "Backing options"], ["uniform-types", "Uniform types"],
  ["artwork", "Size & artwork"], ["faq", "FAQ"],
];

export default function Page() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      }) }} />
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <p className={styles.eyebrow}>MADE FOR THE WORKDAY</p>
            <h1>Custom Patches for <span>Uniforms</span></h1>
            <p className={styles.intro}>Custom patches for uniforms are built to survive what uniforms go through — shift after shift, wash after wash. We produce embroidered, woven and PVC uniform patches for workwear, school, security and hospitality programs, from 200 pieces per design.</p>
            <div className={styles.actions}>
              <Link className={styles.button} href="/request-a-quote">Request a quote <span aria-hidden="true">↗</span></Link>
              <a className={styles.secondary} href="#patch-types">Compare patch types ↓</a>
            </div>
            <p className={styles.heroNote}>Free artwork review · Sampling available · Bulk & repeat orders</p>
          </div>
          <figure className={styles.heroImage}>
            <Image src="/images/home/uniform.webp" alt="Embroidered logo patch attached to a work uniform" width={720} height={540} priority sizes="(max-width: 800px) 100vw, 45vw" />
            <figcaption>YOUR IDENTITY. EVERY SHIFT.</figcaption>
          </figure>
        </div>
      </section>
      <nav className={styles.contents} aria-label="On this page">
        <div className={styles.container}>{sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</div>
      </nav>
      <section id="patch-types" className={styles.section}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>01 / CHOOSE YOUR CONSTRUCTION</p>
          <h2>Which patch type works best on uniforms?</h2>
          <p className={styles.lead}>Start with the artwork and care routine. Embroidery brings a familiar stitched identity to workwear and school crests; woven construction helps when the design needs finer lines. PVC offers a different, dimensional finish for selected outdoor applications. Hook and loop is an attachment choice that can be paired with these faces.</p>
          <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Uniform patch comparison table">
            <table>
              <caption>Uniform patch comparison: detail, wash-cycle planning and relative cost</caption>
              <thead><tr><th scope="col">Patch option</th><th scope="col">Detail & appearance</th><th scope="col">Wash-cycle requirements</th><th scope="col">Relative cost</th></tr></thead>
              <tbody>{patchTypes.map((type) => <tr key={type.href}><th scope="row"><Link href={type.href}>{type.name} ↗</Link></th><td>{type.detail}</td><td>{type.wash}</td><td>{type.cost}</td></tr>)}</tbody>
            </table>
          </div>
          <p className={styles.note}>Cost levels are comparative, not a price list. No fixed wash-cycle rating is claimed here: agree a target and test the complete sample. Size, quantity, artwork and backing determine the final quote.</p>
        </div>
      </section>
      <section id="wash-durability" className={`${styles.section} ${styles.tint}`}>
        <div className={`${styles.container} ${styles.split}`}>
          <div><p className={styles.eyebrow}>02 / PLAN FOR REPEATED WEAR</p><h2>Wash and durability: what to specify</h2></div>
          <div className={styles.prose}>
            <p>“Washable” alone is not a purchasing specification. Tell us whether garments use domestic or industrial laundry, the maximum wash temperature, detergent or bleach exposure, drying method and expected number of cycles. A badge for a weekly school wash has a different brief from a work shirt processed after every shift.</p>
            <p>Review the face material, thread, backing and attachment together. Check the sample for color change, fraying, shrinkage, edge lifting and loss of legibility after your agreed wash sequence. Include the actual uniform fabric: a patch tested separately does not show how the finished garment will behave.</p>
            <p>Ask us to review merrowed or cut-edge finishing against your shape and placement. Sew-on construction is a useful starting point for permanent badges; adhesive and heat-applied backings need separate compatibility checks. Confirm the sample acceptance criteria before bulk production, then retain the approved patch and specification for repeat orders.</p>
          </div>
        </div>
      </section>
      <section id="backing" className={styles.section}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>03 / PERMANENT OR REMOVABLE</p><h2>Backing options for uniform patches</h2>
          <p className={styles.lead}>Choose attachment around who fits the badge, how often it changes and how the garment is cared for. Keep the backing specification consistent across departments and repeat orders.</p>
          <div className={styles.cards}>
            <article><span className={styles.cardNumber}>01</span><h3>Sew-on</h3><p>A practical choice for permanent chest logos, school crests and sleeve badges. Agree the stitching position and check access around pockets, linings and seams before application. Evaluate the patch and garment together under the intended care routine.</p></article>
            <article><span className={styles.cardNumber}>02</span><h3>Hook & loop</h3><p>Useful for changing names, roles or teams. Specify hook-only backing for an existing loop panel, or request matching sew-on loop pieces. Confirm orientation, panel size and whether badges should be removed before laundering.</p></article>
            <article><span className={styles.cardNumber}>03</span><h3>Iron-on</h3><p>Consider for fabrics that tolerate the required heat and pressure. Coatings, stretch and garment construction can affect adhesion. Confirm settings on a sample garment; frequent or industrial laundering requires particular attention to edge lift and bond strength.</p></article>
          </div>
          <p className={styles.followLink}>Compare application choices in our <Link href="/resources/best-backing-for-custom-patches">best backing for custom patches guide ↗</Link>.</p>
        </div>
      </section>
      <section id="uniform-types" className={`${styles.section} ${styles.tint}`}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>04 / BUILT AROUND YOUR PROGRAM</p><h2>Uniform types we produce for</h2>
          <div className={styles.uniformGrid}>
            <article><h3>Workwear</h3><p>Identify staff on workshop shirts, coveralls and service jackets. Share abrasion exposure, laundry conditions and garment details, including any protective-clothing restrictions, before choosing a construction.</p></article>
            <article><h3>School</h3><p>Use approved crests, house badges and club insignia on blazers, polos or knitwear. Confirm the school’s placement rules and check fine motto lettering at actual size before sampling.</p></article>
            <article><h3>Security</h3><p>Plan clear company, name and role identification for shirts and outerwear. Removable badges can suit changing assignments; confirm panel dimensions and permission to reproduce the insignia.</p></article>
            <article><h3>Hospitality & restaurant uniforms</h3><p>Custom patches for restaurant uniforms can identify chefs, servers and front-of-house teams across aprons, shirts and jackets. Specify grease exposure, frequent washing and a comfortable placement that avoids pocket openings.</p></article>
            <article><h3>Medical & care teams</h3><p>Provide organization or department badges for approved staff apparel. Check the employer’s hygiene and laundering policy first; patch construction does not establish suitability for sterilization, clinical use or protective garments.</p></article>
          </div>
        </div>
      </section>
      <section id="artwork" className={styles.section}>
        <div className={`${styles.container} ${styles.split}`}>
          <div><p className={styles.eyebrow}>05 / GET THE DETAILS RIGHT</p><h2>Size, placement and artwork specs</h2></div>
          <div className={styles.prose}>
            <p>As planning examples, a chest logo might start around 75–100 mm wide, a sleeve badge around 60–90 mm, and a back badge around 200–300 mm. These are layout starting points, not fixed production limits. Measure the available area on each garment size and allow space around seams, pockets and fastening points.</p>
            <p>Send AI, EPS, PDF or SVG artwork where available, plus your required width and height in millimeters. Include Pantone references, the garment color and a placement photo. If you only have a raster image, send the clearest original for review rather than enlarging a small screenshot.</p>
            <p>We review line weight, letter spacing and border shape at the final patch size. Fine text may need a woven construction or a simplified logo; confirm changes on the proof before sampling. For a useful first estimate, <Link href="/request-a-quote">request a uniform patch quote</Link> with quantities per design, backing, delivery destination and required date.</p>
          </div>
        </div>
      </section>
      <section id="faq" className={`${styles.section} ${styles.tint}`}>
        <div className={`${styles.container} ${styles.split}`}>
          <div><p className={styles.eyebrow}>06 / BEFORE YOU ORDER</p><h2>Uniform patch FAQ</h2></div>
          <div className={styles.faqs}>{faqs.map(({ q, a }) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div>
        </div>
      </section>
      <section className={styles.quote}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>LET’S PLAN YOUR NEXT BATCH</p><h2>Ready to specify your uniform patches?</h2>
          <p>Send your logo, size, quantity and care requirements. We will review the artwork and help confirm the patch face, border and backing for your program. Start with 200 pieces per design and discuss sampling before bulk production.</p>
          <div className={styles.actions}><Link className={styles.button} href="/request-a-quote">Request a quote ↗</Link><Link className={styles.secondary} href="/applications">All applications ↗</Link></div>
        </div>
      </section>
    </main>
  );
}
