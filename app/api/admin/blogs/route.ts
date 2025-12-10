import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  image: z.string().optional(),
  category: z.string().default("Blog"),
  author: z.string().default("Elite Surgical Coders"),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

// GET - List all blog posts
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get("published");

    const where = published !== null ? { published: published === "true" } : {};

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        category: true,
        author: true,
        tags: true,
        date: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { message: "An error occurred fetching blog posts" },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validationResult = blogPostSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { message: "A blog post with this slug already exists" },
        { status: 400 }
      );
    }

    // Convert tags array to JSON string for SQLite compatibility
    const tagsString = Array.isArray(data.tags) ? JSON.stringify(data.tags) : (data.tags || '[]');

    const post = await prisma.blogPost.create({
      data: {
        ...data,
        tags: tagsString,
        createdBy: user.id,
        updatedBy: user.id,
      },
    });

    return NextResponse.json(
      { message: "Blog post created successfully", post },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { message: "An error occurred creating the blog post" },
      { status: 500 }
    );
  }
}

