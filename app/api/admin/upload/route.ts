import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase not configured. URL:", !!supabaseUrl, "Key:", !!supabaseKey);
      return NextResponse.json(
        { message: "File storage not configured. Please set up Supabase Storage." },
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

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const originalExtension = file.name.split(".").pop()?.toLowerCase() || "";
    const sanitizedExtension = originalExtension.replace(/[^a-z0-9]/g, "");
    if (!sanitizedExtension) {
      return NextResponse.json(
        { message: "Invalid file extension" },
        { status: 400 }
      );
    }
    const filename = `blog/${timestamp}-${randomString}.${sanitizedExtension}`;

    // Upload to Supabase Storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { data, error } = await supabase.storage
      .from("images")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", JSON.stringify(error, null, 2));
      console.error("Bucket: images, Filename:", filename);
      console.error("Supabase URL:", supabaseUrl);
      console.error("Key type:", supabaseKey?.substring(0, 20) + "...");
      return NextResponse.json(
        { message: `Upload failed: ${error.message}`, details: error },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(filename);

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        url: urlData.publicUrl,
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

