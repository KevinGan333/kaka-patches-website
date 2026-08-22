"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useRef } from "react";

const fieldClass = "rounded-lg border border-slate-300 px-3 py-2 text-sm w-full";
const labelClass = "block text-sm font-medium text-slate-700 mb-1";
const sectionClass = "rounded-xl border border-slate-200 bg-white p-5 space-y-4";

/* ── helpers for dynamic array fields ── */
function ArrayField({
  label, items, onChange, placeholder,
}: {
  label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text" value={item} placeholder={placeholder}
              onChange={(e) => { const next = [...items]; next[i] = e.target.value; onChange(next); }}
              className={fieldClass}
            />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg border border-red-200 px-2 py-2 text-xs text-red-600 hover:bg-red-50">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, ""])}
        className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800">+ Add</button>
    </div>
  );
}

function CardArrayField({
  label, items, onChange, titlePlaceholder, descPlaceholder,
}: {
  label: string; items: { title: string; description: string }[];
  onChange: (v: { title: string; description: string }[]) => void;
  titlePlaceholder: string; descPlaceholder: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <input type="text" value={item.title} placeholder={titlePlaceholder}
                onChange={(e) => { const next = [...items]; next[i] = { ...next[i], title: e.target.value }; onChange(next); }}
                className={fieldClass} />
              <input type="text" value={item.description} placeholder={descPlaceholder}
                onChange={(e) => { const next = [...items]; next[i] = { ...next[i], description: e.target.value }; onChange(next); }}
                className={fieldClass} />
            </div>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg border border-red-200 px-2 py-2 text-xs text-red-600 hover:bg-red-50">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, { title: "", description: "" }])}
        className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800">+ Add</button>
    </div>
  );
}

function FaqField({
  items, onChange,
}: {
  items: { question: string; answer: string }[];
  onChange: (v: { question: string; answer: string }[]) => void;
}) {
  return (
    <div>
      <label className={labelClass}>FAQ Items</label>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <input type="text" value={item.question} placeholder="Question"
                onChange={(e) => { const next = [...items]; next[i] = { ...next[i], question: e.target.value }; onChange(next); }}
                className={fieldClass} />
              <textarea rows={3} value={item.answer} placeholder="Answer"
                onChange={(e) => { const next = [...items]; next[i] = { ...next[i], answer: e.target.value }; onChange(next); }}
                className={fieldClass} />
            </div>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg border border-red-200 px-2 py-2 text-xs text-red-600 hover:bg-red-50">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, { question: "", answer: "" }])}
        className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800">+ Add FAQ</button>
    </div>
  );
}

function HighlightField({
  items, onChange,
}: {
  items: { label: string; value: string }[];
  onChange: (v: { label: string; value: string }[]) => void;
}) {
  return (
    <div>
      <label className={labelClass}>Hero Highlights</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item.label} placeholder="Label (e.g., Material)"
              onChange={(e) => { const next = [...items]; next[i] = { ...next[i], label: e.target.value }; onChange(next); }}
              className={`${fieldClass} w-2/5`} />
            <input type="text" value={item.value} placeholder="Value (e.g., PVC, zinc alloy)"
              onChange={(e) => { const next = [...items]; next[i] = { ...next[i], value: e.target.value }; onChange(next); }}
              className={`${fieldClass} flex-1`} />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg border border-red-200 px-2 py-2 text-xs text-red-600 hover:bg-red-50">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, { label: "", value: "" }])}
        className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800">+ Add</button>
    </div>
  );
}

export default function AdminNewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const altRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    group: "accessories" as "patches" | "labels-transfers" | "accessories",
    urlPrefix: "/custom-accessories" as "/products" | "/custom-accessories",
    status: "draft" as "draft" | "published",
    displayOrder: 99,
    availableForQuote: true,
    quoteFormKey: "",
    metaTitle: "",
    metaDescription: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    heroBadge: "",
    h1: "",
    heroSubtitle: "",
    heroHighlights: [] as { label: string; value: string }[],
    overviewParagraphs: [] as string[],
    buyerTypes: [] as string[],
    applications: [] as string[],
    features: [] as { title: string; description: string }[],
    customOptionsTitle: "Custom Options",
    customOptions: [] as string[],
    typeOptionsTitle: "",
    typeOptions: [] as { title: string; description: string }[],
    faqs: [] as { question: string; answer: string }[],
    ctaHeading: "Need Custom Products?",
    relatedProductSlugs: [] as string[],
    moqDisclaimer: "",
    packagingDelivery: "",
    images: [] as { url: string; alt: string; order: number }[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const group = e.target.value as typeof form.group;
    const urlPrefix = group === "accessories" ? "/custom-accessories" : "/products";
    setForm((prev) => ({ ...prev, group, urlPrefix }));
  };

  const handleSlugBlur = () => {
    setForm((prev) => ({
      ...prev,
      slug: prev.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const handleUploadImage = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const alt = altRef.current?.value || file.name;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
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
      const res = await fetch("/api/admin/content/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors({ _form: data.error || data.message || "Failed to create product" });
        return;
      }
      router.push("/admin/products");
    } catch {
      setErrors({ _form: "An error occurred" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800">&larr; Back to Product Pages</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">New Product Page</h1>
      </div>

      {errors._form && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors._form}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Basic Info ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelClass}>Product Name</label><input name="name" value={form.name} onChange={handleChange} className={fieldClass} placeholder="e.g., Custom Keychains" />{errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}</div>
            <div>
              <label className={labelClass}>Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} onBlur={handleSlugBlur} className={`${fieldClass} font-mono text-xs`} placeholder="custom-keychains" />
              {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
            </div>
            <div>
              <label className={labelClass}>Product Group</label>
              <select name="group" value={form.group} onChange={handleGroupChange} className={fieldClass}>
                <option value="patches">Patches</option>
                <option value="labels-transfers">Labels &amp; Transfers</option>
                <option value="accessories">Custom Accessories</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>URL Prefix</label>
              <input value={form.urlPrefix} readOnly className={`${fieldClass} bg-slate-50 text-slate-500`} />
            </div>
            <div>
              <label className={labelClass}>Display Order</label>
              <input name="displayOrder" type="number" value={form.displayOrder} onChange={handleChange} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={fieldClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="availableForQuote" checked={form.availableForQuote} onChange={handleChange} className="rounded" />
              Available for Quote
            </label>
          </div>
          <div>
            <label className={labelClass}>Quote Form Key <span className="text-slate-400 font-normal">(product name in quote form)</span></label>
            <input name="quoteFormKey" value={form.quoteFormKey} onChange={handleChange} className={fieldClass} placeholder="Custom Keychains" />
          </div>
        </div>

        {/* ── SEO ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">SEO</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelClass}>Meta Title</label><input name="metaTitle" value={form.metaTitle} onChange={handleChange} className={fieldClass} />{errors.metaTitle && <p className="mt-1 text-xs text-red-600">{errors.metaTitle}</p>}</div>
            <div><label className={labelClass}>Meta Description</label><textarea name="metaDescription" rows={2} value={form.metaDescription} onChange={handleChange} className={fieldClass} /></div>
            <div><label className={labelClass}>OG Title</label><input name="ogTitle" value={form.ogTitle} onChange={handleChange} className={fieldClass} /></div>
            <div><label className={labelClass}>OG Description</label><input name="ogDescription" value={form.ogDescription} onChange={handleChange} className={fieldClass} /></div>
            <div className="sm:col-span-2"><label className={labelClass}>OG Image URL</label><input name="ogImage" value={form.ogImage} onChange={handleChange} className={fieldClass} placeholder="/images/products/example.webp" /></div>
          </div>
        </div>

        {/* ── Hero ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Hero Section</h2>
          <div><label className={labelClass}>Badge <span className="text-slate-400 font-normal">(small text above H1)</span></label><input name="heroBadge" value={form.heroBadge} onChange={handleChange} className={fieldClass} placeholder="Soft PVC, Metal &amp; 3D Molded" /></div>
          <div><label className={labelClass}>H1</label><input name="h1" value={form.h1} onChange={handleChange} className={fieldClass} />{errors.h1 && <p className="mt-1 text-xs text-red-600">{errors.h1}</p>}</div>
          <div><label className={labelClass}>Subtitle</label><textarea name="heroSubtitle" rows={2} value={form.heroSubtitle} onChange={handleChange} className={fieldClass} /></div>
          <HighlightField items={form.heroHighlights} onChange={(v) => setForm((p) => ({ ...p, heroHighlights: v }))} />
        </div>

        {/* ── Overview ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Product Overview</h2>
          <ArrayField label="Overview Paragraphs" items={form.overviewParagraphs} onChange={(v) => setForm((p) => ({ ...p, overviewParagraphs: v }))} placeholder="Paragraph text..." />
          <ArrayField label="Buyer Types" items={form.buyerTypes} onChange={(v) => setForm((p) => ({ ...p, buyerTypes: v }))} placeholder="e.g., Brand &amp; marketing agencies" />
        </div>

        {/* ── Applications ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Applications</h2>
          <ArrayField label="Application Items" items={form.applications} onChange={(v) => setForm((p) => ({ ...p, applications: v }))} placeholder="e.g., Brand merchandise" />
        </div>

        {/* ── Features ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Key Features</h2>
          <CardArrayField label="Feature Cards" items={form.features} onChange={(v) => setForm((p) => ({ ...p, features: v }))} titlePlaceholder="Feature title" descPlaceholder="Feature description" />
        </div>

        {/* ── Custom Options ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Custom Options</h2>
          <div><label className={labelClass}>Section Title</label><input name="customOptionsTitle" value={form.customOptionsTitle} onChange={handleChange} className={fieldClass} /></div>
          <ArrayField label="Options" items={form.customOptions} onChange={(v) => setForm((p) => ({ ...p, customOptions: v }))} placeholder="Option text..." />
        </div>

        {/* ── Type Options ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Type / Backing Options</h2>
          <div><label className={labelClass}>Section Title</label><input name="typeOptionsTitle" value={form.typeOptionsTitle} onChange={handleChange} className={fieldClass} placeholder="Choose the Right Type" /></div>
          <CardArrayField label="Type Cards" items={form.typeOptions} onChange={(v) => setForm((p) => ({ ...p, typeOptions: v }))} titlePlaceholder="Type name" descPlaceholder="Type description" />
        </div>

        {/* ── FAQ ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">FAQ</h2>
          <FaqField items={form.faqs} onChange={(v) => setForm((p) => ({ ...p, faqs: v }))} />
        </div>

        {/* ── CTA ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">CTA Section</h2>
          <div><label className={labelClass}>CTA Heading</label><input name="ctaHeading" value={form.ctaHeading} onChange={handleChange} className={fieldClass} placeholder="Need Custom ...?" /></div>
        </div>

        {/* ── Images ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">Product Images</h2>
          <div className="flex gap-3 items-end">
            <div className="flex-1"><label className={labelClass}>Upload Image</label><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className={fieldClass} /></div>
            <div className="w-32"><label className={labelClass}>Alt Text</label><input ref={altRef} type="text" placeholder="Alt text" className={fieldClass} /></div>
            <button type="button" onClick={handleUploadImage} disabled={uploading} className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">{uploading ? "Uploading..." : "Upload"}</button>
          </div>
          {form.images.length > 0 && (
            <div className="mt-4 space-y-2">
              {form.images.map((img, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="flex-1 font-mono text-xs text-slate-600 truncate">{img.url}</span>
                  <input type="text" value={img.alt} placeholder="Alt text"
                    onChange={(e) => { const next = [...form.images]; next[i] = { ...next[i], alt: e.target.value }; setForm((p) => ({ ...p, images: next })); }}
                    className="w-32 rounded border border-slate-300 px-2 py-1 text-xs" />
                  <button type="button" onClick={() => { const next = form.images.filter((_, j) => j !== i).map((im, idx) => ({ ...im, order: idx })); setForm((p) => ({ ...p, images: next })); }}
                    className="text-xs text-red-600 hover:text-red-800">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── MOQ & Packaging ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-bold text-slate-900">MOQ &amp; Packaging</h2>
          <div><label className={labelClass}>MOQ / Disclaimer Text</label><textarea name="moqDisclaimer" rows={3} value={form.moqDisclaimer} onChange={handleChange} className={fieldClass} placeholder="Standard MOQ: 200 pcs/design..." /></div>
          <div><label className={labelClass}>Packaging &amp; Delivery</label><textarea name="packagingDelivery" rows={3} value={form.packagingDelivery} onChange={handleChange} className={fieldClass} placeholder="Describe packaging and delivery options..." /></div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60">
            {saving ? "Saving..." : "Create Product Page"}
          </button>
          <Link href="/admin/products" className="text-sm text-slate-500 hover:text-slate-700">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
