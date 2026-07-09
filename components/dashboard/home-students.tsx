"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { useState, useCallback } from "react"
import type { Student } from "@/lib/types/student"
import { useSSE } from "@/hooks/use-sse"

interface HomeStudentsProps {
  initialStudents?: Student[]
}

export function HomeStudents({ initialStudents = [] }: HomeStudentsProps) {
  const [courseFilter, setCourseFilter] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // SSE event handler — only handles real-time updates
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
      console.log("SSE connection established")
    },
    onError: () => {
      setIsConnected(false)
      console.error("SSE connection error")
    },
    enabled: true,
  })

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "Fully Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "1st Installment":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "2nd Installment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "Not paid":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const updatePaymentStatus = async (index: number, status: string) => {
    const student = students[index]

    // Optimistic update
    setStudents(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], paymentStatus: status }
      return updated
    })

    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentStatus: status,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        // Revert on failure
        setStudents(prev => {
          const updated = [...prev]
          updated[index] = student
          return updated
        })
        console.error("Failed to update payment status")
      }
    } catch (error) {
      // Revert on error
      setStudents(prev => {
        const updated = [...prev]
        updated[index] = student
        return updated
      })
      console.error("Failed to update payment status:", error)
    }

    setOpenDropdown(null)
  }

  const filteredStudents = students.filter(student => {
    const matchCourse = !courseFilter ||
      (courseFilter === "fullstack" && student.course === "Full stack development") ||
      (courseFilter === "backend" && student.course === "Backend engineering")
    const matchPayment = !paymentFilter ||
      (paymentFilter === "fully_paid" && student.paymentStatus === "Fully Paid") ||
      (paymentFilter === "first_installment" && student.paymentStatus === "1st Installment") ||
      (paymentFilter === "second_installment" && student.paymentStatus === "2nd Installment") ||
      (paymentFilter === "not_paid" && student.paymentStatus === "Not paid")
    return matchCourse && matchPayment
  })

  const isFilterActive = courseFilter || paymentFilter

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-medium text-foreground">
              Student Records
            </CardTitle>
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
              title={isConnected ? "Connected (live)" : "Disconnected"}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            A centralized table for viewing, organizing, and managing student information and payment records.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Course</th>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Date Joined</th>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-xs text-muted-foreground">
                      {isFilterActive
                        ? "No students in this category match"
                        : students.length === 0
                          ? "No students registered yet."
                          : "No students in this category match"}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student.id} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                            <img src="/profile.jfif" alt={student.fullName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{student.fullName}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                            <p className="text-xs text-muted-foreground">{student.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-sm text-foreground">{student.course}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-xs text-muted-foreground">
                          {new Date(student.dateJoined).toLocaleDateString('en-NG', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit'
                          })}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(student.dateJoined).toLocaleString('en-NG', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                            timeZone: 'Africa/Lagos'
                          })}
                        </p>
                      </td>
                      <td className="py-3 relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(student.paymentStatus)}`}
                        >
                          {student.paymentStatus}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        {openDropdown === index && (
                          <div className="absolute z-10 mt-1 w-48 bg-card border border-border rounded-md shadow-lg">
                            <div className="py-1">
                              <button
                                onClick={() => updatePaymentStatus(index, "Fully Paid")}
                                className="block w-full text-left px-4 py-2 text-xs hover:bg-muted"
                              >
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                  Fully Paid
                                </span>
                              </button>
                              <button
                                onClick={() => updatePaymentStatus(index, "1st Installment")}
                                className="block w-full text-left px-4 py-2 text-xs hover:bg-muted"
                              >
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                  1st Installment
                                </span>
                              </button>
                              <button
                                onClick={() => updatePaymentStatus(index, "2nd Installment")}
                                className="block w-full text-left px-4 py-2 text-xs hover:bg-muted"
                              >
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                  2nd Installment
                                </span>
                              </button>
                              <button
                                onClick={() => updatePaymentStatus(index, "Not paid")}
                                className="block w-full text-left px-4 py-2 text-xs hover:bg-muted"
                              >
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                  Not Paid
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 cursor-pointer">
            View More
          </button>
        </div>
      </CardContent>
    </Card>
  )
}