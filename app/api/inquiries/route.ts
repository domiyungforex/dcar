import { type NextRequest, NextResponse } from "next/server"
import { saveInquiry, getInquiries } from "@/lib/storage"
import { randomUUID } from "crypto"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("x-admin-token")
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const inquiries = await getInquiries()
    const inquiryList = Object.values(inquiries).sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return NextResponse.json(inquiryList)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const id = randomUUID()

    const inquiry = {
      id,
      carId: body.carId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      createdAt: new Date().toISOString(),
    }

    await saveInquiry(id, inquiry)
    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}
