import { type NextRequest, NextResponse } from "next/server"
import { listFiles } from "@/lib/blob-storage"

/**
 * GET /api/files - List all publicly accessible files
 * No authentication required - files are public
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "uploads"
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const allFiles = await listFiles(category)

    // Apply pagination
    const paginatedFiles = allFiles.slice(offset, offset + limit)

    return NextResponse.json(
      {
        files: paginatedFiles,
        total: allFiles.length,
        limit,
        offset,
        hasMore: offset + limit < allFiles.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] List public files error:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}
