import Link from "next/link";
import ProductHeroGallery from "@/components/ProductHeroGallery";
import ProductImageSlot from "@/components/ProductImageSlot";
import { BreadcrumbListSchema, FAQSchema, ProductSchema } from "@/components/JsonLd";
import type { ProductPage } from "@/lib/admin/products";

export default function EmbroideredKeychainsPage({ product }: { product: ProductPage }) {
  const sections = product.guideSections || [];
  const name = product.displayName || product.name;
  const quoteHref = `/request-a-quote?product=${encodeURIComponent(product.quoteLabel || product.name)}`;
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Custom Accessories", href: "/custom-accessories" },
    { name, href: `${product.urlPrefix}/${product.slug}` },
  ];
  const gallery = [...product.images].sort((a, b) => a.order - b.order).map((image, index) => ({
    src: image.url,
    slotPath: `keychain-${index + 1}`,
    title: image.alt || name,
    alt: image.alt || name,
  }));

  return (
    <main className="bg-white pb-24 text-slate-900 lg:pb-0">
      <nav aria-label="Breadcrumb" className="border-b border-slate-100 bg-slate-50/60">
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 py-4 text-sm text-slate-500">
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === breadcrumbs.length - 1
                ? <span aria-current="page" className="font-medium text-slate-700">{item.name}</span>
                : <Link href={item.href} className="hover:text-blue-600">{item.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>

      <section className="border-b border-slate-100 py-12 md:py-16" aria-labelledby="keychains-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-12 lg:items-start">
          <div className="min-w-0 lg:col-span-7">
            <ProductHeroGallery images={gallery} isProduction={process.env.VERCEL_ENV === "production"} imageFit="contain" />
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">{product.heroBadge}</p>
            <h1 id="keychains-title" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">{product.h1}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{product.heroSubtitle}</p>
            <dl className="mt-7 grid grid-cols-2 gap-3">
              {product.heroHighlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</dt>
                  <dd className="mt-1 text-sm font-semibold leading-6">{item.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={quoteHref} className="rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700">Request a Quote →</Link>
              <Link href={quoteHref} className="rounded-full border border-slate-200 px-6 py-3.5 text-sm font-semibold transition hover:border-blue-500">Upload Your Artwork</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <nav aria-label="On this page" className="mb-14 border-b border-slate-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Plan your construction</p>
          <ol className="mt-5 grid gap-x-8 gap-y-3 text-sm leading-6 sm:grid-cols-2">
            {[...sections.map((s) => ({ id: s.id, title: s.title })), { id: "faq", title: "FAQ" }].map((section, index) => (
              <li key={section.id}><Link href={`#${section.id}`} className="text-slate-600 hover:text-blue-600"><span className="mr-2 font-semibold text-blue-600">0{index + 1}</span>{section.title}</Link></li>
            ))}
          </ol>
        </nav>

        <article data-keychain-guide>
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-36 border-b border-slate-200 pb-12 pt-4 [&+section]:mt-10" aria-labelledby={`${section.id}-title`}>
              <p className="text-sm font-semibold tracking-[0.16em] text-blue-600" aria-hidden="true">0{index + 1}</p>
              <h2 id={`${section.id}-title`} className="mt-3 max-w-4xl text-2xl font-bold leading-tight tracking-tight md:text-3xl">{section.title}</h2>
              <div className="mt-6 max-w-4xl space-y-5 text-base leading-8 text-slate-600 md:text-lg">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>

              {section.table && (
                <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200" tabIndex={0} role="region" aria-label={section.table.caption}>
                  <table className="w-full min-w-[680px] text-left text-sm leading-6 md:text-base">
                    <caption className="bg-slate-50 px-5 py-4 text-left font-semibold text-slate-900">{section.table.caption}</caption>
                    <thead className="bg-slate-900 text-white">
                      <tr>{section.table.headers.map((header) => <th key={header} scope="col" className="px-5 py-4 font-semibold">{header}</th>)}</tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row[0]} className="border-t border-slate-200 even:bg-slate-50">
                          {row.map((cell, cellIndex) => cellIndex === 0
                            ? <th key={cellIndex} scope="row" className="px-5 py-4 font-semibold text-slate-900">{cell}</th>
                            : <td key={cellIndex} className="px-5 py-4 text-slate-600">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {section.afterParagraphs && (
                <div className="mt-7 max-w-4xl space-y-5 text-base leading-8 text-slate-600 md:text-lg">
                  {section.afterParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              )}
              {section.link && <Link href={section.link.href} className="mt-5 inline-flex font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-700">{section.link.label} →</Link>}

              {section.imageIndexes?.length ? (
                <div className={`mt-8 grid gap-6 ${section.imageIndexes.length > 1 ? "sm:grid-cols-2" : "max-w-xl"}`}>
                  {section.imageIndexes.map((imageIndex) => {
                    const detail = product.detailGallery?.[imageIndex];
                    if (!detail?.imageSlot) return null;
                    return (
                      <figure key={detail.imageSlot} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <ProductImageSlot title={detail.title} slotPath={detail.imageSlot} alt={detail.alt} ratio="4:3" imageFit="contain" />
                        <figcaption className="px-5 py-4 text-sm leading-6 text-slate-600"><span className="font-semibold text-slate-900">{detail.title}.</span> {detail.caption}</figcaption>
                      </figure>
                    );
                  })}
                </div>
              ) : null}
            </section>
          ))}

          <section id="faq" className="mt-10 scroll-mt-36 pt-4" aria-labelledby="faq-title">
            <p className="text-sm font-semibold tracking-[0.16em] text-blue-600" aria-hidden="true">07</p>
            <h2 id="faq-title" className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">FAQ</h2>
            <div className="mt-7 divide-y divide-slate-200 border-y border-slate-200">
              {product.faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="cursor-pointer text-base font-semibold leading-7 marker:text-blue-600 md:text-lg">{faq.question}</summary>
                  <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600 md:text-lg">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <aside className="mt-14 rounded-3xl bg-blue-600 px-6 py-10 text-white md:px-10" aria-label="Request a keychain quote">
          <h3 className="text-2xl font-bold">{product.ctaHeading}</h3>
          <p className="mt-3 max-w-3xl text-base leading-8 text-blue-50">Send your artwork, finished size, fabric preference, hardware, quantity and delivery destination for artwork review and a project quotation.</p>
          <Link href={quoteHref} className="mt-6 inline-flex rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-blue-700">Request a Factory Quote →</Link>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <Link href={quoteHref} className="flex justify-center rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white">Request a Quote →</Link>
      </div>
      <BreadcrumbListSchema items={breadcrumbs} />
      <FAQSchema questions={product.faqs.map((faq) => ({ q: faq.question, a: faq.answer }))} />
      <ProductSchema name={name} description={product.metaDescription} image={product.ogImage} category="Custom Accessories" />
    </main>
  );
}
