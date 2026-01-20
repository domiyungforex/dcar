import { saveSubmission } from "@/lib/redis-submissions"
import { sendBookingNotification } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, vehicleInfo, inspectionTier, preferredDate, preferredTime, message } = body

    if (!name || !email || !phone || !vehicleInfo || !inspectionTier || !preferredDate || !preferredTime) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save to database
    const booking = await saveSubmission("inspection-booking", email, {
      name,
      phone,
      vehicleInfo,
      inspectionTier,
      preferredDate,
      preferredTime,
      message,
    })

    // Send notification email
    await sendBookingNotification(
      {
        name,
        email,
        phone,
        vehicleInfo,
        inspectionTier,
        preferredDate,
        preferredTime,
        message,
      },
      email
    )

    return Response.json({ success: true, id: booking.id })
  } catch (error) {
    console.error("Booking error:", error)
    return Response.json({ error: "Failed to process booking" }, { status: 500 })
  }
}
