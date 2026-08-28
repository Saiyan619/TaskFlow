import { useMutation, useQuery } from "@tanstack/react-query";
import { type Task, type TaskDashboardSummary } from "../types/task"
import { toast } from "@/components/ui/toast"

export type ApiTaskPriority = "HIGH" | "MEDIUM" | "LOW"
export const TASK_API_BASE_URL = "https://taskflow-backend-u5ja.onrender.com/api/task"

export async function getTaskDashboard() {
  const response = await fetch(TASK_API_BASE_URL)
  if (!response.ok) throw new Error("Failed to fetch dashboard tasks")

  const apiTasks = await response.json() as taskResponse[]
  const today = new Date()
  const tasks = apiTasks.map(toDisplayTask)
  const openTasks = apiTasks.filter((task) => !isCompleted(task.status))

  const summary: TaskDashboardSummary = {
    overdue: openTasks.filter((task) => isBeforeToday(task.dueDate, today)).length,
    dueToday: openTasks.filter((task) => isSameDay(task.dueDate, today)).length,
    completed: apiTasks.filter((task) => isCompleted(task.status)).length,
    total: apiTasks.length,
  }

  return {
    summary,
    tasks,
  }
}

function toDisplayTask(task: taskResponse): Task {
  return {
    id: task.id,
    name: task.title,
    status: isCompleted(task.status) ? "completed" : task.status === "IN-PROGRESS" || task.status === "in-progress" ? "in-progress" : "pending",
    dueDateLabel: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date",
    dueDateTone: isBeforeToday(task.dueDate, new Date()) ? "danger" : "default",
    priority: task.priority.toLowerCase() as Task["priority"],
  }
}

function isCompleted(status?: string) {
  return status === "COMPLETED" || status === "completed"
}

function isSameDay(value: string | undefined, reference: Date) {
  if (!value) return false
  const date = new Date(value)
  return !Number.isNaN(date.getTime()) && date.toDateString() === reference.toDateString()
}

function isBeforeToday(value: string | undefined, reference: Date) {
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const today = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate())
  return day < today
}


export interface createTaskReq{
  title: string;
  description: string;
  dueDate: string;
  status: "TODO" | "IN-PROGRESS" | "COMPLETED";
  priority: ApiTaskPriority;
}

export interface createTaskResponse{
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  createdAt: string;
  priority: ApiTaskPriority;
}

export interface updateTaskReq {
  title?: string;
  description?: string;
  status?: "TODO" | "IN-PROGRESS" | "COMPLETED";
  dueDate?: string;
  priority?: ApiTaskPriority;
}

export interface taskResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  createdAt: string;
  priority: ApiTaskPriority;
}

export const useCreateTask = () => {
  const createTask = async(taskData: createTaskReq): Promise<createTaskResponse> => {
    const response = await fetch(TASK_API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskData)
        })

        if (!response.ok){
          throw new Error("Failed to create Task");
        }
        const Task = await response.json();
        console.log("Chatroom created successfully}", Task);
        return Task;
  }
  const {mutateAsync: createATask, isPending} = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            console.log("Task created successfully");
            toast.add({ title: "Task created successfully", type: "success" });
        },
        onError: () => {
            console.error("Failed to create Task");
            toast.add({ title: "Failed to create Task", type: "error" });
        }
        
    })
    return {createATask, isPending};
}

export const useGetTasks = () => {
  const getTasks = async (): Promise<taskResponse[]> => {
    const response = await fetch(TASK_API_BASE_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    return await response.json();
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  return { tasks: data ?? [], isLoading, isError, error, refetch };
};

export const useGetTask = (id: string) => {
  const getTask = async (): Promise<taskResponse> => {
    const response = await fetch(`${TASK_API_BASE_URL}/${encodeURIComponent(id)}`);

    if (!response.ok) {
      throw new Error("Failed to fetch task");
    }

    return await response.json();
  };

  return useQuery({
    queryKey: ["tasks", id],
    queryFn: getTask,
    enabled: Boolean(id),
  });
};

export const useUpdateTask = () => {
  const updateTask = async ({ id, taskData }: { id: string; taskData: updateTaskReq }): Promise<taskResponse> => {
    const response = await fetch(`${TASK_API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    return await response.json();
  };

  const { mutateAsync: updateATask, isPending } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      toast.add({ title: "Task updated successfully", type: "success" });
    },
    onError: () => {
      toast.add({ title: "Failed to update task", type: "error" });
    },
  });

  return { updateATask, isPending };
};

export const useDeleteTask = () => {
  const deleteTask = async (id: string): Promise<void> => {
    const response = await fetch(`${TASK_API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
  };

  const { mutateAsync: deleteATask, isPending } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.add({ title: "Task deleted successfully", type: "success" });
    },
    onError: () => {
      toast.add({ title: "Failed to delete task", type: "error" });
    },
  });

  return { deleteATask, isPending };
};
