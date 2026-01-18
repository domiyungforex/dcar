export interface Car {
  id: string
  title: string
  price: number
  brand: string
  year: number
  mileage: number
  condition: "excellent" | "good" | "fair"
  images: string[]
  video?: string
  description: string
  createdAt: string
}

export interface Inquiry {
  id: string
  carId: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
}

export interface AdminSession {
  authenticated: boolean
  token?: string
}
