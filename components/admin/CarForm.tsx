"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface CarFormProps {
  carId?: string
}

export const CarForm = ({ carId }: CarFormProps) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    brand: "",
    year: new Date().getFullYear(),
    mileage: "",
    condition: "good" as const,
    images: [] as string[],
    description: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(!!carId)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (carId) {
      fetchCar()
    }
  }, [carId])

  async function fetchCar() {
    try {
      const res = await fetch(`/api/cars/${carId}`)

      if (!res.ok) throw new Error("Car not found")
      const car = await res.json()
      setFormData(car)
    } catch (err) {
      setError("Failed to load car")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload(files: FileList) {
    if (!files) return

    const filesToUpload = Array.from(files)
    setUploading(true)
    setError(null)

    try {
      const uploadedUrls: string[] = []

      for (const file of filesToUpload) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            "x-admin-code": "123456",
          },
          body: formData,
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Upload failed")
        }
        const data = await res.json()
        uploadedUrls.push(data.url)
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }))
    } catch (err) {
      setError("Failed to upload images")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  function removeImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const method = carId ? "PUT" : "POST"
      const url = carId ? `/api/cars/${carId}` : "/api/cars"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-code": "123456",
        },
        body: JSON.stringify({
          ...formData,
          price: Number.parseInt(formData.price),
          mileage: Number.parseInt(formData.mileage),
          year: Number.parseInt(formData.year.toString()),
        }),
      })

      if (!res.ok) throw new Error("Failed to save car")

      setSuccess(true)
      setTimeout(() => {
        router.push("/admin/cars")
      }, 1500)
    } catch (err) {
      setError("Failed to save car")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">{carId ? "Edit Car" : "Add New Car"}</h1>

        {success && (
          <div className="bg-success/10 border border-success text-success p-4 rounded mb-6">
            Saved successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-background border border-border rounded-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded text-sm"
                placeholder="e.g., 2021 Honda Civic"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded text-sm"
                placeholder="e.g., Honda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price ($)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded text-sm"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <input
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mileage</label>
              <input
                type="number"
                required
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded text-sm"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded text-sm"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded text-sm"
              rows={4}
              placeholder="Describe the car..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files!)}
                disabled={uploading}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <p className="text-sm font-medium mb-1">{uploading ? "Uploading..." : "Click to upload images"}</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Car ${idx + 1}`}
                      className="w-full h-24 object-cover rounded border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-accent text-accent-foreground py-2 rounded font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : carId ? "Update Car" : "Add Car"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-muted text-foreground py-2 rounded font-medium hover:opacity-90"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CarForm
