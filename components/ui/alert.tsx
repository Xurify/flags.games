import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/strings"

const alertVariants = cva(
  "relative w-full rounded-2xl border-0 px-6 py-4 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-4 gap-y-2 items-start [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current shadow-soft animate-scale-in backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-card/80 text-card-foreground border border-border/20",
        destructive:
          "text-destructive bg-destructive/5 border border-destructive/20 [&>svg]:text-destructive *:data-[slot=alert-description]:text-destructive/90",
        success:
          "text-chart-2 bg-chart-2/5 border border-chart-2/20 [&>svg]:text-chart-2 *:data-[slot=alert-description]:text-chart-2/90",
        warning:
          "text-chart-5 bg-chart-5/10 border border-chart-5/20 [&>svg]:text-chart-5 *:data-[slot=alert-description]:text-chart-5/90",
        info:
          "text-chart-3 bg-chart-3/5 border border-chart-3/20 [&>svg]:text-chart-3 *:data-[slot=alert-description]:text-chart-3/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-5 font-bold tracking-tight text-base",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-2 text-sm leading-relaxed [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }