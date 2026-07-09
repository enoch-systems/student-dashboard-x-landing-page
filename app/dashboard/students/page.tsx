"use client"

import { useState, useEffect, useCallback } from "react"
import { PageHeader } from "@/components/dashboard/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, Eye, ChevronDown, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { Student } from "@/lib/types/student"
import { useSSE } from "@/hooks/use-sse"

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

const PAYMENT_OPTIONS = ["Fully Paid", "1st Installment", "2nd Installment", "Not paid"]

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [visiblePanel, setVisiblePanel] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 6

  useEffect(() => {
    async function fetchStudents() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/students")
        const result = await response.json()

        if (result.success) {
          setStudents(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch students:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])

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
          setSelectedStudent((prev) =>
            prev && prev.id === message.data.id ? message.data : prev
          )
          break
      }
    } catch (error) {
      console.error("Failed to parse SSE message:", error)
    }
  }, [])

  useSSE("/api/students/events", {
    onMessage: handleSSEMessage,
    onOpen: () => setIsConnected(true),
    onError: () => setIsConnected(false),
    enabled: true,
  })

  const updatePaymentStatus = async (studentId: string, status: string) => {
    const prevStudents = [...students]

    setStudents(prev =>
      prev.map((s) => (s.id === studentId ? { ...s, paymentStatus: status } : s))
    )

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: status }),
      })

      const result = await response.json()
      if (!result.success) setStudents(prevStudents)
    } catch {
      setStudents(prevStudents)
    }

    setOpenDropdown(null)
  }

  const totalStudents = students.length
  const enrolledStudents = students.filter(
    (s) => s.paymentStatus === "Fully Paid" || s.paymentStatus === "1st Installment" || s.paymentStatus === "2nd Installment"
  ).length
  const revenueUnits = students.reduce((acc, s) => {
    if (s.paymentStatus === "Fully Paid") return acc + 1
    if (s.paymentStatus === "1st Installment" || s.paymentStatus === "2nd Installment") return acc + 0.5
    return acc
  }, 0)

  const totalPages = Math.ceil(students.length / studentsPerPage)
  const startIndex = (currentPage - 1) * studentsPerPage
  const endIndex = startIndex + studentsPerPage
  const displayStudents = students.slice(startIndex, endIndex)

  return (
    <>
      <PageHeader
        title="Students Analytics"
        description="Track your student enrollment, courses, and performance metrics."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Card className="bg-card border border-border">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center justify-between mb-1 sm:mb-2 gap-1">
              <span className="text-xs sm:text-sm text-muted-foreground truncate">Total Students</span>
              <div className="p-1.5 sm:p-2 bg-muted rounded-lg shrink-0">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold">{totalStudents}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center justify-between mb-1 sm:mb-2 gap-1">
              <span className="text-xs sm:text-sm text-muted-foreground truncate">Enrolled</span>
              <div className="p-1.5 sm:p-2 bg-muted rounded-lg shrink-0">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold">{enrolledStudents}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center justify-between mb-1 sm:mb-2 gap-1">
              <span className="text-xs sm:text-sm text-muted-foreground truncate">Revenue</span>
              <div className="p-1.5 sm:p-2 bg-muted rounded-lg shrink-0">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold">{revenueUnits}</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Records */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm sm:text-base font-medium">Student Records & Tables</CardTitle>
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
              title={isConnected ? "Connected (live)" : "Disconnected"}
            />
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap">Name</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap">Course</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap">Date Joined</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap">Payment</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                              <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        </td>
                        <td className="py-3 px-2">
                          <div className="space-y-2">
                            <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
                        </td>
                        <td className="py-3 px-2">
                          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : displayStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                      No students registered yet.
                    </td>
                  </tr>
                ) : (
                  displayStudents.map((student) => (
                    <tr key={student.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
                            <img src="/profile.jfif" alt={student.fullName} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate max-w-[160px] lg:max-w-none">{student.fullName}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[160px] lg:max-w-none">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-muted-foreground truncate max-w-[100px] lg:max-w-none">{student.course}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground whitespace-nowrap">
                        <p className="text-xs">
                          {new Date(student.dateJoined).toLocaleDateString('en-NG', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(student.dateJoined).toLocaleString('en-NG', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos' })}
                        </p>
                      </td>
                      <td className="py-3 px-2 relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === student.id ? null : student.id)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(student.paymentStatus)}`}
                        >
                          <span className="truncate max-w-[70px]">{student.paymentStatus}</span>
                          <ChevronDown className="w-3 h-3 shrink-0" />
                        </button>
                        {openDropdown === student.id && (
                          <div className="absolute z-10 mt-1 w-44 bg-card border border-border rounded-md shadow-lg right-0">
                            <div className="py-1">
                              {PAYMENT_OPTIONS.map((status) => (
                                <button
                                  key={status}
                                  onClick={() => updatePaymentStatus(student.id, status)}
                                  className="block w-full text-left px-4 py-2 text-xs hover:bg-muted"
                                >
                                  <span className="inline-flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${
                                      status === "Fully Paid" ? "bg-green-500" :
                                      status === "1st Installment" ? "bg-yellow-500" :
                                      status === "2nd Installment" ? "bg-blue-500" : "bg-red-500"
                                    }`} />
                                    {status === "Not paid" ? "Not Paid" : status}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <Button variant="ghost" size="sm" className="h-8 gap-1 cursor-pointer text-xs" onClick={() => {
                          setSelectedStudent(student)
                          setTimeout(() => setVisiblePanel(true), 10)
                        }}>
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="sm:hidden space-y-2 px-3">
            {isLoading ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Loading students...</p>
            ) : displayStudents.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No students registered yet.</p>
            ) : (
              displayStudents.map((student) => (
                <div key={student.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                      <img src="/profile.jfif" alt={student.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{student.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                      <p className="text-xs text-foreground mt-1">{student.course}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(student.dateJoined).toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: '2-digit' })}
                        {' '}
                        {new Date(student.dateJoined).toLocaleString('en-NG', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos' })}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === `mobile-${student.id}` ? null : `mobile-${student.id}`)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(student.paymentStatus)}`}
                          >
                            <span className="truncate max-w-[70px]">{student.paymentStatus}</span>
                            <ChevronDown className="w-3 h-3 shrink-0" />
                          </button>
                          {openDropdown === `mobile-${student.id}` && (
                            <div className="absolute z-10 mt-1 w-44 bg-card border border-border rounded-md shadow-lg">
                              <div className="py-1">
                                {PAYMENT_OPTIONS.map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => updatePaymentStatus(student.id, status)}
                                    className="block w-full text-left px-4 py-2 text-xs hover:bg-muted"
                                  >
                                    <span className="inline-flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${
                                        status === "Fully Paid" ? "bg-green-500" :
                                        status === "1st Installment" ? "bg-yellow-500" :
                                        status === "2nd Installment" ? "bg-blue-500" : "bg-red-500"
                                      }`} />
                                      {status === "Not paid" ? "Not Paid" : status}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 cursor-pointer text-xs" onClick={() => {
                          setSelectedStudent(student)
                          setTimeout(() => setVisiblePanel(true), 10)
                        }}>
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 px-3 sm:px-6 pb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-8 px-3 text-xs"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 4) {
                  pageNum = i + 1
                } else if (currentPage <= 2) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 3 + i
                } else {
                  pageNum = currentPage - 1 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="h-8 w-8 p-0 text-xs"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-3 text-xs"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </Card>

      {/* Student Details Slide-out Panel - responsive */}
      {selectedStudent && (
        <>
          <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${visiblePanel ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={() => {
              setVisiblePanel(false)
              setTimeout(() => setSelectedStudent(null), 300)
            }}
          />
          <div 
            className={`fixed top-0 right-0 h-full w-full max-w-xs sm:max-w-sm lg:max-w-md bg-background border-l border-border shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ease-out ${visiblePanel ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold">Student Details</h2>
                <Button variant="ghost" size="icon" onClick={() => {
                  setVisiblePanel(false)
                  setTimeout(() => setSelectedStudent(null), 300)
                }} className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted overflow-hidden shrink-0">
                    <img src="/profile.jfif" alt={selectedStudent.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-medium truncate">{selectedStudent.fullName}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{selectedStudent.email}</p>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium break-words">{selectedStudent.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Course</p>
                    <p className="text-sm font-medium">{selectedStudent.course}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date Joined</p>
                    <p className="text-sm font-medium">
                      {new Date(selectedStudent.dateJoined).toLocaleDateString('en-NG', {
                        weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedStudent.dateJoined).toLocaleString('en-NG', {
                        hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPaymentColor(selectedStudent.paymentStatus)}`}>
                      {selectedStudent.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}