import { type NextRequest, NextResponse } from "next/server"
import { getSubmissions, updateSubmissionStatus, deleteSubmission } from "@/lib/redis-submissions"

/**
 * GET /api/admin/submissions - Fetch all submissions
 * POST /api/admin/submissions - Update submission status
 * DELETE /api/admin/submissions - Delete submission
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
    const type = searchParams.get("type") as "inquiry" | "newsletter" | "file-upload" | null

    const submissions = await getSubmissions(type || undefined)
    return NextResponse.json(submissions, { status: 200 })
  } catch (error) {
    console.error("[v0] Get submissions error:", error)
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminCode(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 })
    }

    await updateSubmissionStatus(id, status)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Update status error:", error)
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminCode(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    await deleteSubmission(id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 })
  }
}
