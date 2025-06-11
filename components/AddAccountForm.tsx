import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddAccountForm() {
  const [accountType, setAccountType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get JWT from localStorage

    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
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
          balance: parseFloat(balance),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account added successfully");
        setAccountType("");
        setAccountNumber("");
        setBalance("");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Account Type"
        value={accountType}
        onChange={(e) => setAccountType(e.target.value)}
      />
      <Input
        placeholder="Account Number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />
      <Input
        placeholder="Balance"
        type="number"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
      />
      <Button type="submit" className="bg-green-600 hover:bg-green-700">
        Submit
      </Button>
    </form>
  );
}
