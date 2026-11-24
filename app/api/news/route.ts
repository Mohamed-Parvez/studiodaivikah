import prisma from "@/lib/Client";
import { NextResponse } from "next/server";

// GET all news
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const all = url.searchParams.get("all") === "true";

    const news = await prisma.news.findMany({
      where: all ? {} : { isHidden: false },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ news });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST new news
export async function POST(request: Request) {
  try {
    const { src, title, image, isHidden } = await request.json();

    if (!src || !title || !image) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newNews = await prisma.news.create({
      data: {
        src,
        title,
        image,
        isHidden: Boolean(isHidden),
      },
    });

    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
