"use client"

import type React from "react"

interface AdminProtectedRouteProps {
  children: React.ReactNode
  adminCode?: string
}

// No authentication needed - admin route placeholder
export function AdminProtectedRoute({ children, adminCode }: AdminProtectedRouteProps) {
  return <>{children}</>
}

export default AdminProtectedRoute
