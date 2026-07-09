"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useSSE } from "@/hooks/use-sse"
import type { Student } from "@/lib/types/student"

interface StudentsContextType {
  students: Student[]
  setStudents: (students: Student[]) => void
  updatePaymentStatus: (studentId: string, status: string) => Promise<void>
  isConnected: boolean
}

const StudentsContext = createContext<StudentsContextType | null>(null)

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([])
  const [isConnected, setIsConnected] = useState(false)

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
    onOpen: () => setIsConnected(true),
    onError: () => setIsConnected(false),
    enabled: true,
  })

  const updatePaymentStatus = useCallback(async (studentId: string, status: string) => {
    const prevStudents = [...students]

    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, paymentStatus: status } : s))
    )

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: status }),
      })
      const result = await response.json()
      if (!result.success) {
        setStudents(prevStudents)
      }
    } catch {
      setStudents(prevStudents)
    }
  }, [students])

  return (
    <StudentsContext.Provider value={{ students, setStudents, updatePaymentStatus, isConnected }}>
      {children}
    </StudentsContext.Provider>
  )
}

export function useStudents() {
  const context = useContext(StudentsContext)
  if (!context) {
    throw new Error("useStudents must be used within a StudentsProvider")
  }
  return context
}