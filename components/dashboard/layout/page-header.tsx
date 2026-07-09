import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-semibold truncate">{title}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
      </div>
      {children && <div className="flex items-center gap-3 flex-shrink-0">{children}</div>}
    </div>
  )
}