import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// GET - List all job applications with filters
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const jobId = searchParams.get("jobId");
    const search = searchParams.get("search");
    const sortOrder = searchParams.get("sort") || "desc";

    // Build where clause
    const where: Prisma.JobApplicationWhereInput = {};
    
    if (status && status !== "all") {
      where.status = status;
    }
    
    if (jobId && jobId !== "all") {
      where.careerPostId = jobId;
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { positionTitle: { contains: search, mode: "insensitive" } },
      ];
    }

    const applications = await prisma.jobApplication.findMany({
      where,
      orderBy: { createdAt: sortOrder as "asc" | "desc" },
      include: {
        careerPost: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    // Get stats
    const stats = await prisma.jobApplication.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const totalCount = await prisma.jobApplication.count();

    // Get all job postings for filter dropdown
    const jobPostings = await prisma.careerPost.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({ 
      applications,
      stats: {
        total: totalCount,
        pending: stats.find(s => s.status === "pending")?._count.status || 0,
        accepted: stats.find(s => s.status === "accepted")?._count.status || 0,
        rejected: stats.find(s => s.status === "rejected")?._count.status || 0,
      },
      jobPostings,
    }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { message: "An error occurred fetching applications" },
      { status: 500 }
    );
  }
}

