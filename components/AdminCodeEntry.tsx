"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { storeAdminCode } from "@/lib/admin-helpers"

interface AdminCodeEntryProps {
  onSuccess: () => void
}

export default function AdminCodeEntry({ onSuccess }: AdminCodeEntryProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (!data.valid) {
        setError("Invalid access code")
        return
      }

      storeAdminCode(code)
      onSuccess()
    } catch (err) {
      setError("Failed to verify code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground mb-6">Enter your access code to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Access Code</label>
              <Input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</div>}

            <Button type="submit" disabled={isLoading || !code} className="w-full">
              {isLoading ? "Verifying..." : "Access Admin Panel"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            This access is stored in your browser session and will be cleared when you close the browser.
          </p>
        </div>
      </div>
    </div>
  )
}
