"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { adminFetch, getAdminCode } from "@/lib/admin-helpers"

export const dynamic = "force-dynamic"
import { Button } from "@/components/ui/button"
import AdminCodeEntry from "@/components/AdminCodeEntry"
import type { Submission } from "@/lib/data-storage"

export default function SubmissionsPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "inquiry" | "newsletter" | "file-upload">("all")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const code = getAdminCode()
    if (!code) {
      setIsAuthenticated(false)
      return
    }
    setIsAuthenticated(true)
    loadSubmissions()
  }, [filter])

  const loadSubmissions = async () => {
    try {
      setIsLoading(true)
      const type = filter === "all" ? "" : filter
      const url = `/api/admin/submissions${type ? `?type=${type}` : ""}`
      const response = await adminFetch(url)

      if (!response.ok) {
        throw new Error("Failed to load submissions")
      }

      const data = await response.json()
      setSubmissions(data)
    } catch (error) {
      console.error("[v0] Load submissions error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission?")) return

    try {
      const response = await adminFetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) throw new Error("Delete failed")

      setSubmissions(submissions.filter((s) => s.id !== id))
    } catch (error) {
      alert("Failed to delete submission")
    }
  }

  const handleStatusChange = async (id: string, status: "new" | "read" | "resolved") => {
    try {
      const response = await adminFetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) throw new Error("Update failed")

      setSubmissions(submissions.map((s) => (s.id === id ? { ...s, status } : s)))
    } catch (error) {
      alert("Failed to update submission")
    }
  }

  if (!isAuthenticated) {
    return <AdminCodeEntry onSuccess={() => setIsAuthenticated(true)} />
  }

  const filteredCount = submissions.length
  const inquiries = submissions.filter((s) => s.type === "inquiry").length
  const newsletters = submissions.filter((s) => s.type === "newsletter").length
  const uploads = submissions.filter((s) => s.type === "file-upload").length

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">Form Submissions</h1>
          <p className="text-muted-foreground">View and manage all customer submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-background border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Total</p>
            <p className="text-2xl font-bold">{submissions.length}</p>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Inquiries</p>
            <p className="text-2xl font-bold">{inquiries}</p>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Newsletter</p>
            <p className="text-2xl font-bold">{newsletters}</p>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">File Uploads</p>
            <p className="text-2xl font-bold">{uploads}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "inquiry", "newsletter", "file-upload"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f
                  ? "bg-accent text-accent-foreground"
                  : "bg-background border border-border text-foreground hover:bg-muted"
              }`}
            >
              {f === "all" ? "All" : f === "inquiry" ? "Inquiries" : f === "newsletter" ? "Newsletter" : "Uploads"}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-background border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No submissions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-background border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded bg-muted">
                        {submission.type === "inquiry"
                          ? "Inquiry"
                          : submission.type === "newsletter"
                            ? "Newsletter"
                            : "File Upload"}
                      </span>
                      <select
                        value={submission.status}
                        onChange={(e) => handleStatusChange(submission.id, e.target.value as any)}
                        className="text-xs px-2 py-1 rounded border border-border bg-background"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                    <p className="font-medium">{submission.email}</p>
                    <p className="text-sm text-muted-foreground">{new Date(submission.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="text-sm text-destructive hover:bg-destructive/10 px-3 py-2 rounded transition"
                  >
                    Delete
                  </button>
                </div>

                {/* Submission Details */}
                <div className="bg-muted/50 rounded p-4 text-sm space-y-2">
                  {Object.entries(submission.data).map(([key, value]) => (
                    <div key={key}>
                      <p className="font-medium text-foreground capitalize">{key}:</p>
                      <p className="text-muted-foreground overflow-wrap break-word">
                        {typeof value === "string" ? value : JSON.stringify(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
