"use client"

import { useEffect, useState } from "react"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import AdminLayout from "@/components/AdminLayout"
import apiClient from "@/lib/api"

export default function AdminInquiriesPage() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminInquiriesList />
      </AdminLayout>
    </AdminProtectedRoute>
  )
}

function AdminInquiriesList() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await apiClient.get("/inquiries")
      setInquiries(response.data.data)
    } catch (error) {
      console.error("Error fetching inquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiClient.put(`/inquiries/${id}`, { status })
      setInquiries(inquiries.map((inq: any) => (inq._id === id ? { ...inq, status } : inq)))
    } catch (error) {
      console.error("Error updating inquiry:", error)
      alert("Failed to update inquiry status")
    }
  }

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return

    try {
      await apiClient.delete(`/inquiries/${id}`)
      setInquiries(inquiries.filter((inq: any) => inq._id !== id))
    } catch (error) {
      console.error("Error deleting inquiry:", error)
      alert("Failed to delete inquiry")
    }
  }

  return (
    <div>
      <h1 className="section-title mb-8">Customer Inquiries</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inquiry: any) => (
            <div key={inquiry._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{inquiry.name}</h3>
                  <p className="text-sm text-gray-600">Car: {inquiry.carId?.title || "Car not found"}</p>
                </div>
                <select
                  value={inquiry.status}
                  onChange={(e) => updateStatus(inquiry._id, e.target.value)}
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    inquiry.status === "New"
                      ? "bg-orange-100 text-orange-700"
                      : inquiry.status === "Contacted"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Resolved</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold">{inquiry.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-semibold">{inquiry.phone}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 text-sm">Message</p>
                <p className="text-gray-800">{inquiry.message}</p>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                Submitted: {new Date(inquiry.createdAt).toLocaleDateString()}
              </div>

              <button
                onClick={() => deleteInquiry(inquiry._id)}
                className="text-red-600 hover:text-red-700 text-sm font-semibold"
              >
                Delete Inquiry
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No inquiries yet</p>
        </div>
      )}
    </div>
  )
}
