import ProductImageSlot from "@/components/ProductImageSlot";
import type { ProductSampleGallery as SampleGallery } from "@/lib/admin/products";

function SampleCards({ images }: { images: SampleGallery["images"] }) {
  const columns = images.length === 1
    ? "mx-auto max-w-lg"
    : images.length === 2
      ? "mx-auto max-w-4xl sm:grid-cols-2"
      : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <div className={`grid gap-6 ${columns}`}>
      {images.map((image) => (
        <figure key={image.url} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <a href={image.url} target="_blank" rel="noopener noreferrer" aria-label={`View full-size image: ${image.title}`} className="block cursor-zoom-in rounded-t-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            <ProductImageSlot title={image.title} slotPath={image.url} alt={image.alt} ratio="1:1" imageFit="contain" />
          </a>
          <figcaption className="border-t border-slate-100 px-4 py-3 text-sm font-medium leading-6 text-slate-700">{image.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function ProductSampleGallery({ gallery }: { gallery: SampleGallery }) {
  if (!gallery.images.length) return null;
  const previewCount = gallery.previewCount ?? gallery.images.length;
  const visible = gallery.images.slice(0, previewCount);
  const additional = gallery.images.slice(previewCount);

  return (
    <section id={gallery.id} aria-labelledby={`${gallery.id}-title`} className="scroll-mt-28 border-t border-slate-100 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Design &amp; Construction Examples</p>
          <h2 id={`${gallery.id}-title`} className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{gallery.title}</h2>
          <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">{gallery.description}</p>
        </div>
        <div className="mt-10"><SampleCards images={visible} /></div>
        {additional.length > 0 && (
          <details className="group mt-8">
            <summary className="mx-auto w-fit cursor-pointer rounded-full border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-700 marker:text-blue-600 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              View {additional.length} more patch examples
            </summary>
            <div className="mt-8"><SampleCards images={additional} /></div>
          </details>
        )}
      </div>
    </section>
  );
}
