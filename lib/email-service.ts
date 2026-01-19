/**
 * Email notification service using webhook or simple POST to email API
 * For now, we'll store the data and admin can retrieve via API
 */

export async function sendEmailNotification(
  subject: string,
  htmlContent: string,
  recipientEmail?: string
) {
  try {
    // Store notification event
    const event = {
      timestamp: new Date().toISOString(),
      subject,
      htmlContent,
      recipientEmail: recipientEmail || process.env.ADMIN_EMAIL,
    }

    console.log('[Email Event]', event)

    // If WEBHOOK_URL is set, send to external service
    if (process.env.WEBHOOK_URL) {
      await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(err => console.error('Webhook error:', err))
    }

    return true
  } catch (error) {
    console.error('Failed to process email:', error)
    return false
  }
}

export async function sendInquiryNotification(inquiry: any) {
  const html = `
    <h2>New Car Inquiry</h2>
    <p><strong>Name:</strong> ${inquiry.data?.name}</p>
    <p><strong>Email:</strong> ${inquiry.email}</p>
    <p><strong>Phone:</strong> ${inquiry.data?.phone}</p>
    <p><strong>Message:</strong></p>
    <p>${inquiry.data?.message}</p>
  `
  return sendEmailNotification('New Car Inquiry', html)
}

export async function sendNewsletterNotification(email: string) {
  const html = `
    <h2>New Newsletter Subscription</h2>
    <p><strong>Email:</strong> ${email}</p>
  `
  return sendEmailNotification('New Newsletter Subscriber', html)
}

export async function sendFileUploadNotification(submission: any) {
  const html = `
    <h2>New File Upload</h2>
    <p><strong>Email:</strong> ${submission.email}</p>
    <p><strong>File Name:</strong> ${submission.data?.fileName}</p>
    <p><strong>Description:</strong> ${submission.data?.description}</p>
    <p><strong>File URL:</strong> <a href="${submission.data?.fileUrl}">Download</a></p>
  `
  return sendEmailNotification('New File Upload', html)
}


