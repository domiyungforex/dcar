"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import type { Car } from "@/lib/types"
import { InquiryForm } from "@/components/InquiryForm"

export default function CarDetailPage() {
  const params = useParams()
  const carId = params.id as string
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchCar()
  }, [carId])

  async function fetchCar() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/cars/${carId}`)
      if (!res.ok) {
        if (res.status === 404) throw new Error("Car not found")
        throw new Error("Failed to fetch car")
      }
      const data = await res.json()
      setCar(data)
    } catch (err) {
      setError("Failed to load car details.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading car details...</p>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-muted py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-destructive/10 border border-destructive text-destructive p-6 rounded text-center">
            {error || "Car not found"}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Images */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              {car.images.length > 0 ? (
                <div
                  className="relative w-full bg-muted rounded-lg overflow-hidden mb-4"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src={car.images[selectedImage] || "/placeholder.svg"}
                    alt={`${car.title} - image ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}

              {car.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {car.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded flex-shrink-0 border-2 overflow-hidden transition ${
                        idx === selectedImage ? "border-accent" : "border-border hover:border-primary"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Video Section */}
            {car.video && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Video Tour</h2>
                <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <video
                    src={car.video}
                    controls
                    className="w-full h-full"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}

            {/* Details */}
            <div className="bg-background border border-border rounded-lg p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">{car.title}</h1>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Year</p>
                  <p className="font-semibold text-sm sm:text-base">{car.year}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Mileage</p>
                  <p className="font-semibold text-sm sm:text-base">{car.mileage.toLocaleString()} mi</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Condition</p>
                  <p className="font-semibold text-sm sm:text-base capitalize">{car.condition}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Brand</p>
                  <p className="font-semibold text-sm sm:text-base">{car.brand}</p>
                </div>
              </div>

              <div>
                <h2 className="font-semibold text-base sm:text-lg mb-3">Description</h2>
                <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap">
                  {car.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Price Card */}
            <div className="bg-background border border-border rounded-lg p-4 sm:p-6 mb-6 sticky top-20">
              <p className="text-muted-foreground text-xs sm:text-sm mb-2">Asking Price</p>
              <p className="text-3xl sm:text-4xl font-bold text-accent mb-6">${car.price.toLocaleString()}</p>
            </div>

            {/* Inquiry Form */}
            <InquiryForm carId={car.id} carTitle={car.title} />
          </div>
        </div>
      </div>
    </div>
  )
}
