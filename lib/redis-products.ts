import { setData, getData, deleteData, listKeys } from "./upstash-storage"

/**
 * Product data storage using Upstash Redis
 * Products are stored with fast retrieval and real-time updates
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

const PRODUCTS_PREFIX = "product:"
const PRODUCTS_INDEX = "products:index"

/**
 * Save a product
 */
export async function saveProduct(product: Partial<Product>): Promise<Product> {
  try {
    const id = product.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const productData: Product = {
      id,
      name: product.name || "",
      brand: product.brand || "",
      year: product.year || new Date().getFullYear(),
      price: product.price || 0,
      mileage: product.mileage || 0,
      condition: product.condition || "good",
      fuel: product.fuel || "petrol",
      transmission: product.transmission || "manual",
      description: product.description || "",
      images: product.images || [],
      updatedAt: new Date().toISOString(),
      createdAt: product.createdAt || new Date().toISOString(),
    }

    const key = `${PRODUCTS_PREFIX}${id}`
    await setData(key, productData as unknown as Record<string, unknown>)

    // Update index
    await setData(`${PRODUCTS_INDEX}:${id}`, { id, name: productData.name, updatedAt: productData.updatedAt })

    return productData
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
    const keys = await listKeys(`${PRODUCTS_PREFIX}*`)
    const products: Product[] = []

    for (const key of keys) {
      const data = await getData(key)
      if (data) {
        products.push(data as unknown as Product)
      }
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
    const key = `${PRODUCTS_PREFIX}${id}`
    const data = await getData(key)
    return data as Product | null
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
    const key = `${PRODUCTS_PREFIX}${id}`
    await deleteData(key)
    await deleteData(`${PRODUCTS_INDEX}:${id}`)
  } catch (error) {
    console.error("[v0] Delete product error:", error)
    throw new Error("Failed to delete product")
  }
}
