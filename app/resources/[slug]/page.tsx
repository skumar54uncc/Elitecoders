import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import { getBlogPost, getAllBlogPosts, markdownToHtml } from "@/lib/blog-db";
import StructuredData from "@/components/StructuredData";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for blog posts:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Elite Surgical Coders Blog`,
    description: post.excerpt,
    keywords: post.tags || [],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author || "Elite Surgical Coders"],
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const htmlContent = markdownToHtml(post.content);

  return (
    <>
      <StructuredData type="blog" data={post} />
      <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary to-primary-dark py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/resources"
            className="mb-8 inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Resources</span>
          </Link>

          <div className="mb-4">
            <span className="rounded-md bg-accent/20 px-3 py-1 text-sm font-semibold text-accent">
              {post.category}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
            {post.author && (
              <div>
                <span>By {post.author}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.image && (
        <section className="relative h-96 w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </section>
      )}

      {/* Content */}
      <article className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-bold prose-p:text-gray-700 prose-strong:text-primary prose-ul:text-gray-700 prose-li:text-gray-700 prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-primary">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-accent hover:text-primary transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-lg bg-primary p-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-white">Need Help with Surgical Coding?</h3>
            <p className="mb-6 text-gray-200">
              Elite Surgical Coders provides expert coding and billing support for New York practices.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-primary transition-colors hover:bg-accent-dark"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </article>
      </div>
    </>
  );
}

