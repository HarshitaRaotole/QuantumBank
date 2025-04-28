"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"

// Mock data for charts and analytics
const spendingByCategory = [
  { category: "Food & Dining", amount: 420.32, percentage: 28, previousPercentage: 25, trend: "up" },
  { category: "Shopping", amount: 215.75, percentage: 14, previousPercentage: 18, trend: "down" },
  { category: "Transportation", amount: 350.0, percentage: 23, previousPercentage: 20, trend: "up" },
  { category: "Entertainment", amount: 185.5, percentage: 12, previousPercentage: 15, trend: "down" },
  { category: "Utilities", amount: 195.43, percentage: 13, previousPercentage: 12, trend: "up" },
  { category: "Other", amount: 155.0, percentage: 10, previousPercentage: 10, trend: "neutral" },
]

const monthlySpending = [
  { month: "Jan", amount: 1250.45 },
  { month: "Feb", amount: 1345.87 },
  { month: "Mar", amount: 1522.0 },
]

const incomeVsExpenses = [
  { month: "Jan", income: 2750.0, expenses: 1250.45 },
  { month: "Feb", income: 2750.0, expenses: 1345.87 },
  { month: "Mar", income: 2750.0, expenses: 1522.0 },
]

const savingsGoals = [
  { name: "Emergency Fund", current: 3500, target: 10000, percentage: 35 },
  { name: "Vacation", current: 1200, target: 2500, percentage: 48 },
  { name: "New Car", current: 5000, target: 15000, percentage: 33 },
]

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("3months")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Financial Analytics</h1>
          <p className="text-muted-foreground">Insights into your financial health</p>
        </div>
        <div className="mt-4 flex items-center gap-2 md:mt-0">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <DollarSign className="mr-2 h-4 w-4" />
            Budget
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(8250)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">+0.5%</span> from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(4118.32)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-rose-500" />
              <span className="text-rose-500">+4.3%</span> from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50.1%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-rose-500" />
              <span className="text-rose-500">-2.4%</span> from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="spending" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="income">Income vs Expenses</TabsTrigger>
          <TabsTrigger value="savings">Savings Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="spending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>How your spending is distributed across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {spendingByCategory.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category.category}</span>
                        {category.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-rose-500" />
                        ) : category.trend === "down" ? (
                          <TrendingDown className="h-4 w-4 text-emerald-500" />
                        ) : null}
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(category.amount)}</span>
                        <span className="ml-2 text-muted-foreground">({category.percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${category.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trend</CardTitle>
              <CardDescription>Your spending over the past months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <div className="flex h-full items-end gap-2">
                  {monthlySpending.map((month, index) => {
                    const height = (month.amount / 2000) * 100
                    return (
                      <div key={index} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full rounded-t-md bg-primary" style={{ height: `${height}%` }} />
                        <div className="text-sm font-medium">{month.month}</div>
                        <div className="text-xs text-muted-foreground">{formatCurrency(month.amount)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>Compare your income and expenses over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <div className="flex h-full items-end gap-8">
                  {incomeVsExpenses.map((month, index) => {
                    const incomeHeight = (month.income / 3000) * 100
                    const expensesHeight = (month.expenses / 3000) * 100
                    return (
                      <div key={index} className="flex flex-1 items-end gap-2">
                        <div className="flex w-full flex-1 flex-col items-center gap-2">
                          <div className="w-full rounded-t-md bg-emerald-500" style={{ height: `${incomeHeight}%` }} />
                          <div className="text-xs text-muted-foreground">{formatCurrency(month.income)}</div>
                        </div>
                        <div className="flex w-full flex-1 flex-col items-center gap-2">
                          <div className="w-full rounded-t-md bg-rose-500" style={{ height: `${expensesHeight}%` }} />
                          <div className="text-xs text-muted-foreground">{formatCurrency(month.expenses)}</div>
                        </div>
                        <div className="absolute bottom-0 text-sm font-medium">{month.month}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Savings</CardTitle>
              <CardDescription>How much you're saving each month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <div className="flex h-full items-end gap-2">
                  {incomeVsExpenses.map((month, index) => {
                    const savings = month.income - month.expenses
                    const height = (savings / 2000) * 100
                    return (
                      <div key={index} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full rounded-t-md bg-blue-500" style={{ height: `${height}%` }} />
                        <div className="text-sm font-medium">{month.month}</div>
                        <div className="text-xs text-muted-foreground">{formatCurrency(savings)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Savings Goals</CardTitle>
              <CardDescription>Track your progress towards your financial goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {savingsGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{goal.name}</span>
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(goal.current)}</span>
                        <span className="text-muted-foreground"> / {formatCurrency(goal.target)}</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${goal.percentage}%` }} />
                    </div>
                    <div className="text-xs text-muted-foreground">{goal.percentage}% complete</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projected Growth</CardTitle>
              <CardDescription>How your savings will grow over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-muted/50 flex items-center justify-center">
                <p className="text-muted-foreground">Savings projection chart would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
