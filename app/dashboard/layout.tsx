import type { ReactNode } from "react"
import { Header } from "@/components/dashboard/header"
import { ThemeProvider } from "@/components/theme-provider"
import { StudentsProvider } from "@/contexts/students-context"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-[1400px] mx-auto">
          <Header />
          <StudentsProvider>
            {children}
          </StudentsProvider>
        </div>
      </div>

    </ThemeProvider>

  )
}
