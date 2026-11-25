import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided for upload" },
        { status: 400 }
      );
    }

    // Limit to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Resume file size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Validate mime type or extension
    const originalName = file.name || "resume.pdf";
    const ext = path.extname(originalName).toLowerCase();
    const allowedExts = [".pdf", ".doc", ".docx"];
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file format. Please upload a PDF or Word document (.pdf, .doc, .docx)",
        },
        { status: 400 }
      );
    }

    const cleanBaseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const uniqueFileName = `resume_${Date.now()}_${cleanBaseName}${ext}`;

    // If running in production with Vercel Blob configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`resumes/${uniqueFileName}`, file, {
        access: "public",
      });
      return NextResponse.json(
        {
          success: true,
          url: blob.url,
          fileName: originalName,
          size: file.size,
        },
        { status: 200 }
      );
    }

    // Save locally into public/uploads/resumes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueFileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/resumes/${uniqueFileName}`;

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        fileName: originalName,
        size: file.size,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resume upload failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process resume upload" },
      { status: 500 }
    );
  }
}
