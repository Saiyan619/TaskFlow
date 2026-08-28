import { AlertTriangle, CalendarDays, CheckCircle2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { type TaskDashboardSummary } from "@/features/tasks/types/task"
import { cn } from "@/lib/utils"

type TaskStatCardsProps = {
  summary: TaskDashboardSummary
}

const statCards = [
  {
    label: "Overdue",
    key: "overdue",
    icon: AlertTriangle,
    className: "from-muted to-red-100/70",
    iconClassName: "text-red-600",
  },
  {
    label: "Due Today",
    key: "dueToday",
    icon: CalendarDays,
    className: "from-muted via-violet-100 to-primary/25",
    iconClassName: "text-primary",
  },
  {
    label: "Completed",
    key: "completed",
    icon: CheckCircle2,
    className: "from-muted to-sky-100/70",
    iconClassName: "text-slate-600",
  },
] as const

export function TaskStatCards({ summary }: TaskStatCardsProps) {
  return (
    <section className="grid gap-3 md:grid-cols-3">
      {statCards.map((card) => (
        <Card
          key={card.key}
          className={cn(
            "min-h-[81px] rounded-md border-0 bg-gradient-to-r py-0 shadow-none ring-0",
            card.className,
          )}
        >
          <CardContent className="flex h-full flex-col justify-between p-3">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-foreground">
                {card.label}
              </p>
              <card.icon className={cn("size-[18px]", card.iconClassName)} />
            </div>
            <p className="text-[28px] font-bold leading-none tracking-normal text-foreground">
              {summary[card.key]}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
