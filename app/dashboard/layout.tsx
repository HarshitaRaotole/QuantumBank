"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"

// Define interfaces for the expected data structure
interface UserData {
  username: string
  email: string
}

interface AuthMeResponse {
  success: boolean
  user?: UserData // 'user' might be undefined if success is false
}

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
        // Use the generic type for axios.get to tell TypeScript the expected response.data shape
        const response = await axios.get<AuthMeResponse>(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        // Now TypeScript knows response.data has a 'user' property (if 'success' is true)
        if (response.data.success && response.data.user) {
          setUsername(response.data.user.username || "Guest")
          // You might also want to set email here if needed for other components
        } else {
          // Handle cases where success is false or user is not present
          console.error("Failed to fetch user data:", response.data)
          // Optionally, redirect to login if user data is not found
          // router.push("/login");
        }
      } catch (err) {
        console.error("Error fetching user:", err)
        // Handle network errors or other exceptions
        // router.push("/login");
      }
    }

    fetchUsername()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-800">
      {/* The Header is now handled by app/layout.tsx */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
