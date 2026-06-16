import { verifyAdminSession } from "@/lib/admin/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function safeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-_]/g, "")
    .substring(0, 80);
}

export async function POST(request: Request) {
  if (!(await verifyAdminSession())) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File) || file.size === 0) {
      return Response.json({ success: false, error: "No image file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ success: false, error: "Invalid file type. Allowed: JPG, PNG, WebP, GIF." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ success: false, error: "File too large. Maximum size is 5MB." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "content");
    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || ".webp";
    const datePrefix = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const baseName = safeName(path.basename(file.name, ext)) || "image";
    const fileName = `${datePrefix}-${baseName}-${Date.now().toString(36)}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/uploads/content/${fileName}`;

    return Response.json({ success: true, url, filename: fileName });
  } catch (error) {
    console.error("Image upload error:", error);
    return Response.json({ success: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
