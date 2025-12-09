import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft, MapPin, Briefcase } from "lucide-react";
import { getCareerPost, getAllCareerPosts, markdownToHtml } from "@/lib/career-db";
import JobApplicationForm from "@/components/JobApplicationForm";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllCareerPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for career posts:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getCareerPost(params.slug);

  if (!post) {
    return {
      title: "Career Posting Not Found",
    };
  }

  return {
    title: `${post.title} | Careers - Elite Surgical Coders`,
    description: post.excerpt || `Career opportunity: ${post.title}`,
  };
}

export default async function CareerPostPage({ params }: PageProps) {
  const post = await getCareerPost(params.slug);

  if (!post) {
    notFound();
  }

  const htmlContent = markdownToHtml(post.content);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary to-primary-dark py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/careers"
            className="mb-8 inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Careers</span>
          </Link>

          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">
            {post.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{post.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{post.employmentType}</span>
            </div>
            {post.department && (
              <div>
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full">
                  {post.department}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            {post.excerpt && (
              <div className="mb-8 p-4 bg-primary/5 border-l-4 border-primary rounded">
                <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
              </div>
            )}

            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

          </div>
        </div>

        {/* Application Form */}
        <div className="mt-12">
          <JobApplicationForm 
            positionTitle={post.title}
            careerPostId={post.id}
          />
        </div>
      </section>
    </div>
  );
}

