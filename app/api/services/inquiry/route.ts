import { saveSubmission } from '@/lib/redis-submissions'
import { sendServiceInquiryNotification } from '@/lib/email-service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { serviceType, serviceName, name, email, phone, vehicleInfo, description, preferredDate } = body

    if (!name || !email || !phone || !description || !serviceType) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save service inquiry to Redis
    const submission = await saveSubmission('service-inquiry', email, {
      serviceType,
      serviceName,
      name,
      phone,
      vehicleInfo,
      description,
      preferredDate,
    })

    // Send email notification
    await sendServiceInquiryNotification({
      serviceType,
      serviceName,
      email,
      data: {
        name,
        phone,
        vehicleInfo,
        description,
        preferredDate,
      },
    })

    return Response.json({ success: true, id: submission.id })
  } catch (error) {
    console.error('Service inquiry error:', error)
    return Response.json(
      { error: 'Failed to submit service inquiry' },
      { status: 500 }
    )
  }
}
