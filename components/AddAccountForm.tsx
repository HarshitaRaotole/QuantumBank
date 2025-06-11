"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Loader2 } from "lucide-react"

export default function AddAccountForm() {
  const [accountType, setAccountType] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [balance, setBalance] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem("token") // Get JWT from localStorage

    if (!token) {
      alert("User not authenticated. Please log in.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 Send token
        },
        body: JSON.stringify({
          accountType,
          accountNumber,
          balance: Number.parseFloat(balance),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Account added successfully")
        setAccountType("")
        setAccountNumber("")
        setBalance("")
      } else {
        alert(data.error || "Something went wrong")
      }
    } catch (err) {
      console.error("Network error:", err)
      alert("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="accountType" className="text-sm font-medium text-gray-700">
          Account Type
        </Label>
        <Select onValueChange={setAccountType} required>
          <SelectTrigger className="h-11 bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-gray-900">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Savings">Savings Account</SelectItem>
            <SelectItem value="Current">Current Account</SelectItem>
            <SelectItem value="Credit">Credit Account</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
          Account Number
        </Label>
        <Input
          id="accountNumber"
          placeholder="Enter account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="h-11 bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-gray-900"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="balance" className="text-sm font-medium text-gray-700">
          Initial Balance
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
          <Input
            id="balance"
            placeholder="0.00"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="h-11 pl-8 bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-gray-900"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 gap-2 bg-purple-600 hover:bg-purple-700 text-white"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Adding Account...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            Add Account
          </>
        )}
      </Button>
    </form>
  )
}
