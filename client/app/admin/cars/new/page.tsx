"use client"

import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import AdminLayout from "@/components/AdminLayout"
import CarForm from "@/components/CarForm"

export default function NewCarPage() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <CarForm />
      </AdminLayout>
    </AdminProtectedRoute>
  )
}
