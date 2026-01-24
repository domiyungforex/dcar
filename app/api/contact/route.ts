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
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">📝 New Contact Form Submission</h2>
        
        <div style="background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 8px; margin: 15px 0;">
          <h3 style="margin: 0 0 15px 0; color: #333;">👤 Sender Information</h3>
          <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p style="margin: 8px 0;"><strong>Phone:</strong> ${phone}</p>
        </div>

        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">📌 Subject</h3>
          <p style="margin: 0; font-weight: bold; color: #0066cc;">${subject}</p>
        </div>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">💬 Message</h3>
          <p style="margin: 0; white-space: pre-wrap; background: #fff; padding: 10px; border-left: 3px solid #0066cc;">
            ${message}
          </p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 8px; border-left: 4px solid #0066cc;">
          <p style="margin: 0; color: #0066cc;">
            <strong>📧 Reply to:</strong> ${email}
          </p>
        </div>
      </div>
    `
    sendEmailNotification("📝 New Contact Form Submission", html).catch(err => console.error("Email error:", err))

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
