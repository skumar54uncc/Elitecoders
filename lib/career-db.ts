import { prisma } from "./prisma";

export interface CareerPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  location: string | null;
  employmentType: string;
  department: string | null;
  date: string;
}

// Get all published career posts
export async function getAllCareerPosts(): Promise<CareerPost[]> {
  try {
    const posts = await prisma.careerPost.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
    });

    return posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      location: post.location,
      employmentType: post.employmentType,
      department: post.department,
      date: post.date.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error reading career posts from database:", error);
    return [];
  }
}

// Get a single career post by slug
export async function getCareerPost(slug: string): Promise<CareerPost | null> {
  try {
    const post = await prisma.careerPost.findFirst({
      where: { slug, published: true },
    });

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      location: post.location,
      employmentType: post.employmentType,
      department: post.department,
      date: post.date.toISOString().split("T")[0],
    };
  } catch (error) {
    console.error("Error reading career post from database:", error);
    return null;
  }
}

// Convert markdown-like content to HTML (simple conversion)
export function markdownToHtml(content: string): string {
  let html = content;

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Lists
  html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/^(\d+)\. (.*$)/gim, "<li>$2</li>");

  // Wrap consecutive list items in ul/ol
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return `<ul>${match}</ul>`;
  });

  // Paragraphs
  html = html
    .split("\n\n")
    .map((paragraph) => {
      if (!paragraph.trim()) return "";
      if (paragraph.startsWith("<")) return paragraph; // Already HTML
      return `<p>${paragraph.trim()}</p>`;
    })
    .join("\n");

  // Line breaks
  html = html.replace(/\n/g, "<br>");

  return html;
}

