import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  const results: Record<string, unknown> = {
    supabaseUrlSet: !!supabaseUrl,
    supabaseKeySet: !!supabaseKey,
    supabaseUrl: supabaseUrl || "NOT SET",
    keyType: supabaseKey ? (supabaseKey.startsWith("eyJ") ? "JWT token (correct)" : "Unknown format") : "NOT SET",
    keyLength: supabaseKey?.length || 0,
  };

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      success: false,
      message: "Supabase not configured",
      results,
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // List buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      results.bucketsError = bucketsError.message;
    } else {
      results.buckets = buckets?.map(b => ({ name: b.name, public: b.public })) || [];
    }

    // Try to list files in 'images' bucket
    const { data: files, error: filesError } = await supabase.storage
      .from("images")
      .list("", { limit: 5 });

    if (filesError) {
      results.filesError = filesError.message;
    } else {
      results.filesInImagesBucket = files?.length || 0;
    }

    return NextResponse.json({
      success: !bucketsError && !filesError,
      message: bucketsError || filesError ? "Some errors occurred" : "Storage connection successful",
      results,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      results,
    });
  }
}

