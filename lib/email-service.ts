/**
 * Email notification service using Resend SDK
 * Sends real emails via Resend API
 */

import { Resend } from 'resend'

const ADMIN_EMAIL = 'domiyungforex@gmail.com'

// Initialize Resend client only in production/with API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendEmailNotification(
  subject: string,
  htmlContent: string,
  recipientEmail?: string,
  senderEmail?: string
) {
  const recipient = recipientEmail || ADMIN_EMAIL
  
  try {
    // Use Resend SDK if available
    if (resend && process.env.RESEND_API_KEY) {
      const emailOptions: any = {
        from: 'noreply@resend.dev',
        to: recipient,
        subject,
        html: htmlContent,
      }

      // Add reply-to if sender email provided (customer's email)
      if (senderEmail) {
        emailOptions.replyTo = senderEmail
      }

      const { data, error } = await resend.emails.send(emailOptions)

      if (error) {
        console.error('[Resend Error]', error)
        return false
      }

      console.log('[Email Sent via Resend]', { subject, recipient, messageId: data?.id })
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
    console.log('[Email - Console Only]', {
      timestamp: new Date().toISOString(),
      subject,
      recipient,
      preview: htmlContent.substring(0, 100),
    })

    return true
  } catch (error) {
    console.error('[Email Service Error]', error)
    return false
  }
}

export async function sendInquiryNotification(inquiry: any) {
  const carInfo = inquiry.carTitle ? `
    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 10px 0; color: #333;">🚗 Car Details</h3>
      <p style="margin: 5px 0;"><strong>Car:</strong> ${inquiry.carTitle}</p>
      <p style="margin: 5px 0;"><strong>Car ID:</strong> ${inquiry.carId}</p>
    </div>
  ` : ''

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">New Car Inquiry</h2>
      
      ${carInfo}

      <div style="background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
        <h3 style="margin: 0 0 15px 0; color: #333;">👤 Customer Information</h3>
        <p style="margin: 8px 0;"><strong>Name:</strong> ${inquiry.name || inquiry.data?.name}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
        <p style="margin: 8px 0;"><strong>Phone:</strong> ${inquiry.phone || inquiry.data?.phone}</p>
      </div>

      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 15px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">💬 Message</h3>
        <p style="margin: 0; white-space: pre-wrap; background: #fff; padding: 10px; border-left: 3px solid #0066cc;">
          ${inquiry.message || inquiry.data?.message}
        </p>
      </div>

      <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 8px; border-left: 4px solid #0066cc;">
        <p style="margin: 0; color: #0066cc;">
          <strong>📧 Reply to:</strong> ${inquiry.email}
        </p>
      </div>
    </div>
  `
  return sendEmailNotification('🚗 New Car Inquiry', html, undefined, inquiry.email)
}

export async function sendNewsletterNotification(email: string) {
  const html = `
    <h2>New Newsletter Subscription</h2>
    <p><strong>Email:</strong> ${email}</p>
  `
  return sendEmailNotification('New Newsletter Subscriber', html, undefined, email)
}

export async function sendFileUploadNotification(submission: any) {
  const html = `
    <h2>New File Upload</h2>
    <p><strong>Email:</strong> ${submission.email}</p>
    <p><strong>File Name:</strong> ${submission.data?.fileName}</p>
    <p><strong>Description:</strong> ${submission.data?.description}</p>
    <p><strong>File URL:</strong> <a href="${submission.data?.fileUrl}">Download</a></p>
  `
  return sendEmailNotification('New File Upload', html, undefined, submission.email)
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
  return sendEmailNotification(`New Service Inquiry: ${serviceInquiry.serviceName}`, html, undefined, serviceInquiry.email)
}

export async function sendBookingNotification(booking: any, senderEmail?: string) {
  const html = `
    <h2>🔧 New Inspection Booking</h2>
    <p><strong>Service Type:</strong> ${booking.serviceType}</p>
    <hr/>
    <h3>Customer Information</h3>
    <p><strong>Name:</strong> ${booking.name}</p>
    <p><strong>Email:</strong> ${booking.email}</p>
    <p><strong>Phone:</strong> ${booking.phone}</p>
    <hr/>
    <h3>Booking Details</h3>
    <p><strong>Vehicle:</strong> ${booking.vehicleInfo || 'Not provided'}</p>
    <p><strong>Preferred Date:</strong> ${booking.preferredDate}</p>
    <p><strong>Preferred Time:</strong> ${booking.preferredTime}</p>
    ${booking.notes ? `<p><strong>Additional Notes:</strong></p><p>${booking.notes}</p>` : ''}
    <hr/>
    <p><em>Please contact the customer to confirm the booking.</em></p>
  `
  return sendEmailNotification(`New Inspection Booking: ${booking.serviceType}`, html, undefined, senderEmail || booking.email)
}

