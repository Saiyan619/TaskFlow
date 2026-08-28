import { type ReactNode } from "react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { DashboardTopbar } from "@/components/layout/dashboard-topbar"

type DashboardLayoutProps = {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="flex min-h-svh">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar />
          <main className="flex-1 px-4 py-6 sm:px-8 lg:px-[30px] lg:py-[30px]">
            <div className="mx-auto w-full max-w-[1000px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
