import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { redirect } from "next/navigation"

export type Role = "admin" | "manager" | "user" | "viewer"

const roleHierarchy: Record<Role, number> = {
  viewer: 1,
  user: 2,
  manager: 3,
  admin: 4,
}

/**
 * Get the current server-side session.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

/**
 * Require a minimum role to access a page.
 * Redirects to /login if not authenticated, or to /dashboard if not authorized.
 */
export async function requireRole(minRole: Role) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const userRole = (session.user.role as Role) ?? "user"
  if (roleHierarchy[userRole] < roleHierarchy[minRole]) {
    redirect("/dashboard")
  }

  return session.user
}