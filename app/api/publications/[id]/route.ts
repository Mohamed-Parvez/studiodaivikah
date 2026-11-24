import prisma from "@/lib/Client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "ID parameter missing" }, { status: 400 });
  }

  try {
    const publication = await prisma.publication.findUnique({ where: { id } });

    if (!publication) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 });
    }

    return NextResponse.json(publication);
  } catch (error) {
    console.error("GET publication error:", error);
    return NextResponse.json({ error: "Failed to fetch publication" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "ID parameter missing" }, { status: 400 });
  }

  try {
    const { title, description, link, image, isHidden } = await request.json();

    const updated = await prisma.publication.update({
      where: { id },
      data: {
        title,
        description,
        link,
        image: image !== undefined ? image : null,
        ...(isHidden !== undefined && { isHidden: Boolean(isHidden) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT publication error:", error);
    return NextResponse.json({ error: "Failed to update publication" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "ID parameter missing" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const updated = await prisma.publication.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.link !== undefined && { link: body.link }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.isHidden !== undefined && { isHidden: Boolean(body.isHidden) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH publication error:", error);
    return NextResponse.json({ error: "Failed to patch publication" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "ID parameter missing" }, { status: 400 });
  }

  try {
    const deleted = await prisma.publication.delete({ where: { id } });
    return NextResponse.json(deleted);
  } catch (error) {
    console.error("DELETE publication error:", error);
    return NextResponse.json({ error: "Failed to delete publication" }, { status: 500 });
  }
}
