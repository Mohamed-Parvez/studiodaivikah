import { NextResponse } from "next/server";
import prisma from "@/lib/Client";

// GET /api/careers/applications - List all job applications
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const whereClause: any = {};

    if (jobId && jobId !== "all") {
      whereClause.jobId = jobId;
    }

    if (status && status !== "all") {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const applications = await prisma.jobApplication.findMany({
      where: whereClause,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, applications }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// PATCH /api/careers/applications - Update application status
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID and status are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: { status },
      include: {
        job: {
          select: {
            title: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, application: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update status" },
      { status: 500 }
    );
  }
}

// DELETE /api/careers/applications - Delete application
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    await prisma.jobApplication.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Application deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete application" },
      { status: 500 }
    );
  }
}
