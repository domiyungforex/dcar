import { type NextRequest, NextResponse } from "next/server"
import { saveSubmission } from "@/lib/redis-submissions"

/**
 * POST /api/submissions/newsletter
 * Handle newsletter signup submissions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const submission = await saveSubmission("newsletter", email, {
      subscribedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 })
  } catch (error) {
    console.error("[v0] Newsletter submission error:", error)
    return NextResponse.json({ error: "Failed to save email" }, { status: 500 })
  }
}
