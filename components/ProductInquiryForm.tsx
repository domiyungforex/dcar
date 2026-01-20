"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ProductInquiryFormProps {
  productId: string
  productName?: string
  onSuccess?: () => void
}

export default function ProductInquiryForm({ productId, productName, onSuccess }: ProductInquiryFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      productId,
      message: formData.get("message"),
    }

    try {
      const response = await fetch("/api/submissions/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to submit inquiry")
      }

      setSuccess(true)
      ;(e.target as HTMLFormElement).reset()
      setTimeout(() => {
        setSuccess(false)
        onSuccess?.()
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border border-border">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input name="name" required placeholder="Your name" disabled={isLoading} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input name="email" type="email" required placeholder="your@email.com" disabled={isLoading} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <Input name="phone" type="tel" placeholder="Your phone number" disabled={isLoading} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Message</label>
        <Textarea name="message" required placeholder="Tell us about your inquiry..." rows={5} disabled={isLoading} />
      </div>

      {productName && <p className="text-sm text-muted-foreground">Regarding: {productName}</p>}

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</div>}

      {success && <div className="text-sm text-green-700 bg-green-50 p-3 rounded">Inquiry sent successfully!</div>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </form>
  )
}
