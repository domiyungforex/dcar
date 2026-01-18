import { kv } from "@vercel/kv"

const CARS_KEY = "dcar:cars"
const INQUIRIES_KEY = "dcar:inquiries"
const ADMIN_TOKEN_KEY = "dcar:admin:token"

// Cars storage
export async function getCars(): Promise<Record<string, any>> {
  try {
    const cars = await kv.get(CARS_KEY)
    return cars || {}
  } catch (error) {
    console.error("Error getting cars:", error)
    return {}
  }
}

export async function getCar(id: string): Promise<any | null> {
  try {
    const cars = await getCars()
    return cars[id] || null
  } catch (error) {
    console.error("Error getting car:", error)
    return null
  }
}

export async function saveCar(id: string, car: any): Promise<void> {
  try {
    const cars = await getCars()
    cars[id] = { ...car, id, updatedAt: new Date().toISOString() }
    await kv.set(CARS_KEY, cars)
  } catch (error) {
    console.error("Error saving car:", error)
    throw error
  }
}

export async function deleteCar(id: string): Promise<void> {
  try {
    const cars = await getCars()
    delete cars[id]
    await kv.set(CARS_KEY, cars)
  } catch (error) {
    console.error("Error deleting car:", error)
    throw error
  }
}

// Inquiries storage
export async function getInquiries(): Promise<Record<string, any>> {
  try {
    const inquiries = await kv.get(INQUIRIES_KEY)
    return inquiries || {}
  } catch (error) {
    console.error("Error getting inquiries:", error)
    return {}
  }
}

export async function saveInquiry(id: string, inquiry: any): Promise<void> {
  try {
    const inquiries = await getInquiries()
    inquiries[id] = { ...inquiry, id, createdAt: new Date().toISOString() }
    await kv.set(INQUIRIES_KEY, inquiries)
  } catch (error) {
    console.error("Error saving inquiry:", error)
    throw error
  }
}

// Admin token
export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const storedToken = await kv.get(ADMIN_TOKEN_KEY)
    return storedToken === token
  } catch (error) {
    console.error("Error verifying token:", error)
    return false
  }
}

export async function setAdminToken(token: string): Promise<void> {
  try {
    await kv.set(ADMIN_TOKEN_KEY, token, { ex: 86400 * 7 }) // 7 days
  } catch (error) {
    console.error("Error setting token:", error)
    throw error
  }
}
