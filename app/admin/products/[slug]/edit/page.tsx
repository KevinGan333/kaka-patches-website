"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const fieldClass = "rounded-lg border border-slate-300 px-3 py-2 text-sm w-full";
const labelClass = "block text-sm font-medium text-slate-700 mb-1";
const sectionClass = "rounded-xl border border-slate-200 bg-white p-5 space-y-4";

/* ── Dynamic array helpers (same as new page) ── */
function ArrayField({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item} placeholder={placeholder} onChange={(e) => { const n = [...items]; n[i] = e.target.value; onChange(n); }} className={fieldClass} />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="shrink-0 rounded-lg border border-red-200 px-2 py-2 text-xs text-red-600 hover:bg-red-50">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, ""])} className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800">+ Add</button>
    </div>
  );
}
function CardArrayField({ label, items, onChange, titlePlaceholder, descPlaceholder }: { label: string; items: { title: string; description: string }[]; onChange: (v: { title: string; description: string }[]) => void; titlePlaceholder: string; descPlaceholder: string }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <input type="text" value={item.title} placeholder={titlePlaceholder} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], title: e.target.value }; onChange(n); }} className={fieldClass} />
              <input type="text" value={item.description} placeholder={descPlaceholder} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], description: e.target.value }; onChange(n); }} className={fieldClass} />
            </div>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="shrink-0 rounded-lg border border-red-200 px-2 py-2 text-xs text-red-600 hover:bg-red-50">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, { title: "", description: "" }])} className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800">+ Add</button>
    </div>
  );
}
function FaqField({ items, onChange }: { items: { question: string; answer: string }[]; onChange: (v: { question: string; answer: string }[]) => void }) {
  return (
    <div>
      <label className={labelClass}>FAQ Items</label>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <input type="text" value={item.question} placeholder="Question" onChange={(e) => { const n = [...items]; n[i] = { ...n[i], question: e.target.value }; onChange(n); }} className={fieldClass} />
              <textarea rows={3} value={item.answer} placeholder="Answer" onChange={(e) => { const n = [...items]; n[i] = { ...n[i], answer: e.target.value }; onChange(n); }} className={fieldClass} />
            </div>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="shrink-0 rounded-lg border border-red-200 px-2 py-2 text-xs text-red-600 hover:bg-red-50">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, { question: "", answer: "" }])} className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800">+ Add FAQ</button>
    </div>
  );
}
function HighlightField({ items, onChange }: { items: { label: string; value: string }[]; onChange: (v: { label: string; value: string }[]) => void }) {
  return (
    <div>
      <label className={labelClass}>Hero Highlights</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item.label} placeholder="Label" onChange={(e) => { const n = [...items]; n[i] = { ...n[i], label: e.target.value }; onChange(n); }} className={`${fieldClass} w-2/5`} />
            <input type="text" value={item.value} placeholder="Value" onChange={(e) => { const n = [...items]; n[i] = { ...n[i], value: e.target.value }; onChange(n); }} className={`${fieldClass} flex-1`} />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="shrink-0 rounded-lg border border-red-200 px-2 py-2 text-xs text-red-600 hover:bg-red-50">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, { label: "", value: "" }])} className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800">+ Add</button>
    </div>
  );
}

export default function AdminEditProductPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const altRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", slug: "", group: "accessories" as string, urlPrefix: "/custom-accessories" as string,
    status: "draft" as string, displayOrder: 99, availableForQuote: true, quoteFormKey: "",
    metaTitle: "", metaDescription: "", ogTitle: "", ogDescription: "", ogImage: "",
    heroBadge: "", h1: "", heroSubtitle: "",
    heroHighlights: [] as { label: string; value: string }[],
    overviewParagraphs: [] as string[], buyerTypes: [] as string[],
    applications: [] as string[],
    features: [] as { title: string; description: string }[],
    customOptionsTitle: "Custom Options", customOptions: [] as string[],
    typeOptionsTitle: "", typeOptions: [] as { title: string; description: string }[],
    faqs: [] as { question: string; answer: string }[],
    ctaHeading: "", relatedProductSlugs: [] as string[],
    moqDisclaimer: "", packagingDelivery: "",
    images: [] as { url: string; alt: string; order: number }[],
  });

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/content/products/${slug}`);
        if (res.status === 401) { router.push("/admin/login"); return; }
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        const p = data.item;
        setForm({
          name: p.name || "", slug: p.slug || "", group: p.group || "accessories", urlPrefix: p.urlPrefix || "/custom-accessories",
          status: p.status || "draft", displayOrder: p.displayOrder ?? 99, availableForQuote: p.availableForQuote ?? true, quoteFormKey: p.quoteFormKey || "",
          metaTitle: p.metaTitle || "", metaDescription: p.metaDescription || "", ogTitle: p.ogTitle || "", ogDescription: p.ogDescription || "", ogImage: p.ogImage || "",
          heroBadge: p.heroBadge || "", h1: p.h1 || "", heroSubtitle: p.heroSubtitle || "",
          heroHighlights: p.heroHighlights || [],
          overviewParagraphs: p.overviewParagraphs || [], buyerTypes: p.buyerTypes || [],
          applications: p.applications || [],
          features: p.features || [],
          customOptionsTitle: p.customOptionsTitle || "Custom Options", customOptions: p.customOptions || [],
          typeOptionsTitle: p.typeOptionsTitle || "", typeOptions: p.typeOptions || [],
          faqs: p.faqs || [],
          ctaHeading: p.ctaHeading || "", relatedProductSlugs: p.relatedProductSlugs || [],
          moqDisclaimer: p.moqDisclaimer || "", packagingDelivery: p.packagingDelivery || "",
          images: p.images || [],
        });
      } catch (err: unknown) { setLoadError(err instanceof Error ? err.message : "Error loading product"); }
      finally { setLoading(false); }
    })();
  }, [slug, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const handleSlugBlur = () => {
    setForm((prev) => ({ ...prev, slug: prev.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }));
  };

  const handleUploadImage = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const alt = altRef.current?.value || file.name;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file);
      const res = await fetch("/api/admin/content/upload-image", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json().catch(() => ({})); alert(d.error || "Upload failed"); return; }
      const data = await res.json();
      if (data.url) {
        const nextImages = [...form.images, { url: data.url, alt, order: form.images.length }];
        setForm((prev) => ({ ...prev, images: nextImages }));
        if (fileRef.current) fileRef.current.value = "";
      }
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    if (!form.h1.trim()) errs.h1 = "H1 is required";
    if (!form.metaTitle.trim()) errs.metaTitle = "Meta title is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/products/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) { const data = await res.json().catch(() => ({})); setErrors({ _form: data.error || "Failed to update" }); return; }
      router.push("/admin/products");
    } catch { setErrors({ _form: "An error occurred" }); }
    finally { setSaving(false); }
  };

  const handleArchive = async () => {
    if (!confirm("Archive this product page?")) return;
    setArchiving(true);
    try {
      const res = await fetch(`/api/admin/content/products/${slug}`, { method: "DELETE" });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) { const d = await res.json().catch(() => ({})); alert(d.error || "Failed to archive"); return; }
      router.push("/admin/products");
    } catch { alert("An error occurred"); }
    finally { setArchiving(false); }
  };

  if (notFound) return <div className="px-6 py-8"><div className="rounded-lg border border-slate-200 bg-white p-12 text-center"><h2 className="text-lg font-bold">Not Found</h2><p className="mt-2 text-sm text-slate-500">Product &quot;{slug}&quot; not found.</p><Link href="/admin/products" className="mt-4 inline-block text-sm text-blue-600">&larr; Back</Link></div></div>;
  if (loading) return <div className="px-6 py-8"><div className="flex items-center gap-3"><div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /><p className="text-sm text-slate-500">Loading...</p></div></div>;
  if (loadError) return <div className="px-6 py-8"><div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center"><h2 className="text-lg font-bold text-red-800">Error</h2><p className="mt-2 text-sm text-red-600">{loadError}</p><Link href="/admin/products" className="mt-4 inline-block text-sm text-blue-600">&larr; Back</Link></div></div>;

  return (
    <div className="px-6 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800">&larr; Back to Product Pages</Link>
        <div className="mt-2 flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-slate-900">Edit Product Page</h1><p className="mt-1 text-sm text-slate-500">{form.name || slug}</p></div>
          <div className="flex items-center gap-3">
            {form.status === "published" && <a href={`${form.urlPrefix}/${form.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Preview</a>}
            <button type="button" onClick={handleArchive} disabled={archiving} className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60">{archiving ? "Archiving..." : "Archive"}</button>
          </div>
        </div>
      </div>

      {errors._form && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors._form}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelClass}>Product Name</label><input name="name" value={form.name} onChange={handleChange} className={fieldClass} />{errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}</div>
            <div><label className={labelClass}>Slug</label><input name="slug" value={form.slug} onChange={handleChange} onBlur={handleSlugBlur} className={`${fieldClass} font-mono text-xs`} />{errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}</div>
            <div><label className={labelClass}>Group</label><select name="group" value={form.group} onChange={handleChange} className={fieldClass}><option value="patches">Patches</option><option value="labels-transfers">Labels &amp; Transfers</option><option value="accessories">Custom Accessories</option></select></div>
            <div><label className={labelClass}>URL Prefix</label><input value={form.urlPrefix} readOnly className={`${fieldClass} bg-slate-50 text-slate-500`} /></div>
            <div><label className={labelClass}>Display Order</label><input name="displayOrder" type="number" value={form.displayOrder} onChange={handleChange} className={fieldClass} /></div>
            <div><label className={labelClass}>Status</label><select name="status" value={form.status} onChange={handleChange} className={fieldClass}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="availableForQuote" checked={form.availableForQuote} onChange={handleCheckChange} className="rounded" />Available for Quote</label>
          <div><label className={labelClass}>Quote Form Key</label><input name="quoteFormKey" value={form.quoteFormKey} onChange={handleChange} className={fieldClass} /></div>
        </div>

        {/* SEO */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">SEO</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelClass}>Meta Title</label><input name="metaTitle" value={form.metaTitle} onChange={handleChange} className={fieldClass} />{errors.metaTitle && <p className="mt-1 text-xs text-red-600">{errors.metaTitle}</p>}</div>
            <div><label className={labelClass}>Meta Description</label><textarea name="metaDescription" rows={2} value={form.metaDescription} onChange={handleChange} className={fieldClass} /></div>
            <div><label className={labelClass}>OG Title</label><input name="ogTitle" value={form.ogTitle} onChange={handleChange} className={fieldClass} /></div>
            <div><label className={labelClass}>OG Description</label><input name="ogDescription" value={form.ogDescription} onChange={handleChange} className={fieldClass} /></div>
            <div className="sm:col-span-2"><label className={labelClass}>OG Image URL</label><input name="ogImage" value={form.ogImage} onChange={handleChange} className={fieldClass} /></div>
          </div>
        </div>

        {/* Hero */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Hero Section</h2>
          <div><label className={labelClass}>Badge</label><input name="heroBadge" value={form.heroBadge} onChange={handleChange} className={fieldClass} /></div>
          <div><label className={labelClass}>H1</label><input name="h1" value={form.h1} onChange={handleChange} className={fieldClass} />{errors.h1 && <p className="mt-1 text-xs text-red-600">{errors.h1}</p>}</div>
          <div><label className={labelClass}>Subtitle</label><textarea name="heroSubtitle" rows={2} value={form.heroSubtitle} onChange={handleChange} className={fieldClass} /></div>
          <HighlightField items={form.heroHighlights} onChange={(v) => setForm((p) => ({ ...p, heroHighlights: v }))} />
        </div>

        {/* Overview */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Product Overview</h2>
          <ArrayField label="Overview Paragraphs" items={form.overviewParagraphs} onChange={(v) => setForm((p) => ({ ...p, overviewParagraphs: v }))} placeholder="Paragraph..." />
          <ArrayField label="Buyer Types" items={form.buyerTypes} onChange={(v) => setForm((p) => ({ ...p, buyerTypes: v }))} placeholder="Buyer type..." />
        </div>

        {/* Applications */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Applications</h2>
          <ArrayField label="Application Items" items={form.applications} onChange={(v) => setForm((p) => ({ ...p, applications: v }))} placeholder="Application..." />
        </div>

        {/* Features */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Key Features</h2>
          <CardArrayField label="Feature Cards" items={form.features} onChange={(v) => setForm((p) => ({ ...p, features: v }))} titlePlaceholder="Feature title" descPlaceholder="Feature description" />
        </div>

        {/* Custom Options */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Custom Options</h2>
          <div><label className={labelClass}>Section Title</label><input name="customOptionsTitle" value={form.customOptionsTitle} onChange={handleChange} className={fieldClass} /></div>
          <ArrayField label="Options" items={form.customOptions} onChange={(v) => setForm((p) => ({ ...p, customOptions: v }))} placeholder="Option..." />
        </div>

        {/* Type Options */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Type / Backing Options</h2>
          <div><label className={labelClass}>Section Title</label><input name="typeOptionsTitle" value={form.typeOptionsTitle} onChange={handleChange} className={fieldClass} /></div>
          <CardArrayField label="Type Cards" items={form.typeOptions} onChange={(v) => setForm((p) => ({ ...p, typeOptions: v }))} titlePlaceholder="Type name" descPlaceholder="Type description" />
        </div>

        {/* FAQ */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">FAQ</h2>
          <FaqField items={form.faqs} onChange={(v) => setForm((p) => ({ ...p, faqs: v }))} />
        </div>

        {/* CTA */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">CTA Section</h2>
          <div><label className={labelClass}>CTA Heading</label><input name="ctaHeading" value={form.ctaHeading} onChange={handleChange} className={fieldClass} /></div>
        </div>

        {/* Images */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Product Images</h2>
          <div className="flex gap-3 items-end">
            <div className="flex-1"><label className={labelClass}>Upload</label><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className={fieldClass} /></div>
            <div className="w-32"><label className={labelClass}>Alt</label><input ref={altRef} type="text" className={fieldClass} /></div>
            <button type="button" onClick={handleUploadImage} disabled={uploading} className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">{uploading ? "Uploading..." : "Upload"}</button>
          </div>
          {form.images.length > 0 && <div className="mt-4 space-y-2">{form.images.map((img, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="flex-1 font-mono text-xs text-slate-600 truncate">{img.url}</span>
              <input type="text" value={img.alt} placeholder="Alt" onChange={(e) => { const n = [...form.images]; n[i] = { ...n[i], alt: e.target.value }; setForm((p) => ({ ...p, images: n })); }} className="w-32 rounded border px-2 py-1 text-xs" />
              <button type="button" onClick={() => { const n = form.images.filter((_, j) => j !== i).map((im, idx) => ({ ...im, order: idx })); setForm((p) => ({ ...p, images: n })); }} className="text-xs text-red-600 hover:text-red-800">Remove</button>
            </div>
          ))}</div>}
        </div>

        {/* MOQ & Packaging */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">MOQ &amp; Packaging</h2>
          <div><label className={labelClass}>MOQ / Disclaimer</label><textarea name="moqDisclaimer" rows={3} value={form.moqDisclaimer} onChange={handleChange} className={fieldClass} /></div>
          <div><label className={labelClass}>Packaging &amp; Delivery</label><textarea name="packagingDelivery" rows={3} value={form.packagingDelivery} onChange={handleChange} className={fieldClass} /></div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving..." : "Save Changes"}</button>
          <Link href="/admin/products" className="text-sm text-slate-500 hover:text-slate-700">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
