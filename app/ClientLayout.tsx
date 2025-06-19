"use client" // This layout needs to be a client component to use usePathname

import type React from "react"
import { Inter } from "next/font/google"
import "../app/globals.css" // Correct path for globals.css
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/Header" // Import the shared Header component
import { usePathname } from "next/navigation" // Import usePathname

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isDashboardRoute = pathname.startsWith("/dashboard")

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-white text-gray-800">
            {!isDashboardRoute && <Header />} {/* Render Header ONLY if NOT on a dashboard route */}
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
