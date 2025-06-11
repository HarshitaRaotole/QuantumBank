"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardNav } from "@/components/dashboard-nav";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUsername("Guest");
          return;
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`;
        const response = await axios.get<{ user: { username: string } }>(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const name = response.data?.user?.username || "Guest";
        console.log("✅ Username from /me:", name);
        setUsername(name);
        localStorage.setItem("username", name);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUsername("Guest");
      }
    };

    const savedName = localStorage.getItem("username");
    if (savedName) {
      setUsername(savedName);
    } else {
      fetchUsername();
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#0E0F1C] text-white">
      <DashboardNav username={username} />
      <div className="flex-1 flex flex-col">
        <Header username={username} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
