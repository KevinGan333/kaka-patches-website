"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

const fieldClass = "rounded-lg border border-slate-300 px-3 py-2 text-sm w-full";
const labelClass = "block text-sm font-medium text-slate-700 mb-1";

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    published: "bg-green-100 text-green-700",
    archived: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

export default function AdminEditBlogPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [notFound, setNotFound] = useState(false);
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

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/content/blog/${slug}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to load blog post");
        const data = await res.json();
        const post = data.post || data;
        setForm({
          title: post.title || "",
          slug: post.slug || "",
          excerpt: post.excerpt || "",
          category: post.category || "",
          status: post.status || "draft",
          tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "",
          seoTitle: post.seoTitle || "",
          seoDescription: post.seoDescription || "",
          content: post.content || "",
        });
      } catch (err: any) {
        setErrors({ _form: err.message || "An error occurred" });
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      const res = await fetch(`/api/admin/content/blog/${slug}`, {
        method: "PATCH",
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
          setErrors({ _form: data.message || "Failed to update blog post" });
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

  const handleArchive = async () => {
    if (!confirm("Are you sure you want to archive this post?")) return;
    setArchiving(true);
    try {
      const res = await fetch(`/api/admin/content/blog/${slug}`, { method: "DELETE" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to archive post");
        return;
      }
      router.push("/admin/content/blog");
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setArchiving(false);
    }
  };

  if (notFound) {
    return (
      <div className="px-6 py-8">
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
          <h2 className="text-lg font-bold text-slate-900">Post Not Found</h2>
          <p className="mt-2 text-sm text-slate-500">The blog post with slug &quot;{slug}&quot; does not exist.</p>
          <Link href="/admin/content/blog" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800">
            &larr; Back to Blog Posts
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-6 py-8">
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/content/blog" className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Back to Blog Posts
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Blog Post</h1>
            <p className="mt-1 text-sm text-slate-500">Editing: {form.title || slug}</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              Preview
            </a>
            <button
              type="button"
              onClick={handleArchive}
              disabled={archiving}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              {archiving ? "Archiving..." : "Archive"}
            </button>
          </div>
        </div>
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
              <option value="archived">Archived</option>
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/admin/content/blog" className="text-sm text-slate-500 hover:text-slate-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
