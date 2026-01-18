"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import apiClient from "@/lib/api"
import Image from "next/image"
import InquiryForm from "@/components/InquiryForm"

export default function CarDetailPage() {
  const params = useParams()
  const [car, setCar] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchCar()
  }, [params.id])

  const fetchCar = async () => {
    try {
      const response = await apiClient.get(`/cars/${params.id}`)
      setCar(response.data.data)
    } catch (error) {
      console.error("Error fetching car:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="container-max py-12 text-center">
        <p className="text-xl text-gray-600">Car not found</p>
      </div>
    )
  }

  return (
    <main className="container-max py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Image Gallery */}
        <div>
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
            {car.images.length > 0 && (
              <Image
                src={car.images[selectedImage].url || "/placeholder.svg"}
                alt={car.title}
                fill
                className="object-cover"
              />
            )}
          </div>

          {car.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {car.images.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 rounded overflow-hidden border-2 transition ${
                    selectedImage === index ? "border-red-600" : "border-gray-300"
                  }`}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={`${car.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Car Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{car.title}</h1>
          <p className="text-gray-600 text-xl mb-6">
            {car.brand} • {car.year} • {car.mileage.toLocaleString()} km
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="text-4xl font-bold text-red-600 mb-4">${car.price.toLocaleString()}</div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Condition</p>
                <p className="font-semibold">{car.condition}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Fuel Type</p>
                <p className="font-semibold">{car.fuelType}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Transmission</p>
                <p className="font-semibold">{car.transmission}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="font-semibold text-green-600">{car.status}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{car.description}</p>
          </div>

          <InquiryForm carId={params.id as string} carTitle={car.title} />
        </div>
      </div>
    </main>
  )
}
