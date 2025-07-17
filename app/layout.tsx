import type React from "react";
import type { Metadata } from "next";
import ClientLayout from "@/app/ClientLayout"; // Absolute alias import

// Server-only metadata
export const metadata: Metadata = {
  title: "Quantum Bank - Smart Banking",
  description: "Next-generation banking platform with intelligent financial management",
  verification: {
    google: "3T-VEgkMPYgdFK78bQS7urxLls42WHaL9s2megIXzdc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientLayout>{children}</ClientLayout>;
}
