"use client"

import { useState, useEffect } from "react"
import CarCard from "@/components/CarCard"
import { ScrollReveal } from "@/components/ScrollReveal"
import { UniqueLoader } from "@/components/UniqueLoader"
import type { Car } from "@/lib/types"

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [filters, setFilters] = useState({
    brand: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    condition: "",
  })

  useEffect(() => {
    setIsLargeScreen(window.innerWidth >= 1024)

    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    fetchCars()
  }, [])

  async function fetchCars() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/cars")
      if (!res.ok) throw new Error("Failed to fetch cars")
      const data = await res.json()
      setCars(data)
    } catch (err) {
      setError("Failed to load cars. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredCars = cars.filter((car) => {
    if (filters.brand && car.brand.toLowerCase() !== filters.brand.toLowerCase()) return false
    if (filters.minPrice && car.price < Number.parseInt(filters.minPrice)) return false
    if (filters.maxPrice && car.price > Number.parseInt(filters.maxPrice)) return false
    if (filters.minYear && car.year < Number.parseInt(filters.minYear)) return false
    if (filters.condition && car.condition !== filters.condition) return false
    return true
  })

  const brands = [...new Set(cars.map((c) => c.brand))].sort()
  const conditions = ["excellent", "good", "fair"]

  return (
    <div className="relative bg-primary min-h-screen py-12 sm:py-16 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.1) 75%, rgba(0, 217, 255, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.1) 75%, rgba(0, 217, 255, 0.1) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
          className="absolute inset-0"
        />
      </div>

      <div className="absolute top-40 left-10 w-40 h-40 bg-accent rounded-full opacity-5 blur-3xl animate-float-smooth" />
      <div
        className="absolute bottom-20 right-10 w-48 h-48 bg-accent-secondary rounded-full opacity-5 blur-3xl animate-float-smooth"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold mb-3 glow-text">VEHICLE COLLECTION</h1>
            <div className="w-16 h-1 bg-accent rounded-full mb-4" />
            <p className="text-foreground/70 text-lg">
              {filteredCars.length} vehicle{filteredCars.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </ScrollReveal>

        <div className="lg:hidden mb-6 animate-fade-in-up">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full neon-border bg-secondary/50 backdrop-blur-custom hover:bg-secondary text-foreground px-4 py-3 rounded font-semibold text-sm transition-all duration-300"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {(showFilters || isLargeScreen) && (
            <div className="lg:col-span-1 animate-fade-in-up">
              <div className="neon-border backdrop-blur-custom bg-secondary/50 rounded-lg p-6 lg:sticky lg:top-24">
                <h3 className="font-bold text-lg mb-6 text-accent">ADVANCED FILTERS</h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground/80 mb-2">Brand</label>
                    <select
                      value={filters.brand}
                      onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-primary/50 border border-accent/30 rounded text-sm text-foreground transition-all duration-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 hover:border-accent/50"
                    >
                      <option value="">All Brands</option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground/80 mb-2">Condition</label>
                    <select
                      value={filters.condition}
                      onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                      className="w-full px-3 py-2 bg-primary/50 border border-accent/30 rounded text-sm text-foreground transition-all duration-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 hover:border-accent/50"
                    >
                      <option value="">All Conditions</option>
                      {conditions.map((c) => (
                        <option key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground/80 mb-2">Min Price ($)</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-primary/50 border border-accent/30 rounded text-sm text-foreground placeholder-foreground/40 transition-all duration-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 hover:border-accent/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground/80 mb-2">Max Price ($)</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      placeholder="999999"
                      className="w-full px-3 py-2 bg-primary/50 border border-accent/30 rounded text-sm text-foreground placeholder-foreground/40 transition-all duration-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 hover:border-accent/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground/80 mb-2">Min Year</label>
                    <input
                      type="number"
                      value={filters.minYear}
                      onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                      placeholder="2000"
                      className="w-full px-3 py-2 bg-primary/50 border border-accent/30 rounded text-sm text-foreground placeholder-foreground/40 transition-all duration-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 hover:border-accent/50"
                    />
                  </div>

                  <button
                    onClick={() =>
                      setFilters({
                        brand: "",
                        minPrice: "",
                        maxPrice: "",
                        minYear: "",
                        condition: "",
                      })
                    }
                    className="w-full text-sm font-semibold text-accent hover:text-accent-secondary transition-colors duration-300 mt-6 py-2 border border-accent/30 hover:border-accent-secondary/30 rounded"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <UniqueLoader />
              </div>
            ) : error ? (
              <div className="bg-destructive/10 neon-border border-destructive text-destructive p-6 rounded-lg animate-fade-in-up">
                <p className="font-semibold mb-2">Error Loading Vehicles</p>
                <p>{error}</p>
              </div>
            ) : filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredCars.map((car, idx) => (
                  <div key={car.id} style={{ animationDelay: `${idx * 0.05}s` }} className="animate-fade-in-up">
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 neon-border backdrop-blur-custom bg-secondary/50 rounded-lg animate-fade-in-up">
                <p className="text-foreground/60 text-lg mb-2">No Vehicles Found</p>
                <p className="text-foreground/40 text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
