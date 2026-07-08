import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { full_name, email } = await request.json()

    if (!full_name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Normalize name: capitalize first letter of each word
    const normalizedName = full_name
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: normalizedName,
      },
    })

    return NextResponse.json({ 
      name: updated.name,
      message: "Profile updated successfully" 
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}