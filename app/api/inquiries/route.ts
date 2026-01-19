import { type NextRequest, NextResponse } from "next/server"
import { saveSubmission } from "@/lib/redis-submissions"
import { sendInquiryNotification } from "@/lib/email-service"

/**
 * POST /api/inquiries - Save car inquiry (redirects to /api/submissions/inquiry)
 * This endpoint is kept for backward compatibility with the InquiryForm component
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { carId, name, email, phone, message } = body

    // Validation
    if (!email || !name || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save as a submission using Redis
    const submission = await saveSubmission("inquiry", email, {
      name,
      carId,
      phone,
      message,
      submittedAt: new Date().toISOString(),
    })

    // Send email notification
    sendInquiryNotification(submission).catch(err => console.error("Email error:", err))

    return NextResponse.json(
      {
        id: submission.id,
        carId,
        name,
        email,
        phone,
        message,
        createdAt: submission.createdAt,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Inquiry submission error:", error)
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}
