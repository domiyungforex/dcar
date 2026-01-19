"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { adminFetch, getAdminCode } from "@/lib/admin-helpers"
import { Button } from "@/components/ui/button"
import AdminCodeEntry from "@/components/AdminCodeEntry"
import type { Submission } from "@/lib/redis-submissions"

export const dynamic = "force-dynamic"

export default function AdminInquiriesPage() {
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const code = getAdminCode()
    if (!code) {
      setIsAuthenticated(false)
      return
    }
    setIsAuthenticated(true)
    fetchInquiries()
  }, [])

  async function fetchInquiries() {
    try {
      setLoading(true)
      const response = await adminFetch("/api/admin/submissions?type=inquiry")

      if (!response.ok) throw new Error("Failed to fetch inquiries")
      const data = await response.json()
      setInquiries(data)
    } catch (err) {
      setError("Failed to load inquiries")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return

    try {
      const response = await adminFetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) throw new Error("Delete failed")
      setInquiries(inquiries.filter((i) => i.id !== id))
    } catch (error) {
      alert("Failed to delete inquiry")
    }
  }

  if (!isAuthenticated) {
    return <AdminCodeEntry onSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-muted py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            Back to Dashboard
          </Button>
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
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-semibold mb-3">{inquiry.email}</p>
                    <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                    <p className="text-sm">{new Date(inquiry.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(inquiry.id)}
                    className="text-sm text-destructive hover:bg-destructive/10 px-3 py-2 rounded transition"
                  >
                    Delete
                  </button>
                </div>

                <div className="bg-muted/50 rounded p-4 space-y-3 text-sm">
                  {inquiry.data && Object.entries(inquiry.data).map(([key, value]) => (
                    <div key={key}>
                      <p className="font-medium text-foreground capitalize">{key}:</p>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {typeof value === "string" ? value : JSON.stringify(value)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border mt-4">
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
