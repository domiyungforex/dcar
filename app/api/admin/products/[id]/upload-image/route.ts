import { type NextRequest, NextResponse } from "next/server"
import { uploadFile } from "@/lib/blob-storage"
import { getProduct, saveProduct } from "@/lib/product-storage"

/**
 * POST /api/admin/products/[id]/upload-image
 * Upload product image to Blob storage
 */

function verifyAdminCode(request: NextRequest): boolean {
  const code = request.headers.get("x-admin-code")
  return code === process.env.ADMIN_ACCESS_CODE
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!verifyAdminCode(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload image to Blob storage
    const imageRecord = await uploadFile(file, `products/${id}/${file.name}`)

    // Get product and add image URL
    const product = await getProduct(id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    product.images.push(imageRecord.url)
    await saveProduct(product)

    return NextResponse.json({ url: imageRecord.url, pathname: imageRecord.pathname }, { status: 200 })
  } catch (error) {
    console.error("[v0] Upload image error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
