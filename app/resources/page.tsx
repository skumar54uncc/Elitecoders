import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blog-db";

export const metadata: Metadata = {
  title: "Resources & Blog | Surgical Coding & Billing Articles",
  description: "Expert articles and resources on surgical coding, medical billing, No-Fault insurance, Workers' Compensation, and compliance for New York healthcare practices. Stay updated with the latest trends in medical coding.",
  keywords: [
    "surgical coding articles",
    "medical billing resources",
    "NY No-Fault billing",
    "workers compensation coding",
    "orthopedic coding",
    "spine surgery billing",
    "pain management coding",
    "medical coding best practices",
    "healthcare compliance",
    "CPT coding",
    "ICD-10 coding",
  ],
  openGraph: {
    title: "Resources & Blog | Elite Surgical Coders",
    description: "Expert articles on surgical coding, billing, and compliance for New York healthcare practices.",
    type: "website",
  },
};

export default async function ResourcesPage() {
  const blogPosts = await getAllBlogPosts();

  return (
    <div className="bg-white">
      {/* Intro */}
      <section className="bg-gradient-to-b from-primary to-primary-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Resources & Blog</h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl">
              Educational articles and resources to help you navigate surgical coding, billing, and compliance. Stay updated with the latest trends and best practices in medical coding.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No blog posts yet. Add .txt or .md files to the <code className="bg-gray-100 px-2 py-1 rounded">content/blog</code> folder.</p>
              <p className="text-sm text-gray-500">See <code className="bg-gray-100 px-2 py-1 rounded">content/blog/README.md</code> for instructions.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {blogPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="group rounded-lg border-2 border-gray-200 bg-white shadow-lg transition-all hover:border-primary hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="relative h-64 w-full overflow-hidden rounded-t-lg bg-primary">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-accent opacity-80" />
                      )}
                      <div className="absolute bottom-4 left-4 rounded-md bg-white/90 px-3 py-1">
                        <span className="text-sm font-semibold text-primary">{post.category}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <h2 className="mb-3 text-2xl font-bold text-primary group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>
                      <p className="mb-4 text-gray-600 leading-relaxed">{post.excerpt}</p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        href={`/resources/${post.slug}`}
                        className="inline-flex items-center gap-2 font-semibold text-accent transition-colors hover:text-accent-dark"
                      >
                        Read full article
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-12 rounded-lg bg-primary p-8 text-center">
                <h3 className="mb-4 text-2xl font-bold text-white">Have a Topic You&apos;d Like Us to Cover?</h3>
                <p className="mb-6 text-gray-200">
                  We&apos;re always looking for topics that would be helpful to New York practices.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-primary transition-colors hover:bg-accent-dark"
                >
                  Contact us
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
