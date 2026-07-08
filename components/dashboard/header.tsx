"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { Bell, ChevronDown, Sun, Moon, X } from "lucide-react"
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
  const { data: session } = useSession()
  const [mounted, setMounted] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

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
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <button
              className={`flex flex-col gap-1 md:hidden cursor-pointer ${mobileMenuOpen ? "hidden" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                setMobileMenuOpen(true)
              }}
              aria-label="Open menu"
            >
              <div className="w-5 h-0.5 bg-foreground" />
              <div className="w-5 h-0.5 bg-foreground" />
              <div className="w-3 h-0.5 bg-foreground" />
            </button>
            <div className="hidden md:flex flex-col gap-1">
              <div className="w-5 h-0.5 bg-foreground" />
              <div className="w-5 h-0.5 bg-foreground" />
              <div className="w-3 h-0.5 bg-foreground" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight">Beeyund Academy</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center bg-card rounded-full px-2 py-1.5 border border-border">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="w-5 h-5" />
          </Button>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 cursor-pointer outline-none focus:outline-none focus:ring-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/profile.jfif" />
                  <AvatarFallback>
                    {session?.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium capitalize">
                    {session?.user?.name
                      ?.split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(" ") || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground lowercase">
                    {session?.user?.email?.toLowerCase() || ""}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
     
      {/* Mobile menu overlay */}
      <div className="fixed inset-0 z-40 md:hidden">
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className={`fixed top-0 left-0 z-[70] h-full w-full max-w-[280px] border-r border-border bg-background/95 backdrop-blur-xl shadow-2xl transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
            <div className="flex items-center justify-between border-b border-border px-5 h-16">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-bold tracking-tight">Beeyund Academy</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex flex-col gap-1 p-3">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "justify-start rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive(item.href) && "bg-black text-white dark:bg-white dark:text-black"
                  )}
                  asChild
                >
                  <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
    </>
  )
}