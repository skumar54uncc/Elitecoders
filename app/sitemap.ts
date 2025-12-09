import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog-db";
import { getAllCareerPosts } from "@/lib/career-db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitesurgicalcoders.com";
  
  let blogPosts: Awaited<ReturnType<typeof getAllBlogPosts>> = [];
  try {
    blogPosts = await getAllBlogPosts();
  } catch (error) {
    console.error("Error getting blog posts for sitemap:", error);
  }

  let careerPosts: Awaited<ReturnType<typeof getAllCareerPosts>> = [];
  try {
    careerPosts = await getAllCareerPosts();
  } catch (error) {
    console.error("Error getting career posts for sitemap:", error);
  }

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/resources/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const careerUrls = careerPosts.map((post) => ({
    url: `${baseUrl}/careers/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/specialties`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogUrls,
    ...careerUrls,
  ];
}

