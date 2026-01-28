"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"
import { CheckIcon, MinusIcon } from "lucide-react"

interface CheckboxProps extends CheckboxPrimitive.Root.Props {
  indeterminate?: boolean
}

function Checkbox({ className, indeterminate, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-indeterminate={indeterminate || undefined}
      className={cn(
        "border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary data-[indeterminate]:bg-primary data-[indeterminate]:text-primary-foreground data-[indeterminate]:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex size-4 items-center justify-center rounded-[4px] border transition-shadow group-has-disabled/field:opacity-50 focus-visible:ring-[2px] aria-invalid:ring-[2px] peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {indeterminate ? (
        <span className="[&>svg]:size-3.5 grid place-content-center text-current transition-none">
          <MinusIcon />
        </span>
      ) : (
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
        >
          <CheckIcon />
        </CheckboxPrimitive.Indicator>
      )}
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
