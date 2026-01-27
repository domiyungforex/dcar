"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to send message")

      setSuccess(true)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError("Failed to send message. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 sm:py-24 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-3 glow-text">GET IN TOUCH</h2>
          <div className="w-12 h-1 bg-accent rounded-full mx-auto"></div>
          <p className="text-foreground/60 mt-4 text-lg">We'd love to hear from you</p>
          <div className="mt-6 text-sm text-foreground/70 space-y-1">
            <p><strong>Email:</strong> dcar@gmail.com</p>
            <p><strong>Phone:</strong> 08144106774, 08083312366</p>
            <p><strong>Lagos Office:</strong> Plot 15, Marina Business District, Lagos Island</p>
            <p><strong>Ogun Office:</strong> Ibogun Industrial Estate, Ogun State</p>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-8 neon-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Message subject"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Your message..."
                rows={5}
                disabled={loading}
                className="w-full px-3 py-2 border border-border rounded text-sm bg-background"
              />
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</div>}
            {success && <div className="text-sm text-success bg-success/10 p-3 rounded">Message sent successfully!</div>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-foreground/70">dcar@gmail.com</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="font-bold mb-2">Phone</h3>
            <p className="text-foreground/70">08144106774</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-bold mb-2">Locations</h3>
            <p className="text-foreground/70 text-sm">
              Lagos: Marina Business District
              <br />
              Ogun: Ibogun Industrial Estate
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
