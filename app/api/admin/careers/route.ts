import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const careerPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  location: z.string().optional(),
  employmentType: z.string().default("Full-time"),
  department: z.string().optional(),
  published: z.boolean().default(false),
});

// GET - List all career posts
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get("published");

    const where = published !== null ? { published: published === "true" } : {};

    const posts = await prisma.careerPost.findMany({
      where,
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        location: true,
        employmentType: true,
        department: true,
        date: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching career posts:", error);
    return NextResponse.json(
      { message: "An error occurred fetching career posts" },
      { status: 500 }
    );
  }
}

// POST - Create new career post
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validationResult = careerPostSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if slug already exists
    const existingPost = await prisma.careerPost.findUnique({
      where: { slug: data.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { message: "A career post with this slug already exists" },
        { status: 400 }
      );
    }

    // Convert empty strings to null for optional fields
    const createData = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt && data.excerpt.trim() !== "" ? data.excerpt : null,
      content: data.content,
      location: data.location && data.location.trim() !== "" ? data.location : null,
      employmentType: data.employmentType || "Full-time",
      department: data.department && data.department.trim() !== "" ? data.department : null,
      published: data.published || false,
      createdBy: user.id,
      updatedBy: user.id,
    };

    const post = await prisma.careerPost.create({
      data: createData,
    });

    return NextResponse.json(
      { message: "Career post created successfully", post },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating career post:", error);
    // Return the actual error message for debugging
    return NextResponse.json(
      { 
        message: "An error occurred creating the career post",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

