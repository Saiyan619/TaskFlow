import { DashboardLayout } from "@/app/layouts/dashboard-layout"
import { TaskDashboard } from "@/features/tasks/components/task-dashboard"
import { TaskDetail } from "@/features/tasks/components/task-detail"
import { CreateTask } from "@/features/tasks/components/create-task"
import { TaskList } from "@/features/tasks/components/task-list"
import { Navigate, Route, Routes } from "react-router"

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<TaskDashboard />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/new" element={<CreateTask />} />
        <Route path="/tasks/:taskId" element={<TaskDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  )
}

export default App
