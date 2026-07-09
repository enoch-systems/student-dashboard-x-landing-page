"use client"

import { useState, useCallback } from "react"
import { MetricCard } from "@/components/dashboard/metric-card"
import { PageHeader } from "@/components/dashboard/page-header"
import { HomeStudents } from "@/components/dashboard/home-students"
import { Calendar, DollarSign, Users, UserPlus } from "lucide-react"
import Link from "next/link"
import { useSSE } from "@/hooks/use-sse"
import type { Student } from "@/lib/types/student"

interface DashboardClientProps {
  initialStudents: Student[]
}

export function DashboardClient({ initialStudents }: DashboardClientProps) {
  const [timeRange, setTimeRange] = useState("week")
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [isConnected, setIsConnected] = useState(false)

  // SSE event handler — only handles real-time updates, no initial fetch needed
  const handleSSEMessage = useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data)

      switch (message.type) {
        case "student.created":
          setStudents((prev) => [message.data, ...prev])
          break

        case "student.updated":
          setStudents((prev) =>
            prev.map((student) =>
              student.id === message.data.id ? message.data : student
            )
          )
          break
      }
    } catch (error) {
      console.error("Failed to parse SSE message:", error)
    }
  }, [])

  useSSE("/api/students/events", {
    onMessage: handleSSEMessage,
    onOpen: () => {
      setIsConnected(true)
      console.log("SSE connection established on dashboard")
    },
    onError: () => {
      setIsConnected(false)
    },
    enabled: true,
  })

  // Compute metrics from real data
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
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title={`Welcome, ${firstName} 👋`}
          description="Students Dashboard - Track your student enrollment, revenue, and performance metrics."
        />
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
            title={isConnected ? "Live connected" : "Disconnected"}
          />
          <Link
            href="/#register"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Register Student
          </Link>
        </div>
      </div>

      {/* Metric Cards — rendered immediately from server data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Students" value={String(totalStudents)} change="" isPositiveOutcome={true} icon={Users} />
        <MetricCard title="Enrolled Students" value={String(enrolledStudents)} change="" isPositiveOutcome={true} icon={Users} />
        <MetricCard title="Total Revenue" value={totalRevenue} change="" isPositiveOutcome={true} icon={DollarSign} />

        <div className="bg-card border border-border rounded-lg p-5 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm text-muted-foreground">Students Registered</span>
            <div className="p-2 bg-muted rounded-lg">
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <p className="text-3xl font-semibold mb-2">
            {getStudentsRegisteredThisRange()}
          </p>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs font-medium bg-muted border border-border rounded px-2 py-1 cursor-pointer"
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
          <HomeStudents initialStudents={students} />
        </div>
      </div>
    </>
  )
}