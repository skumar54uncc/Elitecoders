import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const careerPostSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required").optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  department: z.string().optional(),
  published: z.boolean().optional(),
});

// GET - Get single career post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const post = await prisma.careerPost.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Career post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching career post:", error);
    return NextResponse.json(
      { message: "An error occurred fetching the career post" },
      { status: 500 }
    );
  }
}

// PUT - Update career post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if post exists
    const existingPost = await prisma.careerPost.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Career post not found" },
        { status: 404 }
      );
    }

    // If slug is being changed, check if new slug is available
    if (data.slug && data.slug !== existingPost.slug) {
      const slugExists = await prisma.careerPost.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { message: "A career post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Convert empty strings to null for optional fields
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.excerpt !== undefined) {
      updateData.excerpt = data.excerpt && data.excerpt.trim() !== "" ? data.excerpt : null;
    }
    if (data.content !== undefined) updateData.content = data.content;
    if (data.location !== undefined) {
      updateData.location = data.location && data.location.trim() !== "" ? data.location : null;
    }
    if (data.employmentType !== undefined) updateData.employmentType = data.employmentType;
    if (data.department !== undefined) {
      updateData.department = data.department && data.department.trim() !== "" ? data.department : null;
    }
    if (data.published !== undefined) updateData.published = data.published;
    updateData.updatedBy = user.id;

    const post = await prisma.careerPost.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Career post updated successfully", post },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating career post:", error);
    // Return the actual error message for debugging
    return NextResponse.json(
      { 
        message: "An error occurred updating the career post",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete career post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const post = await prisma.careerPost.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Career post not found" },
        { status: 404 }
      );
    }

    await prisma.careerPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Career post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting career post:", error);
    return NextResponse.json(
      { message: "An error occurred deleting the career post" },
      { status: 500 }
    );
  }
}

