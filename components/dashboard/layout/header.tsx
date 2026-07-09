"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Bell, ChevronDown, Sun, Moon, X, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Students", href: "/dashboard/students" },
  { label: "Payment", href: "/dashboard/payment" },
  { label: "Receipts", href: "/dashboard/receipts" },
  { label: "Email", href: "/dashboard/email" },
]

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const user = {
    name: "User",
    email: "user@example.com",
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false)
    }

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <header className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-2">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <button
            type="button"
            className="flex flex-col gap-1 md:hidden cursor-pointer p-1.5 shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              setMobileMenuOpen(true)
            }}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight truncate">
              Beeyund Academy
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center bg-card rounded-full px-1.5 py-1 border border-border overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-3 lg:px-4 py-1.5 text-xs lg:text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-9 sm:w-9">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {!mounted ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : theme === "light" ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 sm:gap-2 cursor-pointer outline-none focus:outline-none focus:ring-0">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-9">
                <AvatarImage src="/profile.jfif" />
                <AvatarFallback className="text-xs">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              <div className="hidden sm:block text-left max-w-[120px] lg:max-w-[160px]">
                <p className="text-xs sm:text-sm font-medium capitalize truncate">
                  {user.name}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground lowercase truncate">
                  {user.email}
                </p>
              </div>

              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground hidden sm:block shrink-0" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44 sm:w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Settings</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-destructive cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 z-50 h-full w-full max-w-[280px] border-l border-border bg-background/95 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 h-14">
              <Link
                href="/dashboard"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-base font-bold tracking-tight">
                  Beeyund Academy
                </span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-1 p-3">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "justify-start rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive(item.href) &&
                      "bg-black text-white dark:bg-white dark:text-black"
                  )}
                  asChild
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}