import { useState } from "react"
import { CalendarDays, ClipboardList, Flag, Plus } from "lucide-react"
import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { type ApiTaskPriority, useCreateTask } from "../api/tasks-api"

type Priority = "high" | "medium" | "low"
type TaskStatus = "TODO" | "IN-PROGRESS" | "COMPLETED"

const priorities: { value: Priority; label: string; description: string }[] = [
  { value: "high", label: "High Priority", description: "Immediate action required. Blocks other tasks." },
  { value: "medium", label: "Medium Priority", description: "Standard task. Important but not blocking." },
  { value: "low", label: "Low Priority", description: "Backlog item. Address when time permits." },
]

export function CreateTask() {
  const [priority, setPriority] = useState<Priority>("medium")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [status, setStatus] = useState<TaskStatus>("TODO")
  const { createATask, isPending } = useCreateTask()
  const navigate = useNavigate()

  async function handleSubmit() {
    await createATask({ title, description, dueDate, status, priority: toApiPriority(priority) })
    navigate("/tasks")
  }

  return (
    <div className="mx-auto w-full max-w-[548px] pb-2">
      <div className="mb-6">
        <p className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.08em] text-primary">
          <ClipboardList className="size-4" /> New Task
        </p>
        <h1 className="mt-2 text-[25px] font-bold leading-none tracking-tight">Create New Task</h1>
        <p className="mt-2 max-w-[430px] text-[11px] leading-[1.45] text-muted-foreground">
          Add a new item to your workflow. Fill in the details below to ensure accurate tracking and completion.
        </p>
      </div>

      <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); void handleSubmit() }}>
        <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold"><ClipboardList className="size-4 text-primary" /> Core Details</h2>
            <div className="mt-4 space-y-3">
              <label className="block space-y-1.5 text-[9px] font-medium">Task Title <span className="text-red-500">*</span>
                <Input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g., Q3 Marketing Campaign Launch" className="h-[35px] rounded-md border-0 bg-muted px-3 text-[11px] shadow-none placeholder:text-muted-foreground/60" />
              </label>
              <label className="block space-y-1.5 text-[9px] font-medium">Description
                <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Provide detailed context, objectives, and specific deliverables..." className="min-h-[73px] resize-y rounded-md border-0 bg-muted px-3 py-2.5 text-[11px] shadow-none placeholder:text-muted-foreground/60" />
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold"><CalendarDays className="size-4 text-orange-700" /> Timeline &amp; State</h2>
              <div className="mt-4 space-y-4">
                <label className="block space-y-1.5 text-[9px] font-medium">Status
                  <Select value={status} onValueChange={(value) => { if (value) setStatus(value as TaskStatus) }}><SelectTrigger className="h-[33px] w-full rounded-md border-0 bg-muted px-3 text-[10px] shadow-none"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TODO">To Do</SelectItem><SelectItem value="IN-PROGRESS">In Progress</SelectItem><SelectItem value="COMPLETED">Completed</SelectItem></SelectContent></Select>
                </label>
                <label className="block space-y-1.5 text-[9px] font-medium">Due Date <span className="text-red-500">*</span>
                  <div className="relative"><Input required type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="h-[33px] rounded-md border-0 bg-muted px-3 text-[10px] shadow-none" /><CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" /></div>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold"><Flag className="size-4 text-red-600" /> Priority Level</h2>
              <div className="mt-4 space-y-2">
                {priorities.map((item) => (
                  <button type="button" key={item.value} onClick={() => setPriority(item.value)} className={`flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors ${priority === item.value ? "border-primary bg-primary/5" : "border-transparent bg-muted"}`}>
                    <span className={`mt-0.5 grid size-3 shrink-0 place-items-center rounded-full border ${priority === item.value ? "border-primary bg-primary" : "border-muted-foreground"}`}><span className="size-1 rounded-full bg-white" /></span>
                    <span><span className={`block text-[10px] font-medium ${priority === item.value ? "text-primary" : "text-foreground"}`}>{item.label}</span><span className="mt-0.5 block text-[8px] leading-tight text-muted-foreground">{item.description}</span></span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end gap-5 pt-2">
          <Button type="button" variant="ghost" className="h-8 px-1 text-[10px]">Cancel</Button>
          <Button type="submit" disabled={isPending} className="h-8 gap-2 rounded-md px-5 text-[10px] shadow-md shadow-primary/20"><Plus className="size-3" /> {isPending ? "Creating..." : "Create Task"}</Button>
        </div>
      </form>
    </div>
  )
}

function toApiPriority(priority: Priority): ApiTaskPriority {
  return priority.toUpperCase() as ApiTaskPriority
}