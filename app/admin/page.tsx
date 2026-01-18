"use client"
import { useState } from "react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  return (
    <div className="min-h-screen bg-muted py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Manage products, submissions, and files</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Link href="/admin/products" className="block">
            <div className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition cursor-pointer h-full hover:border-primary">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">📦</div>
              <h2 className="text-lg sm:text-xl font-bold mb-1">Products</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Add, edit, and manage products</p>
            </div>
          </Link>

          <Link href="/admin/submissions" className="block">
            <div className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition cursor-pointer h-full hover:border-primary">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">📨</div>
              <h2 className="text-lg sm:text-xl font-bold mb-1">Submissions</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">View inquiries and newsletters</p>
            </div>
          </Link>

          <Link href="/admin/files" className="block">
            <div className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition cursor-pointer h-full hover:border-primary">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">📁</div>
              <h2 className="text-lg sm:text-xl font-bold mb-1">Files</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Manage uploaded files</p>
            </div>
          </Link>
        </div>

        {/* Quick Info */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Quick Info</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>All data is stored in Upstash Redis with instant access</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Files are uploaded to Vercel Blob storage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Customer inquiries and uploads are saved automatically</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
