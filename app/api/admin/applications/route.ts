import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET - List all job applications
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const applications = await prisma.jobApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        careerPost: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { message: "An error occurred fetching applications" },
      { status: 500 }
    );
  }
}

