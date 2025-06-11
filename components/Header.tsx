"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setUsername(data.user.username);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  const initial = username ? username.charAt(0).toUpperCase() : "?";

  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-white/20 bg-[#1A1C2C]">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      <div className="flex items-center gap-3 border border-white px-4 py-2 rounded-md">
        <div className="w-6 h-6 rounded-full bg-white text-black font-semibold flex items-center justify-center">
          {initial}
        </div>
        <span className="text-white capitalize">{username || "User"}</span>
      </div>
    </div>
  );
}
