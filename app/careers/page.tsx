import type { Metadata } from "next";
import Link from "next/link";
import { getAllCareerPosts } from "@/lib/career-db";
import { markdownToHtml } from "@/lib/career-db";

// Force dynamic rendering to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Elite Surgical Coders team. We are a specialized small team of certified professional coders.",
};

export default async function CareersPage() {
  const careerPosts = await getAllCareerPosts();

  return (
    <div className="bg-white">
      {/* Intro */}
      <section className="bg-gradient-to-b from-primary to-primary-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Careers</h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl">
              We are a specialized small team of certified professional coders and billing specialists.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {careerPosts.length === 0 ? (
            <div className="rounded-lg border-2 border-primary bg-white p-8 text-center shadow-lg">
              <h2 className="text-2xl font-semibold text-primary">Open Positions</h2>
              <p className="mt-4 text-gray-600">
                No open positions at this time. We are a small, specialized team, but we&apos;re always interested in connecting with talented certified professional coders who share our commitment to accuracy and excellence.
              </p>
              <p className="mt-4 text-gray-600">
                If you&apos;re a certified coder with experience in surgical coding, particularly in orthopedics, spine, or pain management, and you&apos;re interested in future opportunities, please{" "}
                <Link href="/contact" className="font-medium text-accent hover:text-accent-dark">
                  reach out
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary text-center mb-8">Open Positions</h2>
              {careerPosts.map((post) => (
                <div
                  key={post.slug}
                  className="rounded-lg border-2 border-primary bg-white p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-primary mb-2">{post.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        {post.location && (
                          <span className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {post.location}
                          </span>
                        )}
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                          {post.employmentType}
                        </span>
                        {post.department && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {post.department}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Posted: {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  
                  {post.excerpt && (
                    <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  )}
                  
                  <div
                    className="prose prose-sm max-w-none text-gray-700 mb-6"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
                  />
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <Link
                      href={`/careers/${post.slug}`}
                      className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-medium"
                    >
                      Apply Now
                    </Link>
                    <Link
                      href={`/careers/${post.slug}`}
                      className="text-primary hover:text-primary-dark font-medium transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

