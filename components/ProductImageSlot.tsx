import { resolveImageSrc } from "@/lib/image-slots";

/**
 * True only on the Vercel Production deployment. In development and Preview we
 * keep the full placeholder guidance (file path + recommended dimensions) so the
 * content team can drop assets into the documented slots; public Production
 * visitors see a clean branded placeholder with no internal path information.
 */
const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

export interface ProductImageSlotProps {
  /** Human label for the slot, shown in the placeholder. */
  title?: string;
  /** Canonical future path under `public/`, e.g. `/images/products/{slug}/hero-main.webp`. */
  slotPath: string;
  /** Aspect ratio for the slot, e.g. "4:3", "1:1", "16:9", "3:4". Defaults to "4:3". */
  ratio?: string;
  /** Recommended pixel dimensions (e.g. "1600 × 1200 px"), shown in the placeholder. */
  recommendedSize?: string;
  /** Descriptive alt text for the real image once assigned. */
  alt?: string;
  /** Optional already-resolved image URL (e.g. from the CMS `images` array). */
  explicitSrc?: string;
  className?: string;
  priority?: boolean;
}

const RATIO_CLASS: Record<string, string> = {
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "16:9": "aspect-[16/9]",
  "3:4": "aspect-[3/4]",
  "3:2": "aspect-[3/2]",
  "2:3": "aspect-[2/3]",
};

/** Default recommended pixel dimensions per ratio, used when the caller does not override. */
const DEFAULT_RECOMMENDED_SIZE: Record<string, string> = {
  "4:3": "1600 × 1200 px",
  "1:1": "1200 × 1200 px",
  "16:9": "1920 × 1080 px",
  "3:4": "1200 × 1600 px",
  "3:2": "1800 × 1200 px",
  "2:3": "1200 × 1800 px",
};

function CameraIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  );
}

/**
 * ProductImageSlot — renders a real image when one is assigned (either via an
 * explicit URL or a file present at the canonical public path), and a polished
 * placeholder otherwise. No broken-image icons; every future image location is
 * visibly reserved with its exact file path and recommended ratio.
 */
export default function ProductImageSlot({
  title = "Product Image",
  slotPath,
  ratio = "4:3",
  recommendedSize,
  alt,
  explicitSrc,
  className = "",
  priority = false,
}: ProductImageSlotProps) {
  const ratioClass = RATIO_CLASS[ratio] || RATIO_CLASS["4:3"];
  const src = resolveImageSrc(slotPath, explicitSrc);
  const sizeLabel = recommendedSize || DEFAULT_RECOMMENDED_SIZE[ratio] || "";

  if (src) {
    return (
      <div className={`${ratioClass} overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || title}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${ratioClass} flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 px-4 text-center ${className}`}
      role="img"
      aria-label={`${title} — image placeholder`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
        <CameraIcon className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {IS_PRODUCTION ? (
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Product image</p>
      ) : (
        <>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {ratio}{sizeLabel ? ` — ${sizeLabel}` : ""}
          </p>
          <p className="max-w-full break-all rounded bg-white/80 px-2 py-1 font-mono text-[10px] leading-4 text-slate-500">{slotPath}</p>
          <p className="text-[10px] text-slate-400">Replace with approved product or factory image</p>
        </>
      )}
    </div>
  );
}
