"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownRight, ArrowRight, Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock transaction data
const transactions = [
  { id: 1, description: "Amazon", amount: -59.99, date: "2023-03-28", type: "expense", category: "Shopping" },
  { id: 2, description: "Salary", amount: 2750.0, date: "2023-03-27", type: "income", category: "Income" },
  { id: 3, description: "Grocery Store", amount: -123.45, date: "2023-03-23", type: "expense", category: "Food" },
  {
    id: 4,
    description: "Transfer to Savings",
    amount: -500.0,
    date: "2023-03-21",
    type: "transfer",
    category: "Transfer",
  },
  { id: 5, description: "Netflix", amount: -14.99, date: "2023-03-20", type: "expense", category: "Entertainment" },
  { id: 6, description: "Gas Station", amount: -45.5, date: "2023-03-18", type: "expense", category: "Transportation" },
  { id: 7, description: "Freelance Work", amount: 350.0, date: "2023-03-15", type: "income", category: "Income" },
  { id: 8, description: "Restaurant", amount: -85.2, date: "2023-03-12", type: "expense", category: "Food" },
  { id: 9, description: "Electric Bill", amount: -120.34, date: "2023-03-10", type: "expense", category: "Utilities" },
  {
    id: 10,
    description: "Transfer from Main",
    amount: 500.0,
    date: "2023-03-08",
    type: "transfer",
    category: "Transfer",
  },
  {
    id: 11,
    description: "Movie Tickets",
    amount: -32.5,
    date: "2023-03-05",
    type: "expense",
    category: "Entertainment",
  },
  { id: 12, description: "Pharmacy", amount: -28.75, date: "2023-03-03", type: "expense", category: "Health" },
  { id: 13, description: "Dividend Payment", amount: 12.33, date: "2023-03-01", type: "income", category: "Income" },
]

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())

    // Type filter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter

    // Date filter (simplified for demo)
    let matchesDate = true
    const transactionDate = new Date(transaction.date)
    const now = new Date()

    if (dateFilter === "thisMonth") {
      matchesDate = transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
    } else if (dateFilter === "lastMonth") {
      const lastMonth = new Date(now)
      lastMonth.setMonth(now.getMonth() - 1)
      matchesDate =
        transactionDate.getMonth() === lastMonth.getMonth() && transactionDate.getFullYear() === lastMonth.getFullYear()
    }

    return matchesSearch && matchesType && matchesDate
  })

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-muted-foreground">View and search your transaction history</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow down your transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                  <SelectItem value="transfer">Transfers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by date" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>{filteredTransactions.length} transactions found</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-full p-1 ${
                          transaction.type === "income"
                            ? "bg-emerald-100 text-emerald-700"
                            : transaction.type === "expense"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : transaction.type === "expense" ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <ArrowRight className="h-3 w-3" />
                        )}
                      </div>
                      {transaction.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.amount < 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
