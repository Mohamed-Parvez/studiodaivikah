import { NextResponse } from "next/server";
import prisma from "@/lib/Client";

// GET /api/careers - Fetch jobs
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const department = searchParams.get("department");
    const jobType = searchParams.get("jobType");
    const experience = searchParams.get("experience");
    const location = searchParams.get("location");
    const search = searchParams.get("search");

    const whereClause: any = {};

    if (!all) {
      whereClause.isHidden = false;
    }

    if (department && department !== "all") {
      whereClause.department = { equals: department, mode: "insensitive" };
    }

    if (jobType && jobType !== "all") {
      whereClause.jobType = { equals: jobType, mode: "insensitive" };
    }

    if (experience && experience !== "all") {
      whereClause.experience = { equals: experience, mode: "insensitive" };
    }

    if (location && location !== "all") {
      whereClause.location = { contains: location, mode: "insensitive" };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return NextResponse.json({ success: true, jobs }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST /api/careers - Create a new job
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      department,
      location,
      jobType,
      experience,
      salary,
      description,
      responsibilities,
      requirements,
      benefits,
      isOpen = true,
      isHidden = false,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Helper to ensure array of strings
    const parseStringArray = (val: any): string[] => {
      if (Array.isArray(val)) return val.filter((item) => typeof item === "string" && item.trim().length > 0);
      if (typeof val === "string") {
        return val
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
      return [];
    };

    const newJob = await prisma.job.create({
      data: {
        title: title.trim(),
        department: department?.trim() || "Architecture",
        location: location?.trim() || "Chennai (On-site)",
        jobType: jobType?.trim() || "Full-time",
        experience: experience?.trim() || "0-1 Years",
        salary: salary?.trim() || null,
        description: description.trim(),
        responsibilities: parseStringArray(responsibilities),
        requirements: parseStringArray(requirements),
        benefits: parseStringArray(benefits),
        isOpen: Boolean(isOpen),
        isHidden: Boolean(isHidden),
      },
    });

    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create job" },
      { status: 500 }
    );
  }
}
