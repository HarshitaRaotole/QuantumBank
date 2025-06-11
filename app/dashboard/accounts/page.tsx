"use client";
import { useEffect, useState } from "react";

interface Account {
  _id: string;
  accountType: string;
  accountNumber: string;
  balance: number;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/accounts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setAccounts(data.accounts);
        } else {
          setError(data.message || "Failed to fetch accounts");
        }
      } catch (err) {
        setError("Something went wrong while fetching accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Your Accounts</h1>

      {loading && <p>Loading accounts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && accounts.length > 0 && (
        <ul className="space-y-4">
          {accounts.map((account) => (
            <li key={account._id} className="bg-gray-800 p-4 rounded-lg shadow">
              <p><strong>Type:</strong> {account.accountType}</p>
              <p><strong>Number:</strong> {account.accountNumber}</p>
              <p><strong>Balance:</strong> ₹{account.balance.toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}

      {!loading && accounts.length === 0 && !error && (
        <p>No accounts found. Add one to get started!</p>
      )}
    </div>
  );
}
