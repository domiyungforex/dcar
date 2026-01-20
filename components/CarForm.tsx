"use client"

import type React from "react"
import { useState, useRef } from "react"

interface CarFormProps {
  carId?: string
}

export default function CarForm({ carId }: CarFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    brand: "",
    year: "",
    mileage: "",
    fuelType: "Petrol",
    transmission: "Manual",
    condition: "Used",
    description: "",
    status: "Available",
    inspectionNote: "",
  })

  const [inspectionChecklist, setInspectionChecklist] = useState({
    mechanical: {
      engineNoise: false,
      oilLeaks: false,
      coolingSystem: false,
      gearboxResponse: false,
      suspensionSteering: false,
      brakeCondition: false,
    },
    electrical: {
      ecuScan: false,
      sensors: false,
      dashboardWarnings: false,
      acSystem: false,
    },
    structural: {
      chassisAlignment: false,
      accidentSigns: false,
      rustInspection: false,
    },
    documents: {
      vinVerification: false,
      customsPapers: false,
      ownershipHistory: false,
    },
  })

  const [images, setImages] = useState<File[]>([])
  const [video, setVideo] = useState<File | null>(null)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [videoPreviews, setVideoPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleChecklistChange = (category: keyof typeof inspectionChecklist, item: string) => {
    setInspectionChecklist((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category][item as keyof typeof prev[keyof typeof inspectionChecklist]],
      },
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages = Array.from(files)
    const totalImages = [...images, ...newImages].slice(0, 20)
    setImages(totalImages)
    setError(null)

    // Create previews
    const previews: string[] = []
    totalImages.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          previews.push(e.target.result as string)
          if (previews.length === totalImages.length) {
            setImagePreviews(previews)
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newVideos = Array.from(files).filter((file) => file.type.startsWith("video/"))
    if (newVideos.length === 0) {
      setError("Please select valid video files")
      return
    }

    if (videoPreviews.length + newVideos.length > 5) {
      setError("Maximum 5 videos allowed")
      return
    }

    setError(null)

    // Create previews for videos
    const newPreviews: string[] = [...videoPreviews]
    let loadedCount = 0
    newVideos.forEach((videoFile) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string)
          loadedCount++
          if (loadedCount === newVideos.length) {
            setVideoPreviews(newPreviews)
          }
        }
      }
      reader.readAsDataURL(videoFile)
    })
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const removeVideo = (index?: number) => {
    if (index !== undefined) {
      const newPreviews = videoPreviews.filter((_, i) => i !== index)
      setVideoPreviews(newPreviews)
    } else {
      setVideo(null)
      setVideoPreviews([])
      if (videoInputRef.current) videoInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (images.length === 0) {
      setError("Please upload at least one image")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Upload images and video to blob storage
      const imageUrls: string[] = []
      const adminCode = "123456"

      // Upload images
      for (const image of images) {
        const formData = new FormData()
        formData.append("file", image)

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            "x-admin-code": adminCode,
          },
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }

        const data = await response.json()
        imageUrls.push(data.url)
      }

      // Upload video if present
      let videoUrl: string | undefined
      if (video) {
        const formData = new FormData()
        formData.append("file", video)

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            "x-admin-code": adminCode,
          },
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload video")
        }

        const data = await response.json()
        videoUrl = data.url
      }

      // Create car record with image and video URLs
      const carData = {
        ...formData,
        price: Number(formData.price),
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        images: imageUrls,
        video: videoUrl,
        inspectionChecklist,
      }

      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-code": adminCode,
        },
        body: JSON.stringify(carData),
      })

      if (!response.ok) {
        throw new Error("Failed to create car")
      }

      setSuccess(true)
      // Reset form
      setFormData({
        title: "",
        price: "",
        brand: "",
        year: "",
        mileage: "",
        fuelType: "Petrol",
        transmission: "Manual",
        condition: "Used",
        description: "",
        status: "Available",
      })
      setImages([])
      setVideo(null)
      setImagePreviews([])
      setVideoPreviews([])
      if (imageInputRef.current) imageInputRef.current.value = ""
      if (videoInputRef.current) videoInputRef.current.value = ""

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create car")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{carId ? "Edit Car" : "Add New Car"}</h1>

      <form onSubmit={handleSubmit} className="bg-card border border-border p-8 rounded-lg space-y-6">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 text-sm">{error}</div>}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-green-900 text-sm">
            ✓ Car created successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year || ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Mileage (km)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage || ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded bg-background"
            >
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Hybrid</option>
              <option>Electric</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded bg-background"
            >
              <option>Manual</option>
              <option>Automatic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded bg-background"
            >
              <option>New</option>
              <option>Used</option>
              <option>Certified Used</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded bg-background"
            >
              <option>Available</option>
              <option>Sold</option>
              <option>Not Available</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-4 py-2 border border-border rounded bg-background"
          />
        </div>

        {/* Engineer Inspection Checklist */}
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">🔧 Engineer Inspection Checklist</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Mechanical */}
            <div>
              <h4 className="font-semibold mb-3 text-accent">Mechanical</h4>
              <div className="space-y-2">
                {Object.entries({
                  engineNoise: "Engine noise & compression",
                  oilLeaks: "Oil leaks",
                  coolingSystem: "Cooling system",
                  gearboxResponse: "Gearbox response",
                  suspensionSteering: "Suspension & steering",
                  brakeCondition: "Brake condition",
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inspectionChecklist.mechanical[key as keyof typeof inspectionChecklist.mechanical]}
                      onChange={() => handleChecklistChange("mechanical", key)}
                      className="rounded"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Electrical */}
            <div>
              <h4 className="font-semibold mb-3 text-accent">Electrical</h4>
              <div className="space-y-2">
                {Object.entries({
                  ecuScan: "ECU scan",
                  sensors: "Sensors",
                  dashboardWarnings: "Dashboard warnings",
                  acSystem: "AC system",
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inspectionChecklist.electrical[key as keyof typeof inspectionChecklist.electrical]}
                      onChange={() => handleChecklistChange("electrical", key)}
                      className="rounded"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Structural */}
            <div>
              <h4 className="font-semibold mb-3 text-accent">Structural</h4>
              <div className="space-y-2">
                {Object.entries({
                  chassisAlignment: "Chassis alignment",
                  accidentSigns: "Accident signs",
                  rustInspection: "Rust inspection",
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inspectionChecklist.structural[key as keyof typeof inspectionChecklist.structural]}
                      onChange={() => handleChecklistChange("structural", key)}
                      className="rounded"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 className="font-semibold mb-3 text-accent">Documents</h4>
              <div className="space-y-2">
                {Object.entries({
                  vinVerification: "VIN verification",
                  customsPapers: "Customs papers",
                  ownershipHistory: "Ownership history",
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inspectionChecklist.documents[key as keyof typeof inspectionChecklist.documents]}
                      onChange={() => handleChecklistChange("documents", key)}
                      className="rounded"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Inspection Note */}
          <div>
            <label className="block text-sm font-semibold mb-2">Inspector Notes</label>
            <textarea
              name="inspectionNote"
              value={formData.inspectionNote}
              onChange={handleChange}
              placeholder="Add any additional inspection findings or notes..."
              rows={3}
              className="w-full px-4 py-2 border border-border rounded bg-background text-sm"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-semibold mb-3">
            Car Images ({images.length}/20)
          </label>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 hover:bg-blue-100 transition">
              <svg
                className="mx-auto h-12 w-12 text-blue-400 mb-2"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M32 4v12m0 0l-4-4m4 4l4-4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm font-medium text-gray-900">Click to upload or drag images</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 20 images</p>
            </div>
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading || images.length >= 20}
              className="hidden"
            />
          </label>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative group">
                  <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Upload Section */}
        <div>
          <label className="block text-sm font-semibold mb-3">Car Videos ({videoPreviews.length}/5)</label>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50 hover:bg-purple-100 transition">
              <svg
                className="mx-auto h-12 w-12 text-purple-400 mb-2"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M12 8h24a4 4 0 014 4v20a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4z"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M20 16l12 8-12 8v-16z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm font-medium text-gray-900">Click to upload video</p>
              <p className="text-xs text-gray-500">MP4, WebM up to 5 videos</p>
            </div>
            <input
              ref={videoInputRef}
              type="file"
              multiple
              accept="video/*"
              onChange={handleVideoChange}
              disabled={isUploading || videoPreviews.length >= 5}
              className="hidden"
            />
          </label>

          {/* Video Previews */}
          {videoPreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {videoPreviews.map((preview, idx) => (
                <div key={idx} className="relative group">
                  <video src={preview} className="w-full h-40 object-cover rounded" controls />
                  <button
                    type="button"
                    onClick={() => removeVideo(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isUploading}
            className="bg-accent text-accent-foreground px-6 py-2 rounded font-medium hover:opacity-90 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Save Car"}
          </button>
          <a
            href="/admin/cars"
            className="bg-secondary text-secondary-foreground px-6 py-2 rounded font-medium hover:opacity-90"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
