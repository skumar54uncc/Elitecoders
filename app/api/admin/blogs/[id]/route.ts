import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required").optional(),
  image: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

// GET - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { message: "An error occurred fetching the blog post" },
      { status: 500 }
    );
  }
}

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    // If slug is being changed, check if new slug is available
    if (data.slug && data.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { message: "A blog post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Convert tags array to JSON string for SQLite compatibility
    const updateData: any = { ...data };
    if (updateData.tags && Array.isArray(updateData.tags)) {
      updateData.tags = JSON.stringify(updateData.tags);
    }

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        ...updateData,
        updatedBy: user.id,
      },
    });

    return NextResponse.json(
      { message: "Blog post updated successfully", post },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { message: "An error occurred updating the blog post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Blog post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { message: "An error occurred deleting the blog post" },
      { status: 500 }
    );
  }
}

