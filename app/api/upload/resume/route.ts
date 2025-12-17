import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase not configured for resume uploads");
      return NextResponse.json(
        { message: "File storage not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedExtension = fileExtension.replace(/[^a-z0-9]/g, "");
    if (!sanitizedExtension || !allowedExtensions.includes(sanitizedExtension)) {
      return NextResponse.json(
        { message: "Invalid file extension" },
        { status: 400 }
      );
    }
    const filename = `resumes/${timestamp}-${randomString}.${sanitizedExtension}`;

    // Upload to Supabase Storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error } = await supabase.storage
      .from("images")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase resume upload error:", error);
      return NextResponse.json(
        { message: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(filename);

    return NextResponse.json(
      {
        message: "Resume uploaded successfully",
        url: urlData.publicUrl,
        filename: filename,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { message: "An error occurred uploading the resume" },
      { status: 500 }
    );
  }
}

