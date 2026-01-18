import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { setAdminToken } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // Simple admin auth - use environment variable
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex")
    await setAdminToken(token)

    const response = NextResponse.json({ success: true, token }, { status: 200 })

    // Set secure cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
