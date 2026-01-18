"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">DCAR Admin</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition">
            Dashboard
          </Link>
          <Link href="/admin/cars" className="block px-4 py-2 hover:bg-gray-800 rounded transition">
            Manage Cars
          </Link>
          <Link href="/admin/inquiries" className="block px-4 py-2 hover:bg-gray-800 rounded transition">
            View Inquiries
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-800 rounded transition mt-8"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}
