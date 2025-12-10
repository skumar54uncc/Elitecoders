import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Generate unique filename (sanitize extension)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const originalExtension = file.name.split(".").pop()?.toLowerCase() || "";
    // Sanitize extension - only allow alphanumeric characters
    const sanitizedExtension = originalExtension.replace(/[^a-z0-9]/g, "");
    if (!sanitizedExtension) {
      return NextResponse.json(
        { message: "Invalid file extension" },
        { status: 400 }
      );
    }
    const filename = `${timestamp}-${randomString}.${sanitizedExtension}`;

    // Save file to public/images/blog directory
    const uploadDir = join(process.cwd(), "public", "images", "blog");
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/images/blog/${filename}`;

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        url: publicUrl,
        filename: filename,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "An error occurred uploading the file" },
      { status: 500 }
    );
  }
}

