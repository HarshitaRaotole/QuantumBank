"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import Header from "@/components/Header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [username, setUsername] = useState("Guest")

  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        setUsername((response.data as { name: string }).name)
      } catch (err) {
        console.error("Error fetching user:", err)
      }
    }

    fetchUsername()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-800">
      <Header username={username} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
