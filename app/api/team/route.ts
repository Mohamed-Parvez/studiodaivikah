import prisma from "@/lib/Client";
import { NextResponse } from "next/server";

// GET all team members
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const all = url.searchParams.get("all") === "true";

    const items = await prisma.team.findMany({
      where: all ? {} : { isHidden: false },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// POST new team member
export async function POST(request: Request) {
  try {
    const { image, name, role, isHidden } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const newMember = await prisma.team.create({
      data: {
        image,
        name: name || "",
        role: role || "",
        isHidden: Boolean(isHidden),
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
