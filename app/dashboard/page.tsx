"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, Wallet, ArrowRight, Bell } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for demonstration
const mockAccountData = {
  name: "John Doe",
  totalBalance: 24580.52,
  accounts: [
    { id: 1, name: "Main Account", balance: 18450.25, number: "**** 4582" },
    { id: 2, name: "Savings", balance: 6130.27, number: "**** 7291" },
  ],
  recentTransactions: [
    { id: 1, description: "Amazon", amount: -59.99, date: "Today", type: "expense" },
    { id: 2, description: "Salary", amount: 2750.0, date: "Yesterday", type: "income" },
    { id: 3, description: "Grocery Store", amount: -123.45, date: "Mar 23", type: "expense" },
    { id: 4, description: "Transfer to Savings", amount: -500.0, date: "Mar 21", type: "transfer" },
    { id: 5, description: "Netflix", amount: -14.99, date: "Mar 20", type: "expense" },
  ],
  insights: [
    { category: "Food & Dining", amount: 420.32, percentage: 28 },
    { category: "Shopping", amount: 215.75, percentage: 14 },
    { category: "Transportation", amount: 350.0, percentage: 23 },
    { category: "Entertainment", amount: 185.5, percentage: 12 },
    { category: "Other", amount: 350.43, percentage: 23 },
  ],
}

export default function DashboardPage() {
  const [userData, setUserData] = useState(mockAccountData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
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
              <p className="text-sm text-muted-foreground">john.doe@example.com</p>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {userData.name.split(" ")[0]}</p>
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
              <div className="text-2xl font-bold">{formatCurrency(userData.accounts[1].balance)}</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
        </div>

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
                <Button variant="outline">
                  <Link href="/dashboard/accounts/new">Get Started</Link>
                </Button>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your last 5 transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-full p-2 ${
                            transaction.type === "income"
                              ? "bg-emerald-100 text-emerald-700"
                              : transaction.type === "expense"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : transaction.type === "expense" ? (
                            <ArrowDownRight className="h-4 w-4" />
                          ) : (
                            <ArrowRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          transaction.amount < 0 ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {transaction.amount < 0 ? "-" : "+"}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/transactions">
                      View All Transactions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending Breakdown</CardTitle>
                <CardDescription>Your spending by category this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.insights.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{category.category}</p>
                        <p className="text-sm font-medium">{formatCurrency(category.amount)}</p>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${category.percentage}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground">{category.percentage}% of total spending</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/analytics">
                      View Detailed Analytics
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
