import { type NextRequest, NextResponse } from "next/server"
import { listFiles, deleteFile } from "@/lib/blob-storage"

/**
 * GET /api/admin/files - List all files by category
 * DELETE /api/admin/files - Delete a file
 */

function verifyAdminCode(request: NextRequest): boolean {
  const code = request.headers.get("x-admin-code")
  return code === process.env.ADMIN_ACCESS_CODE
}

export async function GET(request: NextRequest) {
  if (!verifyAdminCode(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "uploads"

    const files = await listFiles(category)
    return NextResponse.json(files, { status: 200 })
  } catch (error) {
    console.error("[v0] List files error:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminCode(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { pathname } = body

    if (!pathname) {
      return NextResponse.json({ error: "Missing pathname" }, { status: 400 })
    }

    await deleteFile(pathname)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Delete file error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
