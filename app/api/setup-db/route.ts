import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDevApiEnabled } from "@/lib/dev-endpoints";

/**
 * Database connectivity check (disabled in production unless ENABLE_DEV_API=true).
 * Use Prisma migrations for schema changes.
 */
export async function GET() {
  if (!isDevApiEnabled()) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    // Test database connection
    await prisma.$connect();
    
    // Try to query a table to see if it exists
    try {
      await prisma.user.findFirst();
      return NextResponse.json({
        success: true,
        message: "Database is already set up. Tables exist.",
      });
    } catch (error) {
      // Tables don't exist, need to run migrations
      return NextResponse.json({
        success: false,
        message: "Database tables don't exist. You need to run migrations.",
        instructions: [
          "1. Install Vercel CLI: npm i -g vercel",
          "2. Login: vercel login",
          "3. Link project: vercel link",
          "4. Pull env: vercel env pull",
          "5. Run migrations: npx prisma migrate deploy",
        ],
        error: error instanceof Error ? error.message : "Unknown error",
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Database connection failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      commonIssues: [
        "1. DATABASE_URL not set in environment variables",
        "2. Database not connected in Vercel",
        "3. Wrong database connection string",
        "4. Database server not accessible",
      ],
    }, { status: 500 });
  }
}

