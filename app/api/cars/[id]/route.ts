import { type NextRequest, NextResponse } from "next/server"
import { getCar, saveCar, deleteCar } from "@/lib/storage"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const car = await getCar(id)
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }
    return NextResponse.json(car)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const token = request.headers.get("x-admin-token")
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const car = await getCar(id)

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    const updatedCar = { ...car, ...body, id }
    await saveCar(id, updatedCar)
    return NextResponse.json(updatedCar)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const token = request.headers.get("x-admin-token")
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteCar(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 })
  }
}
