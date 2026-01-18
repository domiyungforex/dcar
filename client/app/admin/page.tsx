"use client"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import AdminLayout from "@/components/AdminLayout"
import AdminDashboard from "@/components/AdminDashboard"

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </AdminProtectedRoute>
  )
}
