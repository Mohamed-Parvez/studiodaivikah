import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { cloudinary } from "@/lib/cloudinary";

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

    // Validate extension
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cleanBaseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const uniqueFileName = `resume_${Date.now()}_${cleanBaseName}${ext}`;

    // 1. Try Cloudinary if credentials are configured (standard in this app)
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const uploadResult: any = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "resumes",
                resource_type: "auto",
                public_id: `resume_${Date.now()}_${cleanBaseName}`,
              },
              (err, result) => {
                if (err || !result) reject(err);
                else resolve(result);
              }
            )
            .end(buffer);
        });

        if (uploadResult?.secure_url) {
          return NextResponse.json(
            {
              success: true,
              url: uploadResult.secure_url,
              fileName: originalName,
              size: file.size,
            },
            { status: 200 }
          );
        }
      } catch (cloudErr) {
        console.error("Cloudinary upload failed, attempting fallback:", cloudErr);
      }
    }

    // 2. Try Vercel Blob if token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
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
      } catch (blobErr) {
        console.error("Vercel Blob upload failed, attempting fallback:", blobErr);
      }
    }

    // 3. Try writing to local disk (public/uploads/resumes) - works in local dev
    try {
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
    } catch (fsErr: any) {
      // If filesystem is read-only (EROFS on Vercel/AWS Lambda)
      if (fsErr.code === "EROFS" || fsErr.message?.includes("read-only")) {
        console.warn("Read-only serverless filesystem detected (EROFS). Converting resume to Data URL fallback.");
        const base64Data = buffer.toString("base64");
        const mimeType = file.type || (ext === ".pdf" ? "application/pdf" : "application/octet-stream");
        const dataUrl = `data:${mimeType};base64,${base64Data}`;

        return NextResponse.json(
          {
            success: true,
            url: dataUrl,
            fileName: originalName,
            size: file.size,
          },
          { status: 200 }
        );
      }
      throw fsErr;
    }
  } catch (error: any) {
    console.error("Resume upload failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process resume upload" },
      { status: 500 }
    );
  }
}
