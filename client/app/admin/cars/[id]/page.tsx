"use client"

import { useParams } from "next/navigation"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import AdminLayout from "@/components/AdminLayout"
import CarForm from "@/components/CarForm"

export default function EditCarPage() {
  const params = useParams()

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <CarForm carId={params.id as string} />
      </AdminLayout>
    </AdminProtectedRoute>
  )
}
