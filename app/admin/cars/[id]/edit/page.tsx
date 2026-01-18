"use client"

import { useParams } from "next/navigation"
import CarForm from "@/components/admin/CarForm"

export default function EditCarPage() {
  const params = useParams()
  const carId = params.id as string

  return <CarForm carId={carId} />
}
