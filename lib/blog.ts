import fs from "fs";
import path from "path";

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

const blogDirectory = path.join(process.cwd(), "content", "blog");

// Parse frontmatter from markdown/txt file
function parseFrontmatter(content: string): {
  frontmatter: Record<string, string>;
  body: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (match) {
    const frontmatterText = match[1];
    const body = match[2];
    const frontmatter: Record<string, string> = {};

    frontmatterText.split("\n").forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, "");
        frontmatter[key] = value;
      }
    });

    return { frontmatter, body };
  }

  // If no frontmatter, treat entire content as body
  return { frontmatter: {}, body: content };
}

// Calculate read time (average 200 words per minute)
function calculateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

// Get all blog posts
export function getAllBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(blogDirectory)) {
      fs.mkdirSync(blogDirectory, { recursive: true });
      return [];
    }

    const fileNames = fs.readdirSync(blogDirectory);
    const posts: BlogPost[] = [];

    for (const fileName of fileNames) {
      // Skip README files and other documentation files
      const fileNameLower = fileName.toLowerCase();
      if (fileNameLower.startsWith("readme") || fileNameLower.startsWith(".git")) {
        continue;
      }

      if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
        const filePath = path.join(blogDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { frontmatter, body } = parseFrontmatter(fileContents);

        const slug = fileName.replace(/\.(txt|md)$/, "");

        // Extract excerpt from body if not in frontmatter
        let excerpt = frontmatter.excerpt || "";
        if (!excerpt && body) {
          const firstParagraph = body.split("\n\n")[0];
          excerpt = firstParagraph.substring(0, 200).trim();
          if (firstParagraph.length > 200) excerpt += "...";
        }

        posts.push({
          slug,
          title: frontmatter.title || slug.replace(/-/g, " "),
          excerpt,
          content: body,
          date: frontmatter.date || new Date().toISOString().split("T")[0],
          readTime: calculateReadTime(body),
          category: frontmatter.category || "General",
          image: frontmatter.image,
          author: frontmatter.author || "Elite Surgical Coders",
          tags: frontmatter.tags
            ? frontmatter.tags.split(",").map((t) => t.trim())
            : [],
        });
      }
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

// Get a single blog post by slug
export function getBlogPost(slug: string): BlogPost | null {
  const posts = getAllBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
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

