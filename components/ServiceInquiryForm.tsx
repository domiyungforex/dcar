'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ServiceInquiryFormProps {
  serviceType: string
  serviceName: string
}

export default function ServiceInquiryForm({ serviceType, serviceName }: ServiceInquiryFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleInfo: '',
    description: '',
    preferredDate: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/services/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          serviceName,
          ...formData,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit form')
      }

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        vehicleInfo: '',
        description: '',
        preferredDate: '',
      })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500/50 rounded text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-900/30 border border-green-500/50 rounded text-green-200">
          ✓ Service inquiry submitted successfully! We'll contact you soon.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-4 py-3 bg-slate-800 border border-cyan-500/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address *"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-4 py-3 bg-slate-800 border border-cyan-500/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number *"
          value={formData.phone}
          onChange={handleChange}
          required
          className="px-4 py-3 bg-slate-800 border border-cyan-500/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
        <input
          type="text"
          name="vehicleInfo"
          placeholder="Vehicle Info (Make/Model/Year) *"
          value={formData.vehicleInfo}
          onChange={handleChange}
          required
          className="px-4 py-3 bg-slate-800 border border-cyan-500/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <input
        type="date"
        name="preferredDate"
        value={formData.preferredDate}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/30 rounded text-white focus:outline-none focus:border-cyan-500"
      />

      <textarea
        name="description"
        placeholder="Describe the service you need *"
        value={formData.description}
        onChange={handleChange}
        required
        rows={5}
        className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded transition-all"
      >
        {loading ? 'Submitting...' : 'Submit Service Request'}
      </Button>
    </form>
  )
}
