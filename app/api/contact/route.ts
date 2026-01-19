import { type NextRequest, NextResponse } from "next/server"
import { saveSubmission } from "@/lib/redis-submissions"
import { sendEmailNotification } from "@/lib/email-service"

/**
 * POST /api/contact
 * Handle contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validation
    if (!email || !name || !message || !subject) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save contact submission
    const submission = await saveSubmission("inquiry", email, {
      type: "contact",
      name,
      phone,
      subject,
      message,
      submittedAt: new Date().toISOString(),
    })

    // Send email notification
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
    sendEmailNotification("New Contact Form Submission", html).catch(err => console.error("Email error:", err))

    return NextResponse.json(
      {
        success: true,
        id: submission.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Contact submission error:", error)
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}
