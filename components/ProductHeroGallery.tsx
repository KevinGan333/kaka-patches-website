"use client";

import { useEffect, useMemo, useState } from "react";

export interface HeroGalleryImage {
  src: string | null;
  slotPath: string;
  title: string;
  alt?: string;
}

function GalleryIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  );
}

/**
 * Hero product gallery with a primary image window, thumbnail strip and a
 * lightbox on click/tap. Every slot renders as a designed placeholder until a
 * real image is assigned at its canonical path.
 */
export default function ProductHeroGallery({ images, isProduction = false }: { images: HeroGalleryImage[]; isProduction?: boolean }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const current = images[active] || images[0];
  const anyReal = useMemo(() => images.some((img) => img.src), [images]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % images.length);
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, images.length]);

  if (!current) return null;

  return (
    <div>
      {/* Primary image window */}
      <button
        type="button"
        onClick={() => anyReal && setLightbox(true)}
        disabled={!anyReal}
        className={`relative block w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 text-left transition ${anyReal ? "cursor-zoom-in" : "cursor-default"}`}
        aria-label={`${current.title} — enlarge`}
      >
        <div className="aspect-[4/3] w-full">
          {current.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.src} alt={current.alt || current.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                <GalleryIcon className="h-6 w-6" />
              </span>
              <p className="text-sm font-semibold text-slate-700">{current.title}</p>
              {isProduction ? (
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Product image</p>
              ) : (
                <>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Recommended: 1600 × 1200 px, 4:3</p>
                  <p className="max-w-full break-all rounded bg-white/80 px-2 py-1 font-mono text-[10px] leading-4 text-slate-500">{current.slotPath}</p>
                </>
              )}
            </div>
          )}
        </div>
        {anyReal && (
          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
          </span>
        )}
      </button>

      {/* Thumbnail strip */}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={img.slotPath}
            type="button"
            onClick={() => setActive(i)}
            className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border transition ${
              active === i ? "border-blue-600 ring-2 ring-blue-600/30" : "border-slate-200 hover:border-slate-300"
            }`}
            aria-label={`Show ${img.title}`}
          >
            {img.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img.src} alt={img.alt || img.title} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                <GalleryIcon className="h-5 w-5" />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && anyReal && current.src && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm" onClick={() => setLightbox(false)} role="dialog" aria-modal="true" aria-label="Image gallery">
          <button type="button" onClick={() => setLightbox(false)} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.src} alt={current.alt || current.title} className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">{current.title}</p>
        </div>
      )}
    </div>
  );
}
