"use client"

import { useState, useEffect } from "react"
import type { Inquiry } from "@/lib/types"

export const dynamic = "force-dynamic"

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  async function fetchInquiries() {
    try {
      setLoading(true)
      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/inquiries", {
        headers: { "x-admin-token": token || "" },
      })

      if (!res.ok) throw new Error("Failed to fetch inquiries")
      const data = await res.json()
      setInquiries(data)
    } catch (err) {
      setError("Failed to load inquiries")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Customer Inquiries</h1>
          <p className="text-muted-foreground">
            {inquiries.length} inquiry{inquiries.length !== 1 ? "ies" : ""}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading inquiries...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded">{error}</div>
        ) : inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-background border border-border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{inquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{inquiry.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">{inquiry.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Message</p>
                  <p className="text-foreground whitespace-pre-wrap">{inquiry.message}</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <a
                    href={`mailto:${inquiry.email}?subject=Re: Your inquiry`}
                    className="text-accent hover:underline text-sm font-medium"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-background border border-border rounded">
            <p className="text-muted-foreground">No inquiries yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
