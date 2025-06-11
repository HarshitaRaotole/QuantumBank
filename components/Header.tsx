"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, LogOut, ChevronDown, Zap } from "lucide-react"

interface HeaderProps {
  username: string
}

export default function Header({ username: propUsername }: HeaderProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (data.success) {
          setUsername(data.user.username)
          setEmail(data.user.email || "") // Store email from API response
        }
      } catch (err) {
        console.error("Failed to fetch user", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Use the fetched username or fallback to prop username
  const displayUsername = username || propUsername || "User"
  const initial = displayUsername ? displayUsername.charAt(0).toUpperCase() : "?"

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Quantum Bank title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Quantum Bank
            </h1>
          </div>
        </div>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-purple-600 text-white">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto text-gray-700">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white font-semibold">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium capitalize text-gray-900">
                    {loading ? "Loading..." : displayUsername}
                  </span>
                  <span className="text-xs text-gray-500">Account Holder</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none capitalize text-gray-900">{displayUsername}</p>
                  <p className="text-xs leading-none text-gray-600">{email || "user@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem className="gap-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 focus:bg-purple-50 focus:text-purple-700">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
