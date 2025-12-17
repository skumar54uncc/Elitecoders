"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut, FileText, Briefcase, Loader2, Users } from "lucide-react";
import ApplicationsDashboard from "./ApplicationsDashboard";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  category: string;
  author: string;
  tags: string | string[]; // Can be JSON string or array
  date: Date;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CareerPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  location: string | null;
  employmentType: string;
  department: string | null;
  date: Date;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "blog";
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [careerPosts, setCareerPosts] = useState<CareerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeTab === "blog") {
      fetchBlogPosts();
    } else if (activeTab === "careers") {
      fetchCareerPosts();
    }
    // Applications are handled by ApplicationsDashboard component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch("/api/admin/blogs");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      // Parse tags from JSON string if needed
      const postsWithParsedTags = data.posts.map((post: BlogPost) => {
        const parsedPost = { ...post };
        if (typeof parsedPost.tags === 'string') {
          try {
            parsedPost.tags = JSON.parse(parsedPost.tags);
          } catch {
            parsedPost.tags = [];
          }
        }
        return parsedPost;
      });
      setBlogPosts(postsWithParsedTags);
    } catch (error) {
      setError("Failed to load blog posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCareerPosts = async () => {
    try {
      const response = await fetch("/api/admin/careers");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to fetch career posts");
      }
      const data = await response.json();
      setCareerPosts(data.posts);
    } catch (error) {
      setError("Failed to load career posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setBlogPosts(blogPosts.filter((post) => post.id !== id));
    } catch (error) {
      alert("Failed to delete blog post");
      console.error(error);
    }
  };

  const handleDeleteCareer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this career posting?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete career post");
      }

      setCareerPosts(careerPosts.filter((post) => post.id !== id));
    } catch (error) {
      alert("Failed to delete career posting");
      console.error(error);
    }
  };

  const handleTogglePublishBlog = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const data = await response.json();
      setBlogPosts(
        blogPosts.map((post) => (post.id === id ? data.post : post))
      );
    } catch (error) {
      alert("Failed to update blog post");
      console.error(error);
    }
  };

  const handleTogglePublishCareer = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update career post");
      }

      const data = await response.json();
      setCareerPosts(
        careerPosts.map((post) => (post.id === id ? data.post : post))
      );
    } catch (error) {
      alert("Failed to update career posting");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentPosts = activeTab === "blog" ? blogPosts : careerPosts;
  const isEmpty = currentPosts.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your content</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href={activeTab === "blog" ? "/admin/blogs" : "/admin/careers"}
                className="inline-flex items-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">New {activeTab === "blog" ? "Post" : "Posting"}</span>
                <span className="sm:hidden">New</span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-gray-700 hover:text-primary transition-colors p-2 sm:p-0"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 sm:space-x-8 min-w-max">
            <Link
              href="/admin?tab=blog"
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === "blog"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Blog Posts</span>
                <span className="sm:hidden">Blog</span>
              </div>
            </Link>
            <Link
              href="/admin?tab=careers"
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === "careers"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Career Postings</span>
                <span className="sm:hidden">Careers</span>
              </div>
            </Link>
            <Link
              href="/admin?tab=applications"
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === "applications"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Applications</span>
                <span className="sm:hidden">Apps</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "applications" ? (
          <ApplicationsDashboard />
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {isEmpty ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            {activeTab === "blog" ? (
              <>
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No blog posts yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first blog post.</p>
                <Link
                  href="/admin/blogs"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Post
                </Link>
              </>
            ) : (
              <>
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No career postings yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first career posting.</p>
                <Link
                  href="/admin/careers"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Posting
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-gray-200">
              {activeTab === "blog" ? (
                blogPosts.map((post) => (
                  <div key={post.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{post.title}</h3>
                        <p className="text-xs text-gray-500">/{post.slug}</p>
                      </div>
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{post.category}</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2 border-t">
                      <button
                        onClick={() => handleTogglePublishBlog(post.id, post.published)}
                        className="p-2 text-gray-600 hover:text-primary rounded-md hover:bg-gray-100"
                      >
                        {post.published ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      <Link
                        href={`/admin/blogs/${post.id}`}
                        className="p-2 text-primary hover:text-primary-dark rounded-md hover:bg-gray-100"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteBlog(post.id)}
                        className="p-2 text-red-600 hover:text-red-800 rounded-md hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                careerPosts.map((post) => (
                  <div key={post.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{post.title}</h3>
                        <p className="text-xs text-gray-500">{post.location || "No location"} • {post.employmentType}</p>
                      </div>
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>/{post.slug}</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2 border-t">
                      <button
                        onClick={() => handleTogglePublishCareer(post.id, post.published)}
                        className="p-2 text-gray-600 hover:text-primary rounded-md hover:bg-gray-100"
                      >
                        {post.published ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      <Link
                        href={`/admin/careers/${post.id}`}
                        className="p-2 text-primary hover:text-primary-dark rounded-md hover:bg-gray-100"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteCareer(post.id)}
                        className="p-2 text-red-600 hover:text-red-800 rounded-md hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <table className="hidden sm:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  {activeTab === "blog" ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeTab === "blog" ? (
                  blogPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">/{post.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            post.published
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTogglePublishBlog(post.id, post.published)}
                            className="text-gray-600 hover:text-primary transition-colors"
                            title={post.published ? "Unpublish" : "Publish"}
                          >
                            {post.published ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                          <Link
                            href={`/admin/blogs/${post.id}`}
                            className="text-primary hover:text-primary-dark transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteBlog(post.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  careerPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">/{post.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.location || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          {post.employmentType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            post.published
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTogglePublishCareer(post.id, post.published)}
                            className="text-gray-600 hover:text-primary transition-colors"
                            title={post.published ? "Unpublish" : "Publish"}
                          >
                            {post.published ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                          <Link
                            href={`/admin/careers/${post.id}`}
                            className="text-primary hover:text-primary-dark transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteCareer(post.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
}

