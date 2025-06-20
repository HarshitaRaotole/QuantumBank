"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2 } from "lucide-react" // Added Loader2
import Link from "next/link"
import axios from "axios" // Assuming axios is installed

interface LoginResponse {
  token: string
  user: {
    username: string
    firstName: string
    lastName: string
    email: string
  }
}

// Define the backend URL using the environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function LoginPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Add a check to ensure BACKEND_URL is defined
    if (!BACKEND_URL) {
      setError("Backend URL is not configured. Please set NEXT_PUBLIC_BACKEND_URL.")
      setLoading(false)
      return
    }

    try {
      // Prepend the backend URL to the API endpoint
      const response = await axios.post<LoginResponse>(`${BACKEND_URL}/api/auth/login`, formData)

      const { token, user } = response.data

      // --- DEBUGGING LOGS ---
      console.log("Login API Response Data:", response.data)
      console.log("Token received from login:", token)
      console.log("User object received from login:", user)
      // --- END DEBUGGING LOGS ---

      // ✅ Save token and full user object to localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // ✅ Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid email or password"
      setError(message)
      console.error("Login error details:", err.response?.data || err.message) // More detailed error logging
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 via-white to-violet-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-sm md:max-w-md border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          {" "}
          {/* Adjusted max-w-sm for mobile */}
          <CardHeader className="space-y-2 text-center pb-6">
            {" "}
            {/* Reduced padding */}
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-base text-gray-600">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-4 sm:px-6">
              {" "}
              {/* MODIFIED: px-6 -> px-4 sm:px-6 */}
              <div className="space-y-2">
                {" "}
                {/* Reduced space-y */}
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="h-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900" // Reduced height
                />
              </div>
              <div className="space-y-2">
                {" "}
                {/* Reduced space-y */}
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white pr-10 text-gray-900 placeholder:text-gray-500" // Reduced height and pr
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors" // Adjusted right padding
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  {" "}
                  {/* Reduced padding */}
                  <p className="text-sm font-medium text-red-600">{error}</p>
                </div>
              )}
            </CardContent>
            <div className="flex flex-col space-y-4 px-4 sm:px-6 pb-6">
              {" "}
              {/* MODIFIED: px-6 -> px-4 sm:px-6 */}
              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" // Reduced height
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-purple-600 hover:text-purple-700 font-medium underline underline-offset-4 transition-colors"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </Card>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-6">
        <p className="text-sm text-gray-500">© 2024 Quantum Bank. All rights reserved.</p>
      </div>
    </div>
  )
}
