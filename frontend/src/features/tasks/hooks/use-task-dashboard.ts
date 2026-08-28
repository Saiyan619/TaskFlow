import { useQuery } from "@tanstack/react-query"

import { getTaskDashboard } from "../api/tasks-api"

export const taskQueryKeys = {
  all: ["tasks"] as const,
  dashboard: () => [...taskQueryKeys.all, "dashboard"] as const,
}

export function useTaskDashboard() {
  return useQuery({
    queryKey: taskQueryKeys.dashboard(),
    queryFn: getTaskDashboard,
  })
}
