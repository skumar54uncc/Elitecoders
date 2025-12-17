import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

// Helper function to delete image from Supabase Storage
async function deleteImageFromStorage(imageUrl: string | null) {
  if (!imageUrl || !imageUrl.includes("supabase.co")) return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Extract the file path from the URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/images/blog/filename.jpg
    const urlParts = imageUrl.split("/storage/v1/object/public/images/");
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      await supabase.storage.from("images").remove([filePath]);
      console.log("Deleted image from storage:", filePath);
    }
  } catch (error) {
    console.error("Error deleting image from storage:", error);
  }
}

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
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
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
    const updateData: Partial<{
      title: string;
      slug: string;
      excerpt: string | null;
      content: string;
      image: string | null;
      category: string;
      author: string;
      tags: string;
      published: boolean;
      updatedBy: string;
    }> = {};
    
    // Copy all fields except tags
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.published !== undefined) updateData.published = data.published;
    
    // Handle tags separately
    if (data.tags !== undefined) {
      updateData.tags = Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags;
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
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
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

    // Delete the image from Supabase Storage if it exists
    if (post.image) {
      await deleteImageFromStorage(post.image);
    }

    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Blog post deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { message: "An error occurred deleting the blog post" },
      { status: 500 }
    );
  }
}

