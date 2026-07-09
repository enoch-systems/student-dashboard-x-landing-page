import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  isPositiveOutcome: boolean
  icon: LucideIcon
}

export function MetricCard({ title, value, change, isPositiveOutcome, icon: Icon }: MetricCardProps) {
  return (
    <Card className="bg-card border border-border cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-3 sm:p-4 lg:p-5">
        <div className="flex items-start justify-between mb-1 sm:mb-2 gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground truncate">{title}</span>
          <div className="p-1.5 sm:p-2 bg-muted rounded-lg shrink-0">
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          </div>
        </div>
        <p className="text-2xl sm:text-2xl lg:text-3xl font-semibold truncate">{value}</p>
      </CardContent>
    </Card>
  )
}