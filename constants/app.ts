/**
 * Global app constants.
 * Add API endpoints, feature flags, app-wide enums, etc. here.
 */

export const APP_NAME = "Beeyund Academy"

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  DASHBOARD_STUDENTS: "/dashboard/students",
  DASHBOARD_PAYMENT: "/dashboard/payment",
  DASHBOARD_RECEIPTS: "/dashboard/receipts",
  DASHBOARD_EMAIL: "/dashboard/email",
  DASHBOARD_PROFILE: "/dashboard/profile",
} as const

export const PAYMENT_STATUSES = [
  "Fully Paid",
  "1st Installment",
  "2nd Installment",
  "Not paid",
] as const

export const TIME_RANGES = ["day", "week", "month"] as const