import { type NextRequest, NextResponse } from "next/server"
import { saveSubmission } from "@/lib/redis-submissions"

/**
 * POST /api/submissions/inquiry
 * Handle product inquiry form submissions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, productId, message, phone } = body

    // Validation
    if (!email || !name || !productId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save submission
    const submission = await saveSubmission("inquiry", email, {
      name,
      productId,
      message,
      phone,
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 })
  } catch (error) {
    console.error("[v0] Inquiry submission error:", error)
    return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 })
  }
}
