"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Download } from "lucide-react" // Import Download icon

interface Transaction {
  _id: string
  date: string // This field is pre-formatted in backend, but we'll use createdAt for full timestamp
  description: string
  amount: number
  type: "Credit" | "Debit" | "Transfer"
  relatedAccount?: string
  relatedAccountUsername?: string
  createdAt: string // Use this for full date and time
  account: {
    // Added to reflect populated account data
    _id: string // Ensure _id is available for comparison
    accountNumber: string
    accountType: string
  }
}

interface Account {
  _id: string
  accountType: string
  accountNumber: string
  balance: number
}

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const accountId = searchParams.get("accountId")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        // 1. Fetch account details if accountId is present
        if (accountId) {
          const accountRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/${accountId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (!accountRes.ok) {
            const errorData = await accountRes.json()
            throw new Error(errorData.message || "Failed to fetch account details")
          }
          const accountData = await accountRes.json()
          setAccount(accountData.account)
        }

        // 2. Fetch transactions
        const transactionsUrl = accountId
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions?accountId=${accountId}`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions`

        const transactionsRes = await fetch(transactionsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!transactionsRes.ok) {
          const errorData = await transactionsRes.json()
          throw new Error(errorData.message || "Failed to fetch transactions")
        }

        const data = await transactionsRes.json()
        setTransactions(data.transactions)
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message || "Could not load transaction history.")
        if (err.message.includes("Unauthorized") || err.message.includes("token")) {
          router.push("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, accountId])

  const handleDownloadCsv = () => {
    if (transactions.length === 0) {
      alert("No transactions to download.")
      return
    }

    const headers = [
      "Transaction ID",
      "Date & Time",
      "Description",
      "Amount",
      "Type",
      "My Account Number",
      "Related Account",
      "Account Holder",
    ]

    const csvRows = transactions.map((txn) => {
      const myAccountNumber = txn.account?.accountNumber || "N/A"
      const amountFormatted = txn.amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      })
      const dateTime = new Date(txn.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })

      return [
        `"${txn._id.slice(-6)}"`, // Wrap in quotes to ensure ID is treated as string
        `"${dateTime}"`,
        `"${txn.description || "N/A"}"`,
        `"${amountFormatted}"`, // This formatted string includes the Rupee symbol and is quoted
        `"${txn.type}"`,
        `"${myAccountNumber}"`,
        `"${txn.relatedAccount || "N/A"}"`,
        `"${txn.relatedAccountUsername || "N/A"}"`,
      ].join(",")
    })

    const csvContent = [headers.join(","), ...csvRows].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `quantum_bank_transactions_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden" // Hide the link
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) // Clean up
    URL.revokeObjectURL(url) // Free up memory
  }

  // Simplified page title
  const pageTitle = "Transaction History"

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-2">
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-4 w-64" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto border border-gray-200 bg-white text-gray-900">
        <CardHeader>
          <CardTitle>Error Loading Transactions</CardTitle>
          <CardDescription className="text-gray-600">
            There was an issue fetching your transaction history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section - Matching Dashboard Style */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {" "}
          {/* Added justify-between here */}
          <div>
            {" "}
            {/* This div wraps the back button, title, and description */}
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="gap-2 bg-purple-600 hover:bg-purple-700 border-purple-600 text-white hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{pageTitle}</h1>
            {account && ( // Show account details if a specific account is selected
              <p className="text-gray-600">
                For {account.accountType} Account ({account.accountNumber.slice(-4)})
              </p>
            )}
            <p className="text-gray-600">View your recent transactions and account activity.</p>
          </div>
          {/* Download Button moved to the right */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCsv}
            className="gap-2 bg-green-600 hover:bg-green-700 border-green-600 text-white hover:text-white self-start" // self-start aligns it to the top right
            disabled={transactions.length === 0}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto border border-purple-100 bg-white text-gray-900 shadow-sm">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription className="text-gray-600">A detailed list of all your financial movements.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No transactions found for your accounts.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-gray-900">ID</TableHead>
                    <TableHead className="text-gray-900">Date & Time</TableHead>
                    <TableHead className="text-gray-900">Description</TableHead>
                    <TableHead className="text-right text-gray-900">Amount</TableHead>
                    <TableHead className="text-gray-900">Type</TableHead>
                    <TableHead className="text-gray-900">My Account</TableHead>
                    <TableHead className="text-gray-900">Related Account</TableHead>
                    <TableHead className="text-gray-900">Account Holder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow
                      key={transaction._id}
                      className={
                        accountId && transaction.account?._id === accountId
                          ? "bg-purple-100 hover:bg-purple-200" // Updated highlight color
                          : "" // Default row styling
                      }
                    >
                      <TableCell className="font-medium text-gray-900">{transaction._id.slice(-6)}</TableCell>
                      <TableCell className="text-gray-900">
                        {new Date(transaction.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </TableCell>
                      <TableCell className="text-gray-900">{transaction.description || "N/A"}</TableCell>
                      <TableCell
                        className={`text-right ${transaction.type === "Credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.amount.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </TableCell>
                      <TableCell className="text-gray-900">{transaction.type}</TableCell>
                      <TableCell className="text-gray-900">{transaction.account?.accountNumber || "N/A"}</TableCell>
                      <TableCell className="text-gray-900">{transaction.relatedAccount || "N/A"}</TableCell>
                      <TableCell className="text-gray-900">{transaction.relatedAccountUsername || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
