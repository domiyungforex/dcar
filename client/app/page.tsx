"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import apiClient from "@/lib/api"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await apiClient.get("/cars/featured")
        setFeaturedCars(response.data.data)
      } catch (error) {
        console.error("Error fetching featured cars:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedCars()
  }, [])

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-96 md:h-screen bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('/luxury-car-dealership.jpg')" }}
        />

        <div className="relative z-10 text-center text-white max-w-2xl px-4">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Find Your Perfect Car
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover premium new and used vehicles from DCAR
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/cars" className="btn-primary text-lg">
              Browse All Cars
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="container-max py-16 md:py-24">
        <h2 className="section-title text-center">Featured Vehicles</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">Handpicked selection of premium cars</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car: any) => (
              <motion.div
                key={car._id}
                className="car-card"
                whileHover={{ translateY: -4 }}
                transition={{ duration: 0.3 }}
              >
                {car.images.length > 0 && (
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={car.images[0].url || "/placeholder.svg"}
                      alt={car.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{car.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {car.brand} • {car.year}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-red-600">${car.price.toLocaleString()}</span>
                    <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded">{car.condition}</span>
                  </div>
                  <Link href={`/cars/${car._id}`} className="btn-primary w-full text-center block">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Drive Home Your Dream Car?</h2>
          <p className="text-lg mb-8 text-red-100">Browse our complete inventory and find the perfect vehicle</p>
          <Link
            href="/cars"
            className="bg-white text-red-600 px-8 py-3 rounded font-semibold hover:bg-gray-100 transition"
          >
            View All Cars
          </Link>
        </div>
      </section>
    </main>
  )
}
