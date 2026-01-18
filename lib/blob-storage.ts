import { put, del, list, head } from "@vercel/blob"

/**
 * Storage utilities for Vercel Blob
 * Handles all file operations: upload, delete, list, and metadata retrieval
 */

export interface StorageFile {
  url: string
  pathname: string
  size?: number
  uploadedAt: string
}

export interface DataFile extends StorageFile {
  content: unknown
}

/**
 * Upload a file to Vercel Blob
 */
export async function uploadFile(
  file: File | Blob,
  path: string,
  metadata?: Record<string, string>,
): Promise<StorageFile> {
  try {
    const blob = await put(path, file, {
      access: "public",
    })

    return {
      url: blob.url,
      pathname: blob.pathname,
      size: (file as any).size || 0,
      uploadedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("[v0] File upload error:", error)
    throw new Error("Failed to upload file")
  }
}

/**
 * Delete a file from Vercel Blob
 */
export async function deleteFile(pathname: string): Promise<boolean> {
  try {
    await del(pathname)
    return true
  } catch (error) {
    console.error("[v0] File deletion error:", error)
    throw new Error("Failed to delete file")
  }
}

/**
 * List all files in a directory
 */
export async function listFiles(prefix: string): Promise<StorageFile[]> {
  try {
    const { blobs } = await list({ prefix })
    return blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt?.toISOString() || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("[v0] List files error:", error)
    throw new Error("Failed to list files")
  }
}

/**
 * Get file metadata without downloading
 */
export async function getFileMetadata(pathname: string): Promise<StorageFile | null> {
  try {
    const blob = await head(pathname)
    return {
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt?.toISOString() || new Date().toISOString(),
    }
  } catch (error) {
    console.error("[v0] Get metadata error:", error)
    return null
  }
}

/**
 * Upload JSON data as a file
 */
export async function uploadJSON(data: Record<string, unknown>, path: string): Promise<StorageFile> {
  const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  })
  return uploadFile(jsonBlob, path, { "Content-Type": "application/json" })
}

/**
 * Fetch and parse JSON from Blob storage
 */
export async function fetchJSON(url: string): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch JSON")
    return response.json()
  } catch (error) {
    console.error("[v0] Fetch JSON error:", error)
    throw new Error("Failed to fetch data from storage")
  }
}
