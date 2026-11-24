import prisma from "@/lib/Client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const project = await prisma.project2.findUnique({ where: { id } });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const { title, image, isHidden } = await request.json();

  const updated = await prisma.project2.update({
    where: { id },
    data: {
      title,
      image,
      ...(isHidden !== undefined && { isHidden: Boolean(isHidden) }),
    },
  });

  return NextResponse.json(updated);
}

export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const body = await request.json();

  const updated = await prisma.project2.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.isHidden !== undefined && { isHidden: Boolean(body.isHidden) }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();

  const deleted = await prisma.project2.delete({ where: { id } });
  return NextResponse.json(deleted);
}
