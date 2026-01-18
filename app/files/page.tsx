"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { StorageFile } from "@/lib/blob-storage"

export default function FilesPage() {
  const [files, setFiles] = useState<StorageFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/files?category=uploads&limit=100")

      if (!response.ok) {
        throw new Error("Failed to load files")
      }

      const data = await response.json()
      setFiles(data.files)
    } catch (err) {
      console.error("[v0] Load files error:", err)
      setError("Failed to load files. Please try again later.")
      setFiles([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFiles = files.filter(
    (file) =>
      file.pathname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.url.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-primary py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4 bg-transparent">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 glow-text">Shared Files</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Download documents, images, and resources uploaded by our administrators
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search files by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Loading files...</p>
          </div>
        ) : error ? (
          <div className="bg-card border border-destructive rounded-lg p-12 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadFiles} variant="outline">
              Try Again
            </Button>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">
              {files.length === 0 ? "No files available yet" : "No files match your search"}
            </p>
            {files.length > 0 && (
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((file) => (
              <div
                key={file.pathname}
                className="bg-card border border-border rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium overflow-wrap break-word text-sm sm:text-base">{file.pathname.split("/").pop()}</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-muted-foreground mt-2">
                    <span>{formatBytes(file.size || 0)}</span>
                    <span>{new Date(file.uploadedAt).toLocaleString()}</span>
                  </div>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-primary rounded font-medium transition text-sm whitespace-nowrap"
                >
                  Download
                  <span>↓</span>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        {!isLoading && files.length > 0 && (
          <div className="mt-8 bg-card border border-border rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredFiles.length} of {files.length} files
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
