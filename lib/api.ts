// API client utilities for form submissions and data fetching
const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

export const apiClient = {
  async get(path: string) {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json()
  },

  async post(path: string, data: any, options?: any) {
    const isFormData = data instanceof FormData
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    })
    if (!res.ok) throw new Error("Failed to post")
    return res.json()
  },

  async put(path: string, data: any, options?: any) {
    const isFormData = data instanceof FormData
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    })
    if (!res.ok) throw new Error("Failed to update")
    return res.json()
  },

  async delete(path: string, options?: any) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: options?.data ? JSON.stringify(options.data) : undefined,
      ...options,
    })
    if (!res.ok) throw new Error("Failed to delete")
    return res.json()
  },

  async submitInquiry(data: any) {
    const res = await fetch(`${API_BASE}/api/submissions/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to submit inquiry")
    return res.json()
  },

  async submitNewsletter(email: string) {
    const res = await fetch(`${API_BASE}/api/submissions/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) throw new Error("Failed to subscribe")
    return res.json()
  },

  async uploadFile(file: File, email: string, description?: string) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("email", email)
    if (description) formData.append("description", description)

    const res = await fetch(`${API_BASE}/api/submissions/file-upload`, {
      method: "POST",
      body: formData,
    })
    if (!res.ok) throw new Error("Failed to upload file")
    return res.json()
  },

  async getCars() {
    const res = await fetch(`${API_BASE}/api/cars`)
    if (!res.ok) throw new Error("Failed to fetch cars")
    return res.json()
  },

  async getCarById(id: string) {
    const res = await fetch(`${API_BASE}/api/cars/${id}`)
    if (!res.ok) throw new Error("Failed to fetch car")
    return res.json()
  },
}

export default apiClient
