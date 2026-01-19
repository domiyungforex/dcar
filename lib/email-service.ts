/**
 * Email notification service using Resend for production
 * Falls back to console logging for development
 */

const ADMIN_EMAIL = 'dmonhaloo.gmail.com'

export async function sendEmailNotification(
  subject: string,
  htmlContent: string,
  recipientEmail?: string
) {
  const recipient = recipientEmail || ADMIN_EMAIL
  
  try {
    // Use Resend API if available
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'notifications@dcars.vercel.app',
          to: recipient,
          subject,
          html: htmlContent,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('[Email Error]', error)
        return false
      }

      console.log('[Email Sent]', { subject, recipient })
      return true
    }

    // Fallback: Try webhook if configured
    if (process.env.WEBHOOK_URL) {
      const event = {
        timestamp: new Date().toISOString(),
        subject,
        htmlContent,
        recipientEmail: recipient,
      }

      await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(err => console.error('[Webhook Error]', err))

      console.log('[Email via Webhook]', { subject, recipient })
      return true
    }

    // Last resort: Log to console
    console.log('[Email Event - Console Only]', {
      timestamp: new Date().toISOString(),
      subject,
      recipient,
      htmlContent,
    })

    return true
  } catch (error) {
    console.error('[Email Service Error]', error)
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

export async function sendServiceInquiryNotification(serviceInquiry: any) {
  const html = `
    <h2>New Service Inquiry - ${serviceInquiry.serviceName}</h2>
    <p><strong>Name:</strong> ${serviceInquiry.data?.name}</p>
    <p><strong>Email:</strong> ${serviceInquiry.email}</p>
    <p><strong>Phone:</strong> ${serviceInquiry.data?.phone}</p>
    <p><strong>Service Type:</strong> ${serviceInquiry.serviceName}</p>
    <p><strong>Vehicle Info:</strong> ${serviceInquiry.data?.vehicleInfo}</p>
    <p><strong>Preferred Date:</strong> ${serviceInquiry.data?.preferredDate || 'Not specified'}</p>
    <p><strong>Description:</strong></p>
    <p>${serviceInquiry.data?.description}</p>
  `
  return sendEmailNotification(`New Service Inquiry: ${serviceInquiry.serviceName}`, html, 'dmonhaloo.gmail.com')
}

