import { type NextRequest, NextResponse } from "next/server"
import { saveProduct, getProducts, deleteProduct } from "@/lib/redis-products"
import type { Product } from "@/lib/redis-products"

/**
 * GET /api/admin/products - Fetch all products
 * POST /api/admin/products - Create new product
 * DELETE /api/admin/products - Delete product
 */

function verifyAdminCode(request: NextRequest): boolean {
  const code = request.headers.get("x-admin-code")
  return code === process.env.ADMIN_ACCESS_CODE
}

export async function GET(request: NextRequest) {
  if (!verifyAdminCode(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const products = await getProducts()
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.error("[v0] Get products error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminCode(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const product: Partial<Product> = {
      name: body.name,
      brand: body.brand,
      year: Number.parseInt(body.year),
      price: Number.parseInt(body.price),
      mileage: Number.parseInt(body.mileage),
      condition: body.condition,
      fuel: body.fuel,
      transmission: body.transmission,
      description: body.description,
      images: body.images || [],
    }

    const savedProduct = await saveProduct(product)
    return NextResponse.json(savedProduct, { status: 201 })
  } catch (error) {
    console.error("[v0] Create product error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminCode(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const product: Partial<Product> = {
      ...body,
      updatedAt: new Date().toISOString(),
    }

    const updatedProduct = await saveProduct(product)
    return NextResponse.json(updatedProduct, { status: 200 })
  } catch (error) {
    console.error("[v0] Update product error:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminCode(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 })
    }

    await deleteProduct(id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Delete product error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
