export type TaskStatus = "pending" | "in-progress" | "completed"

export type TaskPriority = "low" | "medium" | "high"

export type Task = {
  id: string
  name: string
  status: TaskStatus
  dueDateLabel: string
  dueDateTone: "danger" | "muted" | "default"
  priority: TaskPriority
}

export type TaskDashboardSummary = {
  overdue: number
  dueToday: number
  completed: number
  total: number
}
