import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { broadcast } from "@/lib/events"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { paymentStatus } = body

    const student = await prisma.student.update({
      where: {
        id,
      },
      data: {
        paymentStatus,
      },
    })
    broadcast({
      type: "student.updated",
      data: student,
    })
    return NextResponse.json({
      success: true,
      data: student,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update payment status",
      },
      {
        status: 500,
      }
    )
  }
}