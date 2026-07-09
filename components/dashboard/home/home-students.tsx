"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useStudents } from "@/contexts/students-context"
import Link from "next/link"

export function HomeStudents() {
  const [courseFilter, setCourseFilter] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null)
  const { students, isConnected, updatePaymentStatus } = useStudents()
  const dropdownRef = useRef<HTMLDivElement>(null)

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
  const displayStudents = filteredStudents.slice(0, 7)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
        setVisibleDropdown(null)
      }
    }

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdown])

  useEffect(() => {
    if (openDropdown) {
      setVisibleDropdown(openDropdown)
    } else {
      const timer = setTimeout(() => setVisibleDropdown(null), 200)
      return () => clearTimeout(timer)
    }
  }, [openDropdown])

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm sm:text-base font-medium text-foreground">
              Student Records
            </CardTitle>
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
              title={isConnected ? "Connected (live)" : "Disconnected"}
            />
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
            A centralized table for viewing, organizing, and managing student information and payment records.
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        {/* ===== DESKTOP TABLE (sm and up) ===== */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-3 whitespace-nowrap">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-3 whitespace-nowrap">Course</th>
                <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-3 whitespace-nowrap">Date Joined</th>
                <th className="text-left text-xs font-medium text-muted-foreground pb-3 whitespace-nowrap">Payment Status</th>
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
                displayStudents.map((student) => (
                  <tr key={student.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
                          <img src="/profile.jfif" alt={student.fullName} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{student.fullName}</p>
                          <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                          <p className="text-xs text-muted-foreground truncate">{student.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="text-sm text-foreground truncate max-w-[120px] lg:max-w-none">{student.course}</p>
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      <p className="text-xs text-muted-foreground">
                        {new Date(student.dateJoined).toLocaleDateString('en-NG', {
                          weekday: 'short',
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
                        onClick={() => setOpenDropdown(openDropdown === student.id ? null : student.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(student.paymentStatus)}`}
                      >
                        {student.paymentStatus}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <div 
                        ref={visibleDropdown === student.id ? dropdownRef : null}
                        className={`absolute ${filteredStudents.findIndex(s => s.id === student.id) < 3 ? "top-full mt-1" : "bottom-full mb-1"} right-0 z-[1000000] w-48 bg-card border border-border rounded-md shadow-lg transition-all duration-200 ease-out ${
                          visibleDropdown === student.id
                            ? "opacity-100 scale-100 translate-y-0"
                            : `opacity-0 pointer-events-none scale-95 ${filteredStudents.findIndex(s => s.id === student.id) < 3 ? "translate-y-[-4px]" : "translate-y-[4px]"}`
                        }`}
                      >
                        <div className="py-1">
                          {["Fully Paid", "1st Installment", "2nd Installment", "Not paid"].map((status) => (
                              <button
                                key={status}
                                onClick={() => {
                                  setOpenDropdown(null);
                                  updatePaymentStatus(student.id, status);
                                }}
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE CARDS (< sm) ===== */}
        <div className="sm:hidden space-y-2 px-3">
          {displayStudents.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              {isFilterActive
                ? "No students in this category match"
                : students.length === 0
                  ? "No students registered yet."
                  : "No students in this category match"}
            </p>
          ) : displayStudents.length < filteredStudents.length ? (
            <>
              {displayStudents.map((student) => (
                <div key={student.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                      <img src="/profile.jfif" alt={student.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{student.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                      <p className="text-xs text-muted-foreground">{student.phone}</p>
                      <p className="text-xs text-foreground mt-1">{student.course}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(student.dateJoined).toLocaleDateString('en-NG', {
                          weekday: 'short',
                          month: 'short',
                          day: '2-digit'
                        })}
                        {' '}
                        {new Date(student.dateJoined).toLocaleString('en-NG', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: 'Africa/Lagos'
                        })}
                      </p>
                    </div>
                    <div className="relative shrink-0">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === `mobile-${student.id}` ? null : `mobile-${student.id}`)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(student.paymentStatus)}`}
                      >
                        <span className="truncate max-w-[70px]">{student.paymentStatus}</span>
                        <ChevronDown className="w-3 h-3 shrink-0" />
                      </button>
                      {openDropdown === `mobile-${student.id}` && (
                        <div className="absolute z-10 mt-1 w-44 bg-card border border-border rounded-md shadow-lg right-0">
                          <div className="py-1">
                            {["Fully Paid", "1st Installment", "2nd Installment", "Not paid"].map((status) => (
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
                  </div>
                </div>
              ))}
              {filteredStudents.length > 7 && (
                <div className="mt-3 text-center">
                  <Link 
                    href="/dashboard/students" 
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 cursor-pointer"
                  >
                    View All
                  </Link>
                </div>
              )}
            </>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.id} className="border border-border rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                    <img src="/profile.jfif" alt={student.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{student.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                    <p className="text-xs text-muted-foreground">{student.phone}</p>
                    <p className="text-xs text-foreground mt-1">{student.course}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(student.dateJoined).toLocaleDateString('en-NG', {
                        weekday: 'short',
                        month: 'short',
                        day: '2-digit'
                      })}
                      {' '}
                      {new Date(student.dateJoined).toLocaleString('en-NG', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'Africa/Lagos'
                      })}
                    </p>
                  </div>
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === `mobile-${student.id}` ? null : `mobile-${student.id}`)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(student.paymentStatus)}`}
                    >
                      <span className="truncate max-w-[70px]">{student.paymentStatus}</span>
                      <ChevronDown className="w-3 h-3 shrink-0" />
                    </button>
                    <div 
                      ref={visibleDropdown === `mobile-${student.id}` ? dropdownRef : null}
                      className={`absolute ${filteredStudents.findIndex(s => s.id === student.id) < 3 ? "top-full mt-1" : "bottom-full mb-1"} right-0 z-[1000000] w-44 bg-card border border-border rounded-md shadow-lg transition-all duration-200 ease-out ${
                        visibleDropdown === `mobile-${student.id}`
                          ? "opacity-100 scale-100 translate-y-0"
                          : `opacity-0 pointer-events-none scale-95 ${filteredStudents.findIndex(s => s.id === student.id) < 3 ? "translate-y-[-4px]" : "translate-y-[4px]"}`
                      }`}
                    >
                      <div className="py-1">
                        {["Fully Paid", "1st Installment", "2nd Installment", "Not paid"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setOpenDropdown(null);
                              updatePaymentStatus(student.id, status);
                            }}
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
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredStudents.length > 7 && (
          <div className="mt-4 text-center pb-3 sm:pb-0">
            <Link 
              href="/dashboard/students" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 cursor-pointer"
            >
              View All
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}