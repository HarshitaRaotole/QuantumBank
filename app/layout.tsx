import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/Header" // Import the shared Header component

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quantum Bank - Smart Banking",
  description: "Next-generation banking platform with intelligent financial management",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-white text-gray-800">
            {/* The Header component will now be rendered on all pages */}
            <Header username="Guest" />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
