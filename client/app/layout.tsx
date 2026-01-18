import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DCAR - Premium Car Sales",
  description: "Browse and purchase premium new and used vehicles",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
