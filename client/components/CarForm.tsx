"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import apiClient from "@/lib/api"

interface CarFormProps {
  carId?: string
}

export default function CarForm({ carId }: CarFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(!!carId)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
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
  })
  const [images, setImages] = useState<any[]>([])

  useEffect(() => {
    if (carId) {
      fetchCar()
    }
  }, [carId])

  const fetchCar = async () => {
    try {
      const response = await apiClient.get(`/cars/${carId}`)
      const car = response.data.data
      setFormData({
        title: car.title,
        price: car.price,
        brand: car.brand,
        year: car.year,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        condition: car.condition,
        description: car.description,
        status: car.status,
      })
      setImages(car.images)
    } catch (error) {
      console.error("Error fetching car:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    try {
      setUploadingImages(true)

      // If no carId, we need to create the car first
      if (!carId) {
        const createResponse = await apiClient.post("/cars", formData)
        const newCarId = createResponse.data.data._id

        const formDataWithFiles = new FormData()
        for (let i = 0; i < files.length; i++) {
          formDataWithFiles.append("images", files[i])
        }

        const uploadResponse = await apiClient.post(`/images/${newCarId}`, formDataWithFiles, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        setImages(uploadResponse.data.images)
        setFormData((prev) => ({ ...prev }))

        setTimeout(() => {
          router.push("/admin/cars")
        }, 1000)
      } else {
        const formDataWithFiles = new FormData()
        for (let i = 0; i < files.length; i++) {
          formDataWithFiles.append("images", files[i])
        }

        const uploadResponse = await apiClient.post(`/images/${carId}`, formDataWithFiles, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        setImages((prev) => [...prev, ...uploadResponse.data.images])
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      alert("Failed to upload images")
    } finally {
      setUploadingImages(false)
    }
  }

  const deleteImage = async (publicId: string) => {
    try {
      await apiClient.delete(`/images/${carId}`, { data: { publicId } })
      setImages(images.filter((img) => img.publicId !== publicId))
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Failed to delete image")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSubmitting(true)

      if (carId) {
        await apiClient.put(`/cars/${carId}`, formData)
      } else {
        const response = await apiClient.post("/cars", formData)
        router.push(`/admin/cars/${response.data.data._id}`)
        return
      }

      router.push("/admin/cars")
    } catch (error: any) {
      console.error("Error saving car:", error)
      alert(error.response?.data?.message || "Failed to save car")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="section-title mb-8">{carId ? "Edit Car" : "Add New Car"}</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Mileage (km)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
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
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
          />
        </div>

        {carId && (
          <div>
            <label className="block text-sm font-semibold mb-4">Images</label>
            {images.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Current Images:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`Car image ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => deleteImage(image.publicId)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImages}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            {uploadingImages && <p className="text-sm text-gray-600 mt-2">Uploading images...</p>}
          </div>
        )}

        <div className="flex gap-4">
          <button type="submit" disabled={submitting || uploadingImages} className="btn-primary disabled:opacity-50">
            {submitting ? "Saving..." : "Save Car"}
          </button>
          <a href="/admin/cars" className="btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
