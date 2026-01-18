"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { adminFetch, getAdminCode } from "@/lib/admin-helpers"
import { Button } from "@/components/ui/button"
import AdminCodeEntry from "@/components/AdminCodeEntry"
import type { StorageFile } from "@/lib/blob-storage"

export const dynamic = "force-dynamic"

export default function FilesPage() {
  const router = useRouter()
  const [files, setFiles] = useState<StorageFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    const code = getAdminCode()
    if (!code) {
      setIsAuthenticated(false)
      return
    }
    setIsAuthenticated(true)
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      setIsLoading(true)
      const response = await adminFetch("/api/admin/files?category=uploads")

      if (!response.ok) {
        throw new Error("Failed to load files")
      }

      const data = await response.json()
      setFiles(data)
    } catch (error) {
      console.error("[v0] Load files error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (!uploadedFiles || uploadedFiles.length === 0) return

    setIsUploading(true)
    setUploadError(null)

    try {
      for (const file of Array.from(uploadedFiles)) {
        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
          setUploadError(`File ${file.name} is too large (max 100MB)`)
          continue
        }

        const formData = new FormData()
        formData.append("file", file)

        const response = await adminFetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload file")
        }
      }

      // Reload files after upload
      await loadFiles()
      // Reset input
      if (event.target) event.target.value = ""
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setUploadError("Failed to upload file(s). Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (pathname: string) => {
    if (!confirm("Delete this file permanently?")) return

    try {
      const response = await adminFetch("/api/admin/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname }),
      })

      if (!response.ok) throw new Error("Delete failed")

      setFiles(files.filter((f) => f.pathname !== pathname))
    } catch (error) {
      alert("Failed to delete file")
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  if (!isAuthenticated) {
    return <AdminCodeEntry onSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">File Manager</h1>
          <p className="text-muted-foreground">Manage all uploaded files stored in Vercel Blob</p>
        </div>

        {/* Upload Section */}
        <div className="bg-background border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
          <div className="flex flex-col gap-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition cursor-pointer">
              <label htmlFor="file-upload" className="cursor-pointer block">
                <p className="text-sm text-muted-foreground mb-2">Click to select files or drag and drop</p>
                <p className="text-xs text-muted-foreground">Max file size: 100MB</p>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </div>

            {uploadError && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded text-sm">
                {uploadError}
              </div>
            )}

            {isUploading && <p className="text-sm text-accent">Uploading files...</p>}
          </div>
        </div>

        {/* Storage Info */}
        <div className="bg-background border border-border rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Files</p>
              <p className="text-2xl font-bold">{files.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Size</p>
              <p className="text-2xl font-bold">{formatBytes(files.reduce((sum, f) => sum + (f.size || 0), 0))}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
              <p className="text-sm font-medium">
                {files.length > 0
                  ? new Date(Math.max(...files.map((f) => new Date(f.uploadedAt).getTime()))).toLocaleDateString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>

        {/* Files List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="bg-background border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">No files uploaded yet</p>
            <p className="text-xs text-muted-foreground">Upload files above to make them available to all users</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.pathname}
                className="bg-background border border-border rounded-lg p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium overflow-wrap break-word">{file.pathname.split("/").pop()}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                    <span>{formatBytes(file.size || 0)}</span>
                    <span>{new Date(file.uploadedAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-sm"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(file.pathname)}
                    className="text-destructive hover:bg-destructive/10 px-3 py-1 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
