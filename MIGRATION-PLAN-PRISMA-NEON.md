# Migration Plan: Hardcoded Data → Prisma + Neon Database

## Overview

This document outlines the step-by-step migration from hardcoded student data in the dashboard to a proper database-backed system using **Prisma** (ORM) with **Neon** (serverless PostgreSQL).

---

## Step 1: Install Prisma & Neon Dependencies

```bash
pnpm add @prisma/client
pnpm add -D prisma
```

---

## Step 2: Set Up Neon Database

1. Go to [neon.tech](https://neon.tech) and create a free account.
2. Create a new project (e.g., `beeyund-students`).
3. Copy the **connection string** — it looks like:
   ```
   postgresql://user:password@ep-snowy-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Create a `.env` file in the project root and add:
   ```
   DATABASE_URL="postgresql://user:password@ep-snowy-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

---

## Step 3: Initialize Prisma

```bash
pnpm prisma init
```

This creates:
- `prisma/schema.prisma` — the schema file
- Sets `DATABASE_URL` in `.env` (already done above)

---

## Step 4: Define the Database Model

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Student {
  id            String   @id @default(cuid())
  fullName      String
  email         String   @unique
  phone         String
  course        String
  dateJoined    DateTime @default(now())
  timeJoined    String   // Store as "HH:MM AM/PM" string
  paymentStatus String   @default("Not paid")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Explanation of fields:
| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | Auto-generated unique ID |
| `fullName` | String | Student's full name |
| `email` | String (unique) | Email address |
| `phone` | String | Phone number |
| `course` | String | Course path chosen |
| `dateJoined` | DateTime | Auto-set to current date/time on creation |
| `timeJoined` | String | Separate time string (auto-captured) |
| `paymentStatus` | String | Default: "Not paid" |
| `createdAt` | DateTime | Record creation timestamp |
| `updatedAt` | DateTime | Auto-updated on changes |

---

## Step 5: Generate Prisma Client

```bash
pnpm prisma generate
```

Then push the schema to Neon:

```bash
pnpm prisma db push
```

---

## Step 6: Create Prisma Client Singleton

### `lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

This ensures a single Prisma client instance during development (avoids hot-reload connection leaks).

---

## Step 7: Create API Routes

### 7a. POST `/app/api/students/route.ts` — Create a new student

```typescript
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
        dateJoined: new Date(),
        timeJoined: new Date().toLocaleString("en-NG", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Africa/Lagos",
        }),
        paymentStatus: "Not paid",
      },
    })

    return NextResponse.json({ success: true, data: student }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create student" },
      { status: 500 }
    )
  }
}
```

### 7b. GET `/app/api/students/route.ts` — Fetch all students

```typescript
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { dateJoined: "desc" },
    })
    return NextResponse.json({ success: true, data: students })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}
```

### 7c. PATCH `/app/api/students/[id]/route.ts` — Update payment status

```typescript
// app/api/students/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { paymentStatus } = body

    const student = await prisma.student.update({
      where: { id: params.id },
      data: { paymentStatus },
    })

    return NextResponse.json({ success: true, data: student })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update student" },
      { status: 500 }
    )
  }
}
```

---

## Step 8: Build the Registration Form

### New component: `components/dashboard/student-registration-form.tsx`

This form collects:
- **Full Name** — text input
- **Email Address** — email input
- **Phone Number** — phone input (`+234 123 456 7890` pattern)
- **Choose Your Path** — dropdown/select (e.g., "Full Stack Development", "Backend Engineering")
- **Date Joined** — auto-set (not user-editable)
- **Payment Status** — auto-set to "Not paid" (hidden, default)

No submit button for "Paid" statuses — that's done in the table dropdown.

### Form submission flow:
1. User fills out name, email, phone, selects course
2. Click "Register Student"
3. POST request to `/api/students`
4. On success, refresh the student table to show new entry

---

## Step 9: Refactor `HomeStudents` Component

Replace the hardcoded `initialStudents` array with data fetched from the database.

### Changes to `components/dashboard/home-students.tsx`:

- Delete the `initialStudents` constant array
- Replace with a `useEffect` + `fetch("/api/students")` to load data
- Pass student `id` to the payment status update function
- Update payment status via `PATCH /api/students/[id]`
- Remove manual state management for student list

---

## Step 10: Update the Dashboard Page

### Changes to `app/dashboard/page.tsx`:

- Add the **Student Registration Form** component above the `HomeStudents` table
- Pass a refresh callback so the table re-fetches after a new registration

### Updated layout:

```
┌──────────────────────────────────────┐
│         Welcome, User 👋             │
│  Students Dashboard - Track your...   │
├──────────┬──────────┬──────────┬──────┤
│  Total   │ Enrolled │ Revenue  │Reg'd │
│ Students │ Students │          │      │
├──────────┴──────────┴──────────┴──────┤
│       Student Registration Form       │
├──────────────────────────────────────┤
│    Students / Record / Not Performing │
│ ┌──────┬────────┬────────┬─────────┐ │
│ │ Name │ Course │ Joined │ Payment │ │
│ ├──────┼────────┼────────┼─────────┤ │
│ │ ...  │ ...    │ ...    │ ...     │ │
│ └──────┴────────┴────────┴─────────┘ │
└──────────────────────────────────────┘
```

---

## Step 11: Deletion Plan for Hardcoded Data

After database integration is complete:

1. **Remove** the `initialStudents` array from `home-students.tsx`
2. **Remove** all hardcoded student data imports/constants
3. **Remove** `useState` for students (replace with fetched data)
4. The component should become **fully data-driven**

---

## Database Schema Diagram

```
┌─────────────────────────────┐
│          Student            │
├─────────────────────────────┤
│ id           String (PK)    │  ← Auto-generated CUID
│ fullName     String         │  ← From registration form
│ email        String (unique)│  ← From registration form
│ phone        String         │  ← From registration form
│ course       String         │  ← Chosen from dropdown
│ dateJoined   DateTime       │  ← Auto-set on creation
│ timeJoined   String         │  ← Auto-captured
│ paymentStatus String        │  ← Default: "Not paid"
│ createdAt    DateTime       │  ← Timestamp
│ updatedAt    DateTime       │  ← Auto-updated
└─────────────────────────────┘
```

---

## Recommended Implementation Order

| Step | Task | Status |
|------|------|--------|
| 1 | Install Prisma + Neon dependencies | ⬜ |
| 2 | Set up Neon project & get connection string | ⬜ |
| 3 | Create `.env` with `DATABASE_URL` | ⬜ |
| 4 | Run `prisma init` & define schema | ⬜ |
| 5 | Run `prisma db push` to create tables | ⬜ |
| 6 | Create `lib/prisma.ts` singleton | ⬜ |
| 7 | Create API routes (GET, POST, PATCH) | ⬜ |
| 8 | Build Student Registration Form | ⬜ |
| 9 | Refactor `HomeStudents` to use DB | ⬜ |
| 10 | Update Dashboard layout | ⬜ |
| 11 | Delete hardcoded data | ⬜ |
| 12 | Test full flow end-to-end | ⬜ |

---

## Key Notes

- **Neon** is serverless PostgreSQL — it auto-scales and has a free tier
- **Prisma** provides type safety — the generated client will give TypeScript types for all queries
- **Date/Time**: `dateJoined` is a full `DateTime` field; `timeJoined` stores the Africa/Lagos time string separately for display
- **Default Payment Status**: Always "Not paid" on registration; admins change it via the dropdown in the table
- No authentication is required for the dashboard in this phase (can be added later with NextAuth)