"use client"

import type React from "react"

import { useState } from "react"
import apiClient from "@/lib/api"

interface InquiryFormProps {
  carId: string
  carTitle: string
}

export default function InquiryForm({ carId, carTitle }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await apiClient.post("/inquiries", {
        carId,
        ...formData,
      })
      setSubmitted(true)
      setFormData({ name: "", email: "", phone: "", message: "" })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error("Error submitting inquiry:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border-2 border-gray-200 p-8 rounded-lg">
      <h3 className="text-2xl font-bold mb-6">Interested in this vehicle?</h3>

      {submitted && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          Thank you! Your inquiry has been submitted. We'll contact you soon.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
        />
        <textarea
          name="message"
          placeholder="Your Message (optional)"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
        />
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  )
}
