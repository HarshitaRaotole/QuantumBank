"use client"

import type React from "react"
import Header from "@/components/Header" // Import the shared Header component

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Removed username state and useEffect to fetch it,
  // as the Header component now handles its own user data fetching.

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-800">
      <Header /> {/* Removed username prop */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}
