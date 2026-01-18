"use client"

import type React from "react"

// Custom hooks for form and data management
import { useState, useCallback } from "react"

export function useForm(initialState: any, onSubmit: (data: any) => Promise<void>) {
  const [formData, setFormData] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }))
    },
    [],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError(null)
      setSuccess(false)

      try {
        await onSubmit(formData)
        setSuccess(true)
        setFormData(initialState)
        setTimeout(() => setSuccess(false), 5000)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    },
    [formData, initialState, onSubmit],
  )

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    loading,
    error,
    success,
  }
}

// Auth hook - removed as no auth is needed
interface User {
  id?: string
  name?: string
  email?: string
  role?: "admin" | "user"
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return {
    isAuthenticated,
    user,
    loading,
    logout: () => {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      setIsAuthenticated(false)
    },
  }
}
