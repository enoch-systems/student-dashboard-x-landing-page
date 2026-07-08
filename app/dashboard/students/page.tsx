"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, Eye } from "lucide-react"
import { ChevronDown } from "lucide-react"

const initialStudents = [
  {
    id: 1,
    name: "John Okafor",
    email: "john.okafor@example.com",
    phone: "+234 801 234 5678",
    course: "Full stack development",
    joined: "2024-01-15",
    paymentStatus: "Fully Paid",
    address: "123 Main St, Lagos",
    guardian: "Mr. Okafor",
  },
  {
    id: 2,
    name: "Sarah Adeyemi",
    email: "sarah.adeyemi@example.com",
    phone: "+234 802 345 6789",
    course: "Backend engineering",
    joined: "2024-01-14",
    paymentStatus: "1st Installment",
    address: "456 Oak Ave, Abuja",
    guardian: "Mrs. Adeyemi",
  },
  {
    id: 3,
    name: "Michael Chenwe",
    email: "michael.chenwe@example.com",
    phone: "+234 803 456 7890",
    course: "Full stack development",
    joined: "2024-01-13",
    paymentStatus: "2nd Installment",
    address: "789 Pine St, Port Harcourt",
    guardian: "Mr. Chenwe",
  },
  {
    id: 4,
    name: "Aisha Bello",
    email: "aisha.bello@example.com",
    phone: "+234 804 567 8901",
    course: "Backend engineering",
    joined: "2024-01-12",
    paymentStatus: "Not paid",
    address: "321 Elm St, Lagos",
    guardian: "Mrs. Bello",
  },
  {
    id: 5,
    name: "Emmanuel Nwosu",
    email: "emmanuel.nwosu@example.com",
    phone: "+234 805 678 9012",
    course: "Full stack development",
    joined: "2024-01-11",
    paymentStatus: "Not paid",
    address: "654 Maple Dr, Abuja",
    guardian: "Mr. Nwosu",
  },
]

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

export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  const updatePaymentStatus = (index: number, status: string) => {
    setStudents(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], paymentStatus: status }
      return updated
    })
    setOpenDropdown(null)
  }

  return (
    <>
      <PageHeader
        title="Students Analytics"
        description="Track your student enrollment, courses, and performance metrics."
      />

      {/* Students Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-card border border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Students</span>
              <div className="p-2 bg-muted rounded-lg">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-3xl font-semibold">200</p>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Enrolled Students</span>
              <div className="p-2 bg-muted rounded-lg">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-3xl font-semibold">40</p>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Revenue</span>
              <div className="p-2 bg-muted rounded-lg">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-3xl font-semibold">₦400,263</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Records Table */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Student Records & Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Course</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date Joined</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Payment Status</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map((student, index) => (
                  <tr key={student.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                          <img src="/profile.jfif" alt={student.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">{student.course}</td>
                     <td className="py-3 px-2 text-sm text-muted-foreground">
                       <p className="text-xs">
                         {new Date(student.joined).toLocaleDateString('en-NG', {
                           weekday: 'long',
                           day: '2-digit',
                           month: 'short',
                           year: 'numeric'
                         })}
                       </p>
                       <p className="text-[10px] text-muted-foreground">
                         {new Date(student.joined + 'T12:00:00').toLocaleString('en-NG', {
                           hour: 'numeric',
                           minute: '2-digit',
                           hour12: true,
                           timeZone: 'Africa/Lagos'
                         })}
                       </p>
                     </td>
                    <td className="py-3 px-2 relative">
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
                            <button onClick={() => updatePaymentStatus(index, "Fully Paid")} className="block w-full text-left px-4 py-2 text-xs hover:bg-muted">
                              <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Fully Paid</span>
                            </button>
                            <button onClick={() => updatePaymentStatus(index, "1st Installment")} className="block w-full text-left px-4 py-2 text-xs hover:bg-muted">
                              <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>1st Installment</span>
                            </button>
                            <button onClick={() => updatePaymentStatus(index, "2nd Installment")} className="block w-full text-left px-4 py-2 text-xs hover:bg-muted">
                              <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>2nd Installment</span>
                            </button>
                            <button onClick={() => updatePaymentStatus(index, "Not paid")} className="block w-full text-left px-4 py-2 text-xs hover:bg-muted">
                              <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span>Not Paid</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <Button variant="ghost" size="sm" className="h-8 gap-1 cursor-pointer" onClick={() => setSelectedStudent(student)}>
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Student Details Slide-out Panel */}
      {selectedStudent && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setSelectedStudent(null)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Student Details</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedStudent(null)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted overflow-hidden">
                    <img src="/profile.jfif" alt={selectedStudent.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{selectedStudent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{selectedStudent.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Course</p>
                    <p className="text-sm font-medium">{selectedStudent.course}</p>
                  </div>
                   <div>
                     <p className="text-sm text-muted-foreground">Date Joined</p>
                     <p className="text-sm font-medium">
                       {new Date(selectedStudent.joined).toLocaleDateString('en-NG', {
                         weekday: 'long',
                         day: '2-digit',
                         month: 'short',
                         year: 'numeric'
                       })}
                     </p>
                     <p className="text-xs text-muted-foreground">
                       {new Date(selectedStudent.joined + 'T12:00:00').toLocaleString('en-NG', {
                         hour: 'numeric',
                         minute: '2-digit',
                         hour12: true,
                         timeZone: 'Africa/Lagos'
                       })}
                     </p>
                   </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(selectedStudent.paymentStatus)}`}>
                      {selectedStudent.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="text-sm font-medium">{selectedStudent.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guardian</p>
                    <p className="text-sm font-medium">{selectedStudent.guardian}</p>
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