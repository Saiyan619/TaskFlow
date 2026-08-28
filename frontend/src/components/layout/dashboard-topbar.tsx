import { Plus, Search } from "lucide-react"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { BrandMark } from "./brand-mark"
import { MobileSidebar } from "./app-sidebar"

export function DashboardTopbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex min-h-[59px] items-center gap-4 px-4 sm:px-8 lg:px-[30px]">
        <div className="flex items-center gap-3 lg:hidden">
          <MobileSidebar />
          <BrandMark />
        </div>

        <div className="relative hidden w-full max-w-[432px] lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search tasks"
            placeholder="Search tasks..."
            className="h-[27px] rounded-lg border-0 bg-muted pl-9 text-xs shadow-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Button
            render={<Link to="/tasks/new" />}
            className="h-[27px] gap-1.5 rounded-lg bg-primary px-4 text-[11px] font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90"
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">Create New Task</span>
          </Button>
        </div>
      </div>

      <div className="border-t border-border/60 px-4 py-3 sm:px-8 lg:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search tasks"
            placeholder="Search tasks..."
            className="h-11 rounded-xl border-0 bg-muted pl-12 text-base shadow-none"
          />
        </div>
      </div>
    </header>
  )
}
