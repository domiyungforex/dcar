"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FileUploadFormProps {
  productId?: string
  onSuccess?: (fileUrl: string) => void
}

export default function FileUploadForm({ productId, onSuccess }: FileUploadFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError("File must be smaller than 50MB")
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedFile) {
      setError("Please select a file")
      return
    }

    setIsLoading(true)
    setError(null)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("email", (e.currentTarget.email as HTMLInputElement).value)
    formData.append("description", (e.currentTarget.description as HTMLTextAreaElement).value)
    if (productId) formData.append("productId", productId)

    try {
      const response = await fetch("/api/submissions/file-upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()
      setSuccess(true)
      setSelectedFile(null)
      ;(e.target as HTMLFormElement).reset()

      setTimeout(() => {
        setSuccess(false)
        onSuccess?.(data.fileUrl)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border border-border">
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input name="email" type="email" required placeholder="your@email.com" disabled={isLoading} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">File Upload</label>
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
          />
          {selectedFile ? (
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)}MB</p>
            </div>
          ) : (
            <div>
              <p className="font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">PDF, Word, Excel, Images or ZIP (max 50MB)</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description (Optional)</label>
        <Textarea name="description" placeholder="Describe your file..." rows={3} disabled={isLoading} />
      </div>

      {uploadProgress > 0 && (
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</div>}

      {success && <div className="text-sm text-green-700 bg-green-50 p-3 rounded">File uploaded successfully!</div>}

      <Button type="submit" disabled={isLoading || !selectedFile} className="w-full">
        {isLoading ? "Uploading..." : "Upload File"}
      </Button>
    </form>
  )
}

export const FileUploadFormComponent = FileUploadForm
