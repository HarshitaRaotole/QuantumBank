"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, Wallet, Bell } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight } from "lucide-react"

type Account = {
  id: number
  name: string
  balance: number
  number: string
}

type Transaction = {
  id: number
  description: string
  amount: number
  date: string
  type: "income" | "expense" | "transfer"
}

type Insight = {
  category: string
  amount: number
  percentage: number
}

type UserData = {
  name: string
  email: string
  totalBalance: number
  accounts: Account[]
  recentTransactions: Transaction[]
  insights: Insight[]
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No auth token found. Please login.")
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data: UserData = await res.json()
        setUserData(data)
      } catch (err: any) {
        setError(err.message || "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading dashboard...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>
  }

  if (!userData) {
    return <div className="p-8 text-center">No user data available.</div>
  }

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex flex-1 items-center justify-end gap-4 md:ml-auto md:gap-6">
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt={userData.name} />
              <AvatarFallback>
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium leading-none">{userData.name}</p>
              <p className="text-sm text-muted-foreground">{userData.email || "N/A"}</p>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/dashboard/transfer">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Send Money
              </Link>
            </Button>
            <Button variant="outline">
              <ArrowDownRight className="mr-2 h-4 w-4" />
              Request Money
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(userData.totalBalance)}</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Income</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(2750)}</div>
              <p className="text-xs text-muted-foreground">+0.0% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(1523.67)}</div>
              <p className="text-xs text-muted-foreground">-4.3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(userData.accounts[1]?.balance || 0)}</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="insights">Financial Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userData.accounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(account.balance)}</div>
                    <p className="text-xs text-muted-foreground">{account.number}</p>
                  </CardContent>
                </Card>
              ))}

              <Card className="flex flex-col items-center justify-center p-8">
                <div className="mb-4 rounded-full border border-dashed p-4">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Add New Account</h3>
                <p className="mb-4 text-center text-sm text-muted-foreground">
                  Link a new bank account or create a virtual account
                </p>
                <Button variant="outline" className="w-full">
                  Add Account
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="divide-y divide-border rounded-md border">
              {userData.recentTransactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between space-x-4 p-4">
                  <div>
                    <p className="font-medium">{txn.description}</p>
                    <p className="text-xs text-muted-foreground">{txn.date}</p>
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      txn.type === "income"
                        ? "text-emerald-500"
                        : txn.type === "expense"
                        ? "text-rose-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {txn.amount < 0 ? "-" : "+"}
                    {formatCurrency(Math.abs(txn.amount))}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>Percentage spent by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {userData.insights.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No insights available.</p>
                  ) : (
                    userData.insights.map((insight, index) => (
                      <div key={`${insight.category}-${index}`} className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{insight.category}</p>
                        <p className="text-sm font-semibold">
                          {formatCurrency(insight.amount || 0)} ({insight.percentage ?? 0}%)
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
