"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CheckCircle2 } from "lucide-react"

// Mock data
const accounts = [
  { id: "1", name: "Main Account", balance: 18450.25, number: "**** 4582" },
  { id: "2", name: "Savings", balance: 6130.27, number: "**** 7291" },
]

const contacts = [
  { id: "1", name: "Sarah Johnson", email: "sarah.j@example.com", accountNumber: "**** 1234" },
  { id: "2", name: "Michael Chen", email: "m.chen@example.com", accountNumber: "**** 5678" },
  { id: "3", name: "Emma Williams", email: "emma.w@example.com", accountNumber: "**** 9012" },
]

export default function TransferPage() {
  const [amount, setAmount] = useState("")
  const [fromAccount, setFromAccount] = useState("")
  const [toContact, setToContact] = useState("")
  const [toAccount, setToAccount] = useState("")
  const [note, setNote] = useState("")
  const [transferComplete, setTransferComplete] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setTransferComplete(true)
    }, 1500)
  }

  const resetForm = () => {
    setAmount("")
    setFromAccount("")
    setToContact("")
    setToAccount("")
    setNote("")
    setTransferComplete(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (transferComplete) {
    return (
      <div className="container mx-auto max-w-md py-12">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center space-y-2">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <CardTitle className="text-center text-2xl">Transfer Complete!</CardTitle>
              <CardDescription className="text-center">Your money is on its way</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{formatCurrency(Number.parseFloat(amount))}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">{accounts.find((a) => a.id === fromAccount)?.name || "Your account"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="font-medium">{contacts.find((c) => c.id === toContact)?.name || "Recipient"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={resetForm}>
              Make Another Transfer
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Transfer Money</h1>
        <p className="text-muted-foreground">Send money to your contacts or between your accounts</p>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">Send to Contact</TabsTrigger>
          <TabsTrigger value="between">Between Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <form onSubmit={handleTransfer}>
              <CardHeader>
                <CardTitle>Send Money</CardTitle>
                <CardDescription>Transfer money to friends, family, or businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-muted-foreground">$</span>
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from-account">From</Label>
                  <Select value={fromAccount} onValueChange={setFromAccount} required>
                    <SelectTrigger id="from-account">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({formatCurrency(account.balance)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to-contact">To</Label>
                  <Select value={toContact} onValueChange={setToContact} required>
                    <SelectTrigger id="to-contact">
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name} ({contact.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Input
                    id="note"
                    placeholder="What's this for?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : "Send Money"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="between">
          <Card>
            <form onSubmit={handleTransfer}>
              <CardHeader>
                <CardTitle>Transfer Between Accounts</CardTitle>
                <CardDescription>Move money between your own accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount-between">Amount</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-muted-foreground">$</span>
                    </div>
                    <Input
                      id="amount-between"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from-account-between">From</Label>
                  <Select value={fromAccount} onValueChange={setFromAccount} required>
                    <SelectTrigger id="from-account-between">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({formatCurrency(account.balance)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to-account">To</Label>
                  <Select value={toAccount} onValueChange={setToAccount} required>
                    <SelectTrigger id="to-account">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts
                        .filter((account) => account.id !== fromAccount)
                        .map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({formatCurrency(account.balance)})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note-between">Note (Optional)</Label>
                  <Input
                    id="note-between"
                    placeholder="What's this for?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : "Transfer Money"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
