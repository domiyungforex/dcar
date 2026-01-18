import { type NextRequest, NextResponse } from "next/server"
import { saveSubmission } from "@/lib/redis-submissions"
import { put } from "@vercel/blob"

/**
 * POST /api/submissions/file-upload
 * Handle customer file uploads with Vercel Blob storage
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const email = formData.get("email") as string
    const productId = formData.get("productId") as string
    const description = formData.get("description") as string

    if (!file || !email) {
      return NextResponse.json({ error: "Missing file or email" }, { status: 400 })
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 })
    }

    const blob = await put(`uploads/${Date.now()}-${file.name}`, file, { access: "public" })

    const submission = await saveSubmission("file-upload", email, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: blob.url,
      filePath: blob.pathname,
      description,
      productId,
      uploadedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, id: submission.id, fileUrl: blob.url }, { status: 201 })
  } catch (error) {
    console.error("[v0] File upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
