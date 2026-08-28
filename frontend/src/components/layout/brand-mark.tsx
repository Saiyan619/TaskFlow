import { Check } from "lucide-react"

export function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-5 place-items-center rounded-full border-2 border-primary text-primary">
        <Check className="size-4" strokeWidth={2.4} />
      </span>
      <span className="text-base font-semibold tracking-normal text-primary">
        TaskFlow
      </span>
    </div>
  )
}
