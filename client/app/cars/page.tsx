"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import apiClient from "@/lib/api"
import Image from "next/image"

export default function CarsPage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    brand: "",
    year: "",
    minPrice: "",
    maxPrice: "",
    condition: "",
  })

  useEffect(() => {
    fetchCars()
  }, [filters])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      const response = await apiClient.get(`/cars?${params.toString()}`)
      setCars(response.data.data)
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <main className="container-max py-12">
      <h1 className="section-title">Browse Our Inventory</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 className="text-lg font-bold mb-4">Filters</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                placeholder="Toyota, BMW, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Year</label>
              <input
                type="number"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                placeholder="2024"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="100000"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Condition</label>
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">All Conditions</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Certified Used">Certified Used</option>
              </select>
            </div>

            <button
              onClick={() =>
                setFilters({
                  brand: "",
                  year: "",
                  minPrice: "",
                  maxPrice: "",
                  condition: "",
                })
              }
              className="btn-secondary w-full"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cars.map((car: any) => (
                <div key={car._id} className="car-card">
                  {car.images.length > 0 && (
                    <div className="relative h-40 bg-gray-200">
                      <Image
                        src={car.images[0].url || "/placeholder.svg"}
                        alt={car.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{car.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {car.brand} • {car.year} • {car.mileage.toLocaleString()} km
                    </p>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{car.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-red-600">${car.price.toLocaleString()}</span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">{car.condition}</span>
                    </div>
                    <Link href={`/cars/${car._id}`} className="btn-primary w-full text-center block text-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No cars found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
