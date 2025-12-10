import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Require authentication for resume uploads
    await requireAuth();
  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type (PDF, DOC, DOCX)
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExtensions = ["pdf", "doc", "docx"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    // Validate both MIME type and extension
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { message: "Invalid file type. Only PDF, DOC, and DOCX files are allowed." },
        { status: 400 }
      );
    }

    // Validate MIME type matches extension
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. File MIME type does not match expected format." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for resumes)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Generate unique filename (sanitize extension)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    // Sanitize extension - only allow alphanumeric characters
    const sanitizedExtension = fileExtension.replace(/[^a-z0-9]/g, "");
    if (!sanitizedExtension || !allowedExtensions.includes(sanitizedExtension)) {
      return NextResponse.json(
        { message: "Invalid file extension" },
        { status: 400 }
      );
    }
    const filename = `${timestamp}-${randomString}.${sanitizedExtension}`;

    // Save file to public/uploads/resumes directory
    const uploadDir = join(process.cwd(), "public", "uploads", "resumes");
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/resumes/${filename}`;

    return NextResponse.json(
      {
        message: "Resume uploaded successfully",
        url: publicUrl,
        filename: filename,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { message: "An error occurred uploading the resume" },
      { status: 500 }
    );
  }
}

