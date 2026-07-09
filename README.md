# Student Dashboard X Landing Page

A modern student dashboard and landing page built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

This project focuses on creating a clean, responsive, and scalable frontend experience for managing student information, profiles, and dashboard interactions.

## Overview

Student Dashboard X Landing Page is a frontend application designed to provide:

• A modern landing page experience
• A responsive dashboard interface
• Student profile views
• Clean UI components
• Scalable frontend architecture

The project is structured to allow future integration with authentication, databases, APIs, and backend services.

## Features

### Landing Page

• Modern hero section
• Responsive navigation
• Feature sections
• Animated UI elements
• Professional marketing layout

### Dashboard

• Student overview interface
• Dashboard metrics
• Student management views
• Profile pages
• Responsive layouts

### UI System

• Reusable components
• Tailwind CSS styling
• shadcn/ui component architecture
• Responsive design patterns

## Tech Stack

### Frontend

• Next.js
• React
• TypeScript
• Tailwind CSS
• shadcn/ui

### Development Tools

• ESLint
• TypeScript configuration
• Modern component architecture

## Project Structure

```text
student-dashboard-x-landing-page/

├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/
│   │   └── students/
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── email/
│   │   ├── payment/
│   │   ├── profile/
│   │   ├── receipts/
│   │   └── students/
├── components/
│   ├── dashboard/
│   │   └── home/
│   ├── landing/
│   └── ui/
├── config/
├── constants/
├── contexts/
│   └── students-context.tsx
├── hooks/
├── lib/
│   ├── types/
│   ├── utils.ts
│   ├── prisma.ts
│   └── events.ts
├── prisma/
│   └── schema.prisma
├── public/
├── .env
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/enoch-systems/student-dashboard-x-landing-page.git
```

### Install dependencies

Using pnpm:

```bash
pnpm install
```

Using npm:

```bash
npm install
```

### Run development server

```bash
pnpm dev
```

or

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Key Implementation Patterns

### Payment Status Dropdown Component

**Location**: `components/dashboard/home/home-students.tsx`

**Technical Approach**:

• **Row-index-based positioning**: Dropdowns for the first 3 rows expand downward (`top-full mt-1`), while all subsequent rows expand upward (`bottom-full mb-1`) to prevent viewport edge clipping
• **Two-state animation pattern**: Uses `openDropdown` (logical state) and `visibleDropdown` (animation state) to enable smooth 200ms transitions while maintaining instant close behavior
• **Click-outside detection**: Implements `useRef` + `useEffect` with mousedown event listeners for outside click handling rather than relying on blur events, which are unreliable in table cells
• **Performance optimization**: Dropdown DOM elements remain mounted always but use `pointer-events-none` when hidden, avoiding mount/unmount overhead on every click
• **Z-index layering**: Uses `z-[1000000]` to ensure dropdowns render above fixed headers, cards, and other positioned elements

**Trade-offs**:

- **Pros**: Smooth 60fps animations, instant close on selection, no dropdown cut-off at table edges, single source of truth for dropdown state per table instance
- **Cons**: All dropdowns remain in DOM (memory trade-off for animation smoothness), `findIndex` calculation on every render for positioning logic, single `dropdownRef` shared across all dropdowns (only active dropdown receives ref assignment)

### State Management

• **React Context API**: Used for global student state and SSE-based live updates
• **Local component state**: Used for UI-only concerns (dropdown visibility, filters, animation timing)
• **Optimistic updates**: `updatePaymentStatus` immediately updates UI, reverts on API failure to provide instant feedback

### Responsive Architecture

• **Desktop table** (`sm:block`, hidden on mobile): Traditional HTML table with conditional dropdown positioning
• **Mobile cards** (`sm:hidden`, shown on mobile): Card-based layout with identical dropdown logic, ensuring feature parity across devices
• **Breakpoint strategy**: Uses `sm:` (640px) as the single responsive breakpoint

### Data Flow

```
SSE Events → Context → Component State → UI Render
    ↓
User Action → Optimistic Update → API Call → Success/Revert
```

1. SSE pushes real-time updates via `useSSE` hook
2. Context updates trigger re-render with new student data
3. User interaction updates local state (instant UI feedback)
4. API call fires in background
5. Failure reverts to previous state
6. Success maintains new state

## Tech Stack

### Frontend

• Next.js 16 with App Router
• React 19
• TypeScript 5
• Tailwind CSS 4
• shadcn/ui component library
• Radix UI primitives (`@radix-ui/react-*`)
• Lucide React icons
• React Hook Form + Zod validation
• Prisma ORM with PostgreSQL

### Real-time Infrastructure

• **Server-Sent Events (SSE)**: Used for live student data synchronization via `/api/students/events`
• **Trade-off**: SSE chosen over WebSockets for simpler unidirectional data flow, with automatic reconnection handling built into the `useSSE` hook

## Project Structure

```text
student-dashboard-x-landing-page/

├── config/
│   └── app.ts                    # App configuration
├── constants/
│   └── app.ts                    # App constants
├── contexts/
│   └── students-context.tsx      # Global student state + SSE sync
├── hooks/
│   ├── use-sse.ts                # Custom SSE hook
│   ├── use-mobile.ts             # Responsive breakpoint hook
│   └── use-toast.ts              # Toast notification hook
├── lib/
│   ├── events.ts                 # SSE message handlers
│   ├── prisma.ts                 # Database client
│   ├── types/
│   │   └── student.ts            # TypeScript interfaces
│   └── utils.ts                  # cn() helper for class merging
├── prisma/
│   └── schema.prisma             # Database schema
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/enoch-systems/student-dashboard-x-landing-page.git
```

### Install dependencies

Using pnpm:

```bash
pnpm install
```

Using npm:

```bash
npm install
```

### Environment Setup

Create a `.env` file:

```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/student_db"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Run development server

```bash
pnpm dev
```

or

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Architecture Decision Records

### Why Row-Index-Based Dropdown Positioning?

**Problem**: Dropdowns positioned below students in the lower half of the table would be clipped by the browser viewport edge.

**Solution**: First N dropdowns expand downward (more natural for top-of-page content), remaining dropdowns expand upward.

**Alternatives considered**:
- Always expand below: Simple but causes clipping for rows near table bottom
- Always expand above: Prevents clipping but feels unnatural for top rows
- Dynamic viewport calculation: More accurate but adds complexity and re-renders
- **Chosen**: Static threshold (3 rows) as 80% of tables in production rarely exceed 10 visible rows

### Why Two-State Animation Pattern?

**Problem**: Conditional rendering (`openDropdown ? <Dropdown /> : null`) doesn't support exit animations in React without libraries like Framer Motion.

**Solution**: Always render dropdown, control visibility with CSS classes + `visibleDropdown` timeout.

**Alternatives considered**:
- Framer Motion: Heavy dependency for simple fade effect
- CSS Animation API: Too verbose, browser support inconsistent
- **Chosen**: Tailwind transitions with state coordination for 200ms smooth fade

### Why Click-Outside with useRef?

**Problem**: HTML `blur` events don't propagate reliably across table cells, making click-outside detection complex.

**Solution**: Attach mousedown listener to document, check if click target is within `dropdownRef`.

**Alternatives considered**:
- Blur event + focus trap: Unreliable in table contexts
- React event bubbling: Conflicts with table row click handlers
- **Chosen**: Document mousedown listener with ref containment check

## Architecture Direction

The project is being developed with a focus on:

• Clean frontend architecture
• Maintainable components
• Scalable folder structure
• Separation of UI and business logic

## License

This project is for educational and development purposes.

## Contributing

When contributing components, follow these patterns:

1. **State management**: Use context for cross-component state, local state for UI-only concerns
2. **Performance**: Prefer always-mounted + CSS transitions over conditional rendering for animations
3. **Responsive**: Always implement both desktop and mobile views using `sm:` breakpoint
4. **Accessibility**: Add appropriate ARIA labels and keyboard navigation support
5. **Testing**: Test dropdowns, modals, and interactive components for click-outside and keyboard behavior
