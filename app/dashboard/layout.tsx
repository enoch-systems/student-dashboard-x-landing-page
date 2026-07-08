import type { ReactNode } from "react"
import { Header } from "@/components/dashboard/header"
import { requireRole } from "@/lib/auth"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireRole("user")

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        <Header />
        {children}
      </div>
    </div>
  )
}