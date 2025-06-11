"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import axios from "axios"
import { Zap, Eye, EyeOff, Loader2 } from "lucide-react"

interface LoginResponse {
  token: string
  user: {
    username: string
    firstName: string
    lastName: string
    email: string
  }
}

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

    try {
      const response = await axios.post<LoginResponse>("http://localhost:5000/api/auth/login", formData)

      const { token, user } = response.data

      // ✅ Save token and full user object to localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // ✅ Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid email or password"
      setError(message)
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

      {/* Header */}
      <div className="relative z-10 flex items-center justify-center pt-8 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            Quantum Bank
          </span>
        </Link>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-8">
              <div className="space-y-3">
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
                  className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-purple-600 hover:text-purple-700 underline underline-offset-4 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white pr-12 text-gray-900 placeholder:text-gray-500"
                    autoComplete="current-password"
                    style={{
                      WebkitTextSecurity: showPassword ? "none" : "disc",
                      color: "#111827",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm font-medium text-red-600">{error}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-6 px-8 pb-8">
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
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
                    href="/register"
                    className="text-purple-600 hover:text-purple-700 font-medium underline underline-offset-4 transition-colors"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </CardFooter>
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
