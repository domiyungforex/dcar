"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/lib/hooks"

export default function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-red-600">
          DCAR
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-red-600 transition">
            Home
          </Link>
          <Link href="/cars" className="text-gray-700 hover:text-red-600 transition">
            Browse Cars
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">{user.name}</span>
              {user.role === "admin" && (
                <Link href="/admin" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                  Admin
                </Link>
              )}
              <button onClick={logout} className="text-gray-700 hover:text-red-600 transition">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Login
            </Link>
          )}
        </div>

        <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          ☰
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50 px-4 py-4 space-y-4">
          <Link href="/" className="block text-gray-700 hover:text-red-600">
            Home
          </Link>
          <Link href="/cars" className="block text-gray-700 hover:text-red-600">
            Browse Cars
          </Link>
          {user ? (
            <>
              <div className="text-gray-600 text-sm">{user.name}</div>
              {user.role === "admin" && (
                <Link href="/admin" className="block text-red-600 font-semibold">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={logout} className="block text-gray-700 hover:text-red-600">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="block text-red-600 font-semibold">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
