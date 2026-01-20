"use client"

import { Suspense } from "react"
import BookingFormContent from "../form-content"

export default function BookingForm() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingFormContent />
    </Suspense>
  )
}
