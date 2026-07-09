"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const data = [
  { month: "Jan", sales: 25000, revenue: 20000 },
  { month: "Feb", sales: 35000, revenue: 28000 },
  { month: "Mar", sales: 30000, revenue: 25000 },
  { month: "Apr", sales: 45000, revenue: 38000 },
  { month: "May", sales: 73940, revenue: 63773 },
  { month: "Jun", sales: 55000, revenue: 48000 },
  { month: "Jul", sales: 40000, revenue: 35000 },
  { month: "Aug", sales: 48000, revenue: 42000 },
  { month: "Sep", sales: 52000, revenue: 45000 },
  { month: "Oct", sales: 38000, revenue: 32000 },
  { month: "Nov", sales: 42000, revenue: 36000 },
  { month: "Dec", sales: 50000, revenue: 44000 },
]

const salesColors = {
  light: { default: "#e5e5e5", highlight: "#d4d4d4" },
  dark: { default: "#525252", highlight: "#737373" },
}

const revenueColors = {
  light: { default: "#fdba74", highlight: "#f97316" },
  dark: { default: "#fb923c", highlight: "#ea580c" },
}

export function ProfitChart() {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && theme === "dark"
  const sColors = isDark ? salesColors.dark : salesColors.light
  const rColors = isDark ? revenueColors.dark : revenueColors.light

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-medium text-foreground">Total Profit Overview</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-semibold text-foreground">₦998,643.24</span>
            <span className="text-xs bg-[var(--color-accent)]/30 text-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
              +8.4%
              <span className="text-[10px]">↗</span>
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: isDark ? "#737373" : "#a3a3a3" }} />
            <span className="text-xs text-muted-foreground">Total Students</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: isDark ? "#fb923c" : "#f97316" }} />
            <span className="text-xs text-muted-foreground">Total Revenue</span>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#404040" : "#e5e5e5"} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? "#a3a3a3" : "#737373" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: isDark ? "#a3a3a3" : "#737373" }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#262626" : "#1a1a1a",
                  border: "none",
                  borderRadius: "8px",
                  color: isDark ? "#f5f5f5" : "#fff",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [
                  name === "sales" ? value.toLocaleString() : `₦${value.toLocaleString()}`,
                  name === "sales" ? "Students" : "Revenue",
                ]}
                labelFormatter={(label) => `${label} 2026`}
              />
              <Bar dataKey="sales" radius={[4, 4, 0, 0]} maxBarSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`sales-${index}`} fill={entry.month === "May" ? sColors.highlight : sColors.default} />
                ))}
              </Bar>
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`revenue-${index}`} fill={entry.month === "May" ? rColors.highlight : rColors.default} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}