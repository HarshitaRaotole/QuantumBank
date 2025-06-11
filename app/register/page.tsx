"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react"
import axios from "axios"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("") // Reset error before form submission

    // Passwords match check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      // Updated API endpoint to match backend route
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        username: formData.username, // Sending username
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })

      if (res.status === 201) {
        router.push("/login") // Redirect to login page on successful registration
      }
    } catch (err: any) {
      // Check if the error response exists and handle accordingly
      if (err.response) {
        // Error from backend (e.g., validation errors)
        console.error("Backend error:", err.response.data)
        setError(err.response?.data?.message || "Registration failed. Please try again.")
      } else {
        // Network error or no response
        console.error("Network error:", err.message)
        setError("An error occurred. Please check your connection and try again.")
      }
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

      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-lg border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900">Create an account</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Enter your information to create your Quantum Bank account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-8">
              {/* Username Field */}
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    placeholder="Your username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="h-12 pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                  />
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="h-12 pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="h-12 pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 pl-10 pr-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
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

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-12 pl-10 pr-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                    style={{
                      WebkitTextSecurity: showConfirmPassword ? "none" : "disc",
                      color: "#111827",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-purple-600 hover:text-purple-700 font-medium underline underline-offset-4 transition-colors"
                  >
                    Log in
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
