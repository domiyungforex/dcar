"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NewsletterFormProps {
  onSuccess?: () => void
  variant?: "inline" | "full"
}

export default function NewsletterForm({ onSuccess, variant = "full" }: NewsletterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")

    try {
      const response = await fetch("/api/submissions/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to subscribe")
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

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "..." : "Subscribe"}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border border-border">
      <div>
        <label className="block text-sm font-medium mb-2">Email Address</label>
        <Input
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          disabled={isLoading}
          className="w-full"
        />
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</div>}

      {success && <div className="text-sm text-green-700 bg-green-50 p-3 rounded">Subscribed successfully!</div>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Subscribing..." : "Subscribe to Newsletter"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">We respect your privacy. Unsubscribe at any time.</p>
    </form>
  )
}
