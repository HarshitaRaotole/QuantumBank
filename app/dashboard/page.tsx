"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddAccountForm from "@/components/AddAccountForm";

interface Account {
  accountType: string;
  accountNumber: string;
  balance: number;
}

export default function Dashboard() {
  const [user, setUser] = useState({ username: "", email: "" });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser({
          username: data.username,
          email: data.email,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setAccounts(data.accounts || []);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchUser();
    fetchAccounts();
  }, []);

  return (
    <div className="h-screen bg-gray-900 text-white">
      <main className="p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}</h1>

        {/* Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {accounts.map((account, index) => (
            <Card key={index} className="bg-gray-800 border border-gray-600">
              <CardContent className="p-4 space-y-2">
                <CardTitle className="text-lg font-semibold">
                  {account.accountType} Account
                </CardTitle>
                <p>Account No: {account.accountNumber}</p>
                <p>Balance: ₹{account.balance}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Account and Send Money */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <Card className="border-dashed border-2 border-gray-600 col-span-2">
            <CardContent className="p-4 flex flex-col justify-center items-center">
              <div className="h-12 w-12 rounded-full border border-gray-400 flex items-center justify-center mb-2">
                💳
              </div>
              <CardTitle className="text-center">Add New Account</CardTitle>
              <p className="text-xs text-gray-400 text-center mt-1">
                Link a new bank account or create a virtual account
              </p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Close Form" : "Add Account"}
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="w-full h-full bg-purple-500 hover:bg-purple-600 text-white">
              Send Money
            </Button>
          </div>
        </section>

        {/* Show Account Form Conditionally */}
        {showForm && (
          <div className="mt-6">
            <AddAccountForm />
          </div>
        )}
      </main>
    </div>
  );
}
