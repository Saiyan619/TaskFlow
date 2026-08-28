import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react"
import { type FormEvent, type ReactNode, useState } from "react"
import { useNavigate, useParams } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useDeleteTask, useGetTask, useUpdateTask } from "../api/tasks-api"

type ApiTaskStatus = "TODO" | "IN-PROGRESS" | "COMPLETED"
type ApiTaskPriority = "HIGH" | "MEDIUM" | "LOW"

export function TaskDetail() {
  const { taskId = "" } = useParams()
  const { data: task, isLoading, isError, error, refetch } = useGetTask(taskId)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editStatus, setEditStatus] = useState<ApiTaskStatus>("TODO")
  const [editDueDate, setEditDueDate] = useState("")
  const [editPriority, setEditPriority] = useState<ApiTaskPriority>("MEDIUM")
  const { updateATask, isPending: isUpdating } = useUpdateTask()
  const { deleteATask, isPending: isDeleting } = useDeleteTask()
  const navigate = useNavigate()

  async function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await updateATask({
      id: taskId,
      taskData: {
        title: editTitle,
        description: editDescription,
        status: editStatus,
        dueDate: editDueDate,
        priority: editPriority,
      },
    })
    await refetch()
    setIsEditOpen(false)
  }

  function handleEditOpen() {
    setEditTitle(task?.title || "")
    setEditDescription(task?.description || "")
    setEditStatus(toApiStatus(task?.status))
    setEditDueDate(toDateInputValue(task?.dueDate))
    setEditPriority(toApiPriority(task?.priority))
    setIsEditOpen(true)
  }

  async function handleDelete() {
    await deleteATask(taskId)
    setIsDeleteOpen(false)
    navigate("/tasks")
  }

  if (isLoading) {
    return <div className="h-[420px] w-full max-w-[720px] animate-pulse rounded-lg bg-muted" />
  }

  if (isError || !task) {
    return (
      <div className="w-full max-w-[720px] rounded-lg bg-card p-6 text-sm shadow-sm ring-1 ring-border">
        <h1 className="font-semibold">Unable to load task</h1>
        <p className="mt-2 text-muted-foreground">{error instanceof Error ? error.message : "Task not found."}</p>
        <button type="button" onClick={() => void refetch()} className="mt-4 text-primary underline underline-offset-4">Try again</button>
      </div>
    )
  }

  const taskTitle = task.title
  const taskDescription = task.description || "No description provided."
  const taskStatus = toDisplayStatus(task.status)
  const taskPriority = toDisplayPriority(task.priority)
  const formattedDueDate = formatTaskDate(task.dueDate)
  const formattedCreatedDate = formatTaskDate(task.createdAt)

  return (
    <div className="w-full max-w-[720px] space-y-5">
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-3 text-[10px]">
        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
          <ArrowLeft className="size-3 text-foreground" />
          <span className="whitespace-nowrap">Back to Dashboard</span>
          <span>/</span>
          <span>Engineering</span>
          <span>/</span>
          <span className="text-foreground">{taskId}</span>
        </div>
        <div className="ml-auto flex shrink-0 gap-2">
          <Button variant="secondary" size="sm" className="h-6 gap-1 rounded-sm px-3 text-[10px]" onClick={handleEditOpen}>
            <Pencil className="size-3" />
            Edit Task
          </Button>
          <Button variant="destructive" size="sm" className="h-6 gap-1 rounded-sm px-3 text-[10px]" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="size-3" />
            Delete
          </Button>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-[480px] gap-5 rounded-lg p-6">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-lg font-semibold">Edit Task</DialogTitle>
            <DialogDescription className="text-xs">Update the details for {taskId}.</DialogDescription>
          </DialogHeader>
          <form id="edit-task-form" className="space-y-4" onSubmit={handleEditSubmit}>
            <label className="block space-y-1.5 text-xs font-medium">Task Title
              <Input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} className="h-9 text-sm" />
            </label>
            <label className="block space-y-1.5 text-xs font-medium">Description
              <Textarea value={editDescription} onChange={(event) => setEditDescription(event.target.value)} className="min-h-[100px] resize-y text-sm" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1.5 text-xs font-medium">Status
                <Select value={editStatus} onValueChange={(value) => { if (value) setEditStatus(value) }}><SelectTrigger className="h-9 w-full text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TODO">To Do</SelectItem><SelectItem value="IN-PROGRESS">In Progress</SelectItem><SelectItem value="COMPLETED">Completed</SelectItem></SelectContent></Select>
              </label>
              <label className="block space-y-1.5 text-xs font-medium">Due Date
                <Input type="date" value={editDueDate} onChange={(event) => setEditDueDate(event.target.value)} className="h-9 text-sm" />
              </label>
              <label className="block space-y-1.5 text-xs font-medium">Priority
                <Select value={editPriority} onValueChange={(value) => { if (value) setEditPriority(value as ApiTaskPriority) }}><SelectTrigger className="h-9 w-full text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="HIGH">High</SelectItem><SelectItem value="MEDIUM">Medium</SelectItem><SelectItem value="LOW">Low</SelectItem></SelectContent></Select>
              </label>
            </div>
          </form>
          <DialogFooter className="-mx-6 -mb-6 flex-row justify-end gap-2 rounded-b-lg px-6 py-3">
            <DialogClose render={<Button type="button" variant="ghost" size="sm" />}>Cancel</DialogClose>
            <Button type="submit" form="edit-task-form" size="sm" disabled={isUpdating}>{isUpdating ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{taskTitle}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={isDeleting} onClick={() => void handleDelete()}>
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid items-start gap-6 lg:grid-cols-[1.18fr_1fr]">
        <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
          <CardContent className="p-6">
            <div className="flex min-h-4 flex-wrap items-center gap-1.5">
              <Badge className="rounded-sm bg-blue-100 px-2 py-0.5 text-[9px] font-medium text-blue-700 hover:bg-blue-100">
                {taskStatus}
              </Badge>
              <Badge className="rounded-sm bg-orange-700 px-2 py-0.5 text-[9px] font-medium text-white hover:bg-orange-700">
                ! {taskPriority} Priority
              </Badge>
            </div>

            <h1 className="mt-4 max-w-[330px] text-[24px] font-bold leading-[1.12] tracking-tight">
              {taskTitle}
            </h1>

            <div className="mt-5 grid max-w-[520px] grid-cols-2 gap-x-8 gap-y-4 text-[10px]">
              <div>
                <p className="text-[8px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Assignee</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-slate-700 text-[8px] text-white">--</span>
                  Not assigned
                </div>
              </div>
              <div>
                <p className="text-[8px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Due Date</p>
                <p className="mt-1 flex items-center gap-1 whitespace-nowrap text-red-600"><CalendarDays className="size-3 shrink-0" />{formattedDueDate}</p>
              </div>
              <div>
                <p className="text-[8px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Created</p>
                <p className="mt-1 flex items-center gap-1 whitespace-nowrap"><Clock3 className="size-3 shrink-0" />{formattedCreatedDate}</p>
              </div>
            </div>

            <div className="my-5 border-t border-border" />
            <h2 className="text-sm font-semibold">Description</h2>
            <div className="mt-3 space-y-3 text-[11px] leading-[1.55] text-slate-700">
              <p>{taskDescription}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="size-4" />Comments &amp; Activity</h2>
            <div className="mt-6 text-[10px]">
              <Activity icon={<Clock3 className="size-3" />} title="Task created" meta={formattedCreatedDate} />
              <p className="mt-6 rounded-md bg-muted p-3 text-muted-foreground">No comments or additional activity are available for this task.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Activity({ icon, title, meta }: { icon: ReactNode; title: string; meta: string }) {
  return <div className="flex gap-3"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-violet-100 text-slate-600">{icon}</span><div><p>{title}</p><p className="mt-1 text-[8px] text-muted-foreground">{meta}</p></div></div>
}

function formatTaskDate(value?: string) {
  if (!value) return "Not provided"
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
}

function toDateInputValue(value?: string) {
  if (!value) return ""
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10)
}

function toApiStatus(status?: string): ApiTaskStatus {
  if (status === "IN-PROGRESS" || status === "in-progress") return "IN-PROGRESS"
  if (status === "COMPLETED" || status === "completed") return "COMPLETED"
  return "TODO"
}

function toDisplayStatus(status?: string) {
  if (status === "IN-PROGRESS" || status === "in-progress") return "in-progress"
  if (status === "COMPLETED" || status === "completed") return "completed"
  return "pending"
}

function toApiPriority(priority?: string): ApiTaskPriority {
  if (priority === "HIGH" || priority === "high") return "HIGH"
  if (priority === "LOW" || priority === "low") return "LOW"
  return "MEDIUM"
}

function toDisplayPriority(priority?: string) {
  if (priority === "HIGH" || priority === "high") return "high"
  if (priority === "LOW" || priority === "low") return "low"
  return "medium"
}