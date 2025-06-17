"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, AlertCircle, CreditCard, CheckCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Account {
  accountType: string
  accountNumber: string
  balance: number
}

export default function TransferPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [fromAccount, setFromAccount] = useState("")
  const [toAccountNumber, setToAccountNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedAccount = searchParams.get("fromAccount")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchAccounts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Check if response is JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API endpoint not available. Please set up your backend first.")
        }

        const data = await response.json()

        if (data.accounts) {
          setAccounts(data.accounts)

          // Pre-select the account if coming from dashboard
          if (preSelectedAccount) {
            const selectedAcc = data.accounts.find((acc: Account) => acc.accountNumber === preSelectedAccount)
            if (selectedAcc) {
              setFromAccount(selectedAcc.accountNumber)
            }
          }
        } else {
          setError("No accounts found")
        }
      } catch (error) {
        console.error("Failed to fetch accounts:", error)
        setError("Unable to load accounts. Please ensure your backend API is running.")
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [router, preSelectedAccount])

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    setError("")

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromAccountNumber: fromAccount,
          toAccountNumber: toAccountNumber,
          amount: Number.parseFloat(amount),
          description,
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Transfer API not available. Please set up your backend transfer endpoint.")
      }

      const result = await response.json()

      if (response.ok) {
        setMessage("Transfer completed successfully!")
        // Reset form
        setFromAccount(preSelectedAccount || "")
        setToAccountNumber("")
        setAmount("")
        setDescription("")

        // Redirect back to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(result.error || "Transfer failed")
      }
    } catch (error) {
      console.error("Transfer error:", error)
      setError("Transfer failed. Please ensure your backend API is running and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedFromAccount = accounts.find((acc) => acc.accountNumber === fromAccount)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section - Matching Dashboard Style */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Transfer Money</h1>
            <p className="text-gray-600">Send money between your accounts securely and instantly.</p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Card className="border border-red-200 bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {message && (
        <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-700 font-medium">{message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Transfer Section */}
      <div className="max-w-4xl mx-auto">
        {/* Transfer Form */}
        <Card className="border border-purple-100 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Transfer Details</CardTitle>
            <CardDescription className="text-gray-600">Fill in the details below to transfer money.</CardDescription>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 && !error ? (
              <div className="text-center py-8">
                <div className="p-4 rounded-full bg-purple-50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-gray-500 mb-4">No accounts available for transfer.</p>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <form onSubmit={handleTransfer} className="space-y-6">
                {/* Account Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="fromAccount" className="text-sm font-medium text-gray-900">
                      From Account
                    </Label>
                    <Select value={fromAccount} onValueChange={setFromAccount}>
                      <SelectTrigger className="h-12 bg-white text-black border-gray-300">
                        <SelectValue placeholder="Select source account" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {accounts.map((account) => (
                          <SelectItem key={account.accountNumber} value={account.accountNumber}>
                            <div className="flex items-center gap-3 py-2">
                              <div className="p-2 rounded-lg bg-purple-50">
                                <CreditCard className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <div className="font-medium text-black">
                                  {account.accountType} - ••••{account.accountNumber.slice(-4)}
                                </div>
                                <div className="text-sm text-gray-500">₹{account.balance.toLocaleString()}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="toAccountNumber" className="text-sm font-medium text-gray-900">
                      To Account Number
                    </Label>
                    <Input
                      id="toAccountNumber"
                      type="text"
                      value={toAccountNumber}
                      onChange={(e) => setToAccountNumber(e.target.value)}
                      placeholder="Enter destination account number"
                      className="h-12 bg-white text-black border-gray-300"
                      required
                    />
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-900">
                    Transfer Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-500 font-medium">₹</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-8 h-12 text-lg bg-white text-black border-gray-300"
                      required
                    />
                  </div>
                  {selectedFromAccount && amount && Number.parseFloat(amount) > selectedFromAccount.balance && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>Insufficient funds. Available: ₹{selectedFromAccount.balance.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter transfer description or note..."
                    rows={3}
                    className="resize-none bg-white text-black border-gray-300"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => router.push("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium"
                    disabled={
                      isLoading ||
                      !fromAccount ||
                      !toAccountNumber ||
                      !amount ||
                      (selectedFromAccount && Number.parseFloat(amount) > selectedFromAccount.balance) ||
                      accounts.length === 0
                    }
                  >
                    {isLoading ? "Processing Transfer..." : "Transfer Money"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600">Enter the exact account number of the recipient</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600">Double-check account details before confirming</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600">You'll receive a confirmation once transfer is complete</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
