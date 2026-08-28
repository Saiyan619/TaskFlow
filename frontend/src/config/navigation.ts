import { LayoutDashboard, ListTodo, type LucideIcon } from "lucide-react"

export type NavigationItem = {
  title: string
  href: string
  icon: LucideIcon
  isActive?: boolean
}

export const dashboardNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "My Tasks",
    href: "/tasks",
    icon: ListTodo,
  },
]
