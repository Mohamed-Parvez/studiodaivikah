import { NextResponse } from "next/server";
import prisma from "@/lib/Client";

// GET /api/careers/[id] - Get job details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, job }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching job details:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch job" },
      { status: 500 }
    );
  }
}

// PUT /api/careers/[id] - Update job details
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      isOpen,
      isHidden,
    } = body;

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

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(department !== undefined && { department: department.trim() }),
        ...(location !== undefined && { location: location.trim() }),
        ...(jobType !== undefined && { jobType: jobType.trim() }),
        ...(experience !== undefined && { experience: experience.trim() }),
        ...(salary !== undefined && { salary: salary ? salary.trim() : null }),
        ...(description !== undefined && { description: description.trim() }),
        ...(responsibilities !== undefined && {
          responsibilities: parseStringArray(responsibilities),
        }),
        ...(requirements !== undefined && {
          requirements: parseStringArray(requirements),
        }),
        ...(benefits !== undefined && {
          benefits: parseStringArray(benefits),
        }),
        ...(isOpen !== undefined && { isOpen: Boolean(isOpen) }),
        ...(isHidden !== undefined && { isHidden: Boolean(isHidden) }),
      },
    });

    return NextResponse.json({ success: true, job: updatedJob }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update job" },
      { status: 500 }
    );
  }
}

// PATCH /api/careers/[id] - Quick toggle isHidden / isOpen
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { isHidden, isOpen } = body;

    const dataToUpdate: any = {};
    if (isHidden !== undefined) dataToUpdate.isHidden = Boolean(isHidden);
    if (isOpen !== undefined) dataToUpdate.isOpen = Boolean(isOpen);

    const updatedJob = await prisma.job.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, job: updatedJob }, { status: 200 });
  } catch (error: any) {
    console.error("Error toggling job status:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update job status" },
      { status: 500 }
    );
  }
}

// DELETE /api/careers/[id] - Delete job
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete job" },
      { status: 500 }
    );
  }
}
