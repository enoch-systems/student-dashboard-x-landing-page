import type { ReactNode } from "react"
import { Header } from "@/components/dashboard/header"
import { ThemeProvider } from "@/components/theme-provider"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          <Header />
          {children}
        </div>
      </div>

    </ThemeProvider>

  )
}