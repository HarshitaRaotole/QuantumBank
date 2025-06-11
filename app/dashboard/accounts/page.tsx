"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Account {
  _id: string
  accountType: string
  accountNumber: string
  balance: number
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showBalances, setShowBalances] = useState(true)

  const accountTypeColors = {
    Savings: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Current: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    Credit: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  }

  const accountTypeIcons = {
    Savings: "💰",
    Current: "🏢",
    Credit: "💳",
  }

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("No token found. Please log in.")
        setLoading(false)
        return
      }

      try {
        const res = await fetch("http://localhost:5000/api/accounts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (res.ok) {
          setAccounts(data.accounts)
        } else {
          setError(data.message || "Failed to fetch accounts")
        }
      } catch (err) {
        setError("Something went wrong while fetching accounts")
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Accounts</h1>
          <p className="text-muted-foreground">Manage and view all your linked accounts</p>
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

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Accounts Grid */}
      {!loading && accounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card
              key={account._id}
              className="group hover:shadow-lg transition-all duration-200 border-0 bg-card/50 backdrop-blur"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {accountTypeIcons[account.accountType as keyof typeof accountTypeIcons] || "🏦"}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.accountType} Account</CardTitle>
                      <p className="text-sm text-muted-foreground">••••{account.accountNumber.slice(-4)}</p>
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
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-mono text-sm">{account.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-bold">
                      {showBalances ? `₹${account.balance.toLocaleString()}` : "••••••••"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && accounts.length === 0 && !error && (
        <Card className="border-2 border-dashed border-purple-300 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="p-4 rounded-full bg-purple-50">
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No accounts found</h3>
              <p className="text-muted-foreground">Add your first account to get started with managing your finances</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
