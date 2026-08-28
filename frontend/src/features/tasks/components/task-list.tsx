import { ListTodo } from "lucide-react"

import { type taskResponse, useGetTasks } from "../api/tasks-api"
import { type Task, type TaskPriority, type TaskStatus } from "../types/task"
import { TaskTable } from "./task-table"

function mapApiTask(task: taskResponse): Task {
  const dueDate = task.dueDate ? new Date(task.dueDate) : undefined
  const dueDateLabel = dueDate && !Number.isNaN(dueDate.getTime())
    ? dueDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "No due date"

  return {
    id: task.id,
    name: task.title,
    status: toDisplayStatus(task.status),
    dueDateLabel,
    dueDateTone: "default",
    priority: toDisplayPriority(task.priority),
  }
}


export function TaskList() {
  const { tasks: apiTasks, isLoading, isError, error, refetch } = useGetTasks()

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
        <div className="h-[355px] animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-card p-6 text-sm shadow-sm ring-1 ring-border">
        <h1 className="font-semibold">Unable to load tasks</h1>
        <p className="mt-2 text-muted-foreground">{error instanceof Error ? error.message : "Please try again."}</p>
        <button type="button" onClick={() => void refetch()} className="mt-4 text-primary underline underline-offset-4">Try again</button>
      </div>
    )
  }

  const tasks = apiTasks.map(mapApiTask)

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.08em] text-primary">
            <ListTodo className="size-4" /> Task Workspace
          </p>
          <h1 className="mt-2 text-[25px] font-bold leading-none tracking-tight">My Tasks</h1>
          <p className="mt-2 text-[11px] text-muted-foreground">Keep track of your work and what needs attention next.</p>
        </div>
        <span className="hidden text-[10px] text-muted-foreground sm:block">{tasks.length} total tasks</span>
      </header>
      <TaskTable tasks={tasks} total={tasks.length} />
    </div>
  )
}

function toDisplayStatus(status?: string): TaskStatus {
  if (status === "IN-PROGRESS" || status === "in-progress") return "in-progress"
  if (status === "COMPLETED" || status === "completed") return "completed"
  return "pending"
}

function toDisplayPriority(priority?: string): TaskPriority {
  if (priority === "HIGH" || priority === "high") return "high"
  if (priority === "LOW" || priority === "low") return "low"
  return "medium"
}