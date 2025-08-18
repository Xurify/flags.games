"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils/strings"

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  value?: number
  durationMs?: number
}

function Progress({
  className,
  value,
  durationMs,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          transition: durationMs ? `transform ${durationMs}ms linear` : undefined,
          willChange: "transform",
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
