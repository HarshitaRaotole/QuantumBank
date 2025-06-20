"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
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
import { Bell, LogOut, ChevronDown, Zap, Dot } from "lucide-react"

// Notification Interface
interface Notification {
  _id: string
  message: string
  isRead: boolean
  createdAt: string
}

// Define the backend URL using the environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

// Removed HeaderProps interface as username prop is no longer needed
export default function Header() {
  // Initialize isLoggedIn based on localStorage immediately during client-side render
  const [isLoggedIn, setIsLoggedIn] = useState(typeof window !== "undefined" ? !!localStorage.getItem("token") : false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const router = useRouter()
  const pathname = usePathname()

  // Function to fetch notifications
  const fetchNotifications = async (token: string) => {
    if (!BACKEND_URL) {
      console.error("Backend URL is not configured for notifications.")
      return
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      } else {
        console.error("Failed to fetch notifications:", await res.json())
      }
    } catch (err) {
      console.error("Error fetching notifications:", err)
    }
  }

  // Function to mark notifications as read
  const markAllNotificationsAsRead = async () => {
    const token = localStorage.getItem("token")
    if (!token || unreadCount === 0) return

    if (!BACKEND_URL) {
      console.error("Backend URL is not configured for marking notifications as read.")
      return
    }

    const unreadNotificationIds = notifications.filter((n) => !n.isRead).map((n) => n._id)

    try {
      const res = await fetch(`${BACKEND_URL}/api/notifications/mark-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationIds: unreadNotificationIds }),
      })
      if (res.ok) {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
        setUnreadCount(0)
      } else {
        console.error("Failed to mark notifications as read:", await res.json())
      }
    } catch (err) {
      console.error("Error marking notifications as read:", err)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    const currentIsLoggedIn = !!token

    // Update isLoggedIn state if it differs from the initial render or previous effect run
    if (currentIsLoggedIn !== isLoggedIn) {
      setIsLoggedIn(currentIsLoggedIn)
    }

    const fetchUserData = async () => {
      if (!currentIsLoggedIn) {
        // Use currentIsLoggedIn for this check
        setUsername("") // Clear username if not logged in
        setEmail("") // Clear email
        setNotifications([]) // Clear notifications
        setUnreadCount(0)
        setLoading(false)
        return
      }

      // Add a check to ensure BACKEND_URL is defined
      if (!BACKEND_URL) {
        console.error("Backend URL is not configured for user data fetch.")
        setIsLoggedIn(false)
        localStorage.removeItem("token")
        setUsername("")
        setEmail("")
        setNotifications([])
        setUnreadCount(0)
        setLoading(false)
        return
      }

      try {
        const userRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
          // Use BACKEND_URL
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userData = await userRes.json()
        if (userRes.ok && userData.success) {
          setUsername(userData.user.username)
          setEmail(userData.user.email || "")
          await fetchNotifications(token) // Fetch notifications only if user data is successful
        } else {
          console.error("Failed to fetch user data:", userData)
          setIsLoggedIn(false) // Force logout if user data fetch fails
          localStorage.removeItem("token")
          setUsername("")
          setEmail("")
          setNotifications([])
          setUnreadCount(0)
        }
      } catch (err) {
        console.error("Error fetching user or notifications:", err)
        setIsLoggedIn(false) // Force logout on network error
        localStorage.removeItem("token")
        setUsername("")
        setEmail("")
        setNotifications([])
        setUnreadCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isLoggedIn, pathname]) // Added isLoggedIn and pathname to dependencies

  const displayName = username || "User" // Removed propUsername fallback
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?"

  const handleLogout = () => {
    localStorage.removeItem("token")
    // Force a full page reload to ensure all components re-initialize
    window.location.href = "/login"
  }

  const handleDropdownClose = () => {
    markAllNotificationsAsRead()
  }

  const handleDashboardClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - Quantum Bank title */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Quantum Bank
            </h1>
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 text-sm font-medium">
          <Link href="/" className="hover:text-purple-600 transition-colors">
            Home
          </Link>
          <Link href="/features" className="hover:text-purple-600 transition-colors">
            Features
          </Link>
          <Link href="/about" className="hover:text-purple-600 transition-colors">
            About
          </Link>
          {/* Dashboard link visible only if logged in */}
          {isLoggedIn && (
            <button onClick={handleDashboardClick} className="hover:text-purple-600 transition-colors">
              Dashboard
            </button>
          )}
        </nav>

        {/* Right side - User menu / Login & Signup */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? ( // Show notifications/user menu if logged in
            <>
              {/* Notifications Dropdown */}
              <DropdownMenu onOpenChange={(open) => !open && handleDropdownClose()}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-600 hover:text-gray-900 hover:bg-purple-100"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-purple-600 text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg rounded-md">
                  <DropdownMenuLabel className="text-gray-900 font-semibold px-4 py-2">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  {notifications.length === 0 ? (
                    <DropdownMenuItem className="text-gray-500 py-3" disabled>
                      No new notifications
                    </DropdownMenuItem>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification._id}
                        className={`flex items-start gap-2 py-3 px-4 cursor-pointer transition-colors duration-150 ${
                          !notification.isRead ? "bg-purple-100 font-medium" : "bg-white"
                        } data-[highlighted]:bg-purple-100 data-[highlighted]:text-gray-900`}
                      >
                        {!notification.isRead && <Dot className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />}
                        <div className="flex flex-col flex-grow">
                          <div className="text-sm text-gray-900">{notification.message}</div>
                          <div className={`text-xs ${!notification.isRead ? "text-purple-800" : "text-gray-500"}`}>
                            {new Date(notification.createdAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                  {notifications.length > 0 && unreadCount > 0 && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-200" />
                      <DropdownMenuItem
                        onClick={handleDropdownClose}
                        className="text-center text-purple-600 py-3 data-[highlighted]:bg-purple-100 data-[highlighted]:text-purple-700"
                      >
                        Mark all as read
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 px-3 py-2 h-auto text-gray-700 hover:bg-purple-100"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white font-semibold">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium capitalize text-gray-900">
                        {loading ? "Loading..." : displayName}
                      </span>
                      <span className="text-xs text-gray-500">Account Holder</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none capitalize text-gray-900">{displayName}</p>
                      <p className="text-xs leading-none text-gray-600">{email || "user@example.com"}</p>
                    </div>
                  </DropdownMenuLabel>
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
            </>
          ) : (
            // Show Login/Signup buttons if not logged in
            <div className="flex items-center gap-2">
              <Button onClick={() => router.push("/login")} className="bg-purple-600 hover:bg-purple-700 text-white">
                Log In
              </Button>
              <Button onClick={() => router.push("/signup")} className="bg-purple-600 hover:bg-purple-700 text-white">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
