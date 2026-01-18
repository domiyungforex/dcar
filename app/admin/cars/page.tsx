"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Car } from "@/lib/types"

export default function AdminCarsPage() {
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCars()
  }, [])

  async function fetchCars() {
    try {
      setLoading(true)
      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/cars", {
        headers: { "x-admin-token": token || "" },
      })

      if (!res.ok) throw new Error("Failed to fetch cars")
      const data = await res.json()
      setCars(data)
    } catch (err) {
      setError("Failed to load cars")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function deleteCar(id: string) {
    if (!confirm("Are you sure you want to delete this car?")) return

    try {
      const token = localStorage.getItem("admin_token")
      const res = await fetch(`/api/cars/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token || "" },
      })

      if (!res.ok) throw new Error("Failed to delete car")
      setCars(cars.filter((c) => c.id !== id))
    } catch (err) {
      alert("Failed to delete car")
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-muted py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Cars</h1>
            <p className="text-muted-foreground">Your car listings</p>
          </div>
          <Link href="/admin/cars/new">
            <button className="bg-accent text-accent-foreground px-4 py-2 rounded font-medium hover:opacity-90">
              Add New Car
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading cars...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded">{error}</div>
        ) : cars.length > 0 ? (
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Year</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id} className="border-b border-border hover:bg-muted">
                      <td className="px-6 py-4 text-sm">{car.title}</td>
                      <td className="px-6 py-4 text-sm font-medium">${car.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">{car.year}</td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/admin/cars/${car.id}/edit`}>
                          <button className="text-accent hover:underline mr-4">Edit</button>
                        </Link>
                        <button onClick={() => deleteCar(car.id)} className="text-destructive hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-background border border-border rounded">
            <p className="text-muted-foreground mb-4">No cars yet</p>
            <Link href="/admin/cars/new">
              <button className="text-accent hover:underline">Add your first car</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
