"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "./ThemeProvider"
import { Sun, Moon } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<"light" | "dark">("dark")
  const [toggleTheme, setToggleTheme] = useState<() => void>(() => {})

  const { theme: currentTheme, toggleTheme: toggle } = useTheme()

  useEffect(() => {
    setThemeState(currentTheme)
    setToggleTheme(() => toggle)
    setMounted(true)
  }, [currentTheme, toggle])

  if (!mounted) {
    return (
      <header className="border-b border-border sticky top-0 bg-background z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl font-black text-accent">DCAR</span>
            <div className="w-10 h-10 rounded bg-secondary/50" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-border sticky top-0 bg-background z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="text-2xl font-black text-accent group-hover:text-accent-secondary transition-colors duration-300 glow-text">
              DCAR
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-semibold transition-all duration-300 relative ${
                pathname === "/" ? "text-accent" : "text-foreground/70 hover:text-accent"
              } after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 ${pathname === "/" ? "after:w-full" : "hover:after:w-full"}`}
            >
              Home
            </Link>
            <Link
              href="/cars"
              className={`text-sm font-semibold transition-all duration-300 relative ${
                pathname === "/cars" ? "text-accent" : "text-foreground/70 hover:text-accent"
              } after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 ${pathname === "/cars" ? "after:w-full" : "hover:after:w-full"}`}
            >
              Browse Cars
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-accent" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <div
                className={`w-5 h-0.5 bg-accent transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <div className={`w-5 h-0.5 bg-accent transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <div
                className={`w-5 h-0.5 bg-accent transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 animate-fade-in-up">
            <Link
              href="/"
              className={`block px-4 py-3 rounded text-sm font-semibold transition-all duration-300 ${
                pathname === "/"
                  ? "bg-accent text-primary neon-border"
                  : "text-foreground/70 hover:text-accent hover:bg-secondary/50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/cars"
              className={`block px-4 py-3 rounded text-sm font-semibold transition-all duration-300 ${
                pathname === "/cars"
                  ? "bg-accent text-primary neon-border"
                  : "text-foreground/70 hover:text-accent hover:bg-secondary/50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Cars
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export { Header }
