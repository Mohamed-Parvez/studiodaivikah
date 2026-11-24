import prisma from "@/lib/Client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  
  try {
    const teamMember = await prisma.team.findUnique({ where: { id } });
    
    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }
    
    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch team member" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  
  try {
    const { image, name, role, description, isHidden } = await request.json();
    
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    
    const updatedTeamMember = await prisma.team.update({
      where: { id },
      data: {
        image,
        name,
        role,
        description: description !== undefined ? description : null,
        ...(isHidden !== undefined && { isHidden: Boolean(isHidden) }),
      },
    });
    
    return NextResponse.json(updatedTeamMember);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  
  try {
    const body = await request.json();
    
    const updatedTeamMember = await prisma.team.update({
      where: { id },
      data: {
        ...(body.image !== undefined && { image: body.image }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.role !== undefined && { role: body.role }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.isHidden !== undefined && { isHidden: Boolean(body.isHidden) }),
      },
    });
    
    return NextResponse.json(updatedTeamMember);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Failed to patch team member" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  
  try {
    const deletedTeamMember = await prisma.team.delete({ where: { id } });
    return NextResponse.json(deletedTeamMember);
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
