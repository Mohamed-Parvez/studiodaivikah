import prisma from "@/lib/Client";
import { NextResponse } from "next/server";

// GET all publications
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const all = url.searchParams.get("all") === "true";

    const publications = await prisma.publication.findMany({
      where: all ? {} : { isHidden: false },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ publications });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch publications" }, { status: 500 });
  }
}

// POST new publication
export async function POST(request: Request) {
  try {
    const { title, description, link, image, isHidden } = await request.json();

    if (!title || !description || !link) {
      return NextResponse.json({ error: "Title, description, and link are required fields" }, { status: 400 });
    }

    const newPublication = await prisma.publication.create({
      data: {
        title,
        description,
        link,
        image: image || null,
        isHidden: Boolean(isHidden),
      },
    });

    return NextResponse.json(newPublication, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create publication" }, { status: 500 });
  }
}
