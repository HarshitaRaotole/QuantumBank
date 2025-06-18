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
import { Bell, Settings, LogOut, ChevronDown, Zap, Dot } from "lucide-react"

// Notification Interface
interface Notification {
  _id: string
  message: string
  isRead: boolean
  createdAt: string
}

interface HeaderProps {
  username: string // This prop is still received, but the component fetches its own
}

export default function Header({ username: propUsername }: HeaderProps) {
  const [username, setUsername] = useState("") // Local state for username
  const [email, setEmail] = useState("") // Local state for email
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([]) // State for notifications
  const [unreadCount, setUnreadCount] = useState(0) // State for unread count

  // Function to fetch notifications
  const fetchNotifications = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications`, {
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

    const unreadNotificationIds = notifications.filter((n) => !n.isRead).map((n) => n._id)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/mark-read`, {
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
    const fetchUserAndNotifications = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Fetch user data (preserving your existing logic)
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userData = await userRes.json()
        if (userData.success) {
          setUsername(userData.user.username)
          setEmail(userData.user.email || "") // Store email from API response
        }

        // Fetch notifications after user data is successfully retrieved
        await fetchNotifications(token)
      } catch (err) {
        console.error("Failed to fetch user or notifications", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndNotifications()
  }, []) // Empty dependency array means this runs once on mount

  // Use the fetched username or fallback to prop username
  const displayUsername = username || propUsername || "User"
  const initial = displayUsername ? displayUsername.charAt(0).toUpperCase() : "?"

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  // This function is called when the dropdown closes
  const handleDropdownClose = () => {
    onMarkAllAsRead()
  }

  const onMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
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
          {/* Notifications Dropdown */}
          <DropdownMenu onOpenChange={(open) => !open && handleDropdownClose()}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 hover:text-gray-900 hover:bg-purple-100" // Added hover:bg-purple-100
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
                className="flex items-center gap-3 px-3 py-2 h-auto text-gray-700 hover:bg-purple-100" // Added hover:bg-purple-100
              >
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
