"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Transactions", href: "/dashboard/transactions", icon: Clock },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardNav({ username }: { username: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Navigation */}
      <div className="flex items-center md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex items-center gap-2 pb-4 pt-2 w-full">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Quantum Bank</span>
            </div>
            <nav className="flex flex-col gap-2 py-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}

              {/* Logout in mobile nav */}
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Quantum Bank</span>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden h-screen w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-4 justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Quantum Bank</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto p-4 flex flex-col justify-between">
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </div>

          {/* Logout pinned to bottom-left */}
          <div className="pt-4 border-t border-muted">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
