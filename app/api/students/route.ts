import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { broadcast } from "@/lib/events"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { fullName, email, phone, course } = body

    const student = await prisma.student.create({
      data: {
        fullName,
        email,
        phone,
        course,
      },
    })

  broadcast(student)
  
    return NextResponse.json(
      { success: true, data: student },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { success: false, error: "Failed to create student" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        dateJoined: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: students,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { success: false, error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}