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
import { Bell, LogOut, ChevronDown, Zap, Dot, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet" // Added SheetTitle

// Notification Interface
interface Notification {
  _id: string
  message: string
  isRead: boolean
  createdAt: string
}

// Define the backend URL using the environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(typeof window !== "undefined" ? !!localStorage.getItem("token") : false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // State for mobile menu

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
    console.log("Header.tsx: Token from localStorage:", token) // NEW LOG
    const currentIsLoggedIn = !!token

    if (currentIsLoggedIn !== isLoggedIn) {
      setIsLoggedIn(currentIsLoggedIn)
    }

    const fetchUserData = async () => {
      if (!currentIsLoggedIn) {
        setUsername("")
        setEmail("")
        setNotifications([])
        setUnreadCount(0)
        setLoading(false)
        return
      }

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // MODIFIED: Check userRes.ok and log full response if not OK
        if (!userRes.ok) {
          const errorData = await userRes.json().catch(() => ({})) // Try to parse JSON, default to empty object
          console.error("Failed to fetch user data. Status:", userRes.status, "Response:", errorData)
          setIsLoggedIn(false)
          localStorage.removeItem("token")
          setUsername("")
          setEmail("")
          setNotifications([])
          setUnreadCount(0)
          router.push("/login") // Redirect to login on failed user data fetch
          return // Exit early
        }

        const userData = await userRes.json()
        if (userData.success && userData.user) {
          setUsername(userData.user.username)
          setEmail(userData.user.email || "")
          await fetchNotifications(token)
        } else {
          // This block handles cases where userRes.ok is true (e.g., 200 OK) but backend sends success: false or no user
          console.error("Failed to fetch user data: Backend response indicates failure or missing user data.", userData)
          setIsLoggedIn(false)
          localStorage.removeItem("token")
          setUsername("")
          setEmail("")
          setNotifications([])
          setUnreadCount(0)
          router.push("/login") // Redirect to login if backend response is not as expected
        }
      } catch (err) {
        console.error("Error fetching user or notifications (network/parsing error):", err)
        setIsLoggedIn(false)
        localStorage.removeItem("token")
        setUsername("")
        setEmail("")
        setNotifications([])
        setUnreadCount(0)
        router.push("/login") // Redirect to login on network/parsing errors
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isLoggedIn, pathname, router]) // Added router to dependency array

  const displayName = username || "User"
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?"

  const handleLogout = () => {
    localStorage.removeItem("token")
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
    setIsMobileMenuOpen(false) // Close mobile menu on click
  }

  const handleNavLinkClick = (path: string) => {
    router.push(path)
    setIsMobileMenuOpen(false) // Close mobile menu on click
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

        {/* Center - Desktop Navigation Links */}
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
          {isLoggedIn && (
            <button onClick={handleDashboardClick} className="hover:text-purple-600 transition-colors">
              Dashboard
            </button>
          )}
        </nav>

        {/* Right side - User menu / Login & Signup / Mobile Menu */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
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

              {/* User Menu (Desktop) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden md:flex items-center gap-3 px-3 py-2 h-auto text-gray-700 hover:bg-purple-100"
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
            // Show Login/Signup buttons if not logged in (desktop)
            <div className="hidden md:flex items-center gap-2">
              <Button onClick={() => router.push("/login")} className="bg-purple-600 hover:bg-purple-700 text-white">
                Log In
              </Button>
              <Button onClick={() => router.push("/signup")} className="bg-purple-600 hover:bg-purple-700 text-white">
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu (Hamburger Icon) */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-purple-100">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-white p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Quantum Bank
                  </h1>
                </Link>
              </div>
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              <nav className="flex flex-col gap-4 text-base font-medium text-gray-700 flex-1">
                {" "}
                {/* Added flex-1 */}
                <Link
                  href="/"
                  className="hover:text-purple-600 transition-colors"
                  onClick={() => handleNavLinkClick("/")}
                >
                  Home
                </Link>
                <Link
                  href="/features"
                  className="hover:text-purple-600 transition-colors"
                  onClick={() => handleNavLinkClick("/features")}
                >
                  Features
                </Link>
                <Link
                  href="/about"
                  className="hover:text-purple-600 transition-colors"
                  onClick={() => handleNavLinkClick("/about")}
                >
                  About
                </Link>
                {isLoggedIn && (
                  <button onClick={handleDashboardClick} className="text-left hover:text-purple-600 transition-colors">
                    Dashboard
                  </button>
                )}
              </nav>

              {/* User/Auth section for mobile menu */}
              <div className="mt-auto pt-4 border-t border-gray-200">
                {" "}
                {/* Added mt-auto and pt-4 */}
                {isLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white font-semibold text-lg">
                          {initial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-base font-medium capitalize text-gray-900">
                          {loading ? "Loading..." : displayName}
                        </span>
                        <span className="text-sm text-gray-500">{email || "user@example.com"}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleLogout}
                      className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white text-base"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => handleNavLinkClick("/login")}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Log In
                    </Button>
                    <Button
                      onClick={() => handleNavLinkClick("/signup")}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
