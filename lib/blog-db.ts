import { prisma } from "./prisma";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  author?: string;
  tags?: string[];
}

// Calculate read time (average 200 words per minute)
function calculateReadTime(content: string): string {
  if (!content || content.trim().length === 0) {
    return "1 min read";
  }
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// Get all published blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
    });

    return posts.map((post: any) => {
      // Parse tags from JSON string (for SQLite compatibility)
      let tags: string[] = [];
      try {
        if (typeof post.tags === 'string') {
          tags = JSON.parse(post.tags || '[]');
        } else if (Array.isArray(post.tags)) {
          tags = post.tags;
        }
      } catch {
        tags = [];
      }

      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || "",
        content: post.content,
        date: post.date.toISOString().split("T")[0],
        readTime: calculateReadTime(post.content),
        category: post.category,
        image: post.image || undefined,
        author: post.author || undefined,
        tags: tags,
      };
    });
  } catch (error) {
    console.error("Error reading blog posts from database:", error);
    return [];
  }
}

// Get a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug, published: true },
    });

    if (!post) {
      return null;
    }

    // Parse tags from JSON string (for SQLite compatibility)
    let tags: string[] = [];
    try {
      if (typeof post.tags === 'string') {
        tags = JSON.parse(post.tags || '[]');
      } else if (Array.isArray(post.tags)) {
        tags = post.tags;
      }
    } catch {
      tags = [];
    }

    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content,
      date: post.date.toISOString().split("T")[0],
      readTime: calculateReadTime(post.content),
      category: post.category,
      image: post.image || undefined,
      author: post.author || undefined,
      tags: tags,
    };
  } catch (error) {
    console.error("Error reading blog post from database:", error);
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

