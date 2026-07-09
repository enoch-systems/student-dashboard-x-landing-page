import { prisma } from "@/lib/prisma"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const students = await prisma.student.findMany({
    orderBy: {
      dateJoined: "desc",
    },
  })

  const serialized = students.map((s) => ({
    ...s,
    dateJoined: s.dateJoined.toISOString(),
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }))

  return <DashboardClient initialStudents={serialized} />
}