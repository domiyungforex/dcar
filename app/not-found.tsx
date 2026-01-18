"use client"

import Link from "next/link"

export const dynamic = "force-dynamic"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-8">
          <h1 className="text-7xl sm:text-8xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-600 mb-4">
            404
          </h1>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-400 text-lg mb-8">
            The page you're looking for doesn't exist. But you can explore our collection or add a new car!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/">
            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition transform hover:scale-105">
              Go Home
            </button>
          </Link>
          <Link href="/cars">
            <button className="w-full px-6 py-3 border border-blue-500 text-blue-400 hover:bg-blue-500/10 rounded-lg font-semibold transition">
              Browse Cars
            </button>
          </Link>
          <Link href="/admin/cars/new">
            <button className="w-full px-6 py-3 bg-accent text-white rounded-lg font-semibold transition transform hover:scale-105">
              ➕ Add New Car
            </button>
          </Link>
          <Link href="/admin">
            <button className="w-full px-6 py-3 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg font-semibold transition">
              Admin Panel
            </button>
          </Link>
        </div>

        {/* Info Box */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <p className="text-gray-300">
            <span className="font-semibold text-blue-400">💡 Pro Tip:</span> Upload cars with up to 5 images and 1 video at <Link href="/admin/cars/new" className="text-blue-400 hover:text-blue-300 underline">Admin → Add New Car</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
