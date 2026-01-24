"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import type { Car } from "@/lib/types"
import { InquiryForm } from "@/components/InquiryForm"
import InspectionSummary from "@/components/InspectionSummary"

export default function CarDetailPage() {
  const params = useParams()
  const carId = params.id as string
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<"gallery" | "specs" | "features" | "inspection">("gallery")

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
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header with Title and Condition */}
            <div className="bg-background border border-border rounded-lg p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">{car.title}</h1>
                  <p className="text-muted-foreground">{car.brand} • {car.year}</p>
                </div>
                <div className={`px-4 py-2 rounded text-sm font-bold text-white whitespace-nowrap ${
                  car.condition === 'excellent' ? 'bg-green-600' :
                  car.condition === 'good' ? 'bg-blue-600' :
                  'bg-orange-600'
                }`}>
                  {car.condition === 'excellent' ? '✓ EXCELLENT' :
                   car.condition === 'good' ? '✓ GOOD' :
                   '⚠ FAIR'}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Year</p>
                  <p className="font-semibold text-sm sm:text-base">{car.year}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Mileage</p>
                  <p className="font-semibold text-sm sm:text-base">{car.mileage.toLocaleString()} mi</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Brand</p>
                  <p className="font-semibold text-sm sm:text-base">{car.brand}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Price</p>
                  <p className="font-semibold text-sm sm:text-base text-accent">₦{car.price.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: "gallery", label: "📸 Gallery" },
                { id: "specs", label: "⚙️ Specs" },
                { id: "features", label: "✨ Features" },
                { id: "inspection", label: "🔍 Inspection" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition font-medium text-sm ${
                    activeTab === tab.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-background border border-border text-foreground hover:border-accent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Gallery Tab */}
            {activeTab === "gallery" && (
              <div className="space-y-4">
                {/* Main Image */}
                {car.images.length > 0 ? (
                  <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <Image
                      src={car.images[selectedImage] || "/placeholder.svg"}
                      alt={`${car.title} - image ${selectedImage + 1}`}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">No images available</span>
                  </div>
                )}

                {/* Thumbnails */}
                {car.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {car.images.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-20 h-20 rounded shrink-0 border-2 overflow-hidden transition ${
                          idx === selectedImage ? "border-accent ring-2 ring-accent/50" : "border-border hover:border-accent"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white opacity-0 hover:opacity-100 bg-black/40 transition">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Video Section */}
                {car.video && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">🎬 Video Tour</h3>
                    <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                      <video
                        src={car.video}
                        controls
                        className="w-full h-full"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                )}

                {/* Image Counter */}
                {car.images.length > 0 && (
                  <div className="text-center text-sm text-muted-foreground">
                    Image {selectedImage + 1} of {car.images.length}
                  </div>
                )}
              </div>
            )}

            {/* Specs Tab */}
            {activeTab === "specs" && (
              <div className="bg-background border border-border rounded-lg p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Year</p>
                    <p className="font-bold text-lg">{car.year}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Brand</p>
                    <p className="font-bold text-lg">{car.brand}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Condition</p>
                    <p className="font-bold text-lg capitalize">{car.condition}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Mileage</p>
                    <p className="font-bold text-lg">{car.mileage.toLocaleString()} mi</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                    <p className="font-bold text-lg text-accent">₦{car.price.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className="font-bold text-lg capitalize">{car.status || "Available"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === "features" && (
              <div className="bg-background border border-border rounded-lg p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap mb-6">
                  {car.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">✓ Advantages</h3>
                    <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                      <li>• {car.condition === 'excellent' ? 'Excellent condition' : 'Good condition'}</li>
                      <li>• Well maintained</li>
                      <li>• Professional inspection done</li>
                      <li>• Ready for immediate use</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">ℹ️ More Info</h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• {car.mileage.toLocaleString()} miles on odometer</li>
                      <li>• {new Date(car.createdAt).getFullYear()} model</li>
                      <li>• All documents verified</li>
                      <li>• Trade-in available</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Inspection Tab */}
            {activeTab === "inspection" && (
              <div className="bg-background border border-border rounded-lg p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">🔍 Professional Inspection Report</h2>
                <InspectionSummary car={car} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Price Card */}
            <div className="bg-linear-to-br from-accent to-accent/80 text-accent-foreground rounded-lg p-4 sm:p-6 mb-6 sticky top-20">
              <p className="text-xs sm:text-sm mb-2 opacity-90">Asking Price</p>
              <p className="text-4xl sm:text-5xl font-bold mb-2">₦{car.price.toLocaleString()}</p>
              <p className="text-xs sm:text-sm opacity-75 mb-4">Ready to negotiate</p>
            </div>

            {/* Quick Stats */}
            <div className="bg-background border border-border rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                📊 Quick Facts
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Condition:</span>
                  <span className="font-semibold capitalize">{car.condition}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Mileage:</span>
                  <span className="font-semibold">{car.mileage.toLocaleString()} mi</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Listed:</span>
                  <span className="font-semibold">{new Date(car.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Images:</span>
                  <span className="font-semibold">{car.images.length}</span>
                </div>
                {car.video && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Video:</span>
                    <span className="font-semibold text-green-600">✓ Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inquiry Form */}
            <InquiryForm carId={car.id} carTitle={car.title} />

            {/* Trust Indicators */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                ✓ Why Choose Us
              </h3>
              <ul className="text-xs sm:text-sm text-green-800 dark:text-green-200 space-y-2">
                <li>🔍 Professional inspection</li>
                <li>📸 Full image gallery & video</li>
                <li>🛡️ 100% verified documents</li>
                <li>💼 Trade-in available</li>
                <li>📞 Direct seller contact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
