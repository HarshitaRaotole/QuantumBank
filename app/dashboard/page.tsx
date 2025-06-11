"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, Plus, Wallet, Eye, EyeOff } from "lucide-react"
import AddAccountForm from "@/components/AddAccountForm"

interface Account {
  accountType: string
  accountNumber: string
  balance: number
}

export default function Dashboard() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showBalances, setShowBalances] = useState(true)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        const [userRes, accountsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const userData = await userRes.json()
        const accountsData = await accountsRes.json()

        // Fix: Access username from the correct path based on your Header component
        if (userData.success && userData.user) {
          setUser({
            username: userData.user.username || "",
            email: userData.user.email || "",
          })
        }
        setAccounts(accountsData.accounts || [])
      } catch (err) {
        console.error("Error fetching data:", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const displayName = user?.username || "User"
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const accountTypeColors = {
    Savings: "bg-purple-100 text-purple-700 border-purple-200",
    Current: "bg-violet-100 text-violet-700 border-violet-200",
    Credit: "bg-indigo-100 text-indigo-700 border-indigo-200",
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back, {displayName}! 👋</h1>
            <p className="text-gray-600">Here's what's happening with your accounts today.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBalances(!showBalances)}
            className="gap-2 bg-purple-600 hover:bg-purple-700 border-purple-600 text-white hover:text-white"
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showBalances ? "Hide" : "Show"} Balances
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-purple-100 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-purple-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {showBalances ? `₹${totalBalance.toLocaleString()}` : "••••••"}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-violet-100 bg-gradient-to-br from-violet-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-700">Active Accounts</CardTitle>
            <CreditCard className="h-4 w-4 text-violet-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{accounts.length}</div>
            <p className="text-xs text-gray-600">Across all account types</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts and Actions Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Accounts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Existing Account Cards */}
          {accounts.map((account, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-200 border border-gray-100 bg-white"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-50">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">{account.accountType}</CardTitle>
                      <p className="text-sm text-gray-500">••••{account.accountNumber.slice(-4)}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={accountTypeColors[account.accountType as keyof typeof accountTypeColors] || ""}
                  >
                    {account.accountType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Available Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {showBalances ? `₹${account.balance.toLocaleString()}` : "••••••••"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                      Transfer
                    </Button>
                    <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Account Card */}
          <Card className="group hover:shadow-lg transition-all duration-200 border-2 border-dashed border-purple-300 hover:border-purple-400 bg-white">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="p-4 rounded-full bg-purple-50 group-hover:bg-purple-100 transition-colors">
                <Plus className="h-6 w-6 text-purple-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Add New Account</h3>
                <p className="text-sm text-gray-500">Link a new bank account</p>
              </div>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="gap-2 w-full bg-purple-600 hover:bg-purple-700"
                variant={showForm ? "outline" : "default"}
              >
                <Plus className="h-4 w-4" />
                {showForm ? "Close Form" : "Add Account"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Account Form */}
      {showForm && (
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Add New Account</CardTitle>
            <p className="text-sm text-gray-500">Fill in the details below to add a new account to your dashboard</p>
          </CardHeader>
          <CardContent>
            <AddAccountForm />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
