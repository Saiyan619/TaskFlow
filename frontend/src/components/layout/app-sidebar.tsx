import { dashboardNavigation } from "@/config/navigation"
import { cn } from "@/lib/utils"
import { NavLink } from "react-router"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { BrandMark } from "./brand-mark"

export function AppSidebar() {
  return (
    <aside className="hidden min-h-svh w-[215px] shrink-0 border-r border-border bg-sidebar px-3 py-8 text-sidebar-foreground lg:flex lg:flex-col">
      <BrandMark />

      <nav className="mt-8 flex flex-col gap-1">
        {dashboardNavigation.map((item) => (
          <NavLink
            key={item.title}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) => cn(
              "flex h-[30px] items-center gap-3 rounded-md px-3 text-[11px] font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger
        render={<button type="button" aria-label="Open navigation" />}
        className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted"
      >
        <span className="sr-only">Open navigation</span>
        <span className="flex w-5 flex-col gap-1" aria-hidden="true">
          <span className="h-0.5 w-full bg-foreground" />
          <span className="h-0.5 w-full bg-foreground" />
          <span className="h-0.5 w-full bg-foreground" />
        </span>
      </SheetTrigger>
      <SheetContent side="left" className="w-[215px] px-3 py-8">
        <SheetHeader className="p-0">
          <SheetTitle><BrandMark /></SheetTitle>
        </SheetHeader>
        <nav className="mt-5 flex flex-col gap-1">
          {dashboardNavigation.map((item) => (
            <SheetClose key={item.title} render={<NavLink to={item.href} end={item.href === "/"} />} className="flex h-[30px] items-center gap-3 rounded-md px-3 text-[11px] font-medium text-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <item.icon className="size-4" />
              <span>{item.title}</span>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
