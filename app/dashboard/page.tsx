"use client"

import { useState } from "react"
import { MetricCard } from "@/components/dashboard/metric-card"
import { PageHeader } from "@/components/dashboard/page-header"
import { HomeStudents } from "@/components/dashboard/home-students"
import { Calendar, DollarSign, Users } from "lucide-react"

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("week")
  
  const firstName = "User"
  
  return (
    <>
      <PageHeader
        title={`Welcome, ${firstName} 👋`}
        description="Students Dashboard - Track your student enrollment, revenue, and performance metrics."
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Students" value="200" change="" isPositiveOutcome={true} icon={Users} />
        <MetricCard title="Enrolled Students" value="40" change="" isPositiveOutcome={true} icon={Users} />
        <MetricCard title="Total Revenue" value="₦400,263" change="" isPositiveOutcome={true} icon={DollarSign} />
      
        {/* Students Registered with Dropdown */}
        <div className="bg-card border border-border rounded-lg p-5 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm text-muted-foreground">Students Registered</span>
            <div className="p-2 bg-muted rounded-lg">
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <p className="text-3xl font-semibold mb-2">0</p>
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
           <HomeStudents />
         </div>
       </div>
    </>
  )
}