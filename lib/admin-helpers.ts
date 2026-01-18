/**
 * Admin panel helper functions
 * Handles access code verification and admin operations
 */

export const ADMIN_CODE_STORAGE_KEY = "admin-access-code"

/**
 * Store admin code in session storage (not persisted)
 */
export function storeAdminCode(code: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(ADMIN_CODE_STORAGE_KEY, code)
  }
}

/**
 * Get stored admin code
 */
export function getAdminCode(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(ADMIN_CODE_STORAGE_KEY)
  }
  return null
}

/**
 * Clear admin code on logout
 */
export function clearAdminCode() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(ADMIN_CODE_STORAGE_KEY)
  }
}

/**
 * Make authenticated admin API call
 */
export async function adminFetch(url: string, options: RequestInit = {}) {
  const code = getAdminCode()
  if (!code) {
    throw new Error("Admin access code required")
  }

  const headers = new Headers(options.headers)
  headers.set("x-admin-code", code)

  return fetch(url, {
    ...options,
    headers,
  })
}
