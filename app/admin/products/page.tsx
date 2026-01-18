"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { adminFetch, getAdminCode } from "@/lib/admin-helpers"
import { Button } from "@/components/ui/button"
import AdminCodeEntry from "@/components/AdminCodeEntry"
import type { Product } from "@/lib/product-storage"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const code = getAdminCode()
    if (!code) {
      setIsAuthenticated(false)
      return
    }
    setIsAuthenticated(true)
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const response = await adminFetch("/api/admin/products")

      if (!response.ok) {
        throw new Error("Failed to load products")
      }

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("[v0] Load products error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return

    try {
      const response = await adminFetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) throw new Error("Delete failed")

      setProducts(products.filter((p) => p.id !== id))
    } catch (error) {
      alert("Failed to delete product")
    }
  }

  if (!isAuthenticated) {
    return <AdminCodeEntry onSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold mb-2">Products</h1>
            <p className="text-muted-foreground">Manage your product listings</p>
          </div>
          <Link href="/admin/products/new">
            <Button>Add Product</Button>
          </Link>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-background border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">No products yet</p>
            <Link href="/admin/products/new">
              <Button>Create First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {product.images.length > 0 && (
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold mb-1">
                    {product.year} {product.brand} {product.name}
                  </h3>
                  <p className="text-lg font-bold text-accent mb-2">${product.price.toLocaleString()}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground mb-4">
                    <span>{product.mileage.toLocaleString()} miles</span>
                    <span>{product.condition}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Edit
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive hover:bg-destructive/10 px-3 py-1 rounded text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
