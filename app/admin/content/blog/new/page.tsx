"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const fieldClass = "rounded-lg border border-slate-300 px-3 py-2 text-sm w-full";
const labelClass = "block text-sm font-medium text-slate-700 mb-1";

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    published: "bg-green-100 text-green-700",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || ""}`}>
      {status}
    </span>
  );
};

export default function AdminNewBlogPage() {
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
      const res = await fetch("/api/admin/content/blog", {
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
          setErrors({ _form: data.message || "Failed to create blog post" });
        }
        return;
      }
      router.push("/admin/content/blog");
    } catch (err: any) {
      setErrors({ _form: err.message || "An error occurred" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/content/blog" className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Back to Blog Posts
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">New Blog Post</h1>
        <p className="mt-1 text-sm text-slate-500">Create a new blog article.</p>
      </div>

      {errors._form && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors._form}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input id="title" name="title" type="text" value={form.title} onChange={handleChange} className={fieldClass} placeholder="Post title" />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className={labelClass}>Slug</label>
          <input id="slug" name="slug" type="text" value={form.slug} onChange={handleChange} onBlur={handleSlugBlur} className={`${fieldClass} font-mono text-xs`} placeholder="post-slug" />
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
            <input id="category" name="category" type="text" value={form.category} onChange={handleChange} className={fieldClass} placeholder="e.g. Tutorials" />
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

        {/* Markdown Toolbar */}
        <div>
          <label className={labelClass}>Content (Markdown)</label>
          <div className="mb-2 flex flex-wrap gap-1">
            {[
              { label: "H2", md: "\n## Heading\n" },
              { label: "H3", md: "\n### Subheading\n" },
              { label: "Bold", md: "**bold text**" },
              { label: "Bullet", md: "\n- item\n- item\n" },
              { label: "Numbered", md: "\n1. first\n2. second\n" },
              { label: "Link", md: "[link text](/url)" },
              { label: "Image", md: "![alt text](/uploads/content/image.webp)" },
              { label: "Table", md: "\n| Col A | Col B |\n| --- | --- |\n| val | val |\n" },
              { label: "Quote", md: "\n> Quoted text\n" },
              { label: "Code", md: "\n```\ncode here\n```\n" },
            ].map(btn => (
              <button key={btn.label} type="button" onClick={() => {
                const ta = document.getElementById("content") as HTMLTextAreaElement;
                if (ta) { const s = ta.selectionStart; ta.value = ta.value.slice(0, s) + btn.md + ta.value.slice(ta.selectionEnd); ta.focus(); ta.selectionStart = ta.selectionEnd = s + btn.md.length; handleChange({ target: { name: "content", value: ta.value } } as any); }
              }} className="rounded border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition">{btn.label}</button>
            ))}
            <span className="text-[11px] text-slate-400 self-center ml-2">Char: {form.content.length}</span>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <textarea id="content" name="content" rows={18} value={form.content} onChange={handleChange} className={`${fieldClass} font-mono text-sm`} placeholder="Write your content in Markdown..." />
              {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
            </div>
            <div className="hidden lg:block flex-1 rounded-lg border border-slate-200 bg-white p-4 overflow-y-auto max-h-[500px]">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Preview</p>
              <div className="text-sm leading-7 text-slate-600 prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-lg prose-h3:text-base prose-a:text-blue-600 prose-blockquote:border-l-2 prose-blockquote:border-slate-300 prose-blockquote:pl-4 prose-blockquote:text-slate-500 prose-table:text-xs prose-th:bg-slate-50 prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1" dangerouslySetInnerHTML={{ __html: form.content
                .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/^\- (.+)$/gm, '<li>$1</li>')
                .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/^(.+)$/gm, '<p>$1</p>')
              }} />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">Upload & Insert Image</p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Alt Text</label>
              <input type="text" id="imageAlt" placeholder="Custom patch image" className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-full" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Select Image (max 5MB)</label>
              <input type="file" id="imageFile" accept=".jpg,.jpeg,.png,.webp,.gif" className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-700" onChange={async (e) => {
                const file = e.target.files?.[0]; if (!file) return;
                const altText = (document.getElementById("imageAlt") as HTMLInputElement)?.value || "Custom patch image";
                const formData = new FormData(); formData.append("image", file);
                try {
                  const res = await fetch("/api/admin/content/upload-image", { method: "POST", body: formData });
                  if (res.status === 401) { alert("Session expired. Please log in again."); return; }
                  const data = await res.json();
                  if (data.success) {
                    const md = `\n![${altText}](${data.url})\n`;
                    const ta = document.getElementById("content") as HTMLTextAreaElement;
                    if (ta) { const start = ta.selectionStart; ta.value = ta.value.slice(0, start) + md + ta.value.slice(ta.selectionEnd); ta.focus(); handleChange({ target: { name: "content", value: ta.value } } as any); }
                    (document.getElementById("uploadStatus") as HTMLElement).innerHTML = '<span class="text-emerald-600 text-xs font-semibold">✓ Image inserted</span>';
                    setTimeout(() => { (document.getElementById("uploadStatus") as HTMLElement).innerHTML = ""; }, 3000);
                  } else { (document.getElementById("uploadStatus") as HTMLElement).innerHTML = `<span class="text-red-600 text-xs font-semibold">${data.error}</span>`; }
                } catch { (document.getElementById("uploadStatus") as HTMLElement).innerHTML = '<span class="text-red-600 text-xs font-semibold">Upload failed</span>'; }
              }} />
            </div>
          </div>
          <div id="uploadStatus" className="mt-2"></div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create Post"}
          </button>
          <Link href="/admin/content/blog" className="text-sm text-slate-500 hover:text-slate-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
