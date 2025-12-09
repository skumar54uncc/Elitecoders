"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X, Loader2, ArrowLeft } from "lucide-react";

interface CareerPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  location: string | null;
  employmentType: string;
  department: string | null;
  published: boolean;
}

interface CareerEditorProps {
  post?: CareerPost;
}

export default function CareerEditor({ post }: CareerEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<CareerPost>({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    location: post?.location || "",
    employmentType: post?.employmentType || "Full-time",
    department: post?.department || "",
    published: post?.published || false,
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, post]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const url = post?.id ? `/api/admin/careers/${post.id}` : "/api/admin/careers";
      const method = post?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show more detailed error message
        const errorMessage = data.error 
          ? `${data.message}: ${data.error}`
          : data.message || "Failed to save career post";
        throw new Error(errorMessage);
      }

      setSuccess(post?.id ? "Career post updated successfully!" : "Career post created successfully!");
      setTimeout(() => {
        router.push("/admin?tab=careers");
      }, 1500);
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin?tab=careers"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  {post?.id ? "Edit Career Post" : "Create New Career Post"}
                </h1>
                <p className="text-sm text-gray-600">Manage your career postings</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Title */}
          <div className="bg-white rounded-lg shadow p-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Senior Surgical Coder"
            />
          </div>

          {/* Slug */}
          <div className="bg-white rounded-lg shadow p-6">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug * (URL-friendly)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              pattern="^[a-z0-9-]+$"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="senior-surgical-coder"
            />
            <p className="mt-1 text-sm text-gray-500">
              Only lowercase letters, numbers, and hyphens allowed
            </p>
          </div>

          {/* Location, Employment Type, Department */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Remote, New York, NY"
              />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type
              </label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Coding, Billing"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-lg shadow p-6">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt || ""}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Brief summary of the position (appears in listings)"
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow p-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Job Description & Requirements *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              placeholder="Write the full job description, requirements, responsibilities, and benefits here. You can use markdown-style formatting."
            />
            <p className="mt-2 text-sm text-gray-500">
              Supports markdown: **bold**, *italic*, # headers, - lists
            </p>
          </div>

          {/* Published Toggle */}
          <div className="bg-white rounded-lg shadow p-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, published: e.target.checked }))
                }
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Publish this posting (make it visible on the careers page)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/admin?tab=careers"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {post?.id ? "Update Posting" : "Create Posting"}
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

