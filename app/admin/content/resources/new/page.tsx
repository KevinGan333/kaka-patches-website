"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const fieldClass = "rounded-lg border border-slate-300 px-3 py-2 text-sm w-full";
const labelClass = "block text-sm font-medium text-slate-700 mb-1";

export default function AdminNewResourcePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: "",
    status: "draft",
    tags: "",
    seoTitle: "",
    seoDescription: "",
    content: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !prev.slug) {
        next.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return next;
    });
  };

  const handleSlugBlur = () => {
    setForm((prev) => ({
      ...prev,
      slug: prev.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    if (!form.content.trim()) errs.content = "Content is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/admin/content/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ _form: data.message || "Failed to create resource" });
        }
        return;
      }
      router.push("/admin/content/resources");
    } catch (err: any) {
      setErrors({ _form: err.message || "An error occurred" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/content/resources" className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Back to Resources
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">New Resource</h1>
        <p className="mt-1 text-sm text-slate-500">Create a new resource guide.</p>
      </div>

      {errors._form && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors._form}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input id="title" name="title" type="text" value={form.title} onChange={handleChange} className={fieldClass} placeholder="Resource title" />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className={labelClass}>Slug</label>
          <input id="slug" name="slug" type="text" value={form.slug} onChange={handleChange} onBlur={handleSlugBlur} className={`${fieldClass} font-mono text-xs`} placeholder="resource-slug" />
          {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className={labelClass}>Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows={2} value={form.excerpt} onChange={handleChange} className={fieldClass} placeholder="Short excerpt..." />
        </div>

        {/* Category & Status row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <input id="category" name="category" type="text" value={form.category} onChange={handleChange} className={fieldClass} placeholder="e.g. Buying Guides" />
          </div>
          <div>
            <label htmlFor="status" className={labelClass}>Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange} className={fieldClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className={labelClass}>Tags</label>
          <input id="tags" name="tags" type="text" value={form.tags} onChange={handleChange} className={fieldClass} placeholder="tag1, tag2, tag3" />
          <p className="mt-1 text-xs text-slate-400">Comma-separated.</p>
        </div>

        {/* SEO */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="seoTitle" className={labelClass}>SEO Title</label>
            <input id="seoTitle" name="seoTitle" type="text" value={form.seoTitle} onChange={handleChange} className={fieldClass} placeholder="SEO title (optional)" />
          </div>
          <div>
            <label htmlFor="seoDescription" className={labelClass}>SEO Description</label>
            <input id="seoDescription" name="seoDescription" type="text" value={form.seoDescription} onChange={handleChange} className={fieldClass} placeholder="SEO description (optional)" />
          </div>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className={labelClass}>Content</label>
          <textarea id="content" name="content" rows={14} value={form.content} onChange={handleChange} className={`${fieldClass} font-mono text-xs`} placeholder="Write your content here..." />
          {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create Resource"}
          </button>
          <Link href="/admin/content/resources" className="text-sm text-slate-500 hover:text-slate-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
