import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "@/app/ClientLayout" // Changed import path to use absolute alias

// Metadata is a server-only export, so it stays here in the Server Component layout
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
  return <ClientLayout>{children}</ClientLayout>
}
