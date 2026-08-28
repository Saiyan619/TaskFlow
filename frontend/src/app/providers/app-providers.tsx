import { type ReactNode } from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toast"

import { QueryProvider } from "./query-provider"

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <TooltipProvider>
        <Toaster>{children}</Toaster>
      </TooltipProvider>
    </QueryProvider>
  )
}
