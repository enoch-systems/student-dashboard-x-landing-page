"use client"

import { MetricCard } from "@/components/dashboard/metric-card"
import { PageHeader } from "@/components/dashboard/page-header"
import { HomeStudents } from "@/components/dashboard/home-students"
import { Calendar, DollarSign, Users } from "lucide-react"
import type { Student } from "@/lib/types/student"
import { useState, useEffect } from "react"
import { useStudents } from "@/contexts/students-context"

interface DashboardClientProps {
  initialStudents: Student[]
}

export function DashboardClient({ initialStudents }: DashboardClientProps) {
  const [timeRange, setTimeRange] = useState("week")
  const { students, setStudents, isConnected } = useStudents()

  useEffect(() => {
    if (initialStudents.length > 0) {
      setStudents(initialStudents)
    }
  }, [])

  const totalStudents = students.length
  const enrolledStudents = students.filter(
    (s) => s.paymentStatus === "Fully Paid" || s.paymentStatus === "1st Installment" || s.paymentStatus === "2nd Installment"
  ).length
  const fullyPaidStudents = students.filter((s) => s.paymentStatus === "Fully Paid").length
  const totalRevenue = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(fullyPaidStudents * 100000 + (enrolledStudents - fullyPaidStudents) * 50000)

  const getStudentsRegisteredThisRange = () => {
    if (students.length === 0) return 0
    const now = new Date()
    return students.filter((s) => {
      const joined = new Date(s.dateJoined)
      const diff = now.getTime() - joined.getTime()
      const days = diff / (1000 * 60 * 60 * 24)
      switch (timeRange) {
        case "day": return days <= 1
        case "week": return days <= 7
        case "month": return days <= 30
        default: return true
      }
    }).length
  }

  const firstName = "User"

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6">
        <PageHeader
          title={`Welcome, ${firstName} 👋`}
          description="Students Dashboard - Track your student enrollment, revenue, and performance metrics."
        />
        <div className="flex items-center gap-2 shrink-0 self-start">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
            title={isConnected ? "Live connected" : "Disconnected"}
          />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
        <MetricCard title="Total Students" value={String(totalStudents)} change="" isPositiveOutcome={true} icon={Users} />
        <MetricCard title="Enrolled" value={String(enrolledStudents)} change="" isPositiveOutcome={true} icon={Users} />
        <MetricCard title="Total Revenue" value={totalRevenue} change="" isPositiveOutcome={true} icon={DollarSign} />

        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 lg:p-5 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2 gap-1">
            <span className="text-xs sm:text-sm text-muted-foreground">Registered</span>
            <div className="p-1.5 sm:p-2 bg-muted rounded-lg shrink-0">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-semibold mb-2">
            {getStudentsRegisteredThisRange()}
          </p>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs font-medium bg-muted border border-border rounded px-2 py-1 cursor-pointer w-full"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bottom Row - Student Table */}
      <div className="grid grid-cols-1 gap-4">
        <div className="h-full">
          <HomeStudents />
        </div>
      </div>
    </>
  )
}