"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import AdminLayout from "@/components/AdminLayout"
import apiClient from "@/lib/api"

export default function AdminCarsPage() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminCarsList />
      </AdminLayout>
    </AdminProtectedRoute>
  )
}

function AdminCarsList() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const response = await apiClient.get("/cars")
      setCars(response.data.data)
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCar = async (id: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return

    try {
      await apiClient.delete(`/cars/${id}`)
      setCars(cars.filter((car: any) => car._id !== id))
    } catch (error) {
      console.error("Error deleting car:", error)
      alert("Failed to delete car")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="section-title">Manage Cars</h1>
        <Link href="/admin/cars/new" className="btn-primary">
          Add New Car
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : cars.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Brand</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car: any) => (
                <tr key={car._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{car.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{car.brand}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-red-600">${car.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        car.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {car.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-3">
                    <Link href={`/admin/cars/${car._id}`} className="text-blue-600 hover:text-blue-700">
                      Edit
                    </Link>
                    <button onClick={() => deleteCar(car._id)} className="text-red-600 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">No cars found</p>
          <Link href="/admin/cars/new" className="btn-primary">
            Add First Car
          </Link>
        </div>
      )}
    </div>
  )
}
