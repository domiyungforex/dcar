import { uploadJSON, fetchJSON, deleteFile, listFiles } from "./blob-storage"

/**
 * Product data storage using Vercel Blob
 * Products are stored as JSON files with image URLs
 */

export interface Product {
  id: string
  name: string
  brand: string
  year: number
  price: number
  mileage: number
  condition: "excellent" | "good" | "fair" | "needs-work"
  fuel: "petrol" | "diesel" | "electric" | "hybrid"
  transmission: "manual" | "automatic"
  description: string
  images: string[] // URLs from Blob storage
  createdAt: string
  updatedAt: string
}

const PRODUCTS_PREFIX = "products/"

/**
 * Save a product
 */
export async function saveProduct(product: Product): Promise<void> {
  try {
    const id = product.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const productData = {
      ...product,
      id,
      updatedAt: new Date().toISOString(),
      createdAt: product.createdAt || new Date().toISOString(),
    }

    await uploadJSON(productData, `${PRODUCTS_PREFIX}${id}.json`)
  } catch (error) {
    console.error("[v0] Save product error:", error)
    throw new Error("Failed to save product")
  }
}

/**
 * Fetch all products
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const files = await listFiles(PRODUCTS_PREFIX)
    const products: Product[] = []

    for (const file of files) {
      const data = await fetchJSON(file.url)
      products.push(data as unknown as Product)
    }

    return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("[v0] Get products error:", error)
    return []
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const files = await listFiles(PRODUCTS_PREFIX)
    const file = files.find((f) => f.pathname.includes(id))

    if (!file) return null

    const data = await fetchJSON(file.url)
    return data as unknown as Product
  } catch (error) {
    console.error("[v0] Get product error:", error)
    return null
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    await deleteFile(`${PRODUCTS_PREFIX}${id}.json`)
  } catch (error) {
    console.error("[v0] Delete product error:", error)
    throw new Error("Failed to delete product")
  }
}
