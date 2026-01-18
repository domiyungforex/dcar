import { type NextRequest, NextResponse } from "next/server"
import { getCars, saveCar } from "@/lib/storage"
import { randomUUID } from "crypto"

export async function GET() {
  try {
    const cars = await getCars()
    const carList = Object.values(cars).sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return NextResponse.json(carList)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCode = request.headers.get("x-admin-code")

    // Simple code check - in production use proper auth
    if (!adminCode || adminCode !== "123456") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const id = randomUUID()

    const car = {
      id,
      title: body.title,
      price: body.price,
      brand: body.brand,
      year: body.year,
      mileage: body.mileage,
      condition: body.condition,
      images: body.images || [],
      video: body.video,
      description: body.description,
      createdAt: new Date().toISOString(),
    }

    await saveCar(id, car)
    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 })
  }
}
