import { TaskStatCards } from "./task-stat-cards"
import { TaskTable } from "./task-table"
import { useTaskDashboard } from "../hooks/use-task-dashboard"

export function TaskDashboard() {
  const { data, isLoading } = useTaskDashboard()

  if (isLoading || !data) {
    return (
      <div className="space-y-[18px]">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="h-[135px] animate-pulse rounded-lg bg-muted" />
          <div className="h-[135px] animate-pulse rounded-lg bg-muted" />
          <div className="h-[135px] animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-[355px] animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-[18px]">
      <TaskStatCards summary={data.summary} />
      <TaskTable tasks={data.tasks} total={data.summary.total} />
    </div>
  )
}
