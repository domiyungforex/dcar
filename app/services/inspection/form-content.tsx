"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function BookingFormContent() {
  const searchParams = useSearchParams()
  const tierParam = searchParams.get("tier") || "full-diagnostic"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleInfo: "",
    inspectionTier: tierParam,
    preferredDate: "",
    preferredTime: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch("/api/services/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to submit booking")

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicleInfo: "",
        inspectionTier: tierParam,
        preferredDate: "",
        preferredTime: "",
        message: "",
      })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit booking. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const serviceDetails: Record<string, { price: string; desc: string }> = {
    "basic-inspection": {
      price: "₦25,000",
      desc: "Visual inspection of major components + basic diagnostics",
    },
    "full-diagnostic": {
      price: "₦45,000",
      desc: "Complete engine, transmission, and system diagnostics",
    },
    "purchase-advisory": {
      price: "₦65,000",
      desc: "Full diagnostic + market analysis + negotiation guidance",
    },
  }

  const selected = serviceDetails[tierParam] || serviceDetails["full-diagnostic"]

  return (
    <div className="min-h-screen bg-primary py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/services/inspection" className="text-accent hover:text-accent-secondary flex items-center gap-2">
            ← Back to Inspection Service
          </Link>
        </div>

        <div className="bg-background border border-border rounded-lg p-8 neon-border">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Book Inspection</h1>
          <p className="text-foreground/60 mb-6">Fill out the form below to schedule your inspection</p>

          {/* Service Summary */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold mb-1">{selected.desc.split("+")[0].trim()}</h3>
                <p className="text-foreground/70 text-sm">{selected.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-accent">{selected.price}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-600/10 border border-green-600 text-green-600 rounded-lg text-sm">
                ✓ Booking submitted successfully! We'll contact you within 24 hours.
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name *</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                disabled={loading}
              />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Phone *</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 (123) 456-7890"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Vehicle Info */}
            <div>
              <label className="block text-sm font-semibold mb-2">Vehicle Info</label>
              <Input
                type="text"
                name="vehicleInfo"
                value={formData.vehicleInfo}
                onChange={handleChange}
                placeholder="e.g. 2020 Toyota Camry, Silver"
                disabled={loading}
              />
            </div>

            {/* Preferred Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Preferred Date *</label>
                <Input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Preferred Time *</label>
                <Input
                  type="time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold mb-2">Additional Notes</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any specific concerns or questions about the inspection?"
                rows={4}
                disabled={loading}
                className="w-full px-3 py-2 border border-border rounded text-sm bg-background"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-accent hover:bg-accent/90 text-primary font-bold py-3"
              >
                {loading ? "Submitting..." : "Confirm Booking"}
              </Button>
              <Link href="/services/inspection" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>

          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="font-semibold mb-3">Need Help?</h3>
            <p className="text-foreground/70 text-sm mb-4">
              Contact us directly for immediate assistance:
            </p>
            <div className="space-y-2">
              <a
                href="https://wa.me/2348144106774?text=I%20need%20help%20with%20booking%20an%20inspection"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-accent hover:text-accent-secondary"
              >
                💬 WhatsApp: +234 814 410 6774
              </a>
              <a href="tel:+2348144106774" className="flex items-center gap-2 text-accent hover:text-accent-secondary">
                📞 Call: +234 814 410 6774
              </a>
              <a href="mailto:dcar@gmail.com" className="flex items-center gap-2 text-accent hover:text-accent-secondary">
                📧 Email: dcar@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
