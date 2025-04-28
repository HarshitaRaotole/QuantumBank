import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1">{children}</main>
    </div>
  )
}
