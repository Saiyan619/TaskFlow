import { ChevronLeft, ChevronRight, Clock3 } from "lucide-react"
import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type Task, type TaskPriority, type TaskStatus } from "@/features/tasks/types/task"
import { cn } from "@/lib/utils"

type TaskTableProps = {
  tasks: Task[]
  total: number
}

const statusLabel: Record<TaskStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
}

const statusClassName: Record<TaskStatus, string> = {
  pending: "bg-violet-100 text-slate-700",
  "in-progress": "bg-blue-100 text-slate-700",
  completed: "bg-zinc-100 text-muted-foreground",
}

const priorityClassName: Record<TaskPriority, string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-orange-700 text-white",
  high: "bg-red-100 text-red-700",
}

export function TaskTable({ tasks, total }: TaskTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-card shadow-sm ring-1 ring-border">
      <div className="flex flex-col gap-4 bg-muted/70 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[10px]">Showing 1-10 of {total}</span>
          <Button variant="ghost" size="icon-sm" aria-label="Previous page">
            <ChevronLeft className="size-5" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Next page">
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-14 px-5">Task Name</TableHead>
            <TableHead className="h-14 hidden px-5 sm:table-cell">Status</TableHead>
            <TableHead className="h-14 hidden px-5 md:table-cell">Due Date</TableHead>
            <TableHead className="h-14 hidden px-5 lg:table-cell">Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="h-[72px]">
              <TableCell className="px-5">
                <div className="flex min-w-[220px] items-center gap-3">
                  <Checkbox checked={task.status === "completed"} />
                  <Link
                    to={`/tasks/${encodeURIComponent(task.id)}`}
                    className={cn(
                      "text-base font-medium hover:text-primary",
                      task.status === "completed" &&
                        "text-muted-foreground line-through",
                    )}
                  >
                    {task.name}
                  </Link>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 sm:hidden">
                  <TaskStatusBadge status={task.status} />
                  <TaskDueDate task={task} />
                  <TaskPriorityBadge priority={task.priority} />
                </div>
              </TableCell>
              <TableCell className="hidden px-5 sm:table-cell">
                <TaskStatusBadge status={task.status} />
              </TableCell>
              <TableCell className="hidden px-5 md:table-cell">
                <TaskDueDate task={task} />
              </TableCell>
              <TableCell className="hidden px-5 lg:table-cell">
                <TaskPriorityBadge priority={task.priority} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn("gap-1.5 rounded-md px-3 py-1", statusClassName[status])}
    >
      <span className="size-1.5 rounded-full bg-current opacity-60" />
      {statusLabel[status]}
    </Badge>
  )
}

function TaskDueDate({ task }: { task: Task }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-base",
        task.dueDateTone === "danger" && "font-medium text-red-600",
        task.dueDateTone === "muted" && "text-muted-foreground",
      )}
    >
      {task.dueDateTone === "danger" && <Clock3 className="size-4" />}
      {task.dueDateLabel}
    </span>
  )
}

function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-md px-3 py-1 text-sm capitalize", priorityClassName[priority])}
    >
      {priority}
    </Badge>
  )
}
