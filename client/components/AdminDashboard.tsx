"use client"

import { useEffect, useState } from "react"
import apiClient from "@/lib/api"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    pendingInquiries: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const carsResponse = await apiClient.get("/cars")
      const inquiriesResponse = await apiClient.get("/inquiries")

      const cars = carsResponse.data.data
      const inquiries = inquiriesResponse.data.data

      setStats({
        totalCars: cars.length,
        availableCars: cars.filter((car: any) => car.status === "Available").length,
        pendingInquiries: inquiries.filter((inq: any) => inq.status === "New").length,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
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
      <h1 className="section-title mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
          <p className="text-gray-600 text-sm mb-2">Total Cars</p>
          <p className="text-4xl font-bold">{stats.totalCars}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <p className="text-gray-600 text-sm mb-2">Available Cars</p>
          <p className="text-4xl font-bold">{stats.availableCars}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-600">
          <p className="text-gray-600 text-sm mb-2">Pending Inquiries</p>
          <p className="text-4xl font-bold">{stats.pendingInquiries}</p>
        </div>
      </div>
    </div>
  )
}
