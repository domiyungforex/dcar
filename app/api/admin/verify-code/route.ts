import { type NextRequest, NextResponse } from "next/server"

/**
 * POST /api/admin/verify-code
 * Verify admin access code (simple URL-based protection)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    const correctCode = process.env.ADMIN_ACCESS_CODE

    if (!correctCode) {
      console.error("[v0] Admin access code not configured")
      return NextResponse.json({ error: "Admin access not configured" }, { status: 500 })
    }

    if (code === correctCode) {
      return NextResponse.json({ valid: true }, { status: 200 })
    }

    return NextResponse.json({ valid: false, error: "Invalid code" }, { status: 401 })
  } catch (error) {
    console.error("[v0] Code verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
