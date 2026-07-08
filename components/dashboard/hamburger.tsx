"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { navItems } from "@/components/dashboard/header"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X, Menu } from "lucide-react"
import Link from "next/link"

export function Hamburger() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [open])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <>
      <button
        className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setOpen(false)}
          />
          <div className="fixed top-0 left-0 z-[70] h-full w-full max-w-[280px] border-r border-border bg-background/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex items-center justify-between border-b border-border px-5 h-16">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <div className="flex flex-col gap-1">
                  <span className="sr-only">Beeyund Tech Hub</span>
                  <div className="w-5 h-0.5 bg-foreground" />
                  <div className="w-5 h-0.5 bg-foreground" />
                  <div className="w-3 h-0.5 bg-foreground" />
                </div>
                <span className="text-lg font-semibold tracking-tight">Beeyund Tech Hub</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full">
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
                  <Link href={item.href} onClick={() => setOpen(false)}>
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