import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

/**
 * POST /api/admin/upload - Admin file upload endpoint
 * Requires admin authentication via x-admin-code header
 */

function verifyAdminCode(request: NextRequest): boolean {
  const code = request.headers.get("x-admin-code")
  return code === process.env.ADMIN_ACCESS_CODE
}

export async function POST(request: NextRequest) {
  if (!verifyAdminCode(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 100MB)" }, { status: 400 })
    }

    const filename = `uploads/${Date.now()}-${file.name}`
    const blob = await put(filename, file, {
      access: "public",
    })

    return NextResponse.json(
      {
        success: true,
        url: blob.url,
        pathname: blob.pathname,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Admin upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
