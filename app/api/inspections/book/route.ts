import { NextRequest, NextResponse } from "next/server"
import { saveSubmission } from "@/lib/redis-submissions"
import { sendBookingNotification } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, vehicleInfo, preferredDate, preferredTime, notes, serviceType } = body

    // Validate required fields
    if (!name || !email || !phone || !preferredDate || !preferredTime || !serviceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save to Redis
    const submission = await saveSubmission("inspection-booking", email, {
      name,
      phone,
      vehicleInfo,
      preferredDate,
      preferredTime,
      notes,
      serviceType,
    })

    // Send email notification
    await sendBookingNotification(
      {
        name,
        email,
        phone,
        vehicleInfo,
        preferredDate,
        preferredTime,
        notes,
        serviceType,
      },
      email
    )

    return NextResponse.json(
      { success: true, id: submission.id, message: "Booking submitted successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("[Booking API Error]", error)
    return NextResponse.json({ error: "Failed to process booking" }, { status: 500 })
  }
}
